/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import { ITag } from "@utils/PostModel";
import styles from "./Tags.module.css";
import React from "react";
import classNames from "classnames";
import Link from "next/link";

export function Tag(props: ITag) {
    return (
        <Link href={props.url} className={styles.tag}>
            #{props.name}
        </Link>
    );
}

interface ITagsProps {
    tags: ITag[];
    className?: string;
    readonly?: boolean;
}

export function Tags({ tags, className, readonly }: ITagsProps) {
    if (tags.length === 0) {
        return <></>;
    }

    return (
        <div className={classNames(styles.tags, className)}>
            {tags.map((tag, i) => {
                return readonly ? (
                    <span className={styles.tag} key={i}>
                        {tag.name}
                    </span>
                ) : (
                    <Tag {...tag} key={i} />
                );
            })}
        </div>
    );
}
