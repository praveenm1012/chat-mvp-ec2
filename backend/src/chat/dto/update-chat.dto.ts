import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateChatDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;
}
