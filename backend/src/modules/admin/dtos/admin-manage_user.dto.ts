import {
  IsString,
  IsEnum,
  IsOptional,
  IsEmail,
  MinLength,
  IsNumber,
} from "class-validator";
import { Type } from "class-transformer";
import { USER_ROLE, UserRole } from "../../user/constants/user.constant";

export class GetUsersDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsEnum(USER_ROLE)
  @IsOptional()
  role?: UserRole;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number;
}

export class CreateUserDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsEnum(USER_ROLE)
  role!: UserRole;
}

export class UpdateUserDto {
  @IsString()
  id!: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  name?: string;

  @IsEnum(USER_ROLE)
  @IsOptional()
  role?: UserRole;
}

export class DeleteUserDto {
  @IsString()
  id!: string;
}
