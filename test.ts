const text = `"foo",bar_%s,"hoge,hoge",'ss,gg'`;

const regex = new RegExp(/(("[^"]+")+|'[^']+'|[^,]+)/g);

console.log(text.match(regex))