import express, { Request, Response, Router } from 'express';
import { protect as auth } from '../middleware/auth';

const router: Router = express.Router();

// Mock database for product information (temporary)
// In a real application, you would use a database model
const productDatabase: Record<string, any> = {
  '123456789012': {
    name: 'Eco-friendly Water Bottle',
    brand: 'GreenLife',
    carbonFootprint: 5.2,
    ecoRating: 4.5,
    materials: ['Recycled Plastic', 'Silicone'],
    recyclable: true,
    imageUrl: 'https://example.com/eco-bottle.jpg'
  },
  '987654321098': {
    name: 'Organic Cotton T-shirt',
    brand: 'EcoWear',
    carbonFootprint: 2.8,
    ecoRating: 4.8,
    materials: ['Organic Cotton'],
    recyclable: true,
    imageUrl: 'https://example.com/eco-tshirt.jpg'
  },
  // Add more mock products as needed
};

// Get product by barcode
router.get('/:barcode', (req: Request, res: Response): void => {
  const { barcode } = req.params;
  
  if (productDatabase[barcode]) {
    res.json({
      success: true,
      data: {
        barcode,
        ...productDatabase[barcode]
      }
    });
  } else {
    res.status(404).json({
      success: false,
      message: `Product with barcode ${barcode} not found`
    });
  }
});

// Get all products
router.get('/', (req: Request, res: Response): void => {
  const products = Object.entries(productDatabase).map(([barcode, data]) => ({
    barcode,
    ...data
  }));
  
  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

// Add a new product (protected route)
router.post('/', auth, (req: Request, res: Response): void => {
  const { barcode, name, brand, carbonFootprint, ecoRating, materials, recyclable, imageUrl } = req.body;
  
  if (!barcode || !name) {
    res.status(400).json({
      success: false,
      message: 'Barcode and name are required fields'
    });
    return;
  }
  
  if (productDatabase[barcode]) {
    res.status(400).json({
      success: false,
      message: `Product with barcode ${barcode} already exists`
    });
    return;
  }
  
  productDatabase[barcode] = {
    name,
    brand,
    carbonFootprint,
    ecoRating,
    materials,
    recyclable,
    imageUrl
  };
  
  res.status(201).json({
    success: true,
    data: {
      barcode,
      ...productDatabase[barcode]
    }
  });
});

// Update a product (protected route)
router.put('/:barcode', auth, (req: Request, res: Response): void => {
  const { barcode } = req.params;
  
  if (!productDatabase[barcode]) {
    res.status(404).json({
      success: false,
      message: `Product with barcode ${barcode} not found`
    });
    return;
  }
  
  const updatedProduct = {
    ...productDatabase[barcode],
    ...req.body
  };
  
  productDatabase[barcode] = updatedProduct;
  
  res.json({
    success: true,
    data: {
      barcode,
      ...updatedProduct
    }
  });
});

// Delete a product (protected route)
router.delete('/:barcode', auth, (req: Request, res: Response): void => {
  const { barcode } = req.params;
  
  if (!productDatabase[barcode]) {
    res.status(404).json({
      success: false,
      message: `Product with barcode ${barcode} not found`
    });
    return;
  }
  
  delete productDatabase[barcode];
  
  res.json({
    success: true,
    message: `Product with barcode ${barcode} has been deleted`
  });
});

export default router;