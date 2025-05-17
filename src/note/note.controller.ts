import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { Request } from 'express';
import { Response } from '../Types/Response';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  createNote(
    @Body() body: CreateNoteDto,
    @Req() req: Request,
  ): Promise<Response> {
    return this.noteService.createNote(body, req.user);
  }

  @Get()
  getMyNotes(@Req() req: Request): Promise<Response> {
    return this.noteService.getMyNotes(req.user);
  }

  @Patch(':id')
  updateNote(
    @Param('id') id: number,
    @Body() body: CreateNoteDto,
  ): Promise<Response> {
    return this.noteService.updateNote(id, body);
  }

  @Delete(':id')
  deleteNote(@Param('id') id: number): Promise<Response> {
    return this.noteService.deleteNote(id);
  }
}
