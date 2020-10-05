/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import fs from "fs";
import path from "path";
import { notEmpty } from "@utils/notEmpty";
import matter, { GrayMatterFile } from "gray-matter";
import { slugify } from "@utils/slugify";
import renderToString from "next-mdx-remote/render-to-string";
import { mdxOptionsServer } from "@utils/mdxOptions";

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
    url: string;
}

type ISlugAndDate = Pick<IPost, "slug" | "date">;

export interface IPostFragment extends IPost {
    content: never;
}

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
                excerpt: parsed.excerpt || "No excerpt could be generated",
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

            post.excerpt = excerptLines.join("\n\n");
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
        return new Promise((resolve) => {
            Promise.all([
                renderToString(post.content, mdxOptionsServer),
                renderToString(post.excerpt, mdxOptionsServer),
            ]).then(([content, excerpt]) => {
                resolve({
                    ...post,
                    content,
                    excerpt,
                });
            });
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
        limit: number = 10
    ): Promise<IPostFragment[]> {
        const start = offset * limit;
        const end = start + limit;
        const slugs = this.postsSlugsByRecency.slice(start, end);
        const posts = await Promise.all(
            slugs.map((slug) => this.postsBySlug[slug])
        );
        return posts.map(this.postToFragment);
    }

    public async getPostsByTag(tagSlug: string): Promise<IPostFragment[]> {
        const slugs = this.postsSlugsByTag[tagSlug];
        const posts = await Promise.all(
            slugs.map((slug) => this.postsBySlug[slug])
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
