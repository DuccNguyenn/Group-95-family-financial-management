import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto, JoinSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { GetUser } from '@/decorator/get-user.decorator';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post('create')
  createSpace(@Body() dto: CreateSpaceDto, @GetUser('_id') userId: string) {
    console.log('first', userId);
    return this.spaceService.createSpace(dto, userId);
  }
  @Post('join')
  @HttpCode(HttpStatus.OK)
  joinSpace(@Body() dto: JoinSpaceDto, @GetUser('_id') userId: string) {
    return this.spaceService.joinSpace(dto, userId);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  getMySpace(@GetUser('spaceId') spaceId: string) {
    return this.spaceService.getMySpace(spaceId);
  }
  @Get()
  findAll() {
    return this.spaceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spaceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpaceDto: UpdateSpaceDto) {
    return this.spaceService.update(+id, updateSpaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spaceService.remove(+id);
  }
}
