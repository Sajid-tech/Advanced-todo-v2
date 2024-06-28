import mongoose, { Schema, model, models } from "mongoose";


const TodoSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    labelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Label', required: true },
    taskName: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Number, required: true },
    priority: { type: Number },
    isCompleted: { type: Boolean, required: true },
    embedding: { type: [Number] }
});

const Todo = models.Todo || model("Todo", TodoSchema)

export default Todo