import { Role } from "@prisma/client";

export interface EditUserDto {
  firstName: string;
  lastName: string;
  avatarURL?: string;
  email: string;
  newPassword?: string;
  role: Role;
}
