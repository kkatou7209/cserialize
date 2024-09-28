import { CommaCsvParser } from '@/utils/parser/impl/CommaCsvParser.ts';
import type { Parser } from './utils/parser/parser.ts';
import { TabCsvParser } from '@/utils/parser/impl/TabCsvParser.ts';
import { SemicolonCsvParser } from '@/utils/parser/impl/SemicolonCsvParser.ts';
import { Csv } from '@/utils/model/csv.ts';

class Cserialize {
    /**
     * csv parser
     */
    #parser: Parser;

    /**
     * csv data
     */
    #data: Csv | null = null;

    /**
     * csv source data
     */
    #source: string | File | null = null;

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
    public static delimiter(delimiter: ',' | '\t' | ';'): Cserialize {
        switch (delimiter) {
            case ',':
                return new Cserialize(new CommaCsvParser);
            case '\t':
                return new Cserialize(new TabCsvParser);
            case ';':
                return new Cserialize(new SemicolonCsvParser);
            default:
                throw new Error(`unknown delimiter: ${delimiter}`);
        }
    }

    /**
     * Read csv data from string or file
     * 
     * @param {string | File} csv --- string or file
     */
    public read(csv: string | File): Cserialize {
        this.#source = csv;

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

        const data = await this.#source.text();

        this.#data = this.#parser.parse(data);

        return this;
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
    }

    /**
     * Returns csv data object
     * 
     * @returns {Csv | null}
     */
    public data(): Csv{
        return this.#data ?? new Csv();
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

export { Cserialize }