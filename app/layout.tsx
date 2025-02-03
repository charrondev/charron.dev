import { cookies } from "next/headers";
import Script from "next/script";
import "./global.scss";

interface IProps {
    children: React.ReactNode;
}

export default function RootLayoutImpl(props: IProps) {
    const theme = cookies().get("theme")?.value ?? "dark";

    // Defaults to dark mode.
    const themeClass = theme === "light" ? "light-theme" : "dark-theme";

    return (
        <html lang="en" className={themeClass}>
            <head>
                <link rel="icon" href="/favicon.ico" />
                <title>Charron Developer Blog</title>
                <meta
                    name="description"
                    content="Adam Charron's Developer blog. Covering Javascript, React,
                    PHP, MySQL, Git and scaling sites to handle million's of
                    requests per hour."
                ></meta>
            </head>
            <Script
                strategy="lazyOnload"
                data-domain="charron.dev"
                src="https://stats.charron.dev/js/plausible.js"
            />
            <body className={themeClass}>{props.children}</body>
        </html>
    );
}
