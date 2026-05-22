import { PartialType } from '@nestjs/swagger';
import { UpsertProfileDto } from './upsert-profile.dto';

export class UpdateProfileDto extends PartialType(UpsertProfileDto) {}
