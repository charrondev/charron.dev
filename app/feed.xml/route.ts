import "server-only";
import { getRssStream } from "@utils/getRssStream";
import { NextResponse } from "next/server";

export async function GET() {
    const stream = await getRssStream();
    const response = new NextResponse(stream);
    // response.headers.set("content-type", "application/xml");

    return response;
}
