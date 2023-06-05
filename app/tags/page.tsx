/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */
import { BigHeader } from "@components/BigHeader";
import { Layout } from "@components/Layout";
import { Tags } from "@components/Tags";
import { postModel } from "@utils/PostModel";
import Head from "next/head";

export default function TagsPage() {
    const tags = postModel.getTags();
    return (
        <Layout>
            <Head>
                <title>All Tags | Charron Developer Blog</title>
                <meta
                    name="description"
                    content="Content tags for the Charron Developer Blog."
                ></meta>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <BigHeader>All Tags</BigHeader>
            <Tags tags={tags} />
        </Layout>
    );
}
