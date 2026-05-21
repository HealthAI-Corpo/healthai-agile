-- ============================================================
-- Migration : Ajout table Seance (POC uniquement)
-- ============================================================
-- Cette table est créée spécifiquement pour le POC (Proof of Concept).
-- Elle servira à capturer les données des séances d'entraînement avec
-- des métriques détaillées (BPM, consommation d'eau, etc.) durant la phase de test.
-- À terme, ces données doivent être intégrées ou consolidées dans le modèle 
-- de données final du projet.
-- ============================================================

CREATE TABLE seance (
    id_seance              SERIAL PRIMARY KEY,
    id_utilisateur         INTEGER       NOT NULL REFERENCES utilisateur (id_utilisateur) ON DELETE CASCADE,
    duree_seance_minutes   NUMERIC(5, 1) NOT NULL,
    bpm_moyen              INTEGER       NOT NULL,
    consommation_eau_ml    NUMERIC(7, 2) NOT NULL,
    bpm_max                INTEGER       NOT NULL,
    type_sport             VARCHAR(50)   NOT NULL CHECK (type_sport IN ('Cardio', 'HIIT', 'Strength', 'Yoga')),
    calories_brulees       NUMERIC(6, 1),
    date_seance            TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les requêtes courantes
CREATE INDEX ix_seance_id_utilisateur ON seance (id_utilisateur);
CREATE INDEX ix_seance_date_seance ON seance (date_seance);
