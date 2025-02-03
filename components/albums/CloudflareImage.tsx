import { blurHashToDataUri } from "@utils/blurHash";
import classNames from "classnames";
import { IAlbumImage } from "models/Album.types";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";
import classes from "./Image.module.scss";

const IMAGE_SIZES = [
    "full",
    "4000",
    "2000",
    "1000",
    "720",
    "480",
    "blur",
] as const;

type IMAGE_SIZE = (typeof IMAGE_SIZES)[number];

interface IProps
    extends React.DetailedHTMLProps<
        React.ImgHTMLAttributes<HTMLImageElement>,
        HTMLImageElement
    > {
    image: IAlbumImage;
    size?: IMAGE_SIZE;
    replace?: boolean;
}

export const CloudflareImageLink = React.forwardRef<HTMLElement, IProps>(
    function CloudflareImageLink(props: IProps, ref) {
        const { className, replace, image, size, ...rest } = props;
        const { editorSlug } = useParams();
        return (
            <Link
                {...rest}
                replace={replace}
                ref={ref as any}
                href={`/albums/editor/${editorSlug}/${props.image.imageID}`}
                className={classNames(classes.image, className)}
                style={{
                    aspectRatio: `${props.image.width} / ${props.image.height}`,
                }}
            >
                <CloudflareImage image={image} size={size} />
            </Link>
        );
    }
);

export const CloudflareImage = React.forwardRef<HTMLImageElement, IProps>(
    function CloudflareImage(props: IProps, ref) {
        const { image, size, ...rest } = props;
        const baseUrl = `https://charron.dev/cdn-cgi/imagedelivery/4N9h-qqEGYTn_kaVwUTSLw/${props.image.imageID}`;
        const blurDataUrl = useMemo(() => {
            return blurHashToDataUri(image);
        }, [image]);

        return (
            <img
                onDragStart={(e) => {
                    e.preventDefault();
                }}
                ref={ref}
                style={{
                    backgroundSize: "cover",
                    backgroundPosition: "50% 50%",
                    backgroundRepeat: "no-repeat",
                    backgroundImage: `url("${blurDataUrl}")`,
                }}
                height={image.height}
                width={image.width}
                loading="lazy"
                className={classes.image}
                {...rest}
                alt={rest.alt ?? "Missing alt"}
                src={`${baseUrl}/${size ?? "2000"}`}
            />
        );
    }
);
