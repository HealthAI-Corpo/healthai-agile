-- Migration US 2 : ajout des champs cardiaques, masse grasse et équipement
-- À exécuter sur les bases existantes (Sprint 2 → Sprint 3)
ALTER TABLE profil_sante
    ADD COLUMN IF NOT EXISTS equipement_disponible TEXT,
    ADD COLUMN IF NOT EXISTS hr_rest               INTEGER,
    ADD COLUMN IF NOT EXISTS hr_max                INTEGER,
    ADD COLUMN IF NOT EXISTS hr_avg                INTEGER,
    ADD COLUMN IF NOT EXISTS body_fat_pct          NUMERIC(5, 2);
