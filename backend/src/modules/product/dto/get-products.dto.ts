import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { SortOrder, PRODUCT_UNITS } from "../constants/product.constant";

export class GetProductsDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @IsEnum(PRODUCT_UNITS)
  @IsOptional()
  @Transform(({ value }) => (value === "" ? undefined : value))
  unit?: string;

  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "" || value === undefined) return undefined;
    return value;
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @Transform(({ value }) => {
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "" || value === undefined) return undefined;
    return value;
  })
  @IsBoolean()
  @IsOptional()
  isBestSeller?: boolean;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  img?: string;
}
