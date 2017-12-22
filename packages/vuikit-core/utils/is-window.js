/*
 * Determines if the value is an object
 */
function isObject (val) {
  var type = typeof val;
  return val !== null && (type === 'object' || type === 'function')
}

/*
 * Determines if the value is the window object
 */
function isWindow (obj) {
  return isObject(obj) && obj === obj.window
}

export default isWindow;
