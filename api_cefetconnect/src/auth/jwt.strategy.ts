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
    return { idUsuario: Number(payload.sub), email: payload.email }; // extraindo o id e o email para usar como dados do usuário autenticado.
  }
}