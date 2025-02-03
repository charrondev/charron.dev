/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */
import { BigHeader } from "@components/BigHeader";
import { Layout } from "@components/Layout";
import { PostSummary } from "@components/posts/PostSummary";
import { postModel } from "@utils/PostModel";
import { Metadata } from "next";
import { notFound } from "next/navigation";

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
        notFound();
    }
    return (
        <Layout>
            <BigHeader>#{tag.slug}</BigHeader>
            {postFragments.map((fragment, i) => {
                return <PostSummary post={fragment} key={i} />;
            })}
        </Layout>
    );
}

export function generateMetadata(props: IProps): Metadata {
    const { tagName } = props.params;
    const tag = postModel.getTag(tagName);
    return {
        title: `#${tag.name} Tag | Charron Developer Blog`,
        description: `Posts tagged with "${tag.name}" for the Charron Developer Blog.`,
    };
}
