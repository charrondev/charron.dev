"use client";

import { useCallback, useState } from "react";

export type Theme = "dark" | "light";

export function useTheme() {
    const [theme, _setTheme] = useState<Theme>(
        typeof window === "undefined"
            ? "dark"
            : document.body.classList.contains("dark-theme")
            ? "dark"
            : "light"
    );

    const setTheme = useCallback(
        (newTheme: Theme) => {
            _setTheme(newTheme);
            document.cookie = `theme=${newTheme};path=/;max-age=${
                60 * 60 * 24 * 90
            }`;
            if (newTheme === "dark") {
                document.body.classList.add("dark-theme");
                document.documentElement.classList.add("dark-theme");
            } else {
                document.body.classList.remove("dark-theme");
                document.documentElement.classList.remove("dark-theme");
            }
        },
        [_setTheme]
    );

    return { theme, setTheme };
}
