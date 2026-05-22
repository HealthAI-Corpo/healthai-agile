import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';
import { ProfilSante } from '../src/modules/profile/profil-sante.entity';
import { ProfileModule } from '../src/modules/profile/profile.module';

const FAKE_USER_ID = 42;

// Remplace JwtAuthGuard : injecte directement l'utilisateur de test
class MockJwtGuard {
  canActivate(ctx: import('@nestjs/common').ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    req.user = { id: FAKE_USER_ID, email: 'test@healthai.fr' };
    return true;
  }
}

const VALID_PAYLOAD = {
  poids_kg: 75,
  taille_cm: 175,
  niveau_activite: 'intermédiaire',
  objectif_principal: 'endurance',
};

describe('Profile (e2e)', () => {
  let app: INestApplication;
  let repo: Repository<ProfilSante>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [ProfilSante],
          synchronize: true,
        }),
        ProfileModule,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtGuard)
      .compile();

    app = module.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    repo = module.get(getRepositoryToken(ProfilSante));
  });

  afterAll(() => app.close());

  afterEach(() => repo.clear());

  // ── GET /api/v1/profile ──────────────────────────────────────────────────

  describe('GET /api/v1/profile', () => {
    it('404 si aucun profil', () =>
      request(app.getHttpServer()).get('/api/v1/profile').expect(404),
    );

    it('200 avec le profil existant', async () => {
      await repo.save(repo.create({ ...VALID_PAYLOAD, id_utilisateur: FAKE_USER_ID, imc: 24.5 }));

      const { body } = await request(app.getHttpServer())
        .get('/api/v1/profile')
        .expect(200);

      expect(body.id_utilisateur).toBe(FAKE_USER_ID);
      expect(body.poids_kg).toBe(VALID_PAYLOAD.poids_kg);
    });
  });

  // ── POST /api/v1/profile ─────────────────────────────────────────────────

  describe('POST /api/v1/profile', () => {
    it('201 crée le profil avec les champs obligatoires', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/v1/profile')
        .send(VALID_PAYLOAD)
        .expect(201);

      expect(body.id_utilisateur).toBe(FAKE_USER_ID);
      expect(body.imc).toBe(24.5);
      expect(body.hr_rest).toBeNull();
    });

    it('201 crée le profil complet avec données cardiaques et masse grasse', async () => {
      const full = {
        ...VALID_PAYLOAD,
        hr_rest: 60,
        hr_max: 185,
        hr_avg: 130,
        body_fat_pct: 18.5,
        equipement_disponible: 'Haltères',
      };

      const { body } = await request(app.getHttpServer())
        .post('/api/v1/profile')
        .send(full)
        .expect(201);

      expect(body.hr_max).toBe(185);
      expect(body.body_fat_pct).toBe(18.5);
    });

    it('409 si un profil existe déjà', async () => {
      await repo.save(repo.create({ ...VALID_PAYLOAD, id_utilisateur: FAKE_USER_ID, imc: 24.5 }));

      await request(app.getHttpServer())
        .post('/api/v1/profile')
        .send(VALID_PAYLOAD)
        .expect(409);
    });

    it('400 si niveau_activite absent (champ obligatoire)', () =>
      request(app.getHttpServer())
        .post('/api/v1/profile')
        .send({ poids_kg: 75, taille_cm: 175, objectif_principal: 'endurance' })
        .expect(400),
    );

    it('400 si objectif_principal invalide', () =>
      request(app.getHttpServer())
        .post('/api/v1/profile')
        .send({ ...VALID_PAYLOAD, objectif_principal: 'mauvaise-valeur' })
        .expect(400),
    );

    it('400 si niveau_activite invalide', () =>
      request(app.getHttpServer())
        .post('/api/v1/profile')
        .send({ ...VALID_PAYLOAD, niveau_activite: 'expert' })
        .expect(400),
    );
  });

  // ── PATCH /api/v1/profile ────────────────────────────────────────────────

  describe('PATCH /api/v1/profile', () => {
    it('200 met à jour le profil existant', async () => {
      await repo.save(repo.create({ ...VALID_PAYLOAD, id_utilisateur: FAKE_USER_ID, imc: 24.5 }));

      const { body } = await request(app.getHttpServer())
        .patch('/api/v1/profile')
        .send({ ...VALID_PAYLOAD, hr_max: 190 })
        .expect(200);

      expect(body.hr_max).toBe(190);
      expect(body.niveau_activite).toBe('intermédiaire');
    });

    it('200 crée le profil s\'il n\'existait pas (upsert)', async () => {
      const { body } = await request(app.getHttpServer())
        .patch('/api/v1/profile')
        .send(VALID_PAYLOAD)
        .expect(200);

      expect(body.id_utilisateur).toBe(FAKE_USER_ID);
    });

    it('400 si poids_kg absent', () =>
      request(app.getHttpServer())
        .patch('/api/v1/profile')
        .send({ taille_cm: 175, niveau_activite: 'débutant', objectif_principal: 'force' })
        .expect(400),
    );
  });
});
