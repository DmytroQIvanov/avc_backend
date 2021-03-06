import { PostService } from './../post/post.service';
import { ProductEntity } from './../model/product.entity';
import { AdminService } from './admin.service';
import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  HttpException,
  HttpStatus,
  Param,
  Delete,
  Req,
  Get,
  Headers,
  Res,
  UploadedFiles,
  Patch,
} from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request, Response, response } from 'express';
import { UserService } from '../user/user.service';
import { OrderService } from '../order/order.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly productService: ProductService,
    private readonly postService: PostService,
    private readonly usersService: UserService,
    private readonly orderService: OrderService,
  ) {}
  @Post('/login')
  async loginAdmin(
    @Body() body,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { login, password } = body;
    const result = await this.adminService.loginAdmin(login, password);
    response.cookie('adminAccesToken', result.accesToken, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
    });
    return result;
  }

  @Post('/addAdmin')
  addAdmin(@Body() body, @Req() req: Request) {
    const { firstName, lastName, login, password } = body;
    return this.adminService.addAdmin(body.key, {
      firstName,
      lastName,
      login,
      password,
    });
  }

  @Post('/addPost')
  addPost(@Body() body, @Req() req: Request) {
    // const { content, name } = body;
    return this.postService.addPost(body);
  }

  @Post('/addProduct')
  @UseInterceptors(AnyFilesInterceptor())
  addItem(@Body() body, @UploadedFiles() files) {
    try {
      console.log(body);
      console.log(files);
      body.productVariant = JSON.parse(body.productVariant);

      return this.productService.postProduct(body, files);
    } catch (e) {
      console.log(e);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
  @Post('/updateProduct')
  @UseInterceptors(AnyFilesInterceptor())
  updateProduct(@Body() body: ProductEntity) {
    console.log(body);
    return this.productService.updateProduct(body, body.id);
  }

  @Delete('/deleteProduct/:id')
  deleteProduct(@Param() param) {
    try {
      console.log(param.id);
      return this.productService.deleteProduct(param.id);
    } catch (e) {
      console.log(e);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
  @Post('/token')
  refreshToken(@Body() body) {
    const { accesToken, refreshToken } = body;
    return this.adminService.refreshToken(accesToken, refreshToken);
  }

  @Post('/auth')
  checkToken(@Headers() request) {
    const { login } = request;
    return { login };
  }

  @Get('/users')
  getUsers(@Body() body, @Req() req: Request) {
    // const { content, name } = body;
    return this.usersService.getUsers();
  }

  @Get('/orders')
  getOrders(@Body() body, @Req() req: Request) {
    return this.orderService.getOrders();
  }
  @Delete('/order')
  deleteOrder(@Body() body, @Req() req: Request) {
    console.log(body);
    return this.orderService.deleteOrder(body.id);
  }
  @Delete('/user/:id')
  deleteUser(@Body() body, @Param('id') id) {
    return this.usersService.deleteUser(id);
  }
}
