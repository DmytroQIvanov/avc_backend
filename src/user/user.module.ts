import { OrderProductEntity } from './../model/orderProduct';
import { JwtModule } from '@nestjs/jwt';
import { ProductEntity } from './../model/product.entity';
import { UserEntity } from 'src/model/user.entity';
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuthMiddleware } from 'src/user-auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProductEntity, OrderProductEntity]),
    JwtModule.register({
      secret: 'verySecret222',
      signOptions: { expiresIn: '6000s' },
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAuthMiddleware)
      .forRoutes(
        { path: '/user/auth', method: RequestMethod.ALL },
        { path: '/user/product/:id', method: RequestMethod.ALL },
      );
  }
}
