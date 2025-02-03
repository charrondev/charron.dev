import { ContextError } from "@app/api/ContextError";
import { indexArrayByKey } from "@utils/indexArrayByKey";
import { notEmpty } from "@utils/notEmpty";
import fs from "fs";
import {
    AlbumID,
    AlbumStore,
    IAlbum,
    ImageStore,
    TagImageStore,
} from "models/Album.types";
import path from "path";
import lockfile from "proper-lockfile";

const ALBUM_BASE_PATH = path.join(process.cwd(), "/data/albums");

export class AlbumModel {
    private tagImageStore!: TagImageStore;
    private imageStore!: ImageStore;
    private albumStore!: AlbumStore;

    public constructor() {
        this.loadFsData();
    }

    private loadFsData = () => {
        this.tagImageStore = this.loadJson(
            path.join(ALBUM_BASE_PATH, "tag-images.json"),
            {}
        );
        this.imageStore = this.loadJson(
            path.join(ALBUM_BASE_PATH, "images.json"),
            {}
        );
        this.albumStore = this.loadJson(
            path.join(ALBUM_BASE_PATH, "albums.json"),
            {}
        );
    };

    private persistFsData = () => {
        this.saveJson(
            path.join(ALBUM_BASE_PATH, "tag-images.json"),
            this.tagImageStore
        );
        this.saveJson(
            path.join(ALBUM_BASE_PATH, "images.json"),
            this.imageStore
        );
        this.saveJson(
            path.join(ALBUM_BASE_PATH, "albums.json"),
            this.albumStore
        );
    };

    private loadJson = <T>(path: string, fallback: T): T => {
        if (!fs.existsSync(path)) {
            return fallback;
        }

        const fileData = fs.readFileSync(path, "utf-8");
        const json = JSON.parse(fileData);
        return json;
    };

    private saveJson = (path: string, data: any) => {
        const text = JSON.stringify(data, null, 4);
        fs.writeFileSync(path, text);
    };

    public getAlbum = (albumID: AlbumID): IAlbum => {
        const album = this.albumStore[albumID] ?? null;
        if (album === null) {
            throw new ContextError("Album not found", 404, {
                albumID,
            });
        }

        const albumData: IAlbum = {
            ...album,
            images: album.imageIDs
                .map((id) => this.imageStore[id] ?? null)
                .filter(notEmpty),
        };
        return albumData;
    };

    public saveAlbum = (album: IAlbum) => {
        this.mutate(() => {
            // Make sure we are up-to-date.
            this.loadFsData();

            const images = indexArrayByKey(album.images, "imageID");

            this.albumStore[album.albumID] = {
                albumID: album.albumID,
                imageIDs: Object.keys(images),
                name: album.name,
            };

            // Update the images now
            this.imageStore = {
                ...this.imageStore,
                ...images,
            };

            this.regerateTagStore();
            this.persistFsData();
        });
    };

    private regerateTagStore = () => {
        const newStore: TagImageStore = {};
        Object.values(this.imageStore).forEach((image) => {
            image.tags?.forEach((tag) => {
                if (!(tag in newStore)) {
                    newStore[tag] = [];
                }
                newStore[tag].push(image.imageID);
            });
        });
        this.tagImageStore = newStore;
    };

    private mutate = (callback: Function) => {
        const release = lockfile.lockSync(path.join(ALBUM_BASE_PATH));
        try {
            callback();
        } finally {
            release();
        }
    };

    // private loadAlbum = (albumID: AlbumID): IAlbum => {
    //     const albumPath = path.join(ALBUM_BASE_PATH, albumID);
    //     if (!fs.existsSync(albumPath)) {

    //     }
    //     const albumFile = fs.readFileSync(albumID, "utf-8");
    //     const albumJson = JSON.parse();
    // };
}
