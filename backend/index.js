import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';

import excerptsRouter from './routes/excerpts.js';
import authRouter     from './routes/auth.js';
import progressRouter from './routes/progress.js';

export const GLOBAL_START_DATE = new Date('2023-12-19T00:00:00-05:00');

async function main() {
    await connectDB('horn_practice');

    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use('/api/auth',     authRouter);
    app.use('/api/excerpts', excerptsRouter);
    app.use('/api/progress', progressRouter);

    app.use((err, req, res, next) => {
        console.error('Global error handler:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    });

    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
}

main();
