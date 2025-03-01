const express = require('express');
const router = express.Router();

// Mock database for product information
const productDatabase = {
  '123456789012': {
    name: 'Organic Cotton T-Shirt',
    brand: 'EcoWear',
    carbonFootprint: 5.2, // kg CO2e
    sustainabilityScore: 8.5,
    materials: ['100% Organic Cotton'],
    ecoFriendlyAlternatives: ['123456789013', '123456789014'],
    imageUrl: 'https://example.com/tshirt.jpg',
  },
  '123456789013': {
    name: 'Recycled Polyester Jacket',
    brand: 'GreenOutdoors',
    carbonFootprint: 7.8,
    sustainabilityScore: 7.2,
    materials: ['80% Recycled Polyester', '20% Organic Cotton'],
    ecoFriendlyAlternatives: ['123456789012'],
    imageUrl: 'https://example.com/jacket.jpg',
  }
};

// Get product by barcode
router.get('/:barcode', (req, res) => {
  const { barcode } = req.params;
  
  if (productDatabase[barcode]) {
    res.json(productDatabase[barcode]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Get all products
router.get('/', (req, res) => {
  res.json(Object.entries(productDatabase).map(([barcode, data]) => ({
    barcode,
    ...data
  })));
});

module.exports = router;