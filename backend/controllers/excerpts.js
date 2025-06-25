import Excerpt from '../models/Excerpt.js';

export async function getTodaysExcerpt(req, res) {
    try {
        const total = await Excerpt.countDocuments();
        if (total === 0) return res.status(404).json({ error: 'No excerpts available' });

        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

        const idx = dayOfYear % total;
        const excerpt = await Excerpt.findOne()
            .sort({ dateAdded: 1 })
            .skip(idx);

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
