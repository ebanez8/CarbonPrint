import express from 'express';
import { auth } from '../middleware/auth';
import ScanHistory from '../models/ScanHistory';
import { calculateUserStats } from '../utils/stats';

const router = express.Router();

// Save scan history
router.post('/scans', auth, async (req, res) => {
  try {
    const { carbonScore, productName, barcode } = req.body;
    const userId = req.user.userId;

    const scan = new ScanHistory({
      userId,
      carbonScore,
      productName,
      barcode,
      timestamp: new Date()
    });

    await scan.save();

    res.status(201).json({
      success: true,
      data: scan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving scan history'
    });
  }
});

// Get user's scan history
router.get('/scans/history', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const history = await ScanHistory.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50);

    const stats = await calculateUserStats(userId);

    res.json({
      success: true,
      data: {
        history,
        stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching scan history'
    });
  }
});

export default router;