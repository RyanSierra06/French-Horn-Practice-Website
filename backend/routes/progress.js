import express from 'express';
import Progress from '../models/Progress.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
    try {
        const { excerptSlug, completed, rating, notes } = req.body;

        let progress = await Progress.findOne({ 
            user: req.user._id, 
            excerptSlug 
        });
        
        if (progress) {
            progress.completed = completed;
            if (rating) progress.rating = rating;
            if (notes) progress.notes = notes;
            progress.practicedAt = new Date();
            await progress.save();
        } else {
            progress = await Progress.create({
                user: req.user._id,
                excerptSlug,
                completed,
                rating,
                notes
            });
        }
        
        res.status(201).json(progress);
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

router.get('/:excerptSlug', requireAuth, async (req, res) => {
    try {
        const progress = await Progress.findOne({ 
            user: req.user._id, 
            excerptSlug: req.params.excerptSlug 
        });
        res.json(progress || { completed: false });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
