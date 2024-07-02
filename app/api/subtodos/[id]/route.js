import mongooseConnect from "@/lib/mongoose";
import SubTodo from "@/models/SubTodo";
import { getAuthSession } from "@/utils/auth";
import { getUserId } from "@/utils/userUtils";
import { NextResponse } from "next/server";



export async function GET(req, { params }) {
    const session = await getAuthSession()

    if (!session) {
        return NextResponse.json({ error: "User session not found" }, { status: 401 });
    }

    await mongooseConnect()

    const { id: parentId } = params;

    try {
        const userIds = await getUserId(session?.user?.email);

        if (!userIds) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }


        const todos = await SubTodo.find({ userId: userIds, parentId })
        return NextResponse.json(todos)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const session = await getAuthSession(req);
    if (!session) {
        return NextResponse.json({ error: "User session not found" }, { status: 401 });
    }

    await mongooseConnect();

    const { id: taskId } = params;

    try {
        const deletedTodo = await SubTodo.findByIdAndDelete({ _id: taskId });




        if (!deletedTodo) {
            return NextResponse.json({ error: "Todo not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Todo deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
    }


}