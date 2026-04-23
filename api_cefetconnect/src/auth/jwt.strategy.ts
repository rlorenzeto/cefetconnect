import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// Esta classe é responsável por validar o token JWT em cada requisição
@Injectable() 
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: false, 
      secretOrKey: process.env.JWT_SECRET as string, 
    });
  }

  async validate(payload: any) { 
    return { matricula: payload.sub, email: payload.email }; // extraindo a matrícula e o email para usar como dados do usuário autenticado.
  }
}