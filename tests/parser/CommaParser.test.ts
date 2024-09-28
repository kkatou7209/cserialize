import { Cserialize } from '@/cserialize.ts';
import { CommaCsvParser } from '@/utils/parser/impl/CommaCsvParser.ts';
import { assertEquals } from '@std/assert/equals';

Deno.test('stringify method test', async (t) => {
    await t.step('strigified correctly', async () => {
        const parser = new CommaCsvParser();
        parser.setConfig({
            parse: {},
            stringify: {
                newLineType: 'LF',
                noHeader: false,
                quoteType: 'single',
                wrapWithQuote: true,
            }
        })
        const cserialize = Cserialize.use(parser);

        cserialize.setData({
            headers: ['foo', 'bar'],
            rows: [
                ['foo_0', '\'bar_0\''],
                ['foo_1', '\'bar_1\'']
            ]
        })

        const csv = cserialize.stringify();

        assertEquals(csv, `foo,bar\n'foo_0','bar_0'\n'foo_1','bar_1'`);
    })
});