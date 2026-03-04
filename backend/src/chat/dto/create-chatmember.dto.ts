import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatMemberDto {
  @ApiProperty()
  @IsString()
  chat_id: string;

  @ApiProperty()
  @IsString()
  user_id: string;
}
