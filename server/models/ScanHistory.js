import mongoose from 'mongoose';

const ScanHistorySchema = new mongoose.Schema({
  barcode: String,
  productName: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  carbonScore: Number,
  brand: String,
  category: String,
  sustainabilityBadges: [String],
  recyclable: Boolean,
  alternatives: [{
    name: String,
    carbonScore: Number,
    savings: Number
  }]
});

const ScanHistory = mongoose.model('ScanHistory', ScanHistorySchema);

export default ScanHistory;