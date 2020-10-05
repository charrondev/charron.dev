import classNames from "classnames";
/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import React from "react";
import styles from "./components.module.scss";

interface IProps {
    className?: string;
}

export function Separator({ className }: IProps) {
    return <hr className={classNames(className, styles.separator)} />;
}
