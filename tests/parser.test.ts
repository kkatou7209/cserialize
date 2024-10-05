import { Parser } from '@/parser.ts';
import { assert, assertEquals } from '@std/assert';

Deno.test('parser tests', async(t) => {
    const csv = `foo,bar,hoge\r\n"foo_0",bar_0,'hoge_0'\r\n"foo_1",bar_1,"hoge_1,hoge_1"`;

    await t.step('parse csv object from string', async () => {
        const parser = new Parser();

        assertEquals(parser.parse(csv), {
            headers: ['foo', 'bar', 'hoge'],
            rows: [
                [`"foo_0"`, `bar_0`, `'hoge_0'`],
                [`"foo_1"`, `bar_1`, `"hoge_1,hoge_1"`]
            ],
            maps: [
                new Map([['foo', `"foo_0"`], ['bar', `bar_0`], ['hoge', `'hoge_0'`]]),
                new Map([['foo', `"foo_1"`], ['bar', `bar_1`], ['hoge', `"hoge_1,hoge_1"`]])
            ]
        })
    });

    await t.step('parse with no quotations', async () => {
        const parser = new Parser();

        parser.setConfig({
            parse: {
                removeQuote: true,
            }
        })

        assertEquals(parser.parse(csv), {
            headers: ['foo', 'bar', 'hoge'],
            rows: [
                ['foo_0', 'bar_0', 'hoge_0'],
                ['foo_1', 'bar_1', 'hoge_1,hoge_1']
            ],
            maps: [
                new Map([['foo', 'foo_0'], ['bar', 'bar_0'], ['hoge', 'hoge_0']]),
                new Map([['foo', 'foo_1'], ['bar', 'bar_1'], ['hoge', 'hoge_1,hoge_1']])
            ]
        })
    })

    await t.step('parse skipping header', async () => {
        const parser = new Parser();

        parser.setConfig({ parse: { skipFirst: true } });

        assertEquals(parser.parse(csv), {
            headers: [],
            rows: [
                [`"foo_0"`, `bar_0`, `'hoge_0'`],
                [`"foo_1"`, `bar_1`, `"hoge_1,hoge_1"`]
            ],
            maps: [
                new Map([[0, `"foo_0"`], [1, `bar_0`], [2, `'hoge_0'`]]),
                new Map([[0, `"foo_1"`], [1, `bar_1`], [2, `"hoge_1,hoge_1"`]])
            ]
        })
    })

    await t.step('stringify correctly', async () => {
        const parser = new Parser();

        assertEquals(parser.stringify(parser.parse(csv)), `foo,bar,hoge\r\n"foo_0",bar_0,'hoge_0'\r\n"foo_1",bar_1,"hoge_1,hoge_1"`);
    })

    await t.step('stringify with no quotes', async () => {
        const parser = new Parser();
        parser.setConfig({ parse: { removeQuote: true } });

        assertEquals(parser.stringify(parser.parse(csv)), `foo,bar,hoge\r\nfoo_0,bar_0,hoge_0\r\nfoo_1,bar_1,"hoge_1,hoge_1"`)
    })

    await t.step('stringify with quotes', async () => {
        const parser = new Parser();
        parser.setConfig({ stringify: { wrapWithQuote: true, quoteType: 'single'}});

        assertEquals(parser.stringify(parser.parse(csv)), `foo,bar,hoge\r\n'foo_0','bar_0','hoge_0'\r\n'foo_1','bar_1','hoge_1,hoge_1'`)
    })

    await t.step('stringify with LF', async () => {
        const parser = new Parser();
        parser.setConfig({ stringify: { newLineType: 'LF' } });

        assertEquals(parser.stringify(parser.parse(csv)), `foo,bar,hoge\n"foo_0",bar_0,'hoge_0'\n"foo_1",bar_1,"hoge_1,hoge_1"`);
    })

    await t.step('stringify specified delimiter', async () => {
        const parser = new Parser();
        parser.setConfig({ stringify: { joinWith: 'tab' } });

        assertEquals(parser.stringify(parser.parse(csv)), `foo\tbar\thoge\r\n"foo_0"\tbar_0\t'hoge_0'\r\n"foo_1"\tbar_1\t"hoge_1,hoge_1"`);
    })

    await t.step('stringify with no header', async () => {
        const parser = new Parser();
        parser.setConfig({ stringify: { noHeader: true } });

        assertEquals(parser.stringify(parser.parse(csv)), `"foo_0",bar_0,'hoge_0'\r\n"foo_1",bar_1,"hoge_1,hoge_1"`);
    })

    await t.step('set config currectly', async () => {
        const parser = new Parser();

        parser.setConfig({
            parse: {
                skipFirst: true,
                removeQuote: true,
                delimiter: 'tab'
            },
            stringify: {
                wrapWithQuote: true,
                quoteType: 'single',
                noHeader: true,
                newLineType: 'LF',
                joinWith: 'semi'
            }
        })

        assertEquals(parser.getConfig(), {
            parse: {
                skipFirst: true,
                removeQuote: true,
                delimiter: 'tab'
            },
            stringify: {
                wrapWithQuote: true,
                quoteType: 'single',
                noHeader: true,
                newLineType: 'LF',
                joinWith: 'semi'
            }
        })
    })
})