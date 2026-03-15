import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBooking extends Document {
  id: string;
  userId: Types.ObjectId | string;
  hotelId: Types.ObjectId | string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  status: 'confirmed' | 'cancelled' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    email: string;
    pseudo: string;
  };
  hotel?: {
    id: string;
    name: string;
    location: string;
  };
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'pending'],
      default: 'pending',
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

        if (ret.userId && typeof ret.userId === 'object' && 'toString' in (ret.userId as object)) {
          ret.userId = (ret.userId as { toString(): string }).toString();
        }

        if (ret.hotelId && typeof ret.hotelId === 'object' && 'toString' in (ret.hotelId as object)) {
          ret.hotelId = (ret.hotelId as { toString(): string }).toString();
        }
      },
    }
  }
);

bookingSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

bookingSchema.virtual('hotel', {
  ref: 'Hotel',
  localField: 'hotelId',
  foreignField: '_id',
  justOne: true,
});

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

export const initBookingModel = (): void => {
  
};

export const setupAssociations = (): void => {
  
};
