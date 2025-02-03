import { IAlbumImage } from "models/Album.types";
import classes from "./AlbumImageBanner.module.scss";
import { CloudflareImage } from "@components/albums/CloudflareImage";

interface IProps {
    image: IAlbumImage;
}

export function AlbumImageBanner(props: IProps) {
    return (
        <div
            className={classes.root}
            style={{
                aspectRatio: `${props.image.width} / ${props.image.height}`,
            }}
        >
            <CloudflareImage image={props.image} className={classes.image} />
            <div className={classes.content}>
                <h2></h2>
            </div>
        </div>
    );
}
