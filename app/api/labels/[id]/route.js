import mongooseConnect from "@/lib/mongoose";
import Label from "@/models/Label";
import { getAuthSession } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
    const session = await getAuthSession(req);

    if (!session) {
        return NextResponse.json({ error: "User session not found" }, { status: 401 });
    }

    await mongooseConnect();

    const { id: labelId } = params;

    try {
        const deletedLabel = await Label.findByIdAndDelete({ _id: labelId });

        if (!deletedLabel) {
            return NextResponse.json({ error: "Label not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Label deleted" });
    } catch (error) {
        console.error("Error deleting label:", error);
        return NextResponse.json({ error: "Failed to delete label" }, { status: 500 });
    }
}

export async function GET(req, { params }) {
    await mongooseConnect();
    const { id: labelId } = params;

    try {
        const label = await Label.findById({ _id: labelId });
        if (!label) {
            return NextResponse.json({ error: 'Label not found' }, { status: 404 });
        }
        return NextResponse.json(label);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch label' }, { status: 500 });
    }
}