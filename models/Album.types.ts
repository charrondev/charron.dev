export const ALBUM_EXIF_FIELDS = [
    "FNumber",
    "FocalLength",
    "ISO",
    "LensModel",
    "Make",
    "Model",
    "ExposureTime",
    "DateTimeOriginal",
] as const;

export interface IAlbumImage {
    alt?: string;
    description?: string;
    filename: string;
    imageID: string;
    height: number;
    width: number;
    colors: string[];
    blurHash: string;
    metadata: Record<(typeof ALBUM_EXIF_FIELDS)[number], string>;
    tags?: string[];
    isCoverImage?: boolean;
    isBannerImage?: boolean;
}

export interface IStoredAlbum {
    name: string;
    albumID: AlbumID;
    imageIDs: ImageID[];
}

export interface IAlbum {
    name: string;
    albumID: string;
    images: IAlbumImage[];
}

export type ImageID = IAlbumImage["imageID"];
export type ImageStore = Record<string, IAlbumImage>;
export type AlbumStore = Record<AlbumID, IStoredAlbum>;

export type TagImageStore = Record<string, ImageID[]>;

export type AlbumID = IAlbum["albumID"];
