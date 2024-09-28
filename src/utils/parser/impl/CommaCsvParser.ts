import { type Parser, type ParserConfig, AbstractParser } from '@/utils/parser/parser.ts';
import type { Csv } from '@/utils/model/csv.ts';

class CommaCsvParser extends AbstractParser {

	public parse(csv: string): Csv {
		throw new Error('Method not implemented.');
	}
    
	public stringify(csv: Csv): string {
        const headers = csv.headers.map(header => header);
        let rows = csv.rows.map(row => row);

		if (this.config.stringify.wrapWithQuote) {
            rows = rows.map(row => {
                return row.map(value => value.replaceAll(/("|')/g, ''));
            });

            const quote = this.config.stringify.quoteType === 'double' ? `"` : `'`;

            rows = rows.map(row => {
                return row.map(value => quote + value + quote);
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

        console.log(rows);

        result = result.replaceAll(/(^(\n\r|\n)|(\n\r|\n)$)/g, '');

        return result;
	}
    
}

export { CommaCsvParser };