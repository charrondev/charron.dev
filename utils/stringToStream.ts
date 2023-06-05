export function stringToStream(content: string): ReadableStream {
    return new ReadableStream({
        start(controller) {
            const encoded = new TextEncoder().encode(content);
            controller.enqueue(encoded);
            controller.close();
        },
    });
}
