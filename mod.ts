import { Cserialize } from './src/Cserialize.ts';
import type { DelimiterOptions } from './src/Cserialize.ts';

import { CommaCsvParser } from '@/parser/impl/CommaCsvParser.ts';
import { TabCsvParser } from '@/parser/impl/TabCsvParser.ts';
import { SemicolonCsvParser } from '@/parser/impl/SemicolonCsvParser.ts';
import type { Parser } from '@/parser/parser.ts';

import { Csv } from '@/model/csv.ts';

export default Cserialize;

export {
    CommaCsvParser,
    TabCsvParser,
    SemicolonCsvParser,
    Csv,
};

export type {
    Parser,
    DelimiterOptions
};