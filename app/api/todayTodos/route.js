//  Handle to GET the today todos

import mongooseConnect from "@/lib/mongoose";
import Todo from "@/models/Todo";
import { getAuthSession } from "@/utils/auth";
import { getUserId } from "@/utils/userUtils";
import moment from "moment";
import { NextResponse } from "next/server";



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
        const todayStart = moment().startOf('day');
        const todayEnd = moment().endOf('day');
        const todos = await Todo.find({
            userId: userIds,
            dueDate: {
                $gte: todayStart.valueOf(), // Using moment methods to get timestamps
                $lte: todayEnd.valueOf()
            }
        });

        return NextResponse.json(todos)




    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
    }
}

