/**
 * Separates row by specified delimiter
 * @param delimiter 
 * @param source 
 * @returns 
 */
export const separate = (delimiter: string, row: string): string[] => {
    const regex = new RegExp(`("[^"]+"|'[^']+'|[^${delimiter}]+)`, 'g');
    return row.match(regex)?.map(val => val) ?? [];
}

export const intoRows = (csv: string): string[] => {
    return csv.split(/(\r?\n)+/).filter(val => !/\r?\n+/.test(val));
}