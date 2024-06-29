import mongooseConnect from "@/lib/mongoose";
import Account from "@/models/Account";
import Todo from "@/models/Todo";
import { getAuthSession } from "@/utils/auth";
import { NextResponse } from "next/server";


// Helper function to get user ID
async function getUserId(email) {

    const accounts = await Account.find({ email });
    const userIds = accounts.map(account => account.userId);
    // Assuming the user ID is stored as a string in the database
    console.log("shaka", userIds.toString())
    return userIds.toString()
}

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
        console.log("shaka laaka", userIds)

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
            projectId,
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

