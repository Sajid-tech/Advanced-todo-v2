import mongoose, { Schema, model, models } from "mongoose";


const TodoSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: String, ref: 'Project', required: true },
    labelId: { type: String, ref: 'Label', required: true },
    taskName: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Number, required: true },
    priority: { type: Number },
    isCompleted: { type: Boolean, required: true },
    embedding: { type: [Number] }
});

const Todo = models.Todo || model("Todo", TodoSchema)

export default Todo