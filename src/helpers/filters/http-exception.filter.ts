import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const messages = [] as Array<string>;

    const { message } = exception.getResponse() as { message: Array<string> }; // validation error
    const { meta } = exception.getResponse() as { meta : { cause: string }  }; // prisma errors
    
    if(!!meta?.cause)
      messages.push('Entidade/validação com erro');

    else if(Array.isArray(message))
      message.map((msg) => messages.push(msg))

    else if(exception?.message?.length)
      messages.push(exception.message)

    response
      .status(status)
      .json({
        statusCode: status,
        message: messages || ["Erro na requisição"],
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}