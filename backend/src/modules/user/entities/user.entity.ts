import { Exclude } from "class-transformer";
import { UserRole } from "../constants/user.constant";

export class UserEntity {
  id!: string;
  name!: string;
  email!: string;

  @Exclude()
  password?: string;

  role!: UserRole;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
