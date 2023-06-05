import classNames from "classnames";
import Link from "next/link";
/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */
import React from "react";
import styles from "./components.module.scss";

interface IProps {
    children: React.ReactNode;
    className?: string;
    href: string;
}

export function ColoredButtonLink({ children, className, href }: IProps) {
    return (
        <Link href={href} className={classNames(styles.viewLink, className)}>
            <span className={styles.viewLinkContent}>{children}</span>
        </Link>
    );
}
