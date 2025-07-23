import express from 'express';
import {
    getTodaysExcerpt,
    getExcerptBySlug,
    getExcerptByDay,
    createExcerpt,
    updateExcerpt,
    deleteExcerpt,
    getAllExcerpts
} from '../controllers/excerpts.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/today', getTodaysExcerpt);
router.get('/day/:day', getExcerptByDay);
router.get('/all', getAllExcerpts);
router.get('/:slug', getExcerptBySlug);

router.post('/',       requireAdmin, createExcerpt);
router.patch('/:slug', requireAdmin, updateExcerpt);
router.delete('/:slug',requireAdmin, deleteExcerpt);

export default router;
