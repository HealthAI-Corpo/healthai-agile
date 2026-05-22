import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProfilSante } from './profil-sante.entity';
import { ProfileService } from './profile.service';
import { UpsertProfileDto } from './dto/upsert-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

const VALID_DTO: UpsertProfileDto = {
  poids_kg: 75,
  taille_cm: 175,
  niveau_activite: 'intermédiaire',
  objectif_principal: 'endurance',
};

const USER_ID = 1;

function makeRepo(overrides: Partial<Record<keyof ReturnType<typeof mockRepo>, jest.Mock>> = {}) {
  const base = mockRepo();
  return { ...base, ...overrides };
}

function mockRepo() {
  return {
    findOne: jest.fn(),
    create: jest.fn((data) => ({ ...data })),
    save: jest.fn((entity) => Promise.resolve({ id_profil: 1, ...entity })),
  };
}

describe('ProfileService', () => {
  let service: ProfileService;
  let repo: ReturnType<typeof mockRepo>;

  beforeEach(async () => {
    repo = mockRepo();
    const module = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: getRepositoryToken(ProfilSante), useValue: repo },
      ],
    }).compile();

    service = module.get(ProfileService);
  });

  // ── getProfile ────────────────────────────────────────────────────────────

  describe('getProfile', () => {
    it('retourne le profil existant', async () => {
      const profil = { id_profil: 1, id_utilisateur: USER_ID, poids_kg: 75 };
      repo.findOne.mockResolvedValue(profil);

      const result = await service.getProfile(USER_ID);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id_utilisateur: USER_ID } });
      expect(result).toEqual(profil);
    });

    it('lève NotFoundException si aucun profil', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.getProfile(USER_ID)).rejects.toThrow(NotFoundException);
    });
  });

  // ── createProfile ─────────────────────────────────────────────────────────

  describe('createProfile', () => {
    it('crée le profil et calcule l\'IMC', async () => {
      repo.findOne.mockResolvedValue(null);

      const result = await service.createProfile(USER_ID, VALID_DTO);

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ id_utilisateur: USER_ID, imc: 24.5 }),
      );
      expect(repo.save).toHaveBeenCalled();
      expect(result.imc).toBe(24.5);
    });

    it('lève ConflictException si un profil existe déjà', async () => {
      repo.findOne.mockResolvedValue({ id_profil: 1 });
      await expect(service.createProfile(USER_ID, VALID_DTO)).rejects.toThrow(ConflictException);
    });
  });

  // ── updateProfile ─────────────────────────────────────────────────────────

  describe('updateProfile', () => {
    it('crée un profil si aucun n\'existe (upsert)', async () => {
      repo.findOne.mockResolvedValue(null);

      const result = await service.updateProfile(USER_ID, VALID_DTO);

      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('met à jour le profil existant sans toucher aux autres champs', async () => {
      const existing = {
        id_profil: 1,
        id_utilisateur: USER_ID,
        poids_kg: 80,
        taille_cm: 175,
        hr_max: 185,
        niveau_activite: 'avancé',
        objectif_principal: 'force',
      };
      repo.findOne.mockResolvedValue(existing);

      // PATCH partiel : seulement hr_max
      const patch: UpdateProfileDto = { hr_max: 190 };

      await service.updateProfile(USER_ID, patch);

      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({ hr_max: 190, id_profil: 1, poids_kg: 80 }),
      );
    });

    it('PATCH partiel ne recalcule pas l\'IMC si poids/taille absents du patch', async () => {
      const existing = {
        id_profil: 1,
        id_utilisateur: USER_ID,
        poids_kg: 80,
        taille_cm: 175,
        imc: 26.1,
        hr_max: 185,
      };
      repo.findOne.mockResolvedValue(existing);

      const patch: UpdateProfileDto = { hr_max: 190 };
      const result = await service.updateProfile(USER_ID, patch);

      // IMC doit rester calculé depuis poids/taille existants (80kg/175cm = 26.1)
      expect(result.imc).toBe(26.1);
    });
  });

  // ── computeImc ────────────────────────────────────────────────────────────

  describe('calcul IMC', () => {
    const cases: [number, number, number][] = [
      [75, 175, 24.5],
      [60, 160, 23.4],
      [100, 180, 30.9],
    ];

    it.each(cases)('%dkg / %dcm → IMC %s', async (poids, taille, expected) => {
      repo.findOne.mockResolvedValue(null);
      const dto = { ...VALID_DTO, poids_kg: poids, taille_cm: taille };
      const result = await service.createProfile(USER_ID, dto);
      expect(result.imc).toBe(expected);
    });
  });
});
