export const separate = (target: string, delimiter: string): RegExpMatchArray | null => {
    return target.match(`("[^"]+"|'[^']+'|[^${delimiter}]+)`);
}