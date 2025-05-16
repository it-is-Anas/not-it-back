import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @Length(3, 10)
  @Matches(/^[A-Za-z]+$/, { message: 'firstName must contain only letters' })
  @IsString()
  firstName: string;

  @Length(3, 10)
  @Matches(/^[A-Za-z]+$/, { message: 'firstName must contain only letters' })
  @IsString()
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 20)
  @Matches(/^\d+$/, { message: 'password must be numeric' })
  password: string;
}
