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
import { DateTime } from "@components/DateTime";

interface IProps {
    post: IPostFragment;
}

export function PostSummary({ post }: IProps) {
    const url = `/posts/${post.slug}`;
    return (
        <Link href={url} className={styles.root}>
            <DateTime className={styles.dateMeta}>{post.date}</DateTime>
            <h2 className={styles.title}>{post.name}</h2>
            <PostContent className={styles.excerpt}>{post.excerpt}</PostContent>
            <Tags readonly className={styles.tags} tags={post.tags} />
        </Link>
    );
}
