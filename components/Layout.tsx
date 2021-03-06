/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import Logo from "@logos/charrondev-dark.svg";
import classNames from "classnames";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Layout.module.scss";

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
            <Head>
                <title>Charron Developer Blog</title>
                <meta
                    name="description"
                    content="Adam Charron's Developer blog. Covering Javascript, React,
                    PHP, MySQL, Git and scaling sites to handle million's of
                    requests per hour."
                ></meta>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header className={styles.header}>
                <div className={styles.headerContainer}>
                    <Link href="/">
                        <a className={styles.logoLink}>
                            <Logo className={styles.logo} />
                        </a>
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

export const NavLink = ({ href, children }: INavLinkProps) => {
    const router = useRouter();

    const classes = [styles.headerNavLink];
    const isCurrent = router.pathname.startsWith(href);
    if (isCurrent) {
        classes.push(styles.activeNavLink);
    }

    return (
        <Link href={href}>
            <a
                className={classes.join(" ")}
                aria-current={isCurrent ? "page" : undefined}
            >
                {children}
            </a>
        </Link>
    );
};
