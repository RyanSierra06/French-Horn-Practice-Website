import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { GLOBAL_START_DATE } from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const excerptsPath = path.join(__dirname, '../data/excerpts.json');
const excerpts = JSON.parse(fs.readFileSync(excerptsPath, 'utf-8'));

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        console.log('Register request body:', req.body);
        const { username, email, password } = req.body;

        const EST_OFFSET = -5 * 60;
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const today = new Date(utc + (EST_OFFSET * 60000));

        const daysSinceGlobalStart = Math.floor((today - GLOBAL_START_DATE) / (1000 * 60 * 60 * 24));
        const currentDay = (daysSinceGlobalStart % 33) + 1;

        const personalDay = 1;

        const startExcerptIndex = currentDay - 1;
        
        const user = new User({ 
            username, 
            email, 
            password, 
            startDate: today,
            currentDay: personalDay,
            startExcerptIndex: startExcerptIndex
        });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        res.status(201).json({ 
            token, 
            user: { 
                id: user._id, 
                username, 
                email, 
                isAdmin: user.isAdmin,
                startDate: user.startDate,
                currentDay: user.currentDay,
                startExcerptIndex: user.startExcerptIndex
            } 
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        res.json({ 
            token, 
            user: { 
                id: user._id, 
                username: user.username, 
                email, 
                isAdmin: user.isAdmin,
                startDate: user.startDate,
                currentDay: user.currentDay,
                startExcerptIndex: user.startExcerptIndex
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/me/favorites', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.favorites || []);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

router.post('/me/favorites', requireAuth, async (req, res) => {
    try {
        const { excerptSlug } = req.body;
        if (!excerptSlug) return res.status(400).json({ error: 'No excerptSlug provided' });
        const user = await User.findById(req.user._id);
        const idx = user.favorites.indexOf(excerptSlug);
        if (idx === -1) {
            user.favorites.push(excerptSlug);
        } else {
            user.favorites.splice(idx, 1);
        }
        await user.save();
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update favorites' });
    }
});

router.get('/me', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const EST_OFFSET = -5 * 60;
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const today = new Date(utc + (EST_OFFSET * 60000));
        const startDate = new Date(user.startDate);
        const diffTime = today - startDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        let personalDay = diffDays + 1;
        if (personalDay > 33) {
            personalDay = 33;
        }

        if (user.currentDay !== personalDay) {
            user.currentDay = personalDay;
            await user.save();
        }

        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            startDate: user.startDate,
            currentDay: user.currentDay,
            startExcerptIndex: user.startExcerptIndex,
            favorites: user.favorites || []
        });
    } catch (err) {
        console.error('Error fetching user info:', err);
        res.status(500).json({ error: 'Failed to fetch user info' });
    }
});

export default router;
