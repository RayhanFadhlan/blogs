import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class BlogOwnerGuard implements CanActivate {
  constructor(private readonly datasource : DataSource){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const blogId = request.params.id;
    const blog = await this.datasource
    .getRepository('Blog')
    .findOne({
      where: { id: blogId },
      relations: ['user'],
    });
    if (!blog) {
      throw new ForbiddenException('Blog not found');
    }
    if (blog.user.id !== userId) {
      throw new ForbiddenException('You are not the owner of this blog');
    }
    return true;
  }
}