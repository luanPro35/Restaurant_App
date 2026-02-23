import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: "user@example.com" })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: "password123" })
  password!: string;
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: "user@example.com" })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: "password123" })
  password!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "John Doe" })
  name!: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: "user" })
  role?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "123456" })
  otp!: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  refreshToken!: string;
}

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  password!: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email!: string;
}

export class VerifyEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token!: string;
}

export class LogoutDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  refreshToken!: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  oldPassword!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  newPassword!: string;
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @ApiPropertyOptional()
  password?: string;
}

export class SendOtpDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: "user@example.com" })
  email!: string;
}

export class VerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: "user@example.com" })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "123456" })
  otp!: string;
}
