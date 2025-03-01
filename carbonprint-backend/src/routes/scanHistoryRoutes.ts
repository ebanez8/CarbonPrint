import express, { Request, Response, Router } from 'express';
import { getUserScanHistory } from '../controllers/scanHistoryController';

const router: Router = express.Router();

// Get scan history for a user
router.get('/user/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    // Add the user ID to the request object for the controller
    req.user = { id: userId };
    
    // Call the controller function
    await getUserScanHistory(req, res);
  } catch (error) {
    console.error('Error in scan history route:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching scan history',
      error: error.message
    });
  }
});

// Add a new scan to history
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, productId, productName, carbonFootprint, sustainabilityScore } = req.body;
    
    if (!userId || !productId) {
      res.status(400).json({
        success: false,
        message: 'User ID and Product ID are required'
      });
      return;
    }
    
    // Import the model directly in the route handler to avoid circular dependencies
    const ScanHistory = require('../models/ScanHistory').default;
    
    const newScan = new ScanHistory({
      userId,
      productId,
      productName: productName || 'Unknown Product',
      carbonFootprint: carbonFootprint || 0,
      sustainabilityScore: sustainabilityScore || 0,
      scannedAt: new Date()
    });
    
    const savedScan = await newScan.save();
    
    res.status(201).json({
      success: true,
      data: savedScan
    });
  } catch (error) {
    console.error('Error adding scan to history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add scan to history',
      error: error.message
    });
  }
});

// Get a specific scan by ID
router.get('/:scanId', async (req: Request, res: Response): Promise<void> => {
  try {
    const scanId = req.params.scanId;
    
    // Import the model directly in the route handler
    const ScanHistory = require('../models/ScanHistory').default;
    
    const scan = await ScanHistory.findById(scanId);
    
    if (!scan) {
      res.status(404).json({
        success: false,
        message: 'Scan not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: scan
    });
  } catch (error) {
    console.error('Error fetching scan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scan',
      error: error.message
    });
  }
});

export default router;