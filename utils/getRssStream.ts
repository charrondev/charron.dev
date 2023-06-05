/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import { postModel } from "@utils/PostModel";
import { stringToStream } from "@utils/stringToStream";
import { WriteStream } from "fs";
import { notFound } from "next/navigation";
import RSS from "rss";

export async function getRssStream(): Promise<ReadableStream> {
    const feed = new RSS({
        title: "Charron Dev Blog",
        site_url: "https://charron.dev",
        feed_url: "https://charron.dev/feed.xml",
        custom_namespaces: {
            content: "http://purl.org/rss/1.0/modules/content/",
        },
    });

    const postFragments = await postModel.getRecentPosts(0, 20, false);
    postFragments.map((post) => {
        feed.item({
            title: post.name,
            guid: post.slug,
            url: post.url,
            date: post.updated ?? post.date,
            description: post.seoSummary,
            author: "Adam Charron",
            categories: post.tags.map((tag) => tag.name),
            custom_elements: [
                {
                    "content:encoded": {
                        _cdata: post.content,
                    },
                },
            ],
        });
    });

    const output = feed.xml({ indent: true });
    return stringToStream(output);
}
