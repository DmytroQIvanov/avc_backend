import { PostEntity } from './../model/post.entity';
import { ProteinEntity } from './../model/Products/proitein.entity';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminEntity,
      ProductEntity,
      ProteinEntity,
      PostEntity,
    ]),
    JwtModule.register({
      secret: 'verySecret',
      signOptions: { expiresIn: '300s' },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, ProductService, PostService],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminAuthMiddleware)
      .forRoutes(
        { path: '/admin/auth', method: RequestMethod.ALL },
        { path: '/admin/addProduct', method: RequestMethod.ALL },
        { path: '/admin/deleteProduct/*', method: RequestMethod.ALL },
      );
  }
}
