import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PostRateLimitGuard implements CanActivate {
  private readonly userPostCounts = new Map<number, { count: number; lastReset: number }>();
  private readonly LIMIT = 5; // 5 posts por hora
  private readonly TIME_WINDOW = 60 * 60 * 1000; // 1 hora em milissegundos

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.idUsuario;

    if (!userId) {
      return false;
    }

    const now = Date.now();
    const userStats = this.userPostCounts.get(userId);

    if (!userStats) {
      this.userPostCounts.set(userId, { count: 1, lastReset: now });
      return true;
    }

    // Resetar contador se passou o tempo limite
    if (now - userStats.lastReset > this.TIME_WINDOW) {
      this.userPostCounts.set(userId, { count: 1, lastReset: now });
      return true;
    }

    // Verificar se excedeu o limite
    if (userStats.count >= this.LIMIT) {
      throw new ForbiddenException(
        `Você atingiu o limite de ${this.LIMIT} posts por hora. Tente novamente mais tarde.`
      );
    }

    // Incrementar contador
    userStats.count++;
    return true;
  }
}
