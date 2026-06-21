import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
} from "class-validator";
import { Type, Transform } from "class-transformer";

export class GetNotificationsDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sortOrder?: "asc" | "desc";

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number;

  @Transform(({ value }) => {
    if (value === "true" || value === true) return true;
    if (value === "false" || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateNotificationDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  title!: string;

  @IsString()
  content!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startAt?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endAt?: Date;
}

export class UpdateNotificationDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startAt?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endAt?: Date;
}

export class DeleteNotificationDto {
  @IsString()
  id!: string;
}
