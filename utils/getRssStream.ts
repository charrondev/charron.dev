/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import { postModel } from "@utils/PostModel";
import { stringToStream } from "@utils/stringToStream";
import { Feed } from "feed";

const author = {
    name: "Adam Charron",
    link: "https://charron.dev",
};

export async function getRssStream(): Promise<ReadableStream> {
    const feed = new Feed({
        title: "Charron Dev Blog",
        id: "https://charron.dev",
        link: "https://charron.dev/feed.xml",
        feedLinks: {
            atom: "https://charron.dev/feed.xml",
        },
        copyright: "All rights reserved 2023, Adam Charron",
        author,
    });

    const postFragments = await postModel.getRecentPosts(0, 20, false);
    postFragments.map((post) => {
        feed.addItem({
            title: post.name,
            guid: post.slug,
            id: post.url,
            link: `https://charron.dev` + post.url,
            category: post.tags.map((tag) => ({ name: tag.name })),
            date: new Date(post.updated ?? post.date),
            description: post.seoSummary,
            author: [author],
            content: post.content,
        });
    });

    const output = feed.atom1();
    return stringToStream(output);
}
