import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfilSante } from './profil-sante.entity';
import { UpsertProfileDto } from './dto/upsert-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

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

  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<ProfilSante> {
    let profil = await this.repo.findOne({ where: { id_utilisateur: userId } });

    // Ne merger que les propriétés définies dans le DTO
    const patch = Object.fromEntries(
      Object.entries(dto).filter(([, v]) => v !== undefined),
    );

    if (!profil) {
      profil = this.repo.create({ ...patch, id_utilisateur: userId });
    } else {
      Object.assign(profil, patch);
    }

    // Recalcule l'IMC seulement si poids et taille sont disponibles
    const poids = profil.poids_kg ? Number(profil.poids_kg) : null;
    const taille = profil.taille_cm ?? null;
    if (poids && taille) {
      profil.imc = this.computeImc(poids, taille);
    }

    return this.repo.save(profil);
  }

  private computeImc(poids_kg: number, taille_cm: number): number {
    const taille_m = taille_cm / 100;
    return Math.round((poids_kg / (taille_m * taille_m)) * 10) / 10;
  }
}
