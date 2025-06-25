import express from 'express';
import Progress from '../models/Progress.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
    try {
        const { excerptSlug, completed, rating, notes } = req.body;
        const prog = await Progress.create({
            user:        req.user._id,
            excerptSlug,
            completed,
            rating,
            notes
        });
        res.status(201).json(prog);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

router.get('/', requireAuth, async (req, res) => {
    try {
        const list = await Progress.find({ user: req.user._id })
            .sort('-practicedAt');
        res.json(list);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
