export type CsvHeaders = string[];

export type CsvRows = string[][];

/**
 * csv object type
 */
export interface Csv {
    headers: CsvHeaders;

    rows: CsvRows;

    maps: Map<string | number, string>[];
}
