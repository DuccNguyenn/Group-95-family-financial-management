import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSpaceDto, JoinSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { Model, Types } from 'mongoose';
import { Space, SpaceDocument } from '@/Module/space/schema/space.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@/Module/users/schema/user.shcema';

@Injectable()
export class SpaceService {
  constructor(
    @InjectModel(Space.name) private spaceModel: Model<SpaceDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Sinh ra mã mời ngẫu nhiên có 6 kí tự
  private generateInviteCode(): string {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

  //Sinh mã mời không bị trùng trong database
  private async generateUniqueInviteCode(): Promise<string> {
    let code: string;
    let isUnique = false;
    do {
      code = this.generateInviteCode();
      const existingSpace = await this.spaceModel.findOne({
        invitedCode: code,
      });
      if (!existingSpace) {
        isUnique = true;
      }
    } while (!isUnique);
    return code;
  }

  //Tạo phòng => userId= người tạo sẽ tự đọng thành parent
  async createSpace(dto: CreateSpaceDto, userId: string) {
    console.log(userId);
    const user = await this.userModel.findById(userId); // Kiểm tra user có tồn tại không
    if (!user) throw new BadRequestException('Không tìm thấy user');
    if (user.spaceId) throw new BadRequestException('User đã có trong phòng');

    const inviteCode = await this.generateUniqueInviteCode();

    //Tạo phòng
    const space = await this.spaceModel.create({
      name: dto.name,
      membersId: [new Types.ObjectId(userId)],
      invitedCode: inviteCode,
      alertThresholds: dto.alertThresholds ?? [80, 100],
      createdBy: new Types.ObjectId(userId),
    });

    // Cập nhập role và spaceId cho user
    await this.userModel.updateOne(
      { _id: userId },
      { spaceId: space._id, role: 'parent' },
    );

    return {
      _id: space._id,
      name: space.name,
      inviteCode: space.invitedCode,
      role: 'parent',
    };
  }

  //Vào phòng bằng mã mờ => role = member
  async joinSpace(dto: JoinSpaceDto, userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new BadRequestException('Không tìm thấy user');
    if (user.spaceId) throw new BadRequestException('Bạn đã có trong phòng');

    const space = await this.spaceModel.findOne({
      invitedCode: dto.invitedCode.toUpperCase(),
    });

    if (!space) {
      throw new BadRequestException('Mã mời không hợp lệ');
    }

    //Thêm user vào memberID
    await this.spaceModel.updateOne(
      { _id: space._id },
      { $addToSet: { membersId: new Types.ObjectId(userId) } },
    );

    //Cập nhập role và spaceId cho user
    await this.userModel.updateOne(
      { _id: userId },
      { spaceId: space._id, role: 'member' },
    );

    return {
      _id: space._id,
      name: space.name,
      inviteCode: space.invitedCode,
      role: 'member',
    };
  }

  // Láy thông tin phòng
  async getMySpace(spaceId: string) {
    const space = await this.spaceModel
      .findById(spaceId)
      .populate('membersId', 'name avatar role')
      .populate('createdBy', 'name')
      .lean();

    if (!space) throw new BadRequestException('Không tìm thấy phòng');
    return space;
  }

  //Cập nhập thông tin phòng
  async updateSpace()
  findAll() {
    return `This action returns all space`;
  }

  findOne(id: number) {
    return `This action returns a #${id} space`;
  }

  update(id: number, updateSpaceDto: UpdateSpaceDto) {
    return `This action updates a #${id} space`;
  }

  remove(id: number) {
    return `This action removes a #${id} space`;
  }
}
