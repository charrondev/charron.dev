/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import { Layout } from "@components/Layout";
import { PostSummary } from "@components/posts/PostSummary";
import { IPostFragment, ITag, postModel } from "@utils/PostModel";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import React from "react";
import Head from "next/head";
import { writeSiteMap } from "@utils/writeSitemap";

export default function Home({ tags, postFragments }: IProps) {
    return (
        <Layout>
            {postFragments.map((fragment, i) => {
                return <PostSummary post={fragment} key={i} />;
            })}
        </Layout>
    );
}

interface IProps {
    postFragments: IPostFragment[];
    tags: ITag[];
}

export async function getStaticProps(
    context: GetStaticPropsContext
): Promise<GetStaticPropsResult<IProps>> {
    const postFragments = await postModel.getRecentPosts();
    const tags = postModel.getTags();
    await writeSiteMap("https://charron.dev");
    return {
        props: {
            postFragments,
            tags,
        },
    };
}
