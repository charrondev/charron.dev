import { ImageLoaderProps } from "next/image";

// "full",
// "4000",
// "2000",
// "1000",
// "720",
// "480",
// "blur",

// Docs: https://developers.cloudflare.com/images/url-format
export default function cloudflareLoader({
    src,
    width,
    quality,
}: ImageLoaderProps) {
    const params = [
        `width=${width}`,
        `quality=${quality || 80}`,
        "format=auto",
    ];

    return `https://charron.dev/cdn-cgi/imagedelivery/4N9h-qqEGYTn_kaVwUTSLw${src}/${params.join(
        ","
    )}`;
}
