import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

const NIVEAUX = ['débutant', 'intermédiaire', 'avancé'] as const;
const OBJECTIFS = ['endurance', 'force', 'perte de poids', 'bien-être'] as const;

export class UpsertProfileDto {
  @ApiProperty({ example: 75.5, description: 'Poids en kg' })
  @IsNumber()
  @Min(20)
  @Max(300)
  poids_kg!: number;

  @ApiProperty({ example: 175, description: 'Taille en cm' })
  @IsInt()
  @Min(100)
  @Max(250)
  taille_cm!: number;

  @ApiProperty({ enum: NIVEAUX, example: 'intermédiaire' })
  @IsIn(NIVEAUX)
  niveau_activite!: string;

  @ApiProperty({ enum: OBJECTIFS, example: 'endurance' })
  @IsIn(OBJECTIFS)
  objectif_principal!: string;

  @ApiPropertyOptional({ example: 'Haltères, tapis de course', description: 'Équipement disponible' })
  @IsOptional()
  @IsString()
  equipement_disponible?: string;

  @ApiPropertyOptional({ example: 60, description: 'FC au repos (bpm)' })
  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(120)
  hr_rest?: number;

  @ApiPropertyOptional({ example: 185, description: 'FC max (bpm)' })
  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(250)
  hr_max?: number;

  @ApiPropertyOptional({ example: 130, description: 'FC moyenne à l\'effort (bpm)' })
  @IsOptional()
  @IsInt()
  @Min(50)
  @Max(220)
  hr_avg?: number;

  @ApiPropertyOptional({ example: 18.5, description: '% masse grasse' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(70)
  body_fat_pct?: number;

  @ApiPropertyOptional({ example: 3, description: 'Fréquence d\'entraînement (séances/semaine)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(14)
  frequence_entrainement?: number;

  @ApiPropertyOptional({ example: '2 ans de musculation' })
  @IsOptional()
  @IsString()
  experience_sportive?: string;
}
