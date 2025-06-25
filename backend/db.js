import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

export async function connectDB(dbName) {
    const baseUri = process.env.MONGO_URI;

    const uri = baseUri.includes('?')
        ? baseUri.replace(/\/\?/, `/${dbName}?`)
        : `${baseUri}/${dbName}`;

    try {
        await mongoose.connect(uri);
        console.log(`Connected to DB: ${dbName}`);
    } catch (error) {
        console.error('Error Connection to DB: ', error);
        process.exit(1);
    }
}
