import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendComboNotificationDto {
  @ApiProperty({ example: '51987654321' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Combo Familiar' })
  @IsString()
  @IsNotEmpty()
  comboNombre: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(0)
  ahorro: number;

  @ApiProperty({ example: 35 })
  @IsNumber()
  @Min(0)
  total: number;
}
