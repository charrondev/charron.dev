import { createOgImage } from "@components/createOgImage";
import { postModel } from "@utils/PostModel";

export const contentType = "image/png";
export const dynamic = "force-static";

export default async function PostOpenGraphImage(props: {
    params: { postSlug: string };
}) {
    const post = await postModel.getPost(props.params.postSlug);
    if (!post) {
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }

    return createOgImage(post.name);
}

export function generateStaticParams() {
    return postModel.getAllPostSlugs().map((slug) => ({ postSlug: slug }));
}
