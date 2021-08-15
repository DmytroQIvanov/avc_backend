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
import { Request, Response, response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
    console.log(body);
    const result = await this.userService.loginUser(body);

    response.cookie('accessToken', result.accessToken, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
    });
    return { user: result.user };
  }
  @Post('/auth')
  async authUser(@Headers() headers) {
    const userData = await this.userService.getUser(headers.id);
    const { password, ...user } = userData;
    return { user };
  }

  @Get(':id')
  getUser(@Param() param) {
    console.log(param.id);
    return this.userService.getUser(param.id);
  }
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }
  @Post('/product/:id')
  addProductToBasket(@Param() param, @Body() body, @Headers() headers) {
    console.log(headers);
    return this.userService.addProductToBasket(param.id, body.productId);
  }
  @Delete('/product/:id')
  deleteProductFromBasket(@Param() param, @Body() body, @Headers() headers) {
    console.log(headers);
    return this.userService.deleteProductFromBasket(param.id, body.productId);
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
