import { BigHeader } from "@components/BigHeader";
import { DateTime } from "@components/DateTime";
import { Layout } from "@components/Layout";
import { PostContent } from "@components/posts/PostContent";
import { PostMeta } from "@components/posts/PostMeta";
import { Tags } from "@components/Tags";
import { IPost, postModel } from "@utils/PostModel";
/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */
import {
    GetStaticPaths,
    GetStaticPathsResult,
    GetStaticPropsContext,
    GetStaticPropsResult,
} from "next";
import Head from "next/head";
import React from "react";

export default function PostPage({ post }: IProps) {
    return (
        <Layout>
            <Head>
                <title>{post.name} | Charron Developer Blog</title>
                <meta name="description" content={post.seoSummary}></meta>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <BigHeader after={<PostMeta post={post} />}>{post.name}</BigHeader>
            <PostContent>{post.content}</PostContent>
        </Layout>
    );
}

export function getStaticPaths(context: GetStaticPaths): GetStaticPathsResult {
    const files = postModel.getAllPostSlugs().map((slug) => ({
        params: {
            slug,
        },
    }));
    return {
        paths: files,
        fallback: false,
    };
}

interface IProps {
    post: IPost;
}

export async function getStaticProps(
    context: GetStaticPropsContext
): Promise<GetStaticPropsResult<IProps>> {
    const slug = context.params!.slug as string;
    const post = await postModel.getPost(slug);
    return { props: { post } };
}
