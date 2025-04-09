import { IsOptional, IsString } from "class-validator";
import { UserDto } from "./user.dto";

export class LoginUserDto implements UserDto{
  @IsString()
  id: string;
  @IsString()
  password: string;
}
