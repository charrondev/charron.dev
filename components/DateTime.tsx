/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import React from "react";

interface IProps {
    children: string;
    className?: string;
}

export function DateTime(props: IProps) {
    const date = new Date(props.children);
    return (
        <time
            className={props.className}
            dateTime={date.toISOString()}
            title={date.toISOString()}
        >
            {date.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
            })}
        </time>
    );
}
