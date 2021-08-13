import { ProductEntity } from './../model/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/model/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        @InjectRepository(ProductEntity)
        private productRepository: Repository<ProductEntity>
        ) {}

    async addUser(password:string, number:string, firstName:string,lastName:string){
        number= number.replace("+","")
        const user = this.usersRepository.create();
        user.password = password;
        user.number = number;
        user.firstName = firstName;
        user.lastName = lastName;
        await this.usersRepository.save(user);
        return user

    }
    async getUser(id){
        return await this.usersRepository.findOne({where:{id},relations:['basket']})
    }
    async getUsers(){
        return await this.usersRepository.find()
    }
    async addProductToBasket(id,productId){
         const user = await this.usersRepository.findOne({where:{id},relations:['basket']})
         const product = await this.productRepository.findOne({id:productId})
         user.basket = [product]


        return await this.usersRepository.save(user)
    }

}
