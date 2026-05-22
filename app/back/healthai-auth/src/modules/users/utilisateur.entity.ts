import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('utilisateur')
@Index('ix_utilisateur_id_utilisateur', ['id_utilisateur'])
export class Utilisateur {
  @PrimaryGeneratedColumn()
  id_utilisateur: number;

  @Column({ type: 'varchar', length: 50 })
  nom: string;

  @Column({ type: 'varchar', length: 50 })
  prenom: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index('ix_utilisateur_email', { unique: true })
  email: string;

  @Column({ type: 'date' })
  date_de_naissance: string;

  @Column({ type: 'varchar', length: 50 })
  genre: string;

  @Column({ type: 'varchar', length: 255 })
  mot_de_passe_hash: string;

  @Column({ type: 'varchar', length: 50, default: 'Freemium' })
  type_abonnement: string;

  @CreateDateColumn({ type: 'timestamp' })
  date_inscription: Date;
}
