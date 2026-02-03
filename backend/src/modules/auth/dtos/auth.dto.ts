export class LoginDto {
  email!: string;
  password!: string;
}

export class RegisterDto {
  email!: string;
  password!: string;
  name!: string;
  role?: string;
}

export class RefreshTokenDto {
  refreshToken!: string;
}

export class ResetPasswordDto {
  email!: string;
  password!: string;
  token!: string;
}

export class ForgotPasswordDto {
  email!: string;
}

export class VerifyEmailDto {
  email!: string;
  token!: string;
}

export class LogoutDto {
  refreshToken!: string;
}

export class ChangePasswordDto {
  oldPassword!: string;
  newPassword!: string;
}

export class UpdateProfileDto {
  name?: string;
  email?: string;
  password?: string;
}
