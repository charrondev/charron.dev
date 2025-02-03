/**
 * Transform an array of objects and an map of objets with a given key.
 *
 * Objects that do not contain the given key are dropped.
 *
 * @param array The array to go through.
 * @param key The key to lookup.
 */
export function indexArrayByKey<T extends Record<string, any>>(
    array: T[],
    key: keyof T
): Record<string, T> {
    const object: Record<string, T> = {};
    for (const item of array) {
        if (key in item) {
            object[item[key]] = item;
        }
    }
    return object;
}
