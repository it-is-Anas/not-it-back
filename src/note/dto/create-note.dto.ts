import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateNoteDto {
  @Length(0, 50)
  @Matches(/^[A-Za-z\s]+$/, { message: 'title must contain only letters' })
  @IsString()
  title: string;

  @Matches(/^[A-Za-z\s]+$/, { message: 'content must contain only letters' })
  @IsString()
  content: string;
}
