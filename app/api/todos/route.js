import mongooseConnect from "@/lib/mongoose";
import Todo from "@/models/Todo";
import { getAuthSession } from "@/utils/auth";
import { getUserId } from "@/utils/userUtils";
import { NextResponse } from "next/server";



export async function POST(req) {
    const session = await getAuthSession();
    if (!session) {
        return NextResponse.json({ error: "User session not found" }, { status: 401 });
    }

    await mongooseConnect();

    const { taskName, description, priority, dueDate, projectId, labelId, embedding } = await req.json();

    try {

        // to get userId 
        const userIds = await getUserId(session?.user?.email);
        // console.log("shaka laaka", userIds)

        if (!userIds) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Create new Todo with userId as ObjectId
        const newTodo = await Todo.create({
            userId: userIds,
            taskName,
            description,
            priority,
            dueDate: parseInt(dueDate),
            projectId: "project",
            labelId,
            isCompleted: false,
            embedding
        });

        return NextResponse.json({ message: "Todo created", todo: newTodo }, { status: 201 });
    } catch (error) {
        console.error("Error creating todo:", error);
        return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
    }
}


export async function GET(req) {
    const session = await getAuthSession()

    if (!session) {
        return NextResponse.json({ error: "User session not found" }, { status: 401 });
    }

    await mongooseConnect()

    try {
        const userIds = await getUserId(session?.user?.email);

        if (!userIds) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }


        const todos = await Todo.find({ userId: userIds }).populate('labelId')
        return NextResponse.json(todos)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
    }
}

