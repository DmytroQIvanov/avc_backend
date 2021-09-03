import { OrderProductEntity } from '../model/orderProduct';
import { JwtModule } from '@nestjs/jwt';
import { ProductEntity } from './../model/product.entity';
import { UserEntity } from 'src/model/user.entity';
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuthMiddleware } from 'src/user-auth.middleware';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';
import { OrderEntity } from '../model/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ProductEntity,
      OrderProductEntity,
      OrderEntity,
    ]),
    JwtModule.register({
      secret: 'verySecret222',
      signOptions: { expiresIn: '48h' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, OrderService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAuthMiddleware)
      .forRoutes(
        { path: '/user/auth', method: RequestMethod.ALL },
        { path: '/user/product/:id', method: RequestMethod.ALL },
        { path: '/user/product/:id', method: RequestMethod.ALL },
        { path: '/user/order', method: RequestMethod.ALL },
        { path: '/user', method: RequestMethod.GET },
      );
  }
}
