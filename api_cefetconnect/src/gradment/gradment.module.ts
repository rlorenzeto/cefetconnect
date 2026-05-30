import { Module } from '@nestjs/common';
import { GradmentService } from './gradment.service';

@Module({
  providers: [GradmentService],
  exports: [GradmentService],
})
export class GradmentModule {}
