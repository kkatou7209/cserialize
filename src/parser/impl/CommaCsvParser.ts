import { type Parser, type ParserConfig, AbstractParser } from '../parser.ts';
import { Csv } from '@/model/csv.ts';

class CommaCsvParser extends AbstractParser {

	public parse(csv: string): Csv {
        const csvRows = csv.split(/\r?\n/);

        if (csvRows.length <= 0) {
            throw new Error("Invalid csv format");
        }

        const headers: string[] = [];

        if (!this.config.parse.skipFirst) {
            csvRows.forEach(header => {
                headers.push(header);
            });
            csvRows.pop();
        }

        const rows = csvRows.map(row => row.match(/("[^"]+"|'[^']+'|[^,]+)/)?.map(value => value) ?? []);

        const data = new Csv();

        data.headers = headers;

        data.rows = rows;

        if (!this.config.parse.skipFirst) {
            data.maps = headers.map((header, index) => {
                const map = new Map();

                rows.forEach(row => {
                    map.set(header, row[index]);
                })

                return map;
            })

            return data;
        }

        data.maps = rows.map(row => {
            const map = new Map();

            row.forEach((value, index) => map.set(index, value));

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