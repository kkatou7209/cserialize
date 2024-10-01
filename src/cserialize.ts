import { CommaCsvParser } from '@/parser/impl/CommaCsvParser.ts';
import type { AbstractParser, Parser, ParserConfig } from '@/parser/parser.ts';
import { TabCsvParser } from '@/parser/impl/TabCsvParser.ts';
import { SemicolonCsvParser } from '@/parser/impl/SemicolonCsvParser.ts';
import { Csv } from '@/model/csv.ts';
import type { RecursivePartial } from '@/types/RecursivePartial.d.ts';

export type DelimiterOptions = 'comma' | 'tab' | 'semi';

export type CsvHeaders = string[];

export type CsvRows = string[][];

/**
 * Manager class 
 */
export class Cserialize {
    /**
     * csv parser
     */
    #parser: AbstractParser;

    /**
     * csv data
     */
    #data: Csv = new Csv();

    /**
     * csv source data
     */
    #source: string | null = null;

    /**
     * Returns current csv parser
     * @param parser 
     */
    constructor(parser: AbstractParser) {
        this.#parser = parser;
    }

    /**
     * Returns instance with initializing Parser.
     * 
     * @param {Parser} parser csv parser
     */
    public static use(parser: AbstractParser): Cserialize {
        return new Cserialize(parser);
    }

    /**
     * Returns instance with setting Parser infered from 
     * passed delimiter.
     * 
     * @param {string} delimiter 
     * @returns {Cserialize} Cserialize instance
     */
    public static delimiter(delimiter: DelimiterOptions): Cserialize {
        switch (delimiter) {
            case 'comma':
                return new Cserialize(new CommaCsvParser);
            case 'tab':
                return new Cserialize(new TabCsvParser);
            case 'semi':
                return new Cserialize(new SemicolonCsvParser);
            default:
                throw new Error(`unknown delimiter name: ${delimiter}`);
        }
    }

    /**
     * Read csv data from string or file
     * 
     * @param {string} csv
     */
    public read(csv: string): Cserialize {
        this.#source = csv;

        return this;
    }

    public withConfig(config: RecursivePartial<ParserConfig>): Cserialize {
        this.#parser.setConfig(config);

        return this;
    }

    /**
     * Returns currently registered csv parser.
     * 
     * @returns {Parser} csv parser
     */
    public parse(): Cserialize {
        if (this.#source === null) {
            throw new Error('data is null');
        }

        this.#data = this.#parser.parse(this.#source);

        return this;
    }

    /**
     * Returns csv text
     * @returns 
     */
    public stringify(): string {
        if (this.#data === null) {
            throw new Error('trying to stringify null');
        }
        return this.#parser.stringify(this.#data);
    }

    /**
     * set object represents csv
     * @param {{ headers: string[]; rows: string[][] }} data 
     */
    public setData(data: { headers: string[]; rows: string[][] }): void {
        // check length consistency of headers and rows
        data.rows.forEach(row => {
            if (row.length !== data.headers.length) {
                throw new Error('headers and rows have different length');
            }
        });

        const _data = new Csv();

        data.headers.forEach(header => _data.headers.push(header.trim()));
        data.rows.forEach(row => _data.rows.push(row.map(value => value.trim())));

        _data.headers.forEach((header, index) => {
            const map = new Map();

            _data.rows.forEach(row => map.set(header, row[index]));

            _data.maps.push(map);
        });

        this.#data = _data;
    }

    /**
     * Returns csv data object
     * 
     * @returns {Csv | null}
     */
    public data(): Csv {
        return this.#data;
    }

    public getHeaders(): CsvHeaders {
        return this.#data.headers.map(header => header);
    }

    public getRows(): CsvRows {
        return this.#data.rows.map(row => row.map(value => value));
    }

    /**
     * Returns csv value retrieved by row index and header name
     * 
     * @param header 
     * @param rowIndex 
     * @returns 
     */
    public getValueByHeader(header: string, rowIndex: number): string {
        if (this.#data.rows.length === 0) {
            throw new Error('Row data are empty. Initialize data first.');
        }

        if (this.#data.headers.length === 0) {
            throw new Error('Data was initialized with no header. You can not access them via header.');
        }

        if (!this.#data.headers.includes(header)) {
            throw new Error(`No such header: ${header}. Check that your data have header "${header}.`);
        }

        if (rowIndex > this.#data.rows.length - 1) {
            throw new Error('Given index is bigger than number of rows.');
        }

        const index = this.#data.headers.indexOf(header);

        return this.#data.rows[rowIndex][index];
    }

    /**
     * Return csv value retrieved by row number and row offset
     * 
     * @param {number} index row offset
     * @param {number} rowIndex number of row
     * @returns {string} csv value
     */
    public getValueByIndex(index: number, rowIndex: number): string {
        if (this.#data.rows.length === 0) {
            throw new Error('Row data are empty. Initialize data first.');
        }

        if (rowIndex > this.#data.rows.length - 1) {
            throw new Error('Given row index is bigger than number of rows.');
        }

        if (index > this.#data.rows[rowIndex].length - 1) {
            throw new Error('Given index is bigger than number of values.');
        }

        return this.#data.rows[rowIndex][index];
    }

    /**
     * Returns current parser
     * @returns 
     */
    public parser(): Parser {
        return this.#parser;
    }

    /**
     * Checks if data is set
     * @returns {boolean} boolean
     */
    public hasData(): boolean {
        if (this.#data === null) return false;

        if (this.#data.rows.length === 0) return false;

        return true;
    }

    /**
     * Check wether data have headers or not
     * @returns {boolean} header is present then true 
     */
    public hasHeaders(): boolean {
        if (this.#data.headers.length > 0) {
            return true;
        }

        return false;
    }
}