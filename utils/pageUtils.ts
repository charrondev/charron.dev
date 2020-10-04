/**
 * @copyright 2020 Adam (charrondev) Charron
 * @license Proprietary
 */

import { GetStaticPropsContext } from "next";

export const PAGE_REGEX = /^p(?<pageNumber>\d+)$/;

export function getPageNumber(context: GetStaticPropsContext): number {
    let pageString = context.params?.page;
    if (Array.isArray(pageString)) {
        if (pageString.length > 1) {
            throw new PageNotFoundError();
        }
        pageString = pageString[0];
    }
    if (typeof pageString !== "string") {
        return 1;
    }
    const matched = PAGE_REGEX.exec(pageString);
    const page = matched?.groups?.pageNumber;
    if (typeof page !== "string") {
        throw new PageNotFoundError();
    }

    const int = Number.parseInt(page);

    if (int < 1) {
        throw new PageNotFoundError();
    }
    return int;
}

export class PageNotFoundError extends Error {}
