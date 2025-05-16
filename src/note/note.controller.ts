import { Controller, Get, Post, Body, Req, Patch, Param } from '@nestjs/common';
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

}
