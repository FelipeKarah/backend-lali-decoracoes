// src/shared/interceptors/image-url.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ImageUrlHelper } from '../helpers/image-url.helper'

@Injectable()
export class ImageUrlInterceptor implements NestInterceptor {
  constructor(private imageUrlHelper: ImageUrlHelper) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const baseUrl = `${request.protocol}://${request.get('host')}`

    return next.handle().pipe(
      map((data) => {
        // Se for um objeto com data (pagination pattern)
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'total' in data
        ) {
          return {
            ...data,
            data: this.imageUrlHelper.processImagesList(data.data, baseUrl),
          }
        }

        // Se for um array
        if (Array.isArray(data)) {
          return this.imageUrlHelper.processImagesList(data, baseUrl)
        }

        // Se for um objeto
        if (data && typeof data === 'object') {
          return this.imageUrlHelper.processImages(data, baseUrl)
        }

        return data
      }),
    )
  }
}
