/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

export function notEmpty<TValue>(
    value: TValue | null | undefined
): value is TValue {
    return value !== null && value !== undefined;
}
