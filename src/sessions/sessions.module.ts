import { Session, SessionSchema } from './schemas/session.schema';
import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { School, SchoolSchema } from 'src/schools/schemas/school.schema';
import { Term, TermSchema } from 'src/terms/schemas/term.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: School.name, schema: SchoolSchema },
      { name: Term.name, schema: TermSchema },
    ]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
