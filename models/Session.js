import mongoose, { Schema, model, models } from "mongoose";

const SessionSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expires: { type: Number, required: true },
    sessionToken: { type: String, required: true }
})

const Session = models.Session || model("Session", SessionSchema)

export default Session