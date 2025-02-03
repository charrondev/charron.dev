import * as CheckboxBase from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import classes from "./Form.module.scss";
import React, { useId } from "react";
import classNames from "classnames";

interface IProps {
    checked?: boolean;
    onCheckedChange?: (newVal: boolean) => void;
    label: React.ReactNode;
    srOnly?: boolean;
    className?: string;
}

export function CheckBox(props: IProps) {
    const id = useId();

    return (
        <label
            className={classNames(classes.checkbox, props.className)}
            htmlFor={id}
        >
            <CheckboxBase.Root
                id={id}
                className={classes.checkboxRoot}
                checked={props.checked}
                onCheckedChange={props.onCheckedChange}
            >
                <CheckboxBase.Indicator className={classes.checkboxIndicator}>
                    <CheckIcon />
                </CheckboxBase.Indicator>
            </CheckboxBase.Root>
            <span
                className={classNames(
                    classes.checkboxLabel,
                    props.srOnly && "sr-only"
                )}
            >
                {props.label}
            </span>
        </label>
    );
}
