import mongoose, { model, models } from 'mongoose';
import { Schema } from 'mongoose';

const shareProjectSchema = new Schema({
    parentShareId: String,
    taskTitle: String,
    description: String,
    dueDate: Date,
    priority: {
        type: Number,
    },
    isCompleted: Boolean,
    recipients: [{ type: String, required: true }],
    email: String,
    labels: [String],
    comments: String,
}, {
    timestamps: true
});

const ShareProject = models.ShareProject || model('ShareProject', shareProjectSchema);

export default ShareProject;