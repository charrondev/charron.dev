/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

"use client";

import Logo from "@logos/charrondev-dark.svg";
import classNames from "classnames";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import styles from "./Layout.module.scss";
import { usePathname } from "next/navigation";

interface IProps {
    panel?: React.ReactNode;
    children: React.ReactNode;
}

export function Layout({ children }: IProps) {
    const [isOpen, setIsOpen] = useState(false);

    const nav = (
        <nav
            className={classNames(
                styles.headerNav,
                isOpen && styles.headerNavOpen
            )}
        >
            <NavLink href="/posts">Posts</NavLink>
            <NavLink href="/tags">Tags</NavLink>
            <NavLink href="/feed.xml">RSS Feed</NavLink>
            <NavLink href="https://github.com/charrondev">GitHub</NavLink>
        </nav>
    );
    return (
        <div className={styles.root}>
            <header className={styles.header}>
                <div className={styles.headerContainer}>
                    <Link
                        href="/"
                        title="Charron.dev logo."
                        aria-label="Logo spelling out charron.dev"
                        className={styles.logoLink}
                    >
                        <Logo className={styles.logo} />
                    </Link>
                    <span className={styles.hamburgerWrap}>
                        <Hamburger
                            className={
                                isOpen ? styles.hamburgerOpen : undefined
                            }
                            onClick={() => {
                                if (isOpen) {
                                    setIsOpen(false);
                                } else {
                                    setIsOpen(true);
                                }
                            }}
                        />
                    </span>
                    {nav}
                </div>
            </header>
            <main className={styles.main}>{children}</main>
        </div>
    );
}

function Hamburger(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            type="button"
            title="Toggle Navigation"
            aria-label="Toggle Navigation"
            {...props}
            className={classNames(styles.hamburger, props.className)}
        >
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
        </button>
    );
}

interface INavLinkProps {
    href: string;
    children: React.ReactNode;
}

const NavLink = ({ href, children }: INavLinkProps) => {
    const pathname = usePathname();

    const classes = [styles.headerNavLink];
    const isCurrent = pathname?.startsWith(href);
    if (isCurrent) {
        classes.push(styles.activeNavLink);
    }

    return (
        <Link
            href={href}
            className={classes.join(" ")}
            aria-current={isCurrent ? "page" : undefined}
        >
            {children}
        </Link>
    );
};
