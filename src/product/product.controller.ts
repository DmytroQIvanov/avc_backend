import { ProductService } from './product.service';
import { Controller, Get, Param, Post, Query, Body, Res } from '@nestjs/common';

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

  // @Get('/test')
  // test() {

  //   return this.productService.forTest();
  // }
  // @Get("/:filename")
  //   async getFile(@Param("filename") filename: string, @Res() res: any) {
  //       res.sendFile(filename, { root: 'static/image'});
  //   }
  @Get(':id')
  getProduct(@Param() param) {
    return this.productService.getProduct(param.id);
  }
  @Post('/protein')
  postProtein(@Body() body) {
    return this.productService.addProtein(body);
  }
}
