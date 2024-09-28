import { assert, assertFalse, assertThrows } from '@std/assert';
import Cserialize from '@/cserialize.ts';

Deno.test('validate method tests', async (t) => {
    await t.step('return true if valid csv', async () => {
        const validCsv = 'foo1,foo2,foo3';

        assert(Cserialize.validate(validCsv));

    });
    
    await t.step('return false if invalid csv', async () => {
        const invalidCsv = 'foo1    foo2,foo3';
    
        assertFalse(Cserialize.validate(invalidCsv));
    });
});