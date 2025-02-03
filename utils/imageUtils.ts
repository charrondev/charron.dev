"use client";

import { ContextError } from "stubbed/api/ContextError";
import axios, { AxiosProgressEvent, AxiosResponse, isAxiosError } from "axios";
import { encode as encodeBlurHash } from "blurhash";
import exifr from "exifr/dist/full.esm.mjs";
import { extractColorsFromImageData } from "extract-colors";
import { IAlbumImage } from "models/Album.types";

const EXIF_FIELDS = [
    "FNumber",
    "FocalLength",
    "ISO",
    "LensModel",
    "Make",
    "Model",
    "ExposureTime",
    "DateTimeOriginal",
] as const;

type PreuploadedImage = Omit<IAlbumImage, "imageID">;

async function preuploadFile(
    file: File,
    loadedImage: HTMLImageElement,
): Promise<PreuploadedImage> {
    const imageData = extractImageData(loadedImage);
    const blurHash = encodeBlurHash(
        imageData.data,
        imageData.width,
        imageData.height,
        4,
        4,
    );

    const metadata = await exifr.parse(
        loadedImage,
        EXIF_FIELDS as any as string[],
    );

    const colors = extractColorsFromImageData(imageData, {
        pixels: 10000000,
        distance: 0.28,
        hueDistance: 0.8,
        saturationDistance: 0.05,
        lightnessDistance: 0.1,
    });

    const result = {
        colors: colors.map((color) => color.hex),
        blurHash,
        height: imageData.height,
        width: imageData.width,
        metadata,
        filename: file.name,
    };
    return result;
}

export async function uploadImage(
    file: File,
    progressEmitter?: ProgressEventEmitter,
): Promise<IAlbumImage> {
    const url = URL.createObjectURL(file);
    const loadedImage = await loadImage(url);

    const [preuploaded, response] = await Promise.all([
        preuploadFile(file, loadedImage),
        uploadFileToApi(file, progressEmitter).catch((err) => {
            if (isAxiosError(err) && err.response?.status === 413) {
                console.log("Failed initial upload. Trying again.", err);
                return tryCompressAndReupload(loadedImage);
            } else {
                throw err;
            }
        }),
    ]);

    const json = response.data;

    const cloudflareID = json.result.id;
    if (!cloudflareID) {
        throw new ContextError(
            "Response did not contain a cloudflare image ID",
            500,
            json,
        );
    }

    const result = {
        ...preuploaded,
        imageID: cloudflareID,
    };
    return result;
}

function tryCompressAndReupload(
    uploadedImage: HTMLImageElement,
): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
        const newWidth = Math.round(uploadedImage.naturalWidth * 0.8);
        const { canvas } = shrinkToCanvas(uploadedImage, newWidth);
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    return reject("Failed to resize image.");
                }

                return resolve(uploadFileToApi(blob));
            },
            "image/jpeg",
            95,
        );
    });
}

function uploadFileToApi(file: File | Blob, progress?: ProgressEventEmitter) {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post("/api/images", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress: progress?.emit,
    });
}

export type ProgressEventHandler = (event: AxiosProgressEvent) => void;

export class ProgressEventEmitter {
    private listeners: ProgressEventHandler[] = [];

    public emit = (event: AxiosProgressEvent) => {
        this.listeners.forEach((listener) => {
            listener(event);
        });
    };

    public addEventListener = (listener: ProgressEventHandler) => {
        this.listeners.push(listener);
    };

    public removeEventListener = (listener: ProgressEventHandler) => {
        this.listeners = this.listeners.filter(
            (registeredListener) => listener !== registeredListener,
        );
    };
}

export function loadImage(imgSrc: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            resolve(img);
        };
        img.src = imgSrc;
    });
}

export function getImageDimensions(
    image: File,
): Promise<{ height: number; width: number }> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const result = {
                height: img.naturalHeight,
                width: img.naturalWidth,
            };
            URL.revokeObjectURL(img.src);
            resolve(result);
        };
        img.src = URL.createObjectURL(image);
    });
}

function shrinkToCanvas(
    image: HTMLImageElement,
    maxWidth: number,
): {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    newHeight: number;
    newWidth: number;
} {
    const canvas = document.createElement("canvas");
    const newWidth = maxWidth;
    const downScale = maxWidth / image.naturalWidth;
    const newHeight = Math.round(image.naturalHeight * downScale);
    canvas.width = maxWidth;
    canvas.height = newHeight;
    const context = canvas.getContext("2d")!;
    context.drawImage(image, 0, 0, newWidth, newHeight);
    return {
        canvas,
        context,
        newHeight,
        newWidth,
    };
}

export function extractImageData(image: HTMLImageElement) {
    const { context, newHeight, newWidth } = shrinkToCanvas(image, 300);
    return context.getImageData(0, 0, newWidth, newHeight);
}
