import { NextResponse } from "next/server";

export class ContextError extends Error {
    public constructor(
        public message: string,
        private code: number,
        private context: Record<string, any>
    ) {
        super(message);
    }

    public toResponse() {
        return NextResponse.json(
            {
                message: this.message,
                status: this.code,
                ...this.context,
                trace: this.stack,
            },
            { status: this.code }
        );
    }
}
