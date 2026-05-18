import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';

// Controllers
import { CreateUserController } from './use-cases/create-user/create-user.controller';
import { UpdateUserController } from './use-cases/update-user/update-user.controller';

// Services
import { CreateUserService } from './use-cases/create-user/create-user.service';
import { UpdateUserService } from './use-cases/update-user/update-user.service';

@Module({
  controllers: [CreateUserController, UpdateUserController],
  providers: [PrismaService, CreateUserService, UpdateUserService],
  exports: [CreateUserService, UpdateUserService],
})
export class UsersModule {}
