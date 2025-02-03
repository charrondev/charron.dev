/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

"use client";

import LogoLight from "@logos/charrondev-light.svg";
import LogoDark from "@logos/charrondev-dark.svg";
import classNames from "classnames";
import Link from "next/link";
import { useState } from "react";
import classes from "./Layout.module.scss";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@components/ThemeToggle";

interface IProps {
    panel?: React.ReactNode;
    children: React.ReactNode;
    maxWidth?: number;
    overlayHeader?: boolean;
}

export function Layout(props: IProps) {
    const { children, maxWidth, overlayHeader } = props;
    const [isOpen, setIsOpen] = useState(false);

    const nav = (
        <nav
            className={classNames(
                classes.headerNav,
                isOpen && classes.headerNavOpen
            )}
        >
            <NavLink href="/posts">Posts</NavLink>
            <NavLink href="/tags">Tags</NavLink>
            <NavLink href="/feed.xml">RSS Feed</NavLink>
            <NavLink href="https://github.com/charrondev">GitHub</NavLink>
        </nav>
    );

    return (
        <div
            className={classNames(
                classes.root,
                overlayHeader && classes.overlayHeader
            )}
            style={
                {
                    "--width": `${maxWidth ?? 1000}px`,
                } as any
            }
        >
            <header className={classes.header}>
                <div className={classes.headerContainer}>
                    <Link
                        href="/"
                        title="Charron.dev logo."
                        aria-label="Logo spelling out charron.dev"
                        className={classes.logoLink}
                    >
                        <LogoDark
                            className={classNames(
                                classes.logo,
                                classes.logoDark
                            )}
                        />
                        <LogoLight
                            className={classNames(
                                classes.logo,
                                classes.logoLight
                            )}
                        />
                    </Link>
                    <span className={classes.hamburgerWrap}>
                        <Hamburger
                            className={
                                isOpen ? classes.hamburgerOpen : undefined
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
                    <ThemeToggle />
                </div>
            </header>
            <main className={classes.main}>{children}</main>
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
            className={classNames(classes.hamburger, props.className)}
        >
            <span className={classes.hamburgerLine}></span>
            <span className={classes.hamburgerLine}></span>
            <span className={classes.hamburgerLine}></span>
        </button>
    );
}

interface INavLinkProps {
    href: string;
    children: React.ReactNode;
}

const NavLink = ({ href, children }: INavLinkProps) => {
    const pathname = usePathname();

    const appliedClasses = [classes.headerNavLink];
    const isCurrent = pathname?.startsWith(href);
    if (isCurrent) {
        appliedClasses.push(classes.activeNavLink);
    }

    return (
        <Link
            href={href}
            className={appliedClasses.join(" ")}
            aria-current={isCurrent ? "page" : undefined}
        >
            {children}
        </Link>
    );
};
