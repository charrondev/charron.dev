import * as RadixToggle from "@radix-ui/react-toggle";
import classes from "./Form.module.scss";
import classNames from "classnames";
interface IProps {
    children: React.ReactNode;
    label: string;
    pressed?: boolean;
    onPressedChange?: (newValue: boolean) => void;
}

export function Toggle(props: IProps) {
    return (
        <RadixToggle.Root
            pressed={props.pressed}
            onPressedChange={props.onPressedChange}
            className={classNames(classes.toggleGroup, classes.toggleItem)}
            aria-label={props.label}
        >
            {props.children}
        </RadixToggle.Root>
    );
}
