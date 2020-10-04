/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

/**
 * Parse a string into a URL friendly format.
 *
 * Eg. Why Uber isn't spelled Über -> why-uber-isnt-spelled-uber
 *
 * @param str The string to parse.
 */
export function slugify(
    str: string,
    options?: {
        allowMultipleDashes?: boolean;
    }
): string {
    const whiteSpaceNormalizeRegexp =
        options && options.allowMultipleDashes ? /[\s]+/g : /[-\s]+/g;
    return str
        .normalize("NFD") // Normalize accented characters into ASCII equivalents
        .replace(/[^\w\s$*_+~.()'"\-!:@]/g, "") // REmove characters that don't URL encode well
        .trim() // Trim whitespace
        .replace(whiteSpaceNormalizeRegexp, "-") // Normalize whitespace
        .toLocaleLowerCase(); // Convert to locale aware lowercase.
}
