import { useEffect, useMemo, useRef, useState } from "react";

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

function useLocalStorage<T>(key: string, defaultValue: T): [T, Setter<T>] {
    const rawValueRef = useRef<string | null>(null);

    const [value, setValue] = useState(() => {
        if (typeof window === "undefined") return defaultValue;

        try {
            rawValueRef.current = window.localStorage.getItem(key);
            const res: T = rawValueRef.current
                ? JSON.parse(rawValueRef.current)
                : defaultValue;
            return res;
        } catch (e) {
            console.error(e);
            return defaultValue;
        }
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        const updateLocalStorage = () => {
            // Browser ONLY dispatch storage events to other tabs, NOT current tab.
            // We need to manually dispatch storage event for current tab
            if (value !== undefined) {
                const newValue = JSON.stringify(value);
                const oldValue = rawValueRef.current;
                rawValueRef.current = newValue;
                window.localStorage.setItem(key, newValue);
                window.dispatchEvent(
                    new StorageEvent("storage", {
                        storageArea: window.localStorage,
                        url: window.location.href,
                        key,
                        newValue,
                        oldValue,
                    })
                );
            } else {
                window.localStorage.removeItem(key);
                window.dispatchEvent(
                    new StorageEvent("storage", {
                        storageArea: window.localStorage,
                        url: window.location.href,
                        key,
                    })
                );
            }
        };

        try {
            updateLocalStorage();
        } catch (e) {
            console.error(e);
        }
    }, [value]);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key !== key || e.storageArea !== window.localStorage) return;

            try {
                if (e.newValue !== rawValueRef.current) {
                    rawValueRef.current = e.newValue;
                    setValue(e.newValue ? JSON.parse(e.newValue) : undefined);
                }
            } catch (e) {
                console.error(e);
            }
        };

        if (typeof window === "undefined") return;

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [key]);

    return [value, setValue];
}

export default useLocalStorage;
