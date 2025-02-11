/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import { BigHeader } from "@components/BigHeader";
import { Layout } from "@components/Layout";
import { PostContent } from "@components/posts/PostContent";
import { PostMeta } from "@components/posts/PostMeta";
import { IPost, postModel } from "@utils/PostModel";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface IProps {
    params: Promise<{
        postSlug: string;
    }>;
}

export default async function PostPage(props: IProps) {
    const { postSlug } = await props.params;

    const post = await postModel.getPost(postSlug);
    if (!post) {
        notFound();
    }

    return (
        <Layout>
            <BigHeader after={<PostMeta post={post} />}>{post.name}</BigHeader>
            <PostContent>{post.content}</PostContent>
        </Layout>
    );
}

export function generateStaticParams() {
    return postModel.getAllPostSlugs().map((slug) => ({ postSlug: slug }));
}

export async function generateMetadata(props: IProps): Promise<Metadata> {
    const { postSlug } = await props.params;
    const post = await postModel.getPost(postSlug);

    return {
        title: `${post.name} | Charron Developer Blog`,
        description: post.seoSummary,
    };
}
