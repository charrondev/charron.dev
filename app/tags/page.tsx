/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */
import { BigHeader } from "@components/BigHeader";
import { Layout } from "@components/Layout";
import { Tags } from "@components/Tags";
import { postModel } from "@utils/PostModel";
import { Metadata } from "next";

export default function TagsPage() {
    const tags = postModel.getTags();
    return (
        <Layout>
            <BigHeader>All Tags</BigHeader>
            <Tags tags={tags} />
        </Layout>
    );
}

export function generateMetadata(): Metadata {
    return {
        title: `All Tags | Charron Developer Blog`,
        description: `Content tags for the Charron Developer Blog.`,
    };
}
