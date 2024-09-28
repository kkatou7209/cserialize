class Sample {
    foo: string;
    bar: string;

    constructor(foo: string, bar: string) {
        this.foo = '';
        this.bar = '';
    }
}

console.log(Reflect.ownKeys(File.prototype))