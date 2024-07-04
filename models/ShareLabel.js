import mongoose, { Schema, model, models } from "mongoose";

const ShareLabelSchema = new Schema({
    selectUser: [{ type: String, required: true }],
    projectName: { type: String, required: true },
    email: { type: String, required: true },
});

const ShareLabel = models.ShareLabel || model('ShareLabel', ShareLabelSchema);

export default ShareLabel;
