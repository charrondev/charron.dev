import { useTheme } from "@components/ThemeContext";
import { Toggle } from "@components/form/Toggle";
import { SunIcon } from "@radix-ui/react-icons";
import { NoSSRWrapper } from "@utils/NoSsr";
import classes from "./Layout.module.scss";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            type="button"
            className={classes.themeToggle}
            aria-label="toggle between dark and light themes."
            onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
            }}
        >
            <SunIcon />
        </button>
    );
}
