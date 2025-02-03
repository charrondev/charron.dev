/**
 * @copyright 2022 Adam (charrondev) Charron
 * @license Proprietary
 */

"use client";

import { useAlbumContext } from "@components/albums/AlbumContext";
import { AlbumFilmStrip } from "@components/albums/AlbumFilmStrip";
import { CloudflareImage } from "@components/albums/CloudflareImage";
import { Tag, Tags } from "@components/albums/Tag";
import { Input } from "@components/form/Input";
import { Label } from "@components/form/Label";
import IconAperture from "@logos/icon/aperture.svg";
import IconCalendar from "@logos/icon/calendar.svg";
import IconCamera from "@logos/icon/camera.svg";
import IconLens from "@logos/icon/lens.svg";
import IconShutter from "@logos/icon/watch.svg";
import IconZoom from "@logos/icon/zoom-in.svg";
import { Cross2Icon } from "@radix-ui/react-icons";
import { blurHashToDataUri } from "@utils/blurHash";
import { calculateClosestFraction } from "@utils/calculateClosestFraction";
import classNames from "classnames";
import { getBlurHashAverageColor } from "fast-blurhash";
import { IAlbumImage } from "models/Album.types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import classes from "./ImageDetails.module.scss";

interface IProps {
    image: IAlbumImage;
    onClose: () => void;
}

export function ImageDetails(props: IProps) {
    const { image } = props;
    const { editor, detailImage, route } = useAlbumContext();
    const router = useRouter();

    const colors = image.colors;
    const blurDataUrl = useMemo(() => {
        return blurHashToDataUri({ ...image });
    }, [image.blurHash]);

    useEffect(() => {
        function handleEvent(e: KeyboardEvent) {
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement
            ) {
                return;
            }

            if (e.key === "ArrowRight") {
                e.preventDefault();
                e.stopPropagation();
                detailImage.next();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                e.stopPropagation();
                detailImage.prev();
            } else if (e.key === "Escape") {
                e.preventDefault();
                e.stopPropagation();
                router.replace(route.albumUrl);
            }
        }

        window.addEventListener("keydown", handleEvent);
        return () => {
            window.removeEventListener("keydown", handleEvent);
        };
    }, [detailImage.prev, detailImage.next]);

    return (
        <div className={classNames(classes.root, "dark-theme")}>
            <img
                alt="Background blur"
                src={blurDataUrl}
                style={{
                    background: `linear-gradient(${colors.join(", ")})`,
                }}
                className={classes.backdrop}
            />
            <div className={classes.header}>
                <Label label="Image Title" dark className={classes.headerTitle}>
                    <Input
                        key={image.imageID}
                        type="text"
                        placeholder="Untitled Image"
                        value={image.alt}
                        onChange={(newValue) => {
                            editor.updateImage({ ...image, alt: newValue });
                        }}
                    />
                </Label>
                <AlbumFilmStrip className={classes.strip} />
                <button
                    className={classes.closeButton}
                    type="button"
                    onClick={() => {
                        props.onClose();
                    }}
                >
                    <Cross2Icon />
                </button>
            </div>

            <div className={classes.row}>
                <div className={classes.details}>
                    <div
                        className={classes.imageContainer}
                        style={{
                            aspectRatio: `${image.width} / ${image.height}`,
                        }}
                    >
                        <CloudflareImage
                            key={image.imageID}
                            style={{
                                background: `rgb(${getBlurHashAverageColor(
                                    image.blurHash
                                ).join(", ")})`,
                            }}
                            className={classes.image}
                            image={image}
                            size="4000"
                        />
                    </div>
                    <ImageDetailForm key={image.imageID} {...props} />
                </div>
            </div>
        </div>
    );
}

function ImageDetailForm(props: IProps) {
    const { editor, album } = useAlbumContext();
    const { image } = props;
    const [newTagValue, setNewTagValue] = useState("");

    const exposureValue = useMemo(() => {
        const float = parseFloat(image.metadata.ExposureTime);
        if (Number.isNaN(float)) {
            return image.metadata.ExposureTime;
        }
        const calced = calculateClosestFraction(float);
        return `${calced.numerator}/${calced.denominator}s`;
    }, [image.metadata.ExposureTime]);

    return (
        <div className={classes.aside}>
            <Label label="Description" className={classes.description} dark>
                <Input
                    type="text-multiline"
                    value={image.description ?? ""}
                    onChange={(newDescription) => {
                        editor.updateImage({
                            ...image,
                            description: newDescription,
                        });
                    }}
                    placeholder="Add a description here..."
                />
            </Label>

            <div className={classes.metas}>
                <strong className={classes.metaTitle}>Tags</strong>

                {image.tags && image.tags.length > 0 && (
                    <Tags>
                        {image.tags.map((tag, i) => {
                            return (
                                <Tag
                                    key={i}
                                    onDelete={() => {
                                        const newTags = new Set(
                                            image.tags ?? []
                                        );
                                        newTags.delete(tag);
                                        editor.updateImage({
                                            ...image,
                                            tags: Array.from(newTags),
                                        });
                                    }}
                                >
                                    {tag}
                                </Tag>
                            );
                        })}
                    </Tags>
                )}

                <form
                    className={classes.newTag}
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (newTagValue.length === 0) {
                            return;
                        }
                        const newTags = new Set(image.tags ?? []);
                        newTags.add(newTagValue);
                        editor.updateImage({
                            ...image,
                            tags: Array.from(newTags),
                        });
                        setNewTagValue("");
                    }}
                >
                    <Label label="Add Tag" dark srOnlyLabel>
                        <Input
                            list="taglist"
                            value={newTagValue}
                            onChange={setNewTagValue}
                            type="text"
                            placeholder="New Tag Name"
                        />
                        <datalist id="taglist">
                            {Array.from(
                                new Set(album.images.flatMap((img) => img.tags))
                            ).map((tag, i) => {
                                return <option value={tag} key={i} />;
                            })}
                        </datalist>
                    </Label>
                    <button disabled={newTagValue.length === 0} type="submit">
                        Save
                    </button>
                </form>
            </div>

            <div className={classes.metas}>
                <strong className={classes.metaTitle}>Metadata</strong>
                <MetaRow icon={<IconCalendar />} iconLabel="Date">
                    {new Date(image.metadata.DateTimeOriginal).toLocaleString(
                        "en",
                        {
                            dateStyle: "medium",
                            timeStyle: "medium",
                        }
                    )}
                </MetaRow>
                <MetaRow icon={<IconCamera />} iconLabel="Camera">
                    {image.metadata.Make + " " + image.metadata.Model}
                </MetaRow>
                <MetaRow icon={<IconLens />} iconLabel="Lens">
                    {image.metadata.LensModel}
                </MetaRow>
                <MetaRow icon={<IconAperture />} iconLabel="Aperture">
                    f/{image.metadata.FNumber}
                </MetaRow>
                <MetaRow icon={<IconShutter />} iconLabel="Exposure Time">
                    {exposureValue}
                </MetaRow>
                <MetaRow icon={<IconZoom />} iconLabel="Focal Length">
                    {image.metadata.FocalLength}mm
                </MetaRow>
            </div>
        </div>
    );
}

function MetaRow(props: {
    children: React.ReactNode;
    icon: React.ReactNode;
    iconLabel: string;
}) {
    return (
        <div className={classes.meta}>
            <span className={classes.metaIcon} title={props.iconLabel}>
                {props.icon}
            </span>
            <span className={classes.metaText}>{props.children}</span>
        </div>
    );
}
