import { Test, TestingModule } from '@nestjs/testing';
import { TareasController } from './tareas.controller';
import { TareasService } from './tareas.service';
import { Tarea } from './tarea.entity';

describe('TareasController', () => {
  let controller: TareasController;
  let service: TareasService;

  const mockTareasService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TareasController],
      providers: [
        {
          provide: TareasService,
          useValue: mockTareasService,
        },
      ],
    }).compile();

    controller = module.get<TareasController>(TareasController);
    service = module.get<TareasService>(TareasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería retornar todas las tareas', async () => {
    const tareas = [{ id: 1, titulo: 'Tarea 1' }];
    mockTareasService.findAll.mockResolvedValue(tareas);

    const result = await controller.findAll();
    expect(result).toEqual(tareas);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('debería retornar una tarea por ID', async () => {
    const tarea = { id: 1, titulo: 'Tarea 1' };
    mockTareasService.findOne.mockResolvedValue(tarea);

    const result = await controller.findOne(1);
    expect(result).toEqual(tarea);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('debería crear una nueva tarea', async () => {
    const tareaDto = { title: 'Nueva Tarea' };
    const tareaCreada = { id: 1, ...tareaDto };
    mockTareasService.create.mockResolvedValue(tareaCreada);

    const result = await controller.create(tareaDto);
    expect(result).toEqual(tareaCreada);
    expect(service.create).toHaveBeenCalledWith(tareaDto);
  });

  it('debería actualizar una tarea', async () => {
    const tareaDto = { title: 'Tarea actualizada' };
    const tareaActualizada = { id: 1, ...tareaDto };
    mockTareasService.update.mockResolvedValue(tareaActualizada);

    const result = await controller.update(1, tareaDto);
    expect(result).toEqual(tareaActualizada);
    expect(service.update).toHaveBeenCalledWith(1, tareaDto);
  });

  it('debería eliminar una tarea', async () => {
    mockTareasService.delete.mockResolvedValue(undefined);

    await controller.delete(1);
    expect(service.delete).toHaveBeenCalledWith(1);
  });
});
