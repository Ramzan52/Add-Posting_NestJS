import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class BaseSchema {
  // id: string;

  @Prop({ required: true })
  isDeleted: boolean;

  @Prop({ required: true })
  createdByUsername: string;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  createdOn: Date;

  @Prop({ required: true })
  modifiedByUsername: string;

  @Prop({ required: true })
  modifiedBy: string;

  @Prop({ required: true })
  modifiedOn: Date;
}
