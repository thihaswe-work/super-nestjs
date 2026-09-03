import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export type PostType = 'normal' | 'question' | 'alert';

export class CreatePostDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsIn(['normal', 'question', 'alert'])
  type: PostType;
}
