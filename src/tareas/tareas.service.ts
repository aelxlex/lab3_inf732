import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea } from './tarea.entity';

@Injectable()
export class TareasService {
    constructor(
        @InjectRepository(Tarea)
        private tareaRepository: Repository<Tarea>,
    ) {}

    findAll(): Promise<Tarea[]> {
        return this.tareaRepository.find();
    }
    
    async findOne(id: number): Promise<Tarea> {
        const tarea = await this.tareaRepository.findOneBy({ id });
        if (!tarea) {
          throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
        }
        return tarea;
      }
    
    create(tarea: Partial<Tarea>): Promise<Tarea> {
        const nuevaTarea = this.tareaRepository.create(tarea);
        return this.tareaRepository.save(nuevaTarea);
    }
    
    async update(id: number, tarea: Partial<Tarea>): Promise<Tarea> {
        await this.tareaRepository.update(id, tarea);
        return this.findOne(id);
    }
    
    async delete(id: number): Promise<void> {
        await this.tareaRepository.delete(id);
    }
}
