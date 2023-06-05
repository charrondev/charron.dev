import { postModel } from "@utils/PostModel";
import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const postFragments = await postModel.getRecentPosts(0, 1000);
    return postFragments.map((fragment) => {
        const date = new Date(fragment.updated ?? fragment.date);
        return { url: `https://charron.dev` + fragment.url, date };
    });
}
