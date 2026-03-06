import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsEnum,
  IsOptional,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TableStatus } from "@prisma/client";

export class CreateTableDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "Bàn 1" })
  name!: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 4 })
  capacity!: number;

  @IsOptional()
  @IsEnum(TableStatus)
  @ApiPropertyOptional({ enum: TableStatus, example: TableStatus.AVAILABLE })
  status?: TableStatus;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "Tầng 1" })
  location?: string;
}

export class UpdateTableDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "Bàn 1" })
  name?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ example: 4 })
  capacity?: number;

  @IsOptional()
  @IsEnum(TableStatus)
  @ApiPropertyOptional({ enum: TableStatus, example: TableStatus.AVAILABLE })
  status?: TableStatus;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "Tầng 1" })
  location?: string;
}
