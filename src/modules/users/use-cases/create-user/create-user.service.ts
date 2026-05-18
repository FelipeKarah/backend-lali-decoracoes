import { HttpException, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../../../shared/services/prisma.service'
import { CreateUserDto } from '../../dto/create-user.dto'
import { User } from '../../entities/user.entity'

@Injectable()
export class CreateUserService {
  constructor(private prismaService: PrismaService) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.prismaService.user.findUnique({
        where: { email: createUserDto.email },
      })

      if (existingUser) {
        throw new HttpException('E-mail já cadastrado', 400)
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

      const user = await this.prismaService.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: hashedPassword,
          whatsapp: createUserDto.whatsapp,
          role: createUserDto.role || 'CLIENT',
          isActive: true,
        },
      })

      return new User(user)
    } catch (err) {
      throw new HttpException(err.message, err.status || 400)
    }
  }
}
