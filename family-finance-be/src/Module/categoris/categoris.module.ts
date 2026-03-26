import { Module } from '@nestjs/common';
import { CategorisService } from './categoris.service';
import { CategorisController } from './categoris.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Categoris, CategorisSchema } from './schema/categoris.schema';
import { Space, SpaceSchema } from '@/Module/space/schema/space.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Categoris.name, schema: CategorisSchema },
      { name: Space.name, schema: SpaceSchema },
    ]),
  ],
  controllers: [CategorisController],
  providers: [CategorisService],
  exports: [CategorisService],
})
export class CategorisModule {}
