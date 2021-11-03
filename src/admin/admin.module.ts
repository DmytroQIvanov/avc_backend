import { PostEntity } from './../model/post.entity';
import { ProductEntity } from '../model/product.entity';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/model/admin.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ProductService } from 'src/product/product.service';
import { JwtModule } from '@nestjs/jwt';
import { AdminAuthMiddleware } from 'src/admin-auth.middleware';
import { PostService } from 'src/post/post.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../model/user.entity';
import { OrderEntity } from '../model/order.entity';
import { OrderProductEntity } from '../model/orderProduct';
import { NotificationEntity } from '../model/notification.entity';
import { OrderService } from '../order/order.service';
import { CommentEntity } from '../model/comment.entity';
import { ProductVariantEntity } from '../model/product-variant.entity';
import { WeigthPriceEntity } from '../model/weigth-price.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminEntity,
      ProductEntity,
      PostEntity,
      UserEntity,
      OrderEntity,
      NotificationEntity,
      OrderProductEntity,
      CommentEntity,
      ProductVariantEntity,
      WeigthPriceEntity,
    ]),
    JwtModule.register({
      secret: 'verySecret',
      signOptions: { expiresIn: '36h' },
    }),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    ProductService,
    PostService,
    UserService,
    OrderService,
  ],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminAuthMiddleware)
      .forRoutes(
        { path: '/admin/auth', method: RequestMethod.ALL },
        { path: '/admin/addProduct', method: RequestMethod.ALL },
        { path: '/admin/deleteProduct/*', method: RequestMethod.ALL },
        { path: '/admin/users', method: RequestMethod.ALL },
        { path: '/admin/user/*', method: RequestMethod.ALL },
      );
  }
}
