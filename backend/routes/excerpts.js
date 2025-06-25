import express from 'express';
import {
    getTodaysExcerpt,
    getExcerptBySlug,
    createExcerpt,
    updateExcerpt,
    deleteExcerpt
} from '../controllers/excerpts.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/today', getTodaysExcerpt);
router.get('/:slug', getExcerptBySlug);

router.post('/',       requireAdmin, createExcerpt);
router.patch('/:slug', requireAdmin, updateExcerpt);
router.delete('/:slug',requireAdmin, deleteExcerpt);

export default router;
