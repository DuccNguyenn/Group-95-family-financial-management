import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Space, SpaceSchema } from './schema/space.schema';
import { User, UserSchema } from '../users/schema/user.shcema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Space.name, schema: SpaceSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET')!,
        signOptions: {
          // SỬA: đổi '1000d' → '7d' — hợp lý hơn cho production
          expiresIn: (configService.get<string>('JWT_ACCESS_TOKEN_EXPIRED') ||
            '7d') as any,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SpaceController],
  providers: [SpaceService],
  exports: [SpaceService, MongooseModule],
})
export class SpaceModule {}
