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
        <Link href={props.url}>
            <a className={styles.tag}>#{props.name}</a>
        </Link>
    );
}

interface ITagsProps {
    tags: ITag[];
    className?: string;
}

export function Tags({ tags, className }: ITagsProps) {
    if (tags.length === 0) {
        return <></>;
    }

    return (
        <div className={classNames(styles.tags, className)}>
            {tags.map((tag, i) => {
                return <Tag {...tag} key={i} />;
            })}
        </div>
    );
}
