import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Patch,
} from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import {
  RegisterDto,
  LoginDto,
  SendOtpDto,
  VerifyOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdateProfileDto,
} from "../validations/auth.validation";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Public } from "../decorators/public.decorator";
import { CurrentUser } from "../decorators/current-user.decorator";
import { Roles } from "../decorators/roles.decorator";
import { Role } from "../enums/role.enum";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtRefreshGuard } from "../guards/jwt-refresh.guard";
import { OtpService } from "../otp/otp.service";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @ApiTags("Auth")
  @ApiOperation({ summary: "Login admin" })
  @ApiResponse({ status: 200, description: "Return admin user" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  @Get("login/admin")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAdmin(@CurrentUser() user: any) {
    return user;
  }

  @ApiTags("Auth")
  @ApiOperation({ summary: "Register user" })
  @ApiResponse({ status: 201, description: "User registered successfully" })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiTags("Auth")
  @ApiOperation({ summary: "Login user" })
  @ApiResponse({ status: 200, description: "Return user and tokens" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@CurrentUser() user: any, @Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiTags("Auth")
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: "Refresh access token" })
  @ApiResponse({ status: 200, description: "Return new access token" })
  @Post("refresh-token")
  async refreshToken(@Request() req: any) {
    const refreshToken =
      req.user?.refreshToken || req.headers.authorization?.split(" ")[1];
    return this.authService.refreshToken(refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logout(@CurrentUser() user: any) {
    return { message: "Logout successful" };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getProfile(@CurrentUser() user: any) {
    const userId = user.sub || user.id;
    return this.authService.getUserProfile(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch("profile")
  @ApiOperation({ summary: "Update user profile" })
  @ApiResponse({ status: 200, description: "Profile updated successfully" })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = user.sub || user.id;
    return this.authService.updateProfile(userId, updateProfileDto);
  }

  @ApiOperation({ summary: "Send OTP" })
  @ApiResponse({ status: 201, description: "OTP sent successfully" })
  @Post("send-otp")
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.otpService.generateOtp(sendOtpDto.email);
  }

  @ApiOperation({ summary: "Verify OTP" })
  @ApiResponse({ status: 200, description: "OTP verified successfully" })
  @Post("verify-otp")
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.otpService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }

  @ApiOperation({ summary: "Forgot password" })
  @Post("forgot-password")
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @ApiOperation({ summary: "Reset password" })
  @Post("reset-password")
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.password,
    );
  }
}
