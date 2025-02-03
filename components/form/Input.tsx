import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import classes from "./Form.module.scss";
import classNames from "classnames";

interface IProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        "type" | "onChange" | "value"
    > {
    type: "text" | "text-multiline";
    value?: string;
    onChange?: (newValue: string) => void;
}

export function Input(props: IProps) {
    const { type, onChange, ...rest } = props;
    const [ownValue, setOwnValue] = useState(props.value ?? "");
    const value = props.value ?? ownValue ?? "";
    const BaseComponent =
        props.type === "text-multiline" ? "textarea" : "input";

    const measureTextAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const [height, setHeight] = useState(0);

    useLayoutEffect(() => {
        const measureTextArea = measureTextAreaRef.current;
        if (measureTextArea) {
            measureTextArea.value = value;
            setHeight(measureTextArea.scrollHeight);
        }
    }, []);

    return (
        <>
            <BaseComponent
                {...(rest as any)}
                className={classNames(
                    classes.input,
                    props.className,
                    props.type === "text-multiline" && classes.mutliline
                )}
                style={{
                    height:
                        type === "text-multiline" && height > 0
                            ? height
                            : undefined,
                }}
                type="text"
                value={value}
                onChange={(e) => {
                    setOwnValue(e.target.value);
                    onChange?.(e.target.value);
                    const measureTextArea = measureTextAreaRef.current;
                    if (measureTextArea) {
                        measureTextArea.value = e.target.value;
                        setHeight(measureTextArea.scrollHeight);
                    }
                }}
            ></BaseComponent>
            {type === "text-multiline" && (
                <textarea
                    tabIndex={-1}
                    ref={measureTextAreaRef}
                    className={classNames(
                        classes.input,
                        props.className,
                        "sr-only"
                    )}
                />
            )}
        </>
    );
}
