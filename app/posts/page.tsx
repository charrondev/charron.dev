/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import { BigHeader } from "@components/BigHeader";
import { Layout } from "@components/Layout";
import { PostSummary } from "@components/posts/PostSummary";
import { postModel } from "@utils/PostModel";
import { Metadata } from "next";
import Head from "next/head";
import React from "react";

export const dynamic = "force-static";

export default async function PostIndexPage() {
    const page = 1;
    const postFragments = await postModel.getRecentPosts(page - 1, 10);

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

export function generateMetadata(): Metadata {
    return {
        title: `Recent Posts | Charron Developer Blog`,
        description: `Recent posts from the Charron Developer Blog.`,
    };
}
