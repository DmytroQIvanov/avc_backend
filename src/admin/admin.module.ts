import { ProductEntity } from '../model/product.entity';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/model/admin.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ProductService } from 'src/product/product.service';
import { JwtModule } from '@nestjs/jwt';
import { AdminAuthMiddleware } from 'src/admin-auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity,ProductEntity]),
    JwtModule.register({
    secret: 'verySecret',
    signOptions: { expiresIn: '300s' },
  }),
],
  controllers: [AdminController],
  providers: [AdminService,ProductService]
})
export class AdminModule {
//   configure(consumer: MiddlewareConsumer) {
//   consumer
//     .apply(AdminAuthMiddleware)
//     .forRoutes(
//       { path: '/admin/addProduct', method: RequestMethod.ALL },
//     { path: '/admin/addAdmin', method: RequestMethod.ALL });
// }
}
