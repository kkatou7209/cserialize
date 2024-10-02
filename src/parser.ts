import { Csv } from './csv.ts';
import { intoRows, separate } from "./separater.ts";
import { RecursivePartial } from '@/types/RecursivePartial.d.ts';

export interface ParserConfig {

    parse: {
        /** ignore first row */
        skipFirst: boolean;
    
        /** remove quotations at parsing */
        removeQuote: boolean;

        /** delimiter of csv */
        delimiter: 'comma' | 'tab' | 'semi'
    };

    stringify: {
        /** wrap with quotation at stringifyng */
        wrapWithQuote: boolean;
        
        /** quotation type, which is used at stringifyng */
        quoteType: 'single' | 'double';
        
        /** exclude header row at stringifying */
        noHeader: boolean;

        /** type of new line */
        newLineType: 'LF' | 'CRLF';
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
        }
    };

    /**
     * Sets configuration
     * 
     * @param config 
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
     * Returns config object
     * 
     * @returns {ParserConfig}
     */
    public getConfig(): ParserConfig {
        return this.config;
    }

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
    
	public stringify(csv: Csv): string {
        const headers = csv.headers.map(header => header);
        let rows = csv.rows.map(row => row);

		if (this.config.stringify.wrapWithQuote) {
            rows = rows.map(row => {
                return row.map(value => value.replaceAll(/("|')/g, ''));
            });

            const quote = this.config.stringify?.quoteType === 'double' ? `"` : `'`;

            rows = rows.map(row => {
                return row.map(value => quote + value + quote);
            })
        }
        

        let result = '';
        const newline = this.config.stringify.newLineType === 'LF' ? '\n' : '\r\n';

        if (!this.config.stringify.noHeader) {
            result += headers.join(',') + newline;
        }

        rows.forEach(row => result += row.join(',') + newline);

        result = result.replaceAll(/(^(\r\n|\n)|(\r\n|\n)$)/g, '');

        return result;
	}
    
}