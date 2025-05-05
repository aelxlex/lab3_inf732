import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateTareaDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;
}
