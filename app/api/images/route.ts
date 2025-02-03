import { ContextError } from "@app/api/ContextError";
import { apiRoute } from "@app/api/apiUtils";
import { Axios } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = apiRoute(
    async (request: NextRequest): Promise<NextResponse> => {
        const accountID = process.env.NEXT_PUBLIC_CF_ACCOUNT_ID;
        const imageToken = process.env.NEXT_PUBLIC_CF_IMAGE_TOKEN;

        if (!accountID) {
            throw new Error("Missing configuration for cloudflare accountID.");
        }

        if (!imageToken) {
            throw new Error(
                "Missing configuration for cloudflare access token."
            );
        }

        const formData = await request.formData();
        const file = formData.get("file");
        if (!(file instanceof File)) {
            throw new Error("Invalid file upload");
        }

        try {
            var response = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${accountID}/images/v1`,
                {
                    headers: new Headers({
                        Authorization: `Bearer ${imageToken}`,
                    }),
                    method: "POST",
                    body: formData,
                }
            );
            var json = await response.json();
        } catch (err) {
            throw new ContextError(
                "Cloudflare Image API failed to connect.",
                500,
                {
                    connectionError: {
                        message: (err as Error).message,
                    },
                }
            );
        }
        if (!response.ok) {
            throw new ContextError(
                "Cloudflare Image API returned an error",
                response.status,
                {
                    request: {
                        url: response.url,
                    },
                    upstreamError: {
                        body: json,
                        status: response.status,
                        headers: Object.fromEntries(response.headers.entries()),
                    },
                }
            );
        }

        return NextResponse.json(json, { status: 201 });
    }
);

function prepareAxios(): Axios {
    const accountID = process.env.CF_ACCOUNT_ID;
    const imageToken = process.env.CF_IMAGE_TOKEN;

    if (!accountID) {
        throw new Error("Missing configuration for cloudflare accountID.");
    }

    if (!imageToken) {
        throw new Error("Missing configuration for cloudflare access token.");
    }

    const baseURL = `https://api.cloudflare.com/client/v4/accounts/${accountID}/images/v1`;

    return new Axios({
        baseURL,
        headers: {
            Authorization: `Bearer ${imageToken}`,
        },
    });
}

// export const POST = apiRoute(
//     async (request: NextRequest): Promise<NextResponse> => {
//         const accountID = process.env.CF_ACCOUNT_ID;
//         const imageToken = process.env.CF_IMAGE_TOKEN;

//         if (!accountID) {
//             throw new Error("Missing configuration for cloudflare accountID.");
//         }

//         if (!imageToken) {
//             throw new Error(
//                 "Missing configuration for cloudflare access token."
//             );
//         }

//         const formData = await request.formData();
//         const file = formData.get("file");
//         if (!(file instanceof File)) {
//             throw new Error("Invalid file upload");
//         }

//         try {
//             var response = await fetch(
//                 `https://api.cloudflare.com/client/v4/accounts/${accountID}/images/v1`,
//                 {
//                     headers: new Headers({
//                         Authorization: `Bearer ${imageToken}`,
//                     }),
//                     method: "POST",
//                     body: formData,
//                 }
//             );
//             var json = await response.json();
//         } catch (err) {
//             throw new ContextError(
//                 "Cloudflare Image API failed to connect.",
//                 500,
//                 {
//                     connectionError: {
//                         message: (err as Error).message,
//                     },
//                 }
//             );
//         }
//         if (!response.ok) {
//             throw new ContextError(
//                 "Cloudflare Image API returned an error",
//                 500,
//                 {
//                     request: {
//                         url: response.url,
//                     },
//                     upstreamError: {
//                         body: json,
//                         status: response.status,
//                         headers: Object.fromEntries(response.headers.entries()),
//                     },
//                 }
//             );
//         }

//         return NextResponse.json(json, { status: 201 });
//     }
// );
