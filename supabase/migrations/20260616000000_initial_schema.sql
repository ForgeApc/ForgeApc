-- FORGEAPC — initial schema

-- 1. USERS + ELO
CREATE TABLE IF NOT EXISTS mogger_users (
  id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name  TEXT NOT NULL,
  hash  TEXT NOT NULL,
  elo   INT  NOT NULL DEFAULT 100,
  crank TEXT
);

-- 2. SAVED BUILDS
CREATE TABLE IF NOT EXISTS mogger_builds (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES mogger_users(id) ON DELETE CASCADE,
  build_id   TEXT   NOT NULL,
  name       TEXT,
  data       JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS mogger_builds_user_build
  ON mogger_builds (user_id, build_id);

-- 3. COMMUNITY BUILDS
CREATE TABLE IF NOT EXISTS community_builds (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id    BIGINT REFERENCES mogger_users(id) ON DELETE SET NULL,
  user_name  TEXT,
  title      TEXT,
  use_case   TEXT,
  budget     INT,
  total      INT,
  perf_score NUMERIC,
  parts      JSONB
);

-- 4. FEEDBACK
CREATE TABLE IF NOT EXISTS feedback (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_name  TEXT,
  user_id    TEXT,
  message    TEXT NOT NULL,
  image      TEXT
);

-- Row-Level Security
ALTER TABLE mogger_users     ENABLE ROW LEVEL SECURITY;
ALTER TABLE mogger_builds    ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_builds ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback         ENABLE ROW LEVEL SECURITY;

-- Policies — drop first so re-running is safe
DROP POLICY IF EXISTS "anon_all" ON mogger_users;
CREATE POLICY "anon_all" ON mogger_users
  FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_all" ON mogger_builds;
CREATE POLICY "anon_all" ON mogger_builds
  FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_all" ON community_builds;
CREATE POLICY "anon_all" ON community_builds
  FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_all" ON feedback;
CREATE POLICY "anon_all" ON feedback
  FOR ALL TO anon USING (true) WITH CHECK (true);
