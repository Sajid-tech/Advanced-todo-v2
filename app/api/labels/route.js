//  get and post

import mongooseConnect from "@/lib/mongoose";
import Account from "@/models/Account";
import Label from "@/models/Label";
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

    const session = await getAuthSession()

    if (!session) {
        return NextResponse.json({ error: "User session is not found" }, { status: 401 })
    }

    await mongooseConnect();

    const { name } = await req.json()

    try {

        // to get userId 
        const userIds = await getUserId(session?.user?.email);
        console.log("shaka laaka", userIds)

        if (!userIds) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const newLabel = await Label.create({
            userId: userIds,
            name,
            email: session?.user?.email
        })

        return NextResponse.json({ newLabel })

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


        const todos = await Label.find({ userId: userIds })
        return NextResponse.json(todos)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
    }
}