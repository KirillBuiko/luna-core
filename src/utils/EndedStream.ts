export class EndedStream {
    on (event, listener) {
        if (event === "end") listener();
    }
}