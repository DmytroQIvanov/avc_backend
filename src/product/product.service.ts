import { ProteinEntity } from './../model/Products/proitein.entity';
import { ProductEntity } from './../model/product.entity';
import { Injectable, Body, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, In, Like, Raw, Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,

    @InjectRepository(ProteinEntity)
    private proteinRepository: Repository<ProteinEntity>,
  ) {}

  //GET PRODUCTS
  async getProducts(key = '', quantity = 20, types = ['protein']) {
    const s3 = new S3();
    console.log(types);
    const productsRepository = await this.productRepository.find({
      where: [{ name: Like(`%${key}%`), type: types && In(types) }],
      take: quantity,
      cache: true,
    });
    const numberOfProducts = productsRepository.length;
    const products = await productsRepository.map((product) => {
      const url1 = s3.getSignedUrl('getObject', {
        Bucket: 'avc-bucket',
        Key: product.imageKey1,
        Expires: 36000,
      });
      return { ...product, url1 };
    });
    return { products, numberOfProducts };
  }

  //GET PRODUCT

  async getProduct(id) {
    const s3 = new S3();
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['typeColumn'],
    });

    const url1 = s3.getSignedUrl('getObject', {
      Bucket: 'avc-bucket',
      Key: product.imageKey1,
      Expires: 36000,
    });
    const url2 = s3.getSignedUrl('getObject', {
      Bucket: 'avc-bucket',
      Key: product.imageKey2,
      Expires: 36000,
    });
    const url3 = s3.getSignedUrl('getObject', {
      Bucket: 'avc-bucket',
      Key: product.imageKey3,
      Expires: 36000,
    });
    return { ...product, url1, url2, url3 };
  }

  async postProduct(
    { name, description, price, type, hot },
    files: [{ originalname; buffer }],
  ) {
    try {
      if (!name || !description || !price) {
        throw new HttpException(
          'Product was not add to store. Bad request',
          HttpStatus.BAD_REQUEST,
        );
      }
      const product = this.productRepository.create({
        name,
        description,
        price,
        type,
        hot,
      });
      const s3 = new S3();

      await Promise.all(
        files.map(async (img, indx) => {
          const uploadResult = await s3
            .upload({
              Bucket: 'avc-bucket',
              Body: img.buffer,
              Key: `${uuid()}-${img.originalname}`,
              ContentType: 'image/jpeg',
              Metadata: {
                Type: 'System defined',
                Key: 'Content-type',
                Value: 'image/jpeg',
              },
            })
            .promise();
          console.log(`imageKey${indx + 1}`);
          product[`imageKey${indx + 1}`] = uploadResult.Key;
        }),
      );

      product.imageName = 'TODO';
      await this.productRepository.save(product);

      return { success: true, message: 'Product successfully added to store' };
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'Product was not add to store. Something went wrong',
        HttpStatus.CONFLICT,
      );
    }
  }
  async deleteProduct(id) {
    try {
      const result = await this.productRepository.delete({ id });
      return { deleted: true };
    } catch (e) {
      throw new HttpException(
        'Product was not deleted from store. Something went wrong',
        HttpStatus.CONFLICT,
      );
    }
  }
  async addProtein({ name, description, price }) {
    this.productRepository.create();
  }
  async getLength(elem) {
    const productsRepository = await this.productRepository.find({
      where: { type: Like(elem) },
    });
    return productsRepository.length;
  }

  async getSideBar() {
    enum products {
      protein = 'protein',
      bcaa = 'bcaa',
      gainer = 'gainer',
    }

    // console.log(products.protein);
    return {
      [products.protein]: await this.getLength(products.protein),
      [products.bcaa]: await this.getLength(products.bcaa),
      [products.gainer]: await this.getLength(products.gainer),
    };
  }
  async forTest() {
    const product = await this.productRepository.findOne(
      '7d0c0954-faa2-409f-8751-303db9c5395b',
    );

    const protein = await this.proteinRepository.create({
      taste: ['ss'],
      weigth: ['300', '350'],
    });
    product.typeColumn = protein;

    await this.productRepository.save(product);
    return await this.productRepository.findOne({
      where: { id: '7d0c0954-faa2-409f-8751-303db9c5395b' },
      relations: ['typeColumn'],
    });

    // const product = this.productRepository.create({name:"ssss",description:"ssss",imageKey1:"s",imageKey2:"s",quantityOfGoods:3,price:333,rating:2,imageName:"smth",type:'protein',imageKey3:"sssssss",})
  }
}
