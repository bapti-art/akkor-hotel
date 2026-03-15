import mongoose, { Document, Schema } from 'mongoose';

export interface IHotel extends Document {
  id: string;
  name: string;
  location: string;
  description: string;
  picture_list: string[];
  createdAt: Date;
  updatedAt: Date;
}

const hotelSchema = new Schema<IHotel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    picture_list: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = (ret._id as { toString(): string }).toString();
        delete ret._id;
      },
    }
  }
);

export const Hotel = mongoose.model<IHotel>('Hotel', hotelSchema);

export const initHotelModel = (): void => {
  
};
