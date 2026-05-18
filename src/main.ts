import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './helpers/filters/http-exception.filter'
import * as path from 'path'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // CORS configurado
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })

  // ✅ Servir arquivos estáticos da pasta public
  // Os arquivos ficarão acessíveis em: http://localhost:8080/uploads/kits/imagem.jpg
  app.useStaticAssets(path.join(__dirname, '..', 'public'), {
    prefix: '/',
  })

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  app.useGlobalFilters(new HttpExceptionFilter())

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Lali')
    .setDescription('Lali API - Sistema de Aluguel de Kits de Decoração')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Users')
    .addTag('Kits')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = process.env.API_PORT || 8080
  await app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${port}`)
    console.log(`📚 Swagger docs on http://localhost:${port}/api/docs`)
    console.log(`📁 Static files served from /public directory`)
  })
}
bootstrap()
