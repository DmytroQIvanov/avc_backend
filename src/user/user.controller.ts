import { UserService } from './user.service';
import { Controller, Post, Get, Headers, Query, Param, Body } from '@nestjs/common';

@Controller('user')
export class UserController {
    
  constructor(private readonly userService: UserService) {}

    @Post()
    addUser(@Headers() headers){
        const {password, number, firstname, lastname} = headers
        return this.userService.addUser(password, number, firstname, lastname)
    }
    @Get(":id")
    getUser(@Param() param){
        console.log(param.id)
        return this.userService.getUser(param.id)
    }
    @Get()
    getUsers(){
        return this.userService.getUsers()
    }
    @Post("/product/:id")
    addProductToBasket(@Param() param,@Body() body){
        return this.userService.addProductToBasket(param.id,body.productId)
    }
    // 153f9b79-17ec-4531-a58a-b4c67314e559 PRODUCT 
    // 381cd1c7-cacc-4af9-81fa-8fc0a58455a6 USER
}
