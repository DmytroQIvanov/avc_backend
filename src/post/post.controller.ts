import { PostService } from './post.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getPosts() {
    return this.postService.getPosts();
  }
  @Get(':id')
  getPost(@Param() param) {
    return this.postService.getPost(param.id);
  }
  @Post()
  addPost(@Body() body) {
    return this.postService.addPost(body);
  }
}
