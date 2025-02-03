import { arrayMove } from "@dnd-kit/sortable";
import { ProgressEventEmitter, uploadImage } from "@utils/imageUtils";
import useLocalStorage from "@utils/useLocalStorage";
import axios from "axios";
import { IAlbum, IAlbumImage } from "models/Album.types";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useContext, useState } from "react";

export interface ProgressUpload {
    uploadID: string;
    file: File;
    progressEmitter: ProgressEventEmitter;
}

function useAlbumEditorInternal(albumID: string) {
    const [images, setImages] = useLocalStorage<IAlbumImage[]>(
        `album/${albumID}/images`,
        []
    );

    const albumUrl = `/albums/editor/${albumID}`;

    const { imageSlug } = useParams();
    const router = useRouter();
    const [name, setName] = useLocalStorage(`album/${albumID}/name`, "");
    const [selectedImageIDs, setSelectedImageIDs] = useState<string[]>([]);

    const [uploadingFiles, setUploadFiles] = useState<ProgressUpload[]>([]);

    const createImageUrl = useCallback(
        (image: IAlbumImage): string => {
            return `/albums/editor/${albumUrl}/${image.imageID}`;
        },
        [albumID]
    );

    const addImage = useCallback(
        (image: IAlbumImage) => {
            setImages((images) => {
                return [...images, image];
            });
        },
        [setImages]
    );

    const swapImages = useCallback(
        (imageID1: string, imageID2: string) => {
            if (imageID1 !== imageID2) {
                setImages((images) => {
                    const oldIndex = images.findIndex(
                        (img) => imageID1 === img.imageID
                    );
                    const newIndex = images.findIndex(
                        (img) => imageID2 === img.imageID
                    );

                    if (oldIndex === -1 || newIndex === -1) {
                        return images;
                    }

                    console.log("moving images", oldIndex, newIndex);

                    const result = arrayMove(images, oldIndex, newIndex);
                    console.log({ before: images, after: result });
                    return result;
                });
            }
        },
        [setImages]
    );

    const updateImage = useCallback(
        (editedImage: IAlbumImage) => {
            setImages((images) => {
                const idx = images.findIndex(
                    (image) => image.imageID === editedImage.imageID
                );
                const newImages = [...images];
                newImages[idx] = editedImage;
                return newImages;
            });
        },
        [setImages]
    );

    const removeImage = useCallback(
        (imageToDelete: IAlbumImage | string) => {
            setImages((images) =>
                images.filter((image) => {
                    const imageID =
                        typeof imageToDelete === "string"
                            ? imageToDelete
                            : imageToDelete.imageID;
                    return image.imageID !== imageID;
                })
            );
        },
        [setImages]
    );

    const startUploads = useCallback(
        async (files: File[]) => {
            const notUploadedFiles = files.filter((file) => {
                const newFileName = file.name;
                const existingFile =
                    images.find((img) => img.filename === newFileName) ??
                    uploadingFiles.find((upl) => upl.file.name === newFileName);
                return !existingFile;
            });

            if (notUploadedFiles.length === 0) {
                // Nothing to do.
                return;
            }

            // Create all of the progress uploads and insert them.
            const progressUploads = notUploadedFiles.map((file) => {
                const progressUpload: ProgressUpload = {
                    uploadID: crypto.randomUUID(),
                    file: file,
                    progressEmitter: new ProgressEventEmitter(),
                };

                return progressUpload;
            });
            setUploadFiles((uploadingFiles) => {
                return [...uploadingFiles, ...progressUploads];
            });

            // Now do the uploads one at a time.

            for (const progressUpload of progressUploads) {
                try {
                    const image = await uploadImage(
                        progressUpload.file,
                        progressUpload.progressEmitter
                    );
                    addImage(image);
                } catch (err) {
                    console.error("Error uploading image", err);
                }
                setUploadFiles((uploadingFiles) =>
                    uploadingFiles.filter(
                        (uploadedFile) =>
                            uploadedFile.uploadID !== progressUpload.uploadID
                    )
                );
            }
        },
        [setUploadFiles, addImage, images, uploadingFiles]
    );

    const currentDetailIndex =
        images.findIndex((img) => img.imageID === imageSlug) ?? 0;

    const navigateNextDetailImage = useCallback(() => {
        let newID: string;
        if (currentDetailIndex === images.length - 1) {
            newID = images[0].imageID;
        } else {
            newID = images[currentDetailIndex + 1].imageID;
        }
        router.replace(`/albums/editor/${albumID}/${newID}`);
        return newID;
    }, [currentDetailIndex, images]);

    const navigatePrevDetailImage = useCallback(() => {
        let newID: string;
        if (currentDetailIndex === 0) {
            newID = images[images.length - 1].imageID;
        } else {
            newID = images[currentDetailIndex - 1].imageID;
        }
        router.replace(`/albums/editor/${albumID}/${newID}`);
        return newID;
    }, [currentDetailIndex, images]);

    const [isSaving, setIsSaving] = useState(false);

    const save = useCallback(() => {
        setIsSaving(true);
        try {
            axios.put("/api/albums", {
                albumID,
                images,
                name: name,
            });
        } finally {
            setIsSaving(false);
        }
    }, []);

    const selectImage = useCallback(
        (imageID: string, isSelected: boolean) => {
            setSelectedImageIDs((imageIDs) => {
                const set = new Set(imageIDs);
                if (isSelected) {
                    set.add(imageID);
                } else {
                    set.delete(imageID);
                }
                return Array.from(set);
            });
        },
        [setSelectedImageIDs]
    );

    const clearSelection = useCallback(() => {
        setSelectedImageIDs([]);
    }, [setSelectedImageIDs]);

    return {
        album: {
            albumID,
            images,
            name,
        } as IAlbum,
        editor: {
            setName,
            addImage,
            updateImage,
            removeImage,
            swapImages,
            startUploads,
            uploadingFiles,
            isSaving,
            save,
            selectImage,
            selectedImageIDs,
            clearSelection,
        },
        route: {
            albumUrl: `/albums/editor/${albumID}`,
            createImageUrl,
        },
        detailImage: {
            imageID: imageSlug as string | undefined,
            next: navigateNextDetailImage,
            prev: navigatePrevDetailImage,
        },
    };
}

type IAlbumContext = ReturnType<typeof useAlbumEditorInternal>;
const noop = (): any => {};
const AlbumContext = React.createContext<IAlbumContext>({
    album: {
        albumID: "",
        images: [],
        name: "",
    },
    editor: {
        setName: noop,
        addImage: noop,
        updateImage: noop,
        removeImage: noop,
        swapImages: noop,
        startUploads: noop,
        uploadingFiles: [],
        isSaving: false,
        save: noop,
        selectedImageIDs: [],
        selectImage: noop,
        clearSelection: noop,
    },
    route: {
        albumUrl: "",
        createImageUrl: () => "#",
    },
    detailImage: {
        imageID: undefined,
        next: noop,
        prev: noop,
    },
});

export function AlbumContextProvider(props: {
    albumID: string;
    children: React.ReactNode;
}) {
    const context = useAlbumEditorInternal(props.albumID);
    return (
        <AlbumContext.Provider value={context}>
            {props.children}
        </AlbumContext.Provider>
    );
}

export function useAlbumContext() {
    return useContext(AlbumContext);
}
