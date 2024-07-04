import mongooseConnect from "@/lib/mongoose";
import ShareLabel from "@/models/ShareLabel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
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