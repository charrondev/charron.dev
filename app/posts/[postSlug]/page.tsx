/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import { BigHeader } from "@components/BigHeader";
import { Layout } from "@components/Layout";
import { PostContent } from "@components/posts/PostContent";
import { PostMeta } from "@components/posts/PostMeta";
import { postModel } from "@utils/PostModel";
import Head from "next/head";
import { notFound } from "next/navigation";

interface IProps {
    params: {
        postSlug: string;
    };
}

export default async function PostPage(props: IProps) {
    const post = await postModel.getPost(props.params.postSlug);
    if (!post) {
        notFound();
    }

    return (
        <Layout>
            <Head>
                <title>{`${post.name} | Charron Developer Blog`}</title>
                <meta name="description" content={post.seoSummary}></meta>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <BigHeader after={<PostMeta post={post} />}>{post.name}</BigHeader>
            <PostContent>{post.content}</PostContent>
        </Layout>
    );
}

export function generateStaticParams() {
    const allTags = postModel.getAllPostSlugs();
    return allTags.map((tag) => {
        return { slug: tag };
    });
}
