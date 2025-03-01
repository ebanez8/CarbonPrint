const express = require('express');
const router = express.Router();

// Mock user database
const userDatabase = {
  'user1': {
    id: 'user1',
    name: 'Demo User',
    email: 'demo@example.com',
    scanHistory: [],
    sustainabilityScore: 0,
    carbonSaved: 0
  }
};

// Get user profile
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  
  if (userDatabase[userId]) {
    res.json(userDatabase[userId]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Add scan to user history
router.post('/:userId/scans', (req, res) => {
  const { userId } = req.params;
  const { barcode } = req.body;
  
  if (!barcode) {
    return res.status(400).json({ message: 'Barcode is required' });
  }
  
  if (!userDatabase[userId]) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const scan = {
    barcode,
    timestamp: new Date().toISOString(),
  };
  
  userDatabase[userId].scanHistory.unshift(scan);
  userDatabase[userId].sustainabilityScore += 1;
  userDatabase[userId].carbonSaved += 0.5;
  
  res.status(201).json({
    message: 'Scan added to history',
    scan,
    user: userDatabase[userId]
  });
});

module.exports = router;