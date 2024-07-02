import mongooseConnect from "@/lib/mongoose";
import Todo from "@/models/Todo";
import { getAuthSession } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
    const session = await getAuthSession(req);
    if (!session) {
        return NextResponse.json({ error: "User session not found" }, { status: 401 });
    }

    await mongooseConnect();

    const { id: taskId } = params;

    const updatedTodo = await Todo.findByIdAndUpdate(taskId, { isCompleted: false }, { new: true });

    return NextResponse.json({ message: "Todo unchecked", todo: updatedTodo });
}