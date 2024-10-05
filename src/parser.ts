import { Csv } from './csv.ts';
import { intoRows, separate } from "./separater.ts";
import { RecursivePartial } from '@/types/RecursivePartial.d.ts';

export type DelimiterType = 'comma' | 'tab' | 'semi';

export type QuoteType = 'single' | 'double';

export type NewLineType = 'LF' | 'CRLF';

export interface ParserConfig {

    /** config of parsing */
    parse: {
        /** ignore first row */
        skipFirst: boolean;
    
        /** remove quotations at parsing */
        removeQuote: boolean;

        /** delimiter of csv */
        delimiter: DelimiterType
    };

    /** config of stringifying */
    stringify: {
        /** wrap with quotation at stringifyng */
        wrapWithQuote: boolean;
        
        /** quotation type, which is used at stringifyng */
        quoteType: QuoteType;
        
        /** exclude header row at stringifying */
        noHeader: boolean;

        /** type of new line */
        newLineType: NewLineType;

        /** delimiter of csv */
        joinWith: DelimiterType
    }
}

export type OptionalParseConfig = RecursivePartial<ParserConfig>;

/**
 * Parser class 
 */
export class Parser {

    /**
     * configuration of parsing
     */
    private config: ParserConfig = {
        parse: {
            skipFirst: false,
            removeQuote: false,
            delimiter: 'comma',
        },
        stringify: {
            wrapWithQuote: false,
            quoteType: 'double',
            noHeader: false,
            newLineType: 'CRLF',
            joinWith: 'comma'
        }
    };

    /**
     * Sets configuration
     * 
     * @param {OptionalParseConfig} config 
     */
    public setConfig(config: OptionalParseConfig): void {
        this.config = {
            parse: {
                ...this.config.parse,
                ...config.parse,
            },
            stringify: {
                ...this.config.stringify,
                ...config.stringify,
            }
        }
    }

    /**
     * Returns Parser config
     * 
     * @returns {ParserConfig}
     */
    public getConfig(): ParserConfig {
        return this.config;
    }

    /**
     * Parses string to csv data object
     * 
     * @param {string} csv 
     * @returns {Csv}
     */
	public parse(csv: string): Csv {
        const csvRowStrings = intoRows(csv);

        const delimiter = 
            this.config.parse.delimiter == 'comma' ? ',' :
            this.config.parse.delimiter == 'semi'  ? ';' :
            this.config.parse.delimiter == 'tab'   ? '\t':
            ','

        if (csvRowStrings.length <= 0) {
            throw new Error("Invalid csv format");
        }

        const headers: string[] = [];

        if (!this.config.parse.skipFirst) {
            separate(delimiter, csvRowStrings[0]).forEach(val => headers.push(val));
            csvRowStrings.shift();
        } else {
            csvRowStrings.shift();
        }


        const rows = this.config.parse.removeQuote ?
            csvRowStrings.map(row => separate(delimiter, row).map(value => value.replace(/["']+/g, ''))) :
            csvRowStrings.map(row => separate(delimiter, row));


        const data: Csv = {
            headers,
            rows,
            maps: []
        };

        if (!this.config.parse.skipFirst) {
            data.maps = rows.map((row) => {

                const map = new Map();

                headers.forEach((header, index) => {
                    if (this.config.parse.removeQuote) {
                        map.set(header, row[index].replace(/["']+/g, ''));
                    } else {
                        map.set(header, row[index]);
                    }
                });

                return map;
            })

            return data;
        }

        data.maps = rows.map(row => {
            const map = new Map();

            row.forEach((value, index) => {
                if (this.config.parse.removeQuote) {
                    map.set(index, value.replace(/["']+/g, ''))
                } else {
                    map.set(index, value)
                }
            });

            return map;
        });

        return data;
	}
    
    /**
     * Stringifies csv data object to string
     * 
     * @param {Csv} csv 
     * @returns {string}
     */
	public stringify(csv: Csv): string {
        const headers = csv.headers.map(header => header);
        let rows = csv.rows.map(row => row);

        const quote = this.config.stringify?.quoteType === 'double' ? `"` : `'`;

		if (this.config.stringify.wrapWithQuote) {
            rows = rows.map(row => {
                return row.map(value => value.replaceAll(/("|')/g, ''));
            });

            rows = rows.map(row => {
                return row.map(value => quote + value + quote);
            })
        } else {
            rows = rows.map(row => {
                return row.map(val => val.match(/^[^"'].*,.*[^"']$/) ? (quote + val + quote) : val);
            })
        }
        
        const delimiter = 
            this.config.stringify.joinWith === 'semi' ? ';' :
            this.config.stringify.joinWith === 'tab' ? '\t' :
            ',';

        let result = '';

        const newline = this.config.stringify.newLineType === 'LF' ? '\n' : '\r\n';

        if (!this.config.stringify.noHeader) {
            result += headers.join(delimiter) + newline;
        }

        rows.forEach(row => result += row.join(delimiter) + newline);

        result = result.replaceAll(/(^(\r\n|\n)|(\r\n|\n)$)/g, '');

        return result;
	}
    
}