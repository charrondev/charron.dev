/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import { Separator } from "@components/Separator";
import classNames from "classnames";
import React from "react";
import styles from "./components.module.scss";

interface IProps extends React.HTMLAttributes<HTMLHeadingElement> {
    after?: React.ReactNode;
}

export function BigHeader(props: IProps) {
    return (
        <div className={classNames(props.className, styles.BigHeader)}>
            <h1 {...props} className={styles.BigHeaderContent}>
                {props.children}
            </h1>
            {props.after}
            <Separator />
        </div>
    );
}
