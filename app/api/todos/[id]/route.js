import mongooseConnect from "@/lib/mongoose";
import Todo from "@/models/Todo";
import { getAuthSession } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    const session = await getAuthSession(req);
    if (!session) {
        return NextResponse.json({ error: "User session not found" }, { status: 401 });
    }

    await mongooseConnect();

    const { taskId } = params;
    const { taskName, description, priority, dueDate, isCompleted, labelId, projectId, embedding } = await req.json();

    const updatedTodo = await Todo.findByIdAndUpdate(taskId, {
        taskName,
        description,
        priority,
        dueDate,
        isCompleted,
        labelId,
        projectId,
        embedding
    }, { new: true });

    return NextResponse.json({ message: "Todo updated", todo: updatedTodo });
}


export async function DELETE(req, { params }) {
    const session = await getAuthSession(req);
    if (!session) {
        return NextResponse.json({ error: "User session not found" }, { status: 401 });
    }

    await mongooseConnect();

    const { taskId } = params;

    await Todo.findByIdAndDelete(taskId);

    return NextResponse.json({ message: "Todo deleted" });
}