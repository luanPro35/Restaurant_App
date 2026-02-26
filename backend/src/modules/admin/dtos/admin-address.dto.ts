import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsString,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AddressType } from "@prisma/client";
export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "Nguyễn Văn A" })
  name!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "0901234567" })
  phone!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "123 Đường ABC, Quận 1, TP.HCM" })
  address!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "Tầng 5, cổng B" })
  detail?: string;

  @IsOptional()
  @IsEnum(AddressType)
  @ApiPropertyOptional({ enum: AddressType, example: AddressType.HOME })
  type?: AddressType;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: false })
  isDefault?: boolean;
}

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "Nguyễn Văn B" })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "0909876543" })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "456 Đường XYZ, Quận 3, TP.HCM" })
  address?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: "Tầng 10, phòng 1001" })
  detail?: string;

  @IsOptional()
  @IsEnum(AddressType)
  @ApiPropertyOptional({ enum: AddressType, example: AddressType.OFFICE })
  type?: AddressType;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  isDefault?: boolean;
}
