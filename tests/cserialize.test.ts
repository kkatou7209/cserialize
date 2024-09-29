import { assert, assertEquals, assertFalse, assertThrows, assertStrictEquals } from '@std/assert';
import { Cserialize } from '@/cserialize.ts';
import { CommaCsvParser } from '@/utils/parser/impl/CommaCsvParser.ts';
import { TabCsvParser } from '@/utils/parser/impl/TabCsvParser.ts';
import { SemicolonCsvParser } from '@/utils/parser/impl/SemicolonCsvParser.ts';

Deno.test('delimiter method test', async (t) => {
    await t.step('parser is correctly set', async () => {
        const cserializeComma = Cserialize.delimiter('comma');
        assertEquals(cserializeComma.parser(), new CommaCsvParser());

        const cserializeTab = Cserialize.delimiter('tab');
        assertEquals(cserializeTab.parser(), new TabCsvParser());

        const cserializeSemicolon = Cserialize.delimiter('semi');
        assertEquals(cserializeSemicolon.parser(), new SemicolonCsvParser());
    });

    await t.step('should throw at unknown delimiter', async () => {
        assertThrows(() => {
            Cserialize.delimiter('unknown' as 'comma');
        }, Error);
    })
})

Deno.test('setData method test', async (t) => {
    const scerialize = Cserialize.use(new CommaCsvParser());

    await t.step('register data correctly', async () => {
        scerialize.setData({
            headers: ['foo', 'bar', 'hoge'],
            rows: [
                ['foo_value_1', 'bar_value_1', 'hoge_value_1'],
                ['foo_value_2', 'bar_value_2', 'hoge_value_2']
            ]
        });

        const data = scerialize.data();

        assertEquals(data.headers, ['foo', 'bar', 'hoge']);
        assertEquals(data.rows[0], ['foo_value_1', 'bar_value_1', 'hoge_value_1']);
        assertEquals(data.maps[1].get('bar'), 'bar_value_2');
    });
 });