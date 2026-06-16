-- FORGEAPC — Faction Wars: contribution-based ELO reward (replaces flat +10%)
--
-- New formula:
--   contribution_pct = user_wins / total_faction_wins          (decimal)
--   cap              = 0.05 × (total_contributors / 10)        (decimal)
--   elo_bonus        = ROUND(elo × LEAST(contribution_pct, cap))
--
-- Example: 50 contributors → cap = 25%. Player who contributed 8% wins → +8% elo.
-- Player who contributed 30% → capped at +25% elo.
-- Players who picked the winning faction but earned 0 points get no bonus.

CREATE OR REPLACE FUNCTION apply_faction_week_reward(p_week_key TEXT)
RETURNS TABLE(winner TEXT, members_rewarded INT) AS $$
DECLARE
  v_war_id             TEXT;
  v_a                  INT;
  v_b                  INT;
  v_winner             TEXT;
  v_total_wins         INT;
  v_total_contributors INT;
  v_cap                NUMERIC;
  v_contrib_pct        NUMERIC;
  v_bonus_pct          NUMERIC;
  v_elo_bonus          INT;
  v_count              INT;
  r                    RECORD;
BEGIN
  -- Idempotent: return already-stored result if the week was previously settled.
  IF EXISTS (SELECT 1 FROM mogger_faction_week_results wr WHERE wr.week_key = p_week_key) THEN
    RETURN QUERY
      SELECT wr.winner, wr.members_rewarded
      FROM mogger_faction_week_results wr
      WHERE wr.week_key = p_week_key;
    RETURN;
  END IF;

  SELECT fp.war_id INTO v_war_id
  FROM mogger_faction_points fp
  WHERE fp.week_key = p_week_key
  LIMIT 1;

  IF v_war_id IS NULL THEN
    RETURN; -- no activity this week yet — nothing to settle
  END IF;

  SELECT
    COALESCE(SUM(points) FILTER (WHERE faction = 'a'), 0),
    COALESCE(SUM(points) FILTER (WHERE faction = 'b'), 0)
  INTO v_a, v_b
  FROM mogger_faction_points
  WHERE week_key = p_week_key;

  v_winner      := CASE WHEN v_a >= v_b THEN 'a' ELSE 'b' END;
  v_total_wins  := CASE WHEN v_winner = 'a' THEN v_a ELSE v_b END;

  SELECT COUNT(*) INTO v_total_contributors
  FROM mogger_faction_picks
  WHERE week_key = p_week_key AND faction = v_winner;

  -- cap expressed as a decimal fraction, e.g. 0.25 = 25%
  v_cap := 0.05 * (v_total_contributors::NUMERIC / 10.0);

  v_count := 0;

  FOR r IN
    SELECT
      fpk.user_id,
      u.elo,
      COALESCE(SUM(fp.points), 0)::INT AS user_wins
    FROM mogger_faction_picks fpk
    JOIN mogger_users u ON u.id = fpk.user_id
    LEFT JOIN mogger_faction_points fp
      ON  fp.user_id   = fpk.user_id
      AND fp.week_key  = p_week_key
      AND fp.faction   = v_winner
    WHERE fpk.week_key = p_week_key
      AND fpk.faction  = v_winner
    GROUP BY fpk.user_id, u.elo
  LOOP
    IF v_total_wins > 0 THEN
      v_contrib_pct := r.user_wins::NUMERIC / v_total_wins::NUMERIC;
    ELSE
      v_contrib_pct := 0;
    END IF;

    v_bonus_pct  := LEAST(v_contrib_pct, v_cap);
    v_elo_bonus  := ROUND(r.elo * v_bonus_pct)::INT;

    IF v_elo_bonus > 0 THEN
      UPDATE mogger_users SET elo = elo + v_elo_bonus WHERE id = r.user_id;
      v_count := v_count + 1;
    END IF;
  END LOOP;

  INSERT INTO mogger_faction_week_results (week_key, war_id, winner, members_rewarded)
  VALUES (p_week_key, v_war_id, v_winner, v_count);

  RETURN QUERY SELECT v_winner, v_count;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION apply_faction_week_reward(TEXT) TO anon;
