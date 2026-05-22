import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpsertProfileDto } from './dto/upsert-profile.dto';
import { ProfileService } from './profile.service';

interface JwtUser { id: number; email: string }

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer le profil sportif de l\'utilisateur connecté' })
  getProfile(@Req() req: Request) {
    const user = req.user as JwtUser;
    return this.profileService.getProfile(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer le profil sportif' })
  createProfile(@Req() req: Request, @Body() dto: UpsertProfileDto) {
    const user = req.user as JwtUser;
    return this.profileService.createProfile(user.id, dto);
  }

  @Patch()
  @ApiOperation({ summary: 'Mettre à jour le profil sportif (upsert)' })
  updateProfile(@Req() req: Request, @Body() dto: UpsertProfileDto) {
    const user = req.user as JwtUser;
    return this.profileService.updateProfile(user.id, dto);
  }
}
