import type { Row } from '@/types/csv.ts';

/**
 * model class represents csv data
 */
class Csv {
    public headers: string[] = [];

    public rows: string[][] = [];

    public maps: Map<string, string>[] = [];
}

export { Csv };