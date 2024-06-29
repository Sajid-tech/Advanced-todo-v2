import mongooseConnect from "@/lib/mongoose";
import Account from "@/models/Account";

import { getAuthSession } from "@/utils/auth";
import { NextResponse } from "next/server";



export async function GET(req) {
    await mongooseConnect()

    const session = await getAuthSession()

    if (!session) {
        return NextResponse({ error: "User session not found " }, { status: 401 })

    }

    try {

        const accounts = await Account.find()

        const userIds = accounts.map(account => account.userId)
        console.log("users:", userIds)
        return NextResponse.json({ user: userIds.toString() })

    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
    }
}