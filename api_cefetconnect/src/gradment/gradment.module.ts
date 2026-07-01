import { Module } from '@nestjs/common';
import { GradmentService } from './gradment.service.js';
import { GradmentController } from './gradment.controller.js';
import { UsuarioModule } from '../aluno/usuario.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsuarioModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [GradmentController],
  providers: [GradmentService],
  exports: [GradmentService],
})

export class GradmentModule {}