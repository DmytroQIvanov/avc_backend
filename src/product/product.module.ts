import { ProteinEntity } from './../model/Products/proitein.entity';
import { ProductEntity } from './../model/product.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProteinEntity])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
