import { DateTime } from "@components/DateTime";
import { Tags } from "@components/Tags";
import { IPost, IPostFragment } from "@utils/PostModel";
/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import React from "react";
import styles from "./PostMeta.module.scss";

interface IProps {
    post: IPostFragment | IPost;
}

export function PostMeta({ post }: IProps) {
    return (
        <>
            <Tags className={styles.tags} tags={post.tags} />
            <div className={styles.metas}>
                <span className={styles.meta}>
                    <strong>Posted: </strong>
                    <DateTime>{post.date}</DateTime>
                </span>
                {post.updated && (
                    <span className={styles.meta}>
                        <strong>Updated: </strong>
                        <DateTime>{post.updated}</DateTime>
                    </span>
                )}
            </div>
        </>
    );
}
