import { UserService } from './user.service';
import {
  Controller,
  Post,
  Get,
  Headers,
  Param,
  Body,
  Res,
  Patch,
  Delete,
  HttpException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {}

  @Post()
  addUser(@Body() body, @Headers() headers) {
    const { password, number, firstname, lastname } = body;

    return this.userService.addUser(password, number, firstname, lastname);
  }

  @Post('/guest')
  async addGuest(@Res({ passthrough: true }) response: Response) {
    const guest = await this.userService.addGuest();
    response.cookie('accessToken', guest.accessToken, {
      expires: new Date(Date.now() + 900000000),
      httpOnly: true,
    });
    return { user: guest.user };
  }
  @Post('/login')
  async loginUser(
    @Body() body,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.userService.loginUser(body);
    response.cookie('accessToken', result.accessToken, {
      expires: new Date(Date.now() + 900000000),
      httpOnly: true,
    });
    if (!result) {
      throw new HttpException(
        'Пароль або логін не вірні',
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log(result);

    return { user: await this.userService.getUser(result.user.id) };
  }

  @Post('/auth')
  async authUser(@Headers() headers) {
    return { user: await this.userService.getUser(headers.id) };
  }
  @Patch('/changeProductQuantity')
  async changeProductQuantity(@Headers('id') id, @Body() body) {
    return await this.userService.changeProductQuantity(
      id,
      body.name,
      body.quantity,
    );
  }

  @Post('/order')
  async addOrder(@Headers('id') id, @Body() body) {
    const { orderNotes, deliveryAddress } = body;
    await this.orderService.addOrder(id, {
      orderNotes,
      deliveryAddress,
    });
    return await { user: await this.userService.getUser(id) };
  }

  @Patch('/favourite')
  async addProductToFavourite(@Headers('id') id, @Body() body) {
    await this.userService.addProductToFavourite(id, body.productId);
  }

  @Get(':id')
  getUser(@Param() param) {
    return this.userService.getUser(param.id);
  }
  @Post('/product/:id')
  addProductToBasket(@Param() param, @Headers() headers, @Body() body) {
    console.log(body);
    return this.userService.addProductToBasket(headers.id, param.id, body);
  }
  @Delete('/product')
  deleteProductFromBasket(@Param() param, @Headers() headers, @Body() body) {
    return this.userService.deleteProductFromBasket(headers.id, body.name);
  }
  @Delete('/product')
  deleteProductsFromBasket(@Headers() headers) {
    return this.userService.deleteProductsFromBasket(headers.id);
  }
  @Post('/comment/:id')
  postComment(@Param('id') id, @Headers() headers, @Body('content') content) {
    return this.productService.postComment(id, headers.id, content);
  }

  @Patch('/logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('accessToken', '', {
      expires: new Date(Date.now() + 1),
      httpOnly: true,
    });
    return;
  }
}
