var _ = require('underscore');

var wrap = module.exports = function (f, stack) {
  return function () {
    var that = this
      , hookArgs // Arguments passed to original 
      , cb = arguments[arguments.length - 1] // Final callback
      , pres = 'function' === typeof stack ? stack() : stack // Stack of pres
      , pending = pres.length // Number of pres to process
      , current = -1; // Position in the stack

    var next = function () {
      // Fire error handler
      if (arguments[0] instanceof Error) return error(arguments[0]);

      var args = Array.prototype.slice.call(this, arguments);
        , pre // Current pre
        , preArgs;

      if (args.length && !(args[0] === null && 'function' === typeof cb)) {
        hookArgs = args;
      }

      // More pres to call
      if (++current < pending) {
        // Get the next pre
        pre = pres[current];

        // Assemble arguments
        preArgs = [once(next)].concat(hookArgs);

        // Fire the pre
        return pre.apply(that, preArgs);
      } else {
        // Fire the original function
        return f.apply(that, hookArgs);
      }
    };

    // Error handler
    var error = function (err) {
      // If we've got a callback to report to use it
      if ('function' === typeof cb) return cb(err);
      // Otherwise, crash the world
      throw err;
    };

    // Kick off the pre stack
    return next.apply(this, arguments);
  };
};

/**
 * once - extracted from underscore (http://underscorejs.org)
 */
var once = function (fn) {
  var ran = false, memo
  return function () {
    if (ran) return memo;
    ran = true;
    memo = fn.apply(this, arguments);
    fn = null;
    return memo;
  };
};
