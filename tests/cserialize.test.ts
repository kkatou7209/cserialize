import { assert, assertEquals, assertFalse, assertThrows, assertStrictEquals } from '@std/assert';
import Cserialize from '../mod.ts';

Deno.test('parsing test', async (t) => {
    await t.step('parse correctly with initial config', async () => {
        const csv = `foo,bar,hoge\r\n"foo_0",bar_0,"hoge_0"\r\n"foo_1",bar_1,"hoge_1,hoge_1"\r\n"foo_2",bar_2,"hoge_2"`;
    
        const instance = Cserialize.read(csv).parse();
    
        assertEquals(instance.getData().headers, ['foo', 'bar', 'hoge']);
        assertEquals(instance.getData().rows, [
            ['"foo_0"', 'bar_0', '"hoge_0"'],
            ['"foo_1"', 'bar_1', '"hoge_1,hoge_1"'],
            ['"foo_2"', 'bar_2', '"hoge_2"']
        ]);
        assertEquals(instance.getData().maps, [
            new Map([['foo', '"foo_0"'], ['bar', 'bar_0'], ['hoge', '"hoge_0"']]),
            new Map([['foo', '"foo_1"'], ['bar', 'bar_1'], ['hoge', '"hoge_1,hoge_1"']]),
            new Map([['foo', '"foo_2"'], ['bar', 'bar_2'], ['hoge', '"hoge_2"']]),
        ])
    })
})

Deno.test('setData method test', async (t) => {
    const scerialize = new Cserialize();

    await t.step('register data correctly', async () => {
        scerialize.setData({
            headers: ['foo', 'bar', 'hoge'],
            rows: [
                ['foo_value_1', 'bar_value_1', 'hoge_value_1'],
                ['foo_value_2', 'bar_value_2', 'hoge_value_2']
            ]
        });

        const data = scerialize.getData();

        assertEquals(data.headers, ['foo', 'bar', 'hoge']);
        assertEquals(data.rows[0], ['foo_value_1', 'bar_value_1', 'hoge_value_1']);
        assertEquals(data.maps[1].get('bar'), 'bar_value_2');
    });
 });