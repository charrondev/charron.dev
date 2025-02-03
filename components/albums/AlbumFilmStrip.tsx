import { useAlbumContext } from "@components/albums/AlbumContext";
import { CloudflareImageLink } from "@components/albums/CloudflareImage";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import classNames from "classnames";
import { useLayoutEffect, useRef } from "react";
import classes from "./AlbumFilmStrip.module.scss";

export function AlbumFilmStrip(props: { className?: string }) {
    const { album, detailImage } = useAlbumContext();

    const refsByImageID = useRef<Record<string, HTMLElement | null>>({});
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        if (!detailImage.imageID) {
            return;
        }

        if (!scrollRef.current) {
            return;
        }

        const currentThumbnail = refsByImageID.current?.[detailImage.imageID];
        if (!currentThumbnail) {
            return;
        }

        // Figure out how far along into the view the current thumbnail is.
        const thumbnailOffset = currentThumbnail.offsetLeft;
        const scrollRefWidth = scrollRef.current.getBoundingClientRect().width;

        // Adjust scrolling so that we are scrolled to the middle.

        scrollRef.current.scrollTo({
            left: Math.max(
                thumbnailOffset +
                    scrollRefWidth / 2 -
                    scrollRefWidth +
                    currentThumbnail.clientWidth / 2,
                0
            ),
            behavior: "smooth",
        });
    }, [detailImage.imageID]);

    return (
        <div
            className={classNames(classes.strip, props.className)}
            onKeyDown={(e) => {
                if (e.target instanceof HTMLInputElement) {
                    return;
                }

                let newID: string | null = null;
                if (e.key === "ArrowRight") {
                    e.preventDefault();
                    e.stopPropagation();
                    newID = detailImage.next();
                } else if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    e.stopPropagation();
                    newID = detailImage.prev();
                }

                if (newID !== null) {
                    refsByImageID.current?.[newID]?.focus();
                }
            }}
        >
            <button
                className={classes.stripArrow}
                onClick={() => {
                    detailImage.prev();
                }}
            >
                <ChevronLeftIcon />
            </button>
            <div className={classes.stripItemsWrapper}>
                <div className={classes.stripItems} ref={scrollRef}>
                    {album.images.map((image, i) => {
                        const isCurrent = detailImage.imageID === image.imageID;
                        return (
                            <CloudflareImageLink
                                replace
                                ref={(ref) => {
                                    refsByImageID.current[image.imageID] = ref;
                                }}
                                tabIndex={
                                    detailImage.imageID === image.imageID
                                        ? 0
                                        : -1
                                }
                                image={image}
                                key={i}
                                size="480"
                                className={classNames(classes.stripItem, {
                                    [classes.currentStripItem]: isCurrent,
                                })}
                            />
                        );
                    })}
                </div>
            </div>
            <button
                className={classes.stripArrow}
                onClick={() => {
                    detailImage.next();
                }}
            >
                <ChevronRightIcon />
            </button>
        </div>
    );
}
