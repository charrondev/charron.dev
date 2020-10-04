/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */
import { BigHeader } from "@components/BigHeader";
import { Layout } from "@components/Layout";
import { Tags } from "@components/Tags";
import { ITag, postModel } from "@utils/PostModel";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import React from "react";

export default function TagsPage({ tags }: IProps) {
    return (
        <Layout>
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
