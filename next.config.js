/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

module.exports = {
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
        return config;
    },
    reactStrictMode: true,
    swcMinify: true,
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};
