import Script from "next/script";
import "./global.css";

interface IProps {
    children: React.ReactNode;
}

export default function RootLayout(props: IProps) {
    return (
        <html lang="en">
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
            <body>{props.children}</body>
        </html>
    );
}
