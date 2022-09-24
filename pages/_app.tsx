/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */
import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Component {...pageProps} />
            <Head>
                <html lang={"en"} />
                <script
                    async
                    defer
                    data-domain="charron.dev"
                    src="https://stats.charron.dev/js/plausible.js"
                ></script>
            </Head>
        </>
    );
}

export default MyApp;
