import { CreateTareaDto } from './dto/create-tarea.dto';
import { UpdateTareaDto } from './dto/update-tarea.dto';
import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { Tarea } from './tarea.entity';

@Controller('tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Get()
  findAll(): Promise<Tarea[]> {
    return this.tareasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Tarea> {
    return this.tareasService.findOne(id);
  }

  @Post()
  create(@Body() tarea: Partial<Tarea>): Promise<Tarea> {
    // Validación del campo 'title'
    if (!tarea.title) {
      throw new BadRequestException('El título es obligatorio');
    }
    
    return this.tareasService.create(tarea);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() tarea: Partial<Tarea>): Promise<Tarea> {
    return this.tareasService.update(id, tarea);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.tareasService.delete(id);
  }
}
