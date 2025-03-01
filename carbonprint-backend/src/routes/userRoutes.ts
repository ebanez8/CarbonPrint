import express, { Request, Response, Router } from 'express';
import User from '../models/User';

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

export default router;