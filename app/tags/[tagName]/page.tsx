/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */
import { BigHeader } from "@components/BigHeader";
import { Layout } from "@components/Layout";
import { PostSummary } from "@components/posts/PostSummary";
import { postModel } from "@utils/PostModel";
import Head from "next/head";
import React from "react";

export interface IProps {
    params: {
        tagName: string;
    };
}

export default async function TagPage(props: IProps) {
    const { tagName } = props.params;
    const tag = postModel.getTag(tagName);
    const postFragments = await postModel.getPostsByTag(tagName);

    if (!tag) {
        return <div>No tag found {tagName}</div>;
    }
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

export function generateStaticParams() {
    const allTags = postModel.getTags();
    return allTags.map((tag) => {
        return { slug: tag.slug };
    });
}
