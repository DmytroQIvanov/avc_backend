import { ProductService } from './product.service';
import { Controller, Get, Param, Post, UploadedFile, UseInterceptors, Query } from '@nestjs/common';

@Controller('product')
export class ProductController {
    
    constructor(private readonly productService: ProductService) {}

    @Get()
    getProducts(@Query() query){
        return this.productService.getProducts(query.key )
    }

    @Get(":id")
    getProduct(@Param() param){
        return this.productService.getProduct(param.id)
    }

}
