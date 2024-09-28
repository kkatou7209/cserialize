import { AbstractParser, type Parser } from '@/utils/parser/parser.ts';
import type { Csv } from '@/utils/model/csv.ts';


class TabCsvParser extends AbstractParser {

	parse(csv: string): Csv {
		throw new Error('Method not implemented.');
	}

	stringify(csv: Csv): string {
		throw new Error('Method not implemented.');
	}
    
}

export { TabCsvParser };