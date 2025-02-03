"use client";
import { AlbumContextProvider } from "@components/albums/AlbumContext";
import { useParams } from "next/navigation";

export default function AlbumLayout(props: { children: React.ReactNode }) {
    const params = useParams();
    const { editorSlug } = params;
    return (
        <AlbumContextProvider albumID={editorSlug}>
            {props.children}
        </AlbumContextProvider>
    );
}
