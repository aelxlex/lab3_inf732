import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTareaDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  content: string;
}
