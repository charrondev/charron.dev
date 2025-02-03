import { ContextError } from "@app/api/ContextError";
import { NextRequest, NextResponse } from "next/server";

export function apiRoute(
    next: (request: NextRequest) => Promise<NextResponse> | NextResponse
) {
    return async (request: NextRequest): Promise<NextResponse> => {
        try {
            const response = await next(request);
            response.headers.append("x-charron-dev", "api");
            return response;
        } catch (err) {
            if (err instanceof ContextError) {
                return err.toResponse();
            } else if (err instanceof Error) {
                return NextResponse.json(
                    {
                        message: err.message,
                        name: err.name,
                        trace: err.stack,
                        cause: err.cause,
                    },
                    { status: 500 }
                );
            } else {
                throw err;
            }
        }
    };
}
