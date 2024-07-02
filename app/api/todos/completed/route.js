// Handles GET for completed todos

import mongooseConnect from "@/lib/mongoose";
import Todo from "@/models/Todo";
import { getAuthSession } from "@/utils/auth";
import { getUserId } from "@/utils/userUtils";
import { NextResponse } from "next/server";

export async function GET(req) {
    const session = await getAuthSession()
    if (!session) {
        return NextResponse.json({ error: "User session not found" }, { status: 401 });
    }

    await mongooseConnect();

    try {
        const userIds = await getUserId(session?.user?.email);

        if (!userIds) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const completed = await Todo.find({ userId: userIds, isCompleted: false })
        return NextResponse.json(completed)

    } catch (error) {
        return NextResponse.json({ error: "failed to fetch completed todos" }, { status: 500 })
    }
}