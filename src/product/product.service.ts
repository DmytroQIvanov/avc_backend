import { ProductEntity } from './../model/product.entity';
import { Injectable, Body, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, ILike, Repository, getRepository, getConnection } from 'typeorm';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { CommentEntity } from '../model/comment.entity';
import { UserEntity } from '../model/user.entity';
import { CreateProductDTO } from '../dto/product.dto';
import { ProductVariantEntity } from '../model/product-variant.entity';
import { WeigthPriceEntity } from '../model/weigth-price.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,

    @InjectRepository(ProductVariantEntity)
    private productVariantRepository: Repository<ProductVariantEntity>,

    @InjectRepository(WeigthPriceEntity)
    private weightPriceRepository: Repository<WeigthPriceEntity>,
  ) {}

  //GET PRODUCTS
  async getProducts(key = '', quantity = 20, types = ['smartVater']) {
    const s3 = new S3();
    const productsRepository = await getRepository(ProductEntity)
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productVariant', 'productVariant')
      .leftJoinAndSelect('productVariant.property', 'property')

      .where([
        {
          name: ILike(`%${key}%`),
          // type: types && In(types),
        },
        // { description: ILike(`%${key}%`) },
      ])
      .getMany();
    // .where({ name: ILike(`%${key}%`), type: types && In(types), }]);

    const numberOfProducts = productsRepository.length;
    await productsRepository.map((elem) =>
      elem.productVariant.map((elem) => {
        elem.url1 = s3.getSignedUrl('getObject', {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: elem.imageKey1,
          Expires: 36000,
        });
      }),
    );

    return { products: productsRepository, numberOfProducts };
  }

  //GET PRODUCT
  async getProduct(id, taste = 0, weigth = 0) {
    const s3 = new S3();
    const product = await getRepository(ProductEntity)
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.comments', 'comments')
      .leftJoinAndSelect('product.productVariant', 'productVariant')
      .leftJoinAndSelect('comments.user', 'user')
      .leftJoinAndSelect('productVariant.property', 'property')
      .where('product.id = :id', { id })
      .getOne();

    await product.productVariant.map((elem) => {
      elem.url1 = s3.getSignedUrl('getObject', {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: elem.imageKey1,
        Expires: 36000,
      });
    });

    return { ...product };
  }

  async postProduct(data: CreateProductDTO, files: [{ originalname; buffer }]) {
    if (!data.name || !data.description) {
      throw new HttpException(
        'Product was not add to store. Bad request',
        HttpStatus.BAD_REQUEST,
      );
    }
    const product = this.productRepository.create({
      name: data.name,
      description: data.description,
      rating: data.rating,
      type: data.type,
    });
    const productVariants = await Promise.all(
      data.productVariant.map(async (elem) => {
        const productVariant = await this.productVariantRepository.create(elem);

        productVariant.property = await Promise.all(
          elem.property.map(async (elem) => {
            console.log(elem);
            return await this.weightPriceRepository.create(elem);
          }),
        );
        return productVariant;
      }),
    );
    product.productVariant = productVariants;

    const s3 = new S3();

    // const tastes = data.productVariant.length;
    await Promise.all(
      files.map(async (img, indx) => {
        const uploadResult = await s3
          .upload({
            Bucket: process.env.AWS_BUCKET_NAME,
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
        product.productVariant[indx].imageKey1 = uploadResult.Key;
      }),
    );
    console.log(product.productVariant);

    await this.productRepository.save(product);

    return { success: true, message: 'Product successfully added to store' };
  }

  async updateProduct(body, id) {
    try {
      const product = await this.productRepository.update(id, { ...body });
      return { success: true, message: 'Product successfully updated' };
    } catch (e) {
      throw new HttpException(
        'Product was not add to store. Something went wrong',
        HttpStatus.CONFLICT,
      );
    }
  }
  async deleteProduct(id) {
    try {
      // const s3 = new S3();
      // s3.deleteObject((err, {}) => {});
      console.log(id);

      // await getConnection()
      //   .createQueryBuilder()
      //   .delete()
      //   .from(ProductEntity)
      //   .where('id = :id', { id })
      //   .execute();
      // const result1 = await this.productRepository.findOne({
      //   where: { id },
      //   relations: ['productVariant'],
      // });
      // await Promise.all(
      //   result1.productVariant.map(
      //     async (elem) =>
      //       await this.productVariantRepository.delete({ id: elem.id }),
      //   ),
      // );
      const product = await getRepository(ProductEntity)
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.comments', 'comments')
        .leftJoinAndSelect('product.productVariant', 'productVariant')
        .leftJoinAndSelect('productVariant.property', 'property')
        .where('product.id = :id', { id })
        .getOne();
      await Promise.all(
        await product.productVariant.map(
          async (elem) =>
            await Promise.all(
              await elem.property.map(
                async (elem) =>
                  await this.weightPriceRepository.delete(elem.id),
              ),
            ),
        ),
      );
      await Promise.all(
        await product.productVariant.map(
          async (elem) => await this.productVariantRepository.delete(elem.id),
        ),
      );

      const result = await this.productRepository.delete(id);

      //
      // const result2 = await this.productRepository.r(result);

      // await this.productRepository.save(result);
      return;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'Product was not deleted from store. Something went wrong',
        HttpStatus.CONFLICT,
      );
    }
  }
  async getLength(elem) {
    const productsRepository = await this.productRepository.find({
      where: { type: Like(elem) },
    });
    return productsRepository.length;
  }

  async postComment(productId, id, content) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['comments'],
    });
    const user = await this.userRepository.findOne({ id });
    const comment = await this.commentRepository.create({
      product,
      content,
      user,
    });
    product.comments.push(comment);
    return await this.productRepository.save(product);
  }

  async getSideBar() {
    enum products {
      BCAA_L_glutamine = 'BCAA_L_glutamine',
      FatBurner = 'FatBurner',
      MegaAminoMix = 'MegaAminoMix',
      // smartVater = 'Mg+B',
    }

    // console.log(products.protein);
    return {
      // [products.protein]: await this.getLength(products.protein),
      [products.MegaAminoMix]: await this.getLength(products.MegaAminoMix),
      [products.BCAA_L_glutamine]: await this.getLength(
        products.BCAA_L_glutamine,
      ),
      [products.FatBurner]: await this.getLength(products.FatBurner),
    };
  }
}
