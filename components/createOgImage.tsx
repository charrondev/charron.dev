import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export async function createOgImage(title: string): Promise<ImageResponse> {
    const interExtrabold = await readFile(
        join(process.cwd(), "./public/Inter-ExtraBold.ttf"),
    );
    const interBold = await readFile(
        join(process.cwd(), "./public/Inter-Bold.ttf"),
    );

    try {
        title = title.slice(0, 100);

        return new ImageResponse(
            (
                <div
                    style={{
                        backgroundImage:
                            "url(https://cruip-tutorials-next.vercel.app/social-card-bg.jpg)",
                        backgroundSize: "100% 100%",
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        fontFamily: "Inter",
                        padding: "40px 80px",
                    }}
                >
                    <div
                        style={{
                            fontSize: 72,
                            fontWeight: 800,
                            letterSpacing: "-0.025em",
                            lineHeight: 1,
                            color: "white",
                            marginBottom: 24,
                            whiteSpace: "pre-wrap",
                            textWrap: "balance",
                        }}
                    >
                        {title}
                    </div>
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: 24,
                            color: "white",
                            display: "flex",
                            gap: 16,
                            alignItems: "center",
                        }}
                    >
                        <img
                            style={{ borderRadius: "100%" }}
                            width={60}
                            height={60}
                            src={"https://github.com/charrondev.png"}
                        />
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 4,
                            }}
                        >
                            <div>Adam Charron</div>
                            <div
                                style={{
                                    fontSize: 16,
                                    color: "rgba(255, 255, 255, 0.8)",
                                }}
                            >
                                Software Architect - Higher Logic Vanilla
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 800,
                fonts: [
                    {
                        name: "Inter",
                        data: await interExtrabold,
                        style: "normal",
                        weight: 800,
                    },
                    {
                        name: "Inter",
                        data: await interBold,
                        style: "normal",
                        weight: 700,
                    },
                ],
            },
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
