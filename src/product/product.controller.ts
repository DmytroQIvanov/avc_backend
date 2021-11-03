import { ProductService } from './product.service';
import { Controller, Get, Param, Post, Query, Body } from '@nestjs/common';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  getProducts(@Query() query, @Body() body) {
    return this.productService.getProducts(query.key, 20, body.types);
  }

  @Get('/sidebar')
  getSideBar() {
    return this.productService.getSideBar();
  }

  @Get(':id')
  getProduct(@Param() param) {
    return this.productService.getProduct(param.id);
  }
}
