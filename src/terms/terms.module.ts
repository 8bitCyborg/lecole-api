import { Module } from '@nestjs/common';
import { TermsService } from './terms.service';
import { TermsController } from './terms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Term, TermSchema } from './schemas/term.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Term.name, schema: TermSchema },
    ]),
  ],
  controllers: [TermsController],
  providers: [TermsService],
})
export class TermsModule {}
