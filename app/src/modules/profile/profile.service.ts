import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfilSante } from './profil-sante.entity';
import { UpsertProfileDto } from './dto/upsert-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfilSante)
    private readonly repo: Repository<ProfilSante>,
  ) {}

  async getProfile(userId: number): Promise<ProfilSante> {
    const profil = await this.repo.findOne({ where: { id_utilisateur: userId } });
    if (!profil) throw new NotFoundException('Profil introuvable');
    return profil;
  }

  async createProfile(userId: number, dto: UpsertProfileDto): Promise<ProfilSante> {
    const existing = await this.repo.findOne({ where: { id_utilisateur: userId } });
    if (existing) throw new ConflictException('Un profil existe déjà — utilisez PATCH pour le modifier');

    const imc = this.computeImc(dto.poids_kg, dto.taille_cm);
    const profil = this.repo.create({ ...dto, id_utilisateur: userId, imc });
    return this.repo.save(profil);
  }

  async updateProfile(userId: number, dto: UpsertProfileDto): Promise<ProfilSante> {
    let profil = await this.repo.findOne({ where: { id_utilisateur: userId } });

    const imc = this.computeImc(dto.poids_kg, dto.taille_cm);

    if (!profil) {
      profil = this.repo.create({ ...dto, id_utilisateur: userId, imc });
    } else {
      Object.assign(profil, dto, { imc });
    }

    return this.repo.save(profil);
  }

  private computeImc(poids_kg: number, taille_cm: number): number {
    const taille_m = taille_cm / 100;
    return Math.round((poids_kg / (taille_m * taille_m)) * 10) / 10;
  }
}
