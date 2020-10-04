/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import Logo from "@logos/charrondev-dark.svg";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import styles from "./Layout.module.css";

interface IProps {
    panel?: React.ReactNode;
    children: React.ReactNode;
}

export function Layout({ children }: IProps) {
    return (
        <div className={styles.root}>
            <header className={styles.header}>
                <div className={styles.headerContainer}>
                    <Link href="/">
                        <a className={styles.logoLink}>
                            <Logo className={styles.logo} />
                        </a>
                    </Link>
                    <nav className={styles.headerNav}>
                        <NavLink href="/posts">Posts</NavLink>
                        <NavLink href="/tags">Tags</NavLink>
                        <NavLink href="https://github.com/charrondev">
                            GitHub
                        </NavLink>
                    </nav>
                </div>
            </header>
            <main className={styles.main}>{children}</main>
        </div>
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
