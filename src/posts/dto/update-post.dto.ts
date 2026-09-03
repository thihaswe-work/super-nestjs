import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import type { PostType } from './create-post.dto.js';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsIn(['normal', 'question', 'alert'])
  type?: PostType;
}
