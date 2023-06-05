/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

// const withMDX = require('@next/mdx')({
//     extension: /\.mdx?$/,
//     options: {
//       // If you use remark-gfm, you'll need to use next.config.mjs
//       // as the package is ESM only
//       // https://github.com/remarkjs/remark-gfm#install
//       remarkPlugins: [],
//       rehypePlugins: [],
//       // If you use `MDXProvider`, uncomment the following line.
//       // providerImportSource: "@mdx-js/react",
//     },
//   });

/**
 * @type {import("next").NextConfig} config
 */
const config = {
    output: "export",
    webpack(config, { dev, isServer }) {
        if (!dev && !isServer) {
            Object.assign(config.resolve.alias, {
                "react/jsx-runtime.js": "preact/compat/jsx-runtime",
                react: "preact/compat",
                "react-dom/test-utils": "preact/test-utils",
                "react-dom": "preact/compat",
            });
        }
        config.module.rules.push({
            test: /\.svg$/,
            use: [
                {
                    loader: "@svgr/webpack",
                    options: {
                        dimensions: false,
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
    reactStrictMode: true,
    swcMinify: true,
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

module.exports = config;
