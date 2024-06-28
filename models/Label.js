import mongoose, { Schema, model, models } from "mongoose";



const LabelSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    type: { type: String, enum: ['user', 'system'], required: true }
});

const Label = models.Label || model('Label', LabelSchema);

export default Label;
