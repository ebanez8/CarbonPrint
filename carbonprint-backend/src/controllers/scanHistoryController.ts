import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ScanHistory from '../models/ScanHistory';

// Record a new scan
export const recordScan = async (req: Request, res: Response) => {
  try {
    const { productId, productName, carbonFootprint, ecoScore } = req.body;
    
    // Check if user exists on the request
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    const userId = req.user.id;

    const newScan = new ScanHistory({
      userId,
      productId,
      productName,
      carbonFootprint,
      ecoScore
    });

    await newScan.save();
    
    res.status(201).json({
      success: true,
      data: newScan
    });
  } catch (error) {
    console.error('Error recording scan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record scan',
      error: error.message
    });
  }
};

// Get scan history for a user
export const getUserScanHistory = async (req: Request, res: Response) => {
  try {
    // Check if user exists on the request
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    const userId = req.user.id;
    
    const scanHistory = await ScanHistory.find({ userId })
      .sort({ scannedAt: -1 }) // Most recent first
      .limit(50); // Limit to 50 most recent scans
    
    res.status(200).json({
      success: true,
      count: scanHistory.length,
      data: scanHistory
    });
  } catch (error) {
    console.error('Error fetching scan history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scan history',
      error: error.message
    });
  }
};

// Calculate eco points based on carbon score
export const calculateEcoPoints = (score: number): number => {
  // Lower carbon score means better for environment, so we invert the relationship
  // A score of 0.5 or less is considered good and gives positive points
  // A score above 0.5 gives negative points
  if (score <= 0.5) {
    return Math.round((0.5 - score) * 20); // Up to +10 points for good products
  } else {
    return Math.round((0.5 - score) * 20); // Down to -10 points for bad products
  }
};

// Get scan statistics for a user
export const getUserScanStats = async (req: Request, res: Response) => {
  try {
    // Check if user exists on the request
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    const userId = req.user.id;
    
    const totalScans = await ScanHistory.countDocuments({ userId });
    
    // Calculate total carbon footprint
    const carbonResult = await ScanHistory.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalCarbon: { $sum: "$carbonFootprint" } } }
    ]);
    
    const totalCarbon = carbonResult.length > 0 ? carbonResult[0].totalCarbon : 0;
    
    // Calculate eco points using the same logic as frontend
    const scans = await ScanHistory.find({ userId });
    const ecoPoints = scans.reduce((total, scan) => {
      // Use the calculateEcoPoints function to get points based on carbon footprint
      return total + calculateEcoPoints(scan.carbonFootprint);
    }, 0);
    
    res.status(200).json({
      success: true,
      data: {
        totalScans,
        totalCarbon,
        ecoPoints
      }
    });
  } catch (error) {
    console.error('Error fetching scan statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scan statistics',
      error: error.message
    });
  }
};