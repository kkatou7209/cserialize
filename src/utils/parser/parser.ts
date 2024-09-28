import type { Csv } from '@/utils/model/csv.ts';

interface ParserConfig {

    parse: {
        /** ignore first row */
        skipFirst: boolean;
    
        /** remove quotations at parsing */
        removeQuote?: boolean;
    };

    stringify: {
        /** wrap with quotation at stringifyng */
        wrapWithQuote?: boolean;
        
        /** quotation type, which is used at stringifyng */
        quoteType?: 'single' | 'double';
        
        /** exclude header row at stringifying */
        noHeader?: boolean;

        /** type of new line */
        newLineType?: 'LF' | 'CRLF';
    }
    
}

/**
 * csv parser
 */
interface Parser {
    
    /**
     * parse csv string to data
     * @param {string} csv 
     */
    parse(csv: string): Csv;

    /**
     * parse data to csv string
     * @param {Csv} csv 
     */
    stringify(csv: Csv): string;
}

abstract class AbstractParser implements Parser {

	/**
     * configuration of parsing
     */
    protected config: ParserConfig = defaultParseConfig;

	abstract parse(csv: string): Csv;

	abstract stringify(csv: Csv): string;

    public setConfig(config: ParserConfig): void {
        this.config = {
            ...config
        }
    }
}

const defaultParseConfig: ParserConfig = {
    parse: {
        skipFirst: false,
        removeQuote: false,
    },
    stringify: {
        wrapWithQuote: false,
        quoteType: 'double',
        noHeader: false,
        newLineType: 'CRLF'
    }
}

export type { Parser, ParserConfig };
export { AbstractParser };