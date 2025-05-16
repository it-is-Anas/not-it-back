import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class LogInUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 20)
  @Matches(/^\d+$/, { message: 'password must be numeric' })
  password: string;
}
