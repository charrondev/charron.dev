/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import { postModel } from "@utils/PostModel";
import fs from "fs";
import path from "path";
import RSS from "rss";

export async function writeRss() {
    const feed = new RSS({
        title: "Adam Charron's Developer blog",
        site_url: "https://charron.dev",
        feed_url: "https://charron.dev/feed.xml",
    });

    const postFragments = await postModel.getRecentPosts(0, 20);
    postFragments.map((post) => {
        feed.item({
            title: post.name,
            guid: post.slug,
            url: post.url,
            date: post.updated ?? post.date,
            description: (post.excerpt as any).renderedOutput,
            author: "Adam Charron",
        });
    });

    const output = feed.xml({ indent: true });
    fs.writeFileSync(path.join(process.cwd(), "public/feed.xml"), output);
}
