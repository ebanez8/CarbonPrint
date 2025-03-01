import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Import models
import './models/ScanHistory';
import './models/User';
// Import other models as needed

// Import routes
import userRoutes from './routes/userRoutes';
import scanHistoryRoutes from './routes/scanHistoryRoutes';
import productRoutes from './routes/productRoutes';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carbonprint';

// Log environment variables (for debugging)
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: PORT,
  MONGODB_URI_PREFIX: MONGODB_URI.substring(0, 20) + '...' // Only log prefix for security
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB with better error handling
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Please check your MongoDB credentials and connection string');
    // Don't exit process to allow for development restart
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/scans', scanHistoryRoutes);
app.use('/api/products', productRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('CarbonPrint API is running');
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    status: 'ok',
    timestamp: new Date(),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
  console.error('Unhandled Rejection:', reason);
  // Don't exit the process in development to allow for hot reloading
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});