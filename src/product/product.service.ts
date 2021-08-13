import { ProductEntity } from './../model/product.entity';
import { Injectable, Body, HttpException, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Raw, Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
 
@Injectable()
export class ProductService {
    constructor(

        @InjectRepository(ProductEntity)
        private productRepository: Repository<ProductEntity>
        ) {}

      //GET PRODUCTS
       async getProducts(key:string="",quantity:number =20){
        const s3 = new S3();
        const productsRepository =await this.productRepository.find({
          where:{name:Like(`%${key}%`) },
          take:quantity,
          cache:true          
          
      });
        const numberOfProducts = productsRepository.length
        const products =  await productsRepository.map((product=>{
        const url = s3.getSignedUrl("getObject", {
          Bucket: "avc-bucket",
          Key: product.imageKey,
          Expires: 36000
      })
      return {...product, url}
    }))
      return {products,numberOfProducts}}

        //GET PRODUCT

        async getProduct(id){
          const s3 = new S3();
          const product =await this.productRepository.findOne({id});
          
          const url = s3.getSignedUrl("getObject", {
            Bucket: "avc-bucket",
            Key: product.imageKey,
            Expires: 36000
        })
        return {...product, url}
      }
        

          
        async postProduct({name, description, price},dataBuffer: Buffer,filename){
          try{
            if(!name || !description  || !price || !dataBuffer || !filename){
          throw new HttpException("Product was not add to store. Bad request",HttpStatus.BAD_REQUEST)
            }
          const s3 = new S3();
          const uploadResult = await s3.upload({
            Bucket: "avc-bucket",
            Body: dataBuffer,
            Key: `${uuid()}-${filename}`,
            ContentType: 'image/jpeg',
            Metadata:{Type:"System defined",Key:"Content-type",Value:"image/jpeg"}
          })
            .promise();
            const product = this.productRepository.create({name,description,price})
            product.imageKey = uploadResult.Key
            product.imageName = uploadResult.Key //TODO
            await this.productRepository.save(product);
            
          return {success:true,message:"Product successfully added to store"}
        }catch(e){
          throw new HttpException("Product was not add to store. Something went wrong",HttpStatus.CONFLICT)
        }

        }
        async deleteProduct(id){
          try{
          const result =this.productRepository.delete({id});
          console.log(result)
          return {success: true}
          }catch(e){
          throw new HttpException("Product was not deleted from store. Something went wrong",HttpStatus.CONFLICT)
            
          }

        }
        
}
