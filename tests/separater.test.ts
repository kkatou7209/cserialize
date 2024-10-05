import { assertEquals } from '@std/assert';
import { intoRows, separate } from '@/separater.ts';


Deno.test('intoRows test', () => {
    const csv = `foo,bar,hoge\r\n"foo_0",bar_0,"hoge_0"\r\n"foo_1",bar_1,"hoge_1,hoge_1"`;

    assertEquals(intoRows(csv), [
        `foo,bar,hoge`,
        `"foo_0",bar_0,"hoge_0"`,
        `"foo_1",bar_1,"hoge_1,hoge_1"`
    ])
})


Deno.test('separate funtion test', async (t) => {
    
    await t.step('comma separation test', () => {
        const row = `foo,'bar',"hoge","chuc,chuc",'fuga,fuga,fuga'`;

        assertEquals(separate(',', row), [
            'foo', "'bar'", '"hoge"', '"chuc,chuc"', "'fuga,fuga,fuga'"
        ])
    });

    await t.step('tab separation test', () => {
        const row = `foo\t'bar'\t"hoge"\t"chuc,chuc"\t'fuga,fuga,fuga'`;

        assertEquals(separate('\t', row), [
            'foo', "'bar'", '"hoge"', '"chuc,chuc"', "'fuga,fuga,fuga'"
        ]);
    });

    await t.step('semicolon separation test', () => {
        const row = `foo;'bar';"hoge";"chuc,chuc";'fuga,fuga,fuga'`;

        assertEquals(separate(';', row), [
            'foo', "'bar'", '"hoge"', '"chuc,chuc"', "'fuga,fuga,fuga'"
        ]);
    })
})