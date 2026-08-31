import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException,Inject,  } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';
import { PERMISOS_KEY } from '../decorators/permisos.decorator';
import { Permiso } from '../models/roles/Permisos';
import { Visitante } from '../models/roles/Visitante';
import { Administrador } from '../models/roles/Administrador';
import { Becario } from '../models/roles/Becario';
import { Voluntario } from '../models/roles/Voluntario';
import { Empleado } from '../models/roles/Empleado';
import { Externo } from '../models/roles/Externo';
import { IRol } from '../interfaces/IRol';
import { type IAuthService } from '../interfaces/IAuthService';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(@Inject(Reflector) private readonly reflector: Reflector,@Inject('IAuthService') private readonly authService: IAuthService,@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permisosRequeridos = this.reflector.get<Permiso[]>(PERMISOS_KEY, context.getHandler());
    if (!permisosRequeridos || permisosRequeridos.length === 0) return true;

    const request = context.switchToHttp().getRequest<FastifyRequest & { user?: any }>();
    const tokenCookie = request.headers.cookie || '';

    const cacheKey = extraerToken(tokenCookie);
    let userData = await this.cacheManager.get<any>(cacheKey);

    if (!userData) {
      const sessionRes = await this.authService.validarSesion(request.headers as Record<string, string>);
      
      if (sessionRes.status >= 400 || !sessionRes.data?.user) {
        throw new UnauthorizedException('Sesión inválida o expirada');
      }
      
      userData = sessionRes.data.user;
      await this.cacheManager.set(cacheKey, userData);
    }

    const instanciaRol = asociarRol(userData.rol); 
    const tienePermiso = permisosRequeridos.some((permiso) => instanciaRol.tienePermiso(permiso));

    if (!tienePermiso) {
      throw new ForbiddenException('No tenés permiso para realizar esta acción');
    }

    request.user = {
        id: userData.id,
        correo: userData.email,
        nombre: userData.name,
        rol: instanciaRol,
    };

    return true;
  }
}
function asociarRol(rolId: number): IRol {
    switch (rolId) {
        case 1: return new Visitante();
        case 2: return new Administrador();
        case 3: return new Externo();
        case 4: return new Becario();
        case 5: return new Empleado();
        case 6: return new Voluntario();
        default: return new Visitante();
    }
}

function extraerToken(cookieString: string): string {
  const match = cookieString.match(/better-auth\.session_token=([^;]+)/);
  return match ? match[1] : cookieString; 
}