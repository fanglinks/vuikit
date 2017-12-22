/**
* Flat merge, allows multiple args
*/
function merge (host) {
  var donors = slice(arguments, 1);

  donors.forEach(function (donor) {
    Object.keys(donor).forEach(function (key) {
      host[key] = donor[key];
    });
  });

  return host
}

function slice (arr, i) {
  return Array.prototype.slice.call(arr, i)
}

/*
 * Determines if the value is an object
 */
function isObject (val) {
  var type = typeof val;
  return val !== null && (type === 'object' || type === 'function')
}

/*
 * Determines if the value is a function
 */
function isFunction (val) {
  return toString(val) === '[object Function]'
}

function toString (val) {
  return Object.prototype.toString.call(val)
}

/*
 * Safely and quickly serialize JavaScript objects
 * https://github.com/davidmarkclements/fast-safe-stringify
 */
function stringify (obj) {
  if (isObject(obj) && !isFunction(obj.toJSON)) {
    decirc(merge({}, obj), '', [], null);
  }

  return JSON.stringify(obj)
}

function Circle (val, k, parent) {
  this.val = val;
  this.k = k;
  this.parent = parent;
  this.count = 1;
}

Circle.prototype.toJSON = function toJSON () {
  if (--this.count === 0) {
    this.parent[this.k] = this.val;
  }
  return '[Circular]'
};

function decirc (val, k, stack, parent) {
  var keys, len, i;
  if (typeof val !== 'object' || val === null) {
    // not an object, nothing to do
    return
  } else if (val instanceof Circle) {
    val.count++;
    return
  } else if (typeof val.toJSON === 'function' && !val.toJSON.forceDecirc) {
    return
  } else if (parent) {
    if (~stack.indexOf(val)) {
      parent[k] = new Circle(val, k, parent);
      return
    }
  }
  stack.push(val);
  keys = Object.keys(val);
  len = keys.length;
  i = 0;
  for (; i < len; i++) {
    k = keys[i];
    decirc(val[k], k, stack, val);
  }
  stack.pop();
}

export default stringify;
