/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

const withPreact = require("next-plugin-preact");

module.exports = withPreact({
    webpack(config) {
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
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
});
