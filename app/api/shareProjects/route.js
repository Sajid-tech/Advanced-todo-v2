import mongooseConnect from "@/lib/mongoose";
import ShareProject from "@/models/ShareProject";
import { getAuthSession } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
    const session = await getAuthSession();
    if (!session) {
        return NextResponse.json({ error: "User session not found" }, { status: 401 });
    }

    await mongooseConnect();

    const {
        taskTitle,
        description,
        dueDate,
        priority,
        labels,
        comments,
        parentShareId,
        recipients,
    } = await req.json();

    try {
        const newShareProject = await ShareProject.create({
            parentShareId,
            taskTitle,
            description,
            dueDate: new Date(parseInt(dueDate)),
            priority,
            isCompleted: false,
            recipients: Array.isArray(recipients) ? recipients : [],
            email: session.user.email,
            labels,
            comments,
        });
        console.log("Received data:", { taskTitle, description, dueDate, priority, labels, comments, parentShareId, recipients });
        return NextResponse.json({ message: "Shared project task created", shareProject: newShareProject }, { status: 201 });

    } catch (error) {
        console.error("Error creating shared project task:", error);
        return NextResponse.json({ error: "Failed to create shared project task", details: error.message }, { status: 500 });
    }
}



