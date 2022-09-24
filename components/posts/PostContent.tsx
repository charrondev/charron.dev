/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import classNames from "classnames";
import React from "react";
import styles from "./PostContent.module.scss";

interface IProps {
    children: any;
    className?: string;
}

export function PostContent({ children, className }: IProps) {
    return (
        <div
            className={classNames(styles.root, className)}
            dangerouslySetInnerHTML={{ __html: children }}
        />
    );
}
