import mongooseConnect from "@/lib/mongoose";
import ShareProject from "@/models/ShareProject";
import { getAuthSession } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    await mongooseConnect();
    const { id: shareId } = params;

    const session = await getAuthSession();

    if (!session) {
        return NextResponse.json({ error: "User session not found" }, { status: 401 });
    }

    try {
        const tasks = await ShareProject.find({ recipients: session.user.name, parentShareId: shareId });
        return NextResponse.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}



export async function DELETE(req, { params }) {
    await mongooseConnect();
    const { id: shareId } = params;

    const session = await getAuthSession();

    if (!session) {
        return NextResponse.json({ error: "User session not found" }, { status: 401 });
    }

    try {
        const result = await ShareProject.findOneAndDelete({
            _id: shareId,
            recipients: session.user.name
        });

        if (!result) {
            return NextResponse.json({ error: "Share not found or user not authorized" }, { status: 404 });
        }

        return NextResponse.json({ message: "Share deleted successfully" });
    } catch (error) {
        console.error("Error deleting share:", error);
        return NextResponse.json({ error: "Failed to delete share" }, { status: 500 });
    }
}
