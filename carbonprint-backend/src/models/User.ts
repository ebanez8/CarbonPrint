import mongoose, { Document, Schema } from 'mongoose';

interface IScan {
  barcode: string;
  productName: string;
  timestamp: Date;
  carbonScore: number;
}

interface IUser extends Document {
  username: string;
  scanHistory: IScan[];
}

const scanSchema = new Schema<IScan>({
  barcode: String,
  productName: String,
  timestamp: { type: Date, default: Date.now },
  carbonScore: Number,
});

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  scanHistory: [scanSchema],
});

export default mongoose.model<IUser>('User', userSchema);