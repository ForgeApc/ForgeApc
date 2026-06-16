-- FORGEAPC — Faction Wars + Constraint Gauntlet

-- 1. FACTION WARS — points ledger (one row per ranked win that earns faction points)
CREATE TABLE IF NOT EXISTS mogger_faction_points (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id    BIGINT REFERENCES mogger_users(id) ON DELETE SET NULL,
  month_key  TEXT   NOT NULL, -- e.g. "2026-06"
  war_id     TEXT   NOT NULL, -- e.g. "cpu-brand", "cooling"
  faction    TEXT   NOT NULL, -- "a" or "b"
  points     INT    NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS mogger_faction_points_month_war
  ON mogger_faction_points (month_key, war_id);

-- Pre-aggregated totals per month/war/faction, queried by the dominance bar.
CREATE OR REPLACE VIEW mogger_faction_totals AS
  SELECT month_key, war_id, faction, SUM(points)::INT AS total
  FROM mogger_faction_points
  GROUP BY month_key, war_id, faction;

-- 2. CONSTRAINT GAUNTLET — score ledger (one row per attempt)
CREATE TABLE IF NOT EXISTS mogger_gauntlet_scores (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  user_id       BIGINT REFERENCES mogger_users(id) ON DELETE SET NULL,
  user_name     TEXT,
  day_key       TEXT NOT NULL, -- e.g. "2026-06-16"
  constraint_id TEXT NOT NULL,
  use_case      TEXT,
  budget        INT,
  score         INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS mogger_gauntlet_scores_day
  ON mogger_gauntlet_scores (day_key);
CREATE INDEX IF NOT EXISTS mogger_gauntlet_scores_score
  ON mogger_gauntlet_scores (score DESC);

-- Row-Level Security — same light, anon-everything model as the rest of this app.
ALTER TABLE mogger_faction_points  ENABLE ROW LEVEL SECURITY;
ALTER TABLE mogger_gauntlet_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_all" ON mogger_faction_points;
CREATE POLICY "anon_all" ON mogger_faction_points
  FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_all" ON mogger_gauntlet_scores;
CREATE POLICY "anon_all" ON mogger_gauntlet_scores
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- Views run with the privileges of the underlying tables for the anon role here,
-- but grant explicitly so PostgREST always exposes it.
GRANT SELECT ON mogger_faction_totals TO anon;
