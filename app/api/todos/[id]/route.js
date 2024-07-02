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
    const { taskName, description, priority, dueDate, isCompleted, labelId, embedding } = await req.json();

    const updatedTodo = await Todo.findByIdAndUpdate(taskId, {
        taskName,
        description,
        priority,
        dueDate,
        isCompleted,
        labelId,
        projectId: "project",
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

    const { id: taskId } = params;

    try {
        const deletedTodo = await Todo.findByIdAndDelete({ _id: taskId });

        if (!deletedTodo) {
            return NextResponse.json({ error: "Todo not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Todo deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
    }


}