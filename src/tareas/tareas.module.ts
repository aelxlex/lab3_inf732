import { Module } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { TareasController } from './tareas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarea } from './tarea.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tarea])],
  providers: [TareasService],
  controllers: [TareasController]
})
export class TareasModule {}
