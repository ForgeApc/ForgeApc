-- FORGEAPC — Faction Wars weekly overhaul + Batch 3 (currency, rogue run, archaeology reuse)

-- 1. FACTION WARS: switch from monthly to weekly cadence
ALTER TABLE mogger_faction_points RENAME COLUMN month_key TO week_key;

DROP VIEW IF EXISTS mogger_faction_totals;
CREATE OR REPLACE VIEW mogger_faction_totals AS
  SELECT week_key, war_id, faction, SUM(points)::INT AS total
  FROM mogger_faction_points
  GROUP BY week_key, war_id, faction;
GRANT SELECT ON mogger_faction_totals TO anon;

-- Tracks who picked which faction in which week — needed so the weekly reward knows whose elo to bump.
CREATE TABLE IF NOT EXISTS mogger_faction_picks (
  user_id    BIGINT NOT NULL REFERENCES mogger_users(id) ON DELETE CASCADE,
  week_key   TEXT   NOT NULL,
  war_id     TEXT   NOT NULL,
  faction    TEXT   NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, week_key)
);

-- One row per week once its reward has been applied — guards against double-paying.
CREATE TABLE IF NOT EXISTS mogger_faction_week_results (
  week_key         TEXT PRIMARY KEY,
  war_id           TEXT,
  winner           TEXT,
  members_rewarded INT DEFAULT 0,
  applied_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE mogger_faction_picks        ENABLE ROW LEVEL SECURITY;
ALTER TABLE mogger_faction_week_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all" ON mogger_faction_picks;
CREATE POLICY "anon_all" ON mogger_faction_picks FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_all" ON mogger_faction_week_results;
CREATE POLICY "anon_all" ON mogger_faction_week_results FOR ALL TO anon USING (true) WITH CHECK (true);

-- Applies the end-of-week reward for a given week: the winning faction's members each get
-- +10% of their CURRENT elo. Idempotent — calling it again for an already-applied week is a no-op.
-- Called opportunistically by any client that opens the Factions screen (no cron dependency).
CREATE OR REPLACE FUNCTION apply_faction_week_reward(p_week_key TEXT)
RETURNS TABLE(winner TEXT, members_rewarded INT) AS $$
DECLARE
  v_war_id TEXT;
  v_a INT;
  v_b INT;
  v_winner TEXT;
  v_count INT;
BEGIN
  IF EXISTS (SELECT 1 FROM mogger_faction_week_results r WHERE r.week_key = p_week_key) THEN
    RETURN QUERY SELECT r.winner, r.members_rewarded FROM mogger_faction_week_results r WHERE r.week_key = p_week_key;
    RETURN;
  END IF;

  SELECT fp.war_id INTO v_war_id FROM mogger_faction_points fp WHERE fp.week_key = p_week_key LIMIT 1;
  IF v_war_id IS NULL THEN
    RETURN; -- nobody earned points that week — nothing to settle yet
  END IF;

  SELECT COALESCE(SUM(points) FILTER (WHERE faction = 'a'), 0),
         COALESCE(SUM(points) FILTER (WHERE faction = 'b'), 0)
    INTO v_a, v_b FROM mogger_faction_points WHERE week_key = p_week_key;

  v_winner := CASE WHEN v_a >= v_b THEN 'a' ELSE 'b' END;

  UPDATE mogger_users u
  SET elo = elo + ROUND(elo * 0.10)
  WHERE u.id IN (
    SELECT fpk.user_id FROM mogger_faction_picks fpk
    WHERE fpk.week_key = p_week_key AND fpk.faction = v_winner
  );
  GET DIAGNOSTICS v_count = ROW_COUNT;

  INSERT INTO mogger_faction_week_results (week_key, war_id, winner, members_rewarded)
  VALUES (p_week_key, v_war_id, v_winner, v_count);

  RETURN QUERY SELECT v_winner, v_count;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION apply_faction_week_reward(TEXT) TO anon;

-- 2. SPECTATOR BETTING MARKET — virtual currency + wager ledger
CREATE TABLE IF NOT EXISTS mogger_currency (
  user_id BIGINT PRIMARY KEY REFERENCES mogger_users(id) ON DELETE CASCADE,
  balance INT NOT NULL DEFAULT 1000
);

CREATE TABLE IF NOT EXISTS mogger_bets (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id    BIGINT REFERENCES mogger_users(id) ON DELETE CASCADE,
  side       TEXT NOT NULL,     -- "you" or "opp"
  stake      INT NOT NULL,
  odds       NUMERIC NOT NULL,
  payout     INT,
  settled    BOOLEAN DEFAULT FALSE
);

ALTER TABLE mogger_currency ENABLE ROW LEVEL SECURITY;
ALTER TABLE mogger_bets     ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all" ON mogger_currency;
CREATE POLICY "anon_all" ON mogger_currency FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_all" ON mogger_bets;
CREATE POLICY "anon_all" ON mogger_bets FOR ALL TO anon USING (true) WITH CHECK (true);

-- Atomically settles a bet and credits/debits the user's balance in one round trip.
CREATE OR REPLACE FUNCTION settle_bet(p_bet_id BIGINT, p_won BOOLEAN)
RETURNS INT AS $$
DECLARE
  v_user_id BIGINT;
  v_stake INT;
  v_odds NUMERIC;
  v_payout INT;
BEGIN
  SELECT user_id, stake, odds INTO v_user_id, v_stake, v_odds FROM mogger_bets WHERE id = p_bet_id AND settled = FALSE;
  IF v_user_id IS NULL THEN RETURN NULL; END IF;
  v_payout := CASE WHEN p_won THEN ROUND(v_stake * v_odds) ELSE 0 END;
  UPDATE mogger_bets SET settled = TRUE, payout = v_payout WHERE id = p_bet_id;
  INSERT INTO mogger_currency (user_id, balance) VALUES (v_user_id, 1000 + v_payout)
    ON CONFLICT (user_id) DO UPDATE SET balance = mogger_currency.balance + v_payout;
  RETURN v_payout;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION settle_bet(BIGINT, BOOLEAN) TO anon;

-- 3. ROGUE RUN — per-attempt log + permanently unlocked passive perks
CREATE TABLE IF NOT EXISTS mogger_rogue_runs (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id    BIGINT REFERENCES mogger_users(id) ON DELETE CASCADE,
  stage_reached INT NOT NULL DEFAULT 0,
  cleared    BOOLEAN DEFAULT FALSE,
  perks_unlocked JSONB DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS mogger_rogue_perks (
  user_id BIGINT PRIMARY KEY REFERENCES mogger_users(id) ON DELETE CASCADE,
  perks   JSONB NOT NULL DEFAULT '[]',
  best_stage INT NOT NULL DEFAULT 0
);

ALTER TABLE mogger_rogue_runs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE mogger_rogue_perks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all" ON mogger_rogue_runs;
CREATE POLICY "anon_all" ON mogger_rogue_runs FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_all" ON mogger_rogue_perks;
CREATE POLICY "anon_all" ON mogger_rogue_perks FOR ALL TO anon USING (true) WITH CHECK (true);

-- Build Archaeology reuses the existing community_builds table (already populated by "Share to
-- Community") as its historical timeline — no new table needed.
