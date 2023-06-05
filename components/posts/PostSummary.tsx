import { ColoredButtonLink } from "@components/ColoredLinkButton";
import { PostContent } from "@components/posts/PostContent";
import { PostMeta } from "@components/posts/PostMeta";
import { Separator } from "@components/Separator";
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
                    {post.name}
                </Link>
            </h2>
            <PostMeta post={post} />
            <Separator className={styles.separator} />
            <PostContent className={styles.excerpt}>{post.excerpt}</PostContent>
            <ColoredButtonLink href={post.url}>View Post →</ColoredButtonLink>
        </div>
    );
}
