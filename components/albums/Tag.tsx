import React from "react";
import classes from "./Tag.module.scss";
import { Cross2Icon } from "@radix-ui/react-icons";

interface IProps {
    children: React.ReactNode;
    onDelete?: () => void;
}

export function Tag(props: IProps) {
    return (
        <span className={classes.tag}>
            <span className={classes.tagText}>{props.children}</span>
            {props.onDelete && (
                <button
                    type="button"
                    className={classes.tagDelete}
                    onClick={props.onDelete}
                >
                    <Cross2Icon />
                </button>
            )}
        </span>
    );
}

export function Tags(props: { children: React.ReactNode }) {
    return <div className={classes.tags}>{props.children}</div>;
}
