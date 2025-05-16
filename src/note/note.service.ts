import { Injectable } from '@nestjs/common';
import { Note } from './entities/note.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from '../Types/Response';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note) private noteRepository: Repository<Note>,
  ) {}

  async createNote(body, user): Promise<Response> {
    const id = user.id;
    const note = this.noteRepository.create({
      title: body.title,
      content: body.content,
      user: user,
    });
    await this.noteRepository.save(note);
    return {
      message: 'New Note Created!',
      data: note,
      status: 201,
    };
  }

  async getMyNotes(user): Promise<Response> {
    const notes = await this.noteRepository.find({
      where: { user: user }, // Use the user object directly
      relations: ['user'], // Optionally include user details if needed
    });
    return {
      data: notes,
      status: 200,
      message: 'Your Notes!',
    };
  }
}
