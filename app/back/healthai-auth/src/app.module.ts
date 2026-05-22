import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Utilisateur } from './modules/users/utilisateur.entity';
import { UsersModule } from './modules/users/users.module';
import { ProfilSante } from './modules/profile/profil-sante.entity';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST', 'localhost'),
        port: config.get<number>('DATABASE_PORT', 5432),
        username: config.get('DATABASE_USER', 'postgres'),
        password: config.get('DATABASE_PASSWORD', 'postgres'),
        database: config.get('DATABASE_NAME', 'healthai'),
        entities: [Utilisateur, ProfilSante],
        // synchronize: false — la BDD existe déjà via le schéma SQL fourni
        synchronize: false,
      }),
    }),

    UsersModule,
    AuthModule,
    ProfileModule,
  ],
})
export class AppModule {}
