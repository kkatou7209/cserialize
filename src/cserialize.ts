import { CommaCsvParser } from '@/parser/impl/CommaCsvParser.ts';
import type { Parser } from '@/parser/parser.ts';
import { TabCsvParser } from '@/parser/impl/TabCsvParser.ts';
import { SemicolonCsvParser } from '@/parser/impl/SemicolonCsvParser.ts';
import { Csv } from '@/model/csv.ts';
import { readFromFile } from '@/utils/reader.ts';

export type DelimiterOptions = 'comma' | 'tab' | 'semi';

export type CsvHeaders = string[];

export type CsvRows = string[][];

export class Cserialize {
    /**
     * csv parser
     */
    #parser: Parser;

    /**
     * csv data
     */
    #data: Csv = new Csv();

    /**
     * csv source data
     */
    #source: string | File | null = null;

    /**
     * csv text file encoding
     */
    #fileEncoding = 'UTF-8'

    /**
     * @param parser 
     */
    constructor(parser: Parser) {
        this.#parser = parser;
    }

    /**
     * Returns instance with initializing Parser.
     * 
     * @param {Parser} parser csv parser
     */
    public static use(parser: Parser): Cserialize {
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
     * @param {string | File} csv --- string or file
     */
    public read(csv: string | File, fileEncoding: string = 'UTF-8'): Cserialize {
        this.#source = csv;
        this.#fileEncoding = fileEncoding;

        return this;
    }

    /**
     * Returns currently registered csv parser.
     * 
     * @returns {Parser} csv parser
     */
    public async parse(): Promise<Cserialize> {
        if (this.#source === null) {
            throw new Error('data is null');
        }

        if (typeof this.#source === 'string') {
            this.#data = this.#parser.parse(this.#source);
            return this;
        }

        const text = await readFromFile(this.#source);

        this.#data = this.#parser.parse(text);

        return this;
    }

    public stringify(): string {
        if (this.#data === null) {
            throw new Error('trying to stringify null');
        }
        return this.#parser.stringify(this.#data);
    }

    /**
     * 
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
}