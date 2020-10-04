/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

export const mdxOptionsServer = {
    mdxOptions: {
        rehypePlugins: [require("@mapbox/rehype-prism")],
    },
};

export const mdxOptionsClient = {
    mdxOptions: {
        rehypePlugins: [require("@mapbox/rehype-prism")],
    },
};
