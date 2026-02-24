import { IsString, IsOptional, IsNumber, IsBoolean } from "class-validator";
import { Type } from "class-transformer";

export class GetPromotionsDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number;
}

export class CreatePromotionDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  name!: string;

  @Type(() => Number)
  @IsNumber()
  discount!: number;

  @IsString()
  until!: string;

  @IsBoolean()
  isActive!: boolean;

  @IsString()
  @IsOptional()
  code?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  minOrder?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdatePromotionDto {
  @IsString()
  id!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsString()
  @IsOptional()
  until?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  code?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  minOrder?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class DeletePromotionDto {
  @IsString()
  id!: string;
}
