/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */
import { BigHeader } from "@components/BigHeader";
import { Layout } from "@components/Layout";
import { Tags } from "@components/Tags";
import { ITag, postModel } from "@utils/PostModel";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import Head from "next/head";
import React from "react";

export default function TagsPage({ tags }: IProps) {
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

interface IProps {
    tags: ITag[];
}

export async function getStaticProps(
    context: GetStaticPropsContext
): Promise<GetStaticPropsResult<IProps>> {
    const tags = postModel.getTags();
    return { props: { tags } };
}
