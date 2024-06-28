import mongoose, { Schema, model, models } from "mongoose";




const ProjectSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    type: { type: String, enum: ['user', 'system'], required: true }
});

const Project = models.Project || model('Project', ProjectSchema);

export default Project;
