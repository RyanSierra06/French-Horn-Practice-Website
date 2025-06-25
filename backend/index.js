import 'dotenv/config';
import express from 'express';
import { connectDB } from './db.js';

import excerptsRouter from './routes/excerpts.js';
import authRouter     from './routes/auth.js';
import progressRouter from './routes/progress.js';

async function main() {
    await connectDB('horn_practice');

    const app = express();
    app.use(express.json());

    app.use('/api/auth',     authRouter);
    app.use('/api/excerpts', excerptsRouter);
    app.use('/api/progress', progressRouter);

    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
}

main();
