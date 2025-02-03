import { ContextError } from "stubbed/api/ContextError";
import { apiRoute } from "stubbed/api/apiUtils";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { AlbumModel } from "models/AlbumModel";

export const runtime = "edge";

export const PUT = apiRoute(
    async (request: NextRequest): Promise<NextResponse> => {
        const json = await request.json();

        const albumModel = new AlbumModel();
        albumModel.saveAlbum(json);

        const album = albumModel.getAlbum(json.albumID);

        return NextResponse.json(album, { status: 201 });
    },
);
