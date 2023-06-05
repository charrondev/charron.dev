import Script from "next/script";
import "./global.css";

interface IProps {
    children: React.ReactNode;
}

export default function RootLayout(props: IProps) {
    return (
        <html lang="en">
            <Script
                async
                defer
                data-domain="charron.dev"
                src="https://stats.charron.dev/js/plausible.js"
            />
            <body>{props.children}</body>
        </html>
    );
}
