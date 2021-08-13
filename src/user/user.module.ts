import { ProductEntity } from './../model/product.entity';
import { UserEntity } from 'src/model/user.entity';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  
  imports: [TypeOrmModule.forFeature([UserEntity,ProductEntity])],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
