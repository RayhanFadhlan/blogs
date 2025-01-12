import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Comment } from "../entities/comment.entity";

@Injectable()
export class CommentOwnerGuard implements CanActivate {
  constructor(private readonly dataSource : DataSource){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const commentId = request.params.id;
    const comment = await this.dataSource
    .getRepository(Comment)
    .findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    if (!comment) {
      throw new ForbiddenException('Comment not found');
    }
    if (comment.user.id !== userId) {
      throw new ForbiddenException('You are not the owner of this comment');
    }
    return true;
  }
}