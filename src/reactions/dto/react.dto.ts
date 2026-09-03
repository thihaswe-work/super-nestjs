import { IsIn } from 'class-validator';

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export class ReactDto {
  @IsIn(['like', 'love', 'haha', 'wow', 'sad', 'angry'])
  type: ReactionType;
}
