import { HttpException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { LoginDto } from '../../dto/login.dto'
import { User } from '../../entities/user.entity'

@Injectable()
export class LoginService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async execute(loginDto: LoginDto) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email: loginDto.email },
      })

      if (!user) {
        throw new HttpException('E-mail ou senha inválidos', 401)
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      )

      if (!isPasswordValid) {
        throw new HttpException('E-mail ou senha inválidos', 401)
      }

      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      })

      return {
        token,
        user: new User(user),
      }
    } catch (err) {
      throw new HttpException(err.message, err.status || 400)
    }
  }
}
