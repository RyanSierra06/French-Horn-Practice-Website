import mongoose from 'mongoose';

const ExcerptSchema = new mongoose.Schema({
    excerptNumber: {
        type: Number,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    composer: {
        type: String,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    measureStart: {
        type: Number,
        required: true
    },
    measureEnd: {
        type: Number,
        required: true
    },
    difficulty: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    sheetMusicURL: {
        type: String,
        required: true
    },
    audioURL: {
        type: String,
        required: true
    },
});

ExcerptSchema.index({ title: 'text', composer: 'text' });

export default mongoose.models.Excerpt ||
    mongoose.model('Excerpt', ExcerptSchema);
