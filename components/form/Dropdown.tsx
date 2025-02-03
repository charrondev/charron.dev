import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import classes from "./Form.module.scss";

interface IProps extends React.ComponentProps<typeof DropdownMenu.Root> {
    children: React.ReactNode;
    trigger: React.ReactNode;
}

function DropdownImpl(props: IProps) {
    const { children, trigger, ...rest } = props;
    return (
        <DropdownMenu.Root {...rest}>
            <DropdownMenu.Trigger asChild>{props.trigger}</DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    side="bottom"
                    align="end"
                    className={classes.dropdownContent}
                >
                    {props.children}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}

export const Dropdown = Object.assign(DropdownImpl, DropdownMenu);
