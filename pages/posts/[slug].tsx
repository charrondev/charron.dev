import { BigHeader } from "@components/BigHeader";
import { Layout } from "@components/Layout";
import { PostContent } from "@components/posts/PostContent";
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
import React from "react";

export default function PostPage({ post }: IProps) {
    return (
        <Layout>
            <BigHeader>{post.name}</BigHeader>
            <div>
                <strong>Posted: </strong>
                {post.date}
            </div>
            <Tags tags={post.tags} />
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
