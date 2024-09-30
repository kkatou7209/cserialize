import { assertEquals } from '@std/assert/equals';
import Cserialize, { CommaCsvParser } from '../../mod.ts';

Deno.test('stringify method test', async (t) => {
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
    
    await t.step('strigified correctly', async () => {
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