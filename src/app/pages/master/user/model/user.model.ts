import { RoleEnum } from "../../../../shared/types/enum";

export interface UserDto {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: RoleEnum;
}