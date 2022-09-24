/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */
import { BigHeader } from "@components/BigHeader";
import { Layout } from "@components/Layout";
import { PostSummary } from "@components/posts/PostSummary";
import { IPostFragment, ITag, postModel } from "@utils/PostModel";
import {
    GetStaticPaths,
    GetStaticPathsResult,
    GetStaticPropsContext,
    GetStaticPropsResult,
} from "next";
import Head from "next/head";
import React from "react";

export default function TagPage({ postFragments, tag }: IProps) {
    return (
        <Layout>
            <Head>
                <title>{`#${tag.name} Tag | Charron Developer Blog`}</title>
                <meta
                    name="description"
                    content="Content tags for the Charron Developer Blog."
                ></meta>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <BigHeader>#{tag.slug}</BigHeader>
            {postFragments.map((fragment, i) => {
                return <PostSummary post={fragment} key={i} />;
            })}
        </Layout>
    );
}

export function getStaticPaths(context: GetStaticPaths): GetStaticPathsResult {
    const files = postModel.getTags().map((tag) => ({
        params: {
            tag: tag.slug,
        },
    }));
    return {
        paths: files,
        fallback: false,
    };
}

interface IProps {
    postFragments: IPostFragment[];
    tag: ITag;
}

export async function getStaticProps(
    context: GetStaticPropsContext
): Promise<GetStaticPropsResult<IProps>> {
    const slug = context.params!.tag as string;
    const tag = postModel.getTag(slug);
    const fragments = await postModel.getPostsByTag(slug);
    return { props: { postFragments: fragments, tag } };
}
