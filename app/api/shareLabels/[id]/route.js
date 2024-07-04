import mongooseConnect from "@/lib/mongoose";
import ShareLabel from "@/models/ShareLabel";
import { getAuthSession } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const session = await getAuthSession(req);

    if (!session) {
        return NextResponse.json({ error: "User session not found" }, { status: 401 });
    }

    await mongooseConnect();
    const { id: shareId } = params;

    try {
        const label = await ShareLabel.findById({ _id: shareId }).populate('selectUser')
        if (!label) {
            return NextResponse.json({ error: 'Sharelabel not found' }, { status: 404 });
        }
        return NextResponse.json(label);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch Share Label' }, { status: 500 });
    }
}


export async function DELETE(req, { params }) {
    const session = await getAuthSession(req);

    if (!session) {
        return NextResponse.json({ error: "User session not found" }, { status: 401 });
    }

    await mongooseConnect();

    const { id: shareId } = params;

    try {
        const deletedLabel = await ShareLabel.findByIdAndDelete({ _id: shareId });

        if (!deletedLabel) {
            return NextResponse.json({ error: "sharelabel not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "sharelabel deleted" });
    } catch (error) {
        console.error("Error deleting sharelabel:", error);
        return NextResponse.json({ error: "Failed to delete sharelabel" }, { status: 500 });
    }
}