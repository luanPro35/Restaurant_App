import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { RegisterDto, LoginDto } from "../validations/auth.validation";
import { LocalAuthGuard } from "../guards/local-auth.guard";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Public } from "../decorators/public.decorator";
import { CurrentUser } from "../decorators/current-user.decorator";
import { auth } from "../../../middlewares/auth.middleware";
import { Roles } from "../decorators/roles.decorator";
import { Role } from "../enums/role.enum";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtRefreshGuard } from "../guards/jwt-refresh.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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
  async refreshToken(@CurrentUser() user: any) {
    // Strategy adds user/payload to request
    return this.authService.generateTokens(user);
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
  getProfile(@CurrentUser() user: any) {
    return user;
  }

  @Post("forgot-password")
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post("reset-password")
  async resetPassword(
    @Body() body: { email: string; password: string; token: string },
  ) {
    return this.authService.resetPassword(
      body.email,
      body.password,
      body.token,
    );
  }
}
