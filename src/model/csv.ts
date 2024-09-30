/**
 * model class represents csv data
 */
class Csv {
    public headers: string[] = [];

    public rows: string[][] = [];

    public maps: Map<string | number, string>[] = [];
}

export { Csv };