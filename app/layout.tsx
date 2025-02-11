import { cookies } from "next/headers";
import "./global.scss";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

interface IProps {
    children: React.ReactNode;
}

export const dynamic = "force-static";

export default async function RootLayoutImpl(props: IProps) {
    const theme = (await cookies()).get("theme")?.value ?? "dark";

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
            <Analytics />
            <SpeedInsights />
            <body className={themeClass}>{props.children}</body>
        </html>
    );
}
