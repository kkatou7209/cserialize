import { AbstractParser } from '../parser.ts';
import type { Csv } from '@/model/csv.ts';

class SemicolonCsvParser extends AbstractParser {

	parse(csv: string): Csv {
		throw new Error('Method not implemented.');
	}

	stringify(csv: Csv): string {
		throw new Error('Method not implemented.');
	}
    
}

export { SemicolonCsvParser };