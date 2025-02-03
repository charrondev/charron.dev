import { ContextError } from "@app/api/ContextError";
import { apiRoute } from "@app/api/apiUtils";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { AlbumModel } from "models/AlbumModel";

export const PUT = apiRoute(
    async (request: NextRequest): Promise<NextResponse> => {
        const json = await request.json();

        const albumModel = new AlbumModel();
        albumModel.saveAlbum(json);

        const album = albumModel.getAlbum(json.albumID);

        return NextResponse.json(album, { status: 201 });
    }
);
