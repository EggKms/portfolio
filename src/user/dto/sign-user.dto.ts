import { IsNotEmpty, IsString } from "class-validator";
import { UserDto } from "./user.dto";

export class SignUserDto implements UserDto {
  @IsString()
  @IsNotEmpty()
  id: string;
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
