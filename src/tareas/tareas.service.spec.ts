import { Test, TestingModule } from '@nestjs/testing';
import { TareasService } from './tareas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tarea } from './tarea.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('TareasService', () => {
  let service: TareasService;
  let repository: Repository<Tarea>;

  const mockTareaRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TareasService,
        {
          provide: getRepositoryToken(Tarea),
          useValue: mockTareaRepository,
        },
      ],
    }).compile();

    service = module.get<TareasService>(TareasService);
    repository = module.get<Repository<Tarea>>(getRepositoryToken(Tarea));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería retornar todas las tareas', async () => {
    const tareasMock = [{ id: 1, titulo: 'Tarea 1' }];
    mockTareaRepository.find.mockResolvedValue(tareasMock);

    const result = await service.findAll();
    expect(result).toEqual(tareasMock);
    expect(repository.find).toHaveBeenCalled();
  });

  it('debería retornar una tarea por ID', async () => {
    const tareaMock = { id: 1, titulo: 'Tarea 1' };
    mockTareaRepository.findOneBy.mockResolvedValue(tareaMock);

    const result = await service.findOne(1);
    expect(result).toEqual(tareaMock);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('debería lanzar NotFoundException si la tarea no existe', async () => {
    mockTareaRepository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
  });

  it('debería crear una nueva tarea', async () => {
    const tareaDto = { title: 'Nueva Tarea' };
    const tareaCreada = { id: 1, ...tareaDto };

    mockTareaRepository.create.mockReturnValue(tareaDto);
    mockTareaRepository.save.mockResolvedValue(tareaCreada);

    const result = await service.create(tareaDto);
    expect(result).toEqual(tareaCreada);
    expect(repository.create).toHaveBeenCalledWith(tareaDto);
    expect(repository.save).toHaveBeenCalledWith(tareaDto);
  });

  it('debería actualizar una tarea existente', async () => {
    const tareaDto = { title: 'Tarea actualizada' };
    const tareaActualizada = { id: 1, ...tareaDto };

    mockTareaRepository.update.mockResolvedValue(undefined);
    mockTareaRepository.findOneBy.mockResolvedValue(tareaActualizada);

    const result = await service.update(1, tareaDto);
    expect(result).toEqual(tareaActualizada);
    expect(repository.update).toHaveBeenCalledWith(1, tareaDto);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('debería eliminar una tarea por ID', async () => {
    mockTareaRepository.delete.mockResolvedValue(undefined);

    await service.delete(1);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });
});
