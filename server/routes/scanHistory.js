import express from 'express';
import ScanHistory from '../models/scanHistory.js';

const router = express.Router();

// Get all scan history
router.get('/', async (req, res) => {
  try {
    const history = await ScanHistory.find().sort({ timestamp: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new scan to history
router.post('/', async (req, res) => {
  const scanData = new ScanHistory(req.body);
  
  try {
    const newScan = await scanData.save();
    res.status(201).json(newScan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user stats
router.get('/stats', async (req, res) => {
  try {
    const history = await ScanHistory.find();
    
    const stats = {
      totalScans: history.length,
      ecoPoints: history.reduce((sum, scan) => sum + (scan.carbonScore < 50 ? 10 : 0), 0),
      carbonSaved: history.reduce((sum, scan) => sum + (scan.carbonScore < 50 ? 2.5 : 0), 0)
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;