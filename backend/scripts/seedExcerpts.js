import 'dotenv/config';
import { connectDB } from '../db.js';
import Excerpt from '../models/Excerpt.js';
import fs from 'fs';
import path from 'path';

async function seedExcerpts() {
    await connectDB('horn_practice');

    console.log('Clearing existing excerpts…');
    await Excerpt.deleteMany({});

    const filePath = path.resolve('./data/excerpts.json');
    const rawData = fs.readFileSync(filePath);
    const excerptsData = JSON.parse(rawData);

    console.log(`Inserting ${excerptsData.length} excerpts…`);
    const docs = excerptsData.map(e => ({
        excerptNumber: Number(e.excerptNumber),
        slug: e.slug,
        title: e.title,
        composer: e.composer,
        work: e.work,
        key: e.key,
        measureStart: Number(e.measureStart),
        measureEnd: Number(e.measureEnd),
        difficulty: Number(e.difficulty),
        tags: e.tags,
        sheetMusicURL: e.sheetMusicURL,
        audioURL: e.audioURL,
    }));

    await Excerpt.insertMany(docs);
    console.log('Seed complete');
    process.exit(0);
}

seedExcerpts().catch(err => {
    console.error('Error Occurred:', err);
    process.exit(1);
});
