import { Column, Entity, Index, PrimaryGeneratedColumn, ValueTransformer } from 'typeorm';

const numericTransformer: ValueTransformer = {
  to: (v: number | null) => v,
  from: (v: string | null) => (v === null || v === undefined ? null : parseFloat(v)),
};

@Entity('profil_sante')
@Index('ix_profil_sante_id_profil', ['id_profil'])
export class ProfilSante {
  @PrimaryGeneratedColumn()
  id_profil: number;

  @Column({ type: 'integer', unique: true })
  id_utilisateur: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true, transformer: numericTransformer })
  poids_kg: number | null;

  @Column({ type: 'integer', nullable: true })
  taille_cm: number | null;

  @Column({ type: 'numeric', precision: 4, scale: 1, nullable: true, transformer: numericTransformer })
  imc: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  niveau_activite: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  objectif_principal: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  experience_sportive: string | null;

  @Column({ type: 'integer', nullable: true })
  frequence_entrainement: number | null;

  @Column({ type: 'text', nullable: true })
  equipement_disponible: string | null;

  @Column({ type: 'integer', nullable: true })
  hr_rest: number | null;

  @Column({ type: 'integer', nullable: true })
  hr_max: number | null;

  @Column({ type: 'integer', nullable: true })
  hr_avg: number | null;

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true, transformer: numericTransformer })
  body_fat_pct: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  type_maladie: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  severite: string | null;

  @Column({ type: 'text', nullable: true })
  restrictions_alimentaires: string | null;

  @Column({ type: 'text', nullable: true })
  allergies: string | null;
}
