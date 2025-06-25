import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    excerptSlug: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    notes: {
        type: String
    },
    practicedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
