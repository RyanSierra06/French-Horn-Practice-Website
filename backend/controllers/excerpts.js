import Excerpt from '../models/Excerpt.js';

export async function getTodaysExcerpt(req, res) {
    try {
        const { user } = req.query;
        console.log('getTodaysExcerpt called with user:', user ? 'present' : 'not present');
        
        if (!user) {
            const EST_OFFSET = -5 * 60;
            const now = new Date();
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            const estNow = new Date(utc + (EST_OFFSET * 60000));
            const startDate = new Date('2023-12-19T00:00:00-05:00');
            const diffTime = estNow - startDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const currentDay = (diffDays % 33) + 1;
            const excerpt = await Excerpt.findOne({ excerptNumber: currentDay.toString() });
            if (!excerpt) return res.status(404).json({ error: 'Excerpt not found' });
            res.json(excerpt);
        } else {
            console.log('Using global excerpt calculation for authenticated user');
            let userData;
            try {
                userData = JSON.parse(user);
                console.log('Parsed user data:', userData);
            } catch (parseError) {
                console.error('Failed to parse user data:', parseError);
                return res.status(400).json({ error: 'Invalid user data format' });
            }

            const EST_OFFSET = -5 * 60;
            const now = new Date();
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            const estNow = new Date(utc + (EST_OFFSET * 60000));
            const startDate = new Date('2023-12-19T00:00:00-05:00');
            const diffTime = estNow - startDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const currentDay = (diffDays % 33) + 1;
            
            console.log('Global current day:', currentDay);
            
            const excerpt = await Excerpt.findOne({ excerptNumber: currentDay.toString() });
            if (!excerpt) return res.status(404).json({ error: 'Excerpt not found' });
            console.log('Returning excerpt for authenticated user:', excerpt.slug);
            res.json(excerpt);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

export async function getExcerptByDay(req, res) {
    try {
        const { day } = req.params;
        const excerpt = await Excerpt.findOne({ excerptNumber: parseInt(day) });
        if (!excerpt) return res.status(404).json({ error: 'Excerpt not found' });
        res.json(excerpt);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

export async function getExcerptBySlug(req, res) {
    try {
        const excerpt = await Excerpt.findOne({ slug: req.params.slug });
        if (!excerpt) return res.status(404).json({ error: 'Not found' });
        res.json(excerpt);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

export async function createExcerpt(req, res) {
    try {
        const newEx = await Excerpt.create(req.body);
        res.status(201).json(newEx);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}

export async function updateExcerpt(req, res) {
    try {
        const updated = await Excerpt.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: 'Not found' });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
}

export async function deleteExcerpt(req, res) {
    try {
        const result = await Excerpt.findOneAndDelete({ slug: req.params.slug });
        if (!result) return res.status(404).json({ error: 'Not found' });
        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

export async function getAllExcerpts(req, res) {
    try {
        const excerpts = await Excerpt.find({});
        res.json(excerpts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch excerpts' });
    }
}
