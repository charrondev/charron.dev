"use client";

import { useAlbumContext } from "@components/albums/AlbumContext";
import { ImageDetails } from "@components/albums/ImageDetails";
import { notFound, useParams, useRouter } from "next/navigation";

interface IProps {
    children: React.ReactNode;
}

export default function ImageDetailLayout(props: IProps) {
    const { album, detailImage } = useAlbumContext();
    const image = album.images.find(
        (img) => detailImage.imageID === img.imageID
    );
    const router = useRouter();
    if (!image) {
        return notFound();
    }

    return (
        <div>
            <ImageDetails
                image={image}
                onClose={() => {
                    router.back();
                }}
            />
            {props.children}
        </div>
    );
}
