import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  role?: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  refreshToken!: string;
}

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsNotEmpty()
  token!: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

export class VerifyEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  token!: string;
}

export class LogoutDto {
  @IsNotEmpty()
  refreshToken!: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  oldPassword!: string;

  @IsNotEmpty()
  newPassword!: string;
}

export class UpdateProfileDto {
  @IsNotEmpty()
  name?: string;

  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsNotEmpty()
  password?: string;
}
