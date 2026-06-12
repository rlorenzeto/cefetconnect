import { PartialType } from '@nestjs/swagger';
import { CreateIconeDto } from './create-icone.dto';

export class UpdateIconeDto extends PartialType(CreateIconeDto) {}
