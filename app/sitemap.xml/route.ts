import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getSitemapStream } from "@utils/getSitemapStream";

export async function GET(request: NextRequest) {
    const stream = await getSitemapStream(
        request.nextUrl.protocol + request.nextUrl.host
    );
    const response = new NextResponse(stream, {});
    response.headers.append("content-type", "application/xml");

    return response;
}
