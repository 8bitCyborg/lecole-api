import { Module } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { SchoolsController } from './schools.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { School } from './entities/school.entity';
import { SchoolSchema } from './schemas/school.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Class, ClassSchema } from 'src/classes/schemas/classes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: School.name, schema: SchoolSchema },
      { name: User.name, schema: UserSchema },
      { name: Class.name, schema: ClassSchema },
    ]),
  ],
  controllers: [SchoolsController],
  providers: [SchoolsService],
})
export class SchoolsModule {}
