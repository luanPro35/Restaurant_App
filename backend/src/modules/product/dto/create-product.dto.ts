import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsArray,
} from "class-validator";
import { PRODUCT_UNITS } from "../constants/product.constant";

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  price!: number;

  @IsNumber()
  @IsOptional()
  originalPrice?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  category!: string;

  @IsEnum(PRODUCT_UNITS)
  @IsOptional()
  unit?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsBoolean()
  @IsOptional()
  isBestSeller?: boolean;

  @IsArray()
  @IsOptional()
  variants?: { name: string; price: number }[];
}
