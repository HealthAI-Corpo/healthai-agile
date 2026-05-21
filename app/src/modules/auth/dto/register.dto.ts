import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Dupont' })
  @IsString()
  nom!: string;

  @ApiProperty({ example: 'Jean' })
  @IsString()
  prenom!: string;

  @ApiProperty({ example: 'jean.dupont@healthai.fr' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '1990-05-15' })
  @IsDateString()
  date_de_naissance!: string;

  @ApiProperty({ example: 'Homme', enum: ['Homme', 'Femme', 'Autre'] })
  @IsIn(['Homme', 'Femme', 'Autre'])
  genre!: string;

  @ApiProperty({ example: 'MotDePasse123!', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  mot_de_passe!: string;

  @ApiPropertyOptional({ example: 'Freemium', enum: ['Freemium', 'Premium'] })
  @IsOptional()
  @IsIn(['Freemium', 'Premium'])
  type_abonnement?: string;
}
