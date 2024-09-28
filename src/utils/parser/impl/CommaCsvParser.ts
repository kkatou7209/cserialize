import { type Parser, type ParserConfig, AbstractParser } from '@/utils/parser/parser.ts';
import type { Csv } from '@/utils/model/csv.ts';

class CommaCsvParser extends AbstractParser {

	public parse(csv: string): Csv {
		throw new Error('Method not implemented.');
	}
    
	public stringify(csv: Csv): string {
        const headers = csv.headers.map(header => header);
        const rows = csv.rows.map(row => row);

		if (this.config.stringify.wrapWithQuote) {
            rows.forEach(row => {
                row.forEach(value => value = value.replace(/["']/, ''));
            })

            const quote = this.config.stringify.quoteType === 'double' ? `"` : `'`;

            rows.forEach(row => {
                row.forEach(value => value = quote + value + quote);
            })
        }
        
        if (this.config.stringify.noHeader) {
            headers.splice(0);
        }

        let result = '';
        const newline = this.config.stringify.newLineType === 'LF' ? '\n' : '\n\r';

        if (headers.length > 0) {
            result += headers.join(',') + newline;
        }

        rows.forEach(row => result += row.join(',') + newline);

        result = result.replace(/(^(\n\r|\n)|(\n\r|\n)$)/, '');

        return result;
	}
    
}

export { CommaCsvParser };