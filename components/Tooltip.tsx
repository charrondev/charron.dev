import { useState } from "react";
import classes from "./Tooltip.module.scss";
import * as Tooltip from "@radix-ui/react-tooltip";
import React from "react";

interface IProps {
    children: React.ReactNode;
    tooltip: React.ReactNode;
}

export const ToolTip = React.forwardRef(function ToolTip(
    props: IProps,
    ref: any,
) {
    const { children, tooltip, ...rest } = props;
    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger {...rest} ref={ref} asChild>
                    {props.children}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className={classes.tooltipContent}
                        sideOffset={5}
                    >
                        {props.tooltip}
                        <Tooltip.Arrow className={classes.tooltipArrow} />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
});
