import { assertEquals } from '@std/assert/equals';
import Cserialize, { CommaCsvParser, Csv } from '../../mod.ts';
import { assert } from '@std/assert/assert';

Deno.test('parse test', async (t) => { 
    await t.step('parse comma csv currectly', async () => {
        
        const csv = `foo,bar,hoge\r\n"foo_0",bar_0,"hoge_0,hoge_0"\n"foo_1",bar_1,"hoge_1,hoge_1"`;

        const instance = Cserialize.delimiter('comma').read(csv).parse();

        const csvResult = new Csv();
        csvResult.headers = ['foo', 'bar', 'hoge'];
        csvResult.rows = [
            ['"foo_0"', 'bar_0', '"hoge_0,hoge_0"'],
            ['"foo_1"', 'bar_1', '"hoge_1,hoge_1"'],
        ];
        csvResult.maps = [
            new Map<string, string>([['foo', '"foo_0"'], ['bar', 'bar_0'], ['hoge', '"hoge_0,hoge_0"']]),
            new Map<string, string>([['foo', '"foo_1"'], ['bar', 'bar_1'], ['hoge', '"hoge_1,hoge_1"']]),
        ];

        assertEquals(instance.data(), csvResult);
    });

    await t.step('get value by header correctly', async () => {
        const csv = `foo,bar,hoge\r\n"foo_0",bar_0,"hoge_0,hoge_0"\n"foo_1",bar_1,"hoge_1,hoge_1"`;

        const instance = Cserialize.delimiter('comma').read(csv).parse();

        assertEquals(instance.getValueByHeader('foo', 1), '"foo_1"');
    });

    await t.step('skip first row when "skipFirst" option is set', async () => {
        const csv = `foo,bar,hoge\r\n"foo_0",bar_0,"hoge_0,hoge_0"\n"foo_1",bar_1,"hoge_1,hoge_1"`;

        const instance = Cserialize.delimiter('comma').read(csv).withConfig({ parse: { skipFirst: true }}).parse();


        assertEquals(instance.getHeaders(), []);
    })
 })

Deno.test('stringify method test', async (t) => {
    const parser = new CommaCsvParser();
    parser.setConfig({
        stringify: {
            newLineType: 'LF',
            noHeader: false,
            quoteType: 'single',
            wrapWithQuote: true,
        }
    });
    
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