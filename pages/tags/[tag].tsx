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
import React from "react";

export default function TagPage({ postFragments, tag }: IProps) {
    // const content = hydrate(post.content);
    return (
        <Layout>
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
