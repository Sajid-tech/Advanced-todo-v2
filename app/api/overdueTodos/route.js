//  Handle to GET the today todos

import mongooseConnect from "@/lib/mongoose";
import Account from "@/models/Account";
import Todo from "@/models/Todo";
import { getAuthSession } from "@/utils/auth";
import moment from "moment";
import { NextResponse } from "next/server";

// Helper function to get user ID
async function getUserId(email) {

    const accounts = await Account.find({ email });
    const userIds = accounts.map(account => account.userId);
    // Assuming the user ID is stored as a string in the database
    console.log("shaka", userIds.toString())
    return userIds.toString()
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
        const currentStartOfDay = moment().startOf("day");
        const todos = await Todo.find({
            userId: userIds,
            dueDate: { $lte: currentStartOfDay.valueOf() }
        });

        return NextResponse.json(todos)




    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
    }
}

