import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateNoteDto {
  @Length(0, 50)
  @Matches(/^[A-Za-z]+$/, { message: 'title must contain only letters' })
  @IsString()
  title: string;

  @Length(0, 50)
  @Matches(/^[A-Za-z]+$/, { message: 'content must contain only letters' })
  @IsString()
  content: string;
}
