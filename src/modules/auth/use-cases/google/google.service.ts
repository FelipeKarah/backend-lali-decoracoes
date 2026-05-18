import { HttpException, Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { GoogleAuthDto } from '../../dto/google-auth.dto'
import { User } from '../../entities/user.entity'
import * as bcrypt from 'bcrypt'
import { UserRole } from '@prisma/client'

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name)

  constructor(
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(googleAuthDto: GoogleAuthDto) {
    try {
      this.logger.log(
        `Tentando login/signup com Google: ${googleAuthDto.email}`,
      )

      // Verificar se usuário já existe
      let user = await this.prismaService.user.findUnique({
        where: {
          email: googleAuthDto.email,
        },
      })

      // Se usuário não existe, criar com Google OAuth
      if (!user) {
        this.logger.log(
          `Usuário não encontrado, criando novo: ${googleAuthDto.email}`,
        )
        user = await this.createUserWithGoogle(googleAuthDto)
      } else {
        this.logger.log(`Usuário encontrado: ${user.id}`)
      }

      // Gerar JWT token (mesma lógica do login normal)
      const payload = {
        email: user.email,
        sub: user.id,
        role: user.role,
      }

      const token = this.jwtService.sign(payload)

      return {
        token: token,
        user: new User(user),
      }
    } catch (err) {
      this.logger.error(`Erro no Google Auth: ${err.message}`)
      throw new HttpException(
        err.message || 'Erro na autenticação com Google',
        400,
      )
    }
  }

  private async createUserWithGoogle(googleAuth: GoogleAuthDto) {
    try {
      // Gerar senha aleatória segura para usuários Google
      const randomPassword = this.generateSecurePassword()
      const hashedPassword = await bcrypt.hash(randomPassword, 10)

      // Preparar dados para criação do usuário
      const userData = {
        email: googleAuth.email,
        password: hashedPassword,
        name: googleAuth.name,
        role: UserRole.CLIENT, // Usando o enum ao invés de string
        isActive: true,
      }

      // Criar usuário
      const newUser = await this.prismaService.user.create({
        data: userData,
      })

      this.logger.log(`Usuário Google criado: ${newUser.id}`)
      return newUser
    } catch (error) {
      this.logger.error(`Erro ao criar usuário com Google: ${error.message}`)
      throw new HttpException('Erro ao criar usuário com Google', 400)
    }
  }

  private generateSecurePassword(): string {
    // Gerar senha aleatória forte (o usuário nunca vai usar)
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*'
    let password = ''
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }
}
