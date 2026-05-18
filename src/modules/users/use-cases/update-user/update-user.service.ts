import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/services/prisma.service';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { User } from '../../../auth/entities/user.entity';

@Injectable()
export class UpdateUserService {
  constructor(private prismaService: PrismaService) {}

  async execute(id: string, updateUserDto: UpdateUserDto) {
    try {
      // Verificar se usuário existe
      const userExists = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!userExists) {
        throw new HttpException('Usuário não encontrado', 404);
      }

      // Se estiver tentando atualizar email, verificar se já existe
      if (updateUserDto.email) {
        const emailExists = await this.prismaService.user.findFirst({
          where: {
            email: updateUserDto.email,
            id: { not: id },
          },
        });

        if (emailExists) {
          throw new HttpException('Email já está em uso', 400);
        }
      }

      // Atualizar usuário
      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: updateUserDto,
      });

      return new User(updatedUser);
    } catch (error) {
      throw new HttpException(
        error.message || 'Erro ao atualizar usuário',
        error.status || 400
      );
    }
  }
}
