import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const cookie = request.headers.cookie || '';
    const authHeader = request.headers.authorization || '';

    if (!cookie.includes('better-auth.session_token') && !authHeader) {
      throw new UnauthorizedException('No se encontró un token de sesión');
    }

    return true;
  }
}