/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import { postModel } from "@utils/PostModel";
import { stringToStream } from "@utils/stringToStream";
import { SitemapStream, streamToPromise } from "sitemap";

export async function getSitemapStream(
    hostname: string
): Promise<ReadableStream<any>> {
    const smStream = new SitemapStream({
        hostname,
    });

    const postFragments = await postModel.getRecentPosts(0, 1000);
    postFragments.forEach((fragment) => {
        const date = new Date(fragment.updated ?? fragment.date);
        smStream.write({
            url: fragment.url,
            lastmod: date.toISOString(),
            changefreq: "monthly",
            priority: 1,
        });
    });
    smStream.end();

    const sitemap = await streamToPromise(smStream).then((sm) => sm.toString());
    return stringToStream(sitemap);
}
