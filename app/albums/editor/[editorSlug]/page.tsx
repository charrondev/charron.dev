"use client";

import { Layout } from "@components/Layout";
import { useAlbumContext } from "@components/albums/AlbumContext";
import { AlbumForm } from "@components/albums/AlbumForm";
import { useRouter } from "next/navigation";

interface IProps {
    params: {
        editorSlug: string;
    };
}

export default function ImagesPage(props: IProps) {
    const router = useRouter();
    const { route } = useAlbumContext();
    return (
        <Layout overlayHeader maxWidth={1200}>
            <AlbumForm
                displayMode="grid"
                setDisplayMode={(newMode) => {
                    if (newMode === "list") {
                        router.push(route.albumUrl + "/details");
                    }
                }}
            />
        </Layout>
    );
}
