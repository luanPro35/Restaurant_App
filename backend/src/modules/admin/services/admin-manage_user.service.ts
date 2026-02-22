import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { AdminManageUserRepository } from "../repositories/admin-manage_user.repository";
import {
  GetUsersDto,
  CreateUserDto,
  UpdateUserDto,
  DeleteUserDto,
} from "../dtos/admin-manage_user.dto";
import { ADMIN_MANAGES_USER_MESSAGES } from "../constants/admin-manages_user.contant";
import bcryptjs from "bcryptjs";
import { UserEntity } from "../../user/entities/user.entity";

@Injectable()
export class AdminManageUserService {
  constructor(
    private readonly adminManageUserRepository: AdminManageUserRepository,
  ) {}

  private excludePassword<User>(user: User): Omit<User, "password"> {
    const { password, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
  }

  async findAll(query: GetUsersDto) {
    const users = await this.adminManageUserRepository.findAll(query);
    const total = await this.adminManageUserRepository.count(query);

    return {
      data: users.map((user) => new UserEntity(user)),
      pagination: {
        total,
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
        totalPages: Math.ceil(total / (Number(query.limit) || 10)),
      },
    };
  }

  async findById(id: string) {
    const user = await this.adminManageUserRepository.findById(id);
    if (!user) {
      throw new NotFoundException(ADMIN_MANAGES_USER_MESSAGES.NOT_FOUND);
    }
    return new UserEntity(user);
  }

  async create(data: CreateUserDto) {
    const existingUser = await this.adminManageUserRepository.findAll({
      email: data.email,
    });
    if (existingUser.length > 0) {
      throw new ConflictException(ADMIN_MANAGES_USER_MESSAGES.ALREADY_EXISTS);
    }

    const hashedPassword = await bcryptjs.hash(data.password, 10);
    data.password = hashedPassword;

    const newUser = await this.adminManageUserRepository.create(data);
    return new UserEntity(newUser);
  }

  async update(id: string, data: UpdateUserDto) {
    await this.findById(id);
    data.id = id;
    const updatedUser = await this.adminManageUserRepository.update(data);
    return new UserEntity(updatedUser);
  }

  async delete(adminId: string, targetId: string) {
    if (adminId === targetId) {
      throw new BadRequestException(
        ADMIN_MANAGES_USER_MESSAGES.CANNOT_DELETE_YOURSELF,
      );
    }

    await this.findById(targetId);
    const deleteDto: DeleteUserDto = { id: targetId };
    return this.adminManageUserRepository.delete(deleteDto);
  }
}
