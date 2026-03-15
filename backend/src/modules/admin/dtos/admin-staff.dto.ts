import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from "class-validator";
import { Role } from "../../auth/enums/role.enum";

export class CreateStaffDto {
  @ApiProperty({ example: "Staff Name" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: "staff@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "password123" })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ default: Role.STAFF })
  @IsEnum(Role)
  @IsOptional()
  role: Role = Role.STAFF;
}

export class UpdateStaffDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  password?: string;
}
