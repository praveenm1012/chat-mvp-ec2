import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateChatMemberDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  chat_id?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  user_id?: string;
}
