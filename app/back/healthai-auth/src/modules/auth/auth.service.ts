import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Utilisateur } from '../users/utilisateur.entity';

type SafeUser = Omit<Utilisateur, 'mot_de_passe_hash'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Un compte existe déjà avec cet email');
    }

    const mot_de_passe_hash = await bcrypt.hash(dto.mot_de_passe, 12);

    const user = await this.usersService.create({
      nom: dto.nom,
      prenom: dto.prenom,
      email: dto.email,
      date_de_naissance: dto.date_de_naissance,
      genre: dto.genre,
      mot_de_passe_hash,
      type_abonnement: dto.type_abonnement ?? 'Freemium',
    });

    return this.buildResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Identifiants invalides');

    const valid = await bcrypt.compare(dto.mot_de_passe, user.mot_de_passe_hash);
    if (!valid) throw new UnauthorizedException('Identifiants invalides');

    return this.buildResponse(user);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private buildResponse(user: Utilisateur) {
    const payload = { sub: user.id_utilisateur, email: user.email };

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET ?? 'fallback_dev_secret',
      expiresIn: Number(process.env.JWT_EXPIRES_IN ?? 900),
    });

    const { mot_de_passe_hash: _, ...safeUser } = user;
    return { access_token, token_type: 'bearer', utilisateur: safeUser };
  }
}
