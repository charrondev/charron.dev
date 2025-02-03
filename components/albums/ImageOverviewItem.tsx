import { Tags } from "@components/Tags";
import { ToolTip } from "@components/Tooltip";
import { useAlbumContext } from "@components/albums/AlbumContext";
import {
    CloudflareImage,
    CloudflareImageLink,
} from "@components/albums/CloudflareImage";
import {
    ImageUpload,
    ImageUploadProgress,
} from "@components/albums/ImageUploadProgress";
import { CheckBox } from "@components/form/CheckBox";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import classNames from "classnames";
import { IAlbumImage } from "models/Album.types";
import Link from "next/link";
import classes from "./ImageOverviewItem.module.scss";
import React from "react";

type IProps = {
    displayMode: "grid" | "list";
    draggable?: boolean;
    extraOptions?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement> &
    (
        | {
              image: IAlbumImage;
              uploadImage?: never;
          }
        | {
              image?: never;
              uploadImage: ImageUpload;
          }
    );

export const ImageOverviewItem = React.forwardRef<HTMLDivElement, IProps>(
    function ImageOverviewItem(props: IProps, ref) {
        const {
            image,
            uploadImage,
            draggable,
            displayMode,
            extraOptions,
            ...rest
        } = props;
        const { album, editor, route } = useAlbumContext();
        const isSelected = editor.selectedImageIDs.includes(
            image?.imageID ?? ""
        );

        const rootProps = {
            ref,
            ...rest,
        };

        const imageView =
            image &&
            (draggable ? (
                <div className={classes.image}>
                    <CloudflareImage
                        image={image}
                        size={displayMode === "grid" ? "720" : "2000"}
                    />
                </div>
            ) : (
                <CloudflareImageLink
                    image={image}
                    className={classes.image}
                    size={displayMode === "grid" ? "720" : "2000"}
                />
            ));

        const thumbnail = (
            <div
                className={classNames(
                    classes.imageContainer,
                    displayMode === "list" && classes.thumbnailImage
                )}
                data-draggable={draggable}
                data-selected={isSelected}
                {...(draggable ? rootProps : {})}
            >
                {imageView}
                {uploadImage && (
                    <ImageUploadProgress
                        upload={uploadImage}
                    ></ImageUploadProgress>
                )}
                {image && !draggable && (
                    <span className={classes.imageCheckboxContainer}>
                        {extraOptions}
                        <CheckBox
                            label="Select image"
                            srOnly
                            checked={isSelected}
                            onCheckedChange={(newValue) => {
                                editor.selectImage(image.imageID, newValue);
                            }}
                            className={classes.imageCheckbox}
                        />
                    </span>
                )}
            </div>
        );

        const details = image ? (
            <div className={classes.thumbnailDetails}>
                {!image.alt &&
                    !image.description &&
                    (!image.tags || image.tags.length === 0) && (
                        <div className={classes.thumbnailAlert}>
                            <ExclamationTriangleIcon />
                            There is no metadata for this item.
                        </div>
                    )}
                {image.alt && (
                    <h2 className={classes.thumbnailTitle}>
                        <Link href={route.createImageUrl(image)}>
                            {image.alt}
                        </Link>
                    </h2>
                )}
                {(image.tags?.length ?? 0) > 0 && (
                    <div className={classes.thumbnailTags}>
                        <Tags
                            tags={image.tags!.map((tag) => {
                                return {
                                    url: "#",
                                    name: tag,
                                    slug: tag,
                                };
                            })}
                        />
                    </div>
                )}
                {image.description && (
                    <div className={classes.thumbnailDescription}>
                        {image.description}
                    </div>
                )}
            </div>
        ) : (
            <div className={classes.thumbnailDetails}></div>
        );

        if (displayMode === "grid") {
            if (draggable || uploadImage) {
                return thumbnail;
            }
            return (
                <ToolTip {...rootProps} tooltip={details}>
                    {thumbnail}
                </ToolTip>
            );
        } else {
            return (
                <div className={classes.thumbnailRow} ref={ref} {...rest}>
                    {thumbnail}
                    {details}
                </div>
            );
        }
    }
);
