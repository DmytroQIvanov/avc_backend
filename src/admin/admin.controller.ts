import { ProductEntity } from './../model/product.entity';
import { AdminService } from './admin.service';
import {
  Controller,
  Post,
  UploadedFile,
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
  Header,
  Patch,
} from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response, response } from 'express';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly productService: ProductService,
  ) {}
  @Post('/login')
  async loginAdmin(
    @Body() body,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // response.set('Access-Control-Allow-Credentials',"true")
    const { login, password } = body;
    console.log(body);
    const result = await this.adminService.loginAdmin(login, password);
    response.cookie('adminAccesToken', result.accesToken, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
    });
    return result;
  }

  @Post('/addAdmin')
  addAdmin(@Body() body, @Req() req: Request) {
    // const result = JSONCookie.toString()
    // const result = req.cookies;
    // const result2 = cookieParser.JSONCookies(result)

    // console.log(result,result2)
    const { firstName, lastName, login, password } = body;
    return this.adminService.addAdmin(body.key, {
      firstName,
      lastName,
      login,
      password,
    });
  }

  @Post('/addProduct')
  @UseInterceptors(FileInterceptor('file'))
  addItem(@Body() body: ProductEntity, @UploadedFile() file) {
    try {
      return this.productService.postProduct(body, file.buffer, file.fieldname);
    } catch (e) {
      console.log(e);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('/deleteProduct/:id')
  deleteProduct(@Param() param) {
    try {
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
}
