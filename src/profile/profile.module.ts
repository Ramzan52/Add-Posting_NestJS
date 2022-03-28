import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Profile, ProfileSchema } from './schemas/profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
  ],
  exports: [ProfileService],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
