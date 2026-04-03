import { Module } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { IncomesController } from './incomes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Incomes, IncomesSchema } from './schema/income.schema';
import {
  Categoris,
  CategorisSchema,
} from '@/Module/categoris/schema/categoris.schema';
import { User, UserSchema } from '@/Module/users/schema/user.shcema';
import { Space, SpaceSchema } from '@/Module/space/schema/space.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Incomes.name, schema: IncomesSchema }]),
    MongooseModule.forFeature([
      { name: Categoris.name, schema: CategorisSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Space.name, schema: SpaceSchema }]),
  ],
  controllers: [IncomesController],
  providers: [IncomesService],
  exports: [IncomesService],
})
export class IncomesModule {}
