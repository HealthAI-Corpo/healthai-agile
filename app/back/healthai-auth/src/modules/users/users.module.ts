import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Utilisateur } from './utilisateur.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Utilisateur])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
