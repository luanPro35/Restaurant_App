export interface IAuthService {
  login(email: string, password: string): Promise<any>;
  register(
    email: string,
    password: string,
    name: string,
    role: string,
  ): Promise<any>;
  refreshToken(refreshToken: string): Promise<any>;
  resetPassword(email: string, password: string, token: string): Promise<any>;
  forgotPassword(email: string): Promise<any>;
  verifyEmail(email: string, token: string): Promise<any>;
  logout(refreshToken: string): Promise<any>;
  changePassword(
    email: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<any>;
  updateProfile(email: string, name?: string, password?: string): Promise<any>;
}
