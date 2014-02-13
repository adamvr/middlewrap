# middlewrap

A utility for wrapping functions in stacks of middleware. A cut down version of [hooks](https://github.com/bnoguchi/hooks-js).

## Usage

    var stack = [function (next, a, b) { console.log(a, b); next() }, console.dir]

    var f = function (a, b, cb) {
      if (a === b) return cb('yes');
      return cb('no');
    };

    f = wrap(f, stack);
