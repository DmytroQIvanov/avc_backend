import { ProductEntity } from './../model/product.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CommentEntity } from '../model/comment.entity';
import { UserEntity } from '../model/user.entity';
import { ProductVariantEntity } from '../model/product-variant.entity';
import { WeigthPriceEntity } from '../model/weigth-price.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      CommentEntity,
      UserEntity,
      ProductVariantEntity,
      WeigthPriceEntity,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
