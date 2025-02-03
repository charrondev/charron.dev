import React, { useContext, useId } from "react";
import classes from "./Form.module.scss";
import classNames from "classnames";

interface ILabelContext {
    labelID: string;
    inputID: string;
}

const LabelContext = React.createContext<ILabelContext>({
    labelID: "",
    inputID: "",
});

export function useLabelContext() {
    return useContext(LabelContext);
}

interface IProps extends React.HTMLAttributes<any> {
    label: React.ReactNode;
    srOnlyLabel?: boolean;
    children: React.ReactNode;
    dark?: boolean;
}

export function Label(props: IProps) {
    const { label, children, srOnlyLabel, dark, ...rest } = props;
    const id = useId();
    const labelID = "label-" + id;
    const inputID = "input-" + id;

    return (
        <div
            {...rest}
            className={classNames(
                classes.inputGroup,
                props.className,
                dark && classes.inputGroupDark
            )}
        >
            <LabelContext.Provider value={{ labelID, inputID }}>
                <label
                    className={classNames(classes.label, {
                        "sr-only": srOnlyLabel,
                    })}
                    id={labelID}
                    htmlFor={inputID}
                >
                    {label}
                </label>
                {children}
            </LabelContext.Provider>
        </div>
    );
}
