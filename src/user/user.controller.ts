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
} from '@nestjs/common';
import { Response } from 'express';
import { OrderService } from '../order/order.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly orderService: OrderService,
  ) {}

  @Post()
  addUser(@Body() body, @Headers() headers) {
    const { password, number, firstname, lastname } = body;

    return this.userService.addUser(password, number, firstname, lastname);
  }
  @Post('/login')
  async loginUser(
    @Body() body,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.userService.loginUser(body);
    response.cookie('accessToken', result.accessToken, {
      expires: new Date(Date.now() + 9000000),
      httpOnly: true,
    });
    return { user: await this.userService.getUser(result.user.id) };
  }
  @Post('/auth')
  async authUser(@Headers() headers) {
    return { user: await this.userService.getUser(headers.id) };
  }
  @Post('/order')
  async addOrder(@Headers('id') id) {
    return await this.orderService.addOrder(id);
  }

  @Get(':id')
  getUser(@Param() param) {
    return this.userService.getUser(param.id);
  }
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }
  @Post('/product/:id')
  addProductToBasket(@Param() param, @Headers() headers) {
    return this.userService.addProductToBasket(headers.id, param.id);
  }
  @Delete('/product/:id')
  deleteProductFromBasket(@Param() param, @Headers() headers) {
    return this.userService.deleteProductFromBasket(headers.id, param.id);
  }
  @Delete('/product')
  deleteProductsFromBasket(@Headers() headers) {
    return this.userService.deleteProductsFromBasket(headers.id);
  }

  @Patch('/logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('accessToken', '', {
      expires: new Date(Date.now() + 1),
      httpOnly: true,
    });
    return this.userService.logout();
  }
}
