import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilisateur } from './utilisateur.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Utilisateur)
    private readonly repo: Repository<Utilisateur>,
  ) {}

  async findByEmail(email: string): Promise<Utilisateur | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<Utilisateur | null> {
    return this.repo.findOne({ where: { id_utilisateur: id } });
  }

  async create(data: Partial<Utilisateur>): Promise<Utilisateur> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }
}
