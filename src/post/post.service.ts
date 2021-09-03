import { PostEntity } from './../model/post.entity';
import { Body, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  async addPost({ name, content }) {
    if (!name && !content) {
      throw new HttpException('Not all fields is get', HttpStatus.BAD_REQUEST);
    }
    try {
      const post = await this.postRepository.create({ name, content });
      return await this.postRepository.save(post);
    } catch (e) {
      throw new HttpException('Something went wrong', HttpStatus.CONFLICT);
    }
  }
  async getPosts() {
    return await this.postRepository.find();
  }
  async getPost(id) {
    return await this.postRepository.findOne(id);
  }
}
