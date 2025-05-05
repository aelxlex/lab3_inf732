import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tarea } from '../src/tareas/tarea.entity';
import { Repository, DataSource } from 'typeorm';

describe('TareasController (e2e)', () => {
  let app: INestApplication;
  let tareaRepository: Repository<Tarea>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    tareaRepository = moduleFixture.get<Repository<Tarea>>(
      getRepositoryToken(Tarea),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    const dataSource = app.get(DataSource);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  afterEach(async () => {
    await tareaRepository.clear();
  });

  describe('/tareas (POST)', () => {
    it('debería crear una nueva tarea', async () => {
      const nuevaTarea = {
        title: 'Tarea de prueba',
        content: 'Descripción de prueba',
      };

      const response = await request(app.getHttpServer())
        .post('/tareas')
        .send(nuevaTarea)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toEqual(nuevaTarea.title);
      expect(response.body.content).toEqual(nuevaTarea.content);
    });

    it('debería fallar si no se proporciona el título', async () => {
      const response = await request(app.getHttpServer())
        .post('/tareas')
        .send({ content: 'Sin título' })
        .expect(400);

      expect(response.body.message).toContain('El título es obligatorio');
    });
  });

  describe('/tareas (GET)', () => {
    it('debería retornar todas las tareas', async () => {
      await tareaRepository.save({ title: 'Tarea 1', content: 'Desc 1' });
      await tareaRepository.save({ title: 'Tarea 2', content: 'Desc 2' });

      const response = await request(app.getHttpServer())
        .get('/tareas')
        .expect(200);

      expect(response.body.length).toBe(2);
    });
  });

  describe('/tareas/:id (GET)', () => {
    it('debería retornar una tarea por ID', async () => {
      const tarea = await tareaRepository.save({
        title: 'Buscar por ID',
        content: 'Descripción',
      });

      const response = await request(app.getHttpServer())
        .get(`/tareas/${tarea.id}`)
        .expect(200);

      expect(response.body.title).toEqual(tarea.title);
    });

    it('debería devolver 404 si no existe', async () => {
      await request(app.getHttpServer())
        .get('/tareas/999')
        .expect(404);
    });
  });

  describe('/tareas/:id (PUT)', () => {
    it('debería actualizar una tarea', async () => {
      const tarea = await tareaRepository.save({
        title: 'Original',
        content: 'Desc',
      });

      const response = await request(app.getHttpServer())
        .put(`/tareas/${tarea.id}`)
        .send({ title: 'Actualizada', content: 'Nueva desc' })
        .expect(200);

      expect(response.body.title).toEqual('Actualizada');
    });
  });

  describe('/tareas/:id (DELETE)', () => {
    it('debería eliminar una tarea', async () => {
      const tarea = await tareaRepository.save({
        title: 'Eliminarme',
        content: 'Desc',
      });

      await request(app.getHttpServer())
        .delete(`/tareas/${tarea.id}`)
        .expect(200);
    });
  });
});
