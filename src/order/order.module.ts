import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UserAuthMiddleware } from '../user-auth.middleware';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../model/user.entity';
import { ProductEntity } from '../model/product.entity';
import { OrderProductEntity } from '../model/orderProduct';
import { OrderEntity } from '../model/order.entity';
import { NotificationEntity } from '../model/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ProductEntity,
      OrderProductEntity,
      OrderEntity,
      NotificationEntity,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
