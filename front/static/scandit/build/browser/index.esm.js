/*!
 * @license
 *
 * Scandit Barcode Scanner SDK for the Web
 * v. 5.5.3
 *
 * Copyright © 2021 Scandit AG. All Rights Reserved.
 *
 * The use of this software is governed by the Scandit Terms and Conditions.
 * https://ssl.scandit.com/terms/test.pdf
 *
 * The following sets forth attribution notices for third party software that may be contained in portions of the product.
 * https://docs.scandit.com/stable/web/LICENSE
 */
function ___$insertStyle(css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime_1 = createCommonjsModule(function (module) {
var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}
});

var regenerator = runtime_1;

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// true  -> String#at
// false -> String#codePointAt
var _stringAt = function (TO_STRING) {
  return function (that, pos) {
    var s = String(_defined(that));
    var i = _toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var _library = true;

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.6.12' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$1 = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function (it) {
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var hasOwnProperty = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && _has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx(out, _global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

var _redefine = _hide;

var _iterators = {};

var toString = {}.toString;

var _cof = function (it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject = function (it) {
  return _iobject(_defined(it));
};

// 7.1.15 ToLength

var min = Math.min;
var _toLength = function (it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes



var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var _shared = createCommonjsModule(function (module) {
var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: _core.version,
  mode: 'pure' ,
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});
});

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)



var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  _anObject(O);
  var keys = _objectKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
  return O;
};

var document$2 = _global.document;
var _html = document$2 && document$2.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



var IE_PROTO$1 = _sharedKey('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE$1 = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe');
  var i = _enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE$1] = _anObject(O);
    result = new Empty();
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = createDict();
  return Properties === undefined ? result : _objectDps(result, Properties);
};

var _wks = createCommonjsModule(function (module) {
var store = _shared('wks');

var Symbol = _global.Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
};

$exports.store = store;
});

var def = _objectDp.f;

var TAG = _wks('toStringTag');

var _setToStringTag = function (it, tag, stat) {
  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function () { return this; });

var _iterCreate = function (Constructor, NAME, next) {
  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
  _setToStringTag(Constructor, NAME + ' Iterator');
};

// 7.1.13 ToObject(argument)

var _toObject = function (it) {
  return Object(_defined(it));
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


var IE_PROTO$2 = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function (O) {
  O = _toObject(O);
  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

var ITERATOR = _wks('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  _iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    _hide(proto, ITERATOR, $default);
  }
  // Plug for library
  _iterators[NAME] = $default;
  _iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) _redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

var $at = _stringAt(true);

// 21.1.3.27 String.prototype[@@iterator]()
_iterDefine(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

var _iterStep = function (done, value) {
  return { value: value, done: !!done };
};

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
_iterDefine(Array, 'Array', function (iterated, kind) {
  this._t = _toIobject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return _iterStep(1);
  }
  if (kind == 'keys') return _iterStep(0, index);
  if (kind == 'values') return _iterStep(0, O[index]);
  return _iterStep(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
_iterators.Arguments = _iterators.Array;

var TO_STRING_TAG = _wks('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = _global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
  _iterators[NAME] = _iterators.Array;
}

// getting tag from 19.1.3.6 Object.prototype.toString()

var TAG$1 = _wks('toStringTag');
// ES3 wrong here
var ARG = _cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

var _classof = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
    // builtinTag case
    : ARG ? _cof(O)
    // ES3 arguments fallback
    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var _anInstance = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

// call something on iterator step with safe closing on error

var _iterCall = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) _anObject(ret.call(iterator));
    throw e;
  }
};

// check on default Array iterator

var ITERATOR$1 = _wks('iterator');
var ArrayProto = Array.prototype;

var _isArrayIter = function (it) {
  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR$1] === it);
};

var ITERATOR$2 = _wks('iterator');

var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$2]
    || it['@@iterator']
    || _iterators[_classof(it)];
};

var _forOf = createCommonjsModule(function (module) {
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);
  var f = _ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
    result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = _iterCall(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;
});

// 7.3.20 SpeciesConstructor(O, defaultConstructor)


var SPECIES = _wks('species');
var _speciesConstructor = function (O, D) {
  var C = _anObject(O).constructor;
  var S;
  return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
};

// fast apply, http://jsperf.lnkit.com/fast-apply/5
var _invoke = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

var process = _global.process;
var setTask = _global.setImmediate;
var clearTask = _global.clearImmediate;
var MessageChannel = _global.MessageChannel;
var Dispatch = _global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      _invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (_cof(process) == 'process') {
    defer = function (id) {
      process.nextTick(_ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(_ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = _ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {
    defer = function (id) {
      _global.postMessage(id + '', '*');
    };
    _global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in _domCreate('script')) {
    defer = function (id) {
      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {
        _html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(_ctx(run, id, 1), 0);
    };
  }
}
var _task = {
  set: setTask,
  clear: clearTask
};

var macrotask = _task.set;
var Observer = _global.MutationObserver || _global.WebKitMutationObserver;
var process$1 = _global.process;
var Promise$1 = _global.Promise;
var isNode = _cof(process$1) == 'process';

var _microtask = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process$1.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process$1.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(_global.navigator && _global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise$1 && Promise$1.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise$1.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(_global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

// 25.4.1.5 NewPromiseCapability(C)


function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = _aFunction(resolve);
  this.reject = _aFunction(reject);
}

var f$1 = function (C) {
  return new PromiseCapability(C);
};

var _newPromiseCapability = {
	f: f$1
};

var _perform = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

var navigator$1 = _global.navigator;

var _userAgent = navigator$1 && navigator$1.userAgent || '';

var _promiseResolve = function (C, x) {
  _anObject(C);
  if (_isObject(x) && x.constructor === C) return x;
  var promiseCapability = _newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var _redefineAll = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else _hide(target, key, src[key]);
  } return target;
};

var SPECIES$1 = _wks('species');

var _setSpecies = function (KEY) {
  var C = typeof _core[KEY] == 'function' ? _core[KEY] : _global[KEY];
  if (_descriptors && C && !C[SPECIES$1]) _objectDp.f(C, SPECIES$1, {
    configurable: true,
    get: function () { return this; }
  });
};

var ITERATOR$3 = _wks('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR$3]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

var _iterDetect = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR$3]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR$3] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

var task = _task.set;
var microtask = _microtask();




var PROMISE = 'Promise';
var TypeError$1 = _global.TypeError;
var process$2 = _global.process;
var versions = process$2 && process$2.versions;
var v8 = versions && versions.v8 || '';
var $Promise = _global[PROMISE];
var isNode$1 = _classof(process$2) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = _newPromiseCapability.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[_wks('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode$1 || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && _userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError$1('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(_global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = _perform(function () {
        if (isNode$1) {
          process$2.emit('unhandledRejection', value, promise);
        } else if (handler = _global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = _global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode$1 || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(_global, function () {
    var handler;
    if (isNode$1) {
      process$2.emit('rejectionHandled', promise);
    } else if (handler = _global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    _anInstance(this, $Promise, PROMISE, '_h');
    _aFunction(executor);
    Internal.call(this);
    try {
      executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = _redefineAll($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(_speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode$1 ? process$2.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = _ctx($resolve, promise, 1);
    this.reject = _ctx($reject, promise, 1);
  };
  _newPromiseCapability.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE, { Promise: $Promise });
_setToStringTag($Promise, PROMISE);
_setSpecies(PROMISE);
Wrapper = _core[PROMISE];

// statics
_export(_export.S + _export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
_export(_export.S + _export.F * (_library ), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return _promiseResolve(this === Wrapper ? $Promise : this, x);
  }
});
_export(_export.S + _export.F * !(USE_NATIVE && _iterDetect(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = _perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      _forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = _perform(function () {
      _forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

_export(_export.P + _export.R, 'Promise', { 'finally': function (onFinally) {
  var C = _speciesConstructor(this, _core.Promise || _global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return _promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return _promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

// https://github.com/tc39/proposal-promise-try




_export(_export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = _newPromiseCapability.f(this);
  var result = _perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

var promise = _core.Promise;

var promise$1 = promise;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    promise$1.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new promise$1(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var asyncToGenerator = _asyncToGenerator;

!function(){if("undefined"!=typeof window){var t=window.navigator.userAgent.match(/Edge\/(\d{2})\./),e=t?parseInt(t[1],10):null,n=!!e&&(16<=e&&e<=18);if(!("objectFit"in document.documentElement.style!=!1)||n){var o=function(t,e,i){var n,o,l,a,d;if((i=i.split(" ")).length<2&&(i[1]=i[0]),"x"===t)n=i[0],o=i[1],l="left",a="right",d=e.clientWidth;else {if("y"!==t)return;n=i[1],o=i[0],l="top",a="bottom",d=e.clientHeight;}if(n!==l&&o!==l){if(n!==a&&o!==a)return "center"===n||"50%"===n?(e.style[l]="50%",void(e.style["margin-"+l]=d/-2+"px")):void(0<=n.indexOf("%")?(n=parseInt(n,10))<50?(e.style[l]=n+"%",e.style["margin-"+l]=d*(n/-100)+"px"):(n=100-n,e.style[a]=n+"%",e.style["margin-"+a]=d*(n/-100)+"px"):e.style[l]=n);e.style[a]="0";}else e.style[l]="0";},l=function(t){var e=t.dataset?t.dataset.objectFit:t.getAttribute("data-object-fit"),i=t.dataset?t.dataset.objectPosition:t.getAttribute("data-object-position");e=e||"cover",i=i||"50% 50%";var n=t.parentNode;return function(t){var e=window.getComputedStyle(t,null),i=e.getPropertyValue("position"),n=e.getPropertyValue("overflow"),o=e.getPropertyValue("display");i&&"static"!==i||(t.style.position="relative"),"hidden"!==n&&(t.style.overflow="hidden"),o&&"inline"!==o||(t.style.display="block"),0===t.clientHeight&&(t.style.height="100%"),-1===t.className.indexOf("object-fit-polyfill")&&(t.className=t.className+" object-fit-polyfill");}(n),function(t){var e=window.getComputedStyle(t,null),i={"max-width":"none","max-height":"none","min-width":"0px","min-height":"0px",top:"auto",right:"auto",bottom:"auto",left:"auto","margin-top":"0px","margin-right":"0px","margin-bottom":"0px","margin-left":"0px"};for(var n in i)e.getPropertyValue(n)!==i[n]&&(t.style[n]=i[n]);}(t),t.style.position="absolute",t.style.width="auto",t.style.height="auto","scale-down"===e&&(e=t.clientWidth<n.clientWidth&&t.clientHeight<n.clientHeight?"none":"contain"),"none"===e?(o("x",t,i),void o("y",t,i)):"fill"===e?(t.style.width="100%",t.style.height="100%",o("x",t,i),void o("y",t,i)):(t.style.height="100%",void("cover"===e&&t.clientWidth>n.clientWidth||"contain"===e&&t.clientWidth<n.clientWidth?(t.style.top="0",t.style.marginTop="0",o("x",t,i)):(t.style.width="100%",t.style.height="auto",t.style.left="0",t.style.marginLeft="0",o("y",t,i))))},i=function(t){if(void 0===t||t instanceof Event)t=document.querySelectorAll("[data-object-fit]");else if(t&&t.nodeName)t=[t];else {if("object"!=typeof t||!t.length||!t[0].nodeName)return !1;t=t;}for(var e=0;e<t.length;e++)if(t[e].nodeName){var i=t[e].nodeName.toLowerCase();if("img"===i){if(n)continue;t[e].complete?l(t[e]):t[e].addEventListener("load",function(){l(this);});}else "video"===i?0<t[e].readyState?l(t[e]):t[e].addEventListener("loadedmetadata",function(){l(this);}):l(t[e]);}return !0};"loading"===document.readyState?document.addEventListener("DOMContentLoaded",i):i(),window.addEventListener("resize",i),window.objectFitPolyfill=i;}else window.objectFitPolyfill=function(){return !1};}}();

var arraySlice = [].slice;
var factories = {};

var construct = function (F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

var _bind = Function.bind || function bind(that /* , ...args */) {
  var fn = _aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function (/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : _invoke(fn, args, that);
  };
  if (_isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};

// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])







var rConstruct = (_global.Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = _fails(function () {
  function F() { /* empty */ }
  return !(rConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !_fails(function () {
  rConstruct(function () { /* empty */ });
});

_export(_export.S + _export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /* , newTarget */) {
    _aFunction(Target);
    _anObject(args);
    var newTarget = arguments.length < 3 ? Target : _aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (_bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = _objectCreate(_isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return _isObject(result) ? result : instance;
  }
});

var construct$1 = _core.Reflect.construct;

var construct$2 = construct$1;

var _meta = createCommonjsModule(function (module) {
var META = _uid('meta');


var setDesc = _objectDp.f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !_fails(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!_has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!_has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};
});

var _validateCollection = function (it, TYPE) {
  if (!_isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

var dP$1 = _objectDp.f;









var fastKey = _meta.fastKey;

var SIZE = _descriptors ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

var _collectionStrong = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      _anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = _objectCreate(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
    });
    _redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = _validateCollection(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = _validateCollection(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        _validateCollection(this, NAME);
        var f = _ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(_validateCollection(this, NAME), key);
      }
    });
    if (_descriptors) dP$1(C.prototype, 'size', {
      get: function () {
        return _validateCollection(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    _iterDefine(C, NAME, function (iterated, kind) {
      this._t = _validateCollection(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return _iterStep(1);
      }
      // return step by kind
      if (kind == 'keys') return _iterStep(0, entry.k);
      if (kind == 'values') return _iterStep(0, entry.v);
      return _iterStep(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    _setSpecies(NAME);
  }
};

// 7.2.2 IsArray(argument)

var _isArray = Array.isArray || function isArray(arg) {
  return _cof(arg) == 'Array';
};

var SPECIES$2 = _wks('species');

var _arraySpeciesConstructor = function (original) {
  var C;
  if (_isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || _isArray(C.prototype))) C = undefined;
    if (_isObject(C)) {
      C = C[SPECIES$2];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)


var _arraySpeciesCreate = function (original, length) {
  return new (_arraySpeciesConstructor(original))(length);
};

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex





var _arrayMethods = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || _arraySpeciesCreate;
  return function ($this, callbackfn, that) {
    var O = _toObject($this);
    var self = _iobject(O);
    var f = _ctx(callbackfn, that, 3);
    var length = _toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

var dP$2 = _objectDp.f;
var each = _arrayMethods(0);


var _collection = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = _global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  if (!_descriptors || typeof C != 'function' || !(IS_WEAK || proto.forEach && !_fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    _redefineAll(C.prototype, methods);
    _meta.NEED = true;
  } else {
    C = wrapper(function (target, iterable) {
      _anInstance(target, C, NAME, '_c');
      target._c = new Base();
      if (iterable != undefined) _forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','), function (KEY) {
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if (KEY in proto && !(IS_WEAK && KEY == 'clear')) _hide(C.prototype, KEY, function (a, b) {
        _anInstance(this, C, KEY);
        if (!IS_ADDER && IS_WEAK && !_isObject(a)) return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    IS_WEAK || dP$2(C.prototype, 'size', {
      get: function () {
        return this._c.size;
      }
    });
  }

  _setToStringTag(C, NAME);

  O[NAME] = C;
  _export(_export.G + _export.W + _export.F, O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

var SET = 'Set';

// 23.2 Set Objects
_collection(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return _collectionStrong.def(_validateCollection(this, SET), value = value === 0 ? 0 : value, value);
  }
}, _collectionStrong);

var _arrayFromIterable = function (iter, ITERATOR) {
  var result = [];
  _forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

// https://github.com/DavidBruant/Map-Set.prototype.toJSON


var _collectionToJson = function (NAME) {
  return function toJSON() {
    if (_classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return _arrayFromIterable(this);
  };
};

// https://github.com/DavidBruant/Map-Set.prototype.toJSON


_export(_export.P + _export.R, 'Set', { toJSON: _collectionToJson('Set') });

// https://tc39.github.io/proposal-setmap-offrom/


var _setCollectionOf = function (COLLECTION) {
  _export(_export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = new Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};

// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
_setCollectionOf('Set');

// https://tc39.github.io/proposal-setmap-offrom/





var _setCollectionFrom = function (COLLECTION) {
  _export(_export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    _aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) _aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = _ctx(mapFn, arguments[2], 2);
      _forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      _forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};

// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
_setCollectionFrom('Set');

var set = _core.Set;

var set$1 = set;

var _createProperty = function (object, index, value) {
  if (index in object) _objectDp.f(object, index, _propertyDesc(0, value));
  else object[index] = value;
};

_export(_export.S + _export.F * !_iterDetect(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = _toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = core_getIteratorMethod(O);
    var length, result, step, iterator;
    if (mapping) mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && _isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        _createProperty(result, index, mapping ? _iterCall(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = _toLength(O.length);
      for (result = new C(length); length > index; index++) {
        _createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

var from = _core.Array.from;

var from$1 = from;

// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
_export(_export.S + _export.F * !_descriptors, 'Object', { defineProperty: _objectDp.f });

var $Object = _core.Object;
var defineProperty = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

var defineProperty$1 = defineProperty;

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;

    defineProperty$1(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var createClass = _createClass;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var classCallCheck = _classCallCheck;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
_export(_export.S, 'Object', { create: _objectCreate });

var $Object$1 = _core.Object;
var create = function create(P, D) {
  return $Object$1.create(P, D);
};

var create$1 = create;

var f$2 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$2
};

var gOPD = Object.getOwnPropertyDescriptor;

var f$3 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = _toIobject(O);
  P = _toPrimitive(P, true);
  if (_ie8DomDefine) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
};

var _objectGopd = {
	f: f$3
};

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */


var check = function (O, proto) {
  _anObject(O);
  if (!_isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
var _setProto = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

// 19.1.3.19 Object.setPrototypeOf(O, proto)

_export(_export.S, 'Object', { setPrototypeOf: _setProto.set });

var setPrototypeOf = _core.Object.setPrototypeOf;

var setPrototypeOf$1 = setPrototypeOf;

var setPrototypeOf$2 = createCommonjsModule(function (module) {
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = setPrototypeOf$1 || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
});

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = create$1(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf$2(subClass, superClass);
}

var inherits = _inherits;

var f$4 = _wks;

var _wksExt = {
	f: f$4
};

var iterator = _wksExt.f('iterator');

var iterator$1 = iterator;

var defineProperty$2 = _objectDp.f;
var _wksDefine = function (name) {
  var $Symbol = _core.Symbol || (_core.Symbol = {} );
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty$2($Symbol, name, { value: _wksExt.f(name) });
};

var f$5 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$5
};

// all enumerable object keys, includes symbols



var _enumKeys = function (it) {
  var result = _objectKeys(it);
  var getSymbols = _objectGops.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = _objectPie.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

var f$6 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return _objectKeysInternal(O, hiddenKeys);
};

var _objectGopn = {
	f: f$6
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

var gOPN = _objectGopn.f;
var toString$1 = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

var f$7 = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(_toIobject(it));
};

var _objectGopnExt = {
	f: f$7
};

// ECMAScript 6 symbols shim





var META = _meta.KEY;





















var gOPD$1 = _objectGopd.f;
var dP$3 = _objectDp.f;
var gOPN$1 = _objectGopnExt.f;
var $Symbol = _global.Symbol;
var $JSON = _global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE$2 = 'prototype';
var HIDDEN = _wks('_hidden');
var TO_PRIMITIVE = _wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = _shared('symbol-registry');
var AllSymbols = _shared('symbols');
var OPSymbols = _shared('op-symbols');
var ObjectProto$1 = Object[PROTOTYPE$2];
var USE_NATIVE$1 = typeof $Symbol == 'function' && !!_objectGops.f;
var QObject = _global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = _descriptors && _fails(function () {
  return _objectCreate(dP$3({}, 'a', {
    get: function () { return dP$3(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD$1(ObjectProto$1, key);
  if (protoDesc) delete ObjectProto$1[key];
  dP$3(it, key, D);
  if (protoDesc && it !== ObjectProto$1) dP$3(ObjectProto$1, key, protoDesc);
} : dP$3;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE$1 && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto$1) $defineProperty(OPSymbols, key, D);
  _anObject(it);
  key = _toPrimitive(key, true);
  _anObject(D);
  if (_has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!_has(it, HIDDEN)) dP$3(it, HIDDEN, _propertyDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP$3(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  _anObject(it);
  var keys = _enumKeys(P = _toIobject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = _toPrimitive(key, true));
  if (this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;
  return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = _toIobject(it);
  key = _toPrimitive(key, true);
  if (it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;
  var D = gOPD$1(it, key);
  if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN$1(_toIobject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto$1;
  var names = gOPN$1(IS_OP ? OPSymbols : _toIobject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE$1) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto$1) $set.call(OPSymbols, value);
      if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, _propertyDesc(1, value));
    };
    if (_descriptors && setter) setSymbolDesc(ObjectProto$1, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  _redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
    return this._k;
  });

  _objectGopd.f = $getOwnPropertyDescriptor;
  _objectDp.f = $defineProperty;
  _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
  _objectPie.f = $propertyIsEnumerable;
  _objectGops.f = $getOwnPropertySymbols;

  if (_descriptors && !_library) {
    _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable);
  }

  _wksExt.f = function (name) {
    return wrap(_wks(name));
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE$1, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)_wks(es6Symbols[j++]);

for (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);

_export(_export.S + _export.F * !USE_NATIVE$1, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return _has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

_export(_export.S + _export.F * !USE_NATIVE$1, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FAILS_ON_PRIMITIVES = _fails(function () { _objectGops.f(1); });

_export(_export.S + _export.F * FAILS_ON_PRIMITIVES, 'Object', {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return _objectGops.f(_toObject(it));
  }
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && _export(_export.S + _export.F * (!USE_NATIVE$1 || _fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!_isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!_isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
_setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
_setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
_setToStringTag(_global.JSON, 'JSON', true);

_wksDefine('asyncIterator');

_wksDefine('observable');

var symbol = _core.Symbol;

var symbol$1 = symbol;

var _typeof_1 = createCommonjsModule(function (module) {
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof symbol$1 === "function" && typeof iterator$1 === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof symbol$1 === "function" && obj.constructor === symbol$1 && obj !== symbol$1.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
});

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var assertThisInitialized = _assertThisInitialized;

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof_1(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

var possibleConstructorReturn = _possibleConstructorReturn;

// most Object methods by ES6 should accept primitives



var _objectSap = function (KEY, exec) {
  var fn = (_core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  _export(_export.S + _export.F * _fails(function () { fn(1); }), 'Object', exp);
};

// 19.1.2.9 Object.getPrototypeOf(O)



_objectSap('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return _objectGpo(_toObject(it));
  };
});

var getPrototypeOf = _core.Object.getPrototypeOf;

var getPrototypeOf$1 = getPrototypeOf;

var getPrototypeOf$2 = createCommonjsModule(function (module) {
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = setPrototypeOf$1 ? getPrototypeOf$1 : function _getPrototypeOf(o) {
    return o.__proto__ || getPrototypeOf$1(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
});

var eventemitter3 = createCommonjsModule(function (module) {

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
{
  module.exports = EventEmitter;
}
});

var MAP = 'Map';

// 23.1 Map Objects
_collection(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = _collectionStrong.getEntry(_validateCollection(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return _collectionStrong.def(_validateCollection(this, MAP), key === 0 ? 0 : key, value);
  }
}, _collectionStrong, true);

// https://github.com/DavidBruant/Map-Set.prototype.toJSON


_export(_export.P + _export.R, 'Map', { toJSON: _collectionToJson('Map') });

// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
_setCollectionOf('Map');

// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
_setCollectionFrom('Map');

var map = _core.Map;

var map$1 = map;

var Barcode;

(function (Barcode) {
  /**
   * @hidden
   *
   * Create a [[Barcode]] object from a partial object returned by the external Scandit Engine library.
   * The *rawData* and *data* fields are computed and stored.
   *
   * @param result The barcode result coming from the external Scandit Engine library.
   * @returns The generated [[Barcode]] object.
   */
  function createFromWASMResult(result) {
    var decodedData;

    try {
      decodedData = decodeURIComponent(escape(String.fromCharCode.apply(null, result.rawData)));
    } catch (_unused) {
      decodedData = "";
    }

    return {
      symbology: result.symbology,
      data: decodedData,
      rawData: new Uint8Array(result.rawData),
      location: {
        topLeft: {
          x: result.location[0][0],
          y: result.location[0][1]
        },
        topRight: {
          x: result.location[1][0],
          y: result.location[1][1]
        },
        bottomRight: {
          x: result.location[2][0],
          y: result.location[2][1]
        },
        bottomLeft: {
          x: result.location[3][0],
          y: result.location[3][1]
        }
      },
      compositeFlag: result.compositeFlag,
      isGs1DataCarrier: result.isGs1DataCarrier,
      encodingArray: result.encodingArray
    };
  }

  Barcode.createFromWASMResult = createFromWASMResult;

  (function (Symbology) {
    Symbology["AZTEC"] = "aztec";
    Symbology["CODABAR"] = "codabar";
    Symbology["CODE11"] = "code11";
    Symbology["CODE128"] = "code128";
    Symbology["CODE25"] = "code25";
    Symbology["CODE32"] = "code32";
    Symbology["CODE39"] = "code39";
    Symbology["CODE93"] = "code93";
    Symbology["DATA_MATRIX"] = "data-matrix";
    Symbology["DOTCODE"] = "dotcode";
    Symbology["EAN13"] = "ean13";
    Symbology["EAN8"] = "ean8";
    Symbology["FIVE_DIGIT_ADD_ON"] = "five-digit-add-on";
    Symbology["GS1_DATABAR"] = "databar";
    Symbology["GS1_DATABAR_EXPANDED"] = "databar-expanded";
    Symbology["GS1_DATABAR_LIMITED"] = "databar-limited";
    Symbology["IATA_2_OF_5"] = "iata2of5";
    Symbology["INTERLEAVED_2_OF_5"] = "itf";
    Symbology["KIX"] = "kix";
    Symbology["LAPA4SC"] = "lapa4sc";
    Symbology["MAXICODE"] = "maxicode";
    Symbology["MICRO_PDF417"] = "micropdf417";
    Symbology["MICRO_QR"] = "microqr";
    Symbology["MSI_PLESSEY"] = "msi-plessey";
    Symbology["PDF417"] = "pdf417";
    Symbology["QR"] = "qr";
    Symbology["RM4SCC"] = "rm4scc";
    Symbology["TWO_DIGIT_ADD_ON"] = "two-digit-add-on";
    Symbology["UPCA"] = "upca";
    Symbology["UPCE"] = "upce";
  })(Barcode.Symbology || (Barcode.Symbology = {}));

  (function (CompositeFlag) {
    /**
     * Code is not part of a composite code.
     */
    CompositeFlag[CompositeFlag["NONE"] = 0] = "NONE";
    /**
     * Code could be part of a composite code. This flag is set by linear (1D) symbologies that have
     * no composite flag support but can be part of a composite code like the EAN/UPC symbology family.
     */

    CompositeFlag[CompositeFlag["UNKNOWN"] = 1] = "UNKNOWN";
    /**
     * Code is the linear component of a composite code. This flag can be set by GS1 DataBar or GS1-128 (Code 128).
     */

    CompositeFlag[CompositeFlag["LINKED"] = 2] = "LINKED";
    /**
     * Code is a GS1 Composite Code Type A (CC - A).This flag can be set by MicroPDF417 codes.
     */

    CompositeFlag[CompositeFlag["GS1_A"] = 4] = "GS1_A";
    /**
     * Code is a GS1 Composite Code Type B (CC-B). This flag can be set by MicroPDF417 codes.
     */

    CompositeFlag[CompositeFlag["GS1_B"] = 8] = "GS1_B";
    /**
     * Code is a GS1 Composite Code Type C (CC-C). This flag can be set by PDF417 codes.
     */

    CompositeFlag[CompositeFlag["GS1_C"] = 16] = "GS1_C";
  })(Barcode.CompositeFlag || (Barcode.CompositeFlag = {})); // istanbul ignore next


  (function (Symbology) {
    /**
     * @hidden
     */
    // tslint:disable:no-unnecessary-qualifier
    var humanizedSymbologyNames = new map$1([[Symbology.AZTEC, "Aztec"], [Symbology.CODABAR, "Codabar"], [Symbology.CODE11, "Code 11"], [Symbology.CODE128, "Code 128"], [Symbology.CODE25, "Code 25"], [Symbology.CODE32, "Code 32"], [Symbology.CODE39, "Code 39"], [Symbology.CODE93, "Code 93"], [Symbology.DATA_MATRIX, "Data Matrix"], [Symbology.DOTCODE, "DotCode"], [Symbology.EAN13, "EAN-13"], [Symbology.EAN8, "EAN-8"], [Symbology.FIVE_DIGIT_ADD_ON, "Five-Digit Add-On"], [Symbology.GS1_DATABAR_EXPANDED, "GS1 DataBar Expanded"], [Symbology.GS1_DATABAR_LIMITED, "GS1 DataBar Limited"], [Symbology.GS1_DATABAR, "GS1 DataBar 14"], [Symbology.IATA_2_OF_5, "IATA 2 of 5"], [Symbology.INTERLEAVED_2_OF_5, "Interleaved 2 of 5"], [Symbology.KIX, "KIX"], [Symbology.LAPA4SC, "LAPA4SC"], [Symbology.MAXICODE, "MaxiCode"], [Symbology.MICRO_PDF417, "MicroPDF417"], [Symbology.MICRO_QR, "Micro QR"], [Symbology.MSI_PLESSEY, "MSI-Plessey"], [Symbology.PDF417, "PDF417"], [Symbology.QR, "QR"], [Symbology.RM4SCC, "RM4SCC"], [Symbology.TWO_DIGIT_ADD_ON, "Two-Digit Add-On"], [Symbology.UPCA, "UPC-A"], [Symbology.UPCE, "UPC-E"]]);
    /**
     * @hidden
     */

    var jsonSymbologyNames = new map$1([[Symbology.AZTEC, "aztec"], [Symbology.CODABAR, "codabar"], [Symbology.CODE11, "code11"], [Symbology.CODE128, "code128"], [Symbology.CODE25, "code25"], [Symbology.CODE32, "code32"], [Symbology.CODE39, "code39"], [Symbology.CODE93, "code93"], [Symbology.DATA_MATRIX, "data-matrix"], [Symbology.DOTCODE, "dotcode"], [Symbology.EAN13, "ean13"], [Symbology.EAN8, "ean8"], [Symbology.FIVE_DIGIT_ADD_ON, "five-digit-add-on"], [Symbology.GS1_DATABAR_EXPANDED, "databar-expanded"], [Symbology.GS1_DATABAR_LIMITED, "databar-limited"], [Symbology.GS1_DATABAR, "databar"], [Symbology.IATA_2_OF_5, "iata2of5"], [Symbology.INTERLEAVED_2_OF_5, "itf"], [Symbology.KIX, "kix"], [Symbology.LAPA4SC, "lapa4sc"], [Symbology.MAXICODE, "maxicode"], [Symbology.MICRO_PDF417, "micropdf417"], [Symbology.MICRO_QR, "microqr"], [Symbology.MSI_PLESSEY, "msi-plessey"], [Symbology.PDF417, "pdf417"], [Symbology.QR, "qr"], [Symbology.RM4SCC, "rm4scc"], [Symbology.TWO_DIGIT_ADD_ON, "two-digit-add-on"], [Symbology.UPCA, "upca"], [Symbology.UPCE, "upce"]]); // tslint:enable:no-unnecessary-qualifier

    /**
     * Get the humanized name of a symbology.
     *
     * @param symbology The symbology for which to retrieve the name.
     * @returns The humanized name of the symbology.
     */

    function toHumanizedName(symbology) {
      var _humanizedSymbologyNa;

      return (_humanizedSymbologyNa = humanizedSymbologyNames.get(symbology.toLowerCase())) !== null && _humanizedSymbologyNa !== void 0 ? _humanizedSymbologyNa : "Unknown";
    }

    Symbology.toHumanizedName = toHumanizedName;
    /**
     * Get the JSON key name of a symbology, used for JSON-formatted ScanSettings and Scandit Engine library.
     *
     * @param symbology The symbology for which to retrieve the name.
     * @returns The json key name of the symbology.
     */

    function toJSONName(symbology) {
      var _jsonSymbologyNames$g;

      return (_jsonSymbologyNames$g = jsonSymbologyNames.get(symbology.toLowerCase())) !== null && _jsonSymbologyNames$g !== void 0 ? _jsonSymbologyNames$g : "unknown";
    }

    Symbology.toJSONName = toJSONName;
  })(Barcode.Symbology || (Barcode.Symbology = {}));
})(Barcode || (Barcode = {}));

/*!
 * JavaScript Cookie v2.2.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */

var js_cookie = createCommonjsModule(function (module, exports) {
(function (factory) {
	var registeredInModuleLoader;
	{
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function decode (s) {
		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
	}

	function init (converter) {
		function api() {}

		function set (key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			attributes = extend({
				path: '/'
			}, api.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
			}

			// We're using "expires" because "max-age" is not supported by IE
			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				var result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			value = converter.write ?
				converter.write(value, key) :
				encodeURIComponent(String(value))
					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
				.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';
			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
				}

				// Considers RFC 6265 section 5.2:
				// ...
				// 3.  If the remaining unparsed-attributes contains a %x3B (";")
				//     character:
				// Consume the characters of the unparsed-attributes up to,
				// not including, the first %x3B (";") character.
				// ...
				stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
			}

			return (document.cookie = key + '=' + value + stringifiedAttributes);
		}

		function get (key, json) {
			if (typeof document === 'undefined') {
				return;
			}

			var jar = {};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) ||
						decode(cookie);

					if (json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = set;
		api.get = function (key) {
			return get(key, false /* read as raw */);
		};
		api.getJSON = function (key) {
			return get(key, true /* read as json */);
		};
		api.remove = function (key, attributes) {
			set(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));
});

/*!
 * UAParser.js v0.7.24
 * Lightweight JavaScript-based User-Agent string parser
 * https://github.com/faisalman/ua-parser-js
 *
 * Copyright © 2012-2021 Faisal Salman <f@faisalman.com>
 * Licensed under MIT License
 */

var uaParser = createCommonjsModule(function (module, exports) {
(function (window, undefined$1) {

    //////////////
    // Constants
    /////////////


    var LIBVERSION  = '0.7.24',
        EMPTY       = '',
        UNKNOWN     = '?',
        FUNC_TYPE   = 'function',
        OBJ_TYPE    = 'object',
        STR_TYPE    = 'string',
        MAJOR       = 'major', // deprecated
        MODEL       = 'model',
        NAME        = 'name',
        TYPE        = 'type',
        VENDOR      = 'vendor',
        VERSION     = 'version',
        ARCHITECTURE= 'architecture',
        CONSOLE     = 'console',
        MOBILE      = 'mobile',
        TABLET      = 'tablet',
        SMARTTV     = 'smarttv',
        WEARABLE    = 'wearable',
        EMBEDDED    = 'embedded';


    ///////////
    // Helper
    //////////


    var util = {
        extend : function (regexes, extensions) {
            var mergedRegexes = {};
            for (var i in regexes) {
                if (extensions[i] && extensions[i].length % 2 === 0) {
                    mergedRegexes[i] = extensions[i].concat(regexes[i]);
                } else {
                    mergedRegexes[i] = regexes[i];
                }
            }
            return mergedRegexes;
        },
        has : function (str1, str2) {
          if (typeof str1 === "string") {
            return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
          } else {
            return false;
          }
        },
        lowerize : function (str) {
            return str.toLowerCase();
        },
        major : function (version) {
            return typeof(version) === STR_TYPE ? version.replace(/[^\d\.]/g,'').split(".")[0] : undefined$1;
        },
        trim : function (str) {
          return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
    };


    ///////////////
    // Map helper
    //////////////


    var mapper = {

        rgx : function (ua, arrays) {

            var i = 0, j, k, p, q, matches, match;

            // loop through all regexes maps
            while (i < arrays.length && !matches) {

                var regex = arrays[i],       // even sequence (0,2,4,..)
                    props = arrays[i + 1];   // odd sequence (1,3,5,..)
                j = k = 0;

                // try matching uastring with regexes
                while (j < regex.length && !matches) {

                    matches = regex[j++].exec(ua);

                    if (!!matches) {
                        for (p = 0; p < props.length; p++) {
                            match = matches[++k];
                            q = props[p];
                            // check if given property is actually array
                            if (typeof q === OBJ_TYPE && q.length > 0) {
                                if (q.length == 2) {
                                    if (typeof q[1] == FUNC_TYPE) {
                                        // assign modified match
                                        this[q[0]] = q[1].call(this, match);
                                    } else {
                                        // assign given value, ignore regex match
                                        this[q[0]] = q[1];
                                    }
                                } else if (q.length == 3) {
                                    // check whether function or regex
                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                        // call function (usually string mapper)
                                        this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined$1;
                                    } else {
                                        // sanitize match using given regex
                                        this[q[0]] = match ? match.replace(q[1], q[2]) : undefined$1;
                                    }
                                } else if (q.length == 4) {
                                        this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined$1;
                                }
                            } else {
                                this[q] = match ? match : undefined$1;
                            }
                        }
                    }
                }
                i += 2;
            }
        },

        str : function (str, map) {

            for (var i in map) {
                // check if array
                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (util.has(map[i][j], str)) {
                            return (i === UNKNOWN) ? undefined$1 : i;
                        }
                    }
                } else if (util.has(map[i], str)) {
                    return (i === UNKNOWN) ? undefined$1 : i;
                }
            }
            return str;
        }
    };


    ///////////////
    // String map
    //////////////


    var maps = {

        browser : {
            oldsafari : {
                version : {
                    '1.0'   : '/8',
                    '1.2'   : '/1',
                    '1.3'   : '/3',
                    '2.0'   : '/412',
                    '2.0.2' : '/416',
                    '2.0.3' : '/417',
                    '2.0.4' : '/419',
                    '?'     : '/'
                }
            }
        },

        device : {
            amazon : {
                model : {
                    'Fire Phone' : ['SD', 'KF']
                }
            },
            sprint : {
                model : {
                    'Evo Shift 4G' : '7373KT'
                },
                vendor : {
                    'HTC'       : 'APA',
                    'Sprint'    : 'Sprint'
                }
            }
        },

        os : {
            windows : {
                version : {
                    'ME'        : '4.90',
                    'NT 3.11'   : 'NT3.51',
                    'NT 4.0'    : 'NT4.0',
                    '2000'      : 'NT 5.0',
                    'XP'        : ['NT 5.1', 'NT 5.2'],
                    'Vista'     : 'NT 6.0',
                    '7'         : 'NT 6.1',
                    '8'         : 'NT 6.2',
                    '8.1'       : 'NT 6.3',
                    '10'        : ['NT 6.4', 'NT 10.0'],
                    'RT'        : 'ARM'
                }
            }
        }
    };


    //////////////
    // Regex map
    /////////////


    var regexes = {

        browser : [[

            // Presto based
            /(opera\smini)\/([\w\.-]+)/i,                                       // Opera Mini
            /(opera\s[mobiletab]{3,6}).+version\/([\w\.-]+)/i,                  // Opera Mobi/Tablet
            /(opera).+version\/([\w\.]+)/i,                                     // Opera > 9.80
            /(opera)[\/\s]+([\w\.]+)/i                                          // Opera < 9.80
            ], [NAME, VERSION], [

            /(opios)[\/\s]+([\w\.]+)/i                                          // Opera mini on iphone >= 8.0
            ], [[NAME, 'Opera Mini'], VERSION], [

            /\s(opr)\/([\w\.]+)/i                                               // Opera Webkit
            ], [[NAME, 'Opera'], VERSION], [

            // Mixed
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i,
                                                                                // Lunascape/Maxthon/Netfront/Jasmine/Blazer
            // Trident based
            /(avant\s|iemobile|slim)(?:browser)?[\/\s]?([\w\.]*)/i,
                                                                                // Avant/IEMobile/SlimBrowser
            /(bidubrowser|baidubrowser)[\/\s]?([\w\.]+)/i,                      // Baidu Browser
            /(?:ms|\()(ie)\s([\w\.]+)/i,                                        // Internet Explorer

            // Webkit/KHTML based
            /(rekonq)\/([\w\.]*)/i,                                             // Rekonq
            /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon)\/([\w\.-]+)/i
                                                                                // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
            ], [NAME, VERSION], [

            /(konqueror)\/([\w\.]+)/i                                           // Konqueror
            ], [[NAME, 'Konqueror'], VERSION], [

            /(trident).+rv[:\s]([\w\.]{1,9}).+like\sgecko/i                     // IE11
            ], [[NAME, 'IE'], VERSION], [

            /(edge|edgios|edga|edg)\/((\d+)?[\w\.]+)/i                          // Microsoft Edge
            ], [[NAME, 'Edge'], VERSION], [

            /(yabrowser)\/([\w\.]+)/i                                           // Yandex
            ], [[NAME, 'Yandex'], VERSION], [

            /(Avast)\/([\w\.]+)/i                                               // Avast Secure Browser
            ], [[NAME, 'Avast Secure Browser'], VERSION], [

            /(AVG)\/([\w\.]+)/i                                                 // AVG Secure Browser
            ], [[NAME, 'AVG Secure Browser'], VERSION], [

            /(puffin)\/([\w\.]+)/i                                              // Puffin
            ], [[NAME, 'Puffin'], VERSION], [

            /(focus)\/([\w\.]+)/i                                               // Firefox Focus
            ], [[NAME, 'Firefox Focus'], VERSION], [

            /(opt)\/([\w\.]+)/i                                                 // Opera Touch
            ], [[NAME, 'Opera Touch'], VERSION], [

            /((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i         // UCBrowser
            ], [[NAME, 'UCBrowser'], VERSION], [

            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
            ], [[NAME, /_/g, ' '], VERSION], [

            /(windowswechat qbcore)\/([\w\.]+)/i                                // WeChat Desktop for Windows Built-in Browser
            ], [[NAME, 'WeChat(Win) Desktop'], VERSION], [

            /(micromessenger)\/([\w\.]+)/i                                      // WeChat
            ], [[NAME, 'WeChat'], VERSION], [

            /(brave)\/([\w\.]+)/i                                               // Brave browser
            ], [[NAME, 'Brave'], VERSION], [

            /(whale)\/([\w\.]+)/i                                               // Whale browser
            ], [[NAME, 'Whale'], VERSION], [

            /(qqbrowserlite)\/([\w\.]+)/i                                       // QQBrowserLite
            ], [NAME, VERSION], [

            /(QQ)\/([\d\.]+)/i                                                  // QQ, aka ShouQ
            ], [NAME, VERSION], [

            /m?(qqbrowser)[\/\s]?([\w\.]+)/i                                    // QQBrowser
            ], [NAME, VERSION], [

            /(baiduboxapp)[\/\s]?([\w\.]+)/i                                    // Baidu App
            ], [NAME, VERSION], [

            /(2345Explorer)[\/\s]?([\w\.]+)/i                                   // 2345 Browser
            ], [NAME, VERSION], [

            /(MetaSr)[\/\s]?([\w\.]+)/i                                         // SouGouBrowser
            ], [NAME], [

            /(LBBROWSER)/i                                                      // LieBao Browser
            ], [NAME], [

            /xiaomi\/miuibrowser\/([\w\.]+)/i                                   // MIUI Browser
            ], [VERSION, [NAME, 'MIUI Browser']], [

            /;fbav\/([\w\.]+);/i                                                // Facebook App for iOS & Android with version
            ], [VERSION, [NAME, 'Facebook']], [
            
            /FBAN\/FBIOS|FB_IAB\/FB4A/i                                         // Facebook App for iOS & Android without version
            ], [[NAME, 'Facebook']], [

            /safari\s(line)\/([\w\.]+)/i,                                       // Line App for iOS
            /android.+(line)\/([\w\.]+)\/iab/i                                  // Line App for Android
            ], [NAME, VERSION], [

            /headlesschrome(?:\/([\w\.]+)|\s)/i                                 // Chrome Headless
            ], [VERSION, [NAME, 'Chrome Headless']], [

            /\swv\).+(chrome)\/([\w\.]+)/i                                      // Chrome WebView
            ], [[NAME, /(.+)/, '$1 WebView'], VERSION], [

            /((?:oculus|samsung)browser)\/([\w\.]+)/i
            ], [[NAME, /(.+(?:g|us))(.+)/, '$1 $2'], VERSION], [                // Oculus / Samsung Browser

            /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i        // Android Browser
            ], [VERSION, [NAME, 'Android Browser']], [

            /(coc_coc_browser)\/([\w\.]+)/i                                     // Coc Coc Browser
            ], [[NAME, 'Coc Coc'], VERSION], [

              /(sailfishbrowser)\/([\w\.]+)/i                                     // Sailfish Browser
            ], [[NAME, 'Sailfish Browser'], VERSION], [

            /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i
                                                                                // Chrome/OmniWeb/Arora/Tizen/Nokia
            ], [NAME, VERSION], [

            /(dolfin)\/([\w\.]+)/i                                              // Dolphin
            ], [[NAME, 'Dolphin'], VERSION], [

            /(qihu|qhbrowser|qihoobrowser|360browser)/i                         // 360
            ], [[NAME, '360 Browser']], [

            /((?:android.+)crmo|crios)\/([\w\.]+)/i                             // Chrome for Android/iOS
            ], [[NAME, 'Chrome'], VERSION], [

            /(coast)\/([\w\.]+)/i                                               // Opera Coast
            ], [[NAME, 'Opera Coast'], VERSION], [

            /fxios\/([\w\.-]+)/i                                                // Firefox for iOS
            ], [VERSION, [NAME, 'Firefox']], [

            /version\/([\w\.]+)\s.*mobile\/\w+\s(safari)/i                      // Mobile Safari
            ], [VERSION, [NAME, 'Mobile Safari']], [

            /version\/([\w\.]+)\s.*(mobile\s?safari|safari)/i                   // Safari & Safari Mobile
            ], [VERSION, NAME], [

            /webkit.+?(gsa)\/([\w\.]+)\s.*(mobile\s?safari|safari)(\/[\w\.]+)/i // Google Search Appliance on iOS
            ], [[NAME, 'GSA'], VERSION], [

            /webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i                     // Safari < 3.0
            ], [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]], [

            /(webkit|khtml)\/([\w\.]+)/i
            ], [NAME, VERSION], [

            // Gecko based
            /(navigator|netscape)\/([\w\.-]+)/i                                 // Netscape
            ], [[NAME, 'Netscape'], VERSION], [
            /(swiftfox)/i,                                                      // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
            /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i,

                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(firefox)\/([\w\.]+)\s[\w\s\-]+\/[\w\.]+$/i,                       // Other Firefox-based
            /(mozilla)\/([\w\.]+)\s.+rv\:.+gecko\/\d+/i,                        // Mozilla

            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
            /(links)\s\(([\w\.]+)/i,                                            // Links
            /(gobrowser)\/?([\w\.]*)/i,                                         // GoBrowser
            /(ice\s?browser)\/v?([\w\._]+)/i,                                   // ICE Browser
            /(mosaic)[\/\s]([\w\.]+)/i                                          // Mosaic
            ], [NAME, VERSION]
        ],

        cpu : [[

            /(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i                     // AMD64
            ], [[ARCHITECTURE, 'amd64']], [

            /(ia32(?=;))/i                                                      // IA32 (quicktime)
            ], [[ARCHITECTURE, util.lowerize]], [

            /((?:i[346]|x)86)[;\)]/i                                            // IA32
            ], [[ARCHITECTURE, 'ia32']], [

            // PocketPC mistakenly identified as PowerPC
            /windows\s(ce|mobile);\sppc;/i
            ], [[ARCHITECTURE, 'arm']], [

            /((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i                           // PowerPC
            ], [[ARCHITECTURE, /ower/, '', util.lowerize]], [

            /(sun4\w)[;\)]/i                                                    // SPARC
            ], [[ARCHITECTURE, 'sparc']], [

            /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+[;l]))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i
                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
            ], [[ARCHITECTURE, util.lowerize]]
        ],

        device : [[

            /\((ipad|playbook);[\w\s\),;-]+(rim|apple)/i                        // iPad/PlayBook
            ], [MODEL, VENDOR, [TYPE, TABLET]], [

            /applecoremedia\/[\w\.]+ \((ipad)/                                  // iPad
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, TABLET]], [

            /(apple\s{0,1}tv)/i                                                 // Apple TV
            ], [[MODEL, 'Apple TV'], [VENDOR, 'Apple'], [TYPE, SMARTTV]], [

            /(archos)\s(gamepad2?)/i,                                           // Archos
            /(hp).+(touchpad)/i,                                                // HP TouchPad
            /(hp).+(tablet)/i,                                                  // HP Tablet
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /\s(nook)[\w\s]+build\/(\w+)/i,                                     // Nook
            /(dell)\s(strea[kpr\s\d]*[\dko])/i                                  // Dell Streak
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(kf[A-z]+)(\sbuild\/|\)).+silk\//i                                 // Kindle Fire HD
            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [
            /(sd|kf)[0349hijorstuw]+(\sbuild\/|\)).+silk\//i                    // Fire Phone
            ], [[MODEL, mapper.str, maps.device.amazon.model], [VENDOR, 'Amazon'], [TYPE, MOBILE]], [
            /android.+aft([\w])(\sbuild\/|\))/i                                 // Fire TV
            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, SMARTTV]], [

            /\((ip[honed|\s\w*]+);.+(apple)/i                                   // iPod/iPhone
            ], [MODEL, VENDOR, [TYPE, MOBILE]], [
            /\((ip[honed|\s\w*]+);/i                                            // iPod/iPhone
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, MOBILE]], [

            /(blackberry)[\s-]?(\w+)/i,                                         // BlackBerry
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i,
                                                                                // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
            /(hp)\s([\w\s]+\w)/i,                                               // HP iPAQ
            /(asus)-?(\w+)/i                                                    // Asus
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /\(bb10;\s(\w+)/i                                                   // BlackBerry 10
            ], [MODEL, [VENDOR, 'BlackBerry'], [TYPE, MOBILE]], [
                                                                                // Asus Tablets
            /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone|p00c)/i
            ], [MODEL, [VENDOR, 'Asus'], [TYPE, TABLET]], [

            /(sony)\s(tablet\s[ps])\sbuild\//i,                                  // Sony
            /(sony)?(?:sgp.+)\sbuild\//i
            ], [[VENDOR, 'Sony'], [MODEL, 'Xperia Tablet'], [TYPE, TABLET]], [
            /android.+\s([c-g]\d{4}|so[-l]\w+)(?=\sbuild\/|\).+chrome\/(?![1-6]{0,1}\d\.))/i
            ], [MODEL, [VENDOR, 'Sony'], [TYPE, MOBILE]], [

            /\s(ouya)\s/i,                                                      // Ouya
            /(nintendo)\s([wids3u]+)/i                                          // Nintendo
            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [

            /android.+;\s(shield)\sbuild/i                                      // Nvidia
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [

            /(playstation\s[34portablevi]+)/i                                   // Playstation
            ], [MODEL, [VENDOR, 'Sony'], [TYPE, CONSOLE]], [

            /(sprint\s(\w+))/i                                                  // Sprint Phones
            ], [[VENDOR, mapper.str, maps.device.sprint.vendor], [MODEL, mapper.str, maps.device.sprint.model], [TYPE, MOBILE]], [

            /(htc)[;_\s-]{1,2}([\w\s]+(?=\)|\sbuild)|\w+)/i,                    // HTC
            /(zte)-(\w*)/i,                                                     // ZTE
            /(alcatel|geeksphone|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i
                                                                                // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

            /(nexus\s9)/i                                                       // HTC Nexus 9
            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [

            /d\/huawei([\w\s-]+)[;\)]/i,                                        // Huawei
            /android.+\s(nexus\s6p|vog-[at]?l\d\d|ane-[at]?l[x\d]\d|eml-a?l\d\da?|lya-[at]?l\d[\dc]|clt-a?l\d\di?)/i

            ], [MODEL, [VENDOR, 'Huawei'], [TYPE, MOBILE]], [

            /android.+(bah2?-a?[lw]\d{2})/i                                     // Huawei MediaPad
            ], [MODEL, [VENDOR, 'Huawei'], [TYPE, TABLET]], [

            /(microsoft);\s(lumia[\s\w]+)/i                                     // Microsoft Lumia
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /[\s\(;](xbox(?:\sone)?)[\s\);]/i                                   // Microsoft Xbox
            ], [MODEL, [VENDOR, 'Microsoft'], [TYPE, CONSOLE]], [
            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
            ], [[MODEL, /\./g, ' '], [VENDOR, 'Microsoft'], [TYPE, MOBILE]], [

                                                                                // Motorola
            /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i,
            /mot[\s-]?(\w*)/i,
            /(XT\d{3,4}) build\//i,
            /(nexus\s6)/i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, MOBILE]], [
            /android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, TABLET]], [

            /hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i            // HbbTV devices
            ], [[VENDOR, util.trim], [MODEL, util.trim], [TYPE, SMARTTV]], [

            /hbbtv.+maple;(\d+)/i
            ], [[MODEL, /^/, 'SmartTV'], [VENDOR, 'Samsung'], [TYPE, SMARTTV]], [

            /\(dtv[\);].+(aquos)/i                                              // Sharp
            ], [MODEL, [VENDOR, 'Sharp'], [TYPE, SMARTTV]], [

            /android.+((sch-i[89]0\d|shw-m380s|SM-P605|SM-P610|SM-P587|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,
            /((SM-T\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, TABLET]], [                  // Samsung
            /smart-tv.+(samsung)/i
            ], [VENDOR, [TYPE, SMARTTV], MODEL], [
            /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,
            /(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i,
            /sec-((sgh\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, MOBILE]], [

            /sie-(\w*)/i                                                        // Siemens
            ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [

            /(maemo|nokia).*(n900|lumia\s\d+)/i,                                // Nokia
            /(nokia)[\s_-]?([\w-]*)/i
            ], [[VENDOR, 'Nokia'], MODEL, [TYPE, MOBILE]], [

            /android[x\d\.\s;]+\s([ab][1-7]\-?[0178a]\d\d?)/i                   // Acer
            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

            /android.+([vl]k\-?\d{3})\s+build/i                                 // LG Tablet
            ], [MODEL, [VENDOR, 'LG'], [TYPE, TABLET]], [
            /android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i                     // LG Tablet
            ], [[VENDOR, 'LG'], MODEL, [TYPE, TABLET]], [
            /linux;\snetcast.+smarttv/i,                                        // LG SmartTV
            /lg\snetcast\.tv-201\d/i
            ], [[VENDOR, 'LG'], MODEL, [TYPE, SMARTTV]], [
            /(nexus\s[45])/i,                                                   // LG
            /lg[e;\s\/-]+(\w*)/i,
            /android.+lg(\-?[\d\w]+)\s+build/i
            ], [MODEL, [VENDOR, 'LG'], [TYPE, MOBILE]], [

            /(lenovo)\s?(s(?:5000|6000)(?:[\w-]+)|tab(?:[\s\w]+))/i             // Lenovo tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [
            /android.+(ideatab[a-z0-9\-\s]+)/i                                  // Lenovo
            ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [
            /(lenovo)[_\s-]?([\w-]+)/i
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /linux;.+((jolla));/i                                               // Jolla
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /((pebble))app\/[\d\.]+\s/i                                         // Pebble
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [

            /android.+;\s(oppo)\s?([\w\s]+)\sbuild/i                            // OPPO
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /crkey/i                                                            // Google Chromecast
            ], [[MODEL, 'Chromecast'], [VENDOR, 'Google'], [TYPE, SMARTTV]], [

            /android.+;\s(glass)\s\d/i                                          // Google Glass
            ], [MODEL, [VENDOR, 'Google'], [TYPE, WEARABLE]], [

            /android.+;\s(pixel c)[\s)]/i                                       // Google Pixel C
            ], [MODEL, [VENDOR, 'Google'], [TYPE, TABLET]], [

            /android.+;\s(pixel( [2-9]a?)?( xl)?)[\s)]/i                        // Google Pixel
            ], [MODEL, [VENDOR, 'Google'], [TYPE, MOBILE]], [

            /android.+;\s(\w+)\s+build\/hm\1/i,                                 // Xiaomi Hongmi 'numeric' models
            /android.+(hm[\s\-_]?note?[\s_]?(?:\d\w)?)\sbuild/i,                // Xiaomi Hongmi
            /android.+(redmi[\s\-_]?(?:note|k)?(?:[\s_]?[\w\s]+))(?:\sbuild|\))/i,      
                                                                                // Xiaomi Redmi
            /android.+(mi[\s\-_]?(?:a\d|one|one[\s_]plus|note lte)?[\s_]?(?:\d?\w?)[\s_]?(?:plus)?)\sbuild/i    
                                                                                // Xiaomi Mi
            ], [[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, MOBILE]], [
            /android.+(mi[\s\-_]?(?:pad)(?:[\s_]?[\w\s]+))(?:\sbuild|\))/i     // Mi Pad tablets
            ],[[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, TABLET]], [
            /android.+;\s(m[1-5]\snote)\sbuild/i                                // Meizu
            ], [MODEL, [VENDOR, 'Meizu'], [TYPE, MOBILE]], [
            /(mz)-([\w-]{2,})/i
            ], [[VENDOR, 'Meizu'], MODEL, [TYPE, MOBILE]], [

            /android.+a000(1)\s+build/i,                                        // OnePlus
            /android.+oneplus\s(a\d{4})[\s)]/i
            ], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [

            /android.+[;\/]\s*(RCT[\d\w]+)\s+build/i                            // RCA Tablets
            ], [MODEL, [VENDOR, 'RCA'], [TYPE, TABLET]], [

            /android.+[;\/\s](Venue[\d\s]{2,7})\s+build/i                       // Dell Venue Tablets
            ], [MODEL, [VENDOR, 'Dell'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i                         // Verizon Tablet
            ], [MODEL, [VENDOR, 'Verizon'], [TYPE, TABLET]], [

            /android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(\S(?:.*\S)?)\s+build/i     // Barnes & Noble Tablet
            ], [[VENDOR, 'Barnes & Noble'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i                           // Barnes & Noble Tablet
            ], [MODEL, [VENDOR, 'NuVision'], [TYPE, TABLET]], [

            /android.+;\s(k88)\sbuild/i                                         // ZTE K Series Tablet
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(gen\d{3})\s+build.*49h/i                         // Swiss GEN Mobile
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, MOBILE]], [

            /android.+[;\/]\s*(zur\d{3})\s+build/i                              // Swiss ZUR Tablet
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, TABLET]], [

            /android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i                         // Zeki Tablets
            ], [MODEL, [VENDOR, 'Zeki'], [TYPE, TABLET]], [

            /(android).+[;\/]\s+([YR]\d{2})\s+build/i,
            /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i        // Dragon Touch Tablet
            ], [[VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i                            // Insignia Tablets
            ], [MODEL, [VENDOR, 'Insignia'], [TYPE, TABLET]], [

            /android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i                    // NextBook Tablets
            ], [MODEL, [VENDOR, 'NextBook'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i
            ], [[VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]], [                    // Voice Xtreme Phones

            /android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i                     // LvTel Phones
            ], [[VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]], [

            /android.+;\s(PH-1)\s/i
            ], [MODEL, [VENDOR, 'Essential'], [TYPE, MOBILE]], [                // Essential PH-1

            /android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i          // Envizen Tablets
            ], [MODEL, [VENDOR, 'Envizen'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i          // Le Pan Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*(Trio[\s\w\-\.]+)\s+build/i                       // MachSpeed Tablets
            ], [MODEL, [VENDOR, 'MachSpeed'], [TYPE, TABLET]], [

            /android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i                // Trinity Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /android.+[;\/]\s*TU_(1491)\s+build/i                               // Rotor Tablets
            ], [MODEL, [VENDOR, 'Rotor'], [TYPE, TABLET]], [

            //android.+(KS(.+))\s+build/i                                        // Amazon Kindle Tablets
            //], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [

            /android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i                      // Gigaset Tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [
                                                                                // Android Phones from Unidentified Vendors
            /android .+?; ([^;]+?)(?: build|\) applewebkit).+? mobile safari/i
            ], [MODEL, [TYPE, MOBILE]], [
                                                                                // Android Tablets from Unidentified Vendors
            /android .+?;\s([^;]+?)(?: build|\) applewebkit).+?(?! mobile) safari/i
            ], [MODEL, [TYPE, TABLET]], [

            /\s(tablet|tab)[;\/]/i,                                             // Unidentifiable Tablet
            /\s(mobile)(?:[;\/]|\ssafari)/i                                     // Unidentifiable Mobile
            ], [[TYPE, util.lowerize], VENDOR, MODEL], [

            /[\s\/\(](smart-?tv)[;\)]/i                                         // SmartTV
            ], [[TYPE, SMARTTV]], [

            /(android[\w\.\s\-]{0,9});.+build/i                                 // Generic Android Device
            ], [MODEL, [VENDOR, 'Generic']], [

            /(phone)/i
            ], [[TYPE, MOBILE]]
        ],

        engine : [[

            /windows.+\sedge\/([\w\.]+)/i                                       // EdgeHTML
            ], [VERSION, [NAME, 'EdgeHTML']], [

            /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i                         // Blink
            ], [VERSION, [NAME, 'Blink']], [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
                                                                                // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna
            /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,                          // KHTML/Tasman/Links
            /(icab)[\/\s]([23]\.[\d\.]+)/i                                      // iCab
            ], [NAME, VERSION], [

            /rv\:([\w\.]{1,9}).+(gecko)/i                                       // Gecko
            ], [VERSION, NAME]
        ],

        os : [[

            // Xbox, consider this before other Windows-based devices
            /(xbox);\s+xbox\s([^\);]+)/i,                                       // Microsoft Xbox (360, One, X, S, Series X, Series S)

            // Windows based
            /microsoft\s(windows)\s(vista|xp)/i                                 // Windows (iTunes)
            ], [NAME, VERSION], [
            /(windows)\snt\s6\.2;\s(arm)/i,                                     // Windows RT
            /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i,                   // Windows Phone
            /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i
            ], [NAME, [VERSION, mapper.str, maps.os.windows.version]], [
            /(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i
            ], [[NAME, 'Windows'], [VERSION, mapper.str, maps.os.windows.version]], [

            // Mobile/Embedded OS
            /\((bb)(10);/i                                                      // BlackBerry 10
            ], [[NAME, 'BlackBerry'], VERSION], [
            /(blackberry)\w*\/?([\w\.]*)/i,                                     // Blackberry
            /(tizen|kaios)[\/\s]([\w\.]+)/i,                                    // Tizen/KaiOS
            /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|sailfish|contiki)[\/\s-]?([\w\.]*)/i
                                                                                // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki/Sailfish OS
            ], [NAME, VERSION], [
            /(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i                  // Symbian
            ], [[NAME, 'Symbian'], VERSION], [
            /\((series40);/i                                                    // Series 40
            ], [NAME], [
            /mozilla.+\(mobile;.+gecko.+firefox/i                               // Firefox OS
            ], [[NAME, 'Firefox OS'], VERSION], [

            // Google Chromecast
            /crkey\/([\d\.]+)/i                                                 // Google Chromecast
            ], [VERSION, [NAME, 'Chromecast']], [

            // Console
            /(nintendo|playstation)\s([wids34portablevu]+)/i,                   // Nintendo/Playstation

            // GNU/Linux based
            /(mint)[\/\s\(]?(\w*)/i,                                            // Mint
            /(mageia|vectorlinux)[;\s]/i,                                       // Mageia/VectorLinux
            /(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i,
                                                                                // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
                                                                                // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
            /(hurd|linux)\s?([\w\.]*)/i,                                        // Hurd/Linux
            /(gnu)\s?([\w\.]*)/i                                                // GNU
            ], [NAME, VERSION], [

            /(cros)\s[\w]+\s([\w\.]+\w)/i                                       // Chromium OS
            ], [[NAME, 'Chromium OS'], VERSION],[

            // Solaris
            /(sunos)\s?([\w\.\d]*)/i                                            // Solaris
            ], [[NAME, 'Solaris'], VERSION], [

            // BSD based
            /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i                    // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
            ], [NAME, VERSION],[

            /(haiku)\s(\w+)/i                                                   // Haiku
            ], [NAME, VERSION],[

            /cfnetwork\/.+darwin/i,
            /ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i             // iOS
            ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [

            /(mac\sos\sx)\s?([\w\s\.]*)/i,
            /(macintosh|mac(?=_powerpc)\s)/i                                    // Mac OS
            ], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [

            // Other
            /((?:open)?solaris)[\/\s-]?([\w\.]*)/i,                             // Solaris
            /(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i,                                // AIX
            /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms|fuchsia)/i,
                                                                                // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS/Fuchsia
            /(unix)\s?([\w\.]*)/i                                               // UNIX
            ], [NAME, VERSION]
        ]
    };


    /////////////////
    // Constructor
    ////////////////
    var UAParser = function (uastring, extensions) {

        if (typeof uastring === 'object') {
            extensions = uastring;
            uastring = undefined$1;
        }

        if (!(this instanceof UAParser)) {
            return new UAParser(uastring, extensions).getResult();
        }

        var ua = uastring || ((window && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : EMPTY);
        var rgxmap = extensions ? util.extend(regexes, extensions) : regexes;

        this.getBrowser = function () {
            var browser = { name: undefined$1, version: undefined$1 };
            mapper.rgx.call(browser, ua, rgxmap.browser);
            browser.major = util.major(browser.version); // deprecated
            return browser;
        };
        this.getCPU = function () {
            var cpu = { architecture: undefined$1 };
            mapper.rgx.call(cpu, ua, rgxmap.cpu);
            return cpu;
        };
        this.getDevice = function () {
            var device = { vendor: undefined$1, model: undefined$1, type: undefined$1 };
            mapper.rgx.call(device, ua, rgxmap.device);
            return device;
        };
        this.getEngine = function () {
            var engine = { name: undefined$1, version: undefined$1 };
            mapper.rgx.call(engine, ua, rgxmap.engine);
            return engine;
        };
        this.getOS = function () {
            var os = { name: undefined$1, version: undefined$1 };
            mapper.rgx.call(os, ua, rgxmap.os);
            return os;
        };
        this.getResult = function () {
            return {
                ua      : this.getUA(),
                browser : this.getBrowser(),
                engine  : this.getEngine(),
                os      : this.getOS(),
                device  : this.getDevice(),
                cpu     : this.getCPU()
            };
        };
        this.getUA = function () {
            return ua;
        };
        this.setUA = function (uastring) {
            ua = uastring;
            return this;
        };
        return this;
    };

    UAParser.VERSION = LIBVERSION;
    UAParser.BROWSER = {
        NAME    : NAME,
        MAJOR   : MAJOR, // deprecated
        VERSION : VERSION
    };
    UAParser.CPU = {
        ARCHITECTURE : ARCHITECTURE
    };
    UAParser.DEVICE = {
        MODEL   : MODEL,
        VENDOR  : VENDOR,
        TYPE    : TYPE,
        CONSOLE : CONSOLE,
        MOBILE  : MOBILE,
        SMARTTV : SMARTTV,
        TABLET  : TABLET,
        WEARABLE: WEARABLE,
        EMBEDDED: EMBEDDED
    };
    UAParser.ENGINE = {
        NAME    : NAME,
        VERSION : VERSION
    };
    UAParser.OS = {
        NAME    : NAME,
        VERSION : VERSION
    };

    ///////////
    // Export
    //////////


    // check js environment
    {
        // nodejs env
        if (module.exports) {
            exports = module.exports = UAParser;
        }
        exports.UAParser = UAParser;
    }

    // jQuery/Zepto specific (optional)
    // Note:
    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
    //   and we should catch that.
    var $ = window && (window.jQuery || window.Zepto);
    if ($ && !$.ua) {
        var parser = new UAParser();
        $.ua = parser.getResult();
        $.ua.get = function () {
            return parser.getUA();
        };
        $.ua.set = function (uastring) {
            parser.setUA(uastring);
            var result = parser.getResult();
            for (var prop in result) {
                $.ua[prop] = result[prop];
            }
        };
    }

})(typeof window === 'object' ? window : commonjsGlobal);
});

var BrowserCompatibility;

(function (BrowserCompatibility) {

  (function (Feature) {
    /**
     * [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) -
     * [current support?](https://caniuse.com/#feat=blobbuilder)
     */
    Feature["BLOB"] = "blob";
    /**
     * [MediaDevices/getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) -
     * [current support?](https://caniuse.com/#feat=stream)
     */

    Feature["MEDIA_DEVICES"] = "mediaDevices";
    /**
     * [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) -
     * [current support?](https://caniuse.com/#feat=offscreencanvas)
     */

    Feature["OFFSCREEN_CANVAS"] = "offscreenCanvas"; // tslint:disable: max-line-length

    /**
     * [Http/Https protocol](https://wiki.developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Scheme_or_protocol)
     */

    Feature["HTTP_PROTOCOL"] = "httpProtocol";
    /**
     * [Secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts)
     */

    Feature["SECURE_CONTEXT"] = "secureContext";
    /**
     * [URL/createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL) -
     * [current support?](https://caniuse.com/#feat=bloburls)
     */

    Feature["URL_OBJECT"] = "urlObject";
    /**
     * [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) -
     * [current support?](https://caniuse.com/#feat=webworkers)
     */

    Feature["WEB_WORKERS"] = "webWorkers";
    /**
     * [WebAssembly](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/WebAssembly) -
     * [current support?](https://caniuse.com/#feat=wasm)
     */

    Feature["WEB_ASSEMBLY"] = "webAssembly";
    /**
     * WebAssembly without memory corruption (specific iOS version 11.2.2/11.2.5/11.2.6 bug)
     */

    Feature["WEB_ASSEMBLY_ERROR_FREE"] = "webAssemblyErrorFree";
    /**
     * [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) -
     * [current support?](https://caniuse.com/#feat=webgl)
     */

    Feature["WEBGL"] = "webgl";
  })(BrowserCompatibility.Feature || (BrowserCompatibility.Feature = {}));
})(BrowserCompatibility || (BrowserCompatibility = {}));

var BrowserHelper;

(function (BrowserHelper) {
  /**
   * @hidden
   */
  BrowserHelper.userAgentInfo = new uaParser(navigator.userAgent);
  /**
   * @hidden
   */

  BrowserHelper.canvas = document.createElement("canvas"); // For some reason, export is needed!

  /**
   * @hidden
   *
   * @returns Whether the device is a desktop/laptop for sure.
   */

  function isDesktopDevice() {
    if ("orientation" in window) {
      // Only mobile browsers have this (deprecated but still available) property
      return false;
    } else {
      var _window$matchMedia, _window;

      // Query for no "coarse" pointing device available (finger, touchscreen)
      var query = "(any-pointer: coarse)"; // Spaces matter!

      var mediaQueryList = (_window$matchMedia = (_window = window).matchMedia) === null || _window$matchMedia === void 0 ? void 0 : _window$matchMedia.call(_window, query); // If the device doesn't have a touchscreen, it's a computer

      if (navigator.maxTouchPoints === 0 || (mediaQueryList === null || mediaQueryList === void 0 ? void 0 : mediaQueryList.media) === query && (mediaQueryList === null || mediaQueryList === void 0 ? void 0 : mediaQueryList.matches) === false) {
        return true;
      } else {
        return false;
      }
    }
  }

  BrowserHelper.isDesktopDevice = isDesktopDevice;
  /**
   * @returns The built [[BrowserCompatibility]] object representing the current OS/Browser's support for features.
   */

  function checkBrowserCompatibility() {
    function objectHasPropertyWithType(object, propertyNames, propertyType) {
      // tslint:disable-next-line:no-any
      var objectProperty = object[propertyNames[0]];

      if (objectProperty == null) {
        return false;
      }

      if (propertyNames.length === 1) {
        return typeof objectProperty === propertyType;
      } else {
        return (typeof objectProperty === "function" || typeof objectProperty === "object") && objectHasPropertyWithType(objectProperty, propertyNames.slice(1), propertyType);
      }
    }

    function isBrokenWebAssemblyOS(os) {
      return os.name === "iOS" && os.version != null && ["11.2.2", "11.2.5", "11.2.6"].includes(os.version);
    }

    var fullSupport = true;
    var scannerSupport = true;
    var missingFeatures = [];

    if (!location.protocol.startsWith("http")) {
      missingFeatures.push(BrowserCompatibility.Feature.HTTP_PROTOCOL);
      fullSupport = scannerSupport = false;
    }

    if (objectHasPropertyWithType(window, ["isSecureContext"], "boolean") && window.isSecureContext === false) {
      missingFeatures.push(BrowserCompatibility.Feature.SECURE_CONTEXT); // Don't disable full support in case browser is set to allow camera video streaming access in insecure contexts
    }

    if (!objectHasPropertyWithType(navigator, ["mediaDevices", "getUserMedia"], "function") && !objectHasPropertyWithType(navigator, ["enumerateDevices"], "function") && !objectHasPropertyWithType(window, ["MediaStreamTrack", "getSources"], "function")) {
      missingFeatures.push(BrowserCompatibility.Feature.MEDIA_DEVICES);
      fullSupport = false;
    }

    if (!objectHasPropertyWithType(window, ["Worker"], "function")) {
      missingFeatures.push(BrowserCompatibility.Feature.WEB_WORKERS);
      fullSupport = scannerSupport = false;
    }

    if (!objectHasPropertyWithType(window, ["WebAssembly"], "object")) {
      missingFeatures.push(BrowserCompatibility.Feature.WEB_ASSEMBLY);
      fullSupport = scannerSupport = false;
    }

    if (!objectHasPropertyWithType(window, ["Blob"], "function")) {
      missingFeatures.push(BrowserCompatibility.Feature.BLOB);
      fullSupport = scannerSupport = false;
    }

    if (!objectHasPropertyWithType(window, ["URL", "createObjectURL"], "function")) {
      missingFeatures.push(BrowserCompatibility.Feature.URL_OBJECT);
      fullSupport = scannerSupport = false;
    }

    if (!objectHasPropertyWithType(window, ["OffscreenCanvas"], "function")) {
      missingFeatures.push(BrowserCompatibility.Feature.OFFSCREEN_CANVAS);
    }

    try {
      if (!objectHasPropertyWithType(window, ["WebGLRenderingContext"], "function") || BrowserHelper.canvas.getContext("webgl") == null && BrowserHelper.canvas.getContext("experimental-webgl") == null) {
        throw new Error();
      }
    } catch (_unused) {
      missingFeatures.push(BrowserCompatibility.Feature.WEBGL);
    }

    var userAgentOS = BrowserHelper.userAgentInfo.getOS();

    if (isBrokenWebAssemblyOS(userAgentOS)) {
      missingFeatures.push(BrowserCompatibility.Feature.WEB_ASSEMBLY_ERROR_FREE);
      fullSupport = scannerSupport = false;
    }

    return {
      fullSupport,
      scannerSupport,
      missingFeatures
    };
  }

  BrowserHelper.checkBrowserCompatibility = checkBrowserCompatibility;
  /**
   * @hidden
   *
   * Get a device id for the current browser.
   *
   * When available it's retrieved from localStorage, as fallback from cookies (used by older library versions),
   * when not available it's randomly generated and stored in localStorage to be retrieved by later calls and returned.
   *
   * @returns The device id for the current browser.
   */

  function getDeviceId() {
    var devideIdKey = "scandit-device-id";
    var deviceId = localStorage.getItem(devideIdKey);

    if (deviceId != null && deviceId !== "") {
      return deviceId;
    }

    deviceId = js_cookie.get(devideIdKey);

    if (deviceId != null && deviceId !== "") {
      localStorage.setItem(devideIdKey, deviceId);
      return deviceId;
    }

    var randomDeviceIdBytes = new Uint8Array(20);
    crypto.getRandomValues(randomDeviceIdBytes);
    deviceId = from$1(randomDeviceIdBytes).map(function (byteNumber) {
      var byteHex = byteNumber.toString(16);
      return byteHex.length === 1 ?
      /* istanbul ignore next */
      "0".concat(byteHex) : byteHex;
    }).join("");
    localStorage.setItem(devideIdKey, deviceId);
    return deviceId;
  }

  BrowserHelper.getDeviceId = getDeviceId;
  /**
   * @hidden
   *
   * Check if a given object is a valid HTMLElement
   *
   * @param object The object to check.
   * @returns Whether the given object is a valid HTMLElement.
   */
  // tslint:disable-next-line:no-any

  function isValidHTMLElement(object) {
    return object instanceof HTMLElement || object != null && typeof object === "object" && typeof object.tagName === "string";
  }

  BrowserHelper.isValidHTMLElement = isValidHTMLElement;
})(BrowserHelper || (BrowserHelper = {}));

/**
 * @hidden
 *
 * @returns Engine
 */
// tslint:disable-next-line:max-func-body-length
function engine() {
  const writableDataPathPreload = "/scandit_sync_folder_preload";
  const writableDataPathStandard = "/scandit_sync_folder";
  const scanQueue = [];
  const parseQueue = [];
  const gpuAccelerationAvailable = typeof self.OffscreenCanvas === "function";
  let originalFSSyncfs;
  let imageBufferPointer;
  let imageBufferSize;
  let preloading;
  let writableDataPath;
  let delayedRegistration;
  let licenseKey;
  let scanSettings;
  let imageSettings;
  let cameraProperties;
  let blurryRecognitionAvailable = false;
  let workSubmitted = false;
  let loadingInProgress = false;
  let fileSystemSynced = false;
  let runtimeLoaded = false;
  let wasmReady = false;
  let scannerSettingsReady = false;
  let scannerImageSettingsReady = false;
  let contextAvailable = false;
  let fsSyncPromise = Promise.resolve();
  let fsSyncInProgress = false;
  let fsSyncScheduled = false; // Public
  // Promise is used only during testing

  function loadLibrary(deviceId, libraryLocation, locationPath, preload, newDelayedRegistration, newLicenseKey, deviceModelName) {
    function reportLoadSuccess() {
      postMessage(["library-loaded"]);
      createContext(newDelayedRegistration, newLicenseKey);
    }

    function start() {
      if (!wasmReady && fileSystemSynced && runtimeLoaded) {
        loadingInProgress = false;
        Module.callMain();
        wasmReady = true;
        reportLoadSuccess();

        if (!newDelayedRegistration) {
          workOnScanQueue();
          workOnParseQueue();
        }
      }
    }

    if (loadingInProgress) {
      return Promise.resolve();
    }

    if (wasmReady) {
      reportLoadSuccess();
      return Promise.resolve();
    }

    loadingInProgress = true;

    const _getLibraryLocationUR = getLibraryLocationURIs(libraryLocation),
          jsURI = _getLibraryLocationUR.jsURI,
          wasmURI = _getLibraryLocationUR.wasmURI;

    preloading = preload;
    writableDataPath = preload ? writableDataPathPreload : writableDataPathStandard;
    self.window = self.document = self; // Fix some Emscripten quirks

    self.path = locationPath; // Used by the Scandit SDK Engine library

    self.deviceModelName = deviceModelName; // Used by the Scandit SDK Engine library

    Module = {
      arguments: [deviceId],
      canvas: gpuAccelerationAvailable ? new self.OffscreenCanvas(32, 32) :
      /* istanbul ignore next */
      undefined,
      instantiateWasm: function instantiateWasm(importObject, successCallback) {
        var _self$wasmJSVersion;

        // wasmJSVersion is globally defined inside scandit-engine-sdk.min.js
        const wasmJSVersion = (_self$wasmJSVersion = self.wasmJSVersion) !== null && _self$wasmJSVersion !== void 0 ? _self$wasmJSVersion : "undefined"; // istanbul ignore if

        if (wasmJSVersion !== "5.5.3") {
          console.error("The Scandit SDK Engine library JS file found at ".concat(jsURI, " seems invalid: ") + "expected version doesn't match (received: ".concat(wasmJSVersion, ", expected: ", "5.5.3", "). ") + "Please ensure the correct Scandit SDK Engine file (with correct version) is retrieved.");
        }

        if (typeof self.WebAssembly.instantiateStreaming === "function") {
          instantiateWebAssemblyStreaming(importObject, wasmURI, successCallback);
        } else {
          instantiateWebAssembly(importObject, wasmURI, successCallback);
        }

        return {};
      },
      noInitialRun: true,
      preRun: [function () {
        return setupFS().catch(function (error) {
          console.debug("No IndexedDB support, some data will not be persisted:", error);
        }).then(function () {
          fileSystemSynced = true;
          start();
        });
      }],
      onRuntimeInitialized: function onRuntimeInitialized() {
        runtimeLoaded = true;
        start();
      }
    };

    function tryImportScripts() {
      try {
        var _importScripts;

        return (_importScripts = importScripts(jsURI)) !== null && _importScripts !== void 0 ? _importScripts : Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return retryWithExponentialBackoff(tryImportScripts, 250, 4000, function (error) {
      console.warn(error);
      console.warn("Couldn't retrieve Scandit SDK Engine library at ".concat(jsURI, ", retrying..."));
    }).catch(function (error) {
      console.error(error);
      console.error("Couldn't retrieve Scandit SDK Engine library at ".concat(jsURI, ", did you configure the path for it correctly?"));
      return Promise.resolve(error); // Promise is used only during testing
    });
  } // tslint:disable-next-line: bool-param-default


  function createContext(newDelayedRegistration, newLicenseKey) {
    function completeCreateContext() {
      postMessage(["context-created", {
        hiddenScanditLogoAllowed: Module._can_hide_logo() === 1
      }]);
    }

    if (contextAvailable) {
      return completeCreateContext();
    }

    if (newDelayedRegistration != null) {
      delayedRegistration = newDelayedRegistration;
    }

    if (newLicenseKey != null) {
      licenseKey = newLicenseKey;
    }

    if (!wasmReady || delayedRegistration == null || !workSubmitted && !delayedRegistration || licenseKey == null) {
      return;
    }

    const licenseKeyLength = lengthBytesUTF8(licenseKey) + 1;

    const licenseKeyPointer = Module._malloc(licenseKeyLength);

    stringToUTF8(licenseKey, licenseKeyPointer, licenseKeyLength);
    const writableDataPathLength = lengthBytesUTF8(writableDataPath) + 1;

    const writableDataPathPointer = Module._malloc(writableDataPathLength);

    stringToUTF8(writableDataPath, writableDataPathPointer, writableDataPathLength);

    Module._create_context(licenseKeyPointer, writableDataPathPointer, delayedRegistration, false);

    Module._free(licenseKeyPointer);

    Module._free(writableDataPathPointer);

    contextAvailable = true;
    reportCameraProperties();
    completeCreateContext();
  }

  function setScanSettings(newScanSettings, newBlurryRecognitionAvailable, blurryRecognitionRequiresUpdate) {
    function completeSetScanSettings() {
      scanSettings = newScanSettings;
      blurryRecognitionAvailable = newBlurryRecognitionAvailable;
      applyScanSettings();
      workOnScanQueue();
    }

    scanSettings = undefined;
    scannerSettingsReady = false;

    if (newBlurryRecognitionAvailable && blurryRecognitionRequiresUpdate) {
      syncFS(true, false, true).then(completeSetScanSettings).catch(completeSetScanSettings);
    } else {
      completeSetScanSettings();
    }
  }

  function setImageSettings(newImageSettings) {
    imageSettings = newImageSettings;
    applyImageSettings();
    workOnScanQueue();
  }

  function augmentErrorInformation(error) {
    if (error.errorCode === 260) {
      var _location$href;

      let hostname; // istanbul ignore if

      if (((_location$href = location.href) === null || _location$href === void 0 ? void 0 : _location$href.indexOf("blob:null/")) === 0) {
        hostname = "localhost";
      } else {
        hostname = new URL(location.pathname != null && location.pathname !== "" && !location.pathname.startsWith("/") ?
        /* istanbul ignore next */
        location.pathname : location.origin).hostname;
      } // istanbul ignore next


      if (hostname[0].startsWith("[") && hostname.endsWith("]")) {
        hostname = hostname.slice(1, -1);
      }

      error.errorMessage = error.errorMessage.replace("domain name", "domain name (".concat(hostname, ")"));
    } // License Key related error codes from 6 to 25 and 260


    if ([6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 260].includes(error.errorCode) && licenseKey != null && licenseKey.length > 0) {
      error.errorMessage += " License Key: ".concat(licenseKey.slice(0, 15), "...");
    }
  }

  function processScanWorkUnit(scanWorkUnit) {
    if (scanWorkUnit.highQualitySingleFrameMode) {
      applyScanSettings(true);
    }

    const resultData = scanImage(scanWorkUnit.data);

    if (scanWorkUnit.highQualitySingleFrameMode) {
      applyScanSettings(false);
    }

    const result = JSON.parse(resultData);

    if (result.error != null) {
      augmentErrorInformation(result.error);
      postMessage(["work-error", {
        requestId: scanWorkUnit.requestId,
        error: result.error
      }, scanWorkUnit.data], [scanWorkUnit.data.buffer]);
    } else {
      // istanbul ignore else
      if (result.scanResult != null) {
        postMessage(["work-result", {
          requestId: scanWorkUnit.requestId,
          result
        }, scanWorkUnit.data], [scanWorkUnit.data.buffer]);
      }
    }
  }

  function workOnScanQueue() {
    if (!wasmReady || scanQueue.length === 0) {
      return;
    } // Initialization for first submitted work unit


    if (!contextAvailable) {
      createContext();
    }

    if (!scannerSettingsReady) {
      applyScanSettings();
    }

    if (!scannerImageSettingsReady) {
      applyImageSettings();
    }

    if (!contextAvailable || !scannerSettingsReady || !scannerImageSettingsReady) {
      return;
    }

    while (scanQueue.length !== 0) {
      if (scanQueue[0].highQualitySingleFrameMode && !blurryRecognitionAvailable) {
        break;
      }

      processScanWorkUnit(scanQueue.shift());
    }
  }

  function processParseWorkUnit(parseWorkUnit) {
    const resultData = parse(parseWorkUnit.dataFormat, parseWorkUnit.data, parseWorkUnit.options);
    const result = JSON.parse(resultData);

    if (result.error != null) {
      augmentErrorInformation(result.error);
      postMessage(["parse-error", {
        requestId: parseWorkUnit.requestId,
        error: result.error
      }]);
    } else {
      // istanbul ignore else
      if (result.result != null) {
        postMessage(["parse-result", {
          requestId: parseWorkUnit.requestId,
          result: result.result
        }]);
      }
    }
  }

  function workOnParseQueue() {
    if (!wasmReady || parseQueue.length === 0) {
      return;
    } // Initialization for first submitted work unit


    if (!contextAvailable) {
      createContext();

      if (!contextAvailable) {
        return;
      }
    }

    while (parseQueue.length !== 0) {
      processParseWorkUnit(parseQueue.shift());
    }
  }

  function addScanWorkUnit(scanWorkUnit) {
    workSubmitted = true;
    scanQueue.push(scanWorkUnit);
    workOnScanQueue();
  }

  function addParseWorkUnit(parseWorkUnit) {
    workSubmitted = true;
    parseQueue.push(parseWorkUnit);
    workOnParseQueue();
  }

  function clearSession() {
    if (scannerSettingsReady) {
      Module._scanner_session_clear();
    }
  }

  function createBlurryTable(symbology) {
    function reportResult() {
      postMessage(["create-blurry-table-result", symbology]);
    }

    if (!wasmReady || !contextAvailable) {
      return;
    }

    const symbologyLength = lengthBytesUTF8(symbology) + 1;

    const symbologyPointer = Module._malloc(symbologyLength);

    stringToUTF8(symbology, symbologyPointer, symbologyLength);

    Module._create_blurry_table(symbologyPointer);

    Module._free(symbologyPointer); // FS.syncfs is called by the engine if needed: the current promise is the one to wait for


    fsSyncPromise.then(reportResult).catch( // istanbul ignore next
    reportResult);
  }

  function setCameraProperties(cameraType, autofocus) {
    cameraProperties = {
      cameraType,
      autofocus
    };

    if (!wasmReady || !contextAvailable) {
      return;
    }

    reportCameraProperties();
  }

  function reset() {
    clearSession();
    scanQueue.length = 0;
    parseQueue.length = 0;
    scanSettings = undefined;
    imageSettings = undefined;
    workSubmitted = false;
    scannerSettingsReady = false;
    scannerImageSettingsReady = false;
  } // Private


  function retryWithExponentialBackoff(handler, backoffMs, maxBackoffMs, singleTryRejectionCallback) {
    return new Promise(function (resolve, reject) {
      handler().then(resolve).catch(function (error) {
        const newBackoffMs = backoffMs * 2;

        if (newBackoffMs > maxBackoffMs) {
          return reject(error);
        }

        singleTryRejectionCallback(error);
        setTimeout(function () {
          retryWithExponentialBackoff(handler, newBackoffMs, maxBackoffMs, singleTryRejectionCallback).then(resolve).catch(reject);
        }, backoffMs);
      });
    });
  }

  function getLibraryLocationURIs(libraryLocation) {
    let cdnURI = false;

    if (/^https?:\/\/([^\/.]*\.)*cdn.jsdelivr.net\//.test(libraryLocation)) {
      libraryLocation = "https://cdn.jsdelivr.net/npm/scandit-sdk@5.5.3/build/";
      cdnURI = true;
    } else if (/^https?:\/\/([^\/.]*\.)*unpkg.com\//.test(libraryLocation)) {
      libraryLocation = "https://unpkg.com/scandit-sdk@5.5.3/build/";
      cdnURI = true;
    }

    if (cdnURI) {
      return {
        jsURI: "".concat(libraryLocation, "scandit-engine-sdk.min.js"),
        wasmURI: "".concat(libraryLocation, "scandit-engine-sdk.wasm")
      };
    }

    return {
      jsURI: "".concat(libraryLocation, "scandit-engine-sdk.min.js?v=5.5.3"),
      wasmURI: "".concat(libraryLocation, "scandit-engine-sdk.wasm?v=5.5.3")
    };
  }

  function arrayBufferToHexString(arrayBuffer) {
    return Array.from(new Uint8Array(arrayBuffer)).map(function (byteNumber) {
      const byteHex = byteNumber.toString(16);
      return byteHex.length === 1 ?
      /* istanbul ignore next */
      "0".concat(byteHex) : byteHex;
    }).join("");
  }

  function applyScanSettings() {
    let highQualitySingleFrameMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (!wasmReady || !contextAvailable || !workSubmitted || scanSettings == null) {
      return;
    }

    scannerSettingsReady = false;
    const parsedSettings = JSON.parse(scanSettings);
    const scanSettingsLength = lengthBytesUTF8(scanSettings) + 1;

    const scanSettingsPointer = Module._malloc(scanSettingsLength);

    stringToUTF8(scanSettings, scanSettingsPointer, scanSettingsLength);

    const resultPointer = Module._scanner_settings_new_from_json(scanSettingsPointer, parsedSettings.blurryRecognition && blurryRecognitionAvailable, parsedSettings.matrixScanEnabled, highQualitySingleFrameMode, gpuAccelerationAvailable && parsedSettings.gpuAcceleration);

    Module._free(scanSettingsPointer);

    const result = UTF8ToString(resultPointer);

    if (result !== "") {
      scannerSettingsReady = true;
      console.debug("External Scandit Engine scan settings:", JSON.parse(result));
    }
  }

  function applyImageSettings() {
    if (!wasmReady || !contextAvailable || !workSubmitted || imageSettings == null) {
      return;
    }

    scannerImageSettingsReady = false;
    let channels; // TODO: For now it's not possible to use imported variables as the worker doesn't have access at runtime

    if (imageSettings.format.valueOf() === 1) {
      // RGB_8U
      channels = 3;
    } else if (imageSettings.format.valueOf() === 2) {
      // RGBA_8U
      channels = 4;
    } else {
      // GRAY_8U
      channels = 1;
    }

    Module._scanner_image_settings_new(imageSettings.width, imageSettings.height, channels);

    if (imageBufferPointer != null) {
      Module._free(imageBufferPointer);
    }

    imageBufferSize = imageSettings.width * imageSettings.height * channels;
    imageBufferPointer = Module._malloc(imageBufferSize);
    scannerImageSettingsReady = true;
  }

  function reportCameraProperties() {
    if (!wasmReady || !contextAvailable || cameraProperties == null) {
      return;
    } // TODO: For now it's not possible to use imported variables as the worker doesn't have access at runtime


    Module._report_camera_properties(cameraProperties.cameraType === "front", cameraProperties.autofocus);
  }

  function scanImage(imageData) {
    if (imageData.byteLength !== imageBufferSize) {
      // This could happen in unexpected situations and should be temporary
      return JSON.stringify({
        scanResult: []
      });
    }

    Module.HEAPU8.set(imageData, imageBufferPointer);
    return UTF8ToString(Module._scanner_scan(imageBufferPointer));
  }

  function parse(dataFormat, data, options) {
    const dataLength = typeof data === "string" ? lengthBytesUTF8(data) + 1 : data.byteLength;

    const dataPointer = Module._malloc(dataLength);

    if (typeof data === "string") {
      stringToUTF8(data, dataPointer, dataLength);
    } else {
      Module.HEAPU8.set(data, dataPointer);
    }

    const optionsLength = lengthBytesUTF8(options) + 1;

    const optionsPointer = Module._malloc(optionsLength);

    stringToUTF8(options, optionsPointer, optionsLength);

    const resultPointer = Module._parser_parse_string(dataFormat.valueOf(), dataPointer, dataLength - 1, optionsPointer);

    Module._free(dataPointer);

    Module._free(optionsPointer);

    return UTF8ToString(resultPointer);
  }

  function verifiedWasmFetch(wasmURI, awaitFullResponse) {
    function verifyResponseData(responseData) {
      var _crypto, _crypto$subtle;

      // istanbul ignore else
      if (typeof ((_crypto = crypto) === null || _crypto === void 0 ? void 0 : (_crypto$subtle = _crypto.subtle) === null || _crypto$subtle === void 0 ? void 0 : _crypto$subtle.digest) === "function") {
        crypto.subtle.digest("SHA-256", responseData).then(function (hash) {
          const hashString = arrayBufferToHexString(hash); // istanbul ignore if

          if (hashString !== "967ea4904a0e287339e38a58294da18ecd55c306268167c610a2ddba2a79a943") {
            console.error("The Scandit SDK Engine library WASM file found at ".concat(wasmURI, " seems invalid: ") + "expected file hash doesn't match (received: ".concat(hashString, ", ") + "expected: ".concat("967ea4904a0e287339e38a58294da18ecd55c306268167c610a2ddba2a79a943", "). ") + "Please ensure the correct Scandit SDK Engine file (with correct version) is retrieved.");
          }
        }).catch(
        /* istanbul ignore next */
        function () {// Ignored
        });
      } else {
        console.warn("Insecure context (see https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts): " + "The hash of the Scandit SDK Engine library WASM file found at ".concat(wasmURI, " could not be verified"));
      }
    }

    function tryFetch() {
      return new Promise(function (resolve, reject) {
        fetch(wasmURI).then(function (response) {
          // istanbul ignore else
          if (response.ok) {
            response.clone().arrayBuffer().then(function (responseData) {
              if (awaitFullResponse) {
                resolve(response);
              }

              verifyResponseData(responseData);
            }).catch( // istanbul ignore next
            function (error) {
              if (awaitFullResponse) {
                reject(error);
              }
            });

            if (!awaitFullResponse) {
              resolve(response);
            }
          } else {
            reject(new Error("HTTP status code is not ok"));
          }
        }).catch(function (error) {
          reject(error);
        });
      });
    }

    return retryWithExponentialBackoff(tryFetch, 250, 4000, function (error) {
      console.warn(error);
      console.warn("Couldn't retrieve Scandit SDK Engine library at ".concat(wasmURI, ", retrying..."));
    }).catch(function (error) {
      console.error(error);
      console.error("Couldn't retrieve/instantiate Scandit SDK Engine library at ".concat(wasmURI, ", ") + "did you configure the path for it correctly?");
      return Promise.reject(error);
    });
  }

  function instantiateWebAssembly(importObject, wasmURI, successCallback) {
    verifiedWasmFetch(wasmURI, true).then(function (response) {
      return response.arrayBuffer();
    }).then(function (bytes) {
      return self.WebAssembly.instantiate(bytes, importObject).then(function (results) {
        successCallback(results.instance);
      }).catch(function (error) {
        console.error(error);
        console.error("Couldn't instantiate Scandit SDK Engine library at ".concat(wasmURI, ", ") + "did you configure the path for it correctly?");
      });
    }).catch(
    /* istanbul ignore next */
    function () {// Ignored
    });
  }

  function instantiateWebAssemblyStreaming(importObject, wasmURI, successCallback) {
    verifiedWasmFetch(wasmURI, false).then(function (response) {
      self.WebAssembly.instantiateStreaming(response, importObject).then(function (results) {
        successCallback(results.instance);
      }).catch(function (error) {
        console.warn(error);
        console.warn("WebAssembly streaming compile failed. " + "Falling back to ArrayBuffer instantiation (this will make things slower)");
        instantiateWebAssembly(importObject, wasmURI, successCallback);
      });
    }).catch(
    /* istanbul ignore next */
    function () {// Ignored
    });
  }

  function syncFSMergePreloadedData() {
    const fsObjectStoreName = "FILE_DATA";
    let resolveCallback;
    let openDbSourceRequest;
    let openDbTargetRequest;

    function handleError() {
      var _openDbSourceRequest, _openDbSourceRequest$, _openDbTargetRequest, _openDbTargetRequest$;

      (_openDbSourceRequest = openDbSourceRequest) === null || _openDbSourceRequest === void 0 ? void 0 : (_openDbSourceRequest$ = _openDbSourceRequest.result) === null || _openDbSourceRequest$ === void 0 ? void 0 : _openDbSourceRequest$.close();
      (_openDbTargetRequest = openDbTargetRequest) === null || _openDbTargetRequest === void 0 ? void 0 : (_openDbTargetRequest$ = _openDbTargetRequest.result) === null || _openDbTargetRequest$ === void 0 ? void 0 : _openDbTargetRequest$.close(); // this.error

      resolveCallback(0);
    }

    function performMerge() {
      try {
        const objects = [];
        const sourceTransaction = openDbSourceRequest.result.transaction(fsObjectStoreName, "readonly");
        sourceTransaction.onerror = handleError;
        const cursorRequest = sourceTransaction.objectStore(fsObjectStoreName).openCursor();

        cursorRequest.onsuccess = function () {
          const cursor = cursorRequest.result;

          if (cursor == null) {
            try {
              let mergedObjectsCount = 0;
              const targetTransaction = openDbTargetRequest.result.transaction(fsObjectStoreName, "readwrite");
              const targetObjectStore = targetTransaction.objectStore(fsObjectStoreName);
              targetTransaction.onerror = handleError;

              targetTransaction.oncomplete = function () {
                openDbSourceRequest.result.close();
                openDbTargetRequest.result.close();
                return resolveCallback(mergedObjectsCount);
              };

              for (const object of objects) {
                const countRequest = targetObjectStore.count(object.primaryKey);

                countRequest.onsuccess = function () {
                  if (countRequest.result === 0) {
                    ++mergedObjectsCount;
                    targetObjectStore.add(object.value, object.primaryKey);
                  }
                };
              }
            } catch (error) {
              // istanbul ignore next
              handleError.call({
                error
              });
            }
          } else {
            objects.push({
              value: cursor.value,
              primaryKey: cursor.primaryKey.toString().replace("".concat(writableDataPathPreload, "/"), "".concat(writableDataPathStandard, "/"))
            });
            cursor.continue();
          }
        };

        cursorRequest.onerror = handleError;
      } catch (error) {
        // istanbul ignore next
        handleError.call({
          error
        });
      }
    }

    return new Promise(function (resolve) {
      resolveCallback = resolve;
      openDbSourceRequest = indexedDB.open(writableDataPathPreload);

      openDbSourceRequest.onupgradeneeded = function () {
        try {
          openDbSourceRequest.result.createObjectStore(fsObjectStoreName);
        } catch (error) {// Ignored
        }
      };

      openDbSourceRequest.onsuccess = function () {
        if (!Array.from(openDbSourceRequest.result.objectStoreNames).includes(fsObjectStoreName)) {
          return resolve(0);
        }

        openDbTargetRequest = indexedDB.open(writableDataPathStandard);

        openDbTargetRequest.onupgradeneeded = function () {
          try {
            openDbTargetRequest.result.createObjectStore(fsObjectStoreName);
          } catch (error) {// Ignored
          }
        };

        openDbTargetRequest.onsuccess = function () {
          performMerge();
        };

        openDbTargetRequest.onblocked = openDbTargetRequest.onerror = handleError;
      };

      openDbSourceRequest.onblocked = openDbSourceRequest.onerror = handleError;
    });
  }

  function syncFSPromisified(populate, initialPopulation) {
    // istanbul ignore if
    if (originalFSSyncfs == null) {
      return Promise.resolve();
    }

    fsSyncInProgress = true;
    return new Promise(function (resolve, reject) {
      // Merge with data coming from preloading workers if needed
      (!preloading && populate ? syncFSMergePreloadedData() : Promise.resolve(0)).then(function (mergedObjects) {
        if (!preloading && populate && !initialPopulation && mergedObjects === 0) {
          fsSyncInProgress = false;
          return resolve();
        } // tslint:disable-next-line: no-non-null-assertion


        originalFSSyncfs(populate, function (error) {
          fsSyncInProgress = false; // istanbul ignore if

          if (error != null) {
            return reject(error);
          }

          resolve();
        });
      }).catch(reject);
    });
  }

  function syncFS(populate) {
    let initialPopulation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let forceScheduling = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (!fsSyncScheduled || forceScheduling) {
      if (fsSyncInProgress) {
        fsSyncScheduled = true;
        fsSyncPromise = fsSyncPromise.then(function () {
          fsSyncScheduled = false;
          return syncFSPromisified(populate, initialPopulation);
        });
      } else {
        fsSyncPromise = syncFSPromisified(populate, initialPopulation);
      }
    }

    return fsSyncPromise;
  }

  function setupFS() {
    // FS.syncfs is also called by the engine on file storage, ensure everything is coordinated nicely
    originalFSSyncfs = FS.syncfs;

    FS.syncfs = function (populate, callback) {
      const originalCallback = callback;

      callback = function callback(error) {
        originalCallback(error);
      };

      syncFS(populate).then(callback).catch(callback);
    };

    try {
      FS.mkdir(writableDataPath);
    } catch (error) {
      // istanbul ignore next
      if (error.code !== "EEXIST") {
        originalFSSyncfs = undefined;
        return Promise.reject(error);
      }
    }

    FS.mount(IDBFS, {}, writableDataPath);
    return syncFS(true, true);
  }

  return {
    loadLibrary,
    setScanSettings,
    setImageSettings,
    workOnScanQueue,
    workOnParseQueue,
    addScanWorkUnit,
    addParseWorkUnit,
    clearSession,
    createBlurryTable,
    setCameraProperties,
    reset
  };
} // istanbul ignore next

function engineWorkerFunction() {
  const engineInstance = engine();

  onmessage = function onmessage(e) {
    // Creating context triggers license key verification and activation: delay until first frame processed
    const data = e.data;

    switch (data.type) {
      case "load-library":
        // tslint:disable-next-line: no-floating-promises
        engineInstance.loadLibrary(data.deviceId, data.libraryLocation, data.path, data.preload, data.delayedRegistration, data.licenseKey, data.deviceModelName);
        break;

      case "scan-settings":
        engineInstance.setScanSettings(data.settings, data.blurryRecognitionAvailable, data.blurryRecognitionRequiresUpdate);
        break;

      case "image-settings":
        engineInstance.setImageSettings(data.imageSettings);
        break;

      case "scan-image":
        engineInstance.addScanWorkUnit({
          requestId: data.requestId,
          data: data.data,
          highQualitySingleFrameMode: data.highQualitySingleFrameMode
        });
        break;

      case "parse":
        engineInstance.addParseWorkUnit({
          requestId: data.requestId,
          dataFormat: data.dataFormat,
          data: data.data,
          options: data.options
        });
        break;

      case "clear-session":
        engineInstance.clearSession();
        break;

      case "create-blurry-table":
        engineInstance.createBlurryTable(data.symbology);
        break;

      case "camera-properties":
        engineInstance.setCameraProperties(data.cameraType, data.autofocus);
        break;

      case "reset":
        engineInstance.reset();
        break;
    }
  };
}
/**
 * @hidden
 */


const engineWorkerBlob = new Blob(["var Module;".concat(engine.toString(), "(").concat(engineWorkerFunction.toString(), ")()")], {
  type: "text/javascript"
});

var EngineLoader = /*#__PURE__*/function () {
  function EngineLoader(preload) {
    classCallCheck(this, EngineLoader);

    if (preload) {
      this.preloadedEngineWorker = new Worker(URL.createObjectURL(engineWorkerBlob));
      EngineLoader.load(this.preloadedEngineWorker);
    }

    this.preloadedEngineWorkerAvailable = preload;
  }

  createClass(EngineLoader, [{
    key: "getEngineWorker",
    value: function getEngineWorker() {
      if (this.preloadedEngineWorkerAvailable && this.preloadedEngineWorker != null) {
        this.preloadedEngineWorkerAvailable = false;
        return this.preloadedEngineWorker;
      } else {
        return new Worker(URL.createObjectURL(engineWorkerBlob));
      }
    }
  }, {
    key: "returnEngineWorker",
    value: function returnEngineWorker(engineWorker) {
      if (this.preloadedEngineWorker == null) {
        this.preloadedEngineWorker = engineWorker;
      }

      if (this.preloadedEngineWorker === engineWorker) {
        this.preloadedEngineWorker.onmessage = null;
        this.preloadedEngineWorker.postMessage({
          type: "reset"
        });
        this.preloadedEngineWorkerAvailable = true;
      } else {
        engineWorker.terminate();
      }
    }
  }], [{
    key: "load",
    value: function load(engineWorker) {
      var preload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var delayedRegistration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      engineWorker.postMessage({
        type: "load-library",
        deviceId,
        libraryLocation: scanditEngineLocation,
        path: window.location.pathname,
        preload,
        delayedRegistration,
        licenseKey: userLicenseKey,
        deviceModelName: BrowserHelper.userAgentInfo.getDevice().model
      });
    }
  }]);

  return EngineLoader;
}();

var BlurryRecognitionPreloader = /*#__PURE__*/function () {
  function BlurryRecognitionPreloader(preload) {
    classCallCheck(this, BlurryRecognitionPreloader);

    this.eventEmitter = new eventemitter3.EventEmitter();
    this.queuedBlurryRecognitionSymbologies = from$1(BlurryRecognitionPreloader.availableBlurryRecognitionSymbologies.values());
    this.readyBlurryRecognitionSymbologies = new set$1();
    this.preload = preload;
  }

  createClass(BlurryRecognitionPreloader, [{
    key: "prepareBlurryTables",
    value: function () {
      var _prepareBlurryTables = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
        var alreadyAvailable;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                alreadyAvailable = true;

                if (!this.preload) {
                  _context.next = 11;
                  break;
                }

                _context.prev = 2;
                _context.next = 5;
                return this.checkBlurryTablesAlreadyAvailable();

              case 5:
                alreadyAvailable = _context.sent;
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](2);
                // istanbul ignore next
                console.error(_context.t0);

              case 11:
                if (alreadyAvailable) {
                  this.queuedBlurryRecognitionSymbologies = [];
                  this.readyBlurryRecognitionSymbologies = new set$1(BlurryRecognitionPreloader.availableBlurryRecognitionSymbologies);
                  this.eventEmitter.emit("blurryTablesUpdate", new set$1(this.readyBlurryRecognitionSymbologies));
                } else {
                  this.engineWorker = new Worker(URL.createObjectURL(engineWorkerBlob));
                  this.engineWorker.onmessage = this.engineWorkerOnMessage.bind(this);
                  EngineLoader.load(this.engineWorker, true, true);
                }

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 8]]);
      }));

      function prepareBlurryTables() {
        return _prepareBlurryTables.apply(this, arguments);
      }

      return prepareBlurryTables;
    }()
  }, {
    key: "on",
    value: function on(eventName, listener) {
      // istanbul ignore else
      if (eventName === "blurryTablesUpdate") {
        if (this.readyBlurryRecognitionSymbologies.size === BlurryRecognitionPreloader.availableBlurryRecognitionSymbologies.size) {
          listener(this.readyBlurryRecognitionSymbologies);
        } else {
          this.eventEmitter.on(eventName, listener);
        }
      }
    }
  }, {
    key: "updateBlurryRecognitionPriority",
    value: function updateBlurryRecognitionPriority(scanSettings) {
      var newQueuedBlurryRecognitionSymbologies = this.queuedBlurryRecognitionSymbologies.slice();
      this.getEnabledSymbologies(scanSettings).forEach(function (symbology) {
        var symbologyQueuePosition = newQueuedBlurryRecognitionSymbologies.indexOf(symbology);

        if (symbologyQueuePosition !== -1) {
          newQueuedBlurryRecognitionSymbologies.unshift(newQueuedBlurryRecognitionSymbologies.splice(symbologyQueuePosition, 1)[0]);
        }
      });
      this.queuedBlurryRecognitionSymbologies = newQueuedBlurryRecognitionSymbologies;
    }
  }, {
    key: "isBlurryRecognitionAvailable",
    value: function isBlurryRecognitionAvailable(scanSettings) {
      var _this = this;

      var enabledBlurryRecognitionSymbologies = this.getEnabledSymbologies(scanSettings);
      return enabledBlurryRecognitionSymbologies.every(function (symbology) {
        return _this.readyBlurryRecognitionSymbologies.has(symbology);
      });
    }
  }, {
    key: "getEnabledSymbologies",
    value: function getEnabledSymbologies(scanSettings) {
      return from$1(BlurryRecognitionPreloader.availableBlurryRecognitionSymbologies.values()).filter(function (symbology) {
        return scanSettings.isSymbologyEnabled(symbology);
      });
    }
  }, {
    key: "createNextBlurryTableSymbology",
    value: function createNextBlurryTableSymbology() {
      var symbology;

      do {
        symbology = this.queuedBlurryRecognitionSymbologies.shift();
      } while (symbology != null && this.readyBlurryRecognitionSymbologies.has(symbology)); // istanbul ignore else


      if (symbology != null) {
        this.engineWorker.postMessage({
          type: "create-blurry-table",
          symbology
        });
      }
    }
  }, {
    key: "checkBlurryTablesAlreadyAvailable",
    value: function checkBlurryTablesAlreadyAvailable() {
      return new promise$1(function (resolve) {
        var openDbRequest = indexedDB.open(BlurryRecognitionPreloader.writableDataPath);

        function handleErrorOrNew() {
          var _openDbRequest$result;

          openDbRequest === null || openDbRequest === void 0 ? void 0 : (_openDbRequest$result = openDbRequest.result) === null || _openDbRequest$result === void 0 ? void 0 : _openDbRequest$result.close(); // this.error

          resolve(false);
        }

        openDbRequest.onupgradeneeded = function () {
          try {
            openDbRequest.result.createObjectStore(BlurryRecognitionPreloader.fsObjectStoreName);
          } catch (error) {// Ignored
          }
        };

        openDbRequest.onsuccess = function () {
          try {
            var transaction = openDbRequest.result.transaction(BlurryRecognitionPreloader.fsObjectStoreName, "readonly");
            transaction.onerror = handleErrorOrNew;
            var storeKeysRequest = transaction.objectStore(BlurryRecognitionPreloader.fsObjectStoreName).getAllKeys();

            storeKeysRequest.onsuccess = function () {
              openDbRequest.result.close();

              if (BlurryRecognitionPreloader.blurryTableFiles.every(function (file) {
                return storeKeysRequest.result.indexOf(file) !== -1;
              })) {
                return resolve(true);
              } else {
                return resolve(false);
              }
            };

            storeKeysRequest.onerror = handleErrorOrNew;
          } catch (error) {
            handleErrorOrNew.call({
              error
            });
          }
        };

        openDbRequest.onblocked = openDbRequest.onerror = handleErrorOrNew;
      });
    }
  }, {
    key: "engineWorkerOnMessage",
    value: function engineWorkerOnMessage(ev) {
      var _this2 = this;

      var data = ev.data; // istanbul ignore else

      if (data[1] != null) {
        switch (data[0]) {
          case "context-created":
            this.createNextBlurryTableSymbology();
            break;

          case "create-blurry-table-result":
            this.readyBlurryRecognitionSymbologies.add(data[1]);

            if ([Barcode.Symbology.EAN8, Barcode.Symbology.EAN13, Barcode.Symbology.UPCA, Barcode.Symbology.UPCE].includes(data[1])) {
              this.readyBlurryRecognitionSymbologies.add(Barcode.Symbology.EAN13);
              this.readyBlurryRecognitionSymbologies.add(Barcode.Symbology.EAN8);
              this.readyBlurryRecognitionSymbologies.add(Barcode.Symbology.UPCA);
              this.readyBlurryRecognitionSymbologies.add(Barcode.Symbology.UPCE);
            } else if ([Barcode.Symbology.CODE32, Barcode.Symbology.CODE39].includes(data[1])) {
              this.readyBlurryRecognitionSymbologies.add(Barcode.Symbology.CODE32);
              this.readyBlurryRecognitionSymbologies.add(Barcode.Symbology.CODE39);
            }

            this.eventEmitter.emit("blurryTablesUpdate", new set$1(this.readyBlurryRecognitionSymbologies));

            if (this.readyBlurryRecognitionSymbologies.size === BlurryRecognitionPreloader.availableBlurryRecognitionSymbologies.size) {
              // Avoid data not being persisted if IndexedDB operations in WebWorker are slow
              setTimeout(function () {
                _this2.engineWorker.terminate();
              }, 250);
            } else {
              this.createNextBlurryTableSymbology();
            }

            break;
        }
      }
    }
  }], [{
    key: "create",
    value: function () {
      var _create = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(preload) {
        var browserName, worker;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!preload) {
                  _context2.next = 5;
                  break;
                }

                // Edge <= 18 doesn't support IndexedDB in blob Web Workers so data wouldn't be persisted,
                // hence it would be useless to preload blurry recognition as data couldn't be saved.
                // Verify support for IndexedDB in blob Web Workers.
                browserName = BrowserHelper.userAgentInfo.getBrowser().name;

                if (!(browserName != null && browserName.includes("Edge"))) {
                  _context2.next = 5;
                  break;
                }

                worker = new Worker(URL.createObjectURL(new Blob(["(".concat(BlurryRecognitionPreloader.workerIndexedDBSupportTestFunction.toString(), ")()")], {
                  type: "text/javascript"
                })));
                return _context2.abrupt("return", new promise$1(function (resolve) {
                  worker.onmessage = function (message) {
                    worker.terminate();
                    resolve(new BlurryRecognitionPreloader(message.data));
                  };
                }));

              case 5:
                return _context2.abrupt("return", new BlurryRecognitionPreloader(preload));

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function create(_x) {
        return _create.apply(this, arguments);
      }

      return create;
    }() // istanbul ignore next

  }, {
    key: "workerIndexedDBSupportTestFunction",
    value: function workerIndexedDBSupportTestFunction() {
      try {
        indexedDB.deleteDatabase("scandit_indexeddb_support_test"); // @ts-ignore

        postMessage(true);
      } catch (error) {
        // @ts-ignore
        postMessage(false);
      }
    }
  }]);

  return BlurryRecognitionPreloader;
}();
BlurryRecognitionPreloader.writableDataPath = "/scandit_sync_folder_preload";
BlurryRecognitionPreloader.fsObjectStoreName = "FILE_DATA"; // From AndroidLowEnd

BlurryRecognitionPreloader.blurryTableFiles = ["/1a3f08f42d1332344e3cebb5c53d9837.scandit", "/9590b4b7b91d4a5ed250c07e3e6d817c.scandit", "/d5739c566e6804f3870e552f90e3afd6.scandit", "/131e51bb75340269aa65fd0e79092b88.scandit", "/6e1a9119f3e7960affc7ec57d5444ee7.scandit", "/d6fc3b403665c15391a34f142ee5a59a.scandit", "/01c4e5de021dbfcf8d2379ce1cf92e73.scandit", "/102ada10d9d30c97397b492d7d0f1723.scandit", "/fbe00505a2fc101192022da06b10f6e4.scandit", "/b7ee4f18825bd3369ad7afbca72f4a58.scandit", "/d6401bde0bf283d9e25b41ce39eb37f5.scandit", "/f40acf1ec5d358e51e0339ace0e52513.scandit", "/76ca9155b19b81b4ea4a209c9c2154a4.scandit", "/9da3d4277f729835f5a1b00f8222de44.scandit", "/bdbc0442a6bd202f813411397db5e7d7.scandit", "/3c977e4745212da13b988db64d793b01.scandit", "/b04cd3b79ca8a4972422d95b71c4a33f.scandit", "/deaa2ce67c6953bdeef1fb9bcdd91d3f.scandit"].map(function (path) {
  return "".concat(BlurryRecognitionPreloader.writableDataPath).concat(path);
}); // Roughly ordered by priority

BlurryRecognitionPreloader.availableBlurryRecognitionSymbologies = new set$1([Barcode.Symbology.EAN13, Barcode.Symbology.EAN8, Barcode.Symbology.CODE32, Barcode.Symbology.CODE39, Barcode.Symbology.CODE128, Barcode.Symbology.CODE93, Barcode.Symbology.INTERLEAVED_2_OF_5, Barcode.Symbology.MSI_PLESSEY, Barcode.Symbology.UPCA, Barcode.Symbology.UPCE]);

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

var isNativeFunction = _isNativeFunction;

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !construct$2) return false;
  if (construct$2.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(construct$2(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

var isNativeReflectConstruct = _isNativeReflectConstruct;

var construct$3 = createCommonjsModule(function (module) {
function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    module.exports = _construct = construct$2;
  } else {
    module.exports = _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) setPrototypeOf$2(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

module.exports = _construct;
});

var wrapNativeSuper = createCommonjsModule(function (module) {
function _wrapNativeSuper(Class) {
  var _cache = typeof map$1 === "function" ? new map$1() : undefined;

  module.exports = _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return construct$3(Class, arguments, getPrototypeOf$2(this).constructor);
    }

    Wrapper.prototype = create$1(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return setPrototypeOf$2(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

module.exports = _wrapNativeSuper;
});

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = getPrototypeOf$2(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf$2(this).constructor; result = construct$2(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !construct$2) return false; if (construct$2.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct$2(Date, [], function () {})); return true; } catch (e) { return false; } }

/**
 * @hidden
 */
var CustomError = /*#__PURE__*/function (_Error) {
  inherits(CustomError, _Error);

  var _super = _createSuper(CustomError);

  // istanbul ignore next
  function CustomError() {
    var _this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$name = _ref.name,
        name = _ref$name === void 0 ? "" : _ref$name,
        _ref$message = _ref.message,
        message = _ref$message === void 0 ? "" : _ref$message;

    classCallCheck(this, CustomError);

    _this = _super.call(this, message);

    setPrototypeOf$1(assertThisInitialized(_this), CustomError.prototype);

    _this.name = name;
    return _this;
  }

  return CustomError;
}( /*#__PURE__*/wrapNativeSuper(Error));

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = getPrototypeOf$2(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf$2(this).constructor; result = construct$2(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !construct$2) return false; if (construct$2.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct$2(Date, [], function () {})); return true; } catch (e) { return false; } }
var UnsupportedBrowserError = /*#__PURE__*/function (_CustomError) {
  inherits(UnsupportedBrowserError, _CustomError);

  var _super = _createSuper$1(UnsupportedBrowserError);

  // istanbul ignore next
  function UnsupportedBrowserError(browserCompatibility) {
    var _this;

    classCallCheck(this, UnsupportedBrowserError);

    _this = _super.call(this, {
      name: "UnsupportedBrowserError",
      message: "This OS / browser has one or more missing features preventing it from working correctly (".concat(browserCompatibility.missingFeatures.join(", "), ")")
    });
    _this.data = browserCompatibility;
    return _this;
  }

  return UnsupportedBrowserError;
}(CustomError);

var pickerStyles = ___$insertStyle(".scandit.scandit-container{width:100%;height:100%;display:flex;justify-content:center;align-items:center;overflow:hidden}.scandit.scandit-barcode-picker{position:relative;min-width:1px;min-height:1px;width:100%;height:100%;background-color:#000}.scandit .scandit-video{width:100%;height:100%;position:relative;display:block}.scandit .scandit-video.mirrored{transform:scaleX(-1)}.scandit .scandit-logo{bottom:5%;right:5%;max-width:35%;max-height:12.5%}.scandit .scandit-laser,.scandit .scandit-logo{position:absolute;pointer-events:none;transform:translateZ(0)}.scandit .scandit-laser{z-index:10;box-sizing:border-box;top:-9999px;display:flex;align-items:center}.scandit .scandit-laser img{width:100%;max-height:47px}.scandit .scandit-laser img,.scandit .scandit-viewfinder{position:absolute;transition:opacity .25s ease;animation-duration:.25s}.scandit .scandit-viewfinder{z-index:10;box-sizing:border-box;border:2px solid #fff;border-radius:10px;top:-9999px;pointer-events:none;transform:translateZ(0)}.scandit .scandit-viewfinder.paused{opacity:.4}.scandit .scandit-camera-switcher,.scandit .scandit-torch-toggle{-webkit-tap-highlight-color:rgba(255,255,255,0);position:absolute;top:5%;max-width:15%;max-height:15%;z-index:10;cursor:pointer;filter:drop-shadow(0 2px 0 #808080);transform:translateZ(0)}.scandit .scandit-camera-switcher{left:5%}.scandit .scandit-torch-toggle{right:5%}.scandit .scandit-camera-upload{-webkit-tap-highlight-color:rgba(255,255,255,0);width:100%;height:100%;z-index:5}.scandit .scandit-camera-upload,.scandit .scandit-camera-upload label{display:flex;flex-direction:column;justify-content:center;align-items:center}.scandit .scandit-camera-upload label{cursor:pointer;width:180px;height:180px;margin-top:18px;border-radius:50%}.scandit .scandit-camera-upload label input[type=file]{position:absolute;top:-9999px}.scandit .radial-progress{width:180px;height:180px;background-color:transparent;border-width:3px;border-style:solid;border-radius:50%;position:absolute;transition:opacity 1s ease,border-color .5s;animation-duration:.25s;box-sizing:border-box}.scandit .radial-progress[data-progress=\"0\"]{opacity:.2}.scandit .radial-progress[data-progress=\"5\"]{opacity:.24}.scandit .radial-progress[data-progress=\"10\"]{opacity:.28}.scandit .radial-progress[data-progress=\"15\"]{opacity:.32}.scandit .radial-progress[data-progress=\"20\"]{opacity:.36}.scandit .radial-progress[data-progress=\"25\"]{opacity:.4}.scandit .radial-progress[data-progress=\"30\"]{opacity:.44}.scandit .radial-progress[data-progress=\"35\"]{opacity:.48}.scandit .radial-progress[data-progress=\"40\"]{opacity:.52}.scandit .radial-progress[data-progress=\"45\"]{opacity:.56}.scandit .radial-progress[data-progress=\"50\"]{opacity:.6}.scandit .radial-progress[data-progress=\"55\"]{opacity:.64}.scandit .radial-progress[data-progress=\"60\"]{opacity:.68}.scandit .radial-progress[data-progress=\"65\"]{opacity:.72}.scandit .radial-progress[data-progress=\"70\"]{opacity:.76}.scandit .radial-progress[data-progress=\"75\"]{opacity:.8}.scandit .radial-progress[data-progress=\"80\"]{opacity:.84}.scandit .radial-progress[data-progress=\"85\"]{opacity:.88}.scandit .radial-progress[data-progress=\"90\"]{opacity:.92}.scandit .radial-progress[data-progress=\"95\"]{opacity:.96}.scandit .radial-progress[data-progress=\"100\"]{opacity:1}.scandit .scandit-flash-color{animation-name:scandit-flash-color}.scandit .scandit-flash-white{animation-name:scandit-flash-white}.scandit .scandit-flash-inset{animation-name:scandit-flash-inset}.scandit .scandit-opacity-pulse{animation-duration:.333s,1s;animation-iteration-count:1,infinite;animation-delay:0s,.333s;animation-timing-function:cubic-bezier(.645,.045,.355,1),cubic-bezier(.645,.045,.355,1);animation-name:scandit-opacity-pulse-before,scandit-opacity-pulse}.scandit .scandit-hidden-opacity{opacity:0}.scandit-hidden{display:none!important}@keyframes scandit-flash-color{0%{filter:none}50%{filter:drop-shadow(0 0 .75rem #fff) drop-shadow(0 0 2.5rem #7ed9e2)}to{filter:none}}@keyframes scandit-flash-white{0%{filter:none}50%{filter:drop-shadow(0 0 .5rem #fff) drop-shadow(0 0 1rem #fff) drop-shadow(0 0 2.5rem #fff)}to{filter:none}}@keyframes scandit-flash-inset{0%{box-shadow:none}50%{box-shadow:inset 0 0 .5rem,inset 0 0 1rem,inset 0 0 2.5rem}to{box-shadow:none}}@keyframes scandit-opacity-pulse-before{0%{opacity:1}to{opacity:.4}}@keyframes scandit-opacity-pulse{0%{opacity:.4}50%{opacity:.6}to{opacity:.4}}");

/*! howler.js v2.2.1 | (c) 2013-2020, James Simpson of GoldFire Studios | MIT License | howlerjs.com */

var howler_core_min = createCommonjsModule(function (module, exports) {
!function(){var e=function(){this.init();};e.prototype={init:function(){var e=this||n;return e._counter=1e3,e._html5AudioPool=[],e.html5PoolSize=10,e._codecs={},e._howls=[],e._muted=!1,e._volume=1,e._canPlayEvent="canplaythrough",e._navigator="undefined"!=typeof window&&window.navigator?window.navigator:null,e.masterGain=null,e.noAudio=!1,e.usingWebAudio=!0,e.autoSuspend=!0,e.ctx=null,e.autoUnlock=!0,e._setup(),e},volume:function(e){var o=this||n;if(e=parseFloat(e),o.ctx||_(),void 0!==e&&e>=0&&e<=1){if(o._volume=e,o._muted)return o;o.usingWebAudio&&o.masterGain.gain.setValueAtTime(e,n.ctx.currentTime);for(var t=0;t<o._howls.length;t++)if(!o._howls[t]._webAudio)for(var r=o._howls[t]._getSoundIds(),a=0;a<r.length;a++){var u=o._howls[t]._soundById(r[a]);u&&u._node&&(u._node.volume=u._volume*e);}return o}return o._volume},mute:function(e){var o=this||n;o.ctx||_(),o._muted=e,o.usingWebAudio&&o.masterGain.gain.setValueAtTime(e?0:o._volume,n.ctx.currentTime);for(var t=0;t<o._howls.length;t++)if(!o._howls[t]._webAudio)for(var r=o._howls[t]._getSoundIds(),a=0;a<r.length;a++){var u=o._howls[t]._soundById(r[a]);u&&u._node&&(u._node.muted=!!e||u._muted);}return o},stop:function(){for(var e=this||n,o=0;o<e._howls.length;o++)e._howls[o].stop();return e},unload:function(){for(var e=this||n,o=e._howls.length-1;o>=0;o--)e._howls[o].unload();return e.usingWebAudio&&e.ctx&&void 0!==e.ctx.close&&(e.ctx.close(),e.ctx=null,_()),e},codecs:function(e){return (this||n)._codecs[e.replace(/^x-/,"")]},_setup:function(){var e=this||n;if(e.state=e.ctx?e.ctx.state||"suspended":"suspended",e._autoSuspend(),!e.usingWebAudio)if("undefined"!=typeof Audio)try{var o=new Audio;void 0===o.oncanplaythrough&&(e._canPlayEvent="canplay");}catch(n){e.noAudio=!0;}else e.noAudio=!0;try{var o=new Audio;o.muted&&(e.noAudio=!0);}catch(e){}return e.noAudio||e._setupCodecs(),e},_setupCodecs:function(){var e=this||n,o=null;try{o="undefined"!=typeof Audio?new Audio:null;}catch(n){return e}if(!o||"function"!=typeof o.canPlayType)return e;var t=o.canPlayType("audio/mpeg;").replace(/^no$/,""),r=e._navigator&&e._navigator.userAgent.match(/OPR\/([0-6].)/g),a=r&&parseInt(r[0].split("/")[1],10)<33;return e._codecs={mp3:!(a||!t&&!o.canPlayType("audio/mp3;").replace(/^no$/,"")),mpeg:!!t,opus:!!o.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/,""),ogg:!!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),oga:!!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),wav:!!(o.canPlayType('audio/wav; codecs="1"')||o.canPlayType("audio/wav")).replace(/^no$/,""),aac:!!o.canPlayType("audio/aac;").replace(/^no$/,""),caf:!!o.canPlayType("audio/x-caf;").replace(/^no$/,""),m4a:!!(o.canPlayType("audio/x-m4a;")||o.canPlayType("audio/m4a;")||o.canPlayType("audio/aac;")).replace(/^no$/,""),m4b:!!(o.canPlayType("audio/x-m4b;")||o.canPlayType("audio/m4b;")||o.canPlayType("audio/aac;")).replace(/^no$/,""),mp4:!!(o.canPlayType("audio/x-mp4;")||o.canPlayType("audio/mp4;")||o.canPlayType("audio/aac;")).replace(/^no$/,""),weba:!!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,""),webm:!!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,""),dolby:!!o.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/,""),flac:!!(o.canPlayType("audio/x-flac;")||o.canPlayType("audio/flac;")).replace(/^no$/,"")},e},_unlockAudio:function(){var e=this||n;if(!e._audioUnlocked&&e.ctx){e._audioUnlocked=!1,e.autoUnlock=!1,e._mobileUnloaded||44100===e.ctx.sampleRate||(e._mobileUnloaded=!0,e.unload()),e._scratchBuffer=e.ctx.createBuffer(1,1,22050);var o=function(n){for(;e._html5AudioPool.length<e.html5PoolSize;)try{var t=new Audio;t._unlocked=!0,e._releaseHtml5Audio(t);}catch(n){e.noAudio=!0;break}for(var r=0;r<e._howls.length;r++)if(!e._howls[r]._webAudio)for(var a=e._howls[r]._getSoundIds(),u=0;u<a.length;u++){var d=e._howls[r]._soundById(a[u]);d&&d._node&&!d._node._unlocked&&(d._node._unlocked=!0,d._node.load());}e._autoResume();var i=e.ctx.createBufferSource();i.buffer=e._scratchBuffer,i.connect(e.ctx.destination),void 0===i.start?i.noteOn(0):i.start(0),"function"==typeof e.ctx.resume&&e.ctx.resume(),i.onended=function(){i.disconnect(0),e._audioUnlocked=!0,document.removeEventListener("touchstart",o,!0),document.removeEventListener("touchend",o,!0),document.removeEventListener("click",o,!0);for(var n=0;n<e._howls.length;n++)e._howls[n]._emit("unlock");};};return document.addEventListener("touchstart",o,!0),document.addEventListener("touchend",o,!0),document.addEventListener("click",o,!0),e}},_obtainHtml5Audio:function(){var e=this||n;if(e._html5AudioPool.length)return e._html5AudioPool.pop();var o=(new Audio).play();return o&&"undefined"!=typeof Promise&&(o instanceof Promise||"function"==typeof o.then)&&o.catch(function(){console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.");}),new Audio},_releaseHtml5Audio:function(e){var o=this||n;return e._unlocked&&o._html5AudioPool.push(e),o},_autoSuspend:function(){var e=this;if(e.autoSuspend&&e.ctx&&void 0!==e.ctx.suspend&&n.usingWebAudio){for(var o=0;o<e._howls.length;o++)if(e._howls[o]._webAudio)for(var t=0;t<e._howls[o]._sounds.length;t++)if(!e._howls[o]._sounds[t]._paused)return e;return e._suspendTimer&&clearTimeout(e._suspendTimer),e._suspendTimer=setTimeout(function(){if(e.autoSuspend){e._suspendTimer=null,e.state="suspending";var n=function(){e.state="suspended",e._resumeAfterSuspend&&(delete e._resumeAfterSuspend,e._autoResume());};e.ctx.suspend().then(n,n);}},3e4),e}},_autoResume:function(){var e=this;if(e.ctx&&void 0!==e.ctx.resume&&n.usingWebAudio)return "running"===e.state&&"interrupted"!==e.ctx.state&&e._suspendTimer?(clearTimeout(e._suspendTimer),e._suspendTimer=null):"suspended"===e.state||"running"===e.state&&"interrupted"===e.ctx.state?(e.ctx.resume().then(function(){e.state="running";for(var n=0;n<e._howls.length;n++)e._howls[n]._emit("resume");}),e._suspendTimer&&(clearTimeout(e._suspendTimer),e._suspendTimer=null)):"suspending"===e.state&&(e._resumeAfterSuspend=!0),e}};var n=new e,o=function(e){var n=this;if(!e.src||0===e.src.length)return void console.error("An array of source files must be passed with any new Howl.");n.init(e);};o.prototype={init:function(e){var o=this;return n.ctx||_(),o._autoplay=e.autoplay||!1,o._format="string"!=typeof e.format?e.format:[e.format],o._html5=e.html5||!1,o._muted=e.mute||!1,o._loop=e.loop||!1,o._pool=e.pool||5,o._preload="boolean"!=typeof e.preload&&"metadata"!==e.preload||e.preload,o._rate=e.rate||1,o._sprite=e.sprite||{},o._src="string"!=typeof e.src?e.src:[e.src],o._volume=void 0!==e.volume?e.volume:1,o._xhr={method:e.xhr&&e.xhr.method?e.xhr.method:"GET",headers:e.xhr&&e.xhr.headers?e.xhr.headers:null,withCredentials:!(!e.xhr||!e.xhr.withCredentials)&&e.xhr.withCredentials},o._duration=0,o._state="unloaded",o._sounds=[],o._endTimers={},o._queue=[],o._playLock=!1,o._onend=e.onend?[{fn:e.onend}]:[],o._onfade=e.onfade?[{fn:e.onfade}]:[],o._onload=e.onload?[{fn:e.onload}]:[],o._onloaderror=e.onloaderror?[{fn:e.onloaderror}]:[],o._onplayerror=e.onplayerror?[{fn:e.onplayerror}]:[],o._onpause=e.onpause?[{fn:e.onpause}]:[],o._onplay=e.onplay?[{fn:e.onplay}]:[],o._onstop=e.onstop?[{fn:e.onstop}]:[],o._onmute=e.onmute?[{fn:e.onmute}]:[],o._onvolume=e.onvolume?[{fn:e.onvolume}]:[],o._onrate=e.onrate?[{fn:e.onrate}]:[],o._onseek=e.onseek?[{fn:e.onseek}]:[],o._onunlock=e.onunlock?[{fn:e.onunlock}]:[],o._onresume=[],o._webAudio=n.usingWebAudio&&!o._html5,void 0!==n.ctx&&n.ctx&&n.autoUnlock&&n._unlockAudio(),n._howls.push(o),o._autoplay&&o._queue.push({event:"play",action:function(){o.play();}}),o._preload&&"none"!==o._preload&&o.load(),o},load:function(){var e=this,o=null;if(n.noAudio)return void e._emit("loaderror",null,"No audio support.");"string"==typeof e._src&&(e._src=[e._src]);for(var r=0;r<e._src.length;r++){var u,d;if(e._format&&e._format[r])u=e._format[r];else {if("string"!=typeof(d=e._src[r])){e._emit("loaderror",null,"Non-string found in selected audio sources - ignoring.");continue}u=/^data:audio\/([^;,]+);/i.exec(d),u||(u=/\.([^.]+)$/.exec(d.split("?",1)[0])),u&&(u=u[1].toLowerCase());}if(u||console.warn('No file extension was found. Consider using the "format" property or specify an extension.'),u&&n.codecs(u)){o=e._src[r];break}}return o?(e._src=o,e._state="loading","https:"===window.location.protocol&&"http:"===o.slice(0,5)&&(e._html5=!0,e._webAudio=!1),new t(e),e._webAudio&&a(e),e):void e._emit("loaderror",null,"No codec support for selected audio sources.")},play:function(e,o){var t=this,r=null;if("number"==typeof e)r=e,e=null;else {if("string"==typeof e&&"loaded"===t._state&&!t._sprite[e])return null;if(void 0===e&&(e="__default",!t._playLock)){for(var a=0,u=0;u<t._sounds.length;u++)t._sounds[u]._paused&&!t._sounds[u]._ended&&(a++,r=t._sounds[u]._id);1===a?e=null:r=null;}}var d=r?t._soundById(r):t._inactiveSound();if(!d)return null;if(r&&!e&&(e=d._sprite||"__default"),"loaded"!==t._state){d._sprite=e,d._ended=!1;var i=d._id;return t._queue.push({event:"play",action:function(){t.play(i);}}),i}if(r&&!d._paused)return o||t._loadQueue("play"),d._id;t._webAudio&&n._autoResume();var _=Math.max(0,d._seek>0?d._seek:t._sprite[e][0]/1e3),s=Math.max(0,(t._sprite[e][0]+t._sprite[e][1])/1e3-_),l=1e3*s/Math.abs(d._rate),c=t._sprite[e][0]/1e3,f=(t._sprite[e][0]+t._sprite[e][1])/1e3;d._sprite=e,d._ended=!1;var p=function(){d._paused=!1,d._seek=_,d._start=c,d._stop=f,d._loop=!(!d._loop&&!t._sprite[e][2]);};if(_>=f)return void t._ended(d);var m=d._node;if(t._webAudio){var v=function(){t._playLock=!1,p(),t._refreshBuffer(d);var e=d._muted||t._muted?0:d._volume;m.gain.setValueAtTime(e,n.ctx.currentTime),d._playStart=n.ctx.currentTime,void 0===m.bufferSource.start?d._loop?m.bufferSource.noteGrainOn(0,_,86400):m.bufferSource.noteGrainOn(0,_,s):d._loop?m.bufferSource.start(0,_,86400):m.bufferSource.start(0,_,s),l!==1/0&&(t._endTimers[d._id]=setTimeout(t._ended.bind(t,d),l)),o||setTimeout(function(){t._emit("play",d._id),t._loadQueue();},0);};"running"===n.state&&"interrupted"!==n.ctx.state?v():(t._playLock=!0,t.once("resume",v),t._clearTimer(d._id));}else {var h=function(){m.currentTime=_,m.muted=d._muted||t._muted||n._muted||m.muted,m.volume=d._volume*n.volume(),m.playbackRate=d._rate;try{var r=m.play();if(r&&"undefined"!=typeof Promise&&(r instanceof Promise||"function"==typeof r.then)?(t._playLock=!0,p(),r.then(function(){t._playLock=!1,m._unlocked=!0,o||(t._emit("play",d._id),t._loadQueue());}).catch(function(){t._playLock=!1,t._emit("playerror",d._id,"Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction."),d._ended=!0,d._paused=!0;})):o||(t._playLock=!1,p(),t._emit("play",d._id),t._loadQueue()),m.playbackRate=d._rate,m.paused)return void t._emit("playerror",d._id,"Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");"__default"!==e||d._loop?t._endTimers[d._id]=setTimeout(t._ended.bind(t,d),l):(t._endTimers[d._id]=function(){t._ended(d),m.removeEventListener("ended",t._endTimers[d._id],!1);},m.addEventListener("ended",t._endTimers[d._id],!1));}catch(e){t._emit("playerror",d._id,e);}};"data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"===m.src&&(m.src=t._src,m.load());var y=window&&window.ejecta||!m.readyState&&n._navigator.isCocoonJS;if(m.readyState>=3||y)h();else {t._playLock=!0;var g=function(){h(),m.removeEventListener(n._canPlayEvent,g,!1);};m.addEventListener(n._canPlayEvent,g,!1),t._clearTimer(d._id);}}return d._id},pause:function(e){var n=this;if("loaded"!==n._state||n._playLock)return n._queue.push({event:"pause",action:function(){n.pause(e);}}),n;for(var o=n._getSoundIds(e),t=0;t<o.length;t++){n._clearTimer(o[t]);var r=n._soundById(o[t]);if(r&&!r._paused&&(r._seek=n.seek(o[t]),r._rateSeek=0,r._paused=!0,n._stopFade(o[t]),r._node))if(n._webAudio){if(!r._node.bufferSource)continue;void 0===r._node.bufferSource.stop?r._node.bufferSource.noteOff(0):r._node.bufferSource.stop(0),n._cleanBuffer(r._node);}else isNaN(r._node.duration)&&r._node.duration!==1/0||r._node.pause();arguments[1]||n._emit("pause",r?r._id:null);}return n},stop:function(e,n){var o=this;if("loaded"!==o._state||o._playLock)return o._queue.push({event:"stop",action:function(){o.stop(e);}}),o;for(var t=o._getSoundIds(e),r=0;r<t.length;r++){o._clearTimer(t[r]);var a=o._soundById(t[r]);a&&(a._seek=a._start||0,a._rateSeek=0,a._paused=!0,a._ended=!0,o._stopFade(t[r]),a._node&&(o._webAudio?a._node.bufferSource&&(void 0===a._node.bufferSource.stop?a._node.bufferSource.noteOff(0):a._node.bufferSource.stop(0),o._cleanBuffer(a._node)):isNaN(a._node.duration)&&a._node.duration!==1/0||(a._node.currentTime=a._start||0,a._node.pause(),a._node.duration===1/0&&o._clearSound(a._node))),n||o._emit("stop",a._id));}return o},mute:function(e,o){var t=this;if("loaded"!==t._state||t._playLock)return t._queue.push({event:"mute",action:function(){t.mute(e,o);}}),t;if(void 0===o){if("boolean"!=typeof e)return t._muted;t._muted=e;}for(var r=t._getSoundIds(o),a=0;a<r.length;a++){var u=t._soundById(r[a]);u&&(u._muted=e,u._interval&&t._stopFade(u._id),t._webAudio&&u._node?u._node.gain.setValueAtTime(e?0:u._volume,n.ctx.currentTime):u._node&&(u._node.muted=!!n._muted||e),t._emit("mute",u._id));}return t},volume:function(){var e,o,t=this,r=arguments;if(0===r.length)return t._volume;if(1===r.length||2===r.length&&void 0===r[1]){t._getSoundIds().indexOf(r[0])>=0?o=parseInt(r[0],10):e=parseFloat(r[0]);}else r.length>=2&&(e=parseFloat(r[0]),o=parseInt(r[1],10));var a;if(!(void 0!==e&&e>=0&&e<=1))return a=o?t._soundById(o):t._sounds[0],a?a._volume:0;if("loaded"!==t._state||t._playLock)return t._queue.push({event:"volume",action:function(){t.volume.apply(t,r);}}),t;void 0===o&&(t._volume=e),o=t._getSoundIds(o);for(var u=0;u<o.length;u++)(a=t._soundById(o[u]))&&(a._volume=e,r[2]||t._stopFade(o[u]),t._webAudio&&a._node&&!a._muted?a._node.gain.setValueAtTime(e,n.ctx.currentTime):a._node&&!a._muted&&(a._node.volume=e*n.volume()),t._emit("volume",a._id));return t},fade:function(e,o,t,r){var a=this;if("loaded"!==a._state||a._playLock)return a._queue.push({event:"fade",action:function(){a.fade(e,o,t,r);}}),a;e=Math.min(Math.max(0,parseFloat(e)),1),o=Math.min(Math.max(0,parseFloat(o)),1),t=parseFloat(t),a.volume(e,r);for(var u=a._getSoundIds(r),d=0;d<u.length;d++){var i=a._soundById(u[d]);if(i){if(r||a._stopFade(u[d]),a._webAudio&&!i._muted){var _=n.ctx.currentTime,s=_+t/1e3;i._volume=e,i._node.gain.setValueAtTime(e,_),i._node.gain.linearRampToValueAtTime(o,s);}a._startFadeInterval(i,e,o,t,u[d],void 0===r);}}return a},_startFadeInterval:function(e,n,o,t,r,a){var u=this,d=n,i=o-n,_=Math.abs(i/.01),s=Math.max(4,_>0?t/_:t),l=Date.now();e._fadeTo=o,e._interval=setInterval(function(){var r=(Date.now()-l)/t;l=Date.now(),d+=i*r,d=Math.round(100*d)/100,d=i<0?Math.max(o,d):Math.min(o,d),u._webAudio?e._volume=d:u.volume(d,e._id,!0),a&&(u._volume=d),(o<n&&d<=o||o>n&&d>=o)&&(clearInterval(e._interval),e._interval=null,e._fadeTo=null,u.volume(o,e._id),u._emit("fade",e._id));},s);},_stopFade:function(e){var o=this,t=o._soundById(e);return t&&t._interval&&(o._webAudio&&t._node.gain.cancelScheduledValues(n.ctx.currentTime),clearInterval(t._interval),t._interval=null,o.volume(t._fadeTo,e),t._fadeTo=null,o._emit("fade",e)),o},loop:function(){var e,n,o,t=this,r=arguments;if(0===r.length)return t._loop;if(1===r.length){if("boolean"!=typeof r[0])return !!(o=t._soundById(parseInt(r[0],10)))&&o._loop;e=r[0],t._loop=e;}else 2===r.length&&(e=r[0],n=parseInt(r[1],10));for(var a=t._getSoundIds(n),u=0;u<a.length;u++)(o=t._soundById(a[u]))&&(o._loop=e,t._webAudio&&o._node&&o._node.bufferSource&&(o._node.bufferSource.loop=e,e&&(o._node.bufferSource.loopStart=o._start||0,o._node.bufferSource.loopEnd=o._stop)));return t},rate:function(){var e,o,t=this,r=arguments;if(0===r.length)o=t._sounds[0]._id;else if(1===r.length){var a=t._getSoundIds(),u=a.indexOf(r[0]);u>=0?o=parseInt(r[0],10):e=parseFloat(r[0]);}else 2===r.length&&(e=parseFloat(r[0]),o=parseInt(r[1],10));var d;if("number"!=typeof e)return d=t._soundById(o),d?d._rate:t._rate;if("loaded"!==t._state||t._playLock)return t._queue.push({event:"rate",action:function(){t.rate.apply(t,r);}}),t;void 0===o&&(t._rate=e),o=t._getSoundIds(o);for(var i=0;i<o.length;i++)if(d=t._soundById(o[i])){t.playing(o[i])&&(d._rateSeek=t.seek(o[i]),d._playStart=t._webAudio?n.ctx.currentTime:d._playStart),d._rate=e,t._webAudio&&d._node&&d._node.bufferSource?d._node.bufferSource.playbackRate.setValueAtTime(e,n.ctx.currentTime):d._node&&(d._node.playbackRate=e);var _=t.seek(o[i]),s=(t._sprite[d._sprite][0]+t._sprite[d._sprite][1])/1e3-_,l=1e3*s/Math.abs(d._rate);!t._endTimers[o[i]]&&d._paused||(t._clearTimer(o[i]),t._endTimers[o[i]]=setTimeout(t._ended.bind(t,d),l)),t._emit("rate",d._id);}return t},seek:function(){var e,o,t=this,r=arguments;if(0===r.length)o=t._sounds[0]._id;else if(1===r.length){var a=t._getSoundIds(),u=a.indexOf(r[0]);u>=0?o=parseInt(r[0],10):t._sounds.length&&(o=t._sounds[0]._id,e=parseFloat(r[0]));}else 2===r.length&&(e=parseFloat(r[0]),o=parseInt(r[1],10));if(void 0===o)return t;if("number"==typeof e&&("loaded"!==t._state||t._playLock))return t._queue.push({event:"seek",action:function(){t.seek.apply(t,r);}}),t;var d=t._soundById(o);if(d){if(!("number"==typeof e&&e>=0)){if(t._webAudio){var i=t.playing(o)?n.ctx.currentTime-d._playStart:0,_=d._rateSeek?d._rateSeek-d._seek:0;return d._seek+(_+i*Math.abs(d._rate))}return d._node.currentTime}var s=t.playing(o);s&&t.pause(o,!0),d._seek=e,d._ended=!1,t._clearTimer(o),t._webAudio||!d._node||isNaN(d._node.duration)||(d._node.currentTime=e);var l=function(){t._emit("seek",o),s&&t.play(o,!0);};if(s&&!t._webAudio){var c=function(){t._playLock?setTimeout(c,0):l();};setTimeout(c,0);}else l();}return t},playing:function(e){var n=this;if("number"==typeof e){var o=n._soundById(e);return !!o&&!o._paused}for(var t=0;t<n._sounds.length;t++)if(!n._sounds[t]._paused)return !0;return !1},duration:function(e){var n=this,o=n._duration,t=n._soundById(e);return t&&(o=n._sprite[t._sprite][1]/1e3),o},state:function(){return this._state},unload:function(){for(var e=this,o=e._sounds,t=0;t<o.length;t++)o[t]._paused||e.stop(o[t]._id),e._webAudio||(e._clearSound(o[t]._node),o[t]._node.removeEventListener("error",o[t]._errorFn,!1),o[t]._node.removeEventListener(n._canPlayEvent,o[t]._loadFn,!1),o[t]._node.removeEventListener("ended",o[t]._endFn,!1),n._releaseHtml5Audio(o[t]._node)),delete o[t]._node,e._clearTimer(o[t]._id);var a=n._howls.indexOf(e);a>=0&&n._howls.splice(a,1);var u=!0;for(t=0;t<n._howls.length;t++)if(n._howls[t]._src===e._src||e._src.indexOf(n._howls[t]._src)>=0){u=!1;break}return r&&u&&delete r[e._src],n.noAudio=!1,e._state="unloaded",e._sounds=[],e=null,null},on:function(e,n,o,t){var r=this,a=r["_on"+e];return "function"==typeof n&&a.push(t?{id:o,fn:n,once:t}:{id:o,fn:n}),r},off:function(e,n,o){var t=this,r=t["_on"+e],a=0;if("number"==typeof n&&(o=n,n=null),n||o)for(a=0;a<r.length;a++){var u=o===r[a].id;if(n===r[a].fn&&u||!n&&u){r.splice(a,1);break}}else if(e)t["_on"+e]=[];else {var d=Object.keys(t);for(a=0;a<d.length;a++)0===d[a].indexOf("_on")&&Array.isArray(t[d[a]])&&(t[d[a]]=[]);}return t},once:function(e,n,o){var t=this;return t.on(e,n,o,1),t},_emit:function(e,n,o){for(var t=this,r=t["_on"+e],a=r.length-1;a>=0;a--)r[a].id&&r[a].id!==n&&"load"!==e||(setTimeout(function(e){e.call(this,n,o);}.bind(t,r[a].fn),0),r[a].once&&t.off(e,r[a].fn,r[a].id));return t._loadQueue(e),t},_loadQueue:function(e){var n=this;if(n._queue.length>0){var o=n._queue[0];o.event===e&&(n._queue.shift(),n._loadQueue()),e||o.action();}return n},_ended:function(e){var o=this,t=e._sprite;if(!o._webAudio&&e._node&&!e._node.paused&&!e._node.ended&&e._node.currentTime<e._stop)return setTimeout(o._ended.bind(o,e),100),o;var r=!(!e._loop&&!o._sprite[t][2]);if(o._emit("end",e._id),!o._webAudio&&r&&o.stop(e._id,!0).play(e._id),o._webAudio&&r){o._emit("play",e._id),e._seek=e._start||0,e._rateSeek=0,e._playStart=n.ctx.currentTime;var a=1e3*(e._stop-e._start)/Math.abs(e._rate);o._endTimers[e._id]=setTimeout(o._ended.bind(o,e),a);}return o._webAudio&&!r&&(e._paused=!0,e._ended=!0,e._seek=e._start||0,e._rateSeek=0,o._clearTimer(e._id),o._cleanBuffer(e._node),n._autoSuspend()),o._webAudio||r||o.stop(e._id,!0),o},_clearTimer:function(e){var n=this;if(n._endTimers[e]){if("function"!=typeof n._endTimers[e])clearTimeout(n._endTimers[e]);else {var o=n._soundById(e);o&&o._node&&o._node.removeEventListener("ended",n._endTimers[e],!1);}delete n._endTimers[e];}return n},_soundById:function(e){for(var n=this,o=0;o<n._sounds.length;o++)if(e===n._sounds[o]._id)return n._sounds[o];return null},_inactiveSound:function(){var e=this;e._drain();for(var n=0;n<e._sounds.length;n++)if(e._sounds[n]._ended)return e._sounds[n].reset();return new t(e)},_drain:function(){var e=this,n=e._pool,o=0,t=0;if(!(e._sounds.length<n)){for(t=0;t<e._sounds.length;t++)e._sounds[t]._ended&&o++;for(t=e._sounds.length-1;t>=0;t--){if(o<=n)return;e._sounds[t]._ended&&(e._webAudio&&e._sounds[t]._node&&e._sounds[t]._node.disconnect(0),e._sounds.splice(t,1),o--);}}},_getSoundIds:function(e){var n=this;if(void 0===e){for(var o=[],t=0;t<n._sounds.length;t++)o.push(n._sounds[t]._id);return o}return [e]},_refreshBuffer:function(e){var o=this;return e._node.bufferSource=n.ctx.createBufferSource(),e._node.bufferSource.buffer=r[o._src],e._panner?e._node.bufferSource.connect(e._panner):e._node.bufferSource.connect(e._node),e._node.bufferSource.loop=e._loop,e._loop&&(e._node.bufferSource.loopStart=e._start||0,e._node.bufferSource.loopEnd=e._stop||0),e._node.bufferSource.playbackRate.setValueAtTime(e._rate,n.ctx.currentTime),o},_cleanBuffer:function(e){var o=this,t=n._navigator&&n._navigator.vendor.indexOf("Apple")>=0;if(n._scratchBuffer&&e.bufferSource&&(e.bufferSource.onended=null,e.bufferSource.disconnect(0),t))try{e.bufferSource.buffer=n._scratchBuffer;}catch(e){}return e.bufferSource=null,o},_clearSound:function(e){/MSIE |Trident\//.test(n._navigator&&n._navigator.userAgent)||(e.src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");}};var t=function(e){this._parent=e,this.init();};t.prototype={init:function(){var e=this,o=e._parent;return e._muted=o._muted,e._loop=o._loop,e._volume=o._volume,e._rate=o._rate,e._seek=0,e._paused=!0,e._ended=!0,e._sprite="__default",e._id=++n._counter,o._sounds.push(e),e.create(),e},create:function(){var e=this,o=e._parent,t=n._muted||e._muted||e._parent._muted?0:e._volume;return o._webAudio?(e._node=void 0===n.ctx.createGain?n.ctx.createGainNode():n.ctx.createGain(),e._node.gain.setValueAtTime(t,n.ctx.currentTime),e._node.paused=!0,e._node.connect(n.masterGain)):n.noAudio||(e._node=n._obtainHtml5Audio(),e._errorFn=e._errorListener.bind(e),e._node.addEventListener("error",e._errorFn,!1),e._loadFn=e._loadListener.bind(e),e._node.addEventListener(n._canPlayEvent,e._loadFn,!1),e._endFn=e._endListener.bind(e),e._node.addEventListener("ended",e._endFn,!1),e._node.src=o._src,e._node.preload=!0===o._preload?"auto":o._preload,e._node.volume=t*n.volume(),e._node.load()),e},reset:function(){var e=this,o=e._parent;return e._muted=o._muted,e._loop=o._loop,e._volume=o._volume,e._rate=o._rate,e._seek=0,e._rateSeek=0,e._paused=!0,e._ended=!0,e._sprite="__default",e._id=++n._counter,e},_errorListener:function(){var e=this;e._parent._emit("loaderror",e._id,e._node.error?e._node.error.code:0),e._node.removeEventListener("error",e._errorFn,!1);},_loadListener:function(){var e=this,o=e._parent;o._duration=Math.ceil(10*e._node.duration)/10,0===Object.keys(o._sprite).length&&(o._sprite={__default:[0,1e3*o._duration]}),"loaded"!==o._state&&(o._state="loaded",o._emit("load"),o._loadQueue()),e._node.removeEventListener(n._canPlayEvent,e._loadFn,!1);},_endListener:function(){var e=this,n=e._parent;n._duration===1/0&&(n._duration=Math.ceil(10*e._node.duration)/10,n._sprite.__default[1]===1/0&&(n._sprite.__default[1]=1e3*n._duration),n._ended(e)),e._node.removeEventListener("ended",e._endFn,!1);}};var r={},a=function(e){var n=e._src;if(r[n])return e._duration=r[n].duration,void i(e);if(/^data:[^;]+;base64,/.test(n)){for(var o=atob(n.split(",")[1]),t=new Uint8Array(o.length),a=0;a<o.length;++a)t[a]=o.charCodeAt(a);d(t.buffer,e);}else {var _=new XMLHttpRequest;_.open(e._xhr.method,n,!0),_.withCredentials=e._xhr.withCredentials,_.responseType="arraybuffer",e._xhr.headers&&Object.keys(e._xhr.headers).forEach(function(n){_.setRequestHeader(n,e._xhr.headers[n]);}),_.onload=function(){var n=(_.status+"")[0];if("0"!==n&&"2"!==n&&"3"!==n)return void e._emit("loaderror",null,"Failed loading audio file with status: "+_.status+".");d(_.response,e);},_.onerror=function(){e._webAudio&&(e._html5=!0,e._webAudio=!1,e._sounds=[],delete r[n],e.load());},u(_);}},u=function(e){try{e.send();}catch(n){e.onerror();}},d=function(e,o){var t=function(){o._emit("loaderror",null,"Decoding audio data failed.");},a=function(e){e&&o._sounds.length>0?(r[o._src]=e,i(o,e)):t();};"undefined"!=typeof Promise&&1===n.ctx.decodeAudioData.length?n.ctx.decodeAudioData(e).then(a).catch(t):n.ctx.decodeAudioData(e,a,t);},i=function(e,n){n&&!e._duration&&(e._duration=n.duration),0===Object.keys(e._sprite).length&&(e._sprite={__default:[0,1e3*e._duration]}),"loaded"!==e._state&&(e._state="loaded",e._emit("load"),e._loadQueue());},_=function(){if(n.usingWebAudio){try{"undefined"!=typeof AudioContext?n.ctx=new AudioContext:"undefined"!=typeof webkitAudioContext?n.ctx=new webkitAudioContext:n.usingWebAudio=!1;}catch(e){n.usingWebAudio=!1;}n.ctx||(n.usingWebAudio=!1);var e=/iP(hone|od|ad)/.test(n._navigator&&n._navigator.platform),o=n._navigator&&n._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),t=o?parseInt(o[1],10):null;if(e&&t&&t<9){var r=/safari/.test(n._navigator&&n._navigator.userAgent.toLowerCase());n._navigator&&!r&&(n.usingWebAudio=!1);}n.usingWebAudio&&(n.masterGain=void 0===n.ctx.createGain?n.ctx.createGainNode():n.ctx.createGain(),n.masterGain.gain.setValueAtTime(n._muted?0:n._volume,n.ctx.currentTime),n.masterGain.connect(n.ctx.destination)),n._setup();}};(exports.Howler=n,exports.Howl=o),"undefined"!=typeof commonjsGlobal?(commonjsGlobal.HowlerGlobal=e,commonjsGlobal.Howler=n,commonjsGlobal.Howl=o,commonjsGlobal.Sound=t):"undefined"!=typeof window&&(window.HowlerGlobal=e,window.Howler=n,window.Howl=o,window.Sound=t);}();
});

// TODO: gracefully load assets from files inside build process
var beepSound = // tslint:disable-next-line:max-line-length
"data:audio/mp3;base64,//uwAAAAA8ROTJVigAB4icmSrFAAE/IjVfj6gAJ+RGq/H1AAADEN55555509PSUkYjEMQ5DCaBiMBmSoGPBh6QGGJAZo8BoDwGYJADEBmQbAAbMBcAJ0IIRQuFwuF8vm6aaaaaaCCH/9RcIubDkCgBQAzBOLL5cLhog3p////6BgTBFC4yZfTah/////WmYFwuBgTh///5cEDgnB8AMQ3nnnnnnT09JSRiMQxDkMJoGIwGZKgY8GHpAYYkBmjwGgPAZgkAMQGZBsABswFwAnQghFC4XC4Xy+bppppppoIIf/1Fwi5sOQKAFADME4svlwuGiDen////oGBMEULjJl9NqH////9aZgXC4GBOH///lwQOCcH7usq4IwABEoZUkABBACSAH6LQxWQ1ekTmN4ZafMA1wANy7UyDUPgZzK4WdA1sdhHQGm0eAcG0Uwxsang94vpi3jMEgeLBTM1nUEFdDatet8mwsLJddIZ0CIGTVYoADBkuf9NrJ1f3UsUMJtLy/dMOCTfrUURBBm/6mKA7P6lkcLj/z5mI2/+plE5/9TFgqrf/qYpFf/9v///9Z7////Weu6yrgjAAEShlSQAEEAJIAfotDFZDV6ROY3hlp8wDXAA3LtTINQ+BnMrhZ0DWx2EdAabR4BwbRTDGxqeD3i+mLeMwSB4sFMzWdQQV0Nq163ybCwsl10hnQIgZNVigAMGS5/02snV/dSxQwm0vL90w4JN+tRREEGb/qYoDs/qWRwuP/PmYjb/6mUTn/1MWCqt/+pikV//2////1nv///9Z57qrtSAAaAEOPo6q0VkVoBSMfBmZVHFMomra/sFv//+7IADwAEcXjR92KgAo4vGj7sVABRJeNFzHKLAiS8aLmOUWARYQFAEDoGXFeBv7iAZHHAGKwQLnD0RkkCKmpzOKUjUjUiy0nUlpOh2UUjSoc4VsAaFAMkgspOZb1de+/222v3lN9ikN8FBKOaa0lI/b/+32+TGsxIaGIRJknav9///1fSInqSWHRKS6v///6/nCEJvdVdqQADQAhx9HVWisitAKRj4MzKo4plE1bX9gt/iLCAoAgdAy4rwN/cQDI44AxWCBc4eiMkgRU1OZxSkakakWWk6ktJ0OyikaVDnCtgDQoBkkFlJzLerr33+221+8pvsUhvgoJRzTWkpH7f/2+3yY1mJDQxCJMk7V/v//+r6RE9SSw6JSXV////X84QhNqq9yGAAtDIPgN54cGQ0s4MLUdIZgz1qumUxddqEpWGZfQdAYAOR0btmDgYpm3SG6ec7wnc1aVs2dj+1bbTnyweolsigCR4Bd4UcqIoKbf1mlbVoekvRo/NT+yIW3Ci11PUfr6dTaC7b2fe/yLtUspAgFDuR53///+pvOkM14YR+pvt/+v6/koSLVV7kMABaGQfAbzw4MhpZwYWo6QzBnrVdMpi67UJSsMy+g6AwAcjo3bMHAxTNukN0853hO5q0rZs7H9q22nPlg9RLZFAEjwC7wo5URQU2/rNK2rQ9JejR+an9kQtuFFrqeo/X06m0F23s+9/kXapZSBAKHcjzv///9TedIZrwwj9Tfb/9f1/JQkVi7zplQAFIAgwMk9GmLaGUorLwS8iIOIgIHDACBpGPGPIQTeb9Ig1+zoNGAMN6Ijtv5KI3h0rZfrLVE0dZ6n/+7IAHwAEk3jRez2kEJJvGi9ntIIT3eU/7PqwQnu8p/2fVgg7IPUzJfLB65iPwTcgPIEeWDqpvvvo6N2qSs9T1fIxKtlg1Fg5Kkp6z7nWWdSqqUulspS3s9vkhqoBb8Kg7POv6///9vUQVqqgx7Xmf7f//rbyUN1Rd50yoACkAQYGSejTFtDKUVl4JeREHEQEDhgBA0jHjHkIJvN+kQa/Z0GjAGG9ER238lEbw6Vsv1lqiaOs9SdkHqZkvlg9cxH4JuQHkCPLB1U3330dG7VJWep6vkYlWywaiwclSU9Z9zrLOpVVKXS2Upb2e3yQ1UAt+FQdnnX9f//+3qIK1VQY9rzP9v//1t5KG6jmYd0IAA0gIAD4Llq2gAnFo8YQd9sJd67dV09LYmltad5GkSGPh80IAtg4NUiAWeV15W6FXRpnnczdM46C/SvZzut0SUNUjYiIywAAvA1QCg40iSbnTJdtr85/P3fO63YhxpWgiDUWgsOUjjzp+tq2+r+++jtYd2dURoFQ+LhSOZ0/Xrb/9T9Sz21xU3rrCIH1Zi9ev9/1atZ7aRwqb1nMw7oQABpAQAHwXLVtABOLR4wg77YS7126rp6WxNLa07yNIkMfD5oQBbBwapEAs8rryt0KujTPO5m6Zx0F+lezndbokoapGxERlgABeBqgFBxpEk3OmS7bX5z+fu+d1uxDjStBEGotBYcpHHnT9bVt9X999Haw7s6ojQKh8XCkczp+vW3/6n6lntripvXWEQPqzF69f7/q1az20jhU3rV7maZEAAWQDDArs+W/cFQBSysHAKdYWnzUwc2mlLOlivqupASYLMR//In/+7IAFQAEsHlRe4mkoJYPKi9xNJQSUeVF7hqSwko8qL3DUliIwQla+ytB9/jCGTwOk7YLCgqBZuy6Dc6/c4eQc0L4CDQAc0T4T5smsq7e5vm9np2bqoaspnmWgiEzoOAqU861fWtS6kamrTW703pasnfL4YpEzZ2sf+32//WnrnSY1XDcPXnP/r/q/baZjfd7maZEAAWQDDArs+W/cFQBSysHAKdYWnzUwc2mlLOlivqupASYLMR//ImIwQla+ytB9/jCGTwOk7YLCgqBZuy6Dc6/c4eQc0L4CDQAc0T4T5smsq7e5vm9np2bqoaspnmWgiEzoOAqU861fWtS6kamrTW703pasnfL4YpEzZ2sf+32//WnrnSY1XDcPXnP/r/q/baZjfdpycyVAATgBDA1ALqbMHAeBrYsAWWvHH2AywaA7BHvZmwaGmklUBEh5MPfAYCKjjZQRAGyw/4fwM8hGdB9J4CJscei+u5YLTImQ+QavAASY+iycWpPbNd999Hba+rMXrrCZ0W1StZar1utXOa91mj1O3XkCZ1SkCRAiy16n9Tfq//P+onVdYcXq02/9f9bf+P47nacnMlQAE4AQwNQC6mzBwHga2LAFlrxx9gMsGgOwR72ZsGhppJVARIeTD3wGAio42UEQBssP+H8DPIRnQfSeAibHHovruWC0yJkPkGrwAEmPosnFqT2zXfffR22vqzF66wmdFtUrWWq9brVzmvdZo9Tt15AmdUpAkQIstep/U36v/z/qJ1XWHF6tNv/X/W3/j+O543/+6UACbAYaztA4tsHCcKBx5S8EJ48ScsKkEaV3wtIwd45ACAQBij/+7IAFAAEt3hUfWKgApbvCo+sVABSgV9f+YoAAlAr6/8xQAAgAbKYoGDwWBIDlhrJuWqzTL9SbKMay9NzZaZstX1Hqz6AYYCxHFLl9Pf+tVapulmK7UWt9B61l8Neg3tQSZCrztaV88yFfW7oCbU6RmLPAOCwEggQQ0TqfapGrV//Uf9RC6EzDAiSHKL/////nREb//dKABNgMNZ2gcW2DhOFA48peCE8eJOWFSCNK74WkYO8cgBAIAxQQANlMUDB4LAkByw1k3LVZpl+pNlGNZem5stM2Wr6j1Z9AMMBYjily+nv/WqtU3SzFdqLW+g9ay+GvQb2oJMhV52tK+eZCvrd0BNqdIzFngHBYCQQIIaJ1PtUjVq//qP+ohdCZhgRJDlF/////zoi5C6lVAABQCoDYQD4ZCwVB9kTFKkiv9NQcExMLk3ipgtxrzPf8LZgdNYHsgYIPgbIgAEXEAwCgpAie4XVi5BaBlBUxSQfMO7yfQPFcsGReNjIgX0QvmASaIgQc3SJkgpqr+myNNNNJSSX/n1Hw/4CgwqkXN3qSMTVX//U2skkQuTq9JJEy/+ybvT6p1IjCCpfiL/+SuQupVQAAUAqA2EA+GQsFQfZExSpIr/TUHBMTC5N4qYLca8z3/C2YHTWB7IGCD4GyIABFxAMAoKQInuF1YuQWgZQVMUkHzDu8n0DxXLBkXjYyIF9EL5gEmiIEHN0iZIKaq/psjTTTSUkl/59R8P+AoMKpFzd6kjE1V//1NrJJELk6vSSRMv/sm70+qdSIwgqX4i//klMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+7IAAA/wAABpBwAACAAADSDgAAEAAAGkAAAAIAAANIAAAARMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=";
var scanditLogoImage = // tslint:disable-next-line:max-line-length
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUcAAAAhCAMAAAB9TZmqAAABgFBMVEVHcEyCgoL+/v6Kior///+FhYXW1tbn5+eAgIDp6en+/v6BgYH///////////+BgYH///////////+wsLCCgoL4+PiBgYH///+srKyAgID////s7OyCgoKBgYGDg4P///+BgYH6+vqBgYH////MzMz39/f///+BgYGbm5uDg4OMjIyBgYG+vr6QkJD///////+BgYGDg4P+/v7Hx8eOjo6BgYH09PT7+/v///////+MjIz9/f3////////Y2Nj6+vrPz8+BgYH9/f3///+3t7f///+Ghob///+AgICDg4P///+IiIj///////+CgoL6+vqmpqb////////t7e3////////////b29vj4+PNzc3y8vLl5eXv7+/U1NTDw8O8vLyRkZH////x8fGJiYmZmZnDw8Pf39/S0tLT09PCwsKfn5/4+PjV1dWlpaWwsLCjo6OsrKzj4+OZmZnCwsLq6uqurq7///+AgICfn5+Tk5OFhYXCwsLJycmYmJjU1NS/v79wPZvPAAAAdnRSTlMAcvoPxiTEAsby9L8p/eusNEoJBlEZ2Pb67nz25fVGOv1Eh+RW7oyC/ToXzkALzmqTe8BJHmf9Uu+n/B2Dnt7/+6MvEP2ZKrmzXHIx2dScYv6wkf3o3SL+/uDhqLbnuNrVV4u4ie7LNGlhweeUnrTsZOjkis/PjpWtfQAACfhJREFUaN7tmXlbGksWxtlMEwRUVjUgrSQqEAQccXdQQRUVVYxqoolqjGa9WW7uW25Xv/pUdxe9q2TM88zMM55/aE5V1/Lr03XeqrZYHuzBHuzB/vPmX+hzgdmcyh/sXrIx95LKPQ64/JoG5oaHHVztzya8Ssl0rV1PfO6A03YbR4xdzUBnblbgXphZm2hv+W0z9bW0+H7tjmL9d2w6VDPon7XX/CsuxR2fTcr1hervk+oWBM9KDa0bLqVys5pOn1vTrxfvG6SrCT3HpwNiS3O1Gzt/E8dN5RHVadNAsL6aXB9ch3/9zWyUdDF/Bqh8/ngm2Shpkp+QB49xEdJy3MbgW4UjaVQ42nola73ywDWt5XhKpIcWbP4h9F3CIOuOEOodiwNz4wvdDsDW/N/PMYPhb1GiGOMY82CiSeWWObYgXsI2SWo4tq7jusOco9xC7yAGF005WixOocIq1mt1eerrw/BT6/L8cu69C3Hfb+EY3NkJ/tINHOU4Vl/VORxGiTOQ9DOTVjGugrVGwmdn/Zxkcv0qds/gOS9rOa6isM+Zc3TaRUsmvhQw2WDO0Z+mNoRnpEnurgjs8RLVPeD3vNkNhMz+2h1PgZP6anrxkTT69d4hhI8IHzCpX8Eb8gyrU1qOxIHJ/A0c5XqHwL7flCOL9GdK2NMR4JRv7LJmnYQvoF2OEHcsqEpY/s1YzK1JYJy7WRu8KoeGo75iMea7iWMxdncYb6CXLBq8I5jhSd7s1YBnnxzjMqLjSDv8kb6Do8+L6556OXYCpYR41RFdbWXx2NwfBrCRYU+jOO4FgBfjEsn+8EpxZBjAHHsX9Y4Tm+3EtKLFV10CPA73SrjfwPFgA0C8KlIOusILtVmHq1pil1HOsC548YcKgMpWUOHJCtbJrJZjwwi2eu7gaGnHdlu6To4DgHdIugwQIi2+GRvwogJgRByxzwF4+vqos5uNY8EBl/Cfrad6Ry3PGCoGHYCLqr94Nxx6joceeIWqfSLzNVQkQptATE0sBk+rXU9rDJ4IKZtxnMAOCQWB0byO46YNqwN3cIzRv+U6OQauAfSNd9KJ+qMkx1SUY3M2cVIFFiQl6xqaTSQW55hkpWy8Q9zs83EgY+pQOBorDiUT9gMbYOCIjWl7YmDBI2nrFmCaxURFS2YG+JlpoRYrWpT5ewlvN+MYp4Gapbm0dV7H0dKN9ak7OAaB8+U6OXaQkihgPX3jsY5yQkqJS05BWkQ+SbN14FGbkIe+ApvC/8dAZxP18IMYsZg5ngP/MPPHgD9C9K9zBXis5+j9FhL6fCMmu2R0kAV/BaWs9h3eqclf20RQntInkjLD6IYtRAKU2WQbp+NY9KK0eDtHH3CWqpNjmieRz2vDAABHjEVTiU6Izqr3pbgiruydET6Vip6yMHuMV07SluLJJfotZg6Fo9Y/gieERFNREnlm5PiIF6uSdZH5/DXinCQsRxM6OB8vtx6/evXKBWyM1Rb5T2TeXG06hEBtwSBJ6DjSMkGM38axCJxH6uRoyRFCUl0fMmthwNYpvVKjTtpPQ5YQq1Cjh0QD6WBn+6DMcbKNSgx77hqvLCYOTuGorVihOSLAWfzl6JWR498hGh1+K3+JPmG5GZVE2DiuQoaskuNrSvl7ks3fRabMOK5hh1AwPhvOcnqO/iVcBG7lOA2Qtno5WqziS8ununY8GKbL5AIKKTFL+UNSo87zR3PDAFwyngsxH3HvGA294/kNFV0oSYmsfGHkOCohyZcQFm6JbGFClDmrVhOBmlueorZvw1d7bSFrMtP3w/iDCDuefpQa9Ryp5Cvs+2/jeEDDvN54PDhwp/NNIkryUsyNhyiw5Jbo6hHerT/D8DjoOcY3Gc9LqfyRzFHjUMWj1m/DOza/SSPHI1b0Djah055V4aE2Y5BP3iwmd3GdZenktNGkPAZXRNQg7diKpvUcKd0r620cZ/CT1Ls+VsTHzi3mm6LkTEzQfwIDTH0HBS0edGEuaEl25H7IeB7pOWodz2+o+ATHrNfvRo4f2OUxnoh6jB/EEE0QF/O3iPIFXPED0so7GTEpb0c/ifpFoAWm6dQcm4GvJzdz9HvxhkzVyXECGyyTpXtOgRaR41BtGC6fEN04mhcCtrdOjtxNHK/wTOoraDNyPGSXn7Al/s5fYI2L4yxwC8cqXksCrxOF0QFjeT8FIULyu9DbZeBI8W9/uZnjAsIhYq2T4+eauhZDoUAfWm4d0jGn7wXWRJoFKlWWc4Hde8YjtwqssPmb6J4iGx1axd4DZx5bC7Yj/lvOOV9QTlL+6MNWzlhuw0diZQnnOmXkOBbGxY0cm13YIaShTo6hLWBElLxjM8Ak7TWwCqwVhT0c0MlZuCFgj65RxRkAT+8Vj6lteDJFy2YVg0aOWKKj4IbC2JYStJBp4mjtugXjGuIptuGYtmHLsDlvQTwqbca5DLblhVbhSOVA4QaO/swwlt6qovMOjsvnTwDEHf1LAK6ERWSRXILKcscwcCEsLuV1YGNuyePZGUR84T7rY9PoNoBhYK5k5HgMvOinZetnbEWkmQaFc/3BUay7ZmteeN4TnhEZssE2Mt4uGdubd2OXtNWOx2znASPHohdajp7J1xOC9dOCjSOiUp13cCwT8qbCDunfED4typ2/Kh4AG19FcZs72wLgWWpZvgBm7hOPHYTfcYRRqWav8d2gezJxAN7dc8LmK2SaSacxdSjmfR+R8wD3YVspcFnYy/5Gnmkcq8tGjpYMUFBzVMy2+5aQrKVejtw8IVPPYysrnSdZQpbZeUVTsjkWzBK+Q/p7FIv57LT47AMnngazl62Hhb3eUTs3M1RsJHw+WaQCf7KmiJgtEkJCs+7OzUBUURpvCzg1nIV1zhz/U7KXexFCInJ24QK915evWdGUsFhy1eq+fJiW2V0NmXDkltQcgzPHl5OvBXu5N0p4MsXVzdFiTwnbWmdjiCeE3ZcVZLmTpmjxZMkeIiREi/muCIlY78Nx+nCPtkzbfevCnp7jMh1FY5uAU0mB64roU0z+fEAHPK+e2WKjUiChsfNKnlCug+6owrH45YyopGde9W0ipJEKY8+JlqPffaTZz3DlkHRfY7mGPyBAldtpmBfGFuqgOMRA//c5Al+cUT6UnVG+M8kcB/I0vEjblDxW3xJKyybppcNas7J+8Wwo14qkoSfzqnjOW2WmbUQRSemImuOs3HhA33iS53VP1Up0m6iBRLncodFf6cWEah+RTCTEJhpmuXt9cHAgXG3pzPQDJbM8PKsaQ7W9D4PniYfP9Sa2mPsJAMBwyfQjgNqGgfBp6IGZKUfCf1vonmkfWiZt9ru+r1bb9++E/f9qThLNBhL5RkKsd1XN9qRIJP2AzNTSTdLJYVv+znWWZu7ow+p4ow1Ys3Snnry7Yj5rHfjfmda/AA1uqYyEPVX6AAAAAElFTkSuQmCC";
var laserActiveImage = // tslint:disable-next-line:max-line-length
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAuwAAAAvCAMAAACPHW/9AAAAwFBMVEVHcExUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFVydJUyNFUyNFUyNFUyNH8/v5UyNFUyNFUyNFVydJUyNFUyNFUyNFVydJUyNFVydL3/f1YytNUyNFUyNFUyNHx+/ve9fbp+PnR8fNUyNGF2N9009q15+uW3ePD7O+l4+dv0dlv0dj///9Ujp4pAAAAP3RSTlMAiXJnBFsIARM5oA1+UKsuG5W3JEULBishQj5iAm0QkTQZ/h5MF3snWISbSHb8plMFjfjv9Oeyua3Ww9/Nn4y/IgemAAAIrElEQVR42u2da1saOxCAq8jRVuql0qOVIgcvgHhBrBbUYv//vzpzySSTZBeWqo8fOm+E9Vv3eXxnOptNJh8+vD3rhvFC3lHR73/GmmEsxdKKVY+N3ONFN3OT8O+S/GMYnmXtid0rCJAy7b3nrPDyQn5dnk3DiFnaoeJ4Ife98ZnqTnTSPHZ38R0ezWPDMF6BeY6lseK0F+Ej3Vl1MJ1EZ78rmXrmBvxWTLcCO4axU8WUEsk2nIMhJsh6Et75HnQn10l1NB093xB9F9p4UsBBKXuGsQSlIuXSScSQ/Og8Ch9097aT66I6mo6S74i1c++mn7G/v4+fQrYNYymKPWLBEvEkOtD7LhoPvmN+R93R9sR1UR1FR8n7/cqS/oejjI+G8UIyqbb9NQ4NtB6MJ99J99j2deU6q35AnrPDFew99FcY+MN8K6VpGHMpVecwQL5p/1h+dL6/Bwm+i9k92M6yY2IPrpPqaLqT2omrR7hk9l4ETvEHRuAzD8OogNNFgUpd8DeRhgYGACkPvqPuO5jc2XZM7SGxK9dRdRSdknNicIy+Ey/xyDMYDRR1dzGMaihrHKCUxweFhALpD8qj76Q71jLOdknt6y6xB9dZdRCddU4ibpSgdA606q2cWqtWq7VqfDWMUpwk8BVRd99xPHAYkP6oPPkOurPtVMlwaneyU2KHZ1NxHVVvXqDm3uXC0GuR1Nrr+J7bODyr9IGByNUwYtr+wrYEgcClJCZ0FJD6YDz5Drqz7Vi3U2oX2amKgcR+1nWuk+okelmOrmVWB6XxVi9xBHpFNHoNw0gpUkU8WsUfCYoQBLW2uA/Cj0aQ353tBydcyHAdQ8+na5TYsYg52GPXUXUwnbXW2TnC/atKbO+x47xxnrFiGBXIxEGbkoCQAHD2k/CgO2T3JtkOT6ldl9q17JtUxOz1xXXM6WC6N5qVVtm6B2ZfRmrnPo9Xxkxn3InYlWEYGudFDOjDpHEAyin7UXoQnnVn27mQodQusksVw0UMuj6CrM6mU7ZO/6ehIFNZ28uNXjudFUPNJxz8ZRgxw09eDbgEQCEdERwCSn+X+EF48B11B9uxkqFCZmNjk4t2/3xKFTsl9m9Ndh1N7zUa5eWHZO1Y7qFzW+7/GgZ+AVvXW1v0RR/DKMGZgldAFJKAcP7vDhP30fkG6I7ZnWynQoZS+9ev/ISKz6euioHEDkWMdx1UJ8Wdz+NOqEZU1vaJW9ntxBZ+5nzhYRgJJEYBKhQoAjL3wXr0nXRH20+bnNpdHQNPqCQ7VzGS2C9GXnUQncQe+nyNZcjsegZMZ1NgMp0Aj8Av5AF5Qu6RH8wdcctcBY49v42/m6CC8oN8YXnu2CSyivwi01A5dO8RJZxMp+jl8/Pzee+yXasPJLV3pWj3slMVgxV78xTyunN93KG8HWoqjKkZfKZb06A6u462P4DtTyT7Pdn+g3S/I9tvyfYrHInpJPvxbzP+79Qc//BBddEdPLm9cvmRZCfd78t0d7ZP2fbn3mq7VcfU7uqYWPYjnnekKmYAiV1cZ9W5MnGmo+jadQotSuwPvySxR64H1dl2dh1/LLMbLHyku8/sV2z6rU/tJPvTvbhO1cSjtx2E5NzeoNT++SLUMaWy1yPZOZ+L7VtTlP3ndPqFbJ9M0irmKVQxktddYpfMTrofp5ndMNlF9WNnep7ZXWIH2x+C7uT6Y5zaWfZvy8o+lPIF8/oW6z5F3Sec2UNiDxX7vS7Z7+6KqhjU3TK7kVTsKrOz7XeuaM/KGK5iojpmSmU7uT43s0c1Oz2fNs7P8elUlewzrGJwkO6+Yp/oil1ndl2ySxnjXD9OUrv9vU12pzqNUMWEZ9TwiPoUinYpYySzu0dUKmNKa3Y9G0MTj5doO0/G4BzMDAZ+fZrRXEw0FePLmHQu5l5l9rRmvzLZjeLUfhW7ns3GJM+nfj5mqlzHB9Ti2Zh8nr2l5tnjF/67qL9+PxomJYd6ziZ6bVQwz24Y5XPt2SQ7jvDGiebZr7Np9irz7Okb1IvsDeqKjNIXqJ3s/elQvWOS6Rz1psneoRrlL1D16yN+gxpeoPplBLslb1BXy9+ghrUx3cK1Mb2CtTGN4oWMWv6Ol1/nfnkvRStkeJmMrZExooUxTo4E8kjWioXFYdHSsEZj0dqYSqseLwuQNY9h0WMjW0Yz9sTrHnnFY0fu3jCcCR2vc77ocbwyztf/hmWPbtVjbf6qR1nP3o3Xs9fdevaa3yeithz5bRpxMMT6Fy1o53vlj61tN+I17JEX2Xr282SDh9/TIbs5eD37YDRvPXvpTqV6vcI+Jdou5f1XWzr0fwL5ZiW+a9uZY0T7lBpzNioFsfVOJdr9WXGnkt+DulG+B7Vk+3eyZa+m4qCdbEBVwWCbT41Ke1H1/tOgdbtoE6reg3qa7kHd1HtQo+4Ce2l3gfLeAoO4X0YSBfWstUAr7Bo3jMXtBdiatMGA7i5Qj3pshO4C4rokdtVdwPeNOYv7xnD7o6W6xnzWoTBIWsdwRFjrGGNBw5ikT4YyelDaN+ZU+sYcUp+k4r4xlTqCHc7radcsagiWBINvCGYdwYxqHcFO855g1BWMWs2VtwRTHcHQ9aOoI9jcXo/S3NEP/3tOHBSuRV4WGNbq0ajW7DFr+Mg9F2Oy5qfS6/Eg9HpUib2ki+8ed/HtL27iK91PS9ugWhtf4zW6+H7MO/lux518ky6+2vWsZ3VRf/ZqzdnD70l39m1rz268eoN2TML9/Vi90J/9ZE5/9kUnbyx77gYOfdqGHbxhvPLRGycFZ2+EkzfO+LQZOXnjZi0/Z6boTKVFJyrJLy84UcmOVDJefqhSctDYnDOVotPy3GGQ1Q7LO8JhZ+UZ731cHoqojsuT0/Ju1uYeDpmfg/pmp6DaMajGWx2EOvcc1OTg32oHXN+89HxrO+DaeNMjrqsd7M5Huxfy/Y9ZM4wlWVoyZ+mHd2LdMF7Ma5j4P+hE04Z78rHKAAAAAElFTkSuQmCC";
var laserPausedImage = // tslint:disable-next-line:max-line-length
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAuwAAAAvCAMAAACPHW/9AAAAYFBMVEVHcExUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFUyNFTyNFUyNE9ws1UyNFUyNFUyNFTyNFCxM5UyNFHxc9RyNE5wcwd5ZO7AAAAH3RSTlMAZ35yAQgbBAwTI4lbRDmUoKtQLrc080osVZvhKMyyq5oARwAAB8JJREFUeNrtnYtS4koQhhUENRFRRBQRff+3PNP3nktCRHbPqTr9T5jErdrVrfr6t5PMdF9d/XndhEK/1H8T0dtQ6K/ol7FxAWIX+Veh0AVVoLaYEAojoP8C1btQ6O8KmBsPiSbwnvSfsHvPB4w7ucBhRyh0EQlROgw5/kKjwDNf4G6ke8yngrrkaYmDr+hIk35CoXPlOKJTAZxQSCHhiK9xV9aFdKN3BNNOJ5w7nTs60tR1PIdCZ2pp52VHXC3lBMh1SqEGBjHPvJe056gj6UsFt6HPdMAH5s9K73zQ9I6Tnlp6CYVqGSCf/hK4+pQTq6OJg4KQF+AVdzV2Yt2jjlDjP1ux2cLzFUZTj3A8hkLn6JXn1yEReRofSD0gT7wb7WLtjnVGHTkHpo3YbIxrBccKjlDoskKucLQiA+lPzAPw7O6OdoNdWGfUCXSBtxhyKnh+g5GEU0sbGqHQKb1tGJYBlFY854EgyL+8GO5CO8HOxm6sA+oIOsEsDBffqODYaZ+OfTpMD6HQWdrLKQ0T8JWFhqIJzAPviHuDdjV2ZZ1RB9ALjgXmzd7jDD/S/qFG+pqGnUKhn+iBJkUojToaLAwIe+Q94f5utJewo7Ej68nWkXTkfIov489AP5PTPA0+zfmY21eh0KgEE4GHh2DlwsFHAQAvuCvtYO0edjV29HVgnUh3/vxwPeLOAnGB8awcIrsKhXLNGY+5Xs95QqJ8PABzHn5kHnh3tDtrB9idsad7U2adSDeY9eCpsueZwV2r7+lInxme+15OoVCtmcwzZgYpqoOCsWP6EXjAHdw90Y53qWbtBjsbO7KebF1QL3Cm06yJdT9jlBXjNQ1/QvEpFCrUu6t+vc4B8rEAmOX0E6CKO3q7WbvBTlmMJOyJdUad4B6U0t0b3X2J8sdHOgo9PcGUBkyhEIphIELwYK1pAph8LHj6e3Z/wZ1p50SG8pgbn7KzsaccZg+oK+gDCcea4e6N7g+Hdv4feYYRCv1IT8/PRE4WExYEAr/aPvGutIu1Ux6T7lARdjV2TGI2zDom2y4d6UvTZr4rujOwv56/vvQj2tIIhTIxGIUSRIkeHwQV/Agj8Q7unmgvrL2GHZMY9nVCvfDrD8k8GGTgFnQUHY4H067SN4xv/IRCA9p9IyeAS6bDzthKpJG2RwqTFAxA/pp4v0bazdqHYSfWGfXCs51tM+nHLX5LZZ1x38kwzr9tootQqME5kQFnYl5QJ6CYdcOdgUfchfaUyoC1D8LedZTFJGNnX/eoU9b95HMTJn0rpAPqauye853EKYNunAfvoYx0vVJ3d/Z+8N5+VNq3Ge2QzaC1b+DxI+Qxbdg/4fZ0442dWLc7BYe6ZNyKumd9dyh8fWesh7OHTno7o54lM4ec92OWyhydtc+asN82nV1gtyTm+Snz9crYt01nrzj3pLfiOfQ/t/WdT9kbeXuGepbFHC1td87+yrDfD+bslsb0RcpON8HFvamzdkvZd2buyrsDPjtCoTx/cfeombET621nB9iJ9fWUnL28QeU71LU+hDHuFXez9/phzO7QeBKzC7xDU4DftY39MJTDoK9Lyi6wjz6NyZ6zu/dJ/Oq2krzcGnvOrnGhj9jtcvu1jSfuoS8/CIniYXv1tql6zN54zr5qP2fP36Bu9rJYYKbvlXgZV/0a1cVA/TRen+M82Q1uvEkNTXt7ys9F+Jax8Qb1w1bU9PIGdT72BvXU2pjB9bi6irGIgew3QGthDK16gGiIpTEhvzYGgfjQ1TFea8d2c21MP2VtzPCqx2LRY75GvV726NaEzZr+H2sdQ+csg2xxravF3YrfYtXjamDV4/B69odsb4Yuma83G7UX/orzZxexkj00bU27QqMI5dt/5oJ4vqB9bD37lJ1KugHK9gaWW/Aa2zlm/heBj4LYqRQa36k0L7ZoCNSzYqOS36pEG5XGdypN2YO69xtc29uqiyiY2xanYkfhtW0zDIXG9qEaN5JdtPZku53Y+/3pPagj1QVaVT2stMCD1hfgKgMaAdmmcPndEAqdridwnW13tu3PVYGBPeKt9QVcdYHHkeoCi2bdGKuB9DasRuWjfVYzBn4U/o3gym5w0YIoKRNqFYmRCyOmVF43hsopcbEkrJPUrhszXBFMC4LVFcHa4npKqywWaJKIeMvLPoVCw0XB+PxWFwdbYTmwt6o4nlQEex+oCCbWPlbr0RcqxWqTUgGyVebRRUUodPFqj4JYWfDxNav1WLBusOdVfJdVFd/091/k896q4Gs1VduFfF1J1KjoG5pUvZeReR2u4fviSvm6Mr6uii+zvrAqvpzHtOqzj8nXZu/qQu3D9dijPHvoRGn2F/XUkpbPrDC7VWdnyLVA+1B99qrzhnaPmdwehnsgVO0Lou9G6A904ei6svdG1XhDSF8M95nJeyqdbKR0r81tfI8buaBQuY+OSqFLNVVSsvyF76zkQB/oqZThzt3ysPHeYqRDnmtTZh3yrK0Zf+7sD0KhczvkOYQyohyM2jAvsbsY65ZX9UFd/KAP6p2c7vwVd6ksm1ZG787Q+V1P2X4BOYKNDfzOMETKF+N9UH/V4XpRNB1e6BdFM1b+hEKT+lkLLbd5P1+meZGBVzZX/0Fjdwf+dN3+pg98KPRDjbF49S/pJhT6tS5B4j8UFQCShr1YqAAAAABJRU5ErkJggg==";
var cameraImage = // tslint:disable-next-line:max-line-length
"PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmZmYiPjxwYXRoIGQ9Ik0xNyA1Yy0uOCAwLTEuNC41LTEuOCAxLS40LjUtLjcgMS0xLjEgMS41cy0uNiAxLS44IDEuM2wtLjMuM0gzYy0xLjYgMC0zIDEuNC0zIDN2MjdjMCAxLjYgMS40IDMgMyAzaDQ0YzEuNiAwIDMtMS40IDMtM3YtMjdjMC0xLjYtMS40LTMtMy0zSDM3bC0uMy0uM2MtLjItLjMtLjUtLjctLjgtMS4ycy0uNi0xLTEuMS0xLjVjLS40LS41LTEtMS0xLjgtMXptMCAyaDE2Yy0uMSAwIC4xIDAgLjMuM3MuNS44LjggMS4zLjcgMSAxLjEgMS41IDEgMSAxLjggMWgxMGMuNiAwIDEgLjQgMSAxdjI3YzAgLjYtLjQgMS0xIDFIM2MtLjYgMC0xLS40LTEtMXYtMjdjMC0uNi40LTEgMS0xaDEwYy44IDAgMS40LS41IDEuOC0xcy44LTEgMS4xLTEuNS42LTEgLjgtMS4yLjQtLjMuMy0uM3ptOCA0Yy03LjIgMC0xMyA1LjgtMTMgMTNzNS44IDEzIDEzIDEzIDEzLTUuOCAxMy0xMy01LjgtMTMtMTMtMTN6bTAgMmM2LjEgMCAxMSA0LjkgMTEgMTFzLTQuOSAxMS0xMSAxMS0xMS00LjktMTEtMTEgNC45LTExIDExLTExek04IDE0Yy0xLjEgMC0yIC45LTIgMnMuOSAyIDIgMmgxYzEuMSAwIDItLjkgMi0ycy0uOS0yLTItMnptMTcgMWMtNSAwLTkgNC05IDlzNCA5IDkgOSA5LTQgOS05LTQtOS05LTl6bTAgMmMzLjkgMCA3IDMuMSA3IDdzLTMuMSA3LTcgNy03LTMuMS03LTcgMy4xLTcgNy03eiIvPjwvc3ZnPgo=";
var folderImage = // tslint:disable-next-line:max-line-length
"PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNzIgMTcyIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiI+PHBhdGggZD0iTTEwLjMgMTMuOEM0LjcgMTMuOCAwIDE4LjQgMCAyNHYxMjdjLS4yLjctLjEgMS42LjIgMi4zIDEgNC43IDUuMiA4LjMgMTAuMSA4LjNoMTM0LjJjNS4xIDAgOS4zLTMuOSAxMC04LjhsLjItLjd2LS4ybC4xLS41di0uMWwxNy05Mi4zLjItLjN2LS4zYzAtNS43LTQuNy0xMC4zLTEwLjMtMTAuM1YzNy44YzAtNS42LTQuNy0xMC4zLTEwLjMtMTAuM0g2MmE3IDcgMCAwIDEtMS0xYy0uOS0xLTEuOS0yLjUtMy00LjItMS0xLjgtMi4yLTMuNi0zLjYtNS4ycy0zLjQtMy4zLTYuMi0zLjN6bTAgNi44aDM3LjljLS4zIDAgLjIgMCAxIDEgLjkgMSAxLjkgMi42IDMgNC4zYTQxIDQxIDAgMCAwIDMuNiA1LjJjMS40IDEuNiAzLjMgMy4zIDYuMSAzLjNoODkuNWMxLjkgMCAzLjQgMS41IDMuNCAzLjR2MTAuNEgyNy41Yy01LjQgMC05LjcgNC4zLTEwIDkuNmgtLjJsLS4xLjctMTAuMyA1NS43VjI0YzAtMiAxLjUtMy41IDMuNC0zLjV6TTI3LjUgNTVoMTM0LjJjMiAwIDMuNCAxLjUgMy40IDMuNWwtMTYuOSA5MS4ydi4zbC0uMi40VjE1MWwtLjIuNnYuN2EzLjQgMy40IDAgMCAxLTMuMyAyLjRIMTAuM2MtMiAwLTMuNC0xLjUtMy40LTMuNGwxNy05Mi4zLjItLjN2LS4zYzAtMiAxLjUtMy41IDMuNC0zLjV6Ii8+PC9zdmc+Cg==";
var switchCameraImage = // tslint:disable-next-line:max-line-length
"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmZmYiPjxwYXRoIGQ9Ik0yNi4xNCA4YTQuOTkgNC45OSAwIDAgMC00LjE2IDIuMjI3bC0yLjIxOCAzLjMyOGExLjAwMyAxLjAwMyAwIDAgMS0uODMyLjQ0NUgxOHYtMmMwLTEuMTAyLS44OTgtMi0yLTJoLTZjLTEuMTAyIDAtMiAuODk4LTIgMnYySDVjLTEuNjUyIDAtMyAxLjM0OC0zIDN2MzZjMCAxLjY1MiAxLjM0OCAzIDMgM2g1NGMxLjY1MiAwIDMtMS4zNDggMy0zVjE3YzAtMS42NTItMS4zNDgtMy0zLTNoLTN2LTFjMC0xLjEwMi0uODk4LTItMi0yaC0yYy0xLjEwMiAwLTIgLjg5OC0yIDJ2MWgtNC45MzhhLjk5Ny45OTcgMCAwIDEtLjgyOC0uNDQxbC0yLjI1NC0zLjM1MkE1LjAwMSA1LjAwMSAwIDAgMCAzNy44MjggOHptMCAyaDExLjY4OGMxIDAgMS45MzQuNDk2IDIuNDkyIDEuMzI0bDIuMjU0IDMuMzUyQTIuOTk4IDIuOTk4IDAgMCAwIDQ1LjA2MyAxNkg1OWMuNTUgMCAxIC40NSAxIDF2MzZjMCAuNTUtLjQ1IDEtMSAxSDVjLS41NSAwLTEtLjQ1LTEtMVYxN2MwLS41NS40NS0xIDEtMWgxMy45M2MxLjAwNCAwIDEuOTM3LS41IDIuNDk2LTEuMzM2bDIuMjE5LTMuMzI4QTIuOTk4IDIuOTk4IDAgMCAxIDI2LjE0IDEwek0xMCAxMmg2djJoLTZ6bTQyIDFoMnYxaC0yem0tMjAgNWMtNS4yOSAwLTEwLjI0NiAyLjgzNi0xMi45MzQgNy4zOThhLjk5Ni45OTYgMCAwIDAgLjM1NiAxLjM2OC45OTcuOTk3IDAgMCAwIDEuMzY3LS4zNTZBMTMuMDY1IDEzLjA2NSAwIDAgMSAzMiAyMGM3LjE2OCAwIDEzIDUuODMyIDEzIDEzIDAgLjE4OC0uMDE2LjM3NS0uMDIzLjU2M2wtMi4yNy0yLjI3YTEgMSAwIDEgMC0xLjQxNCAxLjQxNGw0IDRjLjE5NS4xOTUuNDUuMjkzLjcwNy4yOTNhLjk5My45OTMgMCAwIDAgLjcwNy0uMjkzbDQtNGExIDEgMCAxIDAtMS40MTQtMS40MTRsLTIuMzIgMi4zMTZjLjAxMS0uMjAzLjAyNy0uNDA2LjAyNy0uNjA5IDAtOC4yNy02LjczLTE1LTE1LTE1ek0xOCAyOWExIDEgMCAwIDAtLjcwNy4yOTNsLTQgNGExIDEgMCAxIDAgMS40MTQgMS40MTRsMi4zMTMtMi4zMTZjLS4wMDguMjAzLS4wMi40MDYtLjAyLjYwOSAwIDguMjcgNi43MyAxNSAxNSAxNSA1LjM2NyAwIDEwLjM2LTIuODk4IDEzLjAyNy03LjU2M2EuOTk5Ljk5OSAwIDEgMC0xLjczNC0uOTkyQTEzLjA0MiAxMy4wNDIgMCAwIDEgMzIgNDZjLTcuMTY4IDAtMTMtNS44MzItMTMtMTMgMC0uMTg4LjAxMi0uMzc5LjAyLS41NjZsMi4yNzMgMi4yNzNjLjE5NS4xOTUuNDUuMjkzLjcwNy4yOTNhMSAxIDAgMCAwIC43MDctMS43MDdsLTQtNEExIDEgMCAwIDAgMTggMjl6bTkgMmMtLjU1NSAwLTEgLjQ0NS0xIDF2MmMwIC41NTUuNDQ1IDEgMSAxIC41NTUgMCAxLS40NDUgMS0xdi0yYzAtLjU1NS0uNDQ1LTEtMS0xem01IDBjLS41NTUgMC0xIC40NDUtMSAxdjJjMCAuNTU1LjQ0NSAxIDEgMSAuNTU1IDAgMS0uNDQ1IDEtMXYtMmMwLS41NTUtLjQ0NS0xLTEtMXptNSAwYy0uNTU1IDAtMSAuNDQ1LTEgMXYyYzAgLjU1NS40NDUgMSAxIDEgLjU1NSAwIDEtLjQ0NSAxLTF2LTJjMC0uNTU1LS40NDUtMS0xLTF6Ii8+PC9zdmc+Cg==";
var toggleTorchImage = // tslint:disable-next-line:max-line-length
"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmZmYiPjxwYXRoIGQ9Ik0zMC45MzggMWMtLjQ0Ni4wMi0xIC4yMy0xLjMxMy42NTZhMS4zMDIgMS4zMDIgMCAwIDAtLjA2My4wOTRsLTYuNzggMTIuMDYzLS4wNjMuMDkzYy0uNTU1Ljc4NS0uNzI3IDEuNzMtLjU5NCAyLjY1NmwtMjAuNSAyMi41NjMtLjAzMS4wMzFjLTEuMDcgMS4yMTktLjY2NCAzLjAxMi40NjggNC4xNTdoLjAzMmw0LjU5NCA0LjU5M2MuNTcuNTcgMS4yNjUuOTUgMiAxLjA2My43MzQuMTEzIDEuNTQ2LS4wNTUgMi4xNTYtLjU5NGguMDMxbDIyLjU2My0yMC41Yy45My4xMjkgMS44Ny0uMDQzIDIuNjU2LS41OTQuMDItLjAxNS4wNDMtLjAxNS4wNjItLjAzMWwuMDYzLS4wMzEgMTIuMDMxLTYuNzgyYy4wMzEtLjAxOS4wNjMtLjAzOS4wOTQtLjA2Mi40MjItLjMxMy42MzYtLjg2Ny42NTYtMS4zMTMuMDItLjQ0NS0uMDk4LS44NC0uMjUtMS4yNS0uMzA1LS44Mi0uODI4LTEuNjktMS41MzEtMi42ODctMS40MDctMS45OTItMy41MTYtNC4zOS01Ljc1LTYuNjI1LTIuMjM1LTIuMjM0LTQuNjAyLTQuMzEzLTYuNTk0LTUuNzE5LS45OTYtLjcwMy0xLjg2Ny0xLjIyNi0yLjY4OC0xLjUzMS0uNDEtLjE1Mi0uODA0LS4yNy0xLjI1LS4yNXptLjIxOCAyLjAzMWMuMDc4LjAxMi4xNTMuMDI0LjM0NC4wOTQuNTIuMTkxIDEuMy42MzMgMi4yMTkgMS4yODEgMS44MzYgMS4yOTcgNC4xNjggMy4zNTYgNi4zNDMgNS41MzIgMi4xNzYgMi4xNzUgNC4yMzUgNC40NzYgNS41MzIgNi4zMTIuNjQ4LjkxOCAxLjA5IDEuNzMgMS4yODEgMi4yNS4wNy4xOTEuMDgyLjI2Ni4wOTQuMzQ0TDM1LjEyNSAyNS41M2EuOTQ5Ljk0OSAwIDAgMC0uMTI1LjA5NGMtLjMxNi4yNDItLjg2LjMyOC0xLjQzOC4yMTlhMS4wNTYgMS4wNTYgMCAwIDAtLjE4Ny0uMDYzIDMuMTEzIDMuMTEzIDAgMCAxLTEuNDM4LS44MTJsLTYuOTA2LTYuOTA3Yy0uOTc2LS45ODQtMS4xMjktMi40MzctLjY1Ni0zLjA2MmEuNTMyLjUzMiAwIDAgMCAuMDk0LS4wOTR6bS04LjIxOCAxNS41OTRjLjE5OS4yOTcuNDMuNTg2LjY4Ny44NDRsNi45MDYgNi45MDZjLjI2Mi4yNjIuNTQzLjQ4OC44NDQuNjg4TDkuNTMxIDQ2LjkwNmMtLjA4Ni4wNzgtLjI1NC4xMzctLjUzMS4wOTQtLjI3Ny0uMDQzLS42MjktLjIyMy0uOTA2LS41TDMuNSA0MS45MDZjLS41NTktLjU2Ni0uNTYzLTEuMjYxLS40MDYtMS40Mzd6bS0yLjg3NSA4LjMxM2MtLjc3IDAtMS41NDMuMjkyLTIuMTI1Ljg3NWwtMi4xMjUgMi4xMjVhMy4wMjMgMy4wMjMgMCAwIDAgMCA0LjI1IDMuMDIzIDMuMDIzIDAgMCAwIDQuMjUgMGwyLjEyNS0yLjEyNmEzLjAyMyAzLjAyMyAwIDAgMCAwLTQuMjUgMy4wMDIgMy4wMDIgMCAwIDAtMi4xMjUtLjg3NXptMCAyYy4yNTMgMCAuNTE5LjA4Mi43MTguMjguMzk5LjQuMzk5IDEuMDQgMCAxLjQzOGwtMi4xMjUgMi4xMjVhMS4wMTQgMS4wMTQgMCAwIDEtMS40MzcgMCAxLjAxNCAxLjAxNCAwIDAgMSAwLTEuNDM3Yy40MjItLjQyMiAxLjY5OS0xLjY5NiAyLjEyNS0yLjEyNS4xOTktLjIuNDY1LS4yODIuNzE4LS4yODJ6Ii8+PC9zdmc+Cg==";

var Camera;

(function (Camera) {

  (function (Type) {
    /**
     * Front (user) facing camera.
     */
    Type["FRONT"] = "front";
    /**
     * Back (environment) facing camera.
     */

    Type["BACK"] = "back";
  })(Camera.Type || (Camera.Type = {}));
})(Camera || (Camera = {}));

var $JSON$1 = _core.JSON || (_core.JSON = { stringify: JSON.stringify });
var stringify = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON$1.stringify.apply($JSON$1, arguments);
};

var stringify$1 = stringify;

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)


_export(_export.S, 'Array', { isArray: _isArray });

var isArray = _core.Array.isArray;

var isArray$1 = isArray;

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

var arrayLikeToArray = _arrayLikeToArray;

function _arrayWithoutHoles(arr) {
  if (isArray$1(arr)) return arrayLikeToArray(arr);
}

var arrayWithoutHoles = _arrayWithoutHoles;

var ITERATOR$4 = _wks('iterator');

var core_isIterable = _core.isIterable = function (it) {
  var O = Object(it);
  return O[ITERATOR$4] !== undefined
    || '@@iterator' in O
    // eslint-disable-next-line no-prototype-builtins
    || _iterators.hasOwnProperty(_classof(O));
};

var isIterable = core_isIterable;

var isIterable$1 = isIterable;

function _iterableToArray(iter) {
  if (typeof symbol$1 !== "undefined" && isIterable$1(Object(iter))) return from$1(iter);
}

var iterableToArray = _iterableToArray;

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return from$1(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

var unsupportedIterableToArray = _unsupportedIterableToArray;

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var nonIterableSpread = _nonIterableSpread;

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

var toConsumableArray = _toConsumableArray;

var ImageSettings;

(function (ImageSettings) {

  (function (Format) {
    /**
     * Single-channel 8-bit gray scale image.
     */
    Format[Format["GRAY_8U"] = 0] = "GRAY_8U";
    /**
     * RGB image with 8 bits per color channel.
     */

    Format[Format["RGB_8U"] = 1] = "RGB_8U";
    /**
     * RGBA image with 8 bits per color channel.
     */

    Format[Format["RGBA_8U"] = 2] = "RGBA_8U";
  })(ImageSettings.Format || (ImageSettings.Format = {}));
})(ImageSettings || (ImageSettings = {}));

/**
 * A data string parser.
 *
 * Parsers are capable of parsing one particular data format, which is passed to them during construction.
 *
 * The parser is created through [[BarcodePicker.createParserForFormat]] or [[Scanner.createParserForFormat]].
 *
 * Note that you need to have a valid license key with the parsing feature enabled to use the parser functionalities.
 *
 * For documentation on the available formats, check the official parser library documentation here:
 * https://docs.scandit.com/parser/formats.html.
 */
var Parser = /*#__PURE__*/function () {
  /**
   * @hidden
   *
   * @param scanner The [[Scanner]] object used to interact with the external Scandit library.
   * @param dataFormat The data format for this parser.
   */
  function Parser(scanner, dataFormat) {
    classCallCheck(this, Parser);

    this.scanner = scanner;
    this.dataFormat = dataFormat;
  }
  /**
   * Apply the option map to the parser, allowing the user to fine-tune the behaviour of the parser.
   * Available options depend on the data format and are specified in the respective documentation.
   *
   * @param options The new options to be applied (replacing previous ones, if any).
   */


  createClass(Parser, [{
    key: "setOptions",
    value: function setOptions(options) {
      this.options = options;
    }
    /**
     * Process the given raw (byte array) data with the parser, retrieving the result as a [[ParserResult]] object.
     *
     * Multiple requests done without waiting for previous results will be queued and handled in order.
     *
     * If parsing of the data fails the returned promise is rejected with a `ScanditEngineError` error.
     *
     * @param rawData The raw (byte array) data to be parsed.
     * @returns A promise resolving to the [[ParserResult]] object.
     */

  }, {
    key: "parseRawData",
    value: function parseRawData(rawData) {
      return this.scanner.parse(this.dataFormat, rawData, this.options);
    }
    /**
     * Process the given string data with the parser, retrieving the result as a [[ParserResult]] object.
     *
     * Multiple requests done without waiting for previous results will be queued and handled in order.
     *
     * If parsing of the data fails the returned promise is rejected with a `ScanditEngineError` error.
     *
     * Note that you should use [[parseRawData]] whenever possible: some codes, such as those found on driving licenses,
     * might have non-printable characters and will need to use [[Barcode.rawData]] information to be parsed correctly.
     *
     * @param data The string data to be parsed.
     * @returns A promise resolving to the [[ParserResult]] object.
     */

  }, {
    key: "parseString",
    value: function parseString(data) {
      return this.scanner.parse(this.dataFormat, data, this.options);
    }
  }]);

  return Parser;
}(); // istanbul ignore next

(function (Parser) {

  (function (DataFormat) {
    /**
     * GS1 Application Identifier (AI).
     *
     * See: http://www.gs1.org/docs/barcodes/GS1_General_Specifications.pdf.
     */
    DataFormat[DataFormat["GS1_AI"] = 1] = "GS1_AI";
    /**
     * Health Industry Bar Code (HIBC).
     *
     * See: http://www.hibcc.org.
     */

    DataFormat[DataFormat["HIBC"] = 2] = "HIBC";
    /**
     * AAMVA Driver License/Identification (DL/ID).
     *
     * See: http://www.aamva.org.
     */

    DataFormat[DataFormat["DLID"] = 3] = "DLID";
    /**
     * ICAO Machine Readable Travel Document (MRTD).
     *
     * See: https://www.icao.int.
     */

    DataFormat[DataFormat["MRTD"] = 4] = "MRTD";
    /**
     * Swiss QR ISO 20022.
     *
     * See: https://www.paymentstandards.ch.
     */

    DataFormat[DataFormat["SWISSQR"] = 5] = "SWISSQR";
    /**
     * Vehicle Identification Number (VIN).
     *
     * See: https://www.iso.org/standard/52200.html.
     */

    DataFormat[DataFormat["VIN"] = 6] = "VIN";
    /**
     * US Uniformed Services ID.
     *
     * See: https://www.cac.mil.
     */

    DataFormat[DataFormat["US_USID"] = 7] = "US_USID";
  })(Parser.DataFormat || (Parser.DataFormat = {}));
})(Parser || (Parser = {}));

/**
 * A result of a scanning operation on an image.
 */
var ScanResult = /*#__PURE__*/function () {
  /**
   * @hidden
   *
   * Create a ScanResult instance.
   *
   * @param barcodes The list of barcodes found in the image.
   * @param imageData The image data given as a byte array, formatted accordingly to the set settings.
   * @param imageSettings The configuration object defining the properties of the processed image.
   */
  function ScanResult(barcodes, imageData, imageSettings) {
    classCallCheck(this, ScanResult);

    this.barcodes = barcodes;
    this.imageData = imageData;
    this.imageSettings = imageSettings;
    this.rejectedCodes = new set$1();
  }
  /**
   * Prevent playing a sound, vibrating or flashing the GUI for a particular code.
   * If all codes in the result are rejected (or no barcode is present), sound, vibration and GUI flashing will be
   * suppressed.
   *
   * Rejected codes will still be part of the [[ScanResult.barcodes]] property like all other codes.
   *
   * @param barcode The barcode to be rejected.
   */


  createClass(ScanResult, [{
    key: "rejectCode",
    value: function rejectCode(barcode) {
      this.rejectedCodes.add(barcode);
    }
  }]);

  return ScanResult;
}();

var core_getIterator = _core.getIterator = function (it) {
  var iterFn = core_getIteratorMethod(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return _anObject(iterFn.call(it));
};

var getIterator = core_getIterator;

var getIterator$1 = getIterator;

var isEnum$1 = _objectPie.f;
var _objectToArray = function (isEntries) {
  return function (it) {
    var O = _toIobject(it);
    var keys = _objectKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!_descriptors || isEnum$1.call(O, key)) {
        result.push(isEntries ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};

// https://github.com/tc39/proposal-object-values-entries

var $values = _objectToArray(false);

_export(_export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});

var values = _core.Object.values;

var values$1 = values;

/**
 * A symbology-specific configuration object.
 *
 * See https://docs.scandit.com/stable/c_api/symbologies.html for more details.
 */

var SymbologySettings = /*#__PURE__*/function () {
  /**
   * @hidden
   *
   * Create a SymbologySettings instance.
   *
   * @param symbology The symbology for which to create the settings.
   * @param enabled <div class="tsd-signature-symbol">Default =&nbsp;false</div>
   * Whether the symbology is enabled for recognition.
   */
  function SymbologySettings(symbology) {
    var _SymbologySettings$de, _SymbologySettings$de2, _SymbologySettings$de3;

    var enabled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    classCallCheck(this, SymbologySettings);

    this.symbology = symbology;
    this.enabled = enabled;
    this.colorInvertedEnabled = false;
    this.activeSymbolCounts = (_SymbologySettings$de = SymbologySettings.defaultActiveSymbolCounts[symbology]) !== null && _SymbologySettings$de !== void 0 ? _SymbologySettings$de : [];
    this.extensions = new set$1((_SymbologySettings$de2 = SymbologySettings.defaultExtensions[symbology]) !== null && _SymbologySettings$de2 !== void 0 ? _SymbologySettings$de2 : []);
    this.checksums = new set$1((_SymbologySettings$de3 = SymbologySettings.defaultChecksums[symbology]) !== null && _SymbologySettings$de3 !== void 0 ? _SymbologySettings$de3 : []);
  }
  /**
   * @returns Whether the symbology enabled for recognition.
   */


  createClass(SymbologySettings, [{
    key: "isEnabled",
    value: function isEnabled() {
      return this.enabled;
    }
    /**
     * Enable or disable recognition of the symbology.
     *
     * @param enabled Whether the symbology is enabled for recognition.
     * @returns The updated [[SymbologySettings]] object.
     */

  }, {
    key: "setEnabled",
    value: function setEnabled(enabled) {
      this.enabled = enabled;
      return this;
    }
    /**
     * @returns Whether color inverted recognition is enabled.
     */

  }, {
    key: "isColorInvertedEnabled",
    value: function isColorInvertedEnabled() {
      return this.colorInvertedEnabled;
    }
    /**
     * Enable or disable recognition of inverted-color symbology (in addition to normal colors).
     *
     * @param enabled Whether color inverted recognition is enabled.
     * @returns The updated [[SymbologySettings]] object.
     */

  }, {
    key: "setColorInvertedEnabled",
    value: function setColorInvertedEnabled(enabled) {
      this.colorInvertedEnabled = enabled;
      return this;
    }
    /**
     * Get the current list of active symbol counts.
     *
     * @returns The list of active symbol counts.
     */

  }, {
    key: "getActiveSymbolCounts",
    value: function getActiveSymbolCounts() {
      return this.activeSymbolCounts;
    }
    /**
     * Set the list of active symbol counts.
     *
     * If an empty or invalid symbol count range is given, the range will be set to its default value.
     *
     * @param activeSymbolCounts The list of active symbol counts.
     * @returns The updated [[SymbologySettings]] object.
     */

  }, {
    key: "setActiveSymbolCounts",
    value: function setActiveSymbolCounts(activeSymbolCounts) {
      this.activeSymbolCounts = activeSymbolCounts;

      if (this.activeSymbolCounts.length === 0) {
        var _SymbologySettings$de4;

        this.activeSymbolCounts = (_SymbologySettings$de4 = SymbologySettings.defaultActiveSymbolCounts[this.symbology]) !== null && _SymbologySettings$de4 !== void 0 ? _SymbologySettings$de4 : [];
      }

      return this;
    }
    /**
     * Set the (inclusive) range of active symbol counts.
     *
     * If an empty or invalid symbol count range is given, the range will be set to its default value.
     *
     * @param minCount The minimum accepted number of symbols.
     * @param maxCount The maximum accepted number of symbols.
     * @returns The updated [[SymbologySettings]] object.
     */

  }, {
    key: "setActiveSymbolCountsRange",
    value: function setActiveSymbolCountsRange(minCount, maxCount) {
      this.activeSymbolCounts = SymbologySettings.getNumberRange(minCount, maxCount);

      if (this.activeSymbolCounts.length === 0) {
        var _SymbologySettings$de5;

        this.activeSymbolCounts = (_SymbologySettings$de5 = SymbologySettings.defaultActiveSymbolCounts[this.symbology]) !== null && _SymbologySettings$de5 !== void 0 ? _SymbologySettings$de5 : [];
      }

      return this;
    }
    /**
     * Get the current set of enabled optional extensions.
     *
     * Note that the external Scandit Engine library will also use any applicable mandatory extension for the symbology.
     *
     * @returns The set of enabled extensions.
     */

  }, {
    key: "getEnabledExtensions",
    value: function getEnabledExtensions() {
      return this.extensions;
    }
    /**
     * Enable an optional extension or list/set of optional extensions
     *
     * @param extension The single extension or list/set of extensions to enable.
     * @returns The updated [[SymbologySettings]] object.
     */

  }, {
    key: "enableExtensions",
    value: function enableExtensions(extension) {
      var _this = this;

      if (typeof extension === "object") {
        this.extensions = new set$1([].concat(toConsumableArray(this.extensions), toConsumableArray(from$1(extension).filter(function (e) {
          return _this.isValidExtension(e);
        }))));
      } else if (this.isValidExtension(extension)) {
        this.extensions.add(extension);
      }

      return this;
    }
    /**
     * Disable an optional extension or list/set of optional extensions.
     *
     * @param extension The single extension or list/set of extensions to disable.
     * @returns The updated [[SymbologySettings]] object.
     */

  }, {
    key: "disableExtensions",
    value: function disableExtensions(extension) {
      if (typeof extension === "object") {
        this.extensions = new set$1(toConsumableArray(this.extensions).filter(function (x) {
          return extension instanceof Array ? !extension.includes(x) : !extension.has(x);
        }));
      } else if (this.isValidExtension(extension)) {
        this.extensions.delete(extension);
      }

      return this;
    }
    /**
     * Get the current set of enabled optional checksums.
     *
     * Note that the external Scandit Engine library will also use any applicable mandatory checksum for the symbology.
     *
     * @returns The set of enabled checksums.
     */

  }, {
    key: "getEnabledChecksums",
    value: function getEnabledChecksums() {
      return this.checksums;
    }
    /**
     * Enable an optional checksum or list/set of optional checksums.
     *
     * @param checksum The single checksum or list/set of checksums to enable.
     * @returns The updated [[SymbologySettings]] object.
     */

  }, {
    key: "enableChecksums",
    value: function enableChecksums(checksum) {
      var _this2 = this;

      if (typeof checksum === "object") {
        this.checksums = new set$1([].concat(toConsumableArray(this.checksums), toConsumableArray(from$1(checksum).filter(function (c) {
          return _this2.isValidChecksum(c);
        }))));
      } else if (this.isValidChecksum(checksum)) {
        this.checksums.add(checksum);
      }

      return this;
    }
    /**
     * Disable an optional checksum or list/set of optional checksums.
     *
     * @param checksum The single checksum or list/set of checksums to disable.
     * @returns The updated [[SymbologySettings]] object.
     */

  }, {
    key: "disableChecksums",
    value: function disableChecksums(checksum) {
      if (typeof checksum === "object") {
        this.checksums = new set$1(toConsumableArray(this.checksums).filter(function (x) {
          return checksum instanceof Array ? !checksum.includes(x) : !checksum.has(x);
        }));
      } else if (this.isValidChecksum(checksum)) {
        this.checksums.delete(checksum);
      }

      return this;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        enabled: this.enabled,
        colorInvertedEnabled: this.colorInvertedEnabled,
        activeSymbolCounts: this.activeSymbolCounts.length === 0 ? undefined : this.activeSymbolCounts,
        extensions: from$1(this.extensions),
        checksums: from$1(this.checksums)
      };
    }
  }, {
    key: "isValidExtension",
    value: function isValidExtension(extension) {
      return extension in SymbologySettings.Extension || values$1(SymbologySettings.Extension).includes(extension.toLowerCase());
    }
  }, {
    key: "isValidChecksum",
    value: function isValidChecksum(checksum) {
      return checksum in SymbologySettings.Checksum || values$1(SymbologySettings.Checksum).includes(checksum.toLowerCase());
    }
  }]);

  return SymbologySettings;
}(); // istanbul ignore next

(function (SymbologySettings) {
  /**
   * @hidden
   *
   * Get a range of numbers.
   *
   * @param from The range start (inclusive).
   * @param to The range end (inclusive).
   * @returns The range of numbers.
   */
  function getNumberRange(from, to) {
    return from$1({
      length: to - from + 1
    }, function (_, k) {
      return k + from;
    });
  }

  SymbologySettings.getNumberRange = getNumberRange;
  /**
   * Symbology extensions for particular functionalities, only applicable to specific barcodes.
   * See: https://docs.scandit.com/stable/c_api/symbologies.html.
   */

  var Extension;

  (function (Extension) {
    /**
     * Improve scan performance when reading direct part marked (DPM) Data Matrix codes.
     * Enabling this extension comes at the cost of increased frame processing times.
     */
    Extension["DIRECT_PART_MARKING_MODE"] = "direct_part_marking_mode";
    /**
     * Interpret the Code 39 / Code 93 code data using two symbols per output character to encode all ASCII characters.
     */

    Extension["FULL_ASCII"] = "full_ascii";
    /**
     * Enable scanning codes that have quiet zones (white area before and after the code) significantly smaller
     * than what's allowed by the symbology specification.
     */

    Extension["RELAXED_SHARP_QUIET_ZONE_CHECK"] = "relaxed_sharp_quiet_zone_check";
    /**
     * Remove the leading zero digit from the result.
     */

    Extension["REMOVE_LEADING_ZERO"] = "remove_leading_zero";
    /**
     * Remove the leading zero digit from the result if the UPC-A representation extension "RETURN_AS_UPCA" is enabled.
     */

    Extension["REMOVE_LEADING_UPCA_ZERO"] = "remove_leading_upca_zero";
    /**
     * Transform the UPC-E result into its UPC-A representation.
     */

    Extension["RETURN_AS_UPCA"] = "return_as_upca";
    /**
     * Remove the leading FNC1 character that indicates a GS1 code.
     */

    Extension["STRIP_LEADING_FNC1"] = "strip_leading_fnc1";
  })(Extension = SymbologySettings.Extension || (SymbologySettings.Extension = {}));
  /**
   * Checksum algorithms, only applicable to specific barcodes.
   * See: https://docs.scandit.com/stable/c_api/symbologies.html.
   */


  var Checksum;

  (function (Checksum) {
    /**
     * Modulo 10 checksum.
     */
    Checksum["MOD_10"] = "mod10";
    /**
     * Modulo 11 checksum.
     */

    Checksum["MOD_11"] = "mod11";
    /**
     * Modulo 16 checksum.
     */

    Checksum["MOD_16"] = "mod16";
    /**
     * Modulo 43 checksum.
     */

    Checksum["MOD_43"] = "mod43";
    /**
     * Modulo 47 checksum.
     */

    Checksum["MOD_47"] = "mod47";
    /**
     * Modulo 103 checksum.
     */

    Checksum["MOD_103"] = "mod103";
    /**
     * Two modulo 10 checksums.
     */

    Checksum["MOD_1010"] = "mod1010";
    /**
     * Modulo 11 and modulo 10 checksum.
     */

    Checksum["MOD_1110"] = "mod1110";
  })(Checksum = SymbologySettings.Checksum || (SymbologySettings.Checksum = {}));
  /**
   * @hidden
   */


  SymbologySettings.defaultActiveSymbolCounts = {
    [Barcode.Symbology.CODABAR]: getNumberRange(7, 20),
    [Barcode.Symbology.CODE11]: getNumberRange(7, 20),
    [Barcode.Symbology.CODE128]: getNumberRange(6, 40),
    [Barcode.Symbology.CODE25]: getNumberRange(7, 20),
    [Barcode.Symbology.CODE32]: [8],
    [Barcode.Symbology.CODE39]: getNumberRange(6, 40),
    [Barcode.Symbology.CODE93]: getNumberRange(6, 40),
    [Barcode.Symbology.EAN13]: [12],
    [Barcode.Symbology.EAN8]: [8],
    [Barcode.Symbology.FIVE_DIGIT_ADD_ON]: [5],
    [Barcode.Symbology.GS1_DATABAR_EXPANDED]: getNumberRange(1, 11),
    [Barcode.Symbology.GS1_DATABAR_LIMITED]: [1],
    [Barcode.Symbology.GS1_DATABAR]: [2],
    [Barcode.Symbology.IATA_2_OF_5]: getNumberRange(7, 20),
    [Barcode.Symbology.INTERLEAVED_2_OF_5]: getNumberRange(6, 40),
    [Barcode.Symbology.KIX]: getNumberRange(7, 24),
    [Barcode.Symbology.LAPA4SC]: [16],
    [Barcode.Symbology.MSI_PLESSEY]: getNumberRange(6, 32),
    [Barcode.Symbology.RM4SCC]: getNumberRange(7, 24),
    [Barcode.Symbology.TWO_DIGIT_ADD_ON]: [2],
    [Barcode.Symbology.UPCA]: [12],
    [Barcode.Symbology.UPCE]: [6]
  };
  /**
   * @hidden
   */

  SymbologySettings.defaultExtensions = {
    [Barcode.Symbology.CODE128]: [Extension.STRIP_LEADING_FNC1],
    [Barcode.Symbology.DATA_MATRIX]: [Extension.STRIP_LEADING_FNC1]
  };
  /**
   * @hidden
   */

  SymbologySettings.defaultChecksums = {
    [Barcode.Symbology.MSI_PLESSEY]: [Checksum.MOD_10],
    [Barcode.Symbology.CODE11]: [Checksum.MOD_11]
  };
})(SymbologySettings || (SymbologySettings = {}));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof symbol$1 === "undefined" || o[iterator$1] == null) { if (isArray$1(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = getIterator$1(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return from$1(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
/**
 * A configuration object for scanning options.
 *
 * Modified ScanSettings need to be applied to a scanner via
 * [[BarcodePicker.applyScanSettings]] or [[Scanner.applyScanSettings]] to take effect.
 */

var ScanSettings = /*#__PURE__*/function () {
  /**
   * Create a ScanSettings instance.
   *
   * @param enabledSymbologies <div class="tsd-signature-symbol">Default =&nbsp;[]</div>
   * The single symbology or list/set of symbologies that should be initialized as enabled for recognition.
   * @param codeDuplicateFilter <div class="tsd-signature-symbol">Default =&nbsp;0</div>
   * The duplicate filter specifying how often a code can be scanned.
   * When the filter is set to -1, each unique code is only scanned once. When set to 0,
   * duplicate filtering is disabled. Otherwise the duplicate filter specifies an interval in milliseconds.
   * When the same code (data/symbology) is scanned within the specified interval it is filtered out as a duplicate.
   * @param maxNumberOfCodesPerFrame <div class="tsd-signature-symbol">Default =&nbsp;1</div>
   * The maximum number of barcodes to be recognized every frame.
   * @param searchArea <div class="tsd-signature-symbol">Default =&nbsp;{ x: 0, y: 0, width: 1.0, height: 1.0 }</div>
   * The area of the image in which barcodes are searched.
   * @param gpuAcceleration <div class="tsd-signature-symbol">Default =&nbsp;true</div>
   * Whether to enable/disable GPU support via WebGL, to provide faster and more accurate barcode localization.
   * The GPU can and will be used only if the browser also supports the needed technologies
   * ([WebGL](https://caniuse.com/#feat=webgl) and [OffscreenCanvas](https://caniuse.com/#feat=offscreencanvas)).
   * @param blurryRecognition <div class="tsd-signature-symbol">Default =&nbsp;true</div>
   * Whether to enable/disable blurry recognition, to allow accurate scanning capabilities for out-of-focus (1D) codes.
   * If enabled, more advanced algorithms are executed (and more resources/time is spent) every frame in order
   * to successfully locate/scan difficult codes.
   * @param codeDirectionHint <div class="tsd-signature-symbol">Default =&nbsp;CodeDirection.LEFT_TO_RIGHT</div>
   * The code direction hint telling in what direction 1D codes are most likely orientated.
   * More advanced algorithms are executed (and more resources/time is spent) every frame in order to successfully
   * locate/scan difficult codes for each of the possible directions resulting by the direction hint. Note that this
   * results in slow performance for `none` hints, average performance for `horizontal` and `vertical` hints and fast
   * performance for the remaining hints.
   */
  function ScanSettings() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$enabledSymbologi = _ref.enabledSymbologies,
        enabledSymbologies = _ref$enabledSymbologi === void 0 ? [] : _ref$enabledSymbologi,
        _ref$codeDuplicateFil = _ref.codeDuplicateFilter,
        codeDuplicateFilter = _ref$codeDuplicateFil === void 0 ? 0 : _ref$codeDuplicateFil,
        _ref$maxNumberOfCodes = _ref.maxNumberOfCodesPerFrame,
        maxNumberOfCodesPerFrame = _ref$maxNumberOfCodes === void 0 ? 1 : _ref$maxNumberOfCodes,
        _ref$searchArea = _ref.searchArea,
        searchArea = _ref$searchArea === void 0 ? {
      x: 0,
      y: 0,
      width: 1.0,
      height: 1.0
    } : _ref$searchArea,
        _ref$gpuAcceleration = _ref.gpuAcceleration,
        gpuAcceleration = _ref$gpuAcceleration === void 0 ? true : _ref$gpuAcceleration,
        _ref$blurryRecognitio = _ref.blurryRecognition,
        blurryRecognition = _ref$blurryRecognitio === void 0 ? true : _ref$blurryRecognitio,
        _ref$codeDirectionHin = _ref.codeDirectionHint,
        codeDirectionHint = _ref$codeDirectionHin === void 0 ? ScanSettings.CodeDirection.LEFT_TO_RIGHT : _ref$codeDirectionHin;

    classCallCheck(this, ScanSettings);

    this.symbologySettings = new map$1();
    this.enableSymbologies(enabledSymbologies);
    this.codeDuplicateFilter = codeDuplicateFilter;
    this.maxNumberOfCodesPerFrame = maxNumberOfCodesPerFrame;
    this.baseSearchArea = {
      x: 0,
      y: 0,
      width: 1.0,
      height: 1.0
    };
    this.searchArea = searchArea;
    this.gpuAcceleration = gpuAcceleration;
    this.blurryRecognition = blurryRecognition;
    this.codeDirectionHint = codeDirectionHint;
    this.properties = new map$1([["advanced_localization", 0]]);
  }
  /**
   * @returns The configuration object as a JSON string.
   */


  createClass(ScanSettings, [{
    key: "toJSONString",
    value: function toJSONString() {
      var symbologies = {};
      this.symbologySettings.forEach(function (symbologySettings, symbology) {
        symbologies[Barcode.Symbology.toJSONName(symbology)] = symbologySettings;
      });
      var properties = {};
      this.properties.forEach(function (value, key) {
        properties[key] = value;
      });
      var combinedSearchArea = {
        x: Math.max(0, Math.min(1, this.baseSearchArea.x + this.searchArea.x * this.baseSearchArea.width)),
        y: Math.max(0, Math.min(1, this.baseSearchArea.y + this.searchArea.y * this.baseSearchArea.height)),
        width: Math.max(0, Math.min(1, this.baseSearchArea.width * this.searchArea.width)),
        height: Math.max(0, Math.min(1, this.baseSearchArea.height * this.searchArea.height))
      };
      var isFullSearchArea = Math.round(combinedSearchArea.x * 100) === 0 && Math.round(combinedSearchArea.y * 100) === 0 && Math.round(combinedSearchArea.width * 100) === 100 && Math.round(combinedSearchArea.height * 100) === 100;
      return stringify$1({
        symbologies,
        codeDuplicateFilter: this.codeDuplicateFilter,
        maxNumberOfCodesPerFrame: this.maxNumberOfCodesPerFrame,
        searchArea: combinedSearchArea,
        codeLocation1d: isFullSearchArea ? undefined : {
          area: {
            x: combinedSearchArea.x,
            y: combinedSearchArea.y + combinedSearchArea.height * 0.75 / 2,
            width: combinedSearchArea.width,
            height: combinedSearchArea.height * 0.25
          }
        },
        codeLocation2d: isFullSearchArea ? undefined : {
          area: combinedSearchArea
        },
        gpuAcceleration: this.gpuAcceleration,
        blurryRecognition: this.blurryRecognition,
        codeDirectionHint: this.codeDirectionHint,
        properties
      });
    }
    /**
     * Get the configuration object for a symbology (which can then be modified).
     *
     * @param symbology The symbology for which to retrieve the configuration.
     * @returns The symbology configuration object for the specified symbology.
     */

  }, {
    key: "getSymbologySettings",
    value: function getSymbologySettings(symbology) {
      if (this.symbologySettings.has(symbology)) {
        return this.symbologySettings.get(symbology);
      } else {
        if (symbology in Barcode.Symbology || values$1(Barcode.Symbology).includes(symbology)) {
          this.symbologySettings.set(symbology, new SymbologySettings(symbology));
          return this.symbologySettings.get(symbology);
        } else {
          throw new TypeError("Invalid symbology \"".concat(symbology, "\""));
        }
      }
    }
    /**
     * Get the recognition enabled status for a symbology.
     *
     * By default no symbologies are enabled.
     *
     * @param symbology The symbology for which to retrieve the recognition enabled status.
     * @returns Whether the symbology enabled for recognition.
     */

  }, {
    key: "isSymbologyEnabled",
    value: function isSymbologyEnabled(symbology) {
      return this.symbologySettings.has(symbology) && this.symbologySettings.get(symbology).isEnabled();
    }
    /**
     * Enable recognition of a symbology or list/set of symbologies.
     *
     * By default no symbologies are enabled.
     *
     * @param symbology The single symbology or list/set of symbologies to enable.
     * @returns The updated [[ScanSettings]] object.
     */

  }, {
    key: "enableSymbologies",
    value: function enableSymbologies(symbology) {
      return this.setSymbologiesEnabled(symbology, true);
    }
    /**
     * Disable recognition of a symbology or list/set of symbologies.
     *
     * By default no symbologies are enabled.
     *
     * @param symbology The single symbology or list/set of symbologies to disable.
     * @returns The updated [[ScanSettings]] object.
     */

  }, {
    key: "disableSymbologies",
    value: function disableSymbologies(symbology) {
      return this.setSymbologiesEnabled(symbology, false);
    }
    /**
     * Get the code duplicate filter value.
     *
     * By default duplicate filtering is disabled.
     *
     * @returns The code duplicate filter value.
     */

  }, {
    key: "getCodeDuplicateFilter",
    value: function getCodeDuplicateFilter() {
      return this.codeDuplicateFilter;
    }
    /**
     * Set the code duplicate filter value.
     *
     * When the filter is set to -1, each unique code is only scanned once. When set to 0,
     * duplicate filtering is disabled. Otherwise the duplicate filter specifies an interval in milliseconds.
     *
     * By default duplicate filtering is disabled.
     *
     * @param durationMilliseconds The new value (-1, 0, or positive integer).
     * @returns The updated [[ScanSettings]] object.
     */

  }, {
    key: "setCodeDuplicateFilter",
    value: function setCodeDuplicateFilter(durationMilliseconds) {
      this.codeDuplicateFilter = durationMilliseconds;
      return this;
    }
    /**
     * Get the maximum number of barcodes to be recognized every frame.
     *
     * By default the maximum number of barcodes per frame is 1.
     *
     * @returns The maximum number of barcodes per frame.
     */

  }, {
    key: "getMaxNumberOfCodesPerFrame",
    value: function getMaxNumberOfCodesPerFrame() {
      return this.maxNumberOfCodesPerFrame;
    }
    /**
     * Set the maximum number of barcodes to be recognized every frame.
     *
     * By default the maximum number of barcodes per frame is 1.
     *
     * @param limit The new maximum number of barcodes per frame alue (non-zero positive integer).
     * @returns The updated [[ScanSettings]] object.
     */

  }, {
    key: "setMaxNumberOfCodesPerFrame",
    value: function setMaxNumberOfCodesPerFrame(limit) {
      this.maxNumberOfCodesPerFrame = limit;
      return this;
    }
    /**
     * Get the area of the image in which barcodes are searched.
     *
     * By default the whole area is searched.
     *
     * @returns The search area.
     */

  }, {
    key: "getSearchArea",
    value: function getSearchArea() {
      return this.searchArea;
    }
    /**
     * Set the area of the image in which barcodes are searched.
     *
     * By default the whole area is searched.
     *
     * @param searchArea The new search area.
     * @returns The updated [[ScanSettings]] object.
     */

  }, {
    key: "setSearchArea",
    value: function setSearchArea(searchArea) {
      this.searchArea = searchArea;
      return this;
    }
    /**
     * @hidden
     *
     * @returns The base area of the image in which barcodes are searched.
     */

  }, {
    key: "getBaseSearchArea",
    value: function getBaseSearchArea() {
      return this.baseSearchArea;
    }
    /**
     * @hidden
     *
     * Set the base area of the image in which barcodes are searched, this is set automatically by a [[BarcodePicker]]
     * and is combined with the searchArea to obtain the final combined search area.
     *
     * @param baseSearchArea The new base search area.
     * @returns The updated [[ScanSettings]] object.
     */

  }, {
    key: "setBaseSearchArea",
    value: function setBaseSearchArea(baseSearchArea) {
      this.baseSearchArea = baseSearchArea;
      return this;
    }
    /**
     * Get the GPU acceleration enabled status.
     *
     * By default GPU acceleration is enabled.
     *
     * @returns Whether GPU acceleration is configured to be enabled ot not.
     */

  }, {
    key: "isGpuAccelerationEnabled",
    value: function isGpuAccelerationEnabled() {
      return this.gpuAcceleration;
    }
    /**
     * Enable or disable GPU acceleration.
     *
     * By default GPU acceleration is enabled.
     *
     * Provide faster and more accurate barcode localization.
     * The GPU will in any case be used only if the browser also supports the needed technologies
     * ([WebGL](https://caniuse.com/#feat=webgl) and [OffscreenCanvas](https://caniuse.com/#feat=offscreencanvas)).
     *
     * @param enabled Whether to enable or disable GPU acceleration.
     * @returns The updated [[ScanSettings]] object.
     */

  }, {
    key: "setGpuAccelerationEnabled",
    value: function setGpuAccelerationEnabled(enabled) {
      this.gpuAcceleration = enabled;
      return this;
    }
    /**
     * Get the blurry recognition enabled status.
     *
     * By default blurry recognition is enabled.
     *
     * @returns Whether blurry recognition is configured to be enabled ot not.
     */

  }, {
    key: "isBlurryRecognitionEnabled",
    value: function isBlurryRecognitionEnabled() {
      return this.blurryRecognition;
    }
    /**
     * Enable or disable blurry recognition.
     *
     * Allow accurate scanning capabilities for out-of-focus (1D) codes.
     * If enabled, more advanced algorithms are executed (and more resources/time is spent) every frame in order
     * to successfully locate/scan difficult codes.
     *
     * By default blurry recognition is enabled.
     *
     * @param enabled Whether to enable or disable blurry recognition.
     * @returns The updated [[ScanSettings]] object.
     */

  }, {
    key: "setBlurryRecognitionEnabled",
    value: function setBlurryRecognitionEnabled(enabled) {
      this.blurryRecognition = enabled;
      return this;
    }
    /**
     * Get the code direction hint telling in what direction 1D codes are most likely orientated.
     *
     * By default `left-to-right` is used.
     *
     * @returns The code direction hint.
     */

  }, {
    key: "getCodeDirectionHint",
    value: function getCodeDirectionHint() {
      return this.codeDirectionHint;
    }
    /**
     * Set the code direction hint telling in what direction 1D codes are most likely orientated.
     *
     * More advanced algorithms are executed (and more resources/time is spent) every frame in order to successfully
     * locate/scan difficult codes for each of the possible directions resulting by the direction hint. Note that this
     * results in slow performance for `none` hints, average performance for `horizontal` and `vertical` hints and fast
     * performance for the remaining hints.
     *
     * By default `left-to-right` is used.
     *
     * @param codeDirectionHint The new code direction hint.
     * @returns The updated [[ScanSettings]] object.
     */

  }, {
    key: "setCodeDirectionHint",
    value: function setCodeDirectionHint(codeDirectionHint) {
      this.codeDirectionHint = codeDirectionHint;
      return this;
    }
    /**
     * Get a Scandit Engine library property.
     *
     * This function is for internal use only and any functionality that can be accessed through it can and will vanish
     * without public notice from one version to the next. Do not call this function unless you specifically have to.
     *
     * @param key The property name.
     * @returns The property value. For properties not previously set, -1 is returned.
     */

  }, {
    key: "getProperty",
    value: function getProperty(key) {
      if (this.properties.has(key)) {
        return this.properties.get(key);
      }

      return -1;
    }
    /**
     * Set a Scandit Engine library property.
     *
     * This function is for internal use only and any functionality that can be accessed through it can and will vanish
     * without public notice from one version to the next. Do not call this function unless you specifically have to.
     *
     * @param key The property name.
     * @param value The property value.
     * @returns The updated [[ScanSettings]] object.
     */

  }, {
    key: "setProperty",
    value: function setProperty(key, value) {
      this.properties.set(key, value);
      return this;
    }
  }, {
    key: "setSingleSymbologyEnabled",
    value: function setSingleSymbologyEnabled(symbology, enabled) {
      if (symbology in Barcode.Symbology || values$1(Barcode.Symbology).includes(symbology)) {
        if (this.symbologySettings.has(symbology)) {
          this.symbologySettings.get(symbology).setEnabled(enabled);
        } else {
          this.symbologySettings.set(symbology, new SymbologySettings(symbology, enabled));
        }
      } else {
        throw new TypeError("Invalid symbology \"".concat(symbology, "\""));
      }
    }
  }, {
    key: "setMultipleSymbologiesEnabled",
    value: function setMultipleSymbologiesEnabled(symbology, enabled) {
      var _iterator = _createForOfIteratorHelper(symbology),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var s = _step.value;

          if (!(s in Barcode.Symbology || values$1(Barcode.Symbology).includes(s))) {
            throw new TypeError("Invalid symbology \"".concat(s, "\""));
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var _iterator2 = _createForOfIteratorHelper(symbology),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _s = _step2.value;

          if (this.symbologySettings.has(_s)) {
            this.symbologySettings.get(_s).setEnabled(enabled);
          } else {
            this.symbologySettings.set(_s, new SymbologySettings(_s, enabled));
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "setSymbologiesEnabled",
    value: function setSymbologiesEnabled(symbology, enabled) {
      if (typeof symbology === "object") {
        this.setMultipleSymbologiesEnabled(symbology, enabled);
      } else {
        this.setSingleSymbologyEnabled(symbology, enabled);
      }

      return this;
    }
  }]);

  return ScanSettings;
}(); // istanbul ignore next

(function (ScanSettings) {

  (function (CodeDirection) {
    /**
     * Left to right.
     */
    CodeDirection["LEFT_TO_RIGHT"] = "left-to-right";
    /**
     * Right to left.
     */

    CodeDirection["RIGHT_TO_LEFT"] = "right-to-left";
    /**
     * Bottom to top.
     */

    CodeDirection["BOTTOM_TO_TOP"] = "bottom-to-top";
    /**
     * Top to bottom.
     */

    CodeDirection["TOP_TO_BOTTOM"] = "top-to-bottom";
    /**
     * Left to right or right to left.
     */

    CodeDirection["HORIZONTAL"] = "horizontal";
    /**
     * Bottom to top or top to bottom.
     */

    CodeDirection["VERTICAL"] = "vertical";
    /**
     * Unknown.
     */

    CodeDirection["NONE"] = "none";
  })(ScanSettings.CodeDirection || (ScanSettings.CodeDirection = {}));
})(ScanSettings || (ScanSettings = {}));

/**
 * A low-level scanner interacting with the external Scandit Engine library.
 * Used to set up scan / image settings and to process single image frames.
 *
 * The loading of the external Scandit Engine library can take some time, the [[on]] method targeting the [[ready]]
 * event can be used to set up a listener function to be called when the library is loaded and the [[isReady]] method
 * can return the current status. The scanner will be ready to start scanning when the library is fully loaded.
 *
 * By default the external Scandit Engine library is preloaded in order to reduce the initialization time as much as
 * possible.
 *
 * In the special case where a single [[Scanner]] instance is shared between multiple active [[BarcodePicker]]
 * instances, the fairness in resource allocation for processing images between the different pickers is not guaranteed.
 */


var Scanner = /*#__PURE__*/function () {
  /**
   * Create a Scanner instance.
   *
   * It is required to having configured the library via [[configure]] before this object can be created.
   *
   * Before processing an image the relative settings must also have been set.
   *
   * Depending on library configuration, browser features and user permissions for camera access, any of the following
   * errors could be thrown:
   * - `LibraryNotConfiguredError`
   * - `UnsupportedBrowserError`
   *
   * @param scanSettings <div class="tsd-signature-symbol">Default =&nbsp;new ScanSettings()</div>
   * The configuration object for scanning options.
   * @param imageSettings <div class="tsd-signature-symbol">Default =&nbsp;undefined</div>
   * The configuration object to define the properties of an image to be scanned.
   */
  function Scanner() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$scanSettings = _ref.scanSettings,
        scanSettings = _ref$scanSettings === void 0 ? new ScanSettings() : _ref$scanSettings,
        imageSettings = _ref.imageSettings;

    classCallCheck(this, Scanner);

    var browserCompatibility = BrowserHelper.checkBrowserCompatibility();

    if (!browserCompatibility.scannerSupport) {
      throw new UnsupportedBrowserError(browserCompatibility);
    }

    if (configurePhase !== "done") {
      throw new CustomError({
        name: "LibraryNotConfiguredError",
        message: configurePhase === "started" ? "The library has not completed its configuration yet, please call 'configure' and wait for the returned\n            promise's resolution" : "The library was not configured yet, 'configure' must be called with valid parameters before instantiating\n            the Scanner"
      });
    }

    this.eventEmitter = new eventemitter3.EventEmitter();
    this.isReadyToWork = false;
    this.workerScanQueueLength = 0;
    this.workerParseRequestId = 0;
    this.engineWorker = engineLoader.getEngineWorker();
    this.engineWorker.onmessage = this.engineWorkerOnMessage.bind(this);
    EngineLoader.load(this.engineWorker);
    this.activeBlurryRecognitionSymbologies = new set$1();
    this.blurryRecognitionAvailable = false;
    this.applyScanSettings(scanSettings);

    if (imageSettings != null) {
      this.applyImageSettings(imageSettings);
    }

    blurryRecognitionPreloader.on("blurryTablesUpdate", this.handleBlurryTablesUpdate.bind(this));
  }
  /**
   * Fired when the external Scandit Engine library has been loaded and the scanner can thus start to scan barcodes.
   *
   * @event
   */
  // tslint:disable-next-line: no-empty


  createClass(Scanner, [{
    key: "destroy",
    value:
    /**
     * Stop/reset the internal WebWorker and destroy the scanner itself; ensuring complete cleanup.
     *
     * This method should be called after you don't plan to use the scanner anymore,
     * before the object is automatically cleaned up by JavaScript.
     * The scanner must not be used in any way after this call.
     */
    function destroy() {
      if (this.engineWorker != null) {
        engineLoader.returnEngineWorker(this.engineWorker);
      }

      this.eventEmitter.removeAllListeners();
    }
    /**
     * Apply a new set of scan settings to the scanner (replacing old settings).
     *
     * @param scanSettings The scan configuration object to be applied to the scanner.
     * @returns The updated [[Scanner]] object.
     */

  }, {
    key: "applyScanSettings",
    value: function applyScanSettings(scanSettings) {
      var _this = this;

      this.scanSettings = scanSettings;
      blurryRecognitionPreloader.updateBlurryRecognitionPriority(this.scanSettings);
      var activeBlurryRecognitionSymbologies = blurryRecognitionPreloader.getEnabledSymbologies(this.scanSettings);
      this.blurryRecognitionAvailable = blurryRecognitionPreloader.isBlurryRecognitionAvailable(this.scanSettings);
      this.engineWorker.postMessage({
        type: "scan-settings",
        settings: this.scanSettings.toJSONString(),
        blurryRecognitionAvailable: this.blurryRecognitionAvailable,
        blurryRecognitionRequiresUpdate: activeBlurryRecognitionSymbologies.some(function (symbology) {
          return !_this.activeBlurryRecognitionSymbologies.has(symbology);
        })
      });

      if (this.blurryRecognitionAvailable) {
        this.activeBlurryRecognitionSymbologies = new set$1([].concat(toConsumableArray(this.activeBlurryRecognitionSymbologies), toConsumableArray(activeBlurryRecognitionSymbologies)));
      }

      this.eventEmitter.emit("newScanSettings", this.scanSettings);
      return this;
    }
    /**
     * Apply a new set of image settings to the scanner (replacing old settings).
     *
     * @param imageSettings The image configuration object to be applied to the scanner.
     * @returns The updated [[Scanner]] object.
     */

  }, {
    key: "applyImageSettings",
    value: function applyImageSettings(imageSettings) {
      this.imageSettings = imageSettings;
      this.engineWorker.postMessage({
        type: "image-settings",
        imageSettings
      });
      return this;
    }
    /**
     * Clear the scanner session.
     *
     * This removes all recognized barcodes from the scanner session and allows them to be scanned again in case a custom
     * *codeDuplicateFilter* was set in the [[ScanSettings]].
     *
     * @returns The updated [[Scanner]] object.
     */

  }, {
    key: "clearSession",
    value: function clearSession() {
      this.engineWorker.postMessage({
        type: "clear-session"
      });
      return this;
    }
    /**
     * Process a given image using the previously set scanner and image settings,
     * recognizing codes and retrieving the result as a list of barcodes (if any).
     *
     * Multiple requests done without waiting for previous results will be queued and handled in order.
     *
     * If *highQualitySingleFrameMode* is enabled the image will be processed with really accurate internal settings,
     * resulting in much slower but more precise scanning results. This should be used only for single images not part
     * of a continuous video stream.
     *
     * Passing image data as a *Uint8Array* is the fastest option, passing a *HTMLImageElement*
     * will incur in additional operations.
     *
     * Data passed to this function is "detached"/"neutered" becoming unusable as it's being passed to the external
     * Scandit Engine library. You can access the same data once it's returned in the [[ScanResult.imageData]] property.
     *
     * Depending on the current image settings, given *imageData* and scanning execution, any of the following errors
     * could be the rejected result of the returned promise:
     * - `NoImageSettings`
     * - `ImageSettingsDataMismatch`
     * - `ScanditEngineError`
     *
     * @param imageData The image data given as byte array or image element, complying with the previously set
     * image settings.
     * @param highQualitySingleFrameMode Whether to process the image as a high quality single frame.
     * @returns A promise resolving to the [[ScanResult]] object.
     */

  }, {
    key: "processImage",
    value: function () {
      var _processImage = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(imageData) {
        var _this2 = this;

        var highQualitySingleFrameMode,
            channels,
            _args = arguments;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                highQualitySingleFrameMode = _args.length > 1 && _args[1] !== undefined ? _args[1] : false;

                if (!(this.imageSettings == null)) {
                  _context.next = 3;
                  break;
                }

                throw new CustomError({
                  name: "NoImageSettings",
                  message: "No image settings set up in the scanner"
                });

              case 3:
                if (imageData instanceof HTMLImageElement) {
                  if (this.imageDataConversionContext == null) {
                    this.imageDataConversionContext = document.createElement("canvas").getContext("2d");
                  }

                  this.imageDataConversionContext.canvas.width = imageData.naturalWidth;
                  this.imageDataConversionContext.canvas.height = imageData.naturalHeight;
                  this.imageDataConversionContext.drawImage(imageData, 0, 0, imageData.naturalWidth, imageData.naturalHeight);
                  imageData = new Uint8Array(this.imageDataConversionContext.getImageData(0, 0, imageData.naturalWidth, imageData.naturalHeight).data.buffer);
                }

                _context.t0 = this.imageSettings.format.valueOf();
                _context.next = _context.t0 === ImageSettings.Format.GRAY_8U ? 7 : _context.t0 === ImageSettings.Format.RGB_8U ? 9 : _context.t0 === ImageSettings.Format.RGBA_8U ? 11 : 13;
                break;

              case 7:
                channels = 1;
                return _context.abrupt("break", 15);

              case 9:
                channels = 3;
                return _context.abrupt("break", 15);

              case 11:
                channels = 4;
                return _context.abrupt("break", 15);

              case 13:
                channels = 1;
                return _context.abrupt("break", 15);

              case 15:
                if (!(this.imageSettings.width * this.imageSettings.height * channels !== imageData.length)) {
                  _context.next = 17;
                  break;
                }

                throw new CustomError({
                  name: "ImageSettingsDataMismatch",
                  message: "The provided image data doesn't match the previously set image settings"
                });

              case 17:
                Scanner.workerScanRequestId++;
                this.workerScanQueueLength++;
                return _context.abrupt("return", new promise$1(function (resolve, reject) {
                  var workResultEvent = "workResult-".concat(Scanner.workerScanRequestId);
                  var workErrorEvent = "workError-".concat(Scanner.workerScanRequestId);

                  _this2.eventEmitter.once(workResultEvent, function (workResult, returnedImageData) {
                    _this2.eventEmitter.removeAllListeners(workErrorEvent);

                    _this2.workerScanQueueLength--;
                    resolve(new ScanResult(workResult.scanResult.map(Barcode.createFromWASMResult), returnedImageData, _this2.imageSettings));
                  });

                  _this2.eventEmitter.once(workErrorEvent, function (error, _) {
                    console.error("Scandit Engine error (".concat(error.errorCode, "):"), error.errorMessage);

                    _this2.eventEmitter.removeAllListeners(workResultEvent);

                    _this2.workerScanQueueLength--;
                    var errorObject = new CustomError({
                      name: "ScanditEngineError",
                      message: "".concat(error.errorMessage, " (").concat(error.errorCode, ")")
                    });
                    reject(errorObject);
                  });

                  _this2.engineWorker.postMessage({
                    type: "scan-image",
                    requestId: Scanner.workerScanRequestId,
                    data: imageData,
                    highQualitySingleFrameMode
                  }, [imageData.buffer]);
                }));

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function processImage(_x) {
        return _processImage.apply(this, arguments);
      }

      return processImage;
    }()
    /**
     * @returns Whether the scanner is currently busy processing an image.
     */

  }, {
    key: "isBusyProcessing",
    value: function isBusyProcessing() {
      return this.workerScanQueueLength !== 0;
    }
    /**
     * @returns Whether the scanner has loaded the external Scandit Engine library and is ready to scan.
     */

  }, {
    key: "isReady",
    value: function isReady() {
      return this.isReadyToWork;
    }
  }, {
    key: "on",
    value: function on(eventName, listener) {
      if (eventName === "ready") {
        if (this.isReadyToWork) {
          listener();
        } else {
          this.eventEmitter.once(eventName, listener, this);
        }
      } else if (eventName === "contextCreated") {
        if (this.licenseKeyFeatures != null) {
          listener(this.licenseKeyFeatures);
        } else {
          this.eventEmitter.once(eventName, listener, this);
        }
      } else {
        this.eventEmitter.on(eventName, listener, this);
      }

      return this;
    }
    /**
     * *See the [[on]] method.*
     *
     * @param eventName The name of the event to listen to.
     * @param listener The listener function.
     * @returns The updated [[Scanner]] object.
     */

  }, {
    key: "addListener",
    value: function addListener(eventName, listener) {
      return this.on(eventName, listener);
    }
    /**
     * Create a new parser object.
     *
     * @param dataFormat The format of the input data for the parser.
     * @returns The newly created parser.
     */

  }, {
    key: "createParserForFormat",
    value: function createParserForFormat(dataFormat) {
      return new Parser(this, dataFormat);
    }
    /**
     * Return the current image settings.
     *
     * Note that modifying this object won't directly apply these settings: the [[applyImageSettings]] method must be
     * called with the updated object.
     *
     * @returns The current image settings.
     */

  }, {
    key: "getImageSettings",
    value: function getImageSettings() {
      return this.imageSettings;
    }
    /**
     * Return the current scan settings.
     *
     * Note that modifying this object won't directly apply these settings: the [[applyScanSettings]] method must be
     * called with the updated object.
     *
     * @returns The current scan settings.
     */

  }, {
    key: "getScanSettings",
    value: function getScanSettings() {
      return this.scanSettings;
    }
    /**
     * @hidden
     *
     * Process a given string or byte array using the Scandit Parser library,
     * parsing the data in the given format and retrieving the result as a [[ParserResult]] object.
     *
     * Multiple requests done without waiting for previous results will be queued and handled in order.
     *
     * If parsing of the data fails the returned promise is rejected with a `ScanditEngineError` error.
     *
     * @param dataFormat The format of the given data.
     * @param data The string or byte array containing the data to be parsed.
     * @param options Options for the specific data format parser.
     * @returns A promise resolving to the [[ParserResult]] object.
     */

  }, {
    key: "parse",
    value: function () {
      var _parse = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(dataFormat, data, options) {
        var _this3 = this;

        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.workerParseRequestId++;
                return _context2.abrupt("return", new promise$1(function (resolve, reject) {
                  var parseResultEvent = "parseResult-".concat(_this3.workerParseRequestId);
                  var parseErrorEvent = "parseError-".concat(_this3.workerParseRequestId);

                  _this3.eventEmitter.once(parseResultEvent, function (result) {
                    _this3.eventEmitter.removeAllListeners(parseErrorEvent);

                    var parserResult = {
                      jsonString: result,
                      fields: [],
                      fieldsByName: {}
                    };
                    JSON.parse(result).forEach(function (parserField) {
                      parserResult.fields.push(parserField);
                      parserResult.fieldsByName[parserField.name] = parserField;
                    });
                    resolve(parserResult);
                  });

                  _this3.eventEmitter.once(parseErrorEvent, function (error) {
                    console.error("Scandit Engine error (".concat(error.errorCode, "):"), error.errorMessage);

                    _this3.eventEmitter.removeAllListeners(parseResultEvent);

                    var errorObject = new CustomError({
                      name: "ScanditEngineError",
                      message: "".concat(error.errorMessage, " (").concat(error.errorCode, ")")
                    });
                    reject(errorObject);
                  });

                  _this3.engineWorker.postMessage({
                    type: "parse",
                    requestId: _this3.workerParseRequestId,
                    dataFormat,
                    data,
                    options: options == null ? "{}" : stringify$1(options)
                  });
                }));

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function parse(_x2, _x3, _x4) {
        return _parse.apply(this, arguments);
      }

      return parse;
    }()
    /**
     * @hidden
     *
     * Report new camera properties.
     *
     * This ensures optimal settings usage and detailed analytics information.
     *
     * @param cameraType The camera type (facing mode/direction).
     * @param autofocus Whether the camera supports autofocus, by default it's assumed it does.
     * @returns The updated [[Scanner]] object.
     */

  }, {
    key: "reportCameraProperties",
    value: function reportCameraProperties(cameraType) {
      var autofocus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      this.engineWorker.postMessage({
        type: "camera-properties",
        cameraType,
        autofocus
      });
      return this;
    }
    /**
     * Remove the specified listener from the given event's listener array.
     *
     * @param eventName The name of the event from which to remove the listener.
     * @param listener The listener function to be removed.
     * @returns The updated [[Scanner]] object.
     */

  }, {
    key: "removeListener",
    value: function removeListener(eventName, listener) {
      this.eventEmitter.removeListener(eventName, listener);
      return this;
    }
    /**
     * Remove all listeners from the given event's listener array.
     *
     * @param eventName The name of the event from which to remove all listeners.
     * @returns The updated [[Scanner]] object.
     */

  }, {
    key: "removeAllListeners",
    value: function removeAllListeners(eventName) {
      this.eventEmitter.removeAllListeners(eventName);
      return this;
    }
  }, {
    key: "handleBlurryTablesUpdate",
    value: function handleBlurryTablesUpdate() {
      if (this.blurryRecognitionAvailable) {
        return;
      }

      this.blurryRecognitionAvailable = blurryRecognitionPreloader.isBlurryRecognitionAvailable(this.scanSettings);

      if (this.blurryRecognitionAvailable) {
        this.activeBlurryRecognitionSymbologies = new set$1([].concat(toConsumableArray(this.activeBlurryRecognitionSymbologies), toConsumableArray(blurryRecognitionPreloader.getEnabledSymbologies(this.scanSettings))));
        this.engineWorker.postMessage({
          type: "scan-settings",
          settings: this.scanSettings.toJSONString(),
          blurryRecognitionAvailable: true,
          blurryRecognitionRequiresUpdate: true
        });
      }
    }
  }, {
    key: "engineWorkerOnMessage",
    value: function engineWorkerOnMessage(ev) {
      var data = ev.data;

      if (data[0] === "library-loaded") {
        this.isReadyToWork = true;
        this.eventEmitter.emit("ready");
        return;
      }

      if (data[1] != null) {
        switch (data[0]) {
          case "context-created":
            this.licenseKeyFeatures = data[1];
            this.eventEmitter.emit("contextCreated", this.licenseKeyFeatures);
            break;

          case "work-result":
            this.eventEmitter.emit("workResult-".concat(data[1].requestId), data[1].result, data[2]);
            break;

          case "work-error":
            this.eventEmitter.emit("workError-".concat(data[1].requestId), data[1].error, data[2]);
            break;

          case "parse-result":
            this.eventEmitter.emit("parseResult-".concat(data[1].requestId), data[1].result);
            break;

          case "parse-error":
            this.eventEmitter.emit("parseError-".concat(data[1].requestId), data[1].error);
            break;
        }
      }
    }
  }], [{
    key: "ready",
    value: function ready() {}
  }]);

  return Scanner;
}();
Scanner.workerScanRequestId = 0;

var SingleImageModeSettings;

(function (SingleImageModeSettings) {
  /**
   * @hidden
   *
   * Create a default [[SingleImageModePlatformSettings]] object.
   *
   * @param text The text to display at the top.
   * @param base64image The image to display at the bottom as a button.
   * @returns The generated [[SingleImageModePlatformSettings]] object.
   */
  function getDefaultSingleImageModeSettings(text, base64image) {
    return {
      informationElement: document.createRange().createContextualFragment(text).firstElementChild,
      buttonElement: document.createRange().createContextualFragment(atob(base64image)).firstElementChild,
      containerStyle: {
        backgroundColor: "#333333"
      },
      informationStyle: {
        color: "#FFFFFF"
      },
      buttonStyle: {
        borderColor: "#FFFFFF",
        color: "#FFFFFF",
        fill: "#FFFFFF"
      }
    };
  }

  (function (UsageStrategy) {
    /**
     * Never use Single Image Mode (an error is thrown on [[BarcodePicker]] creation if the OS/browser doesn't support
     * continuous camera video stream scanning).
     */
    UsageStrategy["NEVER"] = "never";
    /**
     * Use Single Image Mode as fallback: only if the OS/browser doesn't support continuous camera video stream
     * scanning.
     */

    UsageStrategy["FALLBACK"] = "fallback";
    /**
     * Force Single Image Mode over continuous camera video stream scanning in all situations.
     */

    UsageStrategy["ALWAYS"] = "always";
  })(SingleImageModeSettings.UsageStrategy || (SingleImageModeSettings.UsageStrategy = {}));
  /**
   * @hidden
   */


  SingleImageModeSettings.defaultDesktop = getDefaultSingleImageModeSettings("<p>To scan:<br>1. Click on the folder icon<br>2. Select the picture to scan</p>", folderImage);
  /**
   * @hidden
   */

  SingleImageModeSettings.defaultMobile = getDefaultSingleImageModeSettings("<p>To scan:<br>1. Tap the camera icon<br>2. Take a picture of the code(s)</p>", cameraImage);
})(SingleImageModeSettings || (SingleImageModeSettings = {}));

// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
_export(_export.S + _export.F * !_descriptors, 'Object', { defineProperties: _objectDps });

var $Object$2 = _core.Object;
var defineProperties = function defineProperties(T, D) {
  return $Object$2.defineProperties(T, D);
};

var defineProperties$1 = defineProperties;

// all object keys, includes non-enumerable and symbols



var Reflect$1 = _global.Reflect;
var _ownKeys = Reflect$1 && Reflect$1.ownKeys || function ownKeys(it) {
  var keys = _objectGopn.f(_anObject(it));
  var getSymbols = _objectGops.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

// https://github.com/tc39/proposal-object-getownpropertydescriptors






_export(_export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = _toIobject(object);
    var getDesc = _objectGopd.f;
    var keys = _ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) _createProperty(result, key, desc);
    }
    return result;
  }
});

var getOwnPropertyDescriptors = _core.Object.getOwnPropertyDescriptors;

var getOwnPropertyDescriptors$1 = getOwnPropertyDescriptors;

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)

var $getOwnPropertyDescriptor$1 = _objectGopd.f;

_objectSap('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor$1(_toIobject(it), key);
  };
});

var $Object$3 = _core.Object;
var getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  return $Object$3.getOwnPropertyDescriptor(it, key);
};

var getOwnPropertyDescriptor$1 = getOwnPropertyDescriptor;

var getOwnPropertySymbols = _core.Object.getOwnPropertySymbols;

var getOwnPropertySymbols$1 = getOwnPropertySymbols;

// 19.1.2.14 Object.keys(O)



_objectSap('keys', function () {
  return function keys(it) {
    return _objectKeys(_toObject(it));
  };
});

var keys = _core.Object.keys;

var keys$1 = keys;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    defineProperty$1(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var defineProperty$3 = _defineProperty;

var _stringWs = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

var space = '[' + _stringWs + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = _fails(function () {
    return !!_stringWs[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : _stringWs[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  _export(_export.P + _export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(_defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

var _stringTrim = exporter;

var $parseInt = _global.parseInt;
var $trim = _stringTrim.trim;

var hex = /^[-+]?0[xX]/;

var _parseInt = $parseInt(_stringWs + '08') !== 8 || $parseInt(_stringWs + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;

// 18.2.5 parseInt(string, radix)
_export(_export.G + _export.F * (parseInt != _parseInt), { parseInt: _parseInt });

var _parseInt$1 = _core.parseInt;

var _parseInt$2 = _parseInt$1;

function ownKeys(object, enumerableOnly) { var keys = keys$1(object); if (getOwnPropertySymbols$1) { var symbols = getOwnPropertySymbols$1(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return getOwnPropertyDescriptor$1(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { defineProperty$3(target, key, source[key]); }); } else if (getOwnPropertyDescriptors$1) { defineProperties$1(target, getOwnPropertyDescriptors$1(source)); } else { ownKeys(Object(source)).forEach(function (key) { defineProperty$1(target, key, getOwnPropertyDescriptor$1(source, key)); }); } } return target; }
/**
 * A helper object to interact with cameras.
 */

var CameraAccess;

(function (CameraAccess) {
  /**
   * @hidden
   *
   * Standard error names mapping.
   */
  var standardErrorNamesMapping = new map$1([["DeviceCaptureError", "AbortError"], ["NotSupportedError", "AbortError"], ["ScreenCaptureError", "AbortError"], ["TabCaptureError", "AbortError"], ["TypeError", "AbortError"], ["InvalidStateError", "NotAllowedError"], ["MediaDeviceFailedDueToShutdown", "NotAllowedError"], ["MediaDeviceKillSwitchOn", "NotAllowedError"], ["PermissionDeniedError", "NotAllowedError"], ["PermissionDismissedError", "NotAllowedError"], ["DevicesNotFoundError", "NotFoundError"], ["SourceUnavailableError", "NotReadableError"], ["TrackStartError", "NotReadableError"], ["ConstraintNotSatisfiedError", "OverconstrainedError"]]);
  /**
   * @hidden
   *
   * Handle localized camera labels. Supported languages:
   * English, German, French, Spanish (spain), Portuguese (brasil), Portuguese (portugal), Italian,
   * Chinese (simplified), Chinese (traditional), Japanese, Russian, Turkish, Dutch, Arabic, Thai, Swedish,
   * Danish, Vietnamese, Norwegian, Polish, Finnish, Indonesian, Hebrew, Greek, Romanian, Hungarian, Czech,
   * Catalan, Slovak, Ukraininan, Croatian, Malay, Hindi.
   */

  var backCameraKeywords = ["rear", "back", "rück", "arrière", "trasera", "trás", "traseira", "posteriore", "后面", "後面", "背面", "后置", "後置", "背置", "задней", "الخلفية", "후", "arka", "achterzijde", "หลัง", "baksidan", "bagside", "sau", "bak", "tylny", "takakamera", "belakang", "אחורית", "πίσω", "spate", "hátsó", "zadní", "darrere", "zadná", "задня", "stražnja", "belakang", "बैक"];
  /**
   * @hidden
   *
   * The (cached) list of available video devices, updated when [[getCameras]] is called for the first time and after
   * subsequent calls with the *refreshDevices* parameter enabled. The contained devices' order never changes, howver
   * their deviceIds could change when they are retrieved again after a camera access and stop in some situations.
   */

  var availableVideoDevices;
  /**
   * @hidden
   *
   * Whether the currently cached available devices are out of date because of a `devicechange` event.
   */

  var outdatedDevices = false;
  /**
   * @hidden
   *
   * Overrides for main camera for a given camera type on a desktop/laptop device, set when accessing an initial camera.
   */

  CameraAccess.mainCameraForTypeOverridesOnDesktop = new map$1();
  /**
   * @hidden
   *
   * To be accessed directly only for tests.
   *
   * The mapping from deviceIds to camera objects.
   */

  CameraAccess.deviceIdToCameraObjects = new map$1();
  /**
   * @hidden
   *
   * To be accessed directly only for tests.
   *
   * The list of inaccessible deviceIds.
   */

  CameraAccess.inaccessibleDeviceIds = new set$1();
  /**
   * @hidden
   *
   * Listen to `devicechange` events.
   */

  function deviceChangeListener() {
    outdatedDevices = true;
  }
  /**
   * @hidden
   *
   * @param label The camera label.
   * @returns Whether the label mentions the camera being a back-facing one.
   */


  function isBackCameraLabel(label) {
    var lowercaseLabel = label.toLowerCase();
    return backCameraKeywords.some(function (keyword) {
      return lowercaseLabel.includes(keyword);
    });
  }
  /**
   * @hidden
   *
   * Map non-standard error names to standard ones.
   *
   * @param error The error object.
   */


  function mapNonStandardErrorName(error) {
    var name;

    if (error.message === "Invalid constraint") {
      name = "OverconstrainedError";
    } else {
      var _standardErrorNamesMa;

      name = (_standardErrorNamesMa = standardErrorNamesMapping.get(error.name)) !== null && _standardErrorNamesMa !== void 0 ? _standardErrorNamesMa : error.name;
    }

    defineProperty$1(error, "name", {
      value: name
    });
  }
  /**
   * @hidden
   *
   * Get the main camera for the given camera type.
   *
   * @param cameras The array of available [[Camera]] objects.
   * @param cameraType The wanted camera type.
   * @returns The main camera matching the wanted camera type.
   */


  function getMainCameraForType(cameras, cameraType) {
    var mainCameraForType;

    if (BrowserHelper.isDesktopDevice()) {
      // When the device is a desktop/laptop, the overridden camera for the given type or, if not present, the first
      // camera of the given type is the main one.
      if (CameraAccess.mainCameraForTypeOverridesOnDesktop.has(cameraType)) {
        mainCameraForType = CameraAccess.mainCameraForTypeOverridesOnDesktop.get(cameraType);
      } else {
        // Note that if the device is a desktop/laptop, with no labels all cameras are assumed to be front ones,
        // so this will return the first camera as the main front one and none for the back one.
        mainCameraForType = cameras.filter(function (camera) {
          return camera.cameraType === cameraType;
        })[0];
      }
    } else if (cameras.every(function (camera) {
      return camera.label === "";
    })) {
      // When no camera label is available cameras are already in front to back order, assume main front camera is the
      // first one and main back camera is the last one.
      mainCameraForType = cameras[cameraType === Camera.Type.FRONT ? 0 : cameras.length - 1];
    } else {
      mainCameraForType = cameras.filter(function (camera) {
        return camera.cameraType === cameraType;
      }).sort(function (camera1, camera2) {
        return camera1.label.localeCompare(camera2.label);
      })[0];
    }

    return mainCameraForType;
  }

  CameraAccess.getMainCameraForType = getMainCameraForType;
  /**
   * @hidden
   *
   * Sort the given cameras in order of priority of access based on the given camera type.
   *
   * @param cameras The array of available [[Camera]] objects.
   * @param cameraType The preferred camera type.
   * @returns The sorted cameras.
   */

  function sortCamerasForCameraType(cameras, cameraType) {
    function prioritizeMainCameraOverride(prioritizedCameras, currentCameraType) {
      var mainCameraOverride = CameraAccess.mainCameraForTypeOverridesOnDesktop.get(currentCameraType);

      if (mainCameraOverride != null && prioritizedCameras.includes(mainCameraOverride)) {
        prioritizedCameras = prioritizedCameras.filter(function (camera) {
          return camera !== mainCameraOverride;
        });
        prioritizedCameras.unshift(mainCameraOverride);
      }

      return prioritizedCameras;
    }

    var frontCameras = cameras.filter(function (camera) {
      return camera.cameraType === Camera.Type.FRONT;
    });
    var backCameras = cameras.filter(function (camera) {
      return camera.cameraType === Camera.Type.BACK;
    });

    if (BrowserHelper.isDesktopDevice()) {
      // When the device is a desktop/laptop, the cameras for each type are already ordered, we move the overrides
      // first if present and change front / back group order if needed.
      frontCameras = prioritizeMainCameraOverride(frontCameras, Camera.Type.FRONT);
      backCameras = prioritizeMainCameraOverride(backCameras, Camera.Type.BACK);
    } else if (cameras.every(function (camera) {
      return camera.label === "";
    })) {
      // When no camera label is available cameras are already in front to back order, we assume front cameras are
      // ordered and back cameras are in reversed order (try to access last first), and we change front / back group
      // order if needed.
      backCameras.reverse();
    } else {
      frontCameras.sort(function (camera1, camera2) {
        return camera1.label.localeCompare(camera2.label);
      });
      backCameras.sort(function (camera1, camera2) {
        return camera1.label.localeCompare(camera2.label);
      });
    }

    return cameraType === Camera.Type.FRONT ? [].concat(toConsumableArray(frontCameras), toConsumableArray(backCameras)) : [].concat(toConsumableArray(backCameras), toConsumableArray(frontCameras));
  }

  CameraAccess.sortCamerasForCameraType = sortCamerasForCameraType;
  /**
   * @hidden
   *
   * Adjusts the camera's information based on the given currently active video stream.
   *
   * @param mediaStream The currently active `MediaStream` object.
   * @param camera The currently active [[Camera]] object associated with the video stream.
   */

  function adjustCameraFromMediaStream(mediaStream, camera) {
    var videoTracks = mediaStream.getVideoTracks();

    if (videoTracks.length !== 0) {
      var mediaStreamTrack = videoTracks[0];
      var mediaTrackSettings;

      if (typeof mediaStreamTrack.getSettings === "function") {
        var _mediaTrackSettings;

        mediaTrackSettings = mediaStreamTrack.getSettings();

        if (((_mediaTrackSettings = mediaTrackSettings) === null || _mediaTrackSettings === void 0 ? void 0 : _mediaTrackSettings.facingMode) != null && mediaTrackSettings.facingMode.length > 0) {
          camera.cameraType = mediaTrackSettings.facingMode === "environment" ? Camera.Type.BACK : Camera.Type.FRONT;
        }
      }

      if (mediaStreamTrack.label != null && mediaStreamTrack.label.length > 0) {
        camera.label = mediaStreamTrack.label;
      }
    }
  }

  CameraAccess.adjustCameraFromMediaStream = adjustCameraFromMediaStream;
  /**
   * @hidden
   *
   * @param devices The list of available devices.
   * @returns The extracted list of accessible camera objects initialized from the given devices.
   */

  function extractAccessibleCamerasFromDevices(devices) {
    function createCamera(videoDevice, index, videoDevices) {
      var _videoDevice$label;

      if (CameraAccess.deviceIdToCameraObjects.has(videoDevice.deviceId)) {
        return CameraAccess.deviceIdToCameraObjects.get(videoDevice.deviceId);
      }

      var label = (_videoDevice$label = videoDevice.label) !== null && _videoDevice$label !== void 0 ? _videoDevice$label : "";
      var cameraType;

      if (!BrowserHelper.isDesktopDevice() && videoDevices.every(function (device) {
        return device.label === "" && !CameraAccess.deviceIdToCameraObjects.has(device.deviceId);
      })) {
        // When the device is not a desktop/laptop and no camera label is available, assume the camera is a front one
        // if it's the only one or comes in the first half of the list of cameras (if an odd number of cameras is
        // available, it's more likely to have more back than front ones).
        cameraType = videoDevices.length === 1 || index + 1 <= Math.floor(videoDevices.length / 2) ? Camera.Type.FRONT : Camera.Type.BACK;
      } else {
        // Note that if the device is a desktop/laptop, unless the label specifies a back camera, a front one is assumed
        cameraType = isBackCameraLabel(label) ? Camera.Type.BACK : Camera.Type.FRONT;
      }

      return {
        deviceId: videoDevice.deviceId,
        label,
        cameraType
      };
    }

    var cameras = devices.map(createCamera).map(function (camera) {
      // If it's the initial camera, do nothing
      if (camera.deviceId !== "") {
        CameraAccess.deviceIdToCameraObjects.set(camera.deviceId, camera);
      }

      return camera;
    }).filter(function (camera) {
      // Ignore infrared cameras as they often fail to be accessed and are not useful in any case
      return !/\b(?:ir|infrared)\b/i.test(camera.label);
    }).filter(function (camera) {
      return !CameraAccess.inaccessibleDeviceIds.has(camera.deviceId);
    });

    if (!BrowserHelper.isDesktopDevice() && cameras.length > 1 && !cameras.some(function (camera) {
      return camera.cameraType === Camera.Type.BACK;
    })) {
      // When the device is not a desktop/laptop check if cameras are labeled with resolution information, if that's the
      // case, take the higher - resolution one, otherwise pick the last camera (it's not true that the primary camera
      // is first in most scenarios) and mark it as the back one.
      var backCameraIndex = cameras.length - 1;
      var cameraResolutions = cameras.map(function (camera) {
        var match = camera.label.match(/\b([0-9]+)MP?\b/i);

        if (match != null) {
          return _parseInt$2(match[1], 10);
        }

        return NaN;
      });

      if (!cameraResolutions.some(function (cameraResolution) {
        return isNaN(cameraResolution);
      })) {
        backCameraIndex = cameraResolutions.lastIndexOf(Math.max.apply(Math, toConsumableArray(cameraResolutions)));
      }

      cameras[backCameraIndex].cameraType = Camera.Type.BACK;
    }

    return cameras;
  }
  /**
   * @hidden
   *
   * @returns The stream, if necessary, accessed to provide access to complete device information
   */


  function getStreamForDeviceAccessPermission() {
    return _getStreamForDeviceAccessPermission.apply(this, arguments);
  }
  /**
   * @hidden
   *
   * Checks and adjust cameras' deviceId information and related information if a change is detected. We can rely on the
   * fact that devices are returned in the same order even when deviceId information changes.
   *
   * @param oldAvailableDevices The old list of available devices before deviceId information was refreshed.
   * @param newAvailableDevices The new list of available devices after deviceId information was refreshed.
   */


  function _getStreamForDeviceAccessPermission() {
    _getStreamForDeviceAccessPermission = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return enumerateVideoDevices();

            case 2:
              availableVideoDevices = _context.sent;

              if (!(availableVideoDevices.length > 0 && availableVideoDevices.every(function (device) {
                return device.label === "" && !CameraAccess.deviceIdToCameraObjects.has(device.deviceId);
              }))) {
                _context.next = 12;
                break;
              }

              _context.prev = 4;
              _context.next = 7;
              return navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
              });

            case 7:
              return _context.abrupt("return", _context.sent);

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](4);

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[4, 10]]);
    }));
    return _getStreamForDeviceAccessPermission.apply(this, arguments);
  }

  function checkAndUpdateCameraDeviceIdInformation(oldAvailableDevices, newAvailableDevices) {
    if (newAvailableDevices.length > 0 && oldAvailableDevices.length === newAvailableDevices.length && !newAvailableDevices.every(function (device, index) {
      return oldAvailableDevices[index].deviceId === device.deviceId;
    })) {
      var deviceIdChanges = {};
      oldAvailableDevices.forEach(function (device, index) {
        var _newAvailableDevices$;

        var camera = CameraAccess.deviceIdToCameraObjects.get(device.deviceId);

        if (camera == null || camera.label !== ((_newAvailableDevices$ = newAvailableDevices[index].label) !== null && _newAvailableDevices$ !== void 0 ? _newAvailableDevices$ : "")) {
          return;
        }

        var newDeviceId = newAvailableDevices[index].deviceId;
        deviceIdChanges[camera.deviceId] = newDeviceId;

        if (CameraAccess.inaccessibleDeviceIds.has(camera.deviceId)) {
          CameraAccess.inaccessibleDeviceIds.add(newDeviceId);
        }

        camera.deviceId = newDeviceId;
        CameraAccess.deviceIdToCameraObjects.set(newDeviceId, camera);
      });
      console.debug("Detected updated camera deviceId information and updated it accordingly", deviceIdChanges);
    }
  }
  /**
   * Get a list of cameras (if any) available on the device, a camera access permission is requested to the user
   * the first time this method is called if needed.
   *
   * If the browser is incompatible the returned promise is rejected with a `UnsupportedBrowserError` error.
   *
   * When refreshing available devices, if updated deviceId information is detected, cameras' deviceId are updated
   * accordingly. This could happen after a camera access and stop in some situations.
   *
   * @param refreshDevices Force a call to refresh available video devices even when information is already available.
   * @returns A promise resolving to the array of available [[Camera]] objects (could be empty).
   */


  function getCameras() {
    return _getCameras.apply(this, arguments);
  }

  function _getCameras() {
    _getCameras = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
      var _console2;

      var refreshDevices,
          browserCompatibility,
          _availableVideoDevice,
          stream,
          oldAvailableDevices,
          _console,
          cameras,
          _args2 = arguments;

      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              refreshDevices = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : false;
              browserCompatibility = BrowserHelper.checkBrowserCompatibility();

              if (browserCompatibility.fullSupport) {
                _context2.next = 4;
                break;
              }

              throw new UnsupportedBrowserError(browserCompatibility);

            case 4:
              // This will add the listeners only once in case of multiple calls: identical listeners are ignored
              navigator.mediaDevices.addEventListener("devicechange", deviceChangeListener);

              if (!(availableVideoDevices == null || refreshDevices || outdatedDevices)) {
                _context2.next = 29;
                break;
              }

              outdatedDevices = false;
              oldAvailableDevices = (_availableVideoDevice = availableVideoDevices) !== null && _availableVideoDevice !== void 0 ? _availableVideoDevice : [];
              availableVideoDevices = [];
              _context2.prev = 9;
              _context2.next = 12;
              return getStreamForDeviceAccessPermission();

            case 12:
              stream = _context2.sent;

              if (!(stream != null)) {
                _context2.next = 18;
                break;
              }

              console.debug("Camera list (accessed stream for information permissions):", stream);
              _context2.next = 17;
              return enumerateVideoDevices();

            case 17:
              availableVideoDevices = _context2.sent;

            case 18:
              (_console = console).debug.apply(_console, ["Camera list (devices):"].concat(toConsumableArray(availableVideoDevices)));

              checkAndUpdateCameraDeviceIdInformation(oldAvailableDevices, availableVideoDevices);
              _context2.next = 26;
              break;

            case 22:
              _context2.prev = 22;
              _context2.t0 = _context2["catch"](9);
              mapNonStandardErrorName(_context2.t0);
              throw _context2.t0;

            case 26:
              _context2.prev = 26;

              if (stream != null) {
                stream.getVideoTracks().forEach(function (track) {
                  track.stop();
                });
              }

              return _context2.finish(26);

            case 29:
              cameras = extractAccessibleCamerasFromDevices(availableVideoDevices);

              (_console2 = console).debug.apply(_console2, ["Camera list (cameras): "].concat(toConsumableArray(cameras))); // Return a copy of the array to allow for array mutations in other functions


              return _context2.abrupt("return", toConsumableArray(cameras));

            case 32:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[9, 22, 26, 29]]);
    }));
    return _getCameras.apply(this, arguments);
  }

  CameraAccess.getCameras = getCameras;
  /**
   * @hidden
   *
   * Call `navigator.mediaDevices.getUserMedia` asynchronously in a `setTimeout` call.
   *
   * @param getUserMediaParams The parameters for the `navigator.mediaDevices.getUserMedia` call.
   * @returns A promise resolving when the camera is accessed.
   */

  function getUserMediaDelayed(getUserMediaParams) {
    console.debug("Attempt to access camera (parameters):", getUserMediaParams.video);
    return new promise$1(function (resolve, reject) {
      window.setTimeout(function () {
        var _navigator$mediaDevic;

        ((_navigator$mediaDevic = navigator.mediaDevices.getUserMedia(getUserMediaParams)) !== null && _navigator$mediaDevic !== void 0 ? _navigator$mediaDevic : promise$1.reject(new CustomError({
          name: "AbortError"
        }))).then(resolve).catch(reject);
      }, 0);
    });
  }
  /**
   * @hidden
   *
   * Get the *getUserMedia* *video* parameters to be used given a resolution fallback level and the browser used.
   *
   * @param cameraResolutionConstraint The resolution constraint.
   * @returns The resulting *getUserMedia* *video* parameters.
   */


  function getUserMediaVideoParams(cameraResolutionConstraint) {
    var userMediaVideoParams = {
      resizeMode: "none"
    };

    switch (cameraResolutionConstraint) {
      case CameraResolutionConstraint.ULTRA_HD:
        return _objectSpread(_objectSpread({}, userMediaVideoParams), {}, {
          width: {
            min: 3200,
            ideal: 3840,
            max: 4096
          },
          height: {
            min: 1800,
            ideal: 2160,
            max: 2400
          }
        });

      case CameraResolutionConstraint.FULL_HD:
        return _objectSpread(_objectSpread({}, userMediaVideoParams), {}, {
          width: {
            min: 1400,
            ideal: 1920,
            max: 2160
          },
          height: {
            min: 900,
            ideal: 1080,
            max: 1440
          }
        });

      case CameraResolutionConstraint.HD:
        return _objectSpread(_objectSpread({}, userMediaVideoParams), {}, {
          width: {
            min: 960,
            ideal: 1280,
            max: 1440
          },
          height: {
            min: 480,
            ideal: 720,
            max: 960
          }
        });

      case CameraResolutionConstraint.SD:
        return _objectSpread(_objectSpread({}, userMediaVideoParams), {}, {
          width: {
            min: 640,
            ideal: 640,
            max: 800
          },
          height: {
            min: 480,
            ideal: 480,
            max: 600
          }
        });

      case CameraResolutionConstraint.NONE:
      default:
        return {};
    }
  }
  /**
   * @hidden
   *
   * Try to access a given camera for video input at the given resolution level.
   *
   * If a camera is inaccessible because of errors, then it's added to the inaccessible device list. If the specific
   * error is of type `OverconstrainedError` however, this procedure is done later on via a separate external logic.
   * This is done to allow checking if the camera can still be accessed via an updated deviceId when deviceId
   * information changes, or if it should then be confirmed to be considered inaccessible.
   *
   * Depending on parameters, device features and user permissions for camera access, any of the following errors
   * could be the rejected result of the returned promise:
   * - `AbortError`
   * - `NotAllowedError`
   * - `NotFoundError`
   * - `NotReadableError`
   * - `SecurityError`
   * - `OverconstrainedError`
   *
   * @param cameraResolutionConstraint The resolution constraint.
   * @param camera The camera to try to access for video input.
   * @returns A promise resolving to the `MediaStream` object coming from the accessed camera.
   */


  function accessCameraStream(_x, _x2) {
    return _accessCameraStream.apply(this, arguments);
  }

  function _accessCameraStream() {
    _accessCameraStream = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(cameraResolutionConstraint, camera) {
      var getUserMediaParams, mediaStream;
      return regenerator.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              console.debug("Attempt to access camera (camera):", camera);
              getUserMediaParams = {
                audio: false,
                video: getUserMediaVideoParams(cameraResolutionConstraint)
              }; // If it's the initial camera, use the given cameraType, otherwise use the given deviceId

              if (camera.deviceId === "") {
                getUserMediaParams.video.facingMode = {
                  ideal: camera.cameraType === Camera.Type.BACK ? "environment" : "user"
                };
              } else {
                getUserMediaParams.video.deviceId = {
                  exact: camera.deviceId
                };
              }

              _context3.prev = 3;
              _context3.next = 6;
              return getUserMediaDelayed(getUserMediaParams);

            case 6:
              mediaStream = _context3.sent;
              adjustCameraFromMediaStream(mediaStream, camera);
              return _context3.abrupt("return", mediaStream);

            case 11:
              _context3.prev = 11;
              _context3.t0 = _context3["catch"](3);
              mapNonStandardErrorName(_context3.t0);

              if (_context3.t0.name !== "OverconstrainedError") {
                markCameraAsInaccessible(camera);
              }

              throw _context3.t0;

            case 16:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[3, 11]]);
    }));
    return _accessCameraStream.apply(this, arguments);
  }

  CameraAccess.accessCameraStream = accessCameraStream;
  /**
   * @hidden
   *
   * Mark a camera to be inaccessible and thus excluded from the camera list returned by [[getCameras]].
   *
   * @param camera The camera to mark to be inaccessible.
   */

  function markCameraAsInaccessible(camera) {
    // If it's the initial camera, do nothing
    if (camera.deviceId !== "") {
      console.debug("Camera marked to be inaccessible:", camera);
      CameraAccess.inaccessibleDeviceIds.add(camera.deviceId);
    }
  }

  CameraAccess.markCameraAsInaccessible = markCameraAsInaccessible;
  /**
   * @hidden
   *
   * Get a list of available video devices in a cross-browser compatible way.
   *
   * @returns A promise resolving to the `MediaDeviceInfo` array of all available video devices.
   */

  function enumerateVideoDevices() {
    return _enumerateVideoDevices.apply(this, arguments);
  }

  function _enumerateVideoDevices() {
    _enumerateVideoDevices = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4() {
      var devices, _window$MediaStreamTr;

      return regenerator.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!(typeof navigator.enumerateDevices === "function")) {
                _context4.next = 6;
                break;
              }

              _context4.next = 3;
              return navigator.enumerateDevices();

            case 3:
              devices = _context4.sent;
              _context4.next = 24;
              break;

            case 6:
              if (!(typeof navigator.mediaDevices === "object" && typeof navigator.mediaDevices.enumerateDevices === "function")) {
                _context4.next = 12;
                break;
              }

              _context4.next = 9;
              return navigator.mediaDevices.enumerateDevices();

            case 9:
              devices = _context4.sent;
              _context4.next = 24;
              break;

            case 12:
              _context4.prev = 12;

              if (!(((_window$MediaStreamTr = window.MediaStreamTrack) === null || _window$MediaStreamTr === void 0 ? void 0 : _window$MediaStreamTr.getSources) == null)) {
                _context4.next = 15;
                break;
              }

              throw new Error();

            case 15:
              _context4.next = 17;
              return new promise$1(function (resolve) {
                var _window$MediaStreamTr2, _window$MediaStreamTr3;

                (_window$MediaStreamTr2 = window.MediaStreamTrack) === null || _window$MediaStreamTr2 === void 0 ? void 0 : (_window$MediaStreamTr3 = _window$MediaStreamTr2.getSources) === null || _window$MediaStreamTr3 === void 0 ? void 0 : _window$MediaStreamTr3.call(_window$MediaStreamTr2, resolve);
              });

            case 17:
              devices = _context4.sent;
              devices = devices.filter(function (device) {
                return device.kind.toLowerCase() === "video" || device.kind.toLowerCase() === "videoinput";
              }).map(function (device) {
                var _device$deviceId;

                return {
                  deviceId: (_device$deviceId = device.deviceId) !== null && _device$deviceId !== void 0 ? _device$deviceId : "",
                  groupId: device.groupId,
                  kind: "videoinput",
                  label: device.label,
                  toJSON:
                  /* istanbul ignore next */
                  function toJSON() {
                    return this;
                  }
                };
              });
              _context4.next = 24;
              break;

            case 21:
              _context4.prev = 21;
              _context4.t0 = _context4["catch"](12);
              throw new UnsupportedBrowserError({
                fullSupport: false,
                scannerSupport: true,
                missingFeatures: [BrowserCompatibility.Feature.MEDIA_DEVICES]
              });

            case 24:
              return _context4.abrupt("return", devices.filter(function (device) {
                return device.kind === "videoinput";
              }));

            case 25:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[12, 21]]);
    }));
    return _enumerateVideoDevices.apply(this, arguments);
  }
})(CameraAccess || (CameraAccess = {}));

var CameraSettings;

(function (CameraSettings) {

  (function (ResolutionPreference) {
    /**
     * Resolution of around 3840 x 2160.
     */
    ResolutionPreference["ULTRA_HD"] = "ultra-hd";
    /**
     * Resolution of around 1920 x 1080.
     */

    ResolutionPreference["FULL_HD"] = "full-hd";
    /**
     * Resolution of around 1280 x 720.
     */

    ResolutionPreference["HD"] = "hd";
  })(CameraSettings.ResolutionPreference || (CameraSettings.ResolutionPreference = {}));
})(CameraSettings || (CameraSettings = {}));

function ownKeys$1(object, enumerableOnly) { var keys = keys$1(object); if (getOwnPropertySymbols$1) { var symbols = getOwnPropertySymbols$1(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return getOwnPropertyDescriptor$1(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { defineProperty$3(target, key, source[key]); }); } else if (getOwnPropertyDescriptors$1) { defineProperties$1(target, getOwnPropertyDescriptors$1(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { defineProperty$1(target, key, getOwnPropertyDescriptor$1(source, key)); }); } } return target; }
var MeteringMode;

(function (MeteringMode) {
  MeteringMode["CONTINUOUS"] = "continuous";
  MeteringMode["MANUAL"] = "manual";
  MeteringMode["NONE"] = "none";
  MeteringMode["SINGLE_SHOT"] = "single-shot";
})(MeteringMode || (MeteringMode = {}));

var CameraResolutionConstraint;

(function (CameraResolutionConstraint) {
  CameraResolutionConstraint[CameraResolutionConstraint["ULTRA_HD"] = 0] = "ULTRA_HD";
  CameraResolutionConstraint[CameraResolutionConstraint["FULL_HD"] = 1] = "FULL_HD";
  CameraResolutionConstraint[CameraResolutionConstraint["HD"] = 2] = "HD";
  CameraResolutionConstraint[CameraResolutionConstraint["SD"] = 3] = "SD";
  CameraResolutionConstraint[CameraResolutionConstraint["NONE"] = 4] = "NONE";
})(CameraResolutionConstraint || (CameraResolutionConstraint = {}));
/**
 * A barcode picker utility class used to handle camera interaction.
 */


var CameraManager = /*#__PURE__*/function () {
  function CameraManager(scanner, triggerFatalError, gui) {
    classCallCheck(this, CameraManager);

    this.postStreamInitializationListener = this.postStreamInitialization.bind(this);
    this.videoResizeListener = this.videoResizeHandle.bind(this);
    this.videoTrackEndedListener = this.videoTrackEndedRecovery.bind(this);
    this.videoTrackMuteListener = this.videoTrackMuteRecovery.bind(this);
    this.triggerManualFocusListener = this.triggerManualFocus.bind(this);
    this.triggerZoomStartListener = this.triggerZoomStart.bind(this);
    this.triggerZoomMoveListener = this.triggerZoomMove.bind(this);
    this.scanner = scanner;
    this.triggerFatalError = triggerFatalError;
    this.gui = gui;
    this.cameraType = Camera.Type.BACK;
  }

  createClass(CameraManager, [{
    key: "setInteractionOptions",
    value: function setInteractionOptions(cameraSwitcherEnabled, torchToggleEnabled, tapToFocusEnabled, pinchToZoomEnabled) {
      this.cameraSwitcherEnabled = cameraSwitcherEnabled;
      this.torchToggleEnabled = torchToggleEnabled;
      this.tapToFocusEnabled = tapToFocusEnabled;
      this.pinchToZoomEnabled = pinchToZoomEnabled;
    }
  }, {
    key: "isCameraSwitcherEnabled",
    value: function isCameraSwitcherEnabled() {
      return this.cameraSwitcherEnabled;
    }
  }, {
    key: "setCameraSwitcherEnabled",
    value: function () {
      var _setCameraSwitcherEnabled = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(enabled) {
        var cameras;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.cameraSwitcherEnabled = enabled;

                if (!this.cameraSwitcherEnabled) {
                  _context.next = 8;
                  break;
                }

                _context.next = 4;
                return CameraAccess.getCameras();

              case 4:
                cameras = _context.sent;

                if (cameras.length > 1) {
                  this.gui.setCameraSwitcherVisible(true);
                }

                _context.next = 9;
                break;

              case 8:
                this.gui.setCameraSwitcherVisible(false);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function setCameraSwitcherEnabled(_x) {
        return _setCameraSwitcherEnabled.apply(this, arguments);
      }

      return setCameraSwitcherEnabled;
    }()
  }, {
    key: "isTorchToggleEnabled",
    value: function isTorchToggleEnabled() {
      return this.torchToggleEnabled;
    }
  }, {
    key: "setTorchToggleEnabled",
    value: function setTorchToggleEnabled(enabled) {
      this.torchToggleEnabled = enabled;

      if (this.torchToggleEnabled) {
        var _this$mediaTrackCapab;

        if (this.mediaStream != null && ((_this$mediaTrackCapab = this.mediaTrackCapabilities) === null || _this$mediaTrackCapab === void 0 ? void 0 : _this$mediaTrackCapab.torch) === true) {
          this.gui.setTorchTogglerVisible(true);
        }
      } else {
        this.gui.setTorchTogglerVisible(false);
      }
    }
  }, {
    key: "isTapToFocusEnabled",
    value: function isTapToFocusEnabled() {
      return this.tapToFocusEnabled;
    }
  }, {
    key: "setTapToFocusEnabled",
    value: function setTapToFocusEnabled(enabled) {
      this.tapToFocusEnabled = enabled;

      if (this.mediaStream != null) {
        if (this.tapToFocusEnabled) {
          this.enableTapToFocusListeners();
        } else {
          this.disableTapToFocusListeners();
        }
      }
    }
  }, {
    key: "isPinchToZoomEnabled",
    value: function isPinchToZoomEnabled() {
      return this.pinchToZoomEnabled;
    }
  }, {
    key: "setPinchToZoomEnabled",
    value: function setPinchToZoomEnabled(enabled) {
      this.pinchToZoomEnabled = enabled;

      if (this.mediaStream != null) {
        if (this.pinchToZoomEnabled) {
          this.enablePinchToZoomListeners();
        } else {
          this.disablePinchToZoomListeners();
        }
      }
    }
  }, {
    key: "setInitialCameraType",
    value: function setInitialCameraType(cameraType) {
      this.cameraType = cameraType;
    }
  }, {
    key: "setCameraType",
    value: function () {
      var _setCameraType = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(cameraType) {
        var mainCameraForType;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.setInitialCameraType(cameraType);
                _context2.t0 = CameraAccess;
                _context2.next = 4;
                return CameraAccess.getCameras();

              case 4:
                _context2.t1 = _context2.sent;
                _context2.t2 = cameraType;
                mainCameraForType = _context2.t0.getMainCameraForType.call(_context2.t0, _context2.t1, _context2.t2);

                if (!(mainCameraForType != null && mainCameraForType !== this.selectedCamera)) {
                  _context2.next = 9;
                  break;
                }

                return _context2.abrupt("return", this.initializeCameraWithSettings(mainCameraForType, this.selectedCameraSettings));

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function setCameraType(_x2) {
        return _setCameraType.apply(this, arguments);
      }

      return setCameraType;
    }()
  }, {
    key: "setSelectedCamera",
    value: function setSelectedCamera(camera) {
      this.selectedCamera = camera;
    }
  }, {
    key: "setSelectedCameraSettings",
    value: function setSelectedCameraSettings(cameraSettings) {
      this.selectedCameraSettings = cameraSettings;
    }
  }, {
    key: "setupCameras",
    value: function () {
      var _setupCameras = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(this.cameraSetupPromise != null)) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return", this.cameraSetupPromise);

              case 2:
                this.cameraSetupPromise = this.setupCamerasAndStream();
                return _context3.abrupt("return", this.cameraSetupPromise);

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function setupCameras() {
        return _setupCameras.apply(this, arguments);
      }

      return setupCameras;
    }()
  }, {
    key: "stopStream",
    value: function stopStream() {
      var _this = this;

      if (this.activeCamera != null) {
        this.activeCamera.currentResolution = undefined;
      }

      this.activeCamera = undefined;

      if (this.mediaStream != null) {
        console.debug("Stop camera video stream access (stream):", this.mediaStream);
        window.clearTimeout(this.cameraAccessTimeout);
        window.clearInterval(this.videoMetadataCheckInterval);
        window.clearTimeout(this.getCapabilitiesTimeout);
        window.clearTimeout(this.manualFocusWaitTimeout);
        window.clearTimeout(this.manualToAutofocusResumeTimeout);
        window.clearInterval(this.autofocusInterval);
        this.mediaStream.getVideoTracks().forEach(function (track) {
          track.removeEventListener("ended", _this.videoTrackEndedListener);
          track.stop();
        });
        this.gui.videoElement.srcObject = null;
        this.mediaStream = undefined;
        this.mediaTrackCapabilities = undefined;
      }
    }
  }, {
    key: "applyCameraSettings",
    value: function () {
      var _applyCameraSettings = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(cameraSettings) {
        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.selectedCameraSettings = cameraSettings;

                if (!(this.activeCamera == null)) {
                  _context4.next = 3;
                  break;
                }

                throw new CustomError(CameraManager.noCameraErrorParameters);

              case 3:
                return _context4.abrupt("return", this.initializeCameraWithSettings(this.activeCamera, cameraSettings));

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function applyCameraSettings(_x3) {
        return _applyCameraSettings.apply(this, arguments);
      }

      return applyCameraSettings;
    }()
  }, {
    key: "reinitializeCamera",
    value: function () {
      var _reinitializeCamera = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5() {
        return regenerator.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(this.activeCamera == null)) {
                  _context5.next = 4;
                  break;
                }

                // If the initial camera isn't active yet, do nothing: if and when the camera is later confirmed to be the correct
                // (main with wanted type or only) one this method will be called again after the camera is set to be active
                console.debug("Camera reinitialization delayed");
                _context5.next = 15;
                break;

              case 4:
                console.debug("Reinitialize camera:", this.activeCamera);
                _context5.prev = 5;
                _context5.next = 8;
                return this.initializeCameraWithSettings(this.activeCamera, this.activeCameraSettings);

              case 8:
                _context5.next = 15;
                break;

              case 10:
                _context5.prev = 10;
                _context5.t0 = _context5["catch"](5);
                console.warn("Couldn't access camera:", this.activeCamera, _context5.t0);
                this.triggerFatalError(_context5.t0);
                throw _context5.t0;

              case 15:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[5, 10]]);
      }));

      function reinitializeCamera() {
        return _reinitializeCamera.apply(this, arguments);
      }

      return reinitializeCamera;
    }()
  }, {
    key: "initializeCameraWithSettings",
    value: function () {
      var _initializeCameraWithSettings = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee6(camera, cameraSettings) {
        return regenerator.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!(this.cameraInitializationPromise != null)) {
                  _context6.next = 3;
                  break;
                }

                _context6.next = 3;
                return this.cameraInitializationPromise;

              case 3:
                this.setSelectedCamera(camera);
                this.selectedCameraSettings = this.activeCameraSettings = cameraSettings;
                this.cameraInitializationPromise = this.initializeCameraAndCheckUpdatedSettings(camera);
                return _context6.abrupt("return", this.cameraInitializationPromise);

              case 7:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function initializeCameraWithSettings(_x4, _x5) {
        return _initializeCameraWithSettings.apply(this, arguments);
      }

      return initializeCameraWithSettings;
    }()
  }, {
    key: "setTorchEnabled",
    value: function () {
      var _setTorchEnabled = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee7(enabled) {
        var _this$mediaTrackCapab2;

        var videoTracks;
        return regenerator.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!(this.mediaStream != null && ((_this$mediaTrackCapab2 = this.mediaTrackCapabilities) === null || _this$mediaTrackCapab2 === void 0 ? void 0 : _this$mediaTrackCapab2.torch) === true)) {
                  _context7.next = 6;
                  break;
                }

                this.torchEnabled = enabled;
                videoTracks = this.mediaStream.getVideoTracks(); // istanbul ignore else

                if (!(videoTracks.length !== 0 && typeof videoTracks[0].applyConstraints === "function")) {
                  _context7.next = 6;
                  break;
                }

                _context7.next = 6;
                return videoTracks[0].applyConstraints({
                  advanced: [{
                    torch: enabled
                  }]
                });

              case 6:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function setTorchEnabled(_x6) {
        return _setTorchEnabled.apply(this, arguments);
      }

      return setTorchEnabled;
    }()
  }, {
    key: "toggleTorch",
    value: function () {
      var _toggleTorch = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee8() {
        return regenerator.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                this.torchEnabled = !this.torchEnabled;
                _context8.next = 3;
                return this.setTorchEnabled(this.torchEnabled);

              case 3:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function toggleTorch() {
        return _toggleTorch.apply(this, arguments);
      }

      return toggleTorch;
    }()
  }, {
    key: "setZoom",
    value: function () {
      var _setZoom = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee9(zoomPercentage, currentZoom) {
        var _this$mediaTrackCapab3;

        var videoTracks, zoomRange, targetZoom;
        return regenerator.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (!(this.mediaStream != null && ((_this$mediaTrackCapab3 = this.mediaTrackCapabilities) === null || _this$mediaTrackCapab3 === void 0 ? void 0 : _this$mediaTrackCapab3.zoom) != null)) {
                  _context9.next = 7;
                  break;
                }

                videoTracks = this.mediaStream.getVideoTracks(); // istanbul ignore else

                if (!(videoTracks.length !== 0 && typeof videoTracks[0].applyConstraints === "function")) {
                  _context9.next = 7;
                  break;
                }

                zoomRange = this.mediaTrackCapabilities.zoom.max - this.mediaTrackCapabilities.zoom.min;
                targetZoom = Math.max(this.mediaTrackCapabilities.zoom.min, Math.min((currentZoom !== null && currentZoom !== void 0 ? currentZoom : this.mediaTrackCapabilities.zoom.min) + zoomRange * zoomPercentage, this.mediaTrackCapabilities.zoom.max));
                _context9.next = 7;
                return videoTracks[0].applyConstraints({
                  advanced: [{
                    zoom: targetZoom
                  }]
                });

              case 7:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function setZoom(_x7, _x8) {
        return _setZoom.apply(this, arguments);
      }

      return setZoom;
    }()
  }, {
    key: "recoverStreamIfNeeded",
    value: function () {
      var _recoverStreamIfNeeded = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee10() {
        var _this$mediaStream, _videoTracks$;

        var videoTracks;
        return regenerator.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                // Due to non-standard behaviour, it could happen that the stream got interrupted while getting the list of
                // cameras, this isn't handled by the existing "ended" event listener as the active camera wasn't set until
                // before this, so manually reinitialize camera if needed
                videoTracks = (_this$mediaStream = this.mediaStream) === null || _this$mediaStream === void 0 ? void 0 : _this$mediaStream.getVideoTracks();

                if (!((videoTracks === null || videoTracks === void 0 ? void 0 : (_videoTracks$ = videoTracks[0]) === null || _videoTracks$ === void 0 ? void 0 : _videoTracks$.readyState) === "ended")) {
                  _context10.next = 4;
                  break;
                }

                _context10.next = 4;
                return this.reinitializeCamera();

              case 4:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function recoverStreamIfNeeded() {
        return _recoverStreamIfNeeded.apply(this, arguments);
      }

      return recoverStreamIfNeeded;
    }()
  }, {
    key: "setupCamerasAndStream",
    value: function () {
      var _setupCamerasAndStream = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee11() {
        var _this$mediaStream2, _this$mediaStream2$ge, _this$mediaStream2$ge2, initialCamera, cameras, initialCameraDeviceId, activeCamera;

        return regenerator.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;

                if (!(this.selectedCamera == null)) {
                  _context11.next = 5;
                  break;
                }

                _context11.next = 4;
                return this.accessInitialCamera();

              case 4:
                initialCamera = _context11.sent;

              case 5:
                _context11.next = 7;
                return CameraAccess.getCameras();

              case 7:
                cameras = _context11.sent;

                if (this.cameraSwitcherEnabled && cameras.length > 1) {
                  this.gui.setCameraSwitcherVisible(true);
                } // Get but don't save deviceId in initialCamera to differentiate it from final cameras


                initialCameraDeviceId = (_this$mediaStream2 = this.mediaStream) === null || _this$mediaStream2 === void 0 ? void 0 : (_this$mediaStream2$ge = _this$mediaStream2.getVideoTracks()[0]) === null || _this$mediaStream2$ge === void 0 ? void 0 : (_this$mediaStream2$ge2 = _this$mediaStream2$ge.getSettings) === null || _this$mediaStream2$ge2 === void 0 ? void 0 : _this$mediaStream2$ge2.call(_this$mediaStream2$ge).deviceId;

                if (!(this.mediaStream != null && initialCamera != null)) {
                  _context11.next = 28;
                  break;
                }

                // We successfully accessed the initial camera
                activeCamera = cameras.length === 1 ? cameras[0] : cameras.find(function (camera) {
                  var _initialCamera;

                  return camera.deviceId === initialCameraDeviceId || camera.label !== "" && camera.label === ((_initialCamera = initialCamera) === null || _initialCamera === void 0 ? void 0 : _initialCamera.label);
                });

                if (!(activeCamera != null)) {
                  _context11.next = 27;
                  break;
                }

                CameraAccess.adjustCameraFromMediaStream(this.mediaStream, activeCamera);

                if (BrowserHelper.isDesktopDevice()) {
                  // When the device is a desktop/laptop, we store the initial camera as it should be considered the main one
                  // for its camera type and the currently set camera type (which might be different)
                  CameraAccess.mainCameraForTypeOverridesOnDesktop.set(this.cameraType, activeCamera);
                  CameraAccess.mainCameraForTypeOverridesOnDesktop.set(activeCamera.cameraType, activeCamera);
                }

                if (!(cameras.length === 1 || CameraAccess.getMainCameraForType(cameras, this.cameraType) === activeCamera)) {
                  _context11.next = 24;
                  break;
                }

                console.debug("Initial camera access was correct (main camera), keep camera:", activeCamera);
                this.setSelectedCamera(activeCamera);
                this.updateActiveCameraCurrentResolution(activeCamera);
                _context11.next = 21;
                return this.recoverStreamIfNeeded();

              case 21:
                return _context11.abrupt("return");

              case 24:
                console.debug("Initial camera access was incorrect (not main camera), change camera", _objectSpread$1(_objectSpread$1({}, initialCamera), {}, {
                  deviceId: initialCameraDeviceId
                }));

              case 25:
                _context11.next = 28;
                break;

              case 27:
                console.debug("Initial camera access was incorrect (unknown camera), change camera", _objectSpread$1(_objectSpread$1({}, initialCamera), {}, {
                  deviceId: initialCameraDeviceId
                }));

              case 28:
                if (!(this.selectedCamera == null)) {
                  _context11.next = 34;
                  break;
                }

                _context11.next = 31;
                return this.accessAutoselectedCamera(cameras);

              case 31:
                return _context11.abrupt("return", _context11.sent);

              case 34:
                _context11.next = 36;
                return this.initializeCameraWithSettings(this.selectedCamera, this.selectedCameraSettings);

              case 36:
                return _context11.abrupt("return", _context11.sent);

              case 37:
                _context11.prev = 37;
                this.cameraSetupPromise = undefined;
                return _context11.finish(37);

              case 40:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this, [[0,, 37, 40]]);
      }));

      function setupCamerasAndStream() {
        return _setupCamerasAndStream.apply(this, arguments);
      }

      return setupCamerasAndStream;
    }()
  }, {
    key: "getInitialCameraResolutionConstraint",
    value: function getInitialCameraResolutionConstraint() {
      var _this$activeCameraSet;

      var cameraResolutionConstraint;

      switch ((_this$activeCameraSet = this.activeCameraSettings) === null || _this$activeCameraSet === void 0 ? void 0 : _this$activeCameraSet.resolutionPreference) {
        case CameraSettings.ResolutionPreference.ULTRA_HD:
          cameraResolutionConstraint = CameraResolutionConstraint.ULTRA_HD;
          break;

        case CameraSettings.ResolutionPreference.FULL_HD:
          cameraResolutionConstraint = CameraResolutionConstraint.FULL_HD;
          break;

        case CameraSettings.ResolutionPreference.HD:
        default:
          cameraResolutionConstraint = CameraResolutionConstraint.HD;
          break;
      }

      return cameraResolutionConstraint;
    }
  }, {
    key: "accessAutoselectedCamera",
    value: function () {
      var _accessAutoselectedCamera = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee12(cameras) {
        var autoselectedCamera;
        return regenerator.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                cameras = CameraAccess.sortCamerasForCameraType(cameras, this.cameraType);
                autoselectedCamera = cameras.shift();

              case 2:
                if (!(autoselectedCamera != null)) {
                  _context12.next = 20;
                  break;
                }

                _context12.prev = 3;
                _context12.next = 6;
                return this.initializeCameraWithSettings(autoselectedCamera, this.selectedCameraSettings);

              case 6:
                return _context12.abrupt("return", _context12.sent);

              case 9:
                _context12.prev = 9;
                _context12.t0 = _context12["catch"](3);
                this.setSelectedCamera();

                if (cameras.length === 1) {
                  this.gui.setCameraSwitcherVisible(false);
                }

                if (!(cameras.length >= 1)) {
                  _context12.next = 17;
                  break;
                }

                console.warn("Couldn't access camera:", autoselectedCamera, _context12.t0);
                autoselectedCamera = cameras.shift();
                return _context12.abrupt("continue", 2);

              case 17:
                throw _context12.t0;

              case 18:
                _context12.next = 2;
                break;

              case 20:
                throw new CustomError(CameraManager.noCameraErrorParameters);

              case 21:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this, [[3, 9]]);
      }));

      function accessAutoselectedCamera(_x9) {
        return _accessAutoselectedCamera.apply(this, arguments);
      }

      return accessAutoselectedCamera;
    }()
  }, {
    key: "accessInitialCamera",
    value: function () {
      var _accessInitialCamera = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee13() {
        var initialCamera;
        return regenerator.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                // Note that the initial camera's information (except deviceId) will be updated after a successful access
                initialCamera = {
                  deviceId: "",
                  label: "",
                  cameraType: this.cameraType
                };
                _context13.prev = 1;
                _context13.next = 4;
                return this.initializeCameraWithSettings(initialCamera, this.selectedCameraSettings);

              case 4:
                _context13.next = 8;
                break;

              case 6:
                _context13.prev = 6;
                _context13.t0 = _context13["catch"](1);

              case 8:
                _context13.prev = 8;
                this.setSelectedCamera();
                return _context13.finish(8);

              case 11:
                return _context13.abrupt("return", initialCamera);

              case 12:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this, [[1, 6, 8, 11]]);
      }));

      function accessInitialCamera() {
        return _accessInitialCamera.apply(this, arguments);
      }

      return accessInitialCamera;
    }()
  }, {
    key: "updateActiveCameraCurrentResolution",
    value: function updateActiveCameraCurrentResolution(camera) {
      if (this.gui.videoElement.videoWidth > 2 && this.gui.videoElement.videoHeight > 2) {
        camera.currentResolution = {
          width: this.gui.videoElement.videoWidth,
          height: this.gui.videoElement.videoHeight
        };
      } // If it's the initial camera, do nothing: if and when the camera is later confirmed to be the
      // correct (main with wanted type or only) one this method will be called again with the right camera object


      if (camera.deviceId !== "") {
        this.activeCamera = camera;
        this.gui.setMirrorImageEnabled(this.gui.isMirrorImageEnabled(), false);
      }
    }
  }, {
    key: "postStreamInitialization",
    value: function postStreamInitialization() {
      var _this2 = this;

      window.clearTimeout(this.getCapabilitiesTimeout);
      this.getCapabilitiesTimeout = window.setTimeout(function () {
        var _this2$mediaTrackCapa;

        _this2.storeStreamCapabilities();

        _this2.setupAutofocus();

        if (_this2.torchToggleEnabled && _this2.mediaStream != null && ((_this2$mediaTrackCapa = _this2.mediaTrackCapabilities) === null || _this2$mediaTrackCapa === void 0 ? void 0 : _this2$mediaTrackCapa.torch) === true) {
          _this2.gui.setTorchTogglerVisible(true);
        }
      }, CameraManager.getCapabilitiesTimeoutMs);
    }
  }, {
    key: "videoResizeHandle",
    value: function videoResizeHandle() {
      if (this.activeCamera != null) {
        this.updateActiveCameraCurrentResolution(this.activeCamera);
      }
    }
  }, {
    key: "videoTrackEndedRecovery",
    value: function () {
      var _videoTrackEndedRecovery = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee14() {
        return regenerator.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.prev = 0;
                console.debug('Detected video track "ended" event, try to reinitialize camera');
                _context14.next = 4;
                return this.reinitializeCamera();

              case 4:
                _context14.next = 8;
                break;

              case 6:
                _context14.prev = 6;
                _context14.t0 = _context14["catch"](0);

              case 8:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this, [[0, 6]]);
      }));

      function videoTrackEndedRecovery() {
        return _videoTrackEndedRecovery.apply(this, arguments);
      }

      return videoTrackEndedRecovery;
    }()
  }, {
    key: "videoTrackMuteRecovery",
    value: function () {
      var _videoTrackMuteRecovery = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee15() {
        return regenerator.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.prev = 0;
                console.debug('Detected video track "unmute" event, try to reinitialize camera');
                _context15.next = 4;
                return this.reinitializeCamera();

              case 4:
                _context15.next = 8;
                break;

              case 6:
                _context15.prev = 6;
                _context15.t0 = _context15["catch"](0);

              case 8:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this, [[0, 6]]);
      }));

      function videoTrackMuteRecovery() {
        return _videoTrackMuteRecovery.apply(this, arguments);
      }

      return videoTrackMuteRecovery;
    }()
  }, {
    key: "triggerManualFocusForContinuous",
    value: function () {
      var _triggerManualFocusForContinuous = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee18() {
        var _this3 = this;

        return regenerator.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                this.manualToAutofocusResumeTimeout = window.setTimeout( /*#__PURE__*/asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee16() {
                  return regenerator.wrap(function _callee16$(_context16) {
                    while (1) {
                      switch (_context16.prev = _context16.next) {
                        case 0:
                          _context16.next = 2;
                          return _this3.triggerFocusMode(MeteringMode.CONTINUOUS);

                        case 2:
                        case "end":
                          return _context16.stop();
                      }
                    }
                  }, _callee16);
                })), CameraManager.manualToAutofocusResumeTimeoutMs);
                _context18.next = 3;
                return this.triggerFocusMode(MeteringMode.CONTINUOUS);

              case 3:
                this.manualFocusWaitTimeout = window.setTimeout( /*#__PURE__*/asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee17() {
                  return regenerator.wrap(function _callee17$(_context17) {
                    while (1) {
                      switch (_context17.prev = _context17.next) {
                        case 0:
                          _context17.next = 2;
                          return _this3.triggerFocusMode(MeteringMode.MANUAL);

                        case 2:
                        case "end":
                          return _context17.stop();
                      }
                    }
                  }, _callee17);
                })), CameraManager.manualFocusWaitTimeoutMs);

              case 4:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function triggerManualFocusForContinuous() {
        return _triggerManualFocusForContinuous.apply(this, arguments);
      }

      return triggerManualFocusForContinuous;
    }()
  }, {
    key: "triggerManualFocusForSingleShot",
    value: function () {
      var _triggerManualFocusForSingleShot = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee19() {
        var _this4 = this;

        return regenerator.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                window.clearInterval(this.autofocusInterval);
                this.manualToAutofocusResumeTimeout = window.setTimeout(function () {
                  _this4.autofocusInterval = window.setInterval(_this4.triggerAutoFocus.bind(_this4), CameraManager.autofocusIntervalMs);
                }, CameraManager.manualToAutofocusResumeTimeoutMs);
                _context19.prev = 2;
                _context19.next = 5;
                return this.triggerFocusMode(MeteringMode.SINGLE_SHOT);

              case 5:
                _context19.next = 9;
                break;

              case 7:
                _context19.prev = 7;
                _context19.t0 = _context19["catch"](2);

              case 9:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this, [[2, 7]]);
      }));

      function triggerManualFocusForSingleShot() {
        return _triggerManualFocusForSingleShot.apply(this, arguments);
      }

      return triggerManualFocusForSingleShot;
    }()
  }, {
    key: "triggerManualFocus",
    value: function () {
      var _triggerManualFocus = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee20(event) {
        var focusModeCapability;
        return regenerator.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                if (!(event != null)) {
                  _context20.next = 7;
                  break;
                }

                event.preventDefault();

                if (!(event.type === "touchend" && event.touches.length !== 0)) {
                  _context20.next = 4;
                  break;
                }

                return _context20.abrupt("return");

              case 4:
                if (!(this.pinchToZoomDistance != null)) {
                  _context20.next = 7;
                  break;
                }

                this.pinchToZoomDistance = undefined;
                return _context20.abrupt("return");

              case 7:
                window.clearTimeout(this.manualFocusWaitTimeout);
                window.clearTimeout(this.manualToAutofocusResumeTimeout);

                if (!(this.mediaStream != null && this.mediaTrackCapabilities != null)) {
                  _context20.next = 20;
                  break;
                }

                focusModeCapability = this.mediaTrackCapabilities.focusMode;

                if (!(focusModeCapability instanceof Array && focusModeCapability.includes(MeteringMode.SINGLE_SHOT))) {
                  _context20.next = 20;
                  break;
                }

                if (!(focusModeCapability.includes(MeteringMode.CONTINUOUS) && focusModeCapability.includes(MeteringMode.MANUAL))) {
                  _context20.next = 17;
                  break;
                }

                _context20.next = 15;
                return this.triggerManualFocusForContinuous();

              case 15:
                _context20.next = 20;
                break;

              case 17:
                if (focusModeCapability.includes(MeteringMode.CONTINUOUS)) {
                  _context20.next = 20;
                  break;
                }

                _context20.next = 20;
                return this.triggerManualFocusForSingleShot();

              case 20:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      function triggerManualFocus(_x10) {
        return _triggerManualFocus.apply(this, arguments);
      }

      return triggerManualFocus;
    }()
  }, {
    key: "triggerZoomStart",
    value: function triggerZoomStart(event) {
      var _this$mediaTrackCapab4;

      if ((event === null || event === void 0 ? void 0 : event.touches.length) !== 2) {
        return;
      }

      event.preventDefault();
      this.pinchToZoomDistance = Math.hypot((event.touches[1].screenX - event.touches[0].screenX) / screen.width, (event.touches[1].screenY - event.touches[0].screenY) / screen.height);

      if (this.mediaStream != null && ((_this$mediaTrackCapab4 = this.mediaTrackCapabilities) === null || _this$mediaTrackCapab4 === void 0 ? void 0 : _this$mediaTrackCapab4.zoom) != null) {
        var videoTracks = this.mediaStream.getVideoTracks(); // istanbul ignore else

        if (videoTracks.length !== 0 && typeof videoTracks[0].getConstraints === "function") {
          this.pinchToZoomInitialZoom = this.mediaTrackCapabilities.zoom.min;
          var currentConstraints = videoTracks[0].getConstraints();

          if (currentConstraints.advanced != null) {
            var currentZoomConstraint = currentConstraints.advanced.find(function (constraint) {
              return "zoom" in constraint;
            });

            if ((currentZoomConstraint === null || currentZoomConstraint === void 0 ? void 0 : currentZoomConstraint.zoom) != null) {
              this.pinchToZoomInitialZoom = currentZoomConstraint.zoom;
            }
          }
        }
      }
    }
  }, {
    key: "triggerZoomMove",
    value: function () {
      var _triggerZoomMove = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee21(event) {
        return regenerator.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                if (!(this.pinchToZoomDistance == null || (event === null || event === void 0 ? void 0 : event.touches.length) !== 2)) {
                  _context21.next = 2;
                  break;
                }

                return _context21.abrupt("return");

              case 2:
                event.preventDefault();
                _context21.next = 5;
                return this.setZoom((Math.hypot((event.touches[1].screenX - event.touches[0].screenX) / screen.width, (event.touches[1].screenY - event.touches[0].screenY) / screen.height) - this.pinchToZoomDistance) * 2, this.pinchToZoomInitialZoom);

              case 5:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function triggerZoomMove(_x11) {
        return _triggerZoomMove.apply(this, arguments);
      }

      return triggerZoomMove;
    }()
  }, {
    key: "storeStreamCapabilities",
    value: function storeStreamCapabilities() {
      // istanbul ignore else
      if (this.mediaStream != null) {
        var videoTracks = this.mediaStream.getVideoTracks(); // istanbul ignore else

        if (videoTracks.length !== 0 && typeof videoTracks[0].getCapabilities === "function") {
          this.mediaTrackCapabilities = videoTracks[0].getCapabilities();
        }
      }

      if (this.activeCamera != null) {
        var _this$mediaTrackCapab5;

        this.scanner.reportCameraProperties(this.activeCamera.cameraType, ((_this$mediaTrackCapab5 = this.mediaTrackCapabilities) === null || _this$mediaTrackCapab5 === void 0 ? void 0 : _this$mediaTrackCapab5.focusMode) == null || // assume the camera supports autofocus by default
        this.mediaTrackCapabilities.focusMode.includes(MeteringMode.CONTINUOUS));
      }
    }
  }, {
    key: "setupAutofocus",
    value: function setupAutofocus() {
      window.clearTimeout(this.manualFocusWaitTimeout);
      window.clearTimeout(this.manualToAutofocusResumeTimeout); // istanbul ignore else

      if (this.mediaStream != null && this.mediaTrackCapabilities != null) {
        var focusModeCapability = this.mediaTrackCapabilities.focusMode;

        if (focusModeCapability instanceof Array && !focusModeCapability.includes(MeteringMode.CONTINUOUS) && focusModeCapability.includes(MeteringMode.SINGLE_SHOT)) {
          window.clearInterval(this.autofocusInterval);
          this.autofocusInterval = window.setInterval(this.triggerAutoFocus.bind(this), CameraManager.autofocusIntervalMs);
        }
      }
    }
  }, {
    key: "triggerAutoFocus",
    value: function () {
      var _triggerAutoFocus = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee22() {
        return regenerator.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                _context22.next = 2;
                return this.triggerFocusMode(MeteringMode.SINGLE_SHOT);

              case 2:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      function triggerAutoFocus() {
        return _triggerAutoFocus.apply(this, arguments);
      }

      return triggerAutoFocus;
    }()
  }, {
    key: "triggerFocusMode",
    value: function () {
      var _triggerFocusMode = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee23(focusMode) {
        var videoTracks;
        return regenerator.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                if (!(this.mediaStream != null)) {
                  _context23.next = 10;
                  break;
                }

                videoTracks = this.mediaStream.getVideoTracks();

                if (!(videoTracks.length !== 0 && typeof videoTracks[0].applyConstraints === "function")) {
                  _context23.next = 10;
                  break;
                }

                _context23.prev = 3;
                _context23.next = 6;
                return videoTracks[0].applyConstraints({
                  advanced: [{
                    focusMode
                  }]
                });

              case 6:
                _context23.next = 10;
                break;

              case 8:
                _context23.prev = 8;
                _context23.t0 = _context23["catch"](3);

              case 10:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this, [[3, 8]]);
      }));

      function triggerFocusMode(_x12) {
        return _triggerFocusMode.apply(this, arguments);
      }

      return triggerFocusMode;
    }()
  }, {
    key: "enableTapToFocusListeners",
    value: function enableTapToFocusListeners() {
      var _this5 = this;

      ["touchend", "mousedown"].forEach(function (eventName) {
        _this5.gui.videoElement.addEventListener(eventName, _this5.triggerManualFocusListener);
      });
    }
  }, {
    key: "enablePinchToZoomListeners",
    value: function enablePinchToZoomListeners() {
      this.gui.videoElement.addEventListener("touchstart", this.triggerZoomStartListener);
      this.gui.videoElement.addEventListener("touchmove", this.triggerZoomMoveListener);
    }
  }, {
    key: "disableTapToFocusListeners",
    value: function disableTapToFocusListeners() {
      var _this6 = this;

      ["touchend", "mousedown"].forEach(function (eventName) {
        _this6.gui.videoElement.removeEventListener(eventName, _this6.triggerManualFocusListener);
      });
    }
  }, {
    key: "disablePinchToZoomListeners",
    value: function disablePinchToZoomListeners() {
      this.gui.videoElement.removeEventListener("touchstart", this.triggerZoomStartListener);
      this.gui.videoElement.removeEventListener("touchmove", this.triggerZoomMoveListener);
    }
  }, {
    key: "initializeCameraAndCheckUpdatedSettings",
    value: function () {
      var _initializeCameraAndCheckUpdatedSettings = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee24(camera) {
        var _this7 = this;

        return regenerator.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                _context24.prev = 0;
                _context24.next = 3;
                return this.initializeCamera(camera);

              case 3:
                if (!(this.selectedCameraSettings !== this.activeCameraSettings && (this.selectedCameraSettings == null || this.activeCameraSettings == null || keys$1(this.selectedCameraSettings).some(function (cameraSettingsProperty) {
                  return _this7.selectedCameraSettings[cameraSettingsProperty] !== _this7.activeCameraSettings[cameraSettingsProperty];
                })))) {
                  _context24.next = 8;
                  break;
                }

                this.activeCameraSettings = this.selectedCameraSettings;
                _context24.next = 7;
                return this.initializeCameraAndCheckUpdatedSettings(camera);

              case 7:
                return _context24.abrupt("return", _context24.sent);

              case 8:
                _context24.prev = 8;
                this.cameraInitializationPromise = undefined;
                return _context24.finish(8);

              case 11:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this, [[0,, 8, 11]]);
      }));

      function initializeCameraAndCheckUpdatedSettings(_x13) {
        return _initializeCameraAndCheckUpdatedSettings.apply(this, arguments);
      }

      return initializeCameraAndCheckUpdatedSettings;
    }()
  }, {
    key: "handleCameraInitializationError",
    value: function () {
      var _handleCameraInitializationError = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee25(camera, cameraResolutionConstraint, error) {
        var currentCameraDeviceId;
        return regenerator.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                if (!(error.name !== "OverconstrainedError")) {
                  _context25.next = 3;
                  break;
                }

                // Camera is not accessible at all
                console.debug("Camera video stream access failure (unrecoverable error)", camera, error);
                throw error;

              case 3:
                if (!(error.name === "OverconstrainedError" && cameraResolutionConstraint === CameraResolutionConstraint.NONE)) {
                  _context25.next = 19;
                  break;
                }

                if (!(camera.deviceId === "")) {
                  _context25.next = 7;
                  break;
                }

                console.debug("Camera video stream access failure (no camera with such type error)", camera, error);
                throw error;

              case 7:
                console.debug("Detected non-existent deviceId error, attempt to find and reaccess updated camera", camera, error);
                currentCameraDeviceId = camera.deviceId; // Refresh camera deviceId information

                _context25.next = 11;
                return CameraAccess.getCameras(true);

              case 11:
                if (!(currentCameraDeviceId === camera.deviceId)) {
                  _context25.next = 17;
                  break;
                }

                console.debug("Camera video stream access failure (updated camera not found after non-existent deviceId error)", camera, error);
                CameraAccess.markCameraAsInaccessible(camera);
                throw error;

              case 17:
                console.debug("Updated camera found (recovered from non-existent deviceId error), attempt to access it", camera);
                return _context25.abrupt("return", this.initializeCamera(camera));

              case 19:
                return _context25.abrupt("return", this.initializeCamera(camera, cameraResolutionConstraint + 1));

              case 20:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));

      function handleCameraInitializationError(_x14, _x15, _x16) {
        return _handleCameraInitializationError.apply(this, arguments);
      }

      return handleCameraInitializationError;
    }()
  }, {
    key: "initializeCamera",
    value: function () {
      var _initializeCamera = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee26(camera, cameraResolutionConstraint) {
        var _cameraResolutionCons,
            _this8 = this;

        var stream, mediaTrackSettings;
        return regenerator.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                if (!(camera == null)) {
                  _context26.next = 2;
                  break;
                }

                throw new CustomError(CameraManager.noCameraErrorParameters);

              case 2:
                this.stopStream();
                this.torchEnabled = false;
                this.gui.setTorchTogglerVisible(false);
                (_cameraResolutionCons = cameraResolutionConstraint) !== null && _cameraResolutionCons !== void 0 ? _cameraResolutionCons : cameraResolutionConstraint = this.getInitialCameraResolutionConstraint();
                _context26.prev = 6;
                _context26.next = 9;
                return CameraAccess.accessCameraStream(cameraResolutionConstraint, camera);

              case 9:
                stream = _context26.sent;

                if (!(typeof stream.getTracks()[0].getSettings === "function")) {
                  _context26.next = 19;
                  break;
                }

                mediaTrackSettings = stream.getTracks()[0].getSettings();

                if (!(mediaTrackSettings.width != null && mediaTrackSettings.height != null && (mediaTrackSettings.width === 2 || mediaTrackSettings.height === 2))) {
                  _context26.next = 19;
                  break;
                }

                console.debug("Camera video stream access failure (invalid video metadata):", camera);

                if (!(cameraResolutionConstraint === CameraResolutionConstraint.NONE)) {
                  _context26.next = 18;
                  break;
                }

                throw new CustomError(CameraManager.notReadableErrorParameters);

              case 18:
                return _context26.abrupt("return", this.initializeCamera(camera, cameraResolutionConstraint + 1));

              case 19:
                this.mediaStream = stream;
                this.mediaStream.getVideoTracks().forEach(function (track) {
                  // Handle unexpected stream end events
                  track.addEventListener("ended", _this8.videoTrackEndedListener);

                  if (BrowserHelper.userAgentInfo.getBrowser().name === "Safari") {
                    // Safari only allows a single page to have the camera active at any time, if the track gets muted we need
                    // to reinitialize the camera to access it again (this is done automatically only once the page is visible)
                    // as soon as possible, other browsers use mute/unmute on page visibility changes, but not Safari.
                    // This will add the listeners only once in case of multiple calls: identical listeners are ignored
                    track.addEventListener("mute", _this8.videoTrackMuteListener);
                  }
                });
                _context26.prev = 21;
                _context26.next = 24;
                return this.setupCameraStreamVideo(camera, stream);

              case 24:
                _context26.next = 33;
                break;

              case 26:
                _context26.prev = 26;
                _context26.t0 = _context26["catch"](21);

                if (!(cameraResolutionConstraint === CameraResolutionConstraint.NONE)) {
                  _context26.next = 32;
                  break;
                }

                throw _context26.t0;

              case 32:
                return _context26.abrupt("return", this.initializeCamera(camera, cameraResolutionConstraint + 1));

              case 33:
                _context26.next = 38;
                break;

              case 35:
                _context26.prev = 35;
                _context26.t1 = _context26["catch"](6);
                return _context26.abrupt("return", this.handleCameraInitializationError(camera, cameraResolutionConstraint, _context26.t1));

              case 38:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26, this, [[6, 35], [21, 26]]);
      }));

      function initializeCamera(_x17, _x18) {
        return _initializeCamera.apply(this, arguments);
      }

      return initializeCamera;
    }()
  }, {
    key: "checkCameraAccess",
    value: function () {
      var _checkCameraAccess = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee27(camera) {
        var _this9 = this;

        return regenerator.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                window.clearTimeout(this.cameraAccessTimeout);
                return _context27.abrupt("return", new promise$1(function (_, reject) {
                  _this9.cameraAccessTimeout = window.setTimeout(function () {
                    console.debug("Camera video stream access failure (video data load timeout):", camera);

                    _this9.stopStream();

                    reject(new CustomError(CameraManager.notReadableErrorParameters));
                  }, CameraManager.cameraAccessTimeoutMs);
                }));

              case 2:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27, this);
      }));

      function checkCameraAccess(_x19) {
        return _checkCameraAccess.apply(this, arguments);
      }

      return checkCameraAccess;
    }()
  }, {
    key: "checkVideoMetadata",
    value: function () {
      var _checkVideoMetadata = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee28(camera) {
        var _this10 = this;

        return regenerator.wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                return _context28.abrupt("return", new promise$1(function (resolve, reject) {
                  _this10.gui.videoElement.onloadeddata = function () {
                    _this10.gui.videoElement.onloadeddata = null;
                    window.clearTimeout(_this10.cameraAccessTimeout); // Detect weird browser behaviour that on unsupported resolution returns a 2x2 video instead
                    // Also detect failed camera access with no error but also no video stream provided

                    if (_this10.gui.videoElement.videoWidth > 2 && _this10.gui.videoElement.videoHeight > 2 && _this10.gui.videoElement.currentTime > 0) {
                      _this10.updateActiveCameraCurrentResolution(camera);

                      console.debug("Camera video stream access success:", camera);
                      return resolve();
                    }

                    var videoMetadataCheckStartTime = performance.now();
                    window.clearInterval(_this10.videoMetadataCheckInterval);
                    _this10.videoMetadataCheckInterval = window.setInterval(function () {
                      // Detect weird browser behaviour that on unsupported resolution returns a 2x2 video instead
                      // Also detect failed camera access with no error but also no video stream provided
                      if (_this10.gui.videoElement.videoWidth <= 2 || _this10.gui.videoElement.videoHeight <= 2 || _this10.gui.videoElement.currentTime === 0) {
                        if (performance.now() - videoMetadataCheckStartTime > CameraManager.videoMetadataCheckTimeoutMs) {
                          console.debug("Camera video stream access failure (valid video metadata timeout):", camera);
                          window.clearInterval(_this10.videoMetadataCheckInterval);

                          _this10.stopStream();

                          return reject(new CustomError(CameraManager.notReadableErrorParameters));
                        }

                        return;
                      }

                      window.clearInterval(_this10.videoMetadataCheckInterval);

                      _this10.updateActiveCameraCurrentResolution(camera);

                      console.debug("Camera video stream access success:", camera);
                      resolve();
                    }, CameraManager.videoMetadataCheckIntervalMs);
                  };
                }));

              case 1:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28);
      }));

      function checkVideoMetadata(_x20) {
        return _checkVideoMetadata.apply(this, arguments);
      }

      return checkVideoMetadata;
    }()
  }, {
    key: "setupCameraStreamVideo",
    value: function setupCameraStreamVideo(camera, stream) {
      // These will add the listeners only once in the case of multiple calls, identical listeners are ignored
      this.gui.videoElement.addEventListener("loadedmetadata", this.postStreamInitializationListener);
      this.gui.videoElement.addEventListener("resize", this.videoResizeListener);

      if (this.tapToFocusEnabled) {
        this.enableTapToFocusListeners();
      }

      if (this.pinchToZoomEnabled) {
        this.enablePinchToZoomListeners();
      }

      var cameraStreamVideoCheck = promise$1.race([this.checkCameraAccess(camera), this.checkVideoMetadata(camera)]);

      this.gui.videoElement.srcObject = stream;
      this.gui.videoElement.load();
      this.gui.playVideo(); // Report camera properties already now in order to have type information before autofocus information is available.
      // Even if later the initialization could fail nothing bad results from this.

      this.scanner.reportCameraProperties(camera.cameraType);
      return cameraStreamVideoCheck;
    }
  }]);

  return CameraManager;
}();
CameraManager.cameraAccessTimeoutMs = 4000;
CameraManager.videoMetadataCheckTimeoutMs = 4000;
CameraManager.videoMetadataCheckIntervalMs = 50;
CameraManager.getCapabilitiesTimeoutMs = 500;
CameraManager.autofocusIntervalMs = 1500;
CameraManager.manualToAutofocusResumeTimeoutMs = 5000;
CameraManager.manualFocusWaitTimeoutMs = 400;
CameraManager.noCameraErrorParameters = {
  name: "NoCameraAvailableError",
  message: "No camera available"
};
CameraManager.notReadableErrorParameters = {
  name: "NotReadableError",
  message: "Could not initialize camera correctly"
};

function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function _createSuperInternal() { var Super = getPrototypeOf$2(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf$2(this).constructor; result = construct$2(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !construct$2) return false; if (construct$2.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct$2(Date, [], function () {})); return true; } catch (e) { return false; } }
/**
 * A dummy barcode picker utility class used to (not) handle camera interaction.
 */
// istanbul ignore next

var DummyCameraManager = /*#__PURE__*/function (_CameraManager) {
  inherits(DummyCameraManager, _CameraManager);

  var _super = _createSuper$2(DummyCameraManager);

  function DummyCameraManager() {
    classCallCheck(this, DummyCameraManager);

    return _super.apply(this, arguments);
  }

  createClass(DummyCameraManager, [{
    key: "setInteractionOptions",
    value: function setInteractionOptions(_1, _2, _3, _4) {
      return;
    }
  }, {
    key: "isCameraSwitcherEnabled",
    value: function isCameraSwitcherEnabled() {
      return false;
    }
  }, {
    key: "setCameraSwitcherEnabled",
    value: function () {
      var _setCameraSwitcherEnabled = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(_1) {
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return");

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function setCameraSwitcherEnabled(_x) {
        return _setCameraSwitcherEnabled.apply(this, arguments);
      }

      return setCameraSwitcherEnabled;
    }()
  }, {
    key: "isTorchToggleEnabled",
    value: function isTorchToggleEnabled() {
      return false;
    }
  }, {
    key: "setTorchToggleEnabled",
    value: function setTorchToggleEnabled(_1) {
      return;
    }
  }, {
    key: "isTapToFocusEnabled",
    value: function isTapToFocusEnabled() {
      return false;
    }
  }, {
    key: "setTapToFocusEnabled",
    value: function setTapToFocusEnabled(_1) {
      return;
    }
  }, {
    key: "isPinchToZoomEnabled",
    value: function isPinchToZoomEnabled() {
      return false;
    }
  }, {
    key: "setPinchToZoomEnabled",
    value: function setPinchToZoomEnabled(_1) {
      return;
    }
  }, {
    key: "setInitialCameraType",
    value: function setInitialCameraType(_1) {
      return;
    }
  }, {
    key: "setCameraType",
    value: function () {
      var _setCameraType = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(_1) {
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return");

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function setCameraType(_x2) {
        return _setCameraType.apply(this, arguments);
      }

      return setCameraType;
    }()
  }, {
    key: "setSelectedCamera",
    value: function setSelectedCamera(_1) {
      return;
    }
  }, {
    key: "setSelectedCameraSettings",
    value: function setSelectedCameraSettings(_1) {
      return;
    }
  }, {
    key: "setupCameras",
    value: function () {
      var _setupCameras = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return");

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function setupCameras() {
        return _setupCameras.apply(this, arguments);
      }

      return setupCameras;
    }()
  }, {
    key: "stopStream",
    value: function stopStream() {
      return;
    }
  }, {
    key: "applyCameraSettings",
    value: function () {
      var _applyCameraSettings = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(_1) {
        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return");

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function applyCameraSettings(_x3) {
        return _applyCameraSettings.apply(this, arguments);
      }

      return applyCameraSettings;
    }()
  }, {
    key: "reinitializeCamera",
    value: function () {
      var _reinitializeCamera = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5() {
        return regenerator.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return");

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function reinitializeCamera() {
        return _reinitializeCamera.apply(this, arguments);
      }

      return reinitializeCamera;
    }()
  }, {
    key: "initializeCameraWithSettings",
    value: function () {
      var _initializeCameraWithSettings = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee6(_1, _2) {
        return regenerator.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return");

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function initializeCameraWithSettings(_x4, _x5) {
        return _initializeCameraWithSettings.apply(this, arguments);
      }

      return initializeCameraWithSettings;
    }()
  }, {
    key: "setTorchEnabled",
    value: function () {
      var _setTorchEnabled = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee7(_1) {
        return regenerator.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return");

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function setTorchEnabled(_x6) {
        return _setTorchEnabled.apply(this, arguments);
      }

      return setTorchEnabled;
    }()
  }, {
    key: "toggleTorch",
    value: function () {
      var _toggleTorch = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee8() {
        return regenerator.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return");

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function toggleTorch() {
        return _toggleTorch.apply(this, arguments);
      }

      return toggleTorch;
    }()
  }, {
    key: "setZoom",
    value: function () {
      var _setZoom = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee9(_1, _2) {
        return regenerator.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt("return");

              case 1:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function setZoom(_x7, _x8) {
        return _setZoom.apply(this, arguments);
      }

      return setZoom;
    }()
  }]);

  return DummyCameraManager;
}(CameraManager);

// 19.1.2.1 Object.assign(target, source, ...)






var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
var _objectAssign = !$assign || _fails(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = _toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = _objectGops.f;
  var isEnum = _objectPie.f;
  while (aLen > index) {
    var S = _iobject(arguments[index++]);
    var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!_descriptors || isEnum.call(S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;

// 19.1.3.1 Object.assign(target, source)


_export(_export.S + _export.F, 'Object', { assign: _objectAssign });

var assign = _core.Object.assign;

var assign$1 = assign;

var resizeObservers = [];

var hasActiveObservations = function () {
    return resizeObservers.some(function (ro) { return ro.activeTargets.length > 0; });
};

var hasSkippedObservations = function () {
    return resizeObservers.some(function (ro) { return ro.skippedTargets.length > 0; });
};

var msg = 'ResizeObserver loop completed with undelivered notifications.';
var deliverResizeLoopError = function () {
    var event;
    if (typeof ErrorEvent === 'function') {
        event = new ErrorEvent('error', {
            message: msg
        });
    }
    else {
        event = document.createEvent('Event');
        event.initEvent('error', false, false);
        event.message = msg;
    }
    window.dispatchEvent(event);
};

var ResizeObserverBoxOptions;
(function (ResizeObserverBoxOptions) {
    ResizeObserverBoxOptions["BORDER_BOX"] = "border-box";
    ResizeObserverBoxOptions["CONTENT_BOX"] = "content-box";
    ResizeObserverBoxOptions["DEVICE_PIXEL_CONTENT_BOX"] = "device-pixel-content-box";
})(ResizeObserverBoxOptions || (ResizeObserverBoxOptions = {}));

var DOMRectReadOnly = (function () {
    function DOMRectReadOnly(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.top = this.y;
        this.left = this.x;
        this.bottom = this.top + this.height;
        this.right = this.left + this.width;
        return Object.freeze(this);
    }
    DOMRectReadOnly.prototype.toJSON = function () {
        var _a = this, x = _a.x, y = _a.y, top = _a.top, right = _a.right, bottom = _a.bottom, left = _a.left, width = _a.width, height = _a.height;
        return { x: x, y: y, top: top, right: right, bottom: bottom, left: left, width: width, height: height };
    };
    DOMRectReadOnly.fromRect = function (rectangle) {
        return new DOMRectReadOnly(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    };
    return DOMRectReadOnly;
}());

var isSVG = function (target) { return target instanceof SVGElement && 'getBBox' in target; };
var isHidden = function (target) {
    if (isSVG(target)) {
        var _a = target.getBBox(), width = _a.width, height = _a.height;
        return !width && !height;
    }
    var _b = target, offsetWidth = _b.offsetWidth, offsetHeight = _b.offsetHeight;
    return !(offsetWidth || offsetHeight || target.getClientRects().length);
};
var isElement = function (obj) {
    var _a, _b;
    var scope = (_b = (_a = obj) === null || _a === void 0 ? void 0 : _a.ownerDocument) === null || _b === void 0 ? void 0 : _b.defaultView;
    return !!(scope && obj instanceof scope.Element);
};
var isReplacedElement = function (target) {
    switch (target.tagName) {
        case 'INPUT':
            if (target.type !== 'image') {
                break;
            }
        case 'VIDEO':
        case 'AUDIO':
        case 'EMBED':
        case 'OBJECT':
        case 'CANVAS':
        case 'IFRAME':
        case 'IMG':
            return true;
    }
    return false;
};

var global$1 = typeof window !== 'undefined' ? window : {};

var cache = new WeakMap();
var scrollRegexp = /auto|scroll/;
var verticalRegexp = /^tb|vertical/;
var IE = (/msie|trident/i).test(global$1.navigator && global$1.navigator.userAgent);
var parseDimension = function (pixel) { return parseFloat(pixel || '0'); };
var size = function (inlineSize, blockSize, switchSizes) {
    if (inlineSize === void 0) { inlineSize = 0; }
    if (blockSize === void 0) { blockSize = 0; }
    if (switchSizes === void 0) { switchSizes = false; }
    return Object.freeze({
        inlineSize: (switchSizes ? blockSize : inlineSize) || 0,
        blockSize: (switchSizes ? inlineSize : blockSize) || 0
    });
};
var zeroBoxes = Object.freeze({
    devicePixelContentBoxSize: size(),
    borderBoxSize: size(),
    contentBoxSize: size(),
    contentRect: new DOMRectReadOnly(0, 0, 0, 0)
});
var calculateBoxSizes = function (target, forceRecalculation) {
    if (forceRecalculation === void 0) { forceRecalculation = false; }
    if (cache.has(target) && !forceRecalculation) {
        return cache.get(target);
    }
    if (isHidden(target)) {
        cache.set(target, zeroBoxes);
        return zeroBoxes;
    }
    var cs = getComputedStyle(target);
    var svg = isSVG(target) && target.ownerSVGElement && target.getBBox();
    var removePadding = !IE && cs.boxSizing === 'border-box';
    var switchSizes = verticalRegexp.test(cs.writingMode || '');
    var canScrollVertically = !svg && scrollRegexp.test(cs.overflowY || '');
    var canScrollHorizontally = !svg && scrollRegexp.test(cs.overflowX || '');
    var paddingTop = svg ? 0 : parseDimension(cs.paddingTop);
    var paddingRight = svg ? 0 : parseDimension(cs.paddingRight);
    var paddingBottom = svg ? 0 : parseDimension(cs.paddingBottom);
    var paddingLeft = svg ? 0 : parseDimension(cs.paddingLeft);
    var borderTop = svg ? 0 : parseDimension(cs.borderTopWidth);
    var borderRight = svg ? 0 : parseDimension(cs.borderRightWidth);
    var borderBottom = svg ? 0 : parseDimension(cs.borderBottomWidth);
    var borderLeft = svg ? 0 : parseDimension(cs.borderLeftWidth);
    var horizontalPadding = paddingLeft + paddingRight;
    var verticalPadding = paddingTop + paddingBottom;
    var horizontalBorderArea = borderLeft + borderRight;
    var verticalBorderArea = borderTop + borderBottom;
    var horizontalScrollbarThickness = !canScrollHorizontally ? 0 : target.offsetHeight - verticalBorderArea - target.clientHeight;
    var verticalScrollbarThickness = !canScrollVertically ? 0 : target.offsetWidth - horizontalBorderArea - target.clientWidth;
    var widthReduction = removePadding ? horizontalPadding + horizontalBorderArea : 0;
    var heightReduction = removePadding ? verticalPadding + verticalBorderArea : 0;
    var contentWidth = svg ? svg.width : parseDimension(cs.width) - widthReduction - verticalScrollbarThickness;
    var contentHeight = svg ? svg.height : parseDimension(cs.height) - heightReduction - horizontalScrollbarThickness;
    var borderBoxWidth = contentWidth + horizontalPadding + verticalScrollbarThickness + horizontalBorderArea;
    var borderBoxHeight = contentHeight + verticalPadding + horizontalScrollbarThickness + verticalBorderArea;
    var boxes = Object.freeze({
        devicePixelContentBoxSize: size(Math.round(contentWidth * devicePixelRatio), Math.round(contentHeight * devicePixelRatio), switchSizes),
        borderBoxSize: size(borderBoxWidth, borderBoxHeight, switchSizes),
        contentBoxSize: size(contentWidth, contentHeight, switchSizes),
        contentRect: new DOMRectReadOnly(paddingLeft, paddingTop, contentWidth, contentHeight)
    });
    cache.set(target, boxes);
    return boxes;
};
var calculateBoxSize = function (target, observedBox, forceRecalculation) {
    var _a = calculateBoxSizes(target, forceRecalculation), borderBoxSize = _a.borderBoxSize, contentBoxSize = _a.contentBoxSize, devicePixelContentBoxSize = _a.devicePixelContentBoxSize;
    switch (observedBox) {
        case ResizeObserverBoxOptions.DEVICE_PIXEL_CONTENT_BOX:
            return devicePixelContentBoxSize;
        case ResizeObserverBoxOptions.BORDER_BOX:
            return borderBoxSize;
        default:
            return contentBoxSize;
    }
};

var ResizeObserverEntry = (function () {
    function ResizeObserverEntry(target) {
        var boxes = calculateBoxSizes(target);
        this.target = target;
        this.contentRect = boxes.contentRect;
        this.borderBoxSize = [boxes.borderBoxSize];
        this.contentBoxSize = [boxes.contentBoxSize];
        this.devicePixelContentBoxSize = [boxes.devicePixelContentBoxSize];
    }
    return ResizeObserverEntry;
}());

var calculateDepthForNode = function (node) {
    if (isHidden(node)) {
        return Infinity;
    }
    var depth = 0;
    var parent = node.parentNode;
    while (parent) {
        depth += 1;
        parent = parent.parentNode;
    }
    return depth;
};

var broadcastActiveObservations = function () {
    var shallowestDepth = Infinity;
    var callbacks = [];
    resizeObservers.forEach(function processObserver(ro) {
        if (ro.activeTargets.length === 0) {
            return;
        }
        var entries = [];
        ro.activeTargets.forEach(function processTarget(ot) {
            var entry = new ResizeObserverEntry(ot.target);
            var targetDepth = calculateDepthForNode(ot.target);
            entries.push(entry);
            ot.lastReportedSize = calculateBoxSize(ot.target, ot.observedBox);
            if (targetDepth < shallowestDepth) {
                shallowestDepth = targetDepth;
            }
        });
        callbacks.push(function resizeObserverCallback() {
            ro.callback.call(ro.observer, entries, ro.observer);
        });
        ro.activeTargets.splice(0, ro.activeTargets.length);
    });
    for (var _i = 0, callbacks_1 = callbacks; _i < callbacks_1.length; _i++) {
        var callback = callbacks_1[_i];
        callback();
    }
    return shallowestDepth;
};

var gatherActiveObservationsAtDepth = function (depth) {
    resizeObservers.forEach(function processObserver(ro) {
        ro.activeTargets.splice(0, ro.activeTargets.length);
        ro.skippedTargets.splice(0, ro.skippedTargets.length);
        ro.observationTargets.forEach(function processTarget(ot) {
            if (ot.isActive()) {
                if (calculateDepthForNode(ot.target) > depth) {
                    ro.activeTargets.push(ot);
                }
                else {
                    ro.skippedTargets.push(ot);
                }
            }
        });
    });
};

var process$3 = function () {
    var depth = 0;
    gatherActiveObservationsAtDepth(depth);
    while (hasActiveObservations()) {
        depth = broadcastActiveObservations();
        gatherActiveObservationsAtDepth(depth);
    }
    if (hasSkippedObservations()) {
        deliverResizeLoopError();
    }
    return depth > 0;
};

var trigger;
var callbacks = [];
var notify$1 = function () { return callbacks.splice(0).forEach(function (cb) { return cb(); }); };
var queueMicroTask = function (callback) {
    if (!trigger) {
        var toggle_1 = 0;
        var el_1 = document.createTextNode('');
        var config = { characterData: true };
        new MutationObserver(function () { return notify$1(); }).observe(el_1, config);
        trigger = function () { el_1.textContent = "" + (toggle_1 ? toggle_1-- : toggle_1++); };
    }
    callbacks.push(callback);
    trigger();
};

var queueResizeObserver = function (cb) {
    queueMicroTask(function ResizeObserver() {
        requestAnimationFrame(cb);
    });
};

var watching = 0;
var isWatching = function () { return !!watching; };
var CATCH_PERIOD = 250;
var observerConfig = { attributes: true, characterData: true, childList: true, subtree: true };
var events = [
    'resize',
    'load',
    'transitionend',
    'animationend',
    'animationstart',
    'animationiteration',
    'keyup',
    'keydown',
    'mouseup',
    'mousedown',
    'mouseover',
    'mouseout',
    'blur',
    'focus'
];
var time = function (timeout) {
    if (timeout === void 0) { timeout = 0; }
    return Date.now() + timeout;
};
var scheduled = false;
var Scheduler = (function () {
    function Scheduler() {
        var _this = this;
        this.stopped = true;
        this.listener = function () { return _this.schedule(); };
    }
    Scheduler.prototype.run = function (timeout) {
        var _this = this;
        if (timeout === void 0) { timeout = CATCH_PERIOD; }
        if (scheduled) {
            return;
        }
        scheduled = true;
        var until = time(timeout);
        queueResizeObserver(function () {
            var elementsHaveResized = false;
            try {
                elementsHaveResized = process$3();
            }
            finally {
                scheduled = false;
                timeout = until - time();
                if (!isWatching()) {
                    return;
                }
                if (elementsHaveResized) {
                    _this.run(1000);
                }
                else if (timeout > 0) {
                    _this.run(timeout);
                }
                else {
                    _this.start();
                }
            }
        });
    };
    Scheduler.prototype.schedule = function () {
        this.stop();
        this.run();
    };
    Scheduler.prototype.observe = function () {
        var _this = this;
        var cb = function () { return _this.observer && _this.observer.observe(document.body, observerConfig); };
        document.body ? cb() : global$1.addEventListener('DOMContentLoaded', cb);
    };
    Scheduler.prototype.start = function () {
        var _this = this;
        if (this.stopped) {
            this.stopped = false;
            this.observer = new MutationObserver(this.listener);
            this.observe();
            events.forEach(function (name) { return global$1.addEventListener(name, _this.listener, true); });
        }
    };
    Scheduler.prototype.stop = function () {
        var _this = this;
        if (!this.stopped) {
            this.observer && this.observer.disconnect();
            events.forEach(function (name) { return global$1.removeEventListener(name, _this.listener, true); });
            this.stopped = true;
        }
    };
    return Scheduler;
}());
var scheduler = new Scheduler();
var updateCount = function (n) {
    !watching && n > 0 && scheduler.start();
    watching += n;
    !watching && scheduler.stop();
};

var skipNotifyOnElement = function (target) {
    return !isSVG(target)
        && !isReplacedElement(target)
        && getComputedStyle(target).display === 'inline';
};
var ResizeObservation = (function () {
    function ResizeObservation(target, observedBox) {
        this.target = target;
        this.observedBox = observedBox || ResizeObserverBoxOptions.CONTENT_BOX;
        this.lastReportedSize = {
            inlineSize: 0,
            blockSize: 0
        };
    }
    ResizeObservation.prototype.isActive = function () {
        var size = calculateBoxSize(this.target, this.observedBox, true);
        if (skipNotifyOnElement(this.target)) {
            this.lastReportedSize = size;
        }
        if (this.lastReportedSize.inlineSize !== size.inlineSize
            || this.lastReportedSize.blockSize !== size.blockSize) {
            return true;
        }
        return false;
    };
    return ResizeObservation;
}());

var ResizeObserverDetail = (function () {
    function ResizeObserverDetail(resizeObserver, callback) {
        this.activeTargets = [];
        this.skippedTargets = [];
        this.observationTargets = [];
        this.observer = resizeObserver;
        this.callback = callback;
    }
    return ResizeObserverDetail;
}());

var observerMap = new WeakMap();
var getObservationIndex = function (observationTargets, target) {
    for (var i = 0; i < observationTargets.length; i += 1) {
        if (observationTargets[i].target === target) {
            return i;
        }
    }
    return -1;
};
var ResizeObserverController = (function () {
    function ResizeObserverController() {
    }
    ResizeObserverController.connect = function (resizeObserver, callback) {
        var detail = new ResizeObserverDetail(resizeObserver, callback);
        observerMap.set(resizeObserver, detail);
    };
    ResizeObserverController.observe = function (resizeObserver, target, options) {
        var detail = observerMap.get(resizeObserver);
        var firstObservation = detail.observationTargets.length === 0;
        if (getObservationIndex(detail.observationTargets, target) < 0) {
            firstObservation && resizeObservers.push(detail);
            detail.observationTargets.push(new ResizeObservation(target, options && options.box));
            updateCount(1);
            scheduler.schedule();
        }
    };
    ResizeObserverController.unobserve = function (resizeObserver, target) {
        var detail = observerMap.get(resizeObserver);
        var index = getObservationIndex(detail.observationTargets, target);
        var lastObservation = detail.observationTargets.length === 1;
        if (index >= 0) {
            lastObservation && resizeObservers.splice(resizeObservers.indexOf(detail), 1);
            detail.observationTargets.splice(index, 1);
            updateCount(-1);
        }
    };
    ResizeObserverController.disconnect = function (resizeObserver) {
        var _this = this;
        var detail = observerMap.get(resizeObserver);
        detail.observationTargets.slice().forEach(function (ot) { return _this.unobserve(resizeObserver, ot.target); });
        detail.activeTargets.splice(0, detail.activeTargets.length);
    };
    return ResizeObserverController;
}());

var ResizeObserver = (function () {
    function ResizeObserver(callback) {
        if (arguments.length === 0) {
            throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");
        }
        if (typeof callback !== 'function') {
            throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");
        }
        ResizeObserverController.connect(this, callback);
    }
    ResizeObserver.prototype.observe = function (target, options) {
        if (arguments.length === 0) {
            throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");
        }
        if (!isElement(target)) {
            throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");
        }
        ResizeObserverController.observe(this, target, options);
    };
    ResizeObserver.prototype.unobserve = function (target) {
        if (arguments.length === 0) {
            throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");
        }
        if (!isElement(target)) {
            throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");
        }
        ResizeObserverController.unobserve(this, target);
    };
    ResizeObserver.prototype.disconnect = function () {
        ResizeObserverController.disconnect(this);
    };
    ResizeObserver.toString = function () {
        return 'function ResizeObserver () { [polyfill code] }';
    };
    return ResizeObserver;
}());

var _window$ResizeObserve;
/**
 * @hidden
 */
// tslint:disable-next-line: variable-name no-any

var ResizeObserver$1 = (_window$ResizeObserve = window.ResizeObserver) !== null && _window$ResizeObserve !== void 0 ? _window$ResizeObserve : ResizeObserver;
var GUI = /*#__PURE__*/function () {
  function GUI(options) {
    var _this = this;

    classCallCheck(this, GUI);

    this.scanner = options.scanner;
    this.originElement = options.originElement;
    this.singleImageModeEnabled = options.singleImageModeEnabled;
    this.singleImageModeSettings = options.singleImageModeSettings;
    this.scanningPaused = options.scanningPaused;
    this.cameraUploadCallback = options.cameraUploadCallback;
    this.mirrorImageOverrides = new map$1();
    this.cameraUploadInProgress = false;
    this.cameraSwitchInProgress = false;
    this.engineContextCreated = false;
    this.grandParentElement = document.createElement("div");
    this.grandParentElement.className = GUI.grandParentElementClassName;
    this.originElement.appendChild(this.grandParentElement);
    this.parentElement = document.createElement("div");
    this.parentElement.className = GUI.parentElementClassName;
    this.grandParentElement.appendChild(this.parentElement);
    this.videoElement = document.createElement("video");
    this.cameraSwitcherElement = document.createElement("img");
    this.torchTogglerElement = document.createElement("img");
    this.laserContainerElement = document.createElement("div");
    this.laserActiveImageElement = document.createElement("img");
    this.laserPausedImageElement = document.createElement("img");
    this.viewfinderElement = document.createElement("div");
    var canvas = document.createElement("canvas");

    if (options.singleImageModeEnabled) {
      this.context2d = canvas.getContext("2d");
      this.cameraUploadElement = document.createElement("div");
      this.cameraUploadLabelElement = document.createElement("label");
      this.cameraUploadInputElement = document.createElement("input");
      this.cameraUploadProgressElement = document.createElement("div");
      this.setupCameraUploadGuiAssets();
      this.guiStyle = BarcodePicker.GuiStyle.NONE;
    } else {
      this.setupContext(canvas);
      this.setupVideoElement();
      this.setupCameraSwitcher();
      this.setupTorchToggler();
      this.setupFullGuiAssets();
      this.setGuiStyle(options.guiStyle);
      this.setVideoFit(options.videoFit);
      this.setLaserArea(options.laserArea);
      this.setViewfinderArea(options.viewfinderArea); // Ensure the camera is accessed and the video plays again correctly when visibility changes

      this.visibilityListener = this.checkAndRecoverPlayback.bind(this);
      document.addEventListener("visibilitychange", this.visibilityListener);
      this.newScanSettingsListener = this.handleNewScanSettings.bind(this);
      this.scanner.on("newScanSettings", this.newScanSettingsListener);
      this.handleNewScanSettings();
      this.videoPauseListener = this.handleVideoPause.bind(this);
      this.videoElement.addEventListener("pause", this.videoPauseListener);
      this.videoResizeListener = this.handleVideoResize.bind(this);
      this.videoElement.addEventListener("resize", this.videoResizeListener);
    }

    if (options.hideLogo) {
      this.contextCreatedShowLogoListener = this.showScanditLogo.bind(this, options.hideLogo);
      this.scanner.on("contextCreated", this.contextCreatedShowLogoListener);
    } else {
      this.showScanditLogo(options.hideLogo);
    }

    this.contextCreatedActivateGUIListener = this.activateGUI.bind(this);
    this.scanner.on("contextCreated", this.contextCreatedActivateGUIListener);
    this.resize();
    this.resizeObserver = new ResizeObserver$1(
    /* istanbul ignore next */
    function () {
      _this.resize();
    });
    this.resizeObserver.observe(this.originElement);
    this.setVisible(options.visible);
  }

  createClass(GUI, [{
    key: "destroy",
    value: function destroy() {
      if (this.visibilityListener != null) {
        document.removeEventListener("visibilitychange", this.visibilityListener);
      }

      if (this.newScanSettingsListener != null) {
        this.scanner.removeListener("newScanSettings", this.newScanSettingsListener);
      }

      if (this.videoPauseListener != null) {
        this.videoElement.removeEventListener("pause", this.videoPauseListener);
      }

      if (this.videoResizeListener != null) {
        this.videoElement.removeEventListener("resize", this.videoResizeListener);
      }

      if (this.contextCreatedShowLogoListener != null) {
        this.scanner.removeListener("contextCreated", this.contextCreatedShowLogoListener);
      }

      if (this.contextCreatedActivateGUIListener != null) {
        this.scanner.removeListener("contextCreated", this.contextCreatedActivateGUIListener);
      }

      this.resizeObserver.disconnect();
      this.grandParentElement.remove();
      this.originElement.classList.remove(GUI.hiddenClassName);
    }
  }, {
    key: "setCameraManager",
    value: function setCameraManager(cameraManager) {
      this.cameraManager = cameraManager;
    }
  }, {
    key: "pauseScanning",
    value: function pauseScanning() {
      this.scanningPaused = true;
      this.laserActiveImageElement.classList.add(GUI.hiddenOpacityClassName);
      this.laserPausedImageElement.classList.remove(GUI.hiddenOpacityClassName);
      this.viewfinderElement.classList.add(GUI.pausedClassName);
    }
  }, {
    key: "resumeScanning",
    value: function resumeScanning() {
      this.scanningPaused = false;

      if (this.engineContextCreated) {
        this.laserPausedImageElement.classList.add(GUI.hiddenOpacityClassName);
        this.laserActiveImageElement.classList.remove(GUI.hiddenOpacityClassName);
        this.viewfinderElement.classList.remove(GUI.pausedClassName);
      }
    }
  }, {
    key: "isVisible",
    value: function isVisible() {
      return this.visible;
    }
  }, {
    key: "setVisible",
    value: function setVisible(visible) {
      this.visible = visible;

      if (visible) {
        this.originElement.classList.remove(GUI.hiddenClassName);

        if (this.guiStyle === BarcodePicker.GuiStyle.LASER) {
          this.laserActiveImageElement.classList.remove(GUI.flashColorClassName);
        } else if (this.guiStyle === BarcodePicker.GuiStyle.VIEWFINDER) {
          this.viewfinderElement.classList.remove(GUI.flashWhiteClassName);
        }
      } else {
        this.originElement.classList.add(GUI.hiddenClassName);
      }
    }
  }, {
    key: "isMirrorImageEnabled",
    value: function isMirrorImageEnabled() {
      var _this$cameraManager, _this$cameraManager2;

      if (((_this$cameraManager = this.cameraManager) === null || _this$cameraManager === void 0 ? void 0 : _this$cameraManager.selectedCamera) != null && ((_this$cameraManager2 = this.cameraManager) === null || _this$cameraManager2 === void 0 ? void 0 : _this$cameraManager2.activeCamera) != null) {
        var mirrorImageOverride = this.mirrorImageOverrides.get(this.cameraManager.activeCamera);
        return mirrorImageOverride !== null && mirrorImageOverride !== void 0 ? mirrorImageOverride : this.cameraManager.activeCamera.cameraType === Camera.Type.FRONT;
      } else {
        return false;
      }
    }
  }, {
    key: "setMirrorImageEnabled",
    value: function setMirrorImageEnabled(enabled, override) {
      var _this$cameraManager3;

      if (((_this$cameraManager3 = this.cameraManager) === null || _this$cameraManager3 === void 0 ? void 0 : _this$cameraManager3.selectedCamera) != null) {
        if (enabled) {
          this.videoElement.classList.add(GUI.mirroredClassName);
        } else {
          this.videoElement.classList.remove(GUI.mirroredClassName);
        }

        if (override) {
          this.mirrorImageOverrides.set(this.cameraManager.selectedCamera, enabled);
        }
      }
    }
  }, {
    key: "setGuiStyle",
    value: function setGuiStyle(guiStyle) {
      if (this.singleImageModeEnabled) {
        return;
      }

      switch (guiStyle) {
        case BarcodePicker.GuiStyle.LASER:
          this.guiStyle = guiStyle;
          this.laserContainerElement.classList.remove(GUI.hiddenClassName);
          this.viewfinderElement.classList.add(GUI.hiddenClassName);
          break;

        case BarcodePicker.GuiStyle.VIEWFINDER:
          this.guiStyle = guiStyle;
          this.laserContainerElement.classList.add(GUI.hiddenClassName);
          this.viewfinderElement.classList.remove(GUI.hiddenClassName);
          break;

        case BarcodePicker.GuiStyle.NONE:
        default:
          this.guiStyle = BarcodePicker.GuiStyle.NONE;
          this.laserContainerElement.classList.add(GUI.hiddenClassName);
          this.viewfinderElement.classList.add(GUI.hiddenClassName);
          break;
      }
    }
  }, {
    key: "setLaserArea",
    value: function setLaserArea(area) {
      this.customLaserArea = area;

      if (area == null) {
        area = this.scanner.getScanSettings().getSearchArea();
      }

      var borderPercentage = 0.025;
      var usablePercentage = 1 - borderPercentage * 2;
      this.laserContainerElement.style.left = "".concat((borderPercentage + area.x * usablePercentage) * 100, "%");
      this.laserContainerElement.style.width = "".concat(area.width * usablePercentage * 100, "%");
      this.laserContainerElement.style.top = "".concat((borderPercentage + area.y * usablePercentage) * 100, "%");
      this.laserContainerElement.style.height = "".concat(area.height * usablePercentage * 100, "%");
    }
  }, {
    key: "setViewfinderArea",
    value: function setViewfinderArea(area) {
      this.customViewfinderArea = area;

      if (area == null) {
        area = this.scanner.getScanSettings().getSearchArea();
      }

      var borderPercentage = 0.025;
      var usablePercentage = 1 - borderPercentage * 2;
      this.viewfinderElement.style.left = "".concat((borderPercentage + area.x * usablePercentage) * 100, "%");
      this.viewfinderElement.style.width = "".concat(area.width * usablePercentage * 100, "%");
      this.viewfinderElement.style.top = "".concat((borderPercentage + area.y * usablePercentage) * 100, "%");
      this.viewfinderElement.style.height = "".concat(area.height * usablePercentage * 100, "%");
    }
  }, {
    key: "setVideoFit",
    value: function setVideoFit(objectFit) {
      if (this.singleImageModeEnabled) {
        return;
      }

      this.videoFit = objectFit;

      if (objectFit === BarcodePicker.ObjectFit.COVER) {
        this.videoElement.style.objectFit = "cover";
        this.videoElement.dataset.objectFit = "cover"; // used by "objectFitPolyfill" library
      } else {
        this.videoElement.style.objectFit = "contain";
        this.videoElement.dataset.objectFit = "contain"; // used by "objectFitPolyfill" library

        this.scanner.applyScanSettings(this.scanner.getScanSettings().setBaseSearchArea({
          x: 0,
          y: 0,
          width: 1.0,
          height: 1.0
        }));
      }

      this.resize();
    }
  }, {
    key: "reassignOriginElement",
    value: function reassignOriginElement(originElement) {
      if (!this.visible) {
        this.originElement.classList.remove(GUI.hiddenClassName);
        originElement.classList.add(GUI.hiddenClassName);
      }

      originElement.appendChild(this.grandParentElement);
      this.checkAndRecoverPlayback().catch(
      /* istanbul ignore next */
      function () {// Ignored
      });
      this.resize();
      this.resizeObserver.disconnect();
      this.resizeObserver.observe(originElement);
      this.originElement = originElement;
    }
  }, {
    key: "flashGUI",
    value: function flashGUI() {
      if (this.guiStyle === BarcodePicker.GuiStyle.LASER) {
        this.flashLaser();
      } else if (this.guiStyle === BarcodePicker.GuiStyle.VIEWFINDER) {
        this.flashViewfinder();
      }
    }
  }, {
    key: "getImageData",
    value: function getImageData(imageData) {
      function isVideoAndContextStateValid(videoElement, context) {
        // This could happen in unexpected situations and should be temporary
        return videoElement.readyState === 4 && videoElement.videoWidth > 2 && videoElement.videoHeight > 2 && context.canvas.width > 2 && context.canvas.height > 2;
      }

      if (this.singleImageModeEnabled && this.context2d != null) {
        return new Uint8Array(this.context2d.getImageData(0, 0, this.context2d.canvas.width, this.context2d.canvas.height).data.buffer);
      } // istanbul ignore else


      if (!this.singleImageModeEnabled) {
        if (this.contextWebGL != null) {
          if (!isVideoAndContextStateValid(this.videoElement, this.contextWebGL) || this.contextWebGL.drawingBufferWidth <= 2 || this.contextWebGL.drawingBufferHeight <= 2) {
            return;
          }

          var imageDataLength = this.contextWebGL.drawingBufferWidth * this.contextWebGL.drawingBufferHeight * 4;

          if (imageData == null || imageData.byteLength === 0 || imageData.byteLength !== imageDataLength) {
            imageData = new Uint8Array(imageDataLength);
          }

          this.contextWebGL.texImage2D(this.contextWebGL.TEXTURE_2D, 0, this.contextWebGL.RGBA, this.contextWebGL.RGBA, this.contextWebGL.UNSIGNED_BYTE, this.videoElement);
          this.contextWebGL.readPixels(0, 0, this.contextWebGL.drawingBufferWidth, this.contextWebGL.drawingBufferHeight, this.contextWebGL.RGBA, this.contextWebGL.UNSIGNED_BYTE, imageData);
          return imageData;
        } // istanbul ignore else


        if (this.context2d != null) {
          if (!isVideoAndContextStateValid(this.videoElement, this.context2d)) {
            return;
          }

          this.context2d.drawImage(this.videoElement, 0, 0);
          return new Uint8Array(this.context2d.getImageData(0, 0, this.context2d.canvas.width, this.context2d.canvas.height).data.buffer);
        }
      } // istanbul ignore next


      return;
    }
  }, {
    key: "getVideoCurrentTime",
    value: function getVideoCurrentTime() {
      return this.videoElement.currentTime;
    }
  }, {
    key: "setCameraSwitcherVisible",
    value: function setCameraSwitcherVisible(visible) {
      if (visible) {
        this.cameraSwitcherElement.classList.remove(GUI.hiddenClassName);
      } else {
        this.cameraSwitcherElement.classList.add(GUI.hiddenClassName);
      }
    }
  }, {
    key: "setTorchTogglerVisible",
    value: function setTorchTogglerVisible(visible) {
      if (visible) {
        this.torchTogglerElement.classList.remove(GUI.hiddenClassName);
      } else {
        this.torchTogglerElement.classList.add(GUI.hiddenClassName);
      }
    }
  }, {
    key: "playVideo",
    value: function playVideo() {
      var playPromise = this.videoElement.play();
      playPromise === null || playPromise === void 0 ? void 0 : playPromise.catch(
      /* istanbul ignore next */
      function () {// Can sometimes cause an incorrect rejection (all is good, ignore).
      });
    }
  }, {
    key: "setCameraType",
    value: function setCameraType(cameraType) {
      var _this$cameraUploadInp;

      (_this$cameraUploadInp = this.cameraUploadInputElement) === null || _this$cameraUploadInp === void 0 ? void 0 : _this$cameraUploadInp.setAttribute("capture", cameraType === Camera.Type.FRONT ? "user" : "environment");
    }
  }, {
    key: "setCameraUploadGuiBusyScanning",
    value: function setCameraUploadGuiBusyScanning(busyScanning) {
      if (busyScanning) {
        this.cameraUploadProgressElement.classList.remove(GUI.flashInsetClassName);
        this.cameraUploadElement.classList.add(GUI.opacityPulseClassName);
      } else {
        this.cameraUploadProgressElement.classList.add(GUI.flashInsetClassName);
        this.cameraUploadElement.classList.remove(GUI.opacityPulseClassName);
      }
    }
  }, {
    key: "setupContext",
    value: function setupContext(canvas) {
      var _this2 = this;

      var context = canvas.getContext("webgl", {
        alpha: false,
        antialias: false
      }); // istanbul ignore if

      if (context == null) {
        context = canvas.getContext("experimental-webgl", {
          alpha: false,
          antialias: false
        });
      }

      if (context != null) {
        this.setupWebGL(context);
        canvas.addEventListener("webglcontextlost", function () {
          // We recreate instead of waiting for restore via the webglcontextrestored event as restore might never happen
          console.warn("WebGL context has been lost, restoring...");
          _this2.contextWebGL = undefined;

          _this2.setupContext(document.createElement("canvas"));

          _this2.handleVideoResize();

          console.warn("WebGL context restored");
        });
      } else {
        this.context2d = canvas.getContext("2d");
      }
    }
  }, {
    key: "setupWebGL",
    value: function setupWebGL(contextWebGL) {
      var texture = contextWebGL.createTexture();
      contextWebGL.bindTexture(contextWebGL.TEXTURE_2D, texture);
      var frameBuffer = contextWebGL.createFramebuffer();
      contextWebGL.bindFramebuffer(contextWebGL.FRAMEBUFFER, frameBuffer);
      contextWebGL.framebufferTexture2D(contextWebGL.FRAMEBUFFER, contextWebGL.COLOR_ATTACHMENT0, contextWebGL.TEXTURE_2D, texture, 0);
      contextWebGL.texParameteri(contextWebGL.TEXTURE_2D, contextWebGL.TEXTURE_WRAP_S, contextWebGL.CLAMP_TO_EDGE);
      contextWebGL.texParameteri(contextWebGL.TEXTURE_2D, contextWebGL.TEXTURE_WRAP_T, contextWebGL.CLAMP_TO_EDGE);
      contextWebGL.texParameteri(contextWebGL.TEXTURE_2D, contextWebGL.TEXTURE_MIN_FILTER, contextWebGL.NEAREST);
      contextWebGL.texParameteri(contextWebGL.TEXTURE_2D, contextWebGL.TEXTURE_MAG_FILTER, contextWebGL.NEAREST);
      this.contextWebGL = contextWebGL;
    }
  }, {
    key: "setupVideoElement",
    value: function setupVideoElement() {
      this.videoElement.setAttribute("autoplay", "autoplay");
      this.videoElement.setAttribute("playsinline", "true");
      this.videoElement.setAttribute("muted", "muted");
      this.videoElement.className = GUI.videoElementClassName;
      this.parentElement.appendChild(this.videoElement);
    }
  }, {
    key: "setupCameraUploadGuiAssets",
    value: function setupCameraUploadGuiAssets() {
      var _this$singleImageMode,
          _this3 = this,
          _this$singleImageMode2;

      var deviceType = BrowserHelper.userAgentInfo.getDevice().type;
      var defaultSettings = deviceType === "mobile" || deviceType === "tablet" ? SingleImageModeSettings.defaultMobile : SingleImageModeSettings.defaultDesktop;
      this.cameraUploadElement.className = GUI.cameraUploadElementClassName;

      assign$1(this.cameraUploadElement.style, defaultSettings.containerStyle, this.singleImageModeSettings.containerStyle);

      this.parentElement.appendChild(this.cameraUploadElement);
      var informationElement = (_this$singleImageMode = this.singleImageModeSettings.informationElement) !== null && _this$singleImageMode !== void 0 ? _this$singleImageMode : defaultSettings.informationElement;

      assign$1(informationElement.style, defaultSettings.informationStyle, this.singleImageModeSettings.informationStyle);

      this.cameraUploadElement.appendChild(informationElement);
      this.cameraUploadInputElement.type = "file";
      this.cameraUploadInputElement.accept = "image/*";
      this.cameraUploadInputElement.addEventListener("change", this.cameraUploadFile.bind(this));

      var cameraUploadInputCheckFunction = function cameraUploadInputCheckFunction(event) {
        // istanbul ignore next
        if (_this3.scanningPaused || _this3.cameraUploadInProgress) {
          event.preventDefault();
        }
      };

      this.cameraUploadInputElement.addEventListener("click", cameraUploadInputCheckFunction);
      this.cameraUploadInputElement.addEventListener("keydown", cameraUploadInputCheckFunction);
      this.cameraUploadLabelElement.appendChild(this.cameraUploadInputElement);
      var cameraUploadButtonIconElement = (_this$singleImageMode2 = this.singleImageModeSettings.buttonElement) !== null && _this$singleImageMode2 !== void 0 ? _this$singleImageMode2 : defaultSettings.buttonElement;
      [this.cameraUploadProgressElement.style, cameraUploadButtonIconElement.style].forEach(function (style) {
        assign$1(style, defaultSettings.buttonStyle, _this3.singleImageModeSettings.buttonStyle);
      });
      cameraUploadButtonIconElement.style.maxWidth = "100px";
      cameraUploadButtonIconElement.style.maxHeight = "100px";
      this.cameraUploadLabelElement.appendChild(cameraUploadButtonIconElement);
      this.cameraUploadProgressElement.classList.add("radial-progress");
      this.cameraUploadLabelElement.appendChild(this.cameraUploadProgressElement);
      this.cameraUploadElement.appendChild(this.cameraUploadLabelElement);
    }
  }, {
    key: "setupFullGuiAssets",
    value: function setupFullGuiAssets() {
      this.laserActiveImageElement.src = laserActiveImage;
      this.laserContainerElement.appendChild(this.laserActiveImageElement);
      this.laserPausedImageElement.src = laserPausedImage;
      this.laserContainerElement.appendChild(this.laserPausedImageElement);
      this.laserContainerElement.className = GUI.laserContainerElementClassName;
      this.parentElement.appendChild(this.laserContainerElement);
      this.viewfinderElement.className = GUI.viewfinderElementClassName;
      this.parentElement.appendChild(this.viewfinderElement); // Show inactive GUI, as for now the scanner isn't ready yet

      this.laserActiveImageElement.classList.add(GUI.hiddenOpacityClassName);
      this.laserPausedImageElement.classList.remove(GUI.hiddenOpacityClassName);
      this.viewfinderElement.classList.add(GUI.pausedClassName);
    }
  }, {
    key: "flashLaser",
    value: function flashLaser() {
      this.laserActiveImageElement.classList.remove(GUI.flashColorClassName); // tslint:disable-next-line:no-unused-expression

      this.laserActiveImageElement.offsetHeight; // NOSONAR // Trigger reflow to restart animation

      this.laserActiveImageElement.classList.add(GUI.flashColorClassName);
    }
  }, {
    key: "flashViewfinder",
    value: function flashViewfinder() {
      this.viewfinderElement.classList.remove(GUI.flashWhiteClassName); // tslint:disable-next-line:no-unused-expression

      this.viewfinderElement.offsetHeight; // NOSONAR // Trigger reflow to restart animation

      this.viewfinderElement.classList.add(GUI.flashWhiteClassName);
    }
  }, {
    key: "resize",
    value: function resize() {
      this.parentElement.style.maxWidth = "";
      this.parentElement.style.maxHeight = "";
      var width = this.originElement.clientWidth;
      var height = this.originElement.clientHeight;

      if (width === 0 || height === 0) {
        if (!this.singleImageModeEnabled) {
          this.handleVideoDisplay(true);
        }

        return;
      }

      if (this.singleImageModeEnabled) {
        this.resizeCameraUpload(width, height);
      } else {
        this.resizeVideo(width, height);
        this.handleVideoDisplay(false);
      }
    }
  }, {
    key: "resizeCameraUpload",
    value: function resizeCameraUpload(width, height) {
      this.cameraUploadLabelElement.style.transform = "scale(".concat(Math.min(1, width / 300, height / 300), ")");
    }
  }, {
    key: "resizeVideo",
    value: function resizeVideo(width, height) {
      if (this.videoElement.videoWidth <= 2 || this.videoElement.videoHeight <= 2) {
        return;
      }

      var videoRatio = this.videoElement.videoWidth / this.videoElement.videoHeight;

      if (this.videoFit === BarcodePicker.ObjectFit.COVER) {
        var widthPercentage = 1;
        var heightPercentage = 1;

        if (videoRatio < width / height) {
          heightPercentage = Math.min(1, height / (width / videoRatio));
        } else {
          widthPercentage = Math.min(1, width / (height * videoRatio));
        }

        this.scanner.applyScanSettings(this.scanner.getScanSettings().setBaseSearchArea({
          x: (1 - widthPercentage) / 2,
          y: (1 - heightPercentage) / 2,
          width: widthPercentage,
          height: heightPercentage
        }));
        return;
      }

      if (videoRatio > width / height) {
        height = width / videoRatio;
      } else {
        width = height * videoRatio;
      }

      this.parentElement.style.maxWidth = "".concat(Math.ceil(width), "px");
      this.parentElement.style.maxHeight = "".concat(Math.ceil(height), "px");
      window.objectFitPolyfill(this.videoElement);
    }
  }, {
    key: "checkAndRecoverPlayback",
    value: function () {
      var _checkAndRecoverPlayback = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
        var _this$cameraManager4, _this$videoElement;

        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(document.visibilityState === "visible" && ((_this$cameraManager4 = this.cameraManager) === null || _this$cameraManager4 === void 0 ? void 0 : _this$cameraManager4.activeCamera) != null && ((_this$videoElement = this.videoElement) === null || _this$videoElement === void 0 ? void 0 : _this$videoElement.srcObject) != null)) {
                  _context.next = 14;
                  break;
                }

                if (this.videoElement.srcObject.active) {
                  _context.next = 12;
                  break;
                }

                _context.prev = 2;
                console.debug('Detected visibility change ("visible") event with inactive video source, try to reinitialize camera');
                _context.next = 6;
                return this.cameraManager.reinitializeCamera();

              case 6:
                _context.next = 10;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](2);

              case 10:
                _context.next = 14;
                break;

              case 12:
                console.debug('Detected visibility change ("visible") event with active video source, replay video');
                this.playVideo();

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 8]]);
      }));

      function checkAndRecoverPlayback() {
        return _checkAndRecoverPlayback.apply(this, arguments);
      }

      return checkAndRecoverPlayback;
    }()
  }, {
    key: "updateCameraUploadProgress",
    value: function updateCameraUploadProgress(progressPercentageValue) {
      this.cameraUploadProgressElement.setAttribute("data-progress", progressPercentageValue);
    }
  }, {
    key: "cameraUploadImageLoad",
    value: function () {
      var _cameraUploadImageLoad = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(image) {
        var resizedImageWidth, resizedImageHeight, resizedImageSizeLimit;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.updateCameraUploadProgress("100");
                resizedImageSizeLimit = 1440;

                if (image.naturalWidth <= resizedImageSizeLimit && image.naturalHeight <= resizedImageSizeLimit) {
                  resizedImageWidth = image.naturalWidth;
                  resizedImageHeight = image.naturalHeight;
                } else {
                  if (image.naturalWidth > image.naturalHeight) {
                    resizedImageWidth = resizedImageSizeLimit;
                    resizedImageHeight = Math.round(image.naturalHeight / image.naturalWidth * resizedImageSizeLimit);
                  } else {
                    resizedImageWidth = Math.round(image.naturalWidth / image.naturalHeight * resizedImageSizeLimit);
                    resizedImageHeight = resizedImageSizeLimit;
                  }
                }

                _context2.next = 5;
                return this.cameraUploadFileProcess(image, resizedImageWidth, resizedImageHeight);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function cameraUploadImageLoad(_x) {
        return _cameraUploadImageLoad.apply(this, arguments);
      }

      return cameraUploadImageLoad;
    }()
  }, {
    key: "cameraUploadFileProcess",
    value: function () {
      var _cameraUploadFileProcess = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(image, width, height) {
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                // istanbul ignore else
                if (this.context2d != null) {
                  this.context2d.canvas.width = width;
                  this.context2d.canvas.height = height;
                  this.context2d.drawImage(image, 0, 0, width, height);
                  this.scanner.applyImageSettings({
                    width,
                    height,
                    format: ImageSettings.Format.RGBA_8U
                  });
                }

                this.setCameraUploadGuiBusyScanning(true);
                _context3.next = 4;
                return this.cameraUploadCallback();

              case 4:
                this.setCameraUploadGuiBusyScanning(false);
                this.cameraUploadInProgress = false;

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function cameraUploadFileProcess(_x2, _x3, _x4) {
        return _cameraUploadFileProcess.apply(this, arguments);
      }

      return cameraUploadFileProcess;
    }()
  }, {
    key: "cameraUploadFile",
    value: function cameraUploadFile() {
      var _this4 = this;

      var files = this.cameraUploadInputElement.files;

      if (files != null && files.length !== 0) {
        this.cameraUploadInProgress = true;
        var image = new Image();
        var fileReader = new FileReader();

        fileReader.onload = function () {
          _this4.cameraUploadInputElement.value = ""; // istanbul ignore else

          if (fileReader.result != null) {
            image.onload = _this4.cameraUploadImageLoad.bind(_this4, image);

            image.onprogress = function (event2) {
              // istanbul ignore else
              if (event2.lengthComputable) {
                var progress = Math.round(event2.loaded / event2.total * 20) * 5; // istanbul ignore else

                if (progress <= 100) {
                  _this4.updateCameraUploadProgress(progress.toString());
                }
              }
            };

            image.onerror = function () {
              _this4.cameraUploadInProgress = false;
            };

            image.src = fileReader.result;
          }
        };

        fileReader.onerror = function () {
          _this4.cameraUploadInProgress = false;
        };

        this.updateCameraUploadProgress("0");
        fileReader.readAsDataURL(files[0]);
      }
    }
  }, {
    key: "cameraSwitcherListener",
    value: function () {
      var _cameraSwitcherListener = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(event) {
        var cameraManager, cameras, currentCameraIndex, newCameraIndex;
        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(!this.cameraSwitchInProgress && this.cameraManager != null)) {
                  _context4.next = 40;
                  break;
                }

                cameraManager = this.cameraManager;
                event.preventDefault();
                _context4.prev = 3;
                _context4.next = 6;
                return CameraAccess.getCameras();

              case 6:
                cameras = _context4.sent;

                if (!(cameraManager.activeCamera == null)) {
                  _context4.next = 9;
                  break;
                }

                return _context4.abrupt("return");

              case 9:
                if (!(cameras.length <= 1)) {
                  _context4.next = 12;
                  break;
                }

                this.setCameraSwitcherVisible(false);
                return _context4.abrupt("return");

              case 12:
                this.cameraSwitchInProgress = true;
                currentCameraIndex = cameras.indexOf(cameraManager.activeCamera);
                newCameraIndex = (currentCameraIndex + 1) % cameras.length;

              case 15:
                if (!(newCameraIndex !== currentCameraIndex)) {
                  _context4.next = 33;
                  break;
                }

                _context4.prev = 16;
                _context4.next = 19;
                return cameraManager.initializeCameraWithSettings(cameras[newCameraIndex], cameraManager.activeCameraSettings);

              case 19:
                _context4.next = 30;
                break;

              case 21:
                _context4.prev = 21;
                _context4.t0 = _context4["catch"](16);
                console.warn("Couldn't access camera:", cameras[newCameraIndex], _context4.t0);
                newCameraIndex = (newCameraIndex + 1) % cameras.length;

                if (!(newCameraIndex === currentCameraIndex)) {
                  _context4.next = 29;
                  break;
                }

                this.setCameraSwitcherVisible(false);
                _context4.next = 29;
                return cameraManager.initializeCameraWithSettings(cameras[newCameraIndex], cameraManager.activeCameraSettings);

              case 29:
                return _context4.abrupt("continue", 15);

              case 30:
                return _context4.abrupt("break", 33);

              case 33:
                this.cameraSwitchInProgress = false;
                _context4.next = 40;
                break;

              case 36:
                _context4.prev = 36;
                _context4.t1 = _context4["catch"](3);
                console.error(_context4.t1);
                this.cameraSwitchInProgress = false;

              case 40:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[3, 36], [16, 21]]);
      }));

      function cameraSwitcherListener(_x5) {
        return _cameraSwitcherListener.apply(this, arguments);
      }

      return cameraSwitcherListener;
    }()
  }, {
    key: "setupCameraSwitcher",
    value: function setupCameraSwitcher() {
      var _this5 = this;

      this.cameraSwitcherElement.src = switchCameraImage;
      this.cameraSwitcherElement.className = GUI.cameraSwitcherElementClassName;
      this.cameraSwitcherElement.classList.add(GUI.hiddenClassName);
      this.parentElement.appendChild(this.cameraSwitcherElement);
      ["touchstart", "mousedown"].forEach(function (eventName) {
        _this5.cameraSwitcherElement.addEventListener(eventName, _this5.cameraSwitcherListener.bind(_this5));
      });
    }
  }, {
    key: "setupTorchToggler",
    value: function setupTorchToggler() {
      var _this6 = this;

      this.torchTogglerElement.src = toggleTorchImage;
      this.torchTogglerElement.className = GUI.torchTogglerElementClassName;
      this.torchTogglerElement.classList.add(GUI.hiddenClassName);
      this.parentElement.appendChild(this.torchTogglerElement);
      ["touchstart", "mousedown"].forEach(function (eventName) {
        _this6.torchTogglerElement.addEventListener(eventName, /*#__PURE__*/function () {
          var _ref = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(event) {
            return regenerator.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    if (!(_this6.cameraManager != null)) {
                      _context5.next = 4;
                      break;
                    }

                    event.preventDefault();
                    _context5.next = 4;
                    return _this6.cameraManager.toggleTorch();

                  case 4:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee5);
          }));

          return function (_x6) {
            return _ref.apply(this, arguments);
          };
        }());
      });
    }
  }, {
    key: "showScanditLogo",
    value: function showScanditLogo(hideLogo, licenseKeyFeatures) {
      if (hideLogo && (licenseKeyFeatures === null || licenseKeyFeatures === void 0 ? void 0 : licenseKeyFeatures.hiddenScanditLogoAllowed) === true) {
        return;
      }

      var scanditLogoImageElement = document.createElement("img");
      scanditLogoImageElement.src = scanditLogoImage;
      scanditLogoImageElement.className = GUI.scanditLogoImageElementClassName;
      this.parentElement.appendChild(scanditLogoImageElement);
    }
  }, {
    key: "activateGUI",
    value: function activateGUI() {
      this.engineContextCreated = true;

      if (!this.scanningPaused) {
        this.resumeScanning();
      }
    }
  }, {
    key: "handleNewScanSettings",
    value: function handleNewScanSettings() {
      if (this.customLaserArea == null) {
        this.setLaserArea();
      }

      if (this.customViewfinderArea == null) {
        this.setViewfinderArea();
      }
    }
  }, {
    key: "handleVideoDisplay",
    value: function handleVideoDisplay(hidden) {
      // Safari on iOS 14 behaves weirdly when hiding the video element:
      // it stops camera access after a few seconds if the related video element is not "visible".
      // We do the following to maintain the video element "visible" but actually hidden.
      var detachedVideoElement = this.videoElement.offsetParent === document.body;

      if (hidden && !detachedVideoElement) {
        this.videoElement.width = this.videoElement.height = 0;
        this.videoElement.style.opacity = "0";
        document.body.appendChild(this.videoElement);
      } else if (!hidden && detachedVideoElement) {
        this.parentElement.insertAdjacentElement("afterbegin", this.videoElement);
        this.videoElement.removeAttribute("width");
        this.videoElement.removeAttribute("height");
        this.videoElement.style.removeProperty("opacity");
        this.resize();
      }
    }
  }, {
    key: "handleVideoPause",
    value: function handleVideoPause() {
      // Safari behaves weirdly when displaying the video element again after hiding it:
      // it pauses the video on hide and resumes it on show, then reusing video frames "buffered" from the video just
      // before it was hidden. We do the following to avoid processing old data.
      this.playVideo();
    }
  }, {
    key: "handleVideoResize",
    value: function handleVideoResize() {
      this.resize();

      if (this.videoElement.videoWidth <= 2 || this.videoElement.videoHeight <= 2) {
        return;
      }

      if (this.contextWebGL != null) {
        if (this.contextWebGL.canvas.width === this.videoElement.videoWidth && this.contextWebGL.canvas.height === this.videoElement.videoHeight) {
          return;
        }

        this.contextWebGL.canvas.width = this.videoElement.videoWidth;
        this.contextWebGL.canvas.height = this.videoElement.videoHeight;
        this.contextWebGL.viewport(0, 0, this.contextWebGL.drawingBufferWidth, this.contextWebGL.drawingBufferHeight);
        this.scanner.applyImageSettings({
          width: this.contextWebGL.drawingBufferWidth,
          height: this.contextWebGL.drawingBufferHeight,
          format: ImageSettings.Format.RGBA_8U
        });
      } else if (this.context2d != null) {
        if (this.context2d.canvas.width === this.videoElement.videoWidth && this.context2d.canvas.height === this.videoElement.videoHeight) {
          return;
        }

        this.context2d.canvas.width = this.videoElement.videoWidth;
        this.context2d.canvas.height = this.videoElement.videoHeight;
        this.scanner.applyImageSettings({
          width: this.videoElement.videoWidth,
          height: this.videoElement.videoHeight,
          format: ImageSettings.Format.RGBA_8U
        });
      }
    }
  }]);

  return GUI;
}();
GUI.grandParentElementClassName = "scandit scandit-container";
GUI.parentElementClassName = "scandit scandit-barcode-picker";
GUI.hiddenClassName = "scandit-hidden";
GUI.hiddenOpacityClassName = "scandit-hidden-opacity";
GUI.videoElementClassName = "scandit-video";
GUI.scanditLogoImageElementClassName = "scandit-logo";
GUI.laserContainerElementClassName = "scandit-laser";
GUI.viewfinderElementClassName = "scandit-viewfinder";
GUI.cameraSwitcherElementClassName = "scandit-camera-switcher";
GUI.torchTogglerElementClassName = "scandit-torch-toggle";
GUI.cameraUploadElementClassName = "scandit-camera-upload";
GUI.flashColorClassName = "scandit-flash-color";
GUI.flashWhiteClassName = "scandit-flash-white";
GUI.flashInsetClassName = "scandit-flash-inset";
GUI.opacityPulseClassName = "scandit-opacity-pulse";
GUI.mirroredClassName = "mirrored";
GUI.pausedClassName = "paused";

/**
 * A barcode picker element used to get and show camera input and perform scanning operations.
 *
 * The barcode picker will automatically fit and scale inside the given *originElement*.
 *
 * Each barcode picker internally contains a [[Scanner]] object with its own WebWorker thread running a
 * separate copy of the external Scandit Engine library. To optimize loading times and performance it's
 * recommended to reuse the same picker and to already create the picker in advance (hidden) and just
 * display it when needed whenever possible.
 *
 * As the loading of the external Scandit Engine library can take some time, the picker always starts inactive
 * (but showing GUI and video) and then activates, if not paused, as soon as the library is ready to scan.
 * The [[on]] method targeting the [[ready]] event can be used to set up a listener function to be called when the
 * library is loaded. The picker will be ready to start scanning when the library is fully loaded.
 *
 * By default the external Scandit Engine library is preloaded in order to reduce the initialization time as much as
 * possible.
 *
 * The picker can also operate in Single Image Mode: letting the user click/tap to take a single image to be scanned
 * via the camera (mobile) or a file select dialog (desktop). This is provided automatically as fallback by
 * default when the OS/browser only supports part of the needed features and cannot provide direct access to the camera
 * for video streaming and continuous scanning, or can also be forced on/off. This behaviour can be set up on creation
 * via the *singleImageModeSettings* option. Note that in this mode some of the functions provided by the picker will
 * have no effect.
 *
 * By default an alert is shown if an internal error during scanning is encountered which prevents the scanning
 * procedure from continuing when running on a local IP address. As this uses the built-in [[scanError]] event
 * functionality, if unwanted it can be disabled by calling [[removeAllListeners]] on the BarcodePicker
 * instance (right after creation).
 *
 * In accordance with our license terms, the Scandit logo displayed in the bottom right corner of the barcode picker
 * must be displayed and cannot be hidden by any method. Workarounds are not allowed.
 */


var BarcodePicker = /*#__PURE__*/function () {
  function BarcodePicker(originElement, _ref) {
    var _ref2, _ref3, _navigator$vibrate, _scanner$applyScanSet;

    var visible = _ref.visible,
        singleImageModeEnabled = _ref.singleImageModeEnabled,
        singleImageModeSettings = _ref.singleImageModeSettings,
        playSoundOnScan = _ref.playSoundOnScan,
        vibrateOnScan = _ref.vibrateOnScan,
        scanningPaused = _ref.scanningPaused,
        guiStyle = _ref.guiStyle,
        videoFit = _ref.videoFit,
        laserArea = _ref.laserArea,
        viewfinderArea = _ref.viewfinderArea,
        scanner = _ref.scanner,
        scanSettings = _ref.scanSettings,
        cameraType = _ref.cameraType,
        targetScanningFPS = _ref.targetScanningFPS,
        hideLogo = _ref.hideLogo;

    classCallCheck(this, BarcodePicker);

    this.isReadyToWork = false;
    this.destroyed = false;
    this.scanningPaused = scanningPaused;
    howler_core_min.Howler.autoSuspend = false;
    this.beepSound = new howler_core_min.Howl({
      src: beepSound
    });
    this.vibrateFunction = (_ref2 = (_ref3 = (_navigator$vibrate = navigator.vibrate) !== null && _navigator$vibrate !== void 0 ? _navigator$vibrate : navigator.webkitVibrate) !== null && _ref3 !== void 0 ? _ref3 : navigator.mozVibrate) !== null && _ref2 !== void 0 ? _ref2 : navigator.msVibrate;
    this.eventEmitter = new eventemitter3.EventEmitter();
    this.setPlaySoundOnScanEnabled(playSoundOnScan);
    this.setVibrateOnScanEnabled(vibrateOnScan);
    this.setTargetScanningFPS(targetScanningFPS);
    this.scanner = (_scanner$applyScanSet = scanner === null || scanner === void 0 ? void 0 : scanner.applyScanSettings(scanSettings)) !== null && _scanner$applyScanSet !== void 0 ? _scanner$applyScanSet : new Scanner({
      scanSettings
    });
    this.scannerReadyEventListener = this.handleScannerReady.bind(this);
    this.scanner.on("ready", this.scannerReadyEventListener);
    this.gui = new GUI({
      scanner: this.scanner,
      originElement,
      singleImageModeEnabled,
      singleImageModeSettings,
      scanningPaused,
      visible,
      guiStyle,
      videoFit,
      hideLogo,
      laserArea,
      viewfinderArea,
      cameraUploadCallback: this.processVideoFrame.bind(this, true)
    });

    if (singleImageModeEnabled) {
      this.cameraManager = new DummyCameraManager(this.scanner, this.triggerFatalError.bind(this), this.gui);
      this.gui.setCameraType(cameraType);
    } else {
      this.cameraManager = new CameraManager(this.scanner, this.triggerFatalError.bind(this), this.gui);
      this.scheduleVideoProcessing();
    }

    this.gui.setCameraManager(this.cameraManager);
  }
  /**
   * Fired when the external Scandit Engine library has been loaded and the barcode picker can thus start to scan
   * barcodes.
   *
   * @asMemberOf BarcodePicker
   * @event
   */
  // tslint:disable-next-line: no-empty


  createClass(BarcodePicker, [{
    key: "destroy",
    value:
    /**
     * Stop scanning and displaying video output, remove HTML elements added to the page,
     * destroy the internal [[Scanner]] (by default) and destroy the barcode picker itself; ensuring complete cleanup.
     *
     * This method should be called after you don't plan to use the picker anymore,
     * before the object is automatically cleaned up by JavaScript.
     * The barcode picker must not be used in any way after this call.
     *
     * If the [[Scanner]] is or will be in use for other purposes, the relative option can be passed to prevent
     * its destruction.
     *
     * @param destroyScanner Whether to destroy the internally used [[Scanner]] or not.
     */
    function destroy() {
      var destroyScanner = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.pauseScanning(true);
      this.scanner.removeListener("ready", this.scannerReadyEventListener);
      this.destroyed = true;

      if (destroyScanner) {
        this.scanner.destroy();
      }

      this.gui.destroy();
      this.eventEmitter.removeAllListeners();
    }
    /**
     * Apply a new set of scan settings to the internal scanner (replacing old settings).
     *
     * @param scanSettings The scan configuration object to be applied to the scanner.
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "applyScanSettings",
    value: function applyScanSettings(scanSettings) {
      this.scanner.applyScanSettings(scanSettings);
      return this;
    }
    /**
     * @returns Whether the scanning is currently paused.
     */

  }, {
    key: "isScanningPaused",
    value: function isScanningPaused() {
      return this.scanningPaused;
    }
    /**
     * Pause the recognition of codes in the input image.
     *
     * By default video from the camera is still shown, if the *pauseCamera* option is enabled the camera stream
     * is paused (camera access is fully interrupted) and will be resumed when calling [[resumeScanning]],
     * [[setActiveCamera]], [[setCameraType]] or [[accessCamera]], possibly requesting user permissions if needed.
     *
     * In Single Image Mode the input for submitting a picture is disabled.
     *
     * @param pauseCamera Whether to also pause the camera stream.
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "pauseScanning",
    value: function pauseScanning() {
      var pauseCamera = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this.scanningPaused = true;

      if (pauseCamera) {
        this.cameraManager.stopStream();
      }

      if (this.scanner.isReady()) {
        this.gui.pauseScanning();
      }

      return this;
    }
    /**
     * Resume the recognition of codes in the input image.
     *
     * If the camera stream was stopped when calling [[pauseScanning]], the camera stream is also resumed and
     * user permissions are requested if needed to resume video input.
     *
     * In Single Image Mode the input for submitting a picture is enabled.
     *
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "resumeScanning",
    value: function () {
      var _resumeScanning = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.scanningPaused = false;

                if (this.scanner.isReady()) {
                  this.gui.resumeScanning();
                }

                if (!(this.cameraAccess && this.getActiveCamera() == null)) {
                  _context.next = 5;
                  break;
                }

                _context.next = 5;
                return this.cameraManager.setupCameras();

              case 5:
                return _context.abrupt("return", this);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function resumeScanning() {
        return _resumeScanning.apply(this, arguments);
      }

      return resumeScanning;
    }()
    /**
     * @returns The currently active camera.
     */

  }, {
    key: "getActiveCamera",
    value: function getActiveCamera() {
      return this.cameraManager.activeCamera;
    }
    /**
     * Select a camera to be used for video input, if no camera is passed, the default one (based on *cameraType*) is
     * selected.
     *
     * If camera access is enabled, the camera is enabled and accessed. If not, the camera is stored and used for the
     * future initial camera access.
     *
     * Depending on device features and user permissions for camera access, any of the following errors
     * could be the rejected result of the returned promise:
     * - `AbortError`
     * - `NoCameraAvailableError`
     * - `NotAllowedError`
     * - `NotFoundError`
     * - `NotReadableError`
     * - `SecurityError`
     *
     * In Single Image Mode this method has no effect.
     *
     * @param camera The new camera to be used, by default the automatically detected back camera is used.
     * @param cameraSettings The camera options used when accessing the camera, by default `hd` resolution is used.
     * @returns A promise resolving to the updated [[BarcodePicker]] object when the camera is set
     * (and accessed, if camera access is currently enabled).
     */

  }, {
    key: "setActiveCamera",
    value: function () {
      var _setActiveCamera = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(camera, cameraSettings) {
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(camera == null || !this.cameraAccess)) {
                  _context2.next = 8;
                  break;
                }

                this.cameraManager.setSelectedCamera(camera);
                this.cameraManager.setSelectedCameraSettings(cameraSettings);

                if (!this.cameraAccess) {
                  _context2.next = 6;
                  break;
                }

                _context2.next = 6;
                return this.cameraManager.setupCameras();

              case 6:
                _context2.next = 10;
                break;

              case 8:
                _context2.next = 10;
                return this.cameraManager.initializeCameraWithSettings(camera, cameraSettings);

              case 10:
                return _context2.abrupt("return", this);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function setActiveCamera(_x, _x2) {
        return _setActiveCamera.apply(this, arguments);
      }

      return setActiveCamera;
    }()
    /**
     * Select a camera to be used for video input by specifying the wanted camera type (facing mode/direction): the main
     * camera detected for the given camera type will be used.
     *
     * If camera access is enabled, the camera is enabled and accessed. If not, the camera type is stored and used for the
     * future initial camera access.
     *
     * If the target camera is already in use or no camera with the given type is found this method has no effect.
     *
     * Depending on device features and user permissions for camera access, any of the following errors
     * could be the rejected result of the returned promise:
     * - `AbortError`
     * - `NoCameraAvailableError`
     * - `NotAllowedError`
     * - `NotFoundError`
     * - `NotReadableError`
     * - `SecurityError`
     *
     * @param cameraType The new camera type (facing mode/direction) to be used for video input and Single Image Mode
     * (when available).
     * @returns A promise resolving to the updated [[BarcodePicker]] object when the camera is updated
     * (and accessed, if camera access is currently enabled).
     */

  }, {
    key: "setCameraType",
    value: function () {
      var _setCameraType = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(cameraType) {
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.gui.setCameraType(cameraType);

                if (!this.cameraAccess) {
                  _context3.next = 6;
                  break;
                }

                _context3.next = 4;
                return this.cameraManager.setCameraType(cameraType);

              case 4:
                _context3.next = 7;
                break;

              case 6:
                this.cameraManager.setInitialCameraType(cameraType);

              case 7:
                return _context3.abrupt("return", this);

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function setCameraType(_x3) {
        return _setCameraType.apply(this, arguments);
      }

      return setCameraType;
    }()
    /**
     * Try to apply new settings to the currently used camera for video input,
     * if no settings are passed the default ones are set.
     *
     * If camera access is enabled, the camera is updated and accessed with the new settings. If not, the camera settings
     * are stored and used for the future initial camera access.
     *
     * Depending on device features and user permissions for camera access, any of the following errors
     * could be the rejected result of the returned promise:
     * - `AbortError`
     * - `NoCameraAvailableError`
     * - `NotAllowedError`
     * - `NotFoundError`
     * - `NotReadableError`
     * - `SecurityError`
     *
     * In Single Image Mode this method has no effect.
     *
     * @param cameraSettings The new camera options used when accessing the camera, by default `hd` resolution is used.
     * @returns A promise resolving to the updated [[BarcodePicker]] object when the camera is updated
     * (and accessed, if camera access is currently enabled).
     */

  }, {
    key: "applyCameraSettings",
    value: function () {
      var _applyCameraSettings = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(cameraSettings) {
        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this.cameraAccess) {
                  _context4.next = 4;
                  break;
                }

                this.cameraManager.setSelectedCameraSettings(cameraSettings);
                _context4.next = 6;
                break;

              case 4:
                _context4.next = 6;
                return this.cameraManager.applyCameraSettings(cameraSettings);

              case 6:
                return _context4.abrupt("return", this);

              case 7:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function applyCameraSettings(_x4) {
        return _applyCameraSettings.apply(this, arguments);
      }

      return applyCameraSettings;
    }()
    /**
     * @returns Whether the picker is in a visible state or not.
     */

  }, {
    key: "isVisible",
    value: function isVisible() {
      return this.gui.isVisible();
    }
    /**
     * Enable or disable picker visibility.
     *
     * Note that this does not affect camera access, frame processing or any other picker logic.
     *
     * @param visible Whether the picker is in a visible state or not.
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "setVisible",
    value: function setVisible(visible) {
      this.gui.setVisible(visible);
      return this;
    }
    /**
     * @returns Whether the currently selected camera's video is mirrored along the vertical axis.
     */

  }, {
    key: "isMirrorImageEnabled",
    value: function isMirrorImageEnabled() {
      return this.gui.isMirrorImageEnabled();
    }
    /**
     * Enable or disable camera video mirroring along the vertical axis.
     * By default front cameras are automatically mirrored.
     * This setting is applied per camera and the method has no effect if no camera is currently selected.
     *
     * In Single Image Mode this method has no effect.
     *
     * @param enabled Whether the camera video is mirrored along the vertical axis.
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "setMirrorImageEnabled",
    value: function setMirrorImageEnabled(enabled) {
      this.gui.setMirrorImageEnabled(enabled, true);
      return this;
    }
    /**
     * @returns Whether a sound should be played on barcode recognition (iOS requires user input).
     * Note that the sound is played if there's at least a barcode not rejected via [[ScanResult.rejectCode]].
     */

  }, {
    key: "isPlaySoundOnScanEnabled",
    value: function isPlaySoundOnScanEnabled() {
      return this.playSoundOnScan;
    }
    /**
     * Enable or disable playing a sound on barcode recognition (iOS requires user input).
     *
     * The sound is played if there's at least a barcode not rejected via [[ScanResult.rejectCode]].
     *
     * @param enabled Whether a sound should be played on barcode recognition.
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "setPlaySoundOnScanEnabled",
    value: function setPlaySoundOnScanEnabled(enabled) {
      this.playSoundOnScan = enabled;
      return this;
    }
    /**
     * @returns Whether the device should vibrate on barcode recognition (only Chrome & Firefox, requires user input).
     * Note that the vibration is triggered if there's at least a barcode not rejected via [[ScanResult.rejectCode]].
     */

  }, {
    key: "isVibrateOnScanEnabled",
    value: function isVibrateOnScanEnabled() {
      return this.vibrateOnScan;
    }
    /**
     * Enable or disable vibrating the device on barcode recognition (only Chrome & Firefox, requires user input).
     *
     * The vibration is triggered if there's at least a barcode not rejected via [[ScanResult.rejectCode]].
     *
     * @param enabled Whether the device should vibrate on barcode recognition.
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "setVibrateOnScanEnabled",
    value: function setVibrateOnScanEnabled(enabled) {
      this.vibrateOnScan = enabled;
      return this;
    }
    /**
     * @returns Whether a GUI button to switch between different cameras is shown (when available).
     */

  }, {
    key: "isCameraSwitcherEnabled",
    value: function isCameraSwitcherEnabled() {
      return this.cameraManager.isCameraSwitcherEnabled();
    }
    /**
     * Show or hide a GUI button to switch between different cameras (when available).
     *
     * In Single Image Mode this method has no effect.
     *
     * @param enabled Whether to show a GUI button to switch between different cameras.
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "setCameraSwitcherEnabled",
    value: function setCameraSwitcherEnabled(enabled) {
      this.cameraManager.setCameraSwitcherEnabled(enabled).catch(
      /* istanbul ignore next */
      function () {// Ignored
      });
      return this;
    }
    /**
     * @returns Whether a GUI button to toggle device torch on/off is shown (when available, only Chrome).
     */

  }, {
    key: "isTorchToggleEnabled",
    value: function isTorchToggleEnabled() {
      return this.cameraManager.isTorchToggleEnabled();
    }
    /**
     * Show or hide a GUI button to toggle device torch on/off (when available, only Chrome).
     *
     * In Single Image Mode this method has no effect.
     *
     * @param enabled Whether to show a GUI button to toggle device torch on/off.
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "setTorchToggleEnabled",
    value: function setTorchToggleEnabled(enabled) {
      this.cameraManager.setTorchToggleEnabled(enabled);
      return this;
    }
    /**
     * @returns Whether manual camera focus when clicking/tapping on the video is enabled (when available, only Chrome).
     */

  }, {
    key: "isTapToFocusEnabled",
    value: function isTapToFocusEnabled() {
      return this.cameraManager.isTapToFocusEnabled();
    }
    /**
     * Enable or disable manual camera focus when clicking/tapping on the video (when available, only Chrome).
     *
     * In Single Image Mode this method has no effect.
     *
     * @param enabled Whether to enable manual camera focus when clicking/tapping on the video.
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "setTapToFocusEnabled",
    value: function setTapToFocusEnabled(enabled) {
      this.cameraManager.setTapToFocusEnabled(enabled);
      return this;
    }
    /**
     * @returns Whether camera zoom control via pinching gesture on the video is enabled (when available, only Chrome).
     */

  }, {
    key: "isPinchToZoomEnabled",
    value: function isPinchToZoomEnabled() {
      return this.cameraManager.isPinchToZoomEnabled();
    }
    /**
     * Enable or disable camera zoom control via pinching gesture on the video (when available, only Chrome).
     *
     * In Single Image Mode this method has no effect.
     *
     * @param enabled Whether to enable camera zoom control via pinching gesture on the video.
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "setPinchToZoomEnabled",
    value: function setPinchToZoomEnabled(enabled) {
      this.cameraManager.setPinchToZoomEnabled(enabled);
      return this;
    }
    /**
     * Enable or disable the torch/flashlight of the device (when available, only Chrome).
     * Changing active camera or camera settings will cause the torch to become disabled.
     *
     * A button on the [[BarcodePicker]] GUI to let the user toggle this functionality can also be set
     * on creation via the *enableTorchToggle* option (enabled by default, when available).
     *
     * In Single Image Mode this method has no effect.
     *
     * @param enabled Whether the torch should be enabled or disabled.
     * @returns A promise resolving to the updated [[BarcodePicker]] object when the torch is enabled/disabled.
     */

  }, {
    key: "setTorchEnabled",
    value: function () {
      var _setTorchEnabled = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(enabled) {
        return regenerator.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.cameraManager.setTorchEnabled(enabled);

              case 2:
                return _context5.abrupt("return", this);

              case 3:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function setTorchEnabled(_x5) {
        return _setTorchEnabled.apply(this, arguments);
      }

      return setTorchEnabled;
    }()
    /**
     * Set the zoom level of the device (when available, only Chrome).
     * Changing active camera or camera settings will cause the zoom to be reset.
     *
     * In Single Image Mode this method has no effect.
     *
     * @param zoomPercentage The percentage of the max zoom (between 0 and 1).
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "setZoom",
    value: function () {
      var _setZoom = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee6(zoomPercentage) {
        return regenerator.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.cameraManager.setZoom(zoomPercentage);

              case 2:
                return _context6.abrupt("return", this);

              case 3:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function setZoom(_x6) {
        return _setZoom.apply(this, arguments);
      }

      return setZoom;
    }()
    /**
     * @returns Whether the barcode picker has loaded the external Scandit Engine library and is ready to scan.
     */

  }, {
    key: "isReady",
    value: function isReady() {
      return this.isReadyToWork;
    }
  }, {
    key: "on",
    value: function on(eventName, listener) {
      var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (eventName === "ready") {
        if (this.isReadyToWork) {
          listener();
        } else {
          this.eventEmitter.once(eventName, listener, this);
        }
      } else {
        if (once === true) {
          this.eventEmitter.once(eventName, listener, this);
        } else {
          this.eventEmitter.on(eventName, listener, this);
        }
      }

      return this;
    }
    /**
     * Remove the specified listener from the given event's listener array.
     *
     * @param eventName The name of the event from which to remove the listener.
     * @param listener The listener function to be removed.
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "removeListener",
    value: function removeListener(eventName, listener) {
      this.eventEmitter.removeListener(eventName, listener);
      return this;
    }
    /**
     * Remove all listeners from the given event's listener array.
     *
     * @param eventName The name of the event from which to remove all listeners.
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "removeAllListeners",
    value: function removeAllListeners(eventName) {
      this.eventEmitter.removeAllListeners(eventName);
      return this;
    }
    /**
     * *See the [[on]] method.*
     *
     * @param eventName The name of the event to listen to.
     * @param listener The listener function.
     * @param once <div class="tsd-signature-symbol">Default =&nbsp;false</div>
     * Whether the listener should just be triggered only once and then discarded.
     * @returns The updated [[BarcodePicker]] object.
     */
    // tslint:disable-next-line:bool-param-default

  }, {
    key: "addListener",
    value: function addListener(eventName, listener, once) {
      return this.on(eventName, listener, once);
    }
    /**
     * Set the GUI style for the picker.
     *
     * In Single Image Mode this method has no effect.
     *
     * When the GUI style is set to *laser* or *viewfinder*, the GUI will flash on barcode recognition.
     * Note that the GUI will flash if there's at least a barcode not rejected via [[ScanResult.rejectCode]].
     *
     * @param guiStyle The new GUI style to be applied.
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "setGuiStyle",
    value: function setGuiStyle(guiStyle) {
      this.gui.setGuiStyle(guiStyle);
      return this;
    }
    /**
     * Set the fit type for the video element of the picker.
     *
     * If the "cover" type is selected the maximum available search area for barcode detection is (continuously) adjusted
     * automatically according to the visible area of the picker.
     *
     * In Single Image Mode this method has no effect.
     *
     * @param objectFit The new fit type to be applied.
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "setVideoFit",
    value: function setVideoFit(objectFit) {
      this.gui.setVideoFit(objectFit);
      return this;
    }
    /**
     * Access the currently set or default camera, requesting user permissions if needed.
     * This method is meant to be used after the picker has been initialized with disabled camera access
     * (*accessCamera*=false) or after [[pauseScanning]] has been called with the pause camera stream option.
     * Calling this doesn't do anything if the camera is already being accessed.
     *
     * Depending on device features and user permissions for camera access, any of the following errors
     * could be the rejected result of the returned promise:
     * - `AbortError`
     * - `NoCameraAvailableError`
     * - `NotAllowedError`
     * - `NotFoundError`
     * - `NotReadableError`
     * - `SecurityError`
     *
     * In Single Image Mode this method has no effect.
     *
     * @returns A promise resolving to the updated [[BarcodePicker]] object when the camera is accessed.
     */

  }, {
    key: "accessCamera",
    value: function () {
      var _accessCamera = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee7() {
        return regenerator.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!(!this.cameraAccess || this.getActiveCamera() == null)) {
                  _context7.next = 4;
                  break;
                }

                _context7.next = 3;
                return this.cameraManager.setupCameras();

              case 3:
                this.cameraAccess = true;

              case 4:
                return _context7.abrupt("return", this);

              case 5:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function accessCamera() {
        return _accessCamera.apply(this, arguments);
      }

      return accessCamera;
    }()
    /**
     * Create a new parser object.
     *
     * @param dataFormat The format of the input data for the parser.
     * @returns The newly created parser.
     */

  }, {
    key: "createParserForFormat",
    value: function createParserForFormat(dataFormat) {
      return this.scanner.createParserForFormat(dataFormat);
    }
    /**
     * Reassign the barcode picker to a different HTML element.
     *
     * All the barcode picker elements inside the current origin element will be moved to the new given one.
     *
     * If an invalid element is given, a `NoOriginElementError` error is thrown.
     *
     * @param originElement The HTMLElement into which all the necessary elements for the picker will be moved.
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "reassignOriginElement",
    value: function reassignOriginElement(originElement) {
      if (!BrowserHelper.isValidHTMLElement(originElement)) {
        throw new CustomError({
          name: "NoOriginElementError",
          message: "A valid origin HTML element must be given"
        });
      }

      this.gui.reassignOriginElement(originElement);
      return this;
    }
    /**
     * Set the target frames per second to be processed by the scanning engine.
     *
     * The final speed is limited by the camera framerate (usually 30 FPS) and the frame processing time of the device.
     * By setting this to lower numbers devices can save power by performing less work during scanning operations,
     * depending on device speed (faster devices can "sleep" for longer periods).
     *
     * In Single Image Mode this method has no effect.
     *
     * @param targetScanningFPS The target frames per second to be processed.
     * Must be a number bigger than 0, by default set to 30.
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "setTargetScanningFPS",
    value: function setTargetScanningFPS(targetScanningFPS) {
      if (targetScanningFPS <= 0) {
        targetScanningFPS = 30;
      }

      this.targetScanningFPS = targetScanningFPS;
      return this;
    }
    /**
     * @returns The internally used initialized (and possibly configured) [[Scanner]] object instance.
     */

  }, {
    key: "getScanner",
    value: function getScanner() {
      return this.scanner;
    }
    /**
     * Clear the internal scanner session.
     *
     * This removes all recognized barcodes from the scanner session and allows them to be scanned again in case a custom
     * *codeDuplicateFilter* option was set in the [[ScanSettings]].
     *
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "clearSession",
    value: function clearSession() {
      this.scanner.clearSession();
      return this;
    }
    /**
     * Set the area of the laser displayed when the GUI style is set to *laser* (the laser will match the width and be
     * vertically centered).
     * Note that this functionality affects UI only and doesn't change the actual *searchArea* option set via
     * [[ScanSettings]]. If no area is passed, the default automatic size behaviour is set, where the laser will match
     * the current area of the image in which barcodes are searched, controlled via the *searchArea* option in
     * [[ScanSettings]].
     *
     * @param area The new search area, by default the area will match [[ScanSettings]]'s *searchArea* option.
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "setLaserArea",
    value: function setLaserArea(area) {
      this.gui.setLaserArea(area);
      return this;
    }
    /**
     * Set the area of the viewfinder displayed when the GUI style is set to *viewfinder*.
     * Note that this functionality affects UI only and doesn't change the actual search area set via [[ScanSettings]].
     * If no area is passed, the default automatic size behaviour is set, where the viewfinder will match the current area
     * of the image in which barcodes are searched, controlled via the *searchArea* option in [[ScanSettings]].
     *
     * @param area The new search area, by default the area will match the [[ScanSettings]]'s *searchArea*.
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "setViewfinderArea",
    value: function setViewfinderArea(area) {
      this.gui.setViewfinderArea(area);
      return this;
    }
    /**
     * @hidden
     *
     * Pause the camera stream (camera access is fully interrupted).
     *
     * @returns The updated [[BarcodePicker]] object.
     */

  }, {
    key: "pauseCameraAccess",
    value: function pauseCameraAccess() {
      this.cameraAccess = false;
      this.cameraManager.stopStream();
      return this;
    }
  }, {
    key: "triggerFatalError",
    value: function triggerFatalError(error) {
      this.fatalError = error;
      console.error(error);
    }
  }, {
    key: "handleScanResult",
    value: function handleScanResult(scanResult) {
      var _this = this;

      scanResult = new ScanResult(scanResult.barcodes, this.externalImageData, scanResult.imageSettings);
      this.eventEmitter.emit("processFrame", scanResult);

      if (scanResult.barcodes.length !== 0) {
        // This will get executed only after the other existing listeners for "processFrame" and "scan" are executed
        this.eventEmitter.once("scan", function () {
          if (scanResult.barcodes.some(function (barcode) {
            return !scanResult.rejectedCodes.has(barcode);
          })) {
            _this.gui.flashGUI();

            if (_this.playSoundOnScan) {
              _this.beepSound.play();
            }

            if (_this.vibrateOnScan) {
              var _this$vibrateFunction;

              (_this$vibrateFunction = _this.vibrateFunction) === null || _this$vibrateFunction === void 0 ? void 0 : _this$vibrateFunction.call(navigator, 300);
            }
          }
        });
        this.eventEmitter.emit("scan", scanResult);
      }
    }
  }, {
    key: "scheduleVideoProcessing",
    value: function scheduleVideoProcessing() {
      var _this2 = this;

      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      window.setTimeout( /*#__PURE__*/asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee8() {
        return regenerator.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return _this2.videoProcessing();

              case 2:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      })), timeout); // Leave some breathing room for other operations
    }
  }, {
    key: "scheduleNextVideoProcessing",
    value: function () {
      var _scheduleNextVideoProcessing = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee9(processingStartTime) {
        var nextProcessingCallDelay;
        return regenerator.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (!(this.targetScanningFPS < 60)) {
                  _context9.next = 11;
                  break;
                }

                if (this.averageProcessingTime == null) {
                  this.averageProcessingTime = performance.now() - processingStartTime;
                } else {
                  this.averageProcessingTime = this.averageProcessingTime * 0.9 + (performance.now() - processingStartTime) * 0.1;
                }

                nextProcessingCallDelay = Math.max(0, 1000 / this.targetScanningFPS - this.averageProcessingTime);

                if (!(Math.round(nextProcessingCallDelay) <= 16)) {
                  _context9.next = 8;
                  break;
                }

                _context9.next = 6;
                return this.videoProcessing();

              case 6:
                _context9.next = 9;
                break;

              case 8:
                this.scheduleVideoProcessing(nextProcessingCallDelay);

              case 9:
                _context9.next = 13;
                break;

              case 11:
                _context9.next = 13;
                return this.videoProcessing();

              case 13:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function scheduleNextVideoProcessing(_x7) {
        return _scheduleNextVideoProcessing.apply(this, arguments);
      }

      return scheduleNextVideoProcessing;
    }()
  }, {
    key: "processVideoFrame",
    value: function () {
      var _processVideoFrame = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee10(highQualitySingleFrameMode) {
        var scanResult;
        return regenerator.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                this.internalImageData = this.gui.getImageData(this.internalImageData); // This could happen in unexpected situations and should be temporary
                // istanbul ignore if

                if (!(this.internalImageData == null)) {
                  _context10.next = 3;
                  break;
                }

                return _context10.abrupt("return");

              case 3:
                if (this.externalImageData == null || this.externalImageData.byteLength === 0 || this.externalImageData.byteLength !== this.internalImageData.byteLength) {
                  this.externalImageData = new Uint8Array(this.internalImageData);
                } else {
                  this.externalImageData.set(this.internalImageData);
                }

                if (this.scanningPaused) {
                  _context10.next = 21;
                  break;
                }

                if (this.eventEmitter.listenerCount("submitFrame") > 0) {
                  this.eventEmitter.emit("submitFrame", new ScanResult([], this.externalImageData, this.scanner.getImageSettings()));
                }

                _context10.prev = 6;
                _context10.next = 9;
                return this.scanner.processImage(this.internalImageData, highQualitySingleFrameMode);

              case 9:
                scanResult = _context10.sent;
                this.internalImageData = scanResult.imageData; // Paused status could have changed in the meantime

                if (!this.scanningPaused) {
                  this.handleScanResult(scanResult);
                }

                _context10.next = 21;
                break;

              case 14:
                _context10.prev = 14;
                _context10.t0 = _context10["catch"](6);
                this.internalImageData = undefined;

                if (!(_context10.t0.name === "ImageSettingsDataMismatch")) {
                  _context10.next = 19;
                  break;
                }

                return _context10.abrupt("return");

              case 19:
                this.pauseScanning();
                this.eventEmitter.emit("scanError", _context10.t0);

              case 21:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this, [[6, 14]]);
      }));

      function processVideoFrame(_x8) {
        return _processVideoFrame.apply(this, arguments);
      }

      return processVideoFrame;
    }()
  }, {
    key: "videoProcessing",
    value: function () {
      var _videoProcessing = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee11() {
        var _this$getActiveCamera;

        var processingStartTime;
        return regenerator.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                if (!this.destroyed) {
                  _context11.next = 2;
                  break;
                }

                return _context11.abrupt("return");

              case 2:
                if (!(((_this$getActiveCamera = this.getActiveCamera()) === null || _this$getActiveCamera === void 0 ? void 0 : _this$getActiveCamera.currentResolution) == null || this.fatalError != null || this.scanningPaused || !this.scanner.isReady() || this.scanner.isBusyProcessing() || this.latestVideoTimeProcessed === this.gui.getVideoCurrentTime())) {
                  _context11.next = 5;
                  break;
                }

                this.scheduleVideoProcessing();
                return _context11.abrupt("return");

              case 5:
                if (!(this.latestVideoTimeProcessed == null)) {
                  _context11.next = 8;
                  break;
                }

                _context11.next = 8;
                return this.resumeScanning();

              case 8:
                processingStartTime = performance.now();
                this.latestVideoTimeProcessed = this.gui.getVideoCurrentTime();
                _context11.next = 12;
                return this.processVideoFrame(false);

              case 12:
                _context11.next = 14;
                return this.scheduleNextVideoProcessing(processingStartTime);

              case 14:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function videoProcessing() {
        return _videoProcessing.apply(this, arguments);
      }

      return videoProcessing;
    }()
  }, {
    key: "handleScannerReady",
    value: function handleScannerReady() {
      this.isReadyToWork = true;
      this.eventEmitter.emit("ready");
    }
  }], [{
    key: "ready",
    value: function ready() {}
    /**
     * Fired when a new frame is submitted to the engine to be processed. As the frame is not processed yet, the
     * [[ScanResult.barcodes]] property will always be empty (no results yet).
     *
     * @asMemberOf BarcodePicker
     * @event
     * @param scanResult The result of the scanning operation on the image.
     */
    // @ts-ignore
    // tslint:disable-next-line: no-empty

  }, {
    key: "submitFrame",
    value: function submitFrame(scanResult) {}
    /**
     * Fired when a new frame is processed by the engine. This event is fired on every frame, independently from the
     * number of recognized barcodes (can be none). The returned barcodes are affected by [[ScanSettings]]'s
     * *codeDuplicateFilter* option.
     *
     * @asMemberOf BarcodePicker
     * @event
     * @param scanResult The result of the scanning operation on the image.
     */
    // @ts-ignore
    // tslint:disable-next-line: no-empty

  }, {
    key: "processFrame",
    value: function processFrame(scanResult) {}
    /**
     * Fired when new barcodes are recognized in the image frame. The returned barcodes are affected by [[ScanSettings]]'s
     * *codeDuplicateFilter* option.
     *
     * @asMemberOf BarcodePicker
     * @event
     * @param scanResult The result of the scanning operation on the image.
     */
    // @ts-ignore
    // tslint:disable-next-line: no-empty

  }, {
    key: "scan",
    value: function scan(scanResult) {}
    /**
     * Fired when an error occurs during scanning initialization and execution. The barcode picker will be automatically
     * paused when this happens.
     *
     * @asMemberOf BarcodePicker
     * @event
     * @param error The ScanditEngineError that was triggered.
     */
    // @ts-ignore
    // tslint:disable-next-line: no-empty

  }, {
    key: "scanError",
    value: function scanError(error) {}
    /**
     * Create a [[BarcodePicker]] instance, creating the needed HTML in the given origin element.
     * If the *accessCamera* option is enabled (active by default) and the picker is not in Single Image Mode,
     * the available cameras are accessed and camera access permission is requested to the user if needed.
     * This object expects that at least a camera is available. The active camera is accessed and kept active during the
     * lifetime of the picker (also when hidden or scanning is paused), and is only released when [[destroy]] is called.
     *
     * It is required to having configured the library via [[configure]] before this object can be created.
     *
     * Depending on library configuration, parameters, device/browser features and user permissions for camera access, any
     * of the following errors could be the rejected result of the returned promise:
     * - `AbortError`
     * - `LibraryNotConfiguredError`
     * - `NoCameraAvailableError`
     * - `NoOriginElementError`
     * - `NotAllowedError`
     * - `NotFoundError`
     * - `NotReadableError`
     * - `SecurityError`
     * - `UnsupportedBrowserError`
     *
     * @param originElement The HTMLElement inside which all the necessary elements for the picker will be added.
     * @param visible <div class="tsd-signature-symbol">Default =&nbsp;true</div>
     * Whether the picker starts in a visible state.
     * @param singleImageModeSettings <div class="tsd-signature-symbol">Default =&nbsp;</div>
     * <pre><code>{
     *   desktop: {
     *     usageStrategy: SingleImageModeSettings.UsageStrategy.FALLBACK,
     *     informationElement: &lt;HTMLElement&gt;,
     *     buttonElement: &lt;SVGElement&gt;,
     *     containerStyle: { backgroundColor: "#333333" },
     *     informationStyle: { color: "#FFFFFF" },
     *     buttonStyle: { borderColor: "#FFFFFF", color: "#FFFFFF", fill: "#FFFFFF" }
     *   },
     *   mobile: {
     *     usageStrategy: SingleImageModeSettings.UsageStrategy.FALLBACK,
     *     informationElement: &lt;HTMLElement&gt;,
     *     buttonElement: &lt;SVGElement&gt;,
     *     containerStyle: { backgroundColor: "#333333" },
     *     informationStyle: { color: "#FFFFFF" },
     *     buttonStyle: { borderColor: "#FFFFFF", color: "#FFFFFF", fill: "#FFFFFF" }
     *   }
     * }</code></pre>
     * Settings for Single Image Mode: an alternative/fallback mode for a barcode picker to provide single camera
     * pictures to be scanned instead of continuous camera video stream access. In Single Image Mode users click/tap to
     * directly take a picture with the camera (mobile) or upload a file (desktop). Its usage depends on the given
     * settings and the camera video stream features provided by the OS/browser.
     * @param playSoundOnScan <div class="tsd-signature-symbol">Default =&nbsp;false</div>
     * Whether a sound is played on barcode recognition (iOS requires user input).
     * @param vibrateOnScan <div class="tsd-signature-symbol">Default =&nbsp;false</div>
     * Whether the device vibrates on barcode recognition (only Chrome & Firefox, requires user input).
     * @param scanningPaused <div class="tsd-signature-symbol">Default =&nbsp;false</div>
     * Whether the picker starts in a paused scanning state.
     * @param guiStyle <div class="tsd-signature-symbol">Default =&nbsp;GuiStyle.LASER</div>
     * The GUI style for the picker.
     * @param videoFit <div class="tsd-signature-symbol">Default =&nbsp;ObjectFit.CONTAIN</div>
     * The fit type for the video element of the picker.
     * @param laserArea <div class="tsd-signature-symbol">Default =&nbsp;undefined</div>
     * The area of the laser displayed when the GUI style is set to <em>laser</em> (the laser will match the width and be
     * vertically centered), by default the area will match the current [[ScanSettings]]'s <em>searchArea</em> option.
     * @param viewfinderArea <div class="tsd-signature-symbol">Default =&nbsp;undefined</div>
     * The area of the viewfinder displayed when the GUI style is set to <em>viewfinder</em>, by default the area will
     * match the current [[ScanSettings]]'s <em>searchArea</em> option.
     * @param enableCameraSwitcher <div class="tsd-signature-symbol">Default =&nbsp;true</div>
     * Whether to show a GUI button to switch between different cameras (when available).
     * @param enableTorchToggle <div class="tsd-signature-symbol">Default =&nbsp;true</div>
     * Whether to show a GUI button to toggle device torch on/off (when available, only Chrome).
     * @param enableTapToFocus <div class="tsd-signature-symbol">Default =&nbsp;true</div>
     * Whether to trigger a manual focus of the camera when clicking/tapping on the video (when available, only Chrome).
     * @param enablePinchToZoom <div class="tsd-signature-symbol">Default =&nbsp;true</div>
     * Whether to control the zoom of the camera when doing a pinching gesture on the video (when available, only Chrome).
     * @param accessCamera <div class="tsd-signature-symbol">Default =&nbsp;true</div>
     * Whether to immediately access the camera (and requesting user permissions if needed) on picker creation.
     * @param camera <div class="tsd-signature-symbol">Default =&nbsp;undefined</div>
     * The initial camera to be used for video input, if not specified the camera automatically selected depending on
     * the <em>cameraType</em> option will be used.
     * @param cameraType <div class="tsd-signature-symbol">Default =&nbsp;Camera.Type.BACK</div>
     * The preferred initial camera type (facing mode/direction) to be used for video input and Single Image Mode
     * (when available), by default the back or only camera will be used. If the <em>camera</em> option is provided then
     * <em>cameraType</em> is ignored.
     * @param cameraSettings <div class="tsd-signature-symbol">Default =&nbsp;undefined</div>
     * The camera options used when accessing the camera, by default <code>hd</code> resolution is used.
     * @param scanner <div class="tsd-signature-symbol">Default =&nbsp;undefined</div>
     * The scanner object responsible for scanning via the external Scandit Engine library
     * (a new scanner will be created and initialized if not provided).
     * @param scanSettings <div class="tsd-signature-symbol">Default =&nbsp;new ScanSettings()</div>
     * The configuration object for scanning options to be applied to the scanner (all symbologies disabled by default).
     * @param targetScanningFPS <div class="tsd-signature-symbol">Default =&nbsp;30</div>
     * The target frames per second to be processed, the final speed is limited by the camera framerate (usually 30 FPS)
     * and the frame processing time of the device. By setting this to lower numbers devices can save power by performing
     * less work during scanning operations, depending on device speed (faster devices can "sleep" for longer periods).
     * Must be a number bigger than 0.
     * @returns A promise resolving to the created ready [[BarcodePicker]] object.
     */

  }, {
    key: "create",
    value: function () {
      var _create = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee12(originElement) {
        var _ref6;

        var _ref5,
            _ref5$visible,
            visible,
            _ref5$singleImageMode,
            singleImageModeSettings,
            _ref5$playSoundOnScan,
            playSoundOnScan,
            _ref5$vibrateOnScan,
            vibrateOnScan,
            _ref5$scanningPaused,
            scanningPaused,
            _ref5$guiStyle,
            guiStyle,
            _ref5$videoFit,
            videoFit,
            laserArea,
            viewfinderArea,
            scanner,
            _ref5$scanSettings,
            scanSettings,
            _ref5$enableCameraSwi,
            enableCameraSwitcher,
            _ref5$enableTorchTogg,
            enableTorchToggle,
            _ref5$enableTapToFocu,
            enableTapToFocus,
            _ref5$enablePinchToZo,
            enablePinchToZoom,
            _ref5$accessCamera,
            accessCamera,
            camera,
            _ref5$cameraType,
            cameraType,
            cameraSettings,
            _ref5$targetScanningF,
            targetScanningFPS,
            _ref5$hideLogo,
            hideLogo,
            deviceType,
            isMobileDevice,
            singleImageModePlatformSettings,
            singleImageModeDisallowed,
            singleImageModeForced,
            browserCompatibility,
            barcodePicker,
            _args12 = arguments;

        return regenerator.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _ref5 = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : {}, _ref5$visible = _ref5.visible, visible = _ref5$visible === void 0 ? true : _ref5$visible, _ref5$singleImageMode = _ref5.singleImageModeSettings, singleImageModeSettings = _ref5$singleImageMode === void 0 ? {} : _ref5$singleImageMode, _ref5$playSoundOnScan = _ref5.playSoundOnScan, playSoundOnScan = _ref5$playSoundOnScan === void 0 ? false : _ref5$playSoundOnScan, _ref5$vibrateOnScan = _ref5.vibrateOnScan, vibrateOnScan = _ref5$vibrateOnScan === void 0 ? false : _ref5$vibrateOnScan, _ref5$scanningPaused = _ref5.scanningPaused, scanningPaused = _ref5$scanningPaused === void 0 ? false : _ref5$scanningPaused, _ref5$guiStyle = _ref5.guiStyle, guiStyle = _ref5$guiStyle === void 0 ? BarcodePicker.GuiStyle.LASER : _ref5$guiStyle, _ref5$videoFit = _ref5.videoFit, videoFit = _ref5$videoFit === void 0 ? BarcodePicker.ObjectFit.CONTAIN : _ref5$videoFit, laserArea = _ref5.laserArea, viewfinderArea = _ref5.viewfinderArea, scanner = _ref5.scanner, _ref5$scanSettings = _ref5.scanSettings, scanSettings = _ref5$scanSettings === void 0 ? new ScanSettings() : _ref5$scanSettings, _ref5$enableCameraSwi = _ref5.enableCameraSwitcher, enableCameraSwitcher = _ref5$enableCameraSwi === void 0 ? true : _ref5$enableCameraSwi, _ref5$enableTorchTogg = _ref5.enableTorchToggle, enableTorchToggle = _ref5$enableTorchTogg === void 0 ? true : _ref5$enableTorchTogg, _ref5$enableTapToFocu = _ref5.enableTapToFocus, enableTapToFocus = _ref5$enableTapToFocu === void 0 ? true : _ref5$enableTapToFocu, _ref5$enablePinchToZo = _ref5.enablePinchToZoom, enablePinchToZoom = _ref5$enablePinchToZo === void 0 ? true : _ref5$enablePinchToZo, _ref5$accessCamera = _ref5.accessCamera, accessCamera = _ref5$accessCamera === void 0 ? true : _ref5$accessCamera, camera = _ref5.camera, _ref5$cameraType = _ref5.cameraType, cameraType = _ref5$cameraType === void 0 ? Camera.Type.BACK : _ref5$cameraType, cameraSettings = _ref5.cameraSettings, _ref5$targetScanningF = _ref5.targetScanningFPS, targetScanningFPS = _ref5$targetScanningF === void 0 ? 30 : _ref5$targetScanningF, _ref5$hideLogo = _ref5.hideLogo, hideLogo = _ref5$hideLogo === void 0 ? false : _ref5$hideLogo;
                deviceType = BrowserHelper.userAgentInfo.getDevice().type;
                isMobileDevice = deviceType === "mobile" || deviceType === "tablet";
                singleImageModePlatformSettings = (_ref6 = isMobileDevice ? singleImageModeSettings.mobile : singleImageModeSettings.desktop) !== null && _ref6 !== void 0 ? _ref6 : {};
                singleImageModeDisallowed = singleImageModePlatformSettings.usageStrategy === SingleImageModeSettings.UsageStrategy.NEVER;
                singleImageModeForced = singleImageModePlatformSettings.usageStrategy === SingleImageModeSettings.UsageStrategy.ALWAYS;
                browserCompatibility = BrowserHelper.checkBrowserCompatibility();

                if (!(!browserCompatibility.scannerSupport || singleImageModeDisallowed && !browserCompatibility.fullSupport)) {
                  _context12.next = 9;
                  break;
                }

                throw new UnsupportedBrowserError(browserCompatibility);

              case 9:
                if (!browserCompatibility.fullSupport && !singleImageModeForced) {
                  console.log("BarcodePicker's Single Image Mode is being used as fallback as the OS/browser combination doesn't " + "support camera video stream scanning (https://caniuse.com/#feat=stream). " + 'You can configure this behaviour via the "singleImageModeSettings" option.', browserCompatibility);
                }

                if (!(configurePhase !== "done")) {
                  _context12.next = 12;
                  break;
                }

                throw new CustomError({
                  name: "LibraryNotConfiguredError",
                  message: configurePhase === "started" ? "The library has not completed its configuration yet, please call 'configure' and wait for the returned\n              promise's resolution" : "The library was not configured, 'configure' must be called with valid parameters before instantiating\n              the BarcodePicker"
                });

              case 12:
                if (BrowserHelper.isValidHTMLElement(originElement)) {
                  _context12.next = 14;
                  break;
                }

                throw new CustomError({
                  name: "NoOriginElementError",
                  message: "A valid origin HTML element must be given"
                });

              case 14:
                barcodePicker = new BarcodePicker(originElement, {
                  visible,
                  singleImageModeEnabled: browserCompatibility.fullSupport ? singleImageModeForced : true,
                  singleImageModeSettings: singleImageModePlatformSettings,
                  playSoundOnScan,
                  vibrateOnScan,
                  scanningPaused,
                  guiStyle,
                  videoFit,
                  laserArea,
                  viewfinderArea,
                  scanner,
                  scanSettings,
                  cameraType,
                  targetScanningFPS,
                  hideLogo
                });
                barcodePicker.cameraManager.setInteractionOptions(enableCameraSwitcher, enableTorchToggle, enableTapToFocus, enablePinchToZoom);
                barcodePicker.cameraManager.setInitialCameraType(cameraType);
                barcodePicker.cameraManager.setSelectedCamera(camera);
                barcodePicker.cameraManager.setSelectedCameraSettings(cameraSettings);
                barcodePicker.cameraAccess = accessCamera; // Show error in alert on ScanError by default when running on local IP address for easier customer debugging

                barcodePicker.on("scanError", function (error) {
                  // istanbul ignore if
                  if (["localhost", "127.0.0.1", ""].includes(window.location.hostname)) {
                    alert(error);
                  }
                });

                if (!accessCamera) {
                  _context12.next = 24;
                  break;
                }

                _context12.next = 24;
                return barcodePicker.cameraManager.setupCameras();

              case 24:
                return _context12.abrupt("return", barcodePicker);

              case 25:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12);
      }));

      function create(_x9) {
        return _create.apply(this, arguments);
      }

      return create;
    }()
  }]);

  return BarcodePicker;
}(); // istanbul ignore next

(function (BarcodePicker) {

  (function (GuiStyle) {
    /**
     * No GUI is shown to indicate where the barcode should be placed.
     * Be aware that the Scandit logo continues to be displayed as showing it is part of the license agreement.
     */
    GuiStyle["NONE"] = "none";
    /**
     * A laser line is shown.
     */

    GuiStyle["LASER"] = "laser";
    /**
     * A rectangular viewfinder with rounded corners is shown.
     */

    GuiStyle["VIEWFINDER"] = "viewfinder";
  })(BarcodePicker.GuiStyle || (BarcodePicker.GuiStyle = {}));

  (function (ObjectFit) {
    /**
     * Scale to maintain aspect ratio while fitting within the *originElement*'s content box.
     * Aspect ratio is preserved, so the barcode picker will be "letterboxed" if its aspect ratio
     * does not match the aspect ratio of the box.
     */
    ObjectFit["CONTAIN"] = "contain";
    /**
     * Scale to maintain aspect ratio while filling the *originElement*'s entire content box.
     * Aspect ratio is preserved, so the barcode picker will be clipped to fit if its aspect ratio
     * does not match the aspect ratio of the box.
     */

    ObjectFit["COVER"] = "cover";
  })(BarcodePicker.ObjectFit || (BarcodePicker.ObjectFit = {}));
})(BarcodePicker || (BarcodePicker = {}));

// 26.1.6 Reflect.get(target, propertyKey [, receiver])







function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var desc, proto;
  if (_anObject(target) === receiver) return target[propertyKey];
  if (desc = _objectGopd.f(target, propertyKey)) return _has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if (_isObject(proto = _objectGpo(target))) return get(proto, propertyKey, receiver);
}

_export(_export.S, 'Reflect', { get: get });

var get$1 = _core.Reflect.get;

var get$2 = get$1;

// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)



var rApply = (_global.Reflect || {}).apply;
var fApply = Function.apply;
// MS Edge argumentsList argument is optional
_export(_export.S + _export.F * !_fails(function () {
  rApply(function () { /* empty */ });
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList) {
    var T = _aFunction(target);
    var L = _anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});

var apply = _core.Reflect.apply;

var apply$1 = apply;

// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])









function set$2(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDesc = _objectGopd.f(_anObject(target), propertyKey);
  var existingDescriptor, proto;
  if (!ownDesc) {
    if (_isObject(proto = _objectGpo(target))) {
      return set$2(proto, propertyKey, V, receiver);
    }
    ownDesc = _propertyDesc(0);
  }
  if (_has(ownDesc, 'value')) {
    if (ownDesc.writable === false || !_isObject(receiver)) return false;
    if (existingDescriptor = _objectGopd.f(receiver, propertyKey)) {
      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
      existingDescriptor.value = V;
      _objectDp.f(receiver, propertyKey, existingDescriptor);
    } else _objectDp.f(receiver, propertyKey, _propertyDesc(0, V));
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

_export(_export.S, 'Reflect', { set: set$2 });

var set$3 = _core.Reflect.set;

var set$4 = set$3;

// See https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-exhaustiveness-checking
function assertUnreachable(x) {
  throw new Error("Unexpected object: ".concat(x));
}

function convertAttribute(schema, value) {
  switch (schema.type) {
    case "boolean":
      return convertToBoolean(value, schema.default);

    case "string":
    case "guiStyle":
    case "cameraType":
    case "videoFit":
    case "codeDirection":
      return convertToString(value, schema.default);

    case "array":
      return convertToArray(value, schema.default);

    case "integer":
      return convertToInteger(value, schema.default);

    case "singleImageModeSettings":
    case "searchArea":
    case "camera":
    case "cameraSettings":
      return convertJsonToObject(value, schema.default);
  } // Trick to make sure all cases are covered:


  return assertUnreachable(schema);
}

function convertToString(input, defaultValue) {
  return input == null ? defaultValue : input;
}

function convertToBoolean(input, defaultValue) {
  if (input == null) {
    return defaultValue;
  }

  return input !== "false";
}

function convertToInteger(input, defaultValue) {
  if (input == null) {
    return defaultValue;
  }

  var parsed = _parseInt$2(input, 10);

  if (isNaN(parsed)) {
    return defaultValue;
  }

  return parsed;
}

function convertToArray(input, defaultValue) {
  if (input == null) {
    return defaultValue;
  }

  var json = toJson(input);

  if (json == null || !isArray$1(json)) {
    return defaultValue;
  }

  return json;
}

function convertJsonToObject(input, defaultValue) {
  if (input == null) {
    return defaultValue;
  }

  var json = toJson(input);

  if (json == null) {
    return defaultValue;
  } // must be an object


  if (isArray$1(json) || typeof json === "number") {
    return defaultValue;
  }

  return json;
}

function toJson(input) {
  try {
    return JSON.parse(input);
  } catch (e) {
    return null;
  }
}

// 19.1.2.5 Object.freeze(O)

var meta = _meta.onFreeze;

_objectSap('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && _isObject(it) ? $freeze(meta(it)) : it;
  };
});

var freeze = _core.Object.freeze;

var freeze$1 = freeze;

var Attribute;

(function (Attribute) {
  Attribute["ACCESS_CAMERA"] = "accessCamera";
  Attribute["CAMERA"] = "camera";
  Attribute["CAMERA_SETTINGS"] = "cameraSettings";
  Attribute["CAMERA_TYPE"] = "cameraType";
  Attribute["CONFIGURE"] = "configure";
  Attribute["ENABLE_CAMERA_SWITCHER"] = "enableCameraSwitcher";
  Attribute["ENABLE_PINCH_TO_ZOOM"] = "enablePinchToZoom";
  Attribute["ENABLE_TAP_TO_FOCUS"] = "enableTapToFocus";
  Attribute["ENABLE_TORCH_TOGGLE"] = "enableTorchToggle";
  Attribute["GUI_STYLE"] = "guiStyle";
  Attribute["LASER_AREA"] = "laserArea";
  Attribute["PLAY_SOUND_ON_SCAN"] = "playSoundOnScan";
  Attribute["SCANNING_PAUSED"] = "scanningPaused";
  Attribute["SINGLE_IMAGE_MODE_SETTINGS"] = "singleImageModeSettings";
  Attribute["TARGET_SCANNING_FPS"] = "targetScanningFPS";
  Attribute["VIBRATE_ON_SCAN"] = "vibrateOnScan";
  Attribute["VIDEO_FIT"] = "videoFit";
  Attribute["VIEWFINDER_AREA"] = "viewfinderArea";
  Attribute["VISIBLE"] = "visible";
  Attribute["CONFIGURE_ENGINE_LOCATION"] = "configure.engineLocation";
  Attribute["CONFIGURE_LICENSE_KEY"] = "configure.licenseKey";
  Attribute["CONFIGURE_PRELOAD_ENGINE"] = "configure.preloadEngine";
  Attribute["CONFIGURE_PRELOAD_BLURRY_RECOGNITION"] = "configure.preloadBlurryRecognition";
  Attribute["SCAN_SETTINGS_BLURRY_RECOGNITION"] = "scanSettings.blurryRecognition";
  Attribute["SCAN_SETTINGS_CODE_DIRECTION_HINT"] = "scanSettings.codeDirectionHint";
  Attribute["SCAN_SETTINGS_CODE_DUPLICATE_FILTER"] = "scanSettings.codeDuplicateFilter";
  Attribute["SCAN_SETTINGS_ENABLED_SYMBOLOGIES"] = "scanSettings.enabledSymbologies";
  Attribute["SCAN_SETTINGS_GPU_ACCELERATION"] = "scanSettings.gpuAcceleration";
  Attribute["SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME"] = "scanSettings.maxNumberOfCodesPerFrame";
  Attribute["SCAN_SETTINGS_SEARCH_AREA"] = "scanSettings.searchArea";
})(Attribute || (Attribute = {}));

var attributes = values$1(Attribute);
var schema; // tslint:disable-next-line: max-func-body-length

function getSchema() {
  if (schema != null) {
    return schema;
  }

  return schema = freeze$1({
    // tslint:disable-next-line: no-unnecessary-class
    [Attribute.ACCESS_CAMERA]: {
      type: "boolean",
      default: true
    },
    [Attribute.CAMERA]: {
      type: "camera",
      default: undefined
    },
    [Attribute.CAMERA_SETTINGS]: {
      type: "cameraSettings",
      default: undefined
    },
    [Attribute.CAMERA_TYPE]: {
      type: "cameraType",
      default: Camera.Type.BACK
    },
    [Attribute.CONFIGURE]: {
      type: "boolean",
      default: true
    },
    [Attribute.ENABLE_CAMERA_SWITCHER]: {
      type: "boolean",
      default: true
    },
    [Attribute.ENABLE_PINCH_TO_ZOOM]: {
      type: "boolean",
      default: true
    },
    [Attribute.ENABLE_TAP_TO_FOCUS]: {
      type: "boolean",
      default: true
    },
    [Attribute.ENABLE_TORCH_TOGGLE]: {
      type: "boolean",
      default: true
    },
    [Attribute.GUI_STYLE]: {
      type: "guiStyle",
      default: BarcodePicker.GuiStyle.LASER
    },
    [Attribute.LASER_AREA]: {
      type: "searchArea",
      default: undefined
    },
    [Attribute.PLAY_SOUND_ON_SCAN]: {
      type: "boolean",
      default: true
    },
    [Attribute.SCANNING_PAUSED]: {
      type: "boolean",
      default: false
    },
    [Attribute.SINGLE_IMAGE_MODE_SETTINGS]: {
      type: "singleImageModeSettings",
      default: undefined
    },
    [Attribute.TARGET_SCANNING_FPS]: {
      type: "integer",
      default: 30
    },
    [Attribute.VIBRATE_ON_SCAN]: {
      type: "boolean",
      default: false
    },
    [Attribute.VIDEO_FIT]: {
      type: "videoFit",
      default: BarcodePicker.ObjectFit.CONTAIN
    },
    [Attribute.VIEWFINDER_AREA]: {
      type: "searchArea",
      default: undefined
    },
    [Attribute.VISIBLE]: {
      type: "boolean",
      default: true
    },
    [Attribute.CONFIGURE_ENGINE_LOCATION]: {
      type: "string",
      default: "/"
    },
    [Attribute.CONFIGURE_LICENSE_KEY]: {
      type: "string",
      default: ""
    },
    [Attribute.CONFIGURE_PRELOAD_ENGINE]: {
      type: "boolean",
      default: true
    },
    [Attribute.CONFIGURE_PRELOAD_BLURRY_RECOGNITION]: {
      type: "boolean",
      default: true
    },
    [Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION]: {
      type: "boolean",
      default: true
    },
    [Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT]: {
      type: "codeDirection",
      default: ScanSettings.CodeDirection.LEFT_TO_RIGHT
    },
    [Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER]: {
      type: "integer",
      default: 0
    },
    [Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES]: {
      type: "array",
      default: []
    },
    [Attribute.SCAN_SETTINGS_GPU_ACCELERATION]: {
      type: "boolean",
      default: true
    },
    [Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME]: {
      type: "integer",
      default: 1
    },
    [Attribute.SCAN_SETTINGS_SEARCH_AREA]: {
      type: "searchArea",
      default: undefined
    }
  });
}

var LazyAttributeConverter = /*#__PURE__*/function () {
  function LazyAttributeConverter(schema, view) {
    classCallCheck(this, LazyAttributeConverter);

    this.schema = schema;
    this.view = view;
  }

  createClass(LazyAttributeConverter, [{
    key: Attribute.ACCESS_CAMERA,
    get: function get() {
      return this.convertToPrimary(Attribute.ACCESS_CAMERA);
    }
  }, {
    key: Attribute.CAMERA,
    get: function get() {
      return this.convertToPrimary(Attribute.CAMERA);
    }
  }, {
    key: Attribute.CAMERA_SETTINGS,
    get: function get() {
      return this.convertToPrimary(Attribute.CAMERA_SETTINGS);
    }
  }, {
    key: Attribute.CAMERA_TYPE,
    get: function get() {
      return this.convertToPrimary(Attribute.CAMERA_TYPE);
    }
  }, {
    key: Attribute.CONFIGURE,
    get: function get() {
      return this.convertToPrimary(Attribute.CONFIGURE);
    }
  }, {
    key: Attribute.ENABLE_CAMERA_SWITCHER,
    get: function get() {
      return this.convertToPrimary(Attribute.ENABLE_CAMERA_SWITCHER);
    }
  }, {
    key: Attribute.ENABLE_PINCH_TO_ZOOM,
    get: function get() {
      return this.convertToPrimary(Attribute.ENABLE_PINCH_TO_ZOOM);
    }
  }, {
    key: Attribute.ENABLE_TAP_TO_FOCUS,
    get: function get() {
      return this.convertToPrimary(Attribute.ENABLE_TAP_TO_FOCUS);
    }
  }, {
    key: Attribute.ENABLE_TORCH_TOGGLE,
    get: function get() {
      return this.convertToPrimary(Attribute.ENABLE_TORCH_TOGGLE);
    }
  }, {
    key: Attribute.GUI_STYLE,
    get: function get() {
      return this.convertToPrimary(Attribute.GUI_STYLE);
    }
  }, {
    key: Attribute.LASER_AREA,
    get: function get() {
      return this.convertToPrimary(Attribute.LASER_AREA);
    }
  }, {
    key: Attribute.PLAY_SOUND_ON_SCAN,
    get: function get() {
      return this.convertToPrimary(Attribute.PLAY_SOUND_ON_SCAN);
    }
  }, {
    key: Attribute.SCANNING_PAUSED,
    get: function get() {
      return this.convertToPrimary(Attribute.SCANNING_PAUSED);
    }
  }, {
    key: Attribute.SINGLE_IMAGE_MODE_SETTINGS,
    get: function get() {
      return this.convertToPrimary(Attribute.SINGLE_IMAGE_MODE_SETTINGS);
    }
  }, {
    key: Attribute.TARGET_SCANNING_FPS,
    get: function get() {
      return this.convertToPrimary(Attribute.TARGET_SCANNING_FPS);
    }
  }, {
    key: Attribute.VIBRATE_ON_SCAN,
    get: function get() {
      return this.convertToPrimary(Attribute.VIBRATE_ON_SCAN);
    }
  }, {
    key: Attribute.VIDEO_FIT,
    get: function get() {
      return this.convertToPrimary(Attribute.VIDEO_FIT);
    }
  }, {
    key: Attribute.VIEWFINDER_AREA,
    get: function get() {
      return this.convertToPrimary(Attribute.VIEWFINDER_AREA);
    }
  }, {
    key: Attribute.VISIBLE,
    get: function get() {
      return this.convertToPrimary(Attribute.VISIBLE);
    }
  }, {
    key: Attribute.CONFIGURE_ENGINE_LOCATION,
    get: function get() {
      return this.convertToPrimary(Attribute.CONFIGURE_ENGINE_LOCATION);
    }
  }, {
    key: Attribute.CONFIGURE_LICENSE_KEY,
    get: function get() {
      return this.convertToPrimary(Attribute.CONFIGURE_LICENSE_KEY);
    }
  }, {
    key: Attribute.CONFIGURE_PRELOAD_ENGINE,
    get: function get() {
      return this.convertToPrimary(Attribute.CONFIGURE_PRELOAD_ENGINE);
    }
  }, {
    key: Attribute.CONFIGURE_PRELOAD_BLURRY_RECOGNITION,
    get: function get() {
      return this.convertToPrimary(Attribute.CONFIGURE_PRELOAD_BLURRY_RECOGNITION);
    }
  }, {
    key: Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION,
    get: function get() {
      return this.convertToPrimary(Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION);
    }
  }, {
    key: Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT,
    get: function get() {
      return this.convertToPrimary(Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT);
    }
  }, {
    key: Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER,
    get: function get() {
      return this.convertToPrimary(Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER);
    }
  }, {
    key: Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES,
    get: function get() {
      return this.convertToPrimary(Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES);
    }
  }, {
    key: Attribute.SCAN_SETTINGS_GPU_ACCELERATION,
    get: function get() {
      return this.convertToPrimary(Attribute.SCAN_SETTINGS_GPU_ACCELERATION);
    }
  }, {
    key: Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME,
    get: function get() {
      return this.convertToPrimary(Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME);
    }
  }, {
    key: Attribute.SCAN_SETTINGS_SEARCH_AREA,
    get: function get() {
      return this.convertToPrimary(Attribute.SCAN_SETTINGS_SEARCH_AREA);
    }
  }, {
    key: "convertToPrimary",
    value: function convertToPrimary(attribute) {
      return convertAttribute(this.schema[attribute], this.view.getAttribute(attribute));
    }
  }]);

  return LazyAttributeConverter;
}();

/**
 * Convert the given value to a string aimed to be used as an attribute value
 *
 * @param schema description of the attribute
 * @param value the value in its primary form
 * @returns the converted value as a string
 */
// tslint:disable-next-line: no-any

function convertProperty(schema, value) {
  switch (schema.type) {
    case "boolean":
      return value ? "true" : "false";

    case "guiStyle":
    case "integer":
    case "string":
    case "videoFit":
    case "codeDirection":
      return value.toString();

    case "array":
    case "camera":
    case "cameraSettings":
    case "searchArea":
    case "singleImageModeSettings":
      return stringify$1(value);

    case "cameraType":
      return value.cameraType.toString();
  } // Trick to make sure all cases are covered:


  return assertUnreachable(schema);
}

// 20.1.2.3 Number.isInteger(number)

var floor$1 = Math.floor;
var _isInteger = function isInteger(it) {
  return !_isObject(it) && isFinite(it) && floor$1(it) === it;
};

// 20.1.2.3 Number.isInteger(number)


_export(_export.S, 'Number', { isInteger: _isInteger });

var isInteger = _core.Number.isInteger;

var isInteger$1 = isInteger;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

var Validator = /*#__PURE__*/function () {
  function Validator() {
    classCallCheck(this, Validator);
  }

  createClass(Validator, null, [{
    key: "isBooleanAttribute",
    value: function isBooleanAttribute(value) {
      return value === "true" || value === "false";
    }
  }, {
    key: "isBooleanProperty",
    value: function isBooleanProperty(value) {
      return typeof value === "boolean";
    }
  }, {
    key: "isIntegerAttribute",
    value: function isIntegerAttribute(value) {
      return typeof value === "string" && /^-?\d+$/.test(value);
    }
  }, {
    key: "isIntegerProperty",
    value: function isIntegerProperty(value) {
      return isInteger$1(value);
    }
  }, {
    key: "isValidCameraType",
    value: function isValidCameraType(value) {
      return values$1(Camera.Type).includes(value);
    }
  }, {
    key: "isValidGuiStyle",
    value: function isValidGuiStyle(value) {
      return values$1(BarcodePicker.GuiStyle).includes(value);
    }
  }, {
    key: "isValidVideoFit",
    value: function isValidVideoFit(value) {
      return values$1(BarcodePicker.ObjectFit).includes(value);
    }
  }, {
    key: "isValidCodeDirection",
    value: function isValidCodeDirection(value) {
      return values$1(ScanSettings.CodeDirection).includes(value);
    }
  }, {
    key: "isArray",
    value: function isArray(value) {
      return isArray$1(value);
    }
  }, {
    key: "isValidJsonArray",
    value: function isValidJsonArray(value) {
      var json;

      try {
        json = JSON.parse(value);
      } catch (e) {
        return false;
      }

      return isArray$1(json);
    }
  }, {
    key: "isValidSearchAreaAttribute",
    value: function isValidSearchAreaAttribute(value) {
      var areaObject;

      try {
        areaObject = JSON.parse(value);
      } catch (e) {
        return false;
      }

      return Validator.isValidSearchAreaProperty(areaObject);
    }
  }, {
    key: "isValidSearchAreaProperty",
    value: function isValidSearchAreaProperty(areaObject) {
      if (areaObject == null || typeof areaObject !== "object") {
        return false;
      }

      return areaObject.x >= 0 && areaObject.x <= 1 && areaObject.y >= 0 && areaObject.y <= 1 && areaObject.width >= 0 && areaObject.width <= 1 && areaObject.height >= 0 && areaObject.height <= 1;
    }
  }, {
    key: "isValidCameraObject",
    value: function isValidCameraObject(value) {
      var _camera;

      var camera;

      try {
        camera = JSON.parse(value);
      } catch (e) {
        return false;
      }

      return typeof ((_camera = camera) === null || _camera === void 0 ? void 0 : _camera.deviceId) === "string";
    }
  }, {
    key: "isValidCameraSettingsObject",
    value: function isValidCameraSettingsObject(value) {
      var _settings;

      var settings;

      try {
        settings = JSON.parse(value);
      } catch (e) {
        return false;
      }

      return typeof ((_settings = settings) === null || _settings === void 0 ? void 0 : _settings.resolutionPreference) === "string";
    }
  }, {
    key: "isValidSingleImageModeSettingsObject",
    value: function isValidSingleImageModeSettingsObject(value) {
      var settings;

      try {
        settings = JSON.parse(value);
      } catch (e) {
        return false;
      } // TODO: improve checks


      return settings != null && typeof settings === "object";
    }
  }, {
    key: "getExpectationMessageForType",
    value: function getExpectationMessageForType(type) {
      var messageByType = {
        booleanAttribute: "Expected one of \"true\" or \"false\"",
        boolean: "Boolean expected",
        integer: "Integer expected",
        array: "Array expected",
        jsonArray: "Expected JSON array",
        videoFit: "Expected one of \"".concat(values$1(BarcodePicker.ObjectFit).join('", "'), "\""),
        camera: "Expected JSON object having properties of a Camera object",
        cameraSettings: "Expected JSON object having properties of a CameraSettings object",
        cameraType: "Expected one of \"".concat(values$1(Camera.Type).join('", "'), "\""),
        codeDirection: "Expected one of \"".concat(values$1(ScanSettings.CodeDirection).join('", "'), "\""),
        guiStyle: "Expected one of \"".concat(values$1(BarcodePicker.GuiStyle).join('", "'), "\""),
        searchArea: "Expected JSON object having properties of a SearchArea object",
        singleImageModeSettings: "Expected JSON object having properties of a SingleImageModeSettings object"
      };
      return messageByType[type];
    }
  }]);

  return Validator;
}();
Validator.expectationMessage = new map$1();

__decorate([validationMessage("booleanAttribute")], Validator, "isBooleanAttribute", null);

__decorate([validationMessage("boolean")], Validator, "isBooleanProperty", null);

__decorate([validationMessage("integer")], Validator, "isIntegerAttribute", null);

__decorate([validationMessage("integer")], Validator, "isIntegerProperty", null);

__decorate([validationMessage("cameraType")], Validator, "isValidCameraType", null);

__decorate([validationMessage("guiStyle")], Validator, "isValidGuiStyle", null);

__decorate([validationMessage("videoFit")], Validator, "isValidVideoFit", null);

__decorate([validationMessage("codeDirection")], Validator, "isValidCodeDirection", null);

__decorate([validationMessage("array")], Validator, "isArray", null);

__decorate([validationMessage("jsonArray")], Validator, "isValidJsonArray", null);

__decorate([validationMessage("searchArea")], Validator, "isValidSearchAreaAttribute", null);

__decorate([validationMessage("searchArea")], Validator, "isValidSearchAreaProperty", null);

__decorate([validationMessage("camera")], Validator, "isValidCameraObject", null);

__decorate([validationMessage("cameraSettings")], Validator, "isValidCameraSettingsObject", null);

__decorate([validationMessage("singleImageModeSettings")], Validator, "isValidSingleImageModeSettingsObject", null);

function validationMessage(type) {
  return function (target, key) {
    target.expectationMessage.set(target[key], target.getExpectationMessageForType(type));
  };
}

function ownKeys$2(object, enumerableOnly) { var keys = keys$1(object); if (getOwnPropertySymbols$1) { var symbols = getOwnPropertySymbols$1(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return getOwnPropertyDescriptor$1(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { defineProperty$3(target, key, source[key]); }); } else if (getOwnPropertyDescriptors$1) { defineProperties$1(target, getOwnPropertyDescriptors$1(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { defineProperty$1(target, key, getOwnPropertyDescriptor$1(source, key)); }); } } return target; }
var Controller = /*#__PURE__*/function () {
  function Controller(view) {
    classCallCheck(this, Controller);

    this.view = view;
    this.viewConnected = false;
    this.trackAttributes = true;
    this.allSymbologies = values$1(Barcode.Symbology).filter(function (s) {
      return typeof s === "string";
    });
  }

  createClass(Controller, [{
    key: "viewConnectedCallback",
    value: function () {
      var _viewConnectedCallback = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.viewConnected = true;
                this.view.initializeDom();
                this.initializeAttributeConversionGetter();

                if (!this.lazyAttributeConverter[Attribute.CONFIGURE]) {
                  _context.next = 6;
                  break;
                }

                _context.next = 6;
                return this.initPicker();

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function viewConnectedCallback() {
        return _viewConnectedCallback.apply(this, arguments);
      }

      return viewConnectedCallback;
    }()
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name) {
      if (!this.viewConnected || !this.trackAttributes) {
        return;
      }

      var rawAttribute = this.view.getAttribute(name);

      if (rawAttribute != null && !this.validateAttribute(name, rawAttribute)) {
        return;
      }

      var normalizedAttribute = this.attributeToCamelCase(name);
      this.applyChangeFromAttributeChange(normalizedAttribute);
    }
  }, {
    key: "viewDisconnectedCallback",
    value: function viewDisconnectedCallback() {
      this.viewConnected = false;
      this.picker.destroy(); // @ts-ignore

      delete this.picker; // @ts-ignore

      delete this.scanSettings;
    } // tslint:disable-next-line: max-func-body-length

  }, {
    key: "applyChangeFromAttributeChange",
    value: function applyChangeFromAttributeChange(attribute) {
      var _this = this;

      switch (attribute) {
        case Attribute.ACCESS_CAMERA:
          if (this.lazyAttributeConverter[Attribute.ACCESS_CAMERA]) {
            this.picker.accessCamera().catch(function (reason) {
              console.warn("Error while accessing the camera:", reason);
            });
          } else {
            this.picker.pauseCameraAccess();
          }

          break;

        case Attribute.ENABLE_CAMERA_SWITCHER:
          this.picker.setCameraSwitcherEnabled(this.lazyAttributeConverter[Attribute.ENABLE_CAMERA_SWITCHER]);
          break;

        case Attribute.ENABLE_PINCH_TO_ZOOM:
          this.picker.setPinchToZoomEnabled(this.lazyAttributeConverter[Attribute.ENABLE_PINCH_TO_ZOOM]);
          break;

        case Attribute.ENABLE_TAP_TO_FOCUS:
          this.picker.setTapToFocusEnabled(this.lazyAttributeConverter[Attribute.ENABLE_TAP_TO_FOCUS]);
          break;

        case Attribute.ENABLE_TORCH_TOGGLE:
          this.picker.setTorchToggleEnabled(this.lazyAttributeConverter[Attribute.ENABLE_TORCH_TOGGLE]);
          break;

        case Attribute.GUI_STYLE:
          this.picker.setGuiStyle(this.lazyAttributeConverter[Attribute.GUI_STYLE]);
          break;

        case Attribute.LASER_AREA:
          this.picker.setLaserArea(this.lazyAttributeConverter[Attribute.LASER_AREA]);
          break;

        case Attribute.PLAY_SOUND_ON_SCAN:
          this.picker.setPlaySoundOnScanEnabled(this.lazyAttributeConverter[Attribute.PLAY_SOUND_ON_SCAN]);
          break;

        case Attribute.SCANNING_PAUSED:
          if (this.lazyAttributeConverter[Attribute.SCANNING_PAUSED]) {
            this.picker.pauseScanning();
            break;
          }

          this.picker.resumeScanning().catch(function (reason) {
            console.warn("Error while resuming scanning:", reason);
          });
          break;

        case Attribute.TARGET_SCANNING_FPS:
          this.picker.setTargetScanningFPS(this.lazyAttributeConverter[Attribute.TARGET_SCANNING_FPS]);
          break;

        case Attribute.VIBRATE_ON_SCAN:
          this.picker.setVibrateOnScanEnabled(this.lazyAttributeConverter[Attribute.VIBRATE_ON_SCAN]);
          break;

        case Attribute.VIDEO_FIT:
          this.picker.setVideoFit(this.lazyAttributeConverter[Attribute.VIDEO_FIT]);
          break;

        case Attribute.VIEWFINDER_AREA:
          this.picker.setViewfinderArea(this.lazyAttributeConverter[Attribute.VIEWFINDER_AREA]);
          break;

        case Attribute.VISIBLE:
          this.picker.setVisible(this.lazyAttributeConverter[Attribute.VISIBLE]);
          break;

        case Attribute.CAMERA:
          this.getCameraFromAttribute().then(function (camera) {
            _this.picker.setActiveCamera(camera).catch(function (reason) {
              console.warn("Error while setting the active camera:", reason);
            });
          }).catch(function (reason) {
            console.warn("Error while getting the camera:", reason);
          });
          break;

        case Attribute.CAMERA_TYPE:
          this.picker.setCameraType(this.lazyAttributeConverter[Attribute.CAMERA_TYPE]).catch(function (reason) {
            console.warn("Error while setting camera type:", reason);
          });
          break;

        case Attribute.CAMERA_SETTINGS:
          this.picker.applyCameraSettings(this.lazyAttributeConverter[Attribute.CAMERA_SETTINGS]).catch(function (reason) {
            console.warn("Error while applying camera settings:", reason);
          });
          break;
        //
        // SCAN SETTINGS from here
        //

        case Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION:
          this.scanSettings.setBlurryRecognitionEnabled(this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION]);
          this.picker.applyScanSettings(this.scanSettings);
          break;

        case Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT:
          this.scanSettings.setCodeDirectionHint(this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT]);
          this.picker.applyScanSettings(this.scanSettings);
          break;

        case Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER:
          this.scanSettings.setCodeDuplicateFilter(this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER]);
          this.picker.applyScanSettings(this.scanSettings);
          break;

        case Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES:
          this.onEnabledSymbologiesChanged();
          break;

        case Attribute.SCAN_SETTINGS_GPU_ACCELERATION:
          this.scanSettings.setGpuAccelerationEnabled(this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_GPU_ACCELERATION]);
          this.picker.applyScanSettings(this.scanSettings);
          break;

        case Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME:
          this.scanSettings.setMaxNumberOfCodesPerFrame(this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME]);
          this.picker.applyScanSettings(this.scanSettings);
          break;

        case Attribute.SCAN_SETTINGS_SEARCH_AREA:
          this.scanSettings.setSearchArea(this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_SEARCH_AREA]);
          this.picker.applyScanSettings(this.scanSettings);
          break;

        case Attribute.CONFIGURE:
          if (this.lazyAttributeConverter[Attribute.CONFIGURE]) {
            this.initPicker().catch(function (reason) {
              console.warn("Error while initializing barcode picker:", reason);
            });
          }

          break;

        case Attribute.SINGLE_IMAGE_MODE_SETTINGS:
        case Attribute.CONFIGURE_ENGINE_LOCATION:
        case Attribute.CONFIGURE_LICENSE_KEY:
        case Attribute.CONFIGURE_PRELOAD_BLURRY_RECOGNITION:
        case Attribute.CONFIGURE_PRELOAD_ENGINE:
          // noop
          break;

        default:
          // the following statement is here to make sure of the exhaustivenesss of this switch statement (if you miss
          // a case the compiler will yell at you)
          assertUnreachable(attribute);
          break;
      }
    }
  }, {
    key: "initPicker",
    value: function () {
      var _initPicker = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(this.picker != null)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                this.validateAllAttributes();
                _context2.prev = 3;
                _context2.next = 6;
                return configure(this.lazyAttributeConverter[Attribute.CONFIGURE_LICENSE_KEY], {
                  engineLocation: this.lazyAttributeConverter[Attribute.CONFIGURE_ENGINE_LOCATION],
                  preloadEngine: this.lazyAttributeConverter[Attribute.CONFIGURE_PRELOAD_ENGINE],
                  preloadBlurryRecognition: this.lazyAttributeConverter[Attribute.CONFIGURE_PRELOAD_BLURRY_RECOGNITION]
                });

              case 6:
                _context2.t0 = Proxy;
                _context2.t1 = BarcodePicker;
                _context2.t2 = this.view.root;
                _context2.t3 = this.lazyAttributeConverter[Attribute.ACCESS_CAMERA];
                _context2.next = 12;
                return this.getCameraFromAttribute();

              case 12:
                _context2.t4 = _context2.sent;
                _context2.t5 = this.lazyAttributeConverter[Attribute.CAMERA_TYPE];
                _context2.t6 = this.lazyAttributeConverter[Attribute.ENABLE_CAMERA_SWITCHER];
                _context2.t7 = this.lazyAttributeConverter[Attribute.ENABLE_PINCH_TO_ZOOM];
                _context2.t8 = this.lazyAttributeConverter[Attribute.ENABLE_TAP_TO_FOCUS];
                _context2.t9 = this.lazyAttributeConverter[Attribute.ENABLE_TORCH_TOGGLE];
                _context2.t10 = this.lazyAttributeConverter[Attribute.PLAY_SOUND_ON_SCAN];
                _context2.t11 = this.lazyAttributeConverter[Attribute.VIBRATE_ON_SCAN];
                _context2.t12 = this.lazyAttributeConverter[Attribute.SCANNING_PAUSED];
                _context2.t13 = this.lazyAttributeConverter[Attribute.GUI_STYLE];
                _context2.t14 = this.lazyAttributeConverter[Attribute.TARGET_SCANNING_FPS];
                _context2.t15 = this.lazyAttributeConverter[Attribute.VIDEO_FIT];
                _context2.t16 = this.lazyAttributeConverter[Attribute.VISIBLE];
                _context2.t17 = this.lazyAttributeConverter[Attribute.VIEWFINDER_AREA];
                _context2.t18 = this.lazyAttributeConverter[Attribute.LASER_AREA];
                _context2.next = 29;
                return this.getSingleImageModeSettings();

              case 29:
                _context2.t19 = _context2.sent;
                _context2.t20 = {
                  accessCamera: _context2.t3,
                  camera: _context2.t4,
                  cameraType: _context2.t5,
                  enableCameraSwitcher: _context2.t6,
                  enablePinchToZoom: _context2.t7,
                  enableTapToFocus: _context2.t8,
                  enableTorchToggle: _context2.t9,
                  playSoundOnScan: _context2.t10,
                  vibrateOnScan: _context2.t11,
                  scanningPaused: _context2.t12,
                  guiStyle: _context2.t13,
                  targetScanningFPS: _context2.t14,
                  videoFit: _context2.t15,
                  visible: _context2.t16,
                  viewfinderArea: _context2.t17,
                  laserArea: _context2.t18,
                  singleImageModeSettings: _context2.t19
                };
                _context2.next = 33;
                return _context2.t1.create.call(_context2.t1, _context2.t2, _context2.t20);

              case 33:
                _context2.t21 = _context2.sent;
                _context2.t22 = this.getBarcodePickerProxyHandler();
                this.picker = new _context2.t0(_context2.t21, _context2.t22);
                _context2.next = 41;
                break;

              case 38:
                _context2.prev = 38;
                _context2.t23 = _context2["catch"](3);
                return _context2.abrupt("return", this.handleException(_context2.t23));

              case 41:
                this.scanSettings = new ScanSettings({
                  enabledSymbologies: this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES],
                  codeDirectionHint: this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT],
                  codeDuplicateFilter: this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER],
                  blurryRecognition: this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION],
                  gpuAcceleration: this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_GPU_ACCELERATION],
                  maxNumberOfCodesPerFrame: this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME],
                  searchArea: this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_SEARCH_AREA]
                });
                this.picker.applyScanSettings(this.scanSettings);
                this.picker.on("ready", this.dispatchPickerEvent.bind(this, "ready"));
                this.picker.on("submitFrame", this.dispatchPickerEvent.bind(this, "submitFrame"));
                this.picker.on("processFrame", this.dispatchPickerEvent.bind(this, "processFrame"));
                this.picker.on("scan", this.dispatchPickerEvent.bind(this, "scan"));
                this.picker.on("scanError", this.dispatchPickerEvent.bind(this, "scanError"));

              case 48:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3, 38]]);
      }));

      function initPicker() {
        return _initPicker.apply(this, arguments);
      }

      return initPicker;
    }()
  }, {
    key: "getBarcodePickerProxyHandler",
    value: function getBarcodePickerProxyHandler() {
      var _this2 = this;

      var proxiedGui;
      var proxiedCameraManager; // tslint:disable-next-line: no-this-assignment

      var controllerRef = this;

      function getProxiedGui(target) {
        if (proxiedGui == null) {
          // tslint:disable-next-line: no-string-literal
          proxiedGui = new Proxy(target["gui"], {
            // tslint:disable-next-line: no-any
            set: function set(gui, p, value) {
              set$4(gui, p, value);

              controllerRef.onPickerPropertyUpdate.call(controllerRef, {
                origin: "gui",
                key: p,
                newValue: value
              });
              return true;
            }
          });
        }

        return proxiedGui;
      }

      function getProxiedCameraManager(target) {
        if (proxiedCameraManager == null) {
          // tslint:disable-next-line: no-string-literal
          proxiedCameraManager = new Proxy(target["cameraManager"], {
            // tslint:disable-next-line: no-any
            set: function set(cameraManager, p, value) {
              set$4(cameraManager, p, value);

              controllerRef.onPickerPropertyUpdate.call(controllerRef, {
                origin: "cameraManager",
                key: p,
                newValue: value
              });
              return true;
            }
          });
        }

        return proxiedCameraManager;
      }

      return {
        get: function get(target, p) {
          if (p === "gui") {
            return getProxiedGui(target);
          }

          if (p === "cameraManager") {
            return getProxiedCameraManager(target);
          }

          if (p === "applyScanSettings") {
            return function (scanSettings) {
              apply$1(get$2(target, p), target, [scanSettings]);

              _this2.onScannerNewScanSettings(scanSettings);
            };
          }

          return get$2(target, p);
        },
        // tslint:disable-next-line: no-any
        set: function set(picker, p, value) {
          set$4(picker, p, value);

          _this2.onPickerPropertyUpdate({
            key: p,
            origin: "picker",
            newValue: value
          });

          return true;
        }
      };
    }
    /**
     * Gather all settings from the passed scan settings and call `propertyDidUpdate`
     * to notify about the new settings.
     *
     * @param scanSettings The newly applied scan settings
     */

  }, {
    key: "onScannerNewScanSettings",
    value: function onScannerNewScanSettings(scanSettings) {
      var _this3 = this;

      var allSymbologies = values$1(Barcode.Symbology).filter(function (s) {
        return typeof s === "string";
      });

      var changeSet = [{
        key: Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION,
        newValue: scanSettings.isBlurryRecognitionEnabled()
      }, {
        key: Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT,
        newValue: scanSettings.getCodeDirectionHint()
      }, {
        key: Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER,
        newValue: scanSettings.getCodeDuplicateFilter()
      }, {
        key: Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES,
        newValue: allSymbologies.reduce(function (enabledSymbologies, symbology) {
          if (scanSettings.isSymbologyEnabled(symbology)) {
            enabledSymbologies.push(Barcode.Symbology.toJSONName(symbology));
          }

          return enabledSymbologies;
        }, [])
      }, {
        key: Attribute.SCAN_SETTINGS_GPU_ACCELERATION,
        newValue: scanSettings.isGpuAccelerationEnabled()
      }, {
        key: Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME,
        newValue: scanSettings.getMaxNumberOfCodesPerFrame()
      }, {
        key: Attribute.SCAN_SETTINGS_SEARCH_AREA,
        newValue: scanSettings.getSearchArea()
      }];
      changeSet.forEach(function (change) {
        _this3.onPickerPropertyUpdate(_objectSpread$2({
          origin: "scanner"
        }, change));
      });
    }
    /**
     * for each attribute we support, define a property on the "primaryValues" object to get the attribute and convert
     * it to its primary type (e.g. the string "true" would become the real boolean value `true`)
     */

  }, {
    key: "initializeAttributeConversionGetter",
    value: function initializeAttributeConversionGetter() {
      this.lazyAttributeConverter = new LazyAttributeConverter(getSchema(), this.view);
    }
  }, {
    key: "getCameraFromAttribute",
    value: function () {
      var _getCameraFromAttribute = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
        var userCamera, cameraAttr, cameras, userCameraId;
        return regenerator.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                cameraAttr = this.lazyAttributeConverter[Attribute.CAMERA];

                if (!((cameraAttr === null || cameraAttr === void 0 ? void 0 : cameraAttr.deviceId) != null)) {
                  _context3.next = 8;
                  break;
                }

                _context3.next = 4;
                return CameraAccess.getCameras();

              case 4:
                cameras = _context3.sent;
                userCameraId = cameraAttr.deviceId;
                userCamera = cameras.find(function (camera) {
                  return camera.deviceId === userCameraId;
                });

                if (userCamera == null) {
                  console.warn("Could not find camera with id \"".concat(userCameraId, "\", will use default camera."));
                }

              case 8:
                return _context3.abrupt("return", userCamera);

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getCameraFromAttribute() {
        return _getCameraFromAttribute.apply(this, arguments);
      }

      return getCameraFromAttribute;
    }()
  }, {
    key: "onEnabledSymbologiesChanged",
    value: function onEnabledSymbologiesChanged() {
      var _this4 = this;

      var symbologiesToEnable = this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES];
      this.allSymbologies.forEach(function (symbology) {
        var shouldEnable = symbologiesToEnable.includes(symbology);

        _this4.scanSettings.getSymbologySettings(symbology).setEnabled(shouldEnable);
      });
      this.picker.applyScanSettings(this.scanSettings);
    } // tslint:disable-next-line: no-any

  }, {
    key: "onPickerPropertyUpdate",
    value: function onPickerPropertyUpdate(change) {
      var _mappingsByOrigin$cha,
          _mappingsByOrigin$cha2,
          _this5 = this;

      // we need to map the private property name to our "public" properties
      var mappingsByOrigin = {
        gui: {
          customLaserArea: [Attribute.LASER_AREA],
          customViewfinderArea: [Attribute.VIEWFINDER_AREA]
        },
        cameraManager: {
          activeCamera: [Attribute.CAMERA, Attribute.CAMERA_TYPE],
          cameraSwitcherEnabled: [Attribute.ENABLE_CAMERA_SWITCHER],
          torchToggleEnabled: [Attribute.ENABLE_TORCH_TOGGLE],
          tapToFocusEnabled: [Attribute.ENABLE_TAP_TO_FOCUS],
          pinchToZoomEnabled: [Attribute.ENABLE_PINCH_TO_ZOOM]
        }
      };
      var propertyNames = (_mappingsByOrigin$cha = (_mappingsByOrigin$cha2 = mappingsByOrigin[change.origin]) === null || _mappingsByOrigin$cha2 === void 0 ? void 0 : _mappingsByOrigin$cha2[change.key]) !== null && _mappingsByOrigin$cha !== void 0 ? _mappingsByOrigin$cha : [change.key];
      this.trackAttributes = false;
      propertyNames.forEach(function (propertyName) {
        if (attributes.includes(propertyName)) {
          if (change.newValue == null) {
            _this5.view.removeAttribute(propertyName);
          } else {
            _this5.view.setAttribute(propertyName, convertProperty(getSchema()[propertyName], change.newValue));
          }
        }
      });
      this.trackAttributes = true;
    }
  }, {
    key: "getSingleImageModeSettings",
    value: function () {
      var _getSingleImageModeSettings = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4() {
        var _this6 = this;

        var settings, _this$lazyAttributeCo, _this$lazyAttributeCo2;

        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                settings = {};

                if (this.lazyAttributeConverter[Attribute.SINGLE_IMAGE_MODE_SETTINGS] != null) {
                  // merge settings from user
                  settings.desktop = _objectSpread$2(_objectSpread$2({}, SingleImageModeSettings.defaultDesktop), (_this$lazyAttributeCo = this.lazyAttributeConverter[Attribute.SINGLE_IMAGE_MODE_SETTINGS].desktop) !== null && _this$lazyAttributeCo !== void 0 ? _this$lazyAttributeCo : {});
                  settings.mobile = _objectSpread$2(_objectSpread$2({}, SingleImageModeSettings.defaultMobile), (_this$lazyAttributeCo2 = this.lazyAttributeConverter[Attribute.SINGLE_IMAGE_MODE_SETTINGS].mobile) !== null && _this$lazyAttributeCo2 !== void 0 ? _this$lazyAttributeCo2 : {});
                } // children may not have been parsed yet


                _context4.next = 4;
                return this.view.waitOnChildrenReady();

              case 4:
                // This parts will slightly hurt your eyes because of TS: basically we just loop over "desktop" and "mobile", and
                // loop again inside over the HTML elements that can be set with slot.
                ["mobile", "desktop"].forEach(function (platform) {
                  ["informationElement", "buttonElement"].forEach(function (platformSetting) {
                    var el = _this6.view.querySelector("*[slot=\"singleImageModeSettings.".concat(platform, ".").concat(platformSetting, "\"]"));

                    if (el != null && settings[platform] != null) {
                      // tslint:disable-next-line: no-non-null-assertion no-any
                      settings[platform][platformSetting] = el;
                    }
                  });
                });
                return _context4.abrupt("return", settings);

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getSingleImageModeSettings() {
        return _getSingleImageModeSettings.apply(this, arguments);
      }

      return getSingleImageModeSettings;
    }()
  }, {
    key: "dispatchPickerEvent",
    value: function dispatchPickerEvent(eventName, scanResultOrError) {
      var event = new CustomEvent(eventName, {
        detail: scanResultOrError
      });
      this.view.dispatchCustomEvent(event);
    }
  }, {
    key: "validateAllAttributes",
    value: function validateAllAttributes() {
      var _this7 = this;

      var attrs = from$1(this.view.getAttributes());

      attrs.forEach(function (attr) {
        if (attributes.includes(attr.name)) {
          _this7.validateAttribute(attr.name, attr.value);
        }
      });
    }
  }, {
    key: "validateAttribute",
    value: function validateAttribute(name, value) {
      var normalizedAttribute = this.attributeToCamelCase(name);
      var validatorFunction;

      switch (normalizedAttribute) {
        case Attribute.ACCESS_CAMERA:
        case Attribute.CONFIGURE:
        case Attribute.ENABLE_CAMERA_SWITCHER:
        case Attribute.ENABLE_PINCH_TO_ZOOM:
        case Attribute.ENABLE_TAP_TO_FOCUS:
        case Attribute.ENABLE_TORCH_TOGGLE:
        case Attribute.PLAY_SOUND_ON_SCAN:
        case Attribute.SCANNING_PAUSED:
        case Attribute.VIBRATE_ON_SCAN:
        case Attribute.VISIBLE:
        case Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION:
        case Attribute.SCAN_SETTINGS_GPU_ACCELERATION:
          validatorFunction = Validator.isBooleanAttribute;
          break;

        case Attribute.TARGET_SCANNING_FPS:
        case Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER:
        case Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME:
          validatorFunction = Validator.isIntegerAttribute;
          break;

        case Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT:
          validatorFunction = Validator.isValidCodeDirection;
          break;

        case Attribute.CAMERA_TYPE:
          validatorFunction = Validator.isValidCameraType;
          break;

        case Attribute.GUI_STYLE:
          validatorFunction = Validator.isValidGuiStyle;
          break;

        case Attribute.VIDEO_FIT:
          validatorFunction = Validator.isValidVideoFit;
          break;

        case Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES:
          validatorFunction = Validator.isValidJsonArray;
          break;

        case Attribute.VIEWFINDER_AREA:
        case Attribute.LASER_AREA:
        case Attribute.SCAN_SETTINGS_SEARCH_AREA:
          validatorFunction = Validator.isValidSearchAreaAttribute;
          break;

        case Attribute.CAMERA:
          validatorFunction = Validator.isValidCameraObject;
          break;

        case Attribute.CAMERA_SETTINGS:
          validatorFunction = Validator.isValidCameraSettingsObject;
          break;

        case Attribute.SINGLE_IMAGE_MODE_SETTINGS:
          validatorFunction = Validator.isValidSingleImageModeSettingsObject;
          break;

        case Attribute.CONFIGURE_ENGINE_LOCATION:
        case Attribute.CONFIGURE_PRELOAD_BLURRY_RECOGNITION:
        case Attribute.CONFIGURE_LICENSE_KEY:
        case Attribute.CONFIGURE_PRELOAD_ENGINE:
          validatorFunction = function validatorFunction() {
            return true;
          };

          break;

        default:
          assertUnreachable(normalizedAttribute);
          break;
      }

      if (!validatorFunction(value)) {
        var _Validator$expectatio;

        console.warn("Invalid value for attribute \"".concat(normalizedAttribute, "\": \"").concat(value, "\". ").concat((_Validator$expectatio = Validator.expectationMessage.get(validatorFunction)) !== null && _Validator$expectatio !== void 0 ? _Validator$expectatio : ""));
        return false;
      }

      return true;
    }
    /**
     * Transform the given attribute name to its camel-cased version.
     *
     * @param attrName The attribute name, possibly all lower-cased
     * @returns camel-cased attribute name
     */

  }, {
    key: "attributeToCamelCase",
    value: function attributeToCamelCase(attrName) {
      var index = attributes.findIndex(function (k) {
        return k.toLowerCase() === attrName.toLowerCase();
      });
      return attributes[index];
    }
  }, {
    key: "handleException",
    value: function handleException(e) {
      console.error(e);
    }
  }]);

  return Controller;
}();

function _createSuper$3(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$4(); return function _createSuperInternal() { var Super = getPrototypeOf$2(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf$2(this).constructor; result = construct$2(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$4() { if (typeof Reflect === "undefined" || !construct$2) return false; if (construct$2.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct$2(Date, [], function () {})); return true; } catch (e) { return false; } }
var ScanditBarcodePicker = /*#__PURE__*/function (_HTMLElement) {
  inherits(ScanditBarcodePicker, _HTMLElement);

  var _super = _createSuper$3(ScanditBarcodePicker);

  function ScanditBarcodePicker() {
    var _this;

    classCallCheck(this, ScanditBarcodePicker);

    _this = _super.call(this);
    _this.controller = new Controller(assertThisInitialized(_this));
    _this.shadowDom = _this.attachShadow({
      mode: "open"
    });
    return _this;
  }

  createClass(ScanditBarcodePicker, [{
    key: "barcodePicker",
    get:
    /**
     * Expose main objects on view
     */
    function get() {
      return this.controller.picker;
    }
  }, {
    key: "root",
    get: function get() {
      return this.shadowDom.querySelector("#root");
    }
  }, {
    key: "connectedCallback",
    value: function () {
      var _connectedCallback = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.controller.viewConnectedCallback();

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function connectedCallback() {
        return _connectedCallback.apply(this, arguments);
      }

      return connectedCallback;
    }()
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      this.controller.viewDisconnectedCallback();
    }
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name) {
      this.controller.attributeChangedCallback(name);
    }
  }, {
    key: "initializeDom",
    value: function initializeDom() {
      // tslint:disable-next-line:no-inner-html
      this.shadowDom.innerHTML = this.initialDomContent;
    }
  }, {
    key: "dispatchCustomEvent",
    value: function dispatchCustomEvent(e) {
      this.dispatchEvent(e);
    }
  }, {
    key: "getAttributes",
    value: function getAttributes() {
      return from$1(this.attributes).map(function (att) {
        return {
          name: att.name,
          value: att.value
        };
      });
    }
  }, {
    key: "waitOnChildrenReady",
    value: function waitOnChildrenReady() {
      return new promise$1(function (resolve) {
        setTimeout(resolve, 50);
      });
    }
  }, {
    key: "initialDomContent",
    get: function get() {
      return "\n      <style>".concat(this.styles, "</style>\n      <div id=\"root\"></div>\n    ");
    }
  }, {
    key: "wcStyles",
    get: function get() {
      return "\n      :host {\n        display: block;\n      }\n\n      :host([hidden]) {\n        display: none;\n      }\n\n      #root {\n        height: inherit;\n        max-height: inherit;\n      }\n    ";
    }
  }, {
    key: "styles",
    get: function get() {
      return "\n      ".concat(this.wcStyles, "\n      ").concat(pickerStyles, "\n    ");
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return attributes.map(function (s) {
        return s.toLowerCase();
      });
    }
  }, {
    key: "registerComponent",
    value: function registerComponent() {
      if (!("customElements" in window)) {
        return;
      }

      if (!customElements.get(ScanditBarcodePicker.TAG_NAME)) {
        customElements.define(ScanditBarcodePicker.TAG_NAME, ScanditBarcodePicker);
      }

      return ScanditBarcodePicker.TAG_NAME;
    }
  }]);

  return ScanditBarcodePicker;
}( /*#__PURE__*/wrapNativeSuper(HTMLElement));
ScanditBarcodePicker.TAG_NAME = "scandit-barcode-picker";

ScanditBarcodePicker.registerComponent();
/**
 * @hidden
 */

var deviceId = BrowserHelper.getDeviceId();
/**
 * @hidden
 */

var userLicenseKey;
/**
 * @hidden
 */

var scanditEngineLocation;
/**
 * @hidden
 */

var blurryRecognitionPreloader;
/**
 * @hidden
 */

var engineLoader;
/**
 * @hidden
 *
 * Flag describing if configure() was called and if it could execute in its entirety.
 */

var configurePhase = "unconfigured";
/**
 * @hidden
 */

var configurePromise;
/**
 * @hidden
 * Mainly used by tests.
 */

function resetConfigure() {
  configurePhase = "unconfigured";
  configurePromise = undefined;
}
/**
 * Initialize and configure the Scandit Barcode Scanner SDK library. This function must be called (once) before
 * instantiating the main library components (`BarcodePicker` and `Scanner` objects) and returns a promise. In case this
 * is called again after a successful call, parameters from subsequent calls are ignored and the same promise returned
 * from the successful call will be returned.
 *
 * Depending on parameters and browser features, any of the following errors could be the rejected result of the
 * returned promise:
 * - `NoLicenseKeyError`
 * - `UnsupportedBrowserError`
 *
 * The external external Scandit Engine library and data needed for blurry recognition are preloaded asynchronously
 * eagerly by default after library configuration to ensure the best performance. If needed this behaviour can be
 * changed via the *preloadEngine* and *preloadBlurryRecognition* options.
 *
 * For optimal performance, it is recommended to call this function as soon as possible to ensure needed components are
 * preloaded and initialized ahead of time.
 *
 * Camera access requests are done lazily only when needed by a [[BarcodePicker]] (or [[Scanner]]) object. You can also
 * eagerly ask only for camera access permissions by calling the [[CameraAccess.getCameras]] function.
 *
 * Ideally, to make the scanning process faster, it is recommended depending on the use case to create in
 * advance a (hidden and paused) [[BarcodePicker]] or [[Scanner]] object, to later show and unpause it when needed.
 * Depending on the options this can also be used to correctly ask for camera access permissions whenever preferred.
 *
 * @param licenseKey The Scandit license key to be used by the library.
 * @param engineLocation <div class="tsd-signature-symbol">Default =&nbsp;"/"</div>
 * The location of the folder containing the external scandit-engine-sdk.min.js and
 * scandit-engine-sdk.wasm files (external Scandit Engine library).
 * By default they are retrieved from the root of the web application.
 * Can be a full URL to folder or an absolute folder path.
 * @param preloadBlurryRecognition <div class="tsd-signature-symbol">Default =&nbsp;true</div>
 * Whether to preload (load or generate if needed) data needed for blurry recognition as soon as possible via a separate
 * asynchronous WebWorker thread running the Scandit Engine library. Data for all symbologies is generated over time.
 *
 * If enabled, any [[BarcodePicker]] or [[Scanner]] object will be able to start processing video frames much faster, as
 * it won't need to generate blurry recognition data lazily only when needed. If necessary, depending on given
 * [[ScanSettings]] options and on readiness of the data, processing is also initially performed without blurry
 * recognition until this data becomes available, at which point the new data will be loaded and used.
 *
 * If disabled, [[BarcodePicker]] or [[Scanner]] objects will load or generate blurry recognition data lazily when
 * needed to process the first frame, depending on given [[ScanSettings]] options, and will thus require more time the
 * first time the library is actively used with the given active symbologies. As this needs to be done in the same
 * WebWorker, the processing of the frame will then be blocked until the needed data is loaded or generated.
 *
 * Note that in either case the data for blurry recognition will be cached for later successive uses of the library.
 *
 * Note that preloading does not trigger a device activation for licensing purposes.
 * @param preloadEngine <div class="tsd-signature-symbol">Default =&nbsp;true</div>
 * Whether to preload (download if needed, compile/instantiate WebAssembly code and initialize) the external Scandit
 * Engine library, used by [[BarcodePicker]] and [[Scanner]] objects to perform scan operations.
 *
 * If enabled, any [[BarcodePicker]] or [[Scanner]] object will be ready to start processing video frames much faster,
 * as the needed external Scandit Engine library will already be in a partially or fully initialized state thanks to it
 * being preloaded now.
 *
 * If disabled, [[BarcodePicker]] and [[Scanner]] objects will load the external Scandit Engine library on creation
 * (if it wasn't already loaded before by a previously created object), and will thus require more time to be
 * initialized and ready.
 *
 * Note that in either case the loaded external Scandit Engine library will be reused whenever possible for later
 * successive uses of the library.
 *
 * Note that preloading does not trigger a device activation for licensing purposes.
 *
 * @returns A promise resolving when the library has been configured (preloading is done independently asynchronously).
 */

function configure(licenseKey) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$engineLocation = _ref.engineLocation,
      engineLocation = _ref$engineLocation === void 0 ? "/" : _ref$engineLocation,
      _ref$preloadBlurryRec = _ref.preloadBlurryRecognition,
      preloadBlurryRecognition = _ref$preloadBlurryRec === void 0 ? true : _ref$preloadBlurryRec,
      _ref$preloadEngine = _ref.preloadEngine,
      preloadEngine = _ref$preloadEngine === void 0 ? true : _ref$preloadEngine;

  if (configurePromise != null) {
    return configurePromise;
  }

  configurePromise = new promise$1( /*#__PURE__*/function () {
    var _ref2 = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(resolve, reject) {
      var browserCompatibility;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log("Scandit Web SDK version: 5.5.3");
              configurePhase = "started";
              browserCompatibility = BrowserHelper.checkBrowserCompatibility();

              if (!(!browserCompatibility.fullSupport && !browserCompatibility.scannerSupport)) {
                _context.next = 5;
                break;
              }

              return _context.abrupt("return", reject(new UnsupportedBrowserError(browserCompatibility)));

            case 5:
              if (!(licenseKey == null || licenseKey.trim().length < 64)) {
                _context.next = 7;
                break;
              }

              return _context.abrupt("return", reject(new CustomError({
                name: "NoLicenseKeyError",
                message: "No license key provided"
              })));

            case 7:
              userLicenseKey = licenseKey;
              engineLocation += engineLocation.slice(-1) === "/" ? "" : "/";

              if (/^https?:\/\//.test(engineLocation)) {
                scanditEngineLocation = "".concat(engineLocation);
              } else {
                engineLocation = engineLocation.split("/").filter(function (s) {
                  return s.length > 0;
                }).join("/");

                if (engineLocation === "") {
                  engineLocation = "/";
                } else {
                  engineLocation = "/".concat(engineLocation, "/");
                }

                if (location.protocol === "file:" || location.origin === "null") {
                  scanditEngineLocation = "".concat(location.href.split("/").slice(0, -1).join("/")).concat(engineLocation);
                } else {
                  scanditEngineLocation = "".concat(location.origin).concat(engineLocation);
                }
              }

              _context.next = 12;
              return BlurryRecognitionPreloader.create(preloadBlurryRecognition);

            case 12:
              blurryRecognitionPreloader = _context.sent;
              _context.next = 15;
              return blurryRecognitionPreloader.prepareBlurryTables();

            case 15:
              engineLoader = new EngineLoader(preloadEngine);
              configurePhase = "done";
              return _context.abrupt("return", resolve());

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }());
  configurePromise = configurePromise.catch(function (e) {
    resetConfigure();
    throw e;
  });
  return configurePromise;
}

export { Barcode, BarcodePicker, BrowserCompatibility, BrowserHelper, Camera, CameraAccess, CameraSettings, CustomError, ImageSettings, Parser, ScanResult, ScanSettings, Scanner, SingleImageModeSettings, SymbologySettings, uaParser as UAParser, blurryRecognitionPreloader, configure, configurePhase, configurePromise, deviceId, engine, engineLoader, engineWorkerBlob, resetConfigure, scanditEngineLocation, userLicenseKey };
//# sourceMappingURL=index.esm.js.map
