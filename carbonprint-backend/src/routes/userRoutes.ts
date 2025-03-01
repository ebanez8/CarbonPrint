import express, { Request, Response, Router } from 'express';
import User from '../models/User';
import { body } from 'express-validator';
import { registerUser, loginUser, getCurrentUser, getProfile, updateProfile } from '../controllers/userController';
import { auth, protect } from '../middleware/auth';

const router: Router = express.Router();

// Create a new user
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user' });
  }
});

// Get user by username
router.get('/:username', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Add a scan to user's history
router.post('/:username/scans', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    user.scanHistory.push(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error adding scan' });
  }
});

router.post('/register', [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').not().isEmpty().withMessage('Name is required')
], registerUser);

router.post('/login', [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').not().isEmpty().withMessage('Password is required')
], loginUser);

// Get current user (protected route)
router.get('/me', auth, getCurrentUser);

router.use(protect); // Protect all routes

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;