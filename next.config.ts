/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import type { NextConfig } from "next";

const config: NextConfig = {
    experimental: {
        // Stub out when doing development.
        // optimizeCss: true,
    },
    webpack(config, { dev, isServer }) {
        config.module.rules.push({
            test: /\.svg$/,
            use: [
                {
                    loader: "@svgr/webpack",
                    options: {
                        dimensions: false,
                        replaceAttrValues: {
                            "#000": "currentColor",
                        },
                    },
                },
            ],
        });
        config.module.rules.push({
            test: /\.md$/,
            type: "asset/source",
        });
        return config;
    },
    images: {
        loader: "custom",
        loaderFile: "./cloudflareImageLoader.ts",
    },
    reactStrictMode: true,
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

module.exports = config;
