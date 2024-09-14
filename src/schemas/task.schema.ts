import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Weather {
  @Prop({ type: Number, required: true })
  temperature: number;

  @Prop({ type: String, required: true })
  condition: string;
}

@Schema()
export class Task {
  @Prop({ type: String, default: uuidv4, unique: true })
  id: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: Boolean, default: false })
  completed: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: Weather, required: true })
  weather: Weather;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
export const WeatherSchema = SchemaFactory.createForClass(Weather);
