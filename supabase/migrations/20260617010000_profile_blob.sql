-- FORGEAPC — user profile blob: stores history, streaks, rivals, ghosts, daily log, rogue rewards
ALTER TABLE mogger_users ADD COLUMN IF NOT EXISTS profile JSONB DEFAULT '{}';
