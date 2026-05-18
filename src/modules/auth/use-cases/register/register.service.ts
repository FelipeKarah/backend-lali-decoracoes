import { HttpException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { RegisterDto } from '../../dto/register.dto'
import { User } from '../../entities/user.entity'

@Injectable()
export class RegisterService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async execute(registerDto: RegisterDto) {
    try {
      const existingUser = await this.prismaService.user.findUnique({
        where: { email: registerDto.email },
      })

      if (existingUser) {
        throw new HttpException('E-mail já cadastrado', 400)
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 10)

      const user = await this.prismaService.user.create({
        data: {
          name: registerDto.name,
          email: registerDto.email,
          password: hashedPassword,
          whatsapp: registerDto.whatsapp,
          role: 'CLIENT',
          isActive: true,
        },
      })

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
