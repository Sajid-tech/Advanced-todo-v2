import mongoose, { Schema, model, models } from "mongoose";



const SubTodoSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: String, ref: 'Project', required: true },
    labelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Label', required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Todo', required: true },
    taskName: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Number, required: true },
    priority: { type: Number },
    isCompleted: { type: Boolean, required: true },
    embedding: { type: [Number] }
});

const SubTodo = models.SubTodo || model('SubTodo', SubTodoSchema);

export default SubTodo;
