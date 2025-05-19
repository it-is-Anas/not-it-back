import { Injectable } from '@nestjs/common';
import { Note } from './entities/note.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from '../Types/Response';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note) private noteRepository: Repository<Note>,
  ) {}

  async createNote(body: CreateNoteDto, user): Promise<Response> {
    const id = user.id;
    const note = this.noteRepository.create({
      title: body.title,
      content: body.content,
      user: user,
    });
    try {
      await this.noteRepository.save(note);
    } catch (err) {
      return {
        message: 'Somthing went wrong please try again later',
        status: 422,
      };
    }
    return {
      message: 'New Note Created!',
      data: note,
      status: 201,
    };
  }

  async getMyNotes(user): Promise<Response> {
    let notes;
    try {
      notes = await this.noteRepository.find({
        where: { user: user }, // Use the user object directly
        relations: ['user'], // Optionally include user details if needed
      });
    } catch (err) {
      return {
        message: 'Somthing went wrong please try again later',
        status: 422,
      };
    }
    return {
      data: notes,
      status: 200,
      message: 'Your Notes!',
    };
  }

  async updateNote(id: number, body: CreateNoteDto, user): Promise<Response> {
    let note;
    try {
      note = await this.noteRepository.findOne({
        where: { id },
        relations: ['user'],
      });
    } catch (err) {
      return {
        message: 'Somthing went wrong please try again later',
        status: 422,
      };
    }
    if (!note) {
      throw new Error(`Note with id ${id} not found`);
    }
    if (note.user.id !== user.id) {
      return {
        message: "Sorry You don't have perrmisione to this note",
        status: 403,
      };
    }

    if (body.title !== undefined) note.title = body.title;
    if (body.content !== undefined) note.content = body.content;
    try {
      await this.noteRepository.save(note);
    } catch (err) {
      return {
        message: 'Somthing went wrong please try again later',
        status: 422,
      };
    }
    return {
      message: 'Updated successfull!',
      data: note,
      status: 201,
    };
  }

  async deleteNote(id, user): Promise<Response> {
    let note;
    try {
      note = await this.noteRepository.findOne({
        where: { id },
        relations: ['user'],
      });
    } catch (err) {
      return {
        message: 'Somthing went wrong please try again later',
        status: 422,
      };
    }
    if (!note) {
      throw new Error(`Note with id ${id} not found`);
    }
    if (note.user.id !== user.id) {
      return {
        message: "Sorry You don't have perrmisione to this note",
        status: 403,
      };
    }

    let deletedNote;
    try {
      deletedNote = await this.noteRepository.remove(note);
    } catch (err) {
      return {
        message: 'Somthing went wrong please try again later',
        status: 422,
      };
    }

    return {
      message: 'Note Has been deleted !',
      data: deletedNote,
      status: 201,
    };
  }
}
