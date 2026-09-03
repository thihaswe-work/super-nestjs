import { IsIn, IsOptional } from 'class-validator';

export class FindPostsQueryDto {
  @IsOptional()
  @IsIn(['normal', 'question', 'alert'])
  type?: 'normal' | 'question' | 'alert';
}
