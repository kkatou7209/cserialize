import { CommaCsvParser } from '../../src/parser/impl/CommaCsvParser.ts';
import { assertEquals } from '@std/assert/equals';

Deno.test('config test', async (t) => {
    await t.step('setData works correctly', async () => {
        const parser = new CommaCsvParser();

        parser.setConfig({
            parse: {
                skipFirst: true,
                removeQuote: true,
            },
            stringify: {
                newLineType: 'LF',
                noHeader: true,
                quoteType: 'single',
                wrapWithQuote: true
            }
        })

        const config = parser.getConfig();

        console.log(config)

        assertEquals(config.parse.removeQuote, true);
        assertEquals(config.parse.skipFirst, true);
        assertEquals(config.stringify.newLineType, 'LF');
        assertEquals(config.stringify.noHeader, true);
        assertEquals(config.stringify.quoteType, 'single');
        assertEquals(config.stringify.wrapWithQuote, true);
    });
})