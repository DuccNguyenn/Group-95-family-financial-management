import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Incomes } from './schema/income.schema';
import { Model, Types } from 'mongoose';
import { GetIncomeDto } from '@/Module/incomes/dto/get-incomes.dto';

@Injectable()
export class IncomesService {
  constructor(
    @InjectModel(Incomes.name)
    private readonly incomesModel: Model<Incomes>,
  ) {}

  // POST/incomes
  async createIncomes(dto: CreateIncomeDto, userID: string, spaceID: string) {
    const income = await this.incomesModel.create({
      spaceID: new Types.ObjectId(spaceID),
      userID: new Types.ObjectId(userID),
      categoryID: new Types.ObjectId(dto.categoryID),
      amount: dto.amount,
      date: dto.date,
      description: dto.description,
    });
    return income.populate([
      { path: 'categoryID', select: 'name icon' },
      { path: 'userID', select: 'name avatar' },
    ]);
  }

  // GET/incomes
  async getIncomes(
    dto: GetIncomeDto,
    userID: string,
    spaceID: string,
    role: string,
  ) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const skip = (page - 1) * limit;

    const filter: any = { spaceID: new Types.ObjectId(spaceID) };

    if (role === 'member') {
      filter.userID = new Types.ObjectId(userID);
    } else if (dto.userId) {
      filter.userID = new Types.ObjectId(dto.userId);
    }

    if (dto.month || dto.year) {
      const now = new Date();
      const year = dto.year ?? now.getFullYear();
      const month = dto.month ?? now.getMonth() + 1;
      filter.date = {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 0, 23, 59, 59),
      };
    }
    if (dto.categoryId) {
      filter.categoryID = new Types.ObjectId(dto.categoryId);
    }

    const [result, total, summary] = await Promise.all([
      this.incomesModel
        .find(filter)
        .populate('categoryID', 'name icon color')
        .populate('userID', 'name avatar')
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      this.incomesModel.countDocuments(filter),

      this.incomesModel.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    return {
      result,
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
        summary: summary[0]?.total ?? 0,
      },
    };
  }

  //GET/incomes/id (Nguyên)

  update(id: number, updateIncomeDto: UpdateIncomeDto) {
    return `This action updates a #${id} income`;
  }

  remove(id: number) {
    return `This action removes a #${id} income`;
  }
}
