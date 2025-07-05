import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class AnnouncementsSchema {
  @Prop()
  title: string;

  @Prop()
  message: string;

  @Prop()
  priority: string;
}
