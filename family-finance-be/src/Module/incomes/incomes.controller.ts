import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { GetUser } from '@/decorator/get-user.decorator';
import { GetIncomeDto } from '@/Module/incomes/dto/get-incomes.dto';

@Controller('incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Get('summary')
  getSummary(
    @Query('month') month: string,
    @Query('year') year: string,
    @GetUser('spaceId') spaceId: string,
  ) {}

  //POST/incomes
  @Post()
  create(
    @Body() dto: CreateIncomeDto,
    @GetUser('_id') userId: string,
    @GetUser('spaceId') spaceId: string,
  ) {
    return this.incomesService.createIncomes(dto, userId, spaceId);
  }

  @Get()
  findAll(
    @Query() query: GetIncomeDto,
    @GetUser('_id') userId: string,
    @GetUser('spaceId') spaceId: string,
    @GetUser('role') role: string,
  ) {
    return this.incomesService.getIncomes(query, userId, spaceId, role);
  }
}
