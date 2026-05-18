// src/helpers/guards/api-key-or-jwt.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyOrJwtGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // Verifica API Key primeiro
    const apiKey = request.headers['x-api-key'] || request.query.api_key;
    
    if (apiKey && apiKey === process.env.API_KEY) {
      return true;
    }
    throw new UnauthorizedException('Acesso não autorizado. Forneça um token JWT válido ou API Key');
  }
}