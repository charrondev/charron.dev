import axios, { Axios } from "axios";

export function cloudflareClient(): Axios {
    const accountID = process.env.NEXT_PUBLIC_CF_ACCOUNT_ID;
    const imageToken = process.env.NEXT_PUBLIC_CF_IMAGE_TOKEN;

    if (!accountID) {
        throw new Error("Missing configuration for cloudflare accountID.");
    }

    if (!imageToken) {
        throw new Error("Missing configuration for cloudflare access token.");
    }

    const baseURL = `https://api.cloudflare.com/client/v4/accounts/${process.env.NEXT_PUBLIC_CF_ACCOUNT_ID}`;

    return axios.create({
        baseURL,
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_CF_IMAGE_TOKEN}`,
        },
    });
}
