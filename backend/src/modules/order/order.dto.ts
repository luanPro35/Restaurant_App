import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  IsUUID,
} from "class-validator";
import { Type } from "class-transformer";
import { ORDER_STATUS } from "./order.contant";

export class ProductItemDto {
  @IsString()
  productId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsString()
  @IsOptional()
  note?: string;
}

export class CreateOrderDto {
  @IsNumber()
  tableId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  items!: ProductItemDto[];

  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(ORDER_STATUS)
  status!: string;
}

export class AddItemsToOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  items!: ProductItemDto[];
}

class OrderItemResponseDto {
  @IsString()
  productId!: string;

  @IsString()
  name!: string;

  @IsNumber()
  price!: number;

  @IsNumber()
  quantity!: number;

  @IsString()
  @IsOptional()
  note?: string;
}

export class OrderResponseDto {
  @IsString()
  id!: string;

  @IsString()
  table!: string;

  @IsString()
  @IsOptional()
  user?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemResponseDto)
  items!: OrderItemResponseDto[];

  @IsNumber()
  totalAmount!: number;

  @IsEnum(ORDER_STATUS)
  status!: string;

  @IsEnum(ORDER_STATUS)
  type!: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  createdAt!: string;

  @IsString()
  updatedAt!: string;
}
