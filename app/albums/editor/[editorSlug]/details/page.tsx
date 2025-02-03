"use client";

import { Layout } from "@components/Layout";
import { useAlbumContext } from "@components/albums/AlbumContext";
import { AlbumForm } from "@components/albums/AlbumForm";
import { useRouter } from "next/navigation";

interface IProps {
    params: Promise<{
        editorSlug: string;
    }>;
}

export default function ImagesPage(props: IProps) {
    const album = useAlbumContext();
    const router = useRouter();
    return (
        <Layout maxWidth={1200} overlayHeader>
            <AlbumForm
                displayMode="list"
                setDisplayMode={(newMode) => {
                    if (newMode === "grid") {
                        router.push(album.route.albumUrl);
                    }
                }}
            />
        </Layout>
    );
}
