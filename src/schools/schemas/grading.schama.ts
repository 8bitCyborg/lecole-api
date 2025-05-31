// grading-scheme.schema.ts
import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class GradingScheme {
  @Prop({ default: 75 })
  A: number;

  @Prop({ default: 60 })
  B: number;

  @Prop({ default: 55 })
  C: number;

  @Prop({ default: 50 })
  D: number;

  @Prop({ default: 45 })
  E: number;

  @Prop({ default: 40 })
  F: number;

  @Prop({ default: 30 })
  ca: number;

  @Prop({ default: 70 })
  exam: number;
}
