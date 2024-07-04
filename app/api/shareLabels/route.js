import mongooseConnect from "@/lib/mongoose";
import ShareLabel from "@/models/ShareLabel";
import { getAuthSession } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST(req) {

    const session = await getAuthSession()

    if (!session) {
        return NextResponse.json({ error: "User session is not found" }, { status: 401 })
    }

    await mongooseConnect();

    const { projectName, selectUser } = await req.json()

    try {

        const newShareLabel = await ShareLabel.create({
            selectUser,
            projectName,
            email: session?.user?.email
        })

        return NextResponse.json({ newShareLabel })

    } catch (error) {
        console.error("Error creating todo:", error);
        return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
    }

}


export async function GET(req) {

    await mongooseConnect()

    const session = await getAuthSession()

    if (!session) {
        return NextResponse.json({ error: "User session not found" }, { status: 401 });
    }

    try {
        const tasks = await ShareLabel.find({ selectUser: { $in: [session?.user.name] } });

        return NextResponse.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }


}