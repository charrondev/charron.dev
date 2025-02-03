import { ToolTip } from "@components/Tooltip";
import { useAlbumContext } from "@components/albums/AlbumContext";
import {
    CircleBackslashIcon,
    DashboardIcon,
    ExclamationTriangleIcon,
    ImageIcon,
    MoveIcon,
    SectionIcon,
    TrashIcon,
} from "@radix-ui/react-icons";
import * as Toolbar from "@radix-ui/react-toolbar";
import classNames from "classnames";
import classes from "./AlbumToolbar.module.scss";

interface IProps {
    className?: string;
    displayMode: DisplayMode;
    setDisplayMode: (newDisplayMode: DisplayMode) => void;
    filterAttention: boolean;
    setFilterAttention: (newFilter: boolean) => void;
    isDragEnabled: boolean;
    setDragEnabled: (newDragEnabled: boolean) => void;
}

type DisplayMode = "grid" | "list";

export function AlbumToolbar(props: IProps) {
    const { album, editor } = useAlbumContext();
    const { displayMode, setDisplayMode } = props;
    return (
        <Toolbar.Root className={classNames(classes.toolbar, props.className)}>
            <Toolbar.ToggleGroup
                type="single"
                value={displayMode}
                onValueChange={setDisplayMode}
            >
                <ToggleItem label="Display as Grid" value="grid">
                    <DashboardIcon />
                </ToggleItem>
                <ToggleItem label="Display as List" value="list">
                    <ImageIcon />
                </ToggleItem>
            </Toolbar.ToggleGroup>
            <Toolbar.Separator />

            <Toolbar.ToggleGroup
                type="single"
                value={
                    props.isDragEnabled
                        ? "dragEnabled"
                        : props.filterAttention
                        ? "filterAttention"
                        : ""
                }
                onValueChange={(newValue) => {
                    editor.clearSelection();
                    props.setDragEnabled(newValue === "dragEnabled");
                    props.setFilterAttention(newValue === "filterAttention");
                }}
            >
                <ToggleItem
                    value="filterAttention"
                    label="Filter to images requiring attention."
                >
                    <ExclamationTriangleIcon />
                </ToggleItem>
                <ToggleItem
                    value="dragEnabled"
                    label="Enable Image Re-ordering."
                >
                    <MoveIcon />
                </ToggleItem>
            </Toolbar.ToggleGroup>
            <Toolbar.Separator />
            <span className={classes.meta}>
                {editor.selectedImageIDs.length} items selected
            </span>
            <ToolTip tooltip="Clear Selection">
                <Toolbar.Button
                    className={classes.item}
                    disabled={editor.selectedImageIDs.length === 0}
                    onClick={() => {
                        editor.clearSelection();
                    }}
                >
                    <CircleBackslashIcon />
                </Toolbar.Button>
            </ToolTip>
            <ToolTip tooltip="Make selected image the cover image.">
                <Toolbar.Button
                    className={classes.item}
                    disabled={editor.selectedImageIDs.length !== 1}
                    onClick={() => {
                        const selectedImage = album.images.find(
                            (img) => img.imageID === editor.selectedImageIDs[0]
                        );
                        if (!selectedImage) {
                            return;
                        }

                        // Clear out all of the existing images
                        album.images.forEach((img) => {
                            if (img.isCoverImage) {
                                editor.updateImage({
                                    ...img,
                                    isCoverImage: false,
                                });
                            }
                        });

                        editor.updateImage({
                            ...selectedImage,
                            isCoverImage: true,
                        });
                        editor.clearSelection();
                    }}
                    aria-label="Make selected image the cover image."
                >
                    <SectionIcon />
                </Toolbar.Button>
            </ToolTip>
            <ToolTip tooltip="Delete selected images.">
                <Toolbar.Button
                    className={classes.item}
                    disabled={editor.selectedImageIDs.length === 0}
                    onClick={() => {
                        editor.selectedImageIDs.forEach(editor.removeImage);
                        editor.clearSelection();
                    }}
                >
                    <TrashIcon />
                </Toolbar.Button>
            </ToolTip>
            <Toolbar.Separator />
            <span className={classes.spacer}></span>
            <Toolbar.Button
                className={classNames(classes.item, classes.primaryButton)}
                aria-label="Save"
            >
                Save
            </Toolbar.Button>
        </Toolbar.Root>
    );
}

function ToggleItem(props: {
    value: string;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <Toolbar.ToggleItem
            className={classes.item}
            value={props.value}
            asChild
            aria-label={props.label}
        >
            <ToolTip tooltip={props.label}>
                <button>{props.children}</button>
            </ToolTip>
        </Toolbar.ToggleItem>
    );
}
