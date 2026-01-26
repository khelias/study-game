if (typeof Object.hasOwn !== 'function') {
  Object.hasOwn = function hasOwn(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
}

if (typeof Array.prototype.at !== 'function') {
  // Minimal at() polyfill for Node < 16.6
  Array.prototype.at = function at(index) {
    const len = this.length >>> 0;
    if (len === 0) return undefined;
    const relativeIndex = Number(index) || 0;
    const k = relativeIndex < 0 ? len + relativeIndex : relativeIndex;
    if (k < 0 || k >= len) return undefined;
    return this[k];
  };
}

if (typeof String.prototype.at !== 'function') {
  String.prototype.at = function at(index) {
    const len = this.length >>> 0;
    if (len === 0) return '';
    const relativeIndex = Number(index) || 0;
    const k = relativeIndex < 0 ? len + relativeIndex : relativeIndex;
    if (k < 0 || k >= len) return '';
    return this.charAt(k);
  };
}
