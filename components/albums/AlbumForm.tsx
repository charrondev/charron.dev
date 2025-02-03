"use client";

import { useAlbumContext } from "@components/albums/AlbumContext";
import { AlbumToolbar } from "@components/albums/AlbumToolbar";
import { CloudflareImage } from "@components/albums/CloudflareImage";
import { ImageOverviewItem } from "@components/albums/ImageOverviewItem";
import { Input } from "@components/form/Input";
import { Label } from "@components/form/Label";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    rectSortingStrategy,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UploadIcon } from "@radix-ui/react-icons";
import { NoSSRWrapper } from "@utils/NoSsr";
import React, { useRef, useState } from "react";
import classes from "./AlbumForm.module.scss";
import imageClasses from "./Image.module.scss";

type DisplayMode = "grid" | "list";

export function AlbumForm(props: {
    displayMode: DisplayMode;
    setDisplayMode: (newDisplayMode: DisplayMode) => void;
}) {
    const { album, editor } = useAlbumContext();
    const { displayMode, setDisplayMode } = props;
    const [filterAttention, setFilterAttention] = useState(false);
    const [isDragEnabled, setDragEnabled] = useState(false);

    const coverImage =
        album.images.find((image) => image.isCoverImage) ?? album.images[0];

    let images = album.images;

    const uploadingView = (
        <>
            {editor.uploadingFiles.map((upload, i) => {
                return (
                    <ImageOverviewItem
                        key={"uploading" + i}
                        displayMode={displayMode}
                        uploadImage={upload}
                    />
                );
            })}
            <UploadButton />
        </>
    );

    return (
        <NoSSRWrapper>
            <div>
                <div className={classes.banner}>
                    {coverImage && (
                        <CloudflareImage
                            image={coverImage}
                            className={classes.bannerBg}
                            size="2000"
                        />
                    )}
                    <div className={classes.bannerOverlay}></div>
                    <div className={classes.bannerContent}>
                        <Label
                            srOnlyLabel
                            label="Album Title"
                            className={classes.albumTitle}
                        >
                            <Input
                                type="text"
                                value={album.name}
                                onChange={editor.setName}
                                placeholder="Album Title"
                            />
                        </Label>
                    </div>
                </div>
            </div>
            <AlbumToolbar
                className={classes.toolbar}
                {...{
                    filterAttention,
                    setFilterAttention,
                    displayMode,
                    setDisplayMode,
                    setDragEnabled,
                    isDragEnabled,
                }}
            />
            {isDragEnabled ? (
                <SortableAlbumImages extraChildren={uploadingView} />
            ) : (
                <AlbumGrid
                    displayMode={displayMode}
                    extraChildren={uploadingView}
                    filterAttention={filterAttention}
                />
            )}
        </NoSSRWrapper>
    );
}

function AlbumGrid(props: {
    extraChildren?: React.ReactNode;
    filterAttention?: boolean;
    displayMode: DisplayMode;
}) {
    const { displayMode } = props;
    const { album } = useAlbumContext();
    let images = album.images;
    if (props.filterAttention) {
        images = images.filter((image) => {
            return !image.alt || !image.tags || image.tags.length === 0;
        });
    }

    return (
        <div
            className={
                displayMode === "grid" ? classes.imageGrid : classes.imageRows
            }
        >
            {images.map((image, i) => {
                const key = "uploaded-" + image.imageID + "grid";
                return (
                    <ImageOverviewItem
                        image={image}
                        key={key}
                        displayMode={displayMode}
                    />
                );
            })}

            {props.extraChildren}
        </div>
    );
}

function SortableAlbumImages(props: { extraChildren?: React.ReactNode }) {
    const displayMode = "grid";
    const { album, editor } = useAlbumContext();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 100,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const images = album.images;
    const [draggedID, setDraggedID] = useState<string | null>(null);

    function handleDragStart(event: DragStartEvent) {
        setDraggedID(event.active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        setDraggedID(null);
        const { active, over } = event;
        if (!over) {
            return;
        }
        editor.swapImages(active.id as string, over.id as string);
    }

    const draggedImage = images.find((img) => img.imageID === draggedID);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
        >
            <SortableContext
                items={images.map((image) => image.imageID)}
                strategy={
                    displayMode === "grid"
                        ? rectSortingStrategy
                        : verticalListSortingStrategy
                }
            >
                <div
                    className={
                        displayMode === "grid"
                            ? classes.imageGrid
                            : classes.imageRows
                    }
                >
                    {images.map((image, i) => {
                        const key = "uploaded-" + image.imageID + "grid";
                        return (
                            <DraggableOverviewItem
                                image={image}
                                key={key}
                                displayMode={displayMode}
                            />
                        );
                    })}

                    <DragOverlay>
                        {draggedImage && (
                            <ImageOverviewItem
                                draggable
                                image={draggedImage}
                                displayMode={displayMode}
                            />
                        )}
                    </DragOverlay>

                    {props.extraChildren}
                </div>
            </SortableContext>
        </DndContext>
    );
}

function DraggableOverviewItem(
    props: React.ComponentProps<typeof ImageOverviewItem>
) {
    const { image } = props;
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: props.image!.imageID,
        transition: {
            duration: 150, // milliseconds
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        },
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        ...(isDragging
            ? {
                  background: "var(--color-blur-bg)",
                  zIndex: 100,
                  aspectRatio: `${image!.width} / ${image!.height}`,
                  border: "1px solid var(--color-border)",
                  borderRadius: 6,
              }
            : {}),
    };

    if (isDragging) {
        return (
            <div
                style={style}
                draggable
                ref={setNodeRef}
                {...props}
                {...attributes}
                {...listeners}
            ></div>
        );
    }

    return (
        <ImageOverviewItem
            draggable
            ref={setNodeRef}
            style={style}
            {...props}
            {...attributes}
            {...listeners}
        />
    );
}

function UploadButton() {
    const { editor } = useAlbumContext();
    const uploadRef = useRef<HTMLInputElement | null>(null);
    const [uploadCount, setUploadCount] = useState(0);
    return (
        <>
            <button
                type="button"
                id="upload"
                className={imageClasses.imageUpload}
                onClick={() => {
                    uploadRef.current?.click();
                }}
            >
                <UploadIcon />
                Upload
            </button>
            <input
                tabIndex={-1}
                key={uploadCount}
                ref={uploadRef}
                type="file"
                multiple
                className="sr-only"
                accept="image/png, image/jpeg"
                onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                        const fileArr = Array.from(files);
                        editor.startUploads(fileArr);
                        setUploadCount((i) => i + 1);
                    }
                }}
            ></input>
        </>
    );
}
