import { ColoredButtonLink } from "@components/ColoredLinkButton";
import { PostContent } from "@components/posts/PostContent";
import { Tags } from "@components/Tags";
import { IPostFragment } from "@utils/PostModel";
import Link from "next/link";
/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */
import React from "react";
import styles from "./PostSummary.module.scss";

interface IProps {
    post: IPostFragment;
}

export function PostSummary({ post }: IProps) {
    const url = `/posts/${post.slug}`;
    return (
        <div className={styles.root}>
            <h2 className={styles.title}>
                <Link href={url}>
                    <a>{post.name}</a>
                </Link>
            </h2>
            <Tags tags={post.tags} className={styles.tags} />
            <PostContent className={styles.excerpt}>{post.excerpt}</PostContent>
            <ColoredButtonLink href={post.url}>View Post →</ColoredButtonLink>
        </div>
    );
}
