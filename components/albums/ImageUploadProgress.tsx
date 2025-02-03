import { ProgressEventEmitter } from "@utils/cloudflareClient";
import classes from "./Image.module.scss";
import { useEffect, useMemo, useState } from "react";
import { AxiosProgressEvent } from "axios";
import * as Progress from "@radix-ui/react-progress";
import classNames from "classnames";
import { ProgressUpload } from "@components/albums/AlbumContext";

interface IProps {
    upload: ProgressUpload;
    className?: string;
}

export function ImageUploadProgress(props: IProps) {
    const { upload } = props;
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleProgress = (event: AxiosProgressEvent) => {
            setProgress(Math.round((event.loaded / (event.total ?? 1)) * 100));
        };
        upload.progressEmitter.addEventListener(handleProgress);
        return () => {
            upload.progressEmitter.removeEventListener(handleProgress);
        };
    }, [upload.progressEmitter]);

    const url = useMemo(() => {
        return URL.createObjectURL(upload.file);
    }, [upload.file.name]);

    return (
        <div
            className={classNames(
                classes.image,
                classes.progressImage,
                props.className
            )}
        >
            <img loading="lazy" src={url} />
            <Progress.Root className={classes.progressRoot} value={progress}>
                <Progress.Indicator
                    className={classes.progressIndicator}
                    style={{ transform: `translateX(-${100 - progress}%)` }}
                />
            </Progress.Root>
        </div>
    );
}
