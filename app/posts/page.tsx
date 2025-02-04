/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import { BigHeader } from "@components/BigHeader";
import { Layout } from "@components/Layout";
import { PostSummary } from "@components/posts/PostSummary";
import { postModel } from "@utils/PostModel";
import { Metadata } from "next";
import React from "react";

export default async function PostIndexPage() {
    const page = 1;
    const postFragments = await postModel.getRecentPosts(page - 1, 30);

    if (!postFragments) {
        return <div>Not found</div>;
    }
    let title = "Recent Posts";
    if (page > 1) {
        title += ` - Page ${page}`;
    }
    return (
        <Layout>
            <BigHeader>{title}</BigHeader>
            {postFragments.map((fragment, i) => {
                return <PostSummary post={fragment} key={i} />;
            })}
        </Layout>
    );
}

export function generateStaticParams() {
    return [];
}

export function generateMetadata(): Metadata {
    return {
        title: `Recent Posts | Charron Developer Blog`,
        description: `Recent posts from the Charron Developer Blog.`,
    };
}
