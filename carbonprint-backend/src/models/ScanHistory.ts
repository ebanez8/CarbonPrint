import mongoose, { Schema, Document } from 'mongoose';

export interface IScanHistory extends Document {
  userId: mongoose.Types.ObjectId;
  productId: string;
  productName: string;
  carbonFootprint: number;
  ecoScore: string;
  scannedAt: Date;
}

const ScanHistorySchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  carbonFootprint: { type: Number, default: 0 },
  ecoScore: { type: String, enum: ['a', 'b', 'c', 'd', 'e', 'unknown'], default: 'unknown' },
  scannedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IScanHistory>('ScanHistory', ScanHistorySchema);