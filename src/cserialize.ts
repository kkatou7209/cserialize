import { Parser , type ParserConfig, type OptionalParseConfig} from '@/parser.ts';
import { Csv } from '@/csv.ts';
import type { RecursivePartial } from '@/types/RecursivePartial.d.ts';

/**
 * Manager class 
 */
export class Cserialize {
    /**
     * csv parser
     */
    #parser: Parser;

    /**
     * csv data
     */
    #data: Csv;

    /**
     * csv source data
     */
    #source: string | null = null;

    /**
     * Returns current csv parser
     * @param parser 
     */
    public constructor(config?: OptionalParseConfig) {
        this.#parser = new Parser();
        this.#data = { headers: [], rows: [], maps: [] };

        if (config) {
            this.#parser.setConfig(config);
        }
    }

    /**
     * Instanciate with setting csv text
     * @param csv 
     * @returns 
     */
    public static read(csv: string): Cserialize {
        const instance = new Cserialize();

        instance.read(csv);

        return instance;
    }

    /**
     * Instantiate with config
     * @param  config 
     * @returns 
     */
    public static withConfig(config: OptionalParseConfig): Cserialize {
        const instance = new Cserialize(config);

        return instance;
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
     * @returns {string}
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
        
        const headers = data.headers.map(header => header.trim());

        const rows = data.rows.map(row => row.map(value => value.trim()));
        
        const maps = headers.map((header, index) => {
            const map = new Map();
            
            rows.forEach(row => map.set(header, row[index]));
            
            return map;
        });

        this.#data = { headers, rows, maps } ;
    }

    /**
     * Sets parsing and stringifying config
     * @param {ParserConfig} config 
     */
    public setConfig(config: RecursivePartial<ParserConfig>) {
        this.#parser.setConfig(config);
    }

    /**
     * Returns csv data object
     * 
     * @returns {Csv | null}
     */
    public getData(): Csv {
        return this.#data;
    }

    /**
     * Returns csv value retrieved by row index and header name
     * 
     * @param {string} header 
     * @param {number} rowIndex 
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