/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */
import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Component {...pageProps} />
            <Head>
                <html lang={"en"} />
            </Head>
            <Script
                async
                defer
                data-domain="charron.dev"
                src="https://stats.charron.dev/js/plausible.js"
            />
        </>
    );
}

export default MyApp;
