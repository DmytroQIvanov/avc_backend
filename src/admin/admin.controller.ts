import { ProductEntity } from './../model/product.entity';
import { AdminService } from './admin.service';
import { Controller, Post, UploadedFile, UseInterceptors, Body, HttpException, HttpStatus, Param, Delete, Req, Get, Headers, Res,  } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response, NextFunction, response } from 'express';


@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly productService: ProductService) {}
    @Post("/login")
    async loginAdmin(@Body() body,@Req() req:Request){
        const {login,password} = body;
        return await this.adminService.loginAdmin(login,password)
    }

    // @Get("/addAdmin")
    // addAdmin(@Body() body,@Req() req: Request){
    //     // const result = JSONCookie.toString()
    //     const result = req.cookies;
    //     const result2 = cookieParser.JSONCookies(result)
        
    //     console.log(result,result2)
    //     // const {firstName,lastName,login,password} = body;
    //     // return this.adminService.addAdmin(body.key,{firstName,lastName,login,password})
    // }


    @Get("/addAdmin") 
    findAll(@Req() request: Request,@Res({ passthrough: true }) response: Response, @Headers() header) {
        response.cookie('key', 'value',{maxAge:3333,path:"/",sameSite:"strict"})
  console.log(request.cookies); //[Object: null prototype] {}
  return(request.cookies)
  
}
    @Post("/addProduct")
    @UseInterceptors(FileInterceptor('file'))
    addItem(@Body() body: ProductEntity,@UploadedFile() file){
        try{
        // const {name, description, price} = body
        // console.log(name,description,price)
        // console.log(file)

        return this.productService.postProduct(body,file.buffer,file.fieldname)
        }catch(e){
            console.log(e)
            throw new HttpException("Bad request", HttpStatus.BAD_REQUEST)

        }        
    }

    @Delete("/deleteProduct/:id")
    deleteProduct(@Param() param){
        try{
            
        return this.productService.deleteProduct(param.id)
        }catch(e){
            console.log(e)
            throw new HttpException("Bad request", HttpStatus.BAD_REQUEST)

        }        
    }
    @Post("/token")
    refreshToken(@Body() body){
        const {accesToken,refreshToken}=body
        return this.adminService.refreshToken(accesToken,refreshToken)
    }
    
    @Post("/auth")
    checkToken(@Body() body){
        const {accesToken,refreshToken}=body
        return this.adminService.checkToken(accesToken)
    }
    

}
