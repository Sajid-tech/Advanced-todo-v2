import mongooseConnect from "@/lib/mongoose";
import SubTodo from "@/models/SubTodo";
import { getAuthSession } from "@/utils/auth";
import { getUserId } from "@/utils/userUtils";
import { NextResponse } from "next/server";


export async function POST(req,) {
    const session = await getAuthSession();
    if (!session) {
        return NextResponse.json({ error: "User session not found" }, { status: 401 });
    }

    await mongooseConnect();

    const { taskName, description, priority, dueDate, projectId, labelId, parentId, embedding } = await req.json();

    try {

        // to get userId 
        const userIds = await getUserId(session?.user?.email);
        // console.log("shaka laaka", userIds)

        if (!userIds) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Create new Todo with userId as ObjectId
        const newTodo = await SubTodo.create({
            userId: userIds,
            taskName,
            description,
            priority,
            dueDate: parseInt(dueDate),
            projectId: "project",
            labelId,
            isCompleted: false,
            parentId,
            embedding
        });

        return NextResponse.json({ message: "Todo created", todo: newTodo }, { status: 201 });
    } catch (error) {
        console.error("Error creating todo:", error);
        return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
    }
}
