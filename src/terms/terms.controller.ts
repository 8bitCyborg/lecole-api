import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TermsService } from './terms.service';
import { CreateTermDto } from './dto/create-term.dto';
import { UpdateTermDto } from './dto/update-term.dto';

@Controller('terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) {}
  
  @Get(':sessionId')
  findAll(
    @Param('sessionId') sessionId: string
  ) {
    return this.termsService.findAll(sessionId);
  }
 
}
