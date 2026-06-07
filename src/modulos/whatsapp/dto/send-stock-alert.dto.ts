import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class StockAlertProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  minimo: number;
}

export class SendStockAlertDto {
  @ApiProperty({ example: '51987654321' })
  @IsString()
  @IsNotEmpty()
  adminPhone: string;

  @ApiProperty({ type: [StockAlertProductDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => StockAlertProductDto)
  productos: StockAlertProductDto[];
}
