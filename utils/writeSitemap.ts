/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import { postModel } from "@utils/PostModel";
import fs from "fs";
import path from "path";
import { SitemapStream, streamToPromise } from "sitemap";

export async function writeSiteMap(hostname: string) {
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
    fs.writeFileSync(path.join(process.cwd(), "public/sitemap.xml"), sitemap);
}
