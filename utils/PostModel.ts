/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import fs from "fs";
import path from "path";
import { notEmpty } from "@utils/notEmpty";
import matter from "gray-matter";
import { slugify } from "@utils/slugify";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
const rehypePrism = require("@mapbox/rehype-prism");
var h2p = require("html2plaintext");

// POSTS_PATH is useful when you want to get the path to a specific file
export const POSTS_PATH = path.join(process.cwd(), "posts");
const POST_REGEX = /^(?<date>\d\d\d\d\-\d\d\-\d\d)\-(?<slug>.*)\.mdx?$/;

// postFilePaths is the list of all mdx files inside the POSTS_PATH directory
export const postFilePaths = fs
    .readdirSync(POSTS_PATH)
    // Only include md(x) files
    .filter((path) => POST_REGEX.test(path))
    .filter(notEmpty);

export interface ITag {
    url: string;
    name: string;
    slug: string;
}

export interface IPost {
    name: string;
    date: string;
    updated: string | null;
    tags: ITag[];
    slug: string;
    excerpt: string;
    content: string;
    seoSummary: string;
    url: string;
}

type ISlugAndDate = Pick<IPost, "slug" | "date">;

export interface IPostFragment extends IPost {}

class PostModel {
    private postsBySlug: Record<string, Promise<IPost>> = {};
    private postsSlugsByTag: Record<string, string[]> = {};
    private postsSlugsByRecency: string[];
    private tagsBySlug: Record<string, ITag> = {};

    public constructor() {
        let slugAndDates: ISlugAndDate[] = [];

        for (const postFile of postFilePaths) {
            const fileRegexp = POST_REGEX.exec(postFile);
            const parsed = matter.read(path.join(POSTS_PATH, postFile));
            const name = parsed.data.name ?? "Untitled";
            const slug =
                parsed.data.slug ??
                fileRegexp?.groups?.slug ??
                slugify(name) ??
                postFile.replace(/\.mdx?$/, "");
            const tags = parsed.data.tags ?? [];
            const date =
                parsed.data.date ?? fileRegexp?.groups?.date ?? "2020-01-01";

            const post: IPost = {
                updated: parsed.data.updated ?? null,
                name,
                slug,
                content: parsed.content,
                tags,
                excerpt:
                    parsed.data.excerpt ||
                    parsed.excerpt ||
                    "No excerpt could be generated",
                seoSummary: "",
                date,
                url: `/posts/${slug}`,
            };

            const firstLines = parsed.content.split("\n\n").slice(0, 6);

            const goalLength = 500;
            const excerptLines = [];
            let currentCount = 0;
            for (const line of firstLines) {
                currentCount += line.length;
                excerptLines.push(line);
                if (currentCount >= goalLength) {
                    break;
                }
            }

            post.excerpt = parsed.data.excerpt || excerptLines.join("\n\n");
            post.tags = [];
            for (const tag of tags) {
                const realTag = this.createTag(tag);
                this.tagsBySlug[realTag.slug] = realTag;
                post.tags.push(realTag);

                if (realTag.slug in this.postsSlugsByTag) {
                    this.postsSlugsByTag[realTag.slug].push(slug);
                } else {
                    this.postsSlugsByTag[realTag.slug] = [slug];
                }
            }
            this.postsBySlug[slug] = this.makeRenderedPost(post);
            slugAndDates.push({
                slug,
                date,
            });
        }

        // Sort all of the post slugs by date.
        this.postsSlugsByRecency = Object.values(slugAndDates)
            .sort((a, b) => {
                return -(
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                );
            })
            .map((post) => post.slug);
    }

    private createTag(name: string): ITag {
        const slug = slugify(name);
        return {
            slug,
            url: `/tags/${slug}`,
            name,
        };
    }

    private makeRenderedPost(post: IPost): Promise<IPost> {
        async function render(content: string) {
            const file = await unified()
                .use(remarkParse)
                .use(remarkRehype)
                .use(rehypePrism)
                .use(rehypeFormat)
                .use(rehypeStringify)
                .process(content);
            return file.toString();
        }

        return new Promise((resolve) => {
            Promise.all([render(post.content), render(post.excerpt)]).then(
                ([content, excerpt]) => {
                    let plaintextExcerpt = h2p(excerpt).slice(0, 160);
                    if (plaintextExcerpt.length === 160) {
                        plaintextExcerpt = plaintextExcerpt.slice(0, 159) + "…";
                    }
                    resolve({
                        ...post,
                        content,
                        excerpt,
                        seoSummary: plaintextExcerpt,
                    });
                },
            );
        });
    }

    public getPost(slug: string): Promise<IPost> {
        return this.postsBySlug[slug];
    }

    public getAllPostSlugs(): string[] {
        return this.postsSlugsByRecency;
    }

    public postToFragment(post: IPost): IPostFragment {
        const { content, ...fragment } = post;
        return {
            ...fragment,
            content: null as never,
        };
    }

    public async getRecentPosts(
        offset: number = 0,
        limit: number = 10,
        asFragment: boolean = true,
    ): Promise<IPostFragment[]> {
        const start = offset * limit;
        const end = start + limit;
        const slugs = this.postsSlugsByRecency.slice(start, end);
        const posts = await Promise.all(
            slugs.map((slug) => this.postsBySlug[slug]),
        );
        return asFragment ? posts.map(this.postToFragment) : posts;
    }

    public async getPostsByTag(tagSlug: string): Promise<IPostFragment[]> {
        const slugs = this.postsSlugsByTag[tagSlug];
        const posts = await Promise.all(
            slugs.map((slug) => this.postsBySlug[slug]),
        );
        return posts.map(this.postToFragment);
    }

    public getTags(): ITag[] {
        return Object.values(this.tagsBySlug);
    }

    public getTag(slug: string): ITag {
        return this.tagsBySlug[slug];
    }

    public getPostCount(): number {
        return this.postsSlugsByRecency.length;
    }
}

export const postModel = new PostModel();
