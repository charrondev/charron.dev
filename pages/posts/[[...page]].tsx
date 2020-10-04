import { BigHeader } from "@components/BigHeader";
import { Layout } from "@components/Layout";
/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */
import { PostSummary } from "@components/posts/PostSummary";
import { getPageNumber } from "@utils/pageUtils";
import { IPostFragment, postModel } from "@utils/PostModel";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import React from "react";

export default function PostPage({ postFragments, page }: IProps) {
    if (!postFragments) {
        return <div>Not found</div>;
    }
    return (
        <Layout>
            <BigHeader>Recent Posts</BigHeader>
            {postFragments.map((fragment, i) => {
                return <PostSummary post={fragment} key={i} />;
            })}
        </Layout>
    );
}

interface IProps {
    postFragments: IPostFragment[] | null;
    page: number;
}

export async function getStaticPaths() {
    const count = postModel.getPostCount();
    const pageCount = Math.ceil(count / 10);
    let pageNumbers = [];
    pageNumbers.push("");
    for (let i = 1; i <= pageCount; i++) {
        pageNumbers.push(`p${i}`);
    }
    return {
        paths: pageNumbers.map((pageNumber) => {
            return {
                params: { page: [pageNumber] },
            };
        }),
        fallback: false,
    };
}

export async function getStaticProps(
    context: GetStaticPropsContext
): Promise<GetStaticPropsResult<IProps>> {
    const page = getPageNumber(context);
    const postFragments = await postModel.getRecentPosts(page - 1, 10);
    return { props: { postFragments, page } };
}
