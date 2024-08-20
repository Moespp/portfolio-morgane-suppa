import {
  require_react
} from "./chunk-HAZNF34R.js";
import {
  __toESM
} from "./chunk-WXXH56N5.js";

// node_modules/@bundled-es-modules/pdfjs-dist/build/pdf.js
var global$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
var inited = false;
function init() {
  inited = true;
  var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }
  revLookup["-".charCodeAt(0)] = 62;
  revLookup["_".charCodeAt(0)] = 63;
}
function toByteArray(b64) {
  if (!inited) {
    init();
  }
  var i, j, l2, tmp, placeHolders, arr;
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error("Invalid string. Length must be a multiple of 4");
  }
  placeHolders = b64[len - 2] === "=" ? 2 : b64[len - 1] === "=" ? 1 : 0;
  arr = new Arr(len * 3 / 4 - placeHolders);
  l2 = placeHolders > 0 ? len - 4 : len;
  var L = 0;
  for (i = 0, j = 0; i < l2; i += 4, j += 3) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = tmp >> 16 & 255;
    arr[L++] = tmp >> 8 & 255;
    arr[L++] = tmp & 255;
  }
  if (placeHolders === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[L++] = tmp & 255;
  } else if (placeHolders === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[L++] = tmp >> 8 & 255;
    arr[L++] = tmp & 255;
  }
  return arr;
}
function tripletToBase64(num) {
  return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
}
function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
    output.push(tripletToBase64(tmp));
  }
  return output.join("");
}
function fromByteArray(uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3;
  var output = "";
  var parts = [];
  var maxChunkLength = 16383;
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[tmp << 4 & 63];
    output += "==";
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    output += lookup[tmp >> 10];
    output += lookup[tmp >> 4 & 63];
    output += lookup[tmp << 2 & 63];
    output += "=";
  }
  parts.push(output);
  return parts.join("");
}
function read(buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];
  i += d;
  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
  }
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
  }
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
}
function write(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c2;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  value = Math.abs(value);
  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c2 = Math.pow(2, -e)) < 1) {
      e--;
      c2 *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c2;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c2 >= 2) {
      e++;
      c2 /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c2 - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
  }
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
  }
  buffer[offset + i - d] |= s * 128;
}
var toString = {}.toString;
var isArray = Array.isArray || function(arr) {
  return toString.call(arr) == "[object Array]";
};
var INSPECT_MAX_BYTES = 50;
Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== void 0 ? global$1.TYPED_ARRAY_SUPPORT : true;
function kMaxLength() {
  return Buffer.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function createBuffer(that, length) {
  if (kMaxLength() < length) {
    throw new RangeError("Invalid typed array length");
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }
  return that;
}
function Buffer(arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length);
  }
  if (typeof arg === "number") {
    if (typeof encodingOrOffset === "string") {
      throw new Error(
        "If encoding is specified then the first argument must be a string"
      );
    }
    return allocUnsafe(this, arg);
  }
  return from(this, arg, encodingOrOffset, length);
}
Buffer.poolSize = 8192;
Buffer._augment = function(arr) {
  arr.__proto__ = Buffer.prototype;
  return arr;
};
function from(that, value, encodingOrOffset, length) {
  if (typeof value === "number") {
    throw new TypeError('"value" argument must not be a number');
  }
  if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length);
  }
  if (typeof value === "string") {
    return fromString(that, value, encodingOrOffset);
  }
  return fromObject(that, value);
}
Buffer.from = function(value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length);
};
if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
}
function assertSize(size) {
  if (typeof size !== "number") {
    throw new TypeError('"size" argument must be a number');
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative');
  }
}
function alloc(that, size, fill2, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size);
  }
  if (fill2 !== void 0) {
    return typeof encoding === "string" ? createBuffer(that, size).fill(fill2, encoding) : createBuffer(that, size).fill(fill2);
  }
  return createBuffer(that, size);
}
Buffer.alloc = function(size, fill2, encoding) {
  return alloc(null, size, fill2, encoding);
};
function allocUnsafe(that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that;
}
Buffer.allocUnsafe = function(size) {
  return allocUnsafe(null, size);
};
Buffer.allocUnsafeSlow = function(size) {
  return allocUnsafe(null, size);
};
function fromString(that, string, encoding) {
  if (typeof encoding !== "string" || encoding === "") {
    encoding = "utf8";
  }
  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding');
  }
  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);
  var actual = that.write(string, encoding);
  if (actual !== length) {
    that = that.slice(0, actual);
  }
  return that;
}
function fromArrayLike(that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that;
}
function fromArrayBuffer(that, array, byteOffset, length) {
  array.byteLength;
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError("'offset' is out of bounds");
  }
  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError("'length' is out of bounds");
  }
  if (byteOffset === void 0 && length === void 0) {
    array = new Uint8Array(array);
  } else if (length === void 0) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    that = fromArrayLike(that, array);
  }
  return that;
}
function fromObject(that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);
    if (that.length === 0) {
      return that;
    }
    obj.copy(that, 0, 0, len);
    return that;
  }
  if (obj) {
    if (typeof ArrayBuffer !== "undefined" && obj.buffer instanceof ArrayBuffer || "length" in obj) {
      if (typeof obj.length !== "number" || isnan(obj.length)) {
        return createBuffer(that, 0);
      }
      return fromArrayLike(that, obj);
    }
    if (obj.type === "Buffer" && isArray(obj.data)) {
      return fromArrayLike(that, obj.data);
    }
  }
  throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
}
function checked(length) {
  if (length >= kMaxLength()) {
    throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + kMaxLength().toString(16) + " bytes");
  }
  return length | 0;
}
Buffer.isBuffer = isBuffer;
function internalIsBuffer(b) {
  return !!(b != null && b._isBuffer);
}
Buffer.compare = function compare(a2, b) {
  if (!internalIsBuffer(a2) || !internalIsBuffer(b)) {
    throw new TypeError("Arguments must be Buffers");
  }
  if (a2 === b)
    return 0;
  var x = a2.length;
  var y = b.length;
  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a2[i] !== b[i]) {
      x = a2[i];
      y = b[i];
      break;
    }
  }
  if (x < y)
    return -1;
  if (y < x)
    return 1;
  return 0;
};
Buffer.isEncoding = function isEncoding(encoding) {
  switch (String(encoding).toLowerCase()) {
    case "hex":
    case "utf8":
    case "utf-8":
    case "ascii":
    case "latin1":
    case "binary":
    case "base64":
    case "ucs2":
    case "ucs-2":
    case "utf16le":
    case "utf-16le":
      return true;
    default:
      return false;
  }
};
Buffer.concat = function concat(list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }
  if (list.length === 0) {
    return Buffer.alloc(0);
  }
  var i;
  if (length === void 0) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }
  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};
function byteLength(string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length;
  }
  if (typeof ArrayBuffer !== "undefined" && typeof ArrayBuffer.isView === "function" && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength;
  }
  if (typeof string !== "string") {
    string = "" + string;
  }
  var len = string.length;
  if (len === 0)
    return 0;
  var loweredCase = false;
  for (; ; ) {
    switch (encoding) {
      case "ascii":
      case "latin1":
      case "binary":
        return len;
      case "utf8":
      case "utf-8":
      case void 0:
        return utf8ToBytes(string).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return len * 2;
      case "hex":
        return len >>> 1;
      case "base64":
        return base64ToBytes(string).length;
      default:
        if (loweredCase)
          return utf8ToBytes(string).length;
        encoding = ("" + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;
function slowToString(encoding, start, end) {
  var loweredCase = false;
  if (start === void 0 || start < 0) {
    start = 0;
  }
  if (start > this.length) {
    return "";
  }
  if (end === void 0 || end > this.length) {
    end = this.length;
  }
  if (end <= 0) {
    return "";
  }
  end >>>= 0;
  start >>>= 0;
  if (end <= start) {
    return "";
  }
  if (!encoding)
    encoding = "utf8";
  while (true) {
    switch (encoding) {
      case "hex":
        return hexSlice(this, start, end);
      case "utf8":
      case "utf-8":
        return utf8Slice(this, start, end);
      case "ascii":
        return asciiSlice(this, start, end);
      case "latin1":
      case "binary":
        return latin1Slice(this, start, end);
      case "base64":
        return base64Slice(this, start, end);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return utf16leSlice(this, start, end);
      default:
        if (loweredCase)
          throw new TypeError("Unknown encoding: " + encoding);
        encoding = (encoding + "").toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.prototype._isBuffer = true;
function swap(b, n2, m) {
  var i = b[n2];
  b[n2] = b[m];
  b[m] = i;
}
Buffer.prototype.swap16 = function swap16() {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError("Buffer size must be a multiple of 16-bits");
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this;
};
Buffer.prototype.swap32 = function swap32() {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError("Buffer size must be a multiple of 32-bits");
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this;
};
Buffer.prototype.swap64 = function swap64() {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError("Buffer size must be a multiple of 64-bits");
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this;
};
Buffer.prototype.toString = function toString2() {
  var length = this.length | 0;
  if (length === 0)
    return "";
  if (arguments.length === 0)
    return utf8Slice(this, 0, length);
  return slowToString.apply(this, arguments);
};
Buffer.prototype.equals = function equals(b) {
  if (!internalIsBuffer(b))
    throw new TypeError("Argument must be a Buffer");
  if (this === b)
    return true;
  return Buffer.compare(this, b) === 0;
};
Buffer.prototype.inspect = function inspect() {
  var str = "";
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString("hex", 0, max).match(/.{2}/g).join(" ");
    if (this.length > max)
      str += " ... ";
  }
  return "<Buffer " + str + ">";
};
Buffer.prototype.compare = function compare2(target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError("Argument must be a Buffer");
  }
  if (start === void 0) {
    start = 0;
  }
  if (end === void 0) {
    end = target ? target.length : 0;
  }
  if (thisStart === void 0) {
    thisStart = 0;
  }
  if (thisEnd === void 0) {
    thisEnd = this.length;
  }
  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError("out of range index");
  }
  if (thisStart >= thisEnd && start >= end) {
    return 0;
  }
  if (thisStart >= thisEnd) {
    return -1;
  }
  if (start >= end) {
    return 1;
  }
  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;
  if (this === target)
    return 0;
  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);
  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);
  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break;
    }
  }
  if (x < y)
    return -1;
  if (y < x)
    return 1;
  return 0;
};
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  if (buffer.length === 0)
    return -1;
  if (typeof byteOffset === "string") {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 2147483647) {
    byteOffset = 2147483647;
  } else if (byteOffset < -2147483648) {
    byteOffset = -2147483648;
  }
  byteOffset = +byteOffset;
  if (isNaN(byteOffset)) {
    byteOffset = dir ? 0 : buffer.length - 1;
  }
  if (byteOffset < 0)
    byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir)
      return -1;
    else
      byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir)
      byteOffset = 0;
    else
      return -1;
  }
  if (typeof val === "string") {
    val = Buffer.from(val, encoding);
  }
  if (internalIsBuffer(val)) {
    if (val.length === 0) {
      return -1;
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === "number") {
    val = val & 255;
    if (Buffer.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === "function") {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }
  throw new TypeError("val must be string, number or Buffer");
}
function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;
  if (encoding !== void 0) {
    encoding = String(encoding).toLowerCase();
    if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }
  function read$$1(buf, i2) {
    if (indexSize === 1) {
      return buf[i2];
    } else {
      return buf.readUInt16BE(i2 * indexSize);
    }
  }
  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read$$1(arr, i) === read$$1(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1)
          foundIndex = i;
        if (i - foundIndex + 1 === valLength)
          return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1)
          i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength)
      byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read$$1(arr, i + j) !== read$$1(val, j)) {
          found = false;
          break;
        }
      }
      if (found)
        return i;
    }
  }
  return -1;
}
Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1;
};
Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};
Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};
function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }
  var strLen = string.length;
  if (strLen % 2 !== 0)
    throw new TypeError("Invalid hex string");
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed))
      return i;
    buf[offset + i] = parsed;
  }
  return i;
}
function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}
function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}
function latin1Write(buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length);
}
function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}
function ucs2Write(buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}
Buffer.prototype.write = function write$$1(string, offset, length, encoding) {
  if (offset === void 0) {
    encoding = "utf8";
    length = this.length;
    offset = 0;
  } else if (length === void 0 && typeof offset === "string") {
    encoding = offset;
    length = this.length;
    offset = 0;
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === void 0)
        encoding = "utf8";
    } else {
      encoding = length;
      length = void 0;
    }
  } else {
    throw new Error(
      "Buffer.write(string, encoding, offset[, length]) is no longer supported"
    );
  }
  var remaining = this.length - offset;
  if (length === void 0 || length > remaining)
    length = remaining;
  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
    throw new RangeError("Attempt to write outside buffer bounds");
  }
  if (!encoding)
    encoding = "utf8";
  var loweredCase = false;
  for (; ; ) {
    switch (encoding) {
      case "hex":
        return hexWrite(this, string, offset, length);
      case "utf8":
      case "utf-8":
        return utf8Write(this, string, offset, length);
      case "ascii":
        return asciiWrite(this, string, offset, length);
      case "latin1":
      case "binary":
        return latin1Write(this, string, offset, length);
      case "base64":
        return base64Write(this, string, offset, length);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return ucs2Write(this, string, offset, length);
      default:
        if (loweredCase)
          throw new TypeError("Unknown encoding: " + encoding);
        encoding = ("" + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};
Buffer.prototype.toJSON = function toJSON() {
  return {
    type: "Buffer",
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};
function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf);
  } else {
    return fromByteArray(buf.slice(start, end));
  }
}
function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];
  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;
      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 128) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 192) === 128) {
            tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
            if (tempCodePoint > 127) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
            if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
            if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
              codePoint = tempCodePoint;
            }
          }
      }
    }
    if (codePoint === null) {
      codePoint = 65533;
      bytesPerSequence = 1;
    } else if (codePoint > 65535) {
      codePoint -= 65536;
      res.push(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    res.push(codePoint);
    i += bytesPerSequence;
  }
  return decodeCodePointsArray(res);
}
var MAX_ARGUMENTS_LENGTH = 4096;
function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints);
  }
  var res = "";
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res;
}
function asciiSlice(buf, start, end) {
  var ret = "";
  end = Math.min(buf.length, end);
  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 127);
  }
  return ret;
}
function latin1Slice(buf, start, end) {
  var ret = "";
  end = Math.min(buf.length, end);
  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret;
}
function hexSlice(buf, start, end) {
  var len = buf.length;
  if (!start || start < 0)
    start = 0;
  if (!end || end < 0 || end > len)
    end = len;
  var out = "";
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out;
}
function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = "";
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res;
}
Buffer.prototype.slice = function slice(start, end) {
  var len = this.length;
  start = ~~start;
  end = end === void 0 ? len : ~~end;
  if (start < 0) {
    start += len;
    if (start < 0)
      start = 0;
  } else if (start > len) {
    start = len;
  }
  if (end < 0) {
    end += len;
    if (end < 0)
      end = 0;
  } else if (end > len) {
    end = len;
  }
  if (end < start)
    end = start;
  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, void 0);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }
  return newBuf;
};
function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0)
    throw new RangeError("offset is not uint");
  if (offset + ext > length)
    throw new RangeError("Trying to access beyond buffer length");
}
Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
  offset = offset | 0;
  byteLength2 = byteLength2 | 0;
  if (!noAssert)
    checkOffset(offset, byteLength2, this.length);
  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength2 && (mul *= 256)) {
    val += this[offset + i] * mul;
  }
  return val;
};
Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
  offset = offset | 0;
  byteLength2 = byteLength2 | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength2, this.length);
  }
  var val = this[offset + --byteLength2];
  var mul = 1;
  while (byteLength2 > 0 && (mul *= 256)) {
    val += this[offset + --byteLength2] * mul;
  }
  return val;
};
Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 1, this.length);
  return this[offset];
};
Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length);
  return this[offset] | this[offset + 1] << 8;
};
Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length);
  return this[offset] << 8 | this[offset + 1];
};
Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length);
  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
};
Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length);
  return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};
Buffer.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
  offset = offset | 0;
  byteLength2 = byteLength2 | 0;
  if (!noAssert)
    checkOffset(offset, byteLength2, this.length);
  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength2 && (mul *= 256)) {
    val += this[offset + i] * mul;
  }
  mul *= 128;
  if (val >= mul)
    val -= Math.pow(2, 8 * byteLength2);
  return val;
};
Buffer.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
  offset = offset | 0;
  byteLength2 = byteLength2 | 0;
  if (!noAssert)
    checkOffset(offset, byteLength2, this.length);
  var i = byteLength2;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 256)) {
    val += this[offset + --i] * mul;
  }
  mul *= 128;
  if (val >= mul)
    val -= Math.pow(2, 8 * byteLength2);
  return val;
};
Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 1, this.length);
  if (!(this[offset] & 128))
    return this[offset];
  return (255 - this[offset] + 1) * -1;
};
Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length);
  var val = this[offset] | this[offset + 1] << 8;
  return val & 32768 ? val | 4294901760 : val;
};
Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | this[offset] << 8;
  return val & 32768 ? val | 4294901760 : val;
};
Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length);
  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};
Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length);
  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};
Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4);
};
Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4);
};
Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8);
};
Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8);
};
function checkInt(buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf))
    throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min)
    throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length)
    throw new RangeError("Index out of range");
}
Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength2 = byteLength2 | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
    checkInt(this, value, offset, byteLength2, maxBytes, 0);
  }
  var mul = 1;
  var i = 0;
  this[offset] = value & 255;
  while (++i < byteLength2 && (mul *= 256)) {
    this[offset + i] = value / mul & 255;
  }
  return offset + byteLength2;
};
Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength2 = byteLength2 | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
    checkInt(this, value, offset, byteLength2, maxBytes, 0);
  }
  var i = byteLength2 - 1;
  var mul = 1;
  this[offset + i] = value & 255;
  while (--i >= 0 && (mul *= 256)) {
    this[offset + i] = value / mul & 255;
  }
  return offset + byteLength2;
};
Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert)
    checkInt(this, value, offset, 1, 255, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT)
    value = Math.floor(value);
  this[offset] = value & 255;
  return offset + 1;
};
function objectWriteUInt16(buf, value, offset, littleEndian) {
  if (value < 0)
    value = 65535 + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & 255 << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
  }
}
Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert)
    checkInt(this, value, offset, 2, 65535, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
};
Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert)
    checkInt(this, value, offset, 2, 65535, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
};
function objectWriteUInt32(buf, value, offset, littleEndian) {
  if (value < 0)
    value = 4294967295 + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 255;
  }
}
Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert)
    checkInt(this, value, offset, 4, 4294967295, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 255;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
};
Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert)
    checkInt(this, value, offset, 4, 4294967295, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
};
Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength2 - 1);
    checkInt(this, value, offset, byteLength2, limit - 1, -limit);
  }
  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 255;
  while (++i < byteLength2 && (mul *= 256)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 255;
  }
  return offset + byteLength2;
};
Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength2 - 1);
    checkInt(this, value, offset, byteLength2, limit - 1, -limit);
  }
  var i = byteLength2 - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 255;
  while (--i >= 0 && (mul *= 256)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 255;
  }
  return offset + byteLength2;
};
Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert)
    checkInt(this, value, offset, 1, 127, -128);
  if (!Buffer.TYPED_ARRAY_SUPPORT)
    value = Math.floor(value);
  if (value < 0)
    value = 255 + value + 1;
  this[offset] = value & 255;
  return offset + 1;
};
Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert)
    checkInt(this, value, offset, 2, 32767, -32768);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
};
Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert)
    checkInt(this, value, offset, 2, 32767, -32768);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
};
Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert)
    checkInt(this, value, offset, 4, 2147483647, -2147483648);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
};
Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert)
    checkInt(this, value, offset, 4, 2147483647, -2147483648);
  if (value < 0)
    value = 4294967295 + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
};
function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length)
    throw new RangeError("Index out of range");
  if (offset < 0)
    throw new RangeError("Index out of range");
}
function writeFloat(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}
Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert);
};
Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert);
};
function writeDouble(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}
Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert);
};
Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert);
};
Buffer.prototype.copy = function copy(target, targetStart, start, end) {
  if (!start)
    start = 0;
  if (!end && end !== 0)
    end = this.length;
  if (targetStart >= target.length)
    targetStart = target.length;
  if (!targetStart)
    targetStart = 0;
  if (end > 0 && end < start)
    end = start;
  if (end === start)
    return 0;
  if (target.length === 0 || this.length === 0)
    return 0;
  if (targetStart < 0) {
    throw new RangeError("targetStart out of bounds");
  }
  if (start < 0 || start >= this.length)
    throw new RangeError("sourceStart out of bounds");
  if (end < 0)
    throw new RangeError("sourceEnd out of bounds");
  if (end > this.length)
    end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }
  var len = end - start;
  var i;
  if (this === target && start < targetStart && targetStart < end) {
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1e3 || !Buffer.TYPED_ARRAY_SUPPORT) {
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }
  return len;
};
Buffer.prototype.fill = function fill(val, start, end, encoding) {
  if (typeof val === "string") {
    if (typeof start === "string") {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === "string") {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== void 0 && typeof encoding !== "string") {
      throw new TypeError("encoding must be a string");
    }
    if (typeof encoding === "string" && !Buffer.isEncoding(encoding)) {
      throw new TypeError("Unknown encoding: " + encoding);
    }
  } else if (typeof val === "number") {
    val = val & 255;
  }
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError("Out of range index");
  }
  if (end <= start) {
    return this;
  }
  start = start >>> 0;
  end = end === void 0 ? this.length : end >>> 0;
  if (!val)
    val = 0;
  var i;
  if (typeof val === "number") {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }
  return this;
};
var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
function base64clean(str) {
  str = stringtrim(str).replace(INVALID_BASE64_RE, "");
  if (str.length < 2)
    return "";
  while (str.length % 4 !== 0) {
    str = str + "=";
  }
  return str;
}
function stringtrim(str) {
  if (str.trim)
    return str.trim();
  return str.replace(/^\s+|\s+$/g, "");
}
function toHex(n2) {
  if (n2 < 16)
    return "0" + n2.toString(16);
  return n2.toString(16);
}
function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];
  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);
    if (codePoint > 55295 && codePoint < 57344) {
      if (!leadSurrogate) {
        if (codePoint > 56319) {
          if ((units -= 3) > -1)
            bytes.push(239, 191, 189);
          continue;
        } else if (i + 1 === length) {
          if ((units -= 3) > -1)
            bytes.push(239, 191, 189);
          continue;
        }
        leadSurrogate = codePoint;
        continue;
      }
      if (codePoint < 56320) {
        if ((units -= 3) > -1)
          bytes.push(239, 191, 189);
        leadSurrogate = codePoint;
        continue;
      }
      codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
    } else if (leadSurrogate) {
      if ((units -= 3) > -1)
        bytes.push(239, 191, 189);
    }
    leadSurrogate = null;
    if (codePoint < 128) {
      if ((units -= 1) < 0)
        break;
      bytes.push(codePoint);
    } else if (codePoint < 2048) {
      if ((units -= 2) < 0)
        break;
      bytes.push(
        codePoint >> 6 | 192,
        codePoint & 63 | 128
      );
    } else if (codePoint < 65536) {
      if ((units -= 3) < 0)
        break;
      bytes.push(
        codePoint >> 12 | 224,
        codePoint >> 6 & 63 | 128,
        codePoint & 63 | 128
      );
    } else if (codePoint < 1114112) {
      if ((units -= 4) < 0)
        break;
      bytes.push(
        codePoint >> 18 | 240,
        codePoint >> 12 & 63 | 128,
        codePoint >> 6 & 63 | 128,
        codePoint & 63 | 128
      );
    } else {
      throw new Error("Invalid code point");
    }
  }
  return bytes;
}
function asciiToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    byteArray.push(str.charCodeAt(i) & 255);
  }
  return byteArray;
}
function utf16leToBytes(str, units) {
  var c2, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0)
      break;
    c2 = str.charCodeAt(i);
    hi = c2 >> 8;
    lo = c2 % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }
  return byteArray;
}
function base64ToBytes(str) {
  return toByteArray(base64clean(str));
}
function blitBuffer(src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length)
      break;
    dst[i + offset] = src[i];
  }
  return i;
}
function isnan(val) {
  return val !== val;
}
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj));
}
function isFastBuffer(obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
}
function isSlowBuffer(obj) {
  return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isFastBuffer(obj.slice(0, 0));
}
function defaultSetTimout() {
  throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
  throw new Error("clearTimeout has not been defined");
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === "function") {
  cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === "function") {
  cachedClearTimeout = clearTimeout;
}
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    return setTimeout(fun, 0);
  }
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }
  try {
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e2) {
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    return clearTimeout(marker);
  }
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }
  try {
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      return cachedClearTimeout.call(null, marker);
    } catch (e2) {
      return cachedClearTimeout.call(this, marker);
    }
  }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }
  draining = false;
  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }
  if (queue.length) {
    drainQueue();
  }
}
function drainQueue() {
  if (draining) {
    return;
  }
  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;
  while (len) {
    currentQueue = queue;
    queue = [];
    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }
    queueIndex = -1;
    len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}
function nextTick(fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }
  queue.push(new Item(fun, args));
  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}
function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
Item.prototype.run = function() {
  this.fun.apply(null, this.array);
};
var title = "browser";
var platform = "browser";
var browser = true;
var env = {};
var argv = [];
var version = "";
var versions = {};
var release = {};
var config = {};
function noop() {
}
var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;
function binding(name) {
  throw new Error("process.binding is not supported");
}
function cwd() {
  return "/";
}
function chdir(dir) {
  throw new Error("process.chdir is not supported");
}
function umask() {
  return 0;
}
var performance = global$1.performance || {};
var performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function() {
  return (/* @__PURE__ */ new Date()).getTime();
};
function hrtime(previousTimestamp) {
  var clocktime = performanceNow.call(performance) * 1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor(clocktime % 1 * 1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds < 0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds, nanoseconds];
}
var startTime = /* @__PURE__ */ new Date();
function uptime() {
  var currentTime = /* @__PURE__ */ new Date();
  var dif = currentTime - startTime;
  return dif / 1e3;
}
var process = {
  nextTick,
  title,
  browser,
  env,
  argv,
  version,
  versions,
  on,
  addListener,
  once,
  off,
  removeListener,
  removeAllListeners,
  emit,
  binding,
  cwd,
  chdir,
  umask,
  hrtime,
  platform,
  release,
  config,
  uptime
};
var commonjsGlobal = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function commonjsRequire() {
  throw new Error("Dynamic requires are not currently supported by rollup-plugin-commonjs");
}
function unwrapExports(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x.default : x;
}
function createCommonjsModule(fn, module) {
  return module = { exports: {} }, fn(module, module.exports), module.exports;
}
function getCjsExportFromNamespace(n2) {
  return n2 && n2.default || n2;
}
var require$$5 = {};
var _empty_module = {};
var _empty_module$1 = Object.freeze({
  default: _empty_module
});
var maxInt = 2147483647;
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128;
var delimiter = "-";
var regexNonASCII = /[^\0-\x7E]/;
var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
var errors = {
  "overflow": "Overflow: input needs wider integers to process",
  "not-basic": "Illegal input >= 0x80 (not a basic code point)",
  "invalid-input": "Invalid input"
};
var baseMinusTMin = base - tMin;
var floor = Math.floor;
var stringFromCharCode = String.fromCharCode;
function error(type) {
  throw new RangeError(errors[type]);
}
function map(array, fn) {
  const result = [];
  let length = array.length;
  while (length--) {
    result[length] = fn(array[length]);
  }
  return result;
}
function mapDomain(string, fn) {
  const parts = string.split("@");
  let result = "";
  if (parts.length > 1) {
    result = parts[0] + "@";
    string = parts[1];
  }
  string = string.replace(regexSeparators, ".");
  const labels = string.split(".");
  const encoded = map(labels, fn).join(".");
  return result + encoded;
}
function ucs2decode(string) {
  const output = [];
  let counter = 0;
  const length = string.length;
  while (counter < length) {
    const value = string.charCodeAt(counter++);
    if (value >= 55296 && value <= 56319 && counter < length) {
      const extra = string.charCodeAt(counter++);
      if ((extra & 64512) == 56320) {
        output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
      } else {
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
}
var digitToBasic = function(digit, flag) {
  return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
};
var adapt = function(delta, numPoints, firstTime) {
  let k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor(delta / baseMinusTMin);
  }
  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};
var encode = function(input) {
  const output = [];
  input = ucs2decode(input);
  let inputLength = input.length;
  let n2 = initialN;
  let delta = 0;
  let bias = initialBias;
  let basicLength = output.length;
  let handledCPCount = basicLength;
  if (basicLength) {
    output.push(delimiter);
  }
  while (handledCPCount < inputLength) {
    let m = maxInt;
    for (const currentValue of input) {
      if (currentValue >= n2 && currentValue < m) {
        m = currentValue;
      }
    }
    const handledCPCountPlusOne = handledCPCount + 1;
    if (m - n2 > floor((maxInt - delta) / handledCPCountPlusOne)) {
      error("overflow");
    }
    delta += (m - n2) * handledCPCountPlusOne;
    n2 = m;
    for (const currentValue of input) {
      if (currentValue < n2 && ++delta > maxInt) {
        error("overflow");
      }
      if (currentValue == n2) {
        let q = delta;
        for (let k = base; ; k += base) {
          const t2 = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
          if (q < t2) {
            break;
          }
          const qMinusT = q - t2;
          const baseMinusT = base - t2;
          output.push(
            stringFromCharCode(digitToBasic(t2 + qMinusT % baseMinusT, 0))
          );
          q = floor(qMinusT / baseMinusT);
        }
        output.push(stringFromCharCode(digitToBasic(q, 0)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }
    ++delta;
    ++n2;
  }
  return output.join("");
};
var toASCII = function(input) {
  return mapDomain(input, function(string) {
    return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
  });
};
function isNull(arg) {
  return arg === null;
}
function isNullOrUndefined(arg) {
  return arg == null;
}
function isString(arg) {
  return typeof arg === "string";
}
function isObject(arg) {
  return typeof arg === "object" && arg !== null;
}
function hasOwnProperty$1(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
var isArray$2 = Array.isArray || function(xs) {
  return Object.prototype.toString.call(xs) === "[object Array]";
};
function stringifyPrimitive(v) {
  switch (typeof v) {
    case "string":
      return v;
    case "boolean":
      return v ? "true" : "false";
    case "number":
      return isFinite(v) ? v : "";
    default:
      return "";
  }
}
function stringify(obj, sep, eq, name) {
  sep = sep || "&";
  eq = eq || "=";
  if (obj === null) {
    obj = void 0;
  }
  if (typeof obj === "object") {
    return map$1(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray$2(obj[k])) {
        return map$1(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);
  }
  if (!name)
    return "";
  return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
}
function map$1(xs, f) {
  if (xs.map)
    return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}
var objectKeys = Object.keys || function(obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key))
      res.push(key);
  }
  return res;
};
function parse(qs, sep, eq, options) {
  sep = sep || "&";
  eq = eq || "=";
  var obj = {};
  if (typeof qs !== "string" || qs.length === 0) {
    return obj;
  }
  var regexp = /\+/g;
  qs = qs.split(sep);
  var maxKeys = 1e3;
  if (options && typeof options.maxKeys === "number") {
    maxKeys = options.maxKeys;
  }
  var len = qs.length;
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }
  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, "%20"), idx = x.indexOf(eq), kstr, vstr, k, v;
    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = "";
    }
    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);
    if (!hasOwnProperty$1(obj, k)) {
      obj[k] = v;
    } else if (isArray$2(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }
  return obj;
}
var require$$6 = {
  parse: urlParse,
  resolve: urlResolve,
  resolveObject: urlResolveObject,
  format: urlFormat,
  Url
};
function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}
var protocolPattern = /^([a-z0-9.+-]+:)/i;
var portPattern = /:[0-9]*$/;
var simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/;
var delims = ["<", ">", '"', "`", " ", "\r", "\n", "	"];
var unwise = ["{", "}", "|", "\\", "^", "`"].concat(delims);
var autoEscape = ["'"].concat(unwise);
var nonHostChars = ["%", "/", "?", ";", "#"].concat(autoEscape);
var hostEndingChars = ["/", "?", "#"];
var hostnameMaxLen = 255;
var hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
var hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
var unsafeProtocol = {
  "javascript": true,
  "javascript:": true
};
var hostlessProtocol = {
  "javascript": true,
  "javascript:": true
};
var slashedProtocol = {
  "http": true,
  "https": true,
  "ftp": true,
  "gopher": true,
  "file": true,
  "http:": true,
  "https:": true,
  "ftp:": true,
  "gopher:": true,
  "file:": true
};
function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && isObject(url) && url instanceof Url)
    return url;
  var u = new Url();
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}
Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  return parse$1(this, url, parseQueryString, slashesDenoteHost);
};
function parse$1(self2, url, parseQueryString, slashesDenoteHost) {
  if (!isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }
  var queryIndex = url.indexOf("?"), splitter = queryIndex !== -1 && queryIndex < url.indexOf("#") ? "?" : "#", uSplit = url.split(splitter), slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, "/");
  url = uSplit.join(splitter);
  var rest = url;
  rest = rest.trim();
  if (!slashesDenoteHost && url.split("#").length === 1) {
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      self2.path = rest;
      self2.href = rest;
      self2.pathname = simplePath[1];
      if (simplePath[2]) {
        self2.search = simplePath[2];
        if (parseQueryString) {
          self2.query = parse(self2.search.substr(1));
        } else {
          self2.query = self2.search.substr(1);
        }
      } else if (parseQueryString) {
        self2.search = "";
        self2.query = {};
      }
      return self2;
    }
  }
  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    self2.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === "//";
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      self2.slashes = true;
    }
  }
  var i, hec, l2, p;
  if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
    var hostEnd = -1;
    for (i = 0; i < hostEndingChars.length; i++) {
      hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    var auth, atSign;
    if (hostEnd === -1) {
      atSign = rest.lastIndexOf("@");
    } else {
      atSign = rest.lastIndexOf("@", hostEnd);
    }
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      self2.auth = decodeURIComponent(auth);
    }
    hostEnd = -1;
    for (i = 0; i < nonHostChars.length; i++) {
      hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    if (hostEnd === -1)
      hostEnd = rest.length;
    self2.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);
    parseHost(self2);
    self2.hostname = self2.hostname || "";
    var ipv6Hostname = self2.hostname[0] === "[" && self2.hostname[self2.hostname.length - 1] === "]";
    if (!ipv6Hostname) {
      var hostparts = self2.hostname.split(/\./);
      for (i = 0, l2 = hostparts.length; i < l2; i++) {
        var part = hostparts[i];
        if (!part)
          continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = "";
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              newpart += "x";
            } else {
              newpart += part[j];
            }
          }
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = "/" + notHost.join(".") + rest;
            }
            self2.hostname = validParts.join(".");
            break;
          }
        }
      }
    }
    if (self2.hostname.length > hostnameMaxLen) {
      self2.hostname = "";
    } else {
      self2.hostname = self2.hostname.toLowerCase();
    }
    if (!ipv6Hostname) {
      self2.hostname = toASCII(self2.hostname);
    }
    p = self2.port ? ":" + self2.port : "";
    var h = self2.hostname || "";
    self2.host = h + p;
    self2.href += self2.host;
    if (ipv6Hostname) {
      self2.hostname = self2.hostname.substr(1, self2.hostname.length - 2);
      if (rest[0] !== "/") {
        rest = "/" + rest;
      }
    }
  }
  if (!unsafeProtocol[lowerProto]) {
    for (i = 0, l2 = autoEscape.length; i < l2; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }
  var hash = rest.indexOf("#");
  if (hash !== -1) {
    self2.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf("?");
  if (qm !== -1) {
    self2.search = rest.substr(qm);
    self2.query = rest.substr(qm + 1);
    if (parseQueryString) {
      self2.query = parse(self2.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    self2.search = "";
    self2.query = {};
  }
  if (rest)
    self2.pathname = rest;
  if (slashedProtocol[lowerProto] && self2.hostname && !self2.pathname) {
    self2.pathname = "/";
  }
  if (self2.pathname || self2.search) {
    p = self2.pathname || "";
    var s = self2.search || "";
    self2.path = p + s;
  }
  self2.href = format$1(self2);
  return self2;
}
function urlFormat(obj) {
  if (isString(obj))
    obj = parse$1({}, obj);
  return format$1(obj);
}
function format$1(self2) {
  var auth = self2.auth || "";
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ":");
    auth += "@";
  }
  var protocol = self2.protocol || "", pathname = self2.pathname || "", hash = self2.hash || "", host = false, query = "";
  if (self2.host) {
    host = auth + self2.host;
  } else if (self2.hostname) {
    host = auth + (self2.hostname.indexOf(":") === -1 ? self2.hostname : "[" + this.hostname + "]");
    if (self2.port) {
      host += ":" + self2.port;
    }
  }
  if (self2.query && isObject(self2.query) && Object.keys(self2.query).length) {
    query = stringify(self2.query);
  }
  var search = self2.search || query && "?" + query || "";
  if (protocol && protocol.substr(-1) !== ":")
    protocol += ":";
  if (self2.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = "//" + (host || "");
    if (pathname && pathname.charAt(0) !== "/")
      pathname = "/" + pathname;
  } else if (!host) {
    host = "";
  }
  if (hash && hash.charAt(0) !== "#")
    hash = "#" + hash;
  if (search && search.charAt(0) !== "?")
    search = "?" + search;
  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace("#", "%23");
  return protocol + host + pathname + search + hash;
}
Url.prototype.format = function() {
  return format$1(this);
};
function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}
Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};
function urlResolveObject(source, relative) {
  if (!source)
    return relative;
  return urlParse(source, false, true).resolveObject(relative);
}
Url.prototype.resolveObject = function(relative) {
  if (isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }
  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }
  result.hash = relative.hash;
  if (relative.href === "") {
    result.href = result.format();
    return result;
  }
  if (relative.slashes && !relative.protocol) {
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== "protocol")
        result[rkey] = relative[rkey];
    }
    if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
      result.path = result.pathname = "/";
    }
    result.href = result.format();
    return result;
  }
  var relPath;
  if (relative.protocol && relative.protocol !== result.protocol) {
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }
    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      relPath = (relative.pathname || "").split("/");
      while (relPath.length && !(relative.host = relPath.shift()))
        ;
      if (!relative.host)
        relative.host = "";
      if (!relative.hostname)
        relative.hostname = "";
      if (relPath[0] !== "")
        relPath.unshift("");
      if (relPath.length < 2)
        relPath.unshift("");
      result.pathname = relPath.join("/");
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || "";
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    if (result.pathname || result.search) {
      var p = result.pathname || "";
      var s = result.search || "";
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }
  var isSourceAbs = result.pathname && result.pathname.charAt(0) === "/", isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === "/", mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname, removeAllDots = mustEndAbs, srcPath = result.pathname && result.pathname.split("/") || [], psychotic = result.protocol && !slashedProtocol[result.protocol];
  relPath = relative.pathname && relative.pathname.split("/") || [];
  if (psychotic) {
    result.hostname = "";
    result.port = null;
    if (result.host) {
      if (srcPath[0] === "")
        srcPath[0] = result.host;
      else
        srcPath.unshift(result.host);
    }
    result.host = "";
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === "")
          relPath[0] = relative.host;
        else
          relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === "" || srcPath[0] === "");
  }
  var authInHost;
  if (isRelAbs) {
    result.host = relative.host || relative.host === "" ? relative.host : result.host;
    result.hostname = relative.hostname || relative.hostname === "" ? relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
  } else if (relPath.length) {
    if (!srcPath)
      srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!isNullOrUndefined(relative.search)) {
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    if (!isNull(result.pathname) || !isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
    }
    result.href = result.format();
    return result;
  }
  if (!srcPath.length) {
    result.pathname = null;
    if (result.search) {
      result.path = "/" + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === "." || last === "..") || last === "";
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === ".") {
      srcPath.splice(i, 1);
    } else if (last === "..") {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift("..");
    }
  }
  if (mustEndAbs && srcPath[0] !== "" && (!srcPath[0] || srcPath[0].charAt(0) !== "/")) {
    srcPath.unshift("");
  }
  if (hasTrailingSlash && srcPath.join("/").substr(-1) !== "/") {
    srcPath.push("");
  }
  var isAbsolute = srcPath[0] === "" || srcPath[0] && srcPath[0].charAt(0) === "/";
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? "" : srcPath.length ? srcPath.shift() : "";
    authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }
  mustEndAbs = mustEndAbs || result.host && srcPath.length;
  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift("");
  }
  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join("/");
  }
  if (!isNull(result.pathname) || !isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};
Url.prototype.parseHost = function() {
  return parseHost(this);
};
function parseHost(self2) {
  var host = self2.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ":") {
      self2.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host)
    self2.hostname = host;
}
var require$$1 = getCjsExportFromNamespace(_empty_module$1);
var pdf = createCommonjsModule(function(module, exports) {
  (function webpackUniversalModuleDefinition(root, factory) {
    module.exports = factory();
  })(commonjsGlobal, function() {
    return (
      /******/
      function(modules) {
        var installedModules = {};
        function __w_pdfjs_require__(moduleId) {
          if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
          }
          var module2 = installedModules[moduleId] = {
            /******/
            i: moduleId,
            /******/
            l: false,
            /******/
            exports: {}
            /******/
          };
          modules[moduleId].call(module2.exports, module2, module2.exports, __w_pdfjs_require__);
          module2.l = true;
          return module2.exports;
        }
        __w_pdfjs_require__.m = modules;
        __w_pdfjs_require__.c = installedModules;
        __w_pdfjs_require__.d = function(exports2, name, getter) {
          if (!__w_pdfjs_require__.o(exports2, name)) {
            Object.defineProperty(exports2, name, { enumerable: true, get: getter });
          }
        };
        __w_pdfjs_require__.r = function(exports2) {
          if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
            Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
          }
          Object.defineProperty(exports2, "__esModule", { value: true });
        };
        __w_pdfjs_require__.t = function(value, mode) {
          if (mode & 1)
            value = __w_pdfjs_require__(value);
          if (mode & 8)
            return value;
          if (mode & 4 && typeof value === "object" && value && value.__esModule)
            return value;
          var ns = /* @__PURE__ */ Object.create(null);
          __w_pdfjs_require__.r(ns);
          Object.defineProperty(ns, "default", { enumerable: true, value });
          if (mode & 2 && typeof value != "string")
            for (var key in value)
              __w_pdfjs_require__.d(ns, key, (function(key2) {
                return value[key2];
              }).bind(null, key));
          return ns;
        };
        __w_pdfjs_require__.n = function(module2) {
          var getter = module2 && module2.__esModule ? (
            /******/
            function getDefault() {
              return module2["default"];
            }
          ) : (
            /******/
            function getModuleExports() {
              return module2;
            }
          );
          __w_pdfjs_require__.d(getter, "a", getter);
          return getter;
        };
        __w_pdfjs_require__.o = function(object, property) {
          return Object.prototype.hasOwnProperty.call(object, property);
        };
        __w_pdfjs_require__.p = "";
        return __w_pdfjs_require__(__w_pdfjs_require__.s = 0);
      }([
        /* 0 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var pdfjsSharedUtil = __w_pdfjs_require__(1);
          var pdfjsDisplayAPI = __w_pdfjs_require__(146);
          var pdfjsDisplayTextLayer = __w_pdfjs_require__(162);
          var pdfjsDisplayAnnotationLayer = __w_pdfjs_require__(163);
          var pdfjsDisplayDOMUtils = __w_pdfjs_require__(151);
          var pdfjsDisplaySVG = __w_pdfjs_require__(164);
          var pdfjsDisplayWorkerOptions = __w_pdfjs_require__(156);
          var pdfjsDisplayAPICompatibility = __w_pdfjs_require__(153);
          {
            var isNodeJS = __w_pdfjs_require__(4);
            if (isNodeJS()) {
              var PDFNodeStream = __w_pdfjs_require__(165).PDFNodeStream;
              pdfjsDisplayAPI.setPDFNetworkStreamFactory(function(params) {
                return new PDFNodeStream(params);
              });
            } else if (typeof Response !== "undefined" && "body" in Response.prototype && typeof ReadableStream !== "undefined") {
              var PDFFetchStream = __w_pdfjs_require__(168).PDFFetchStream;
              pdfjsDisplayAPI.setPDFNetworkStreamFactory(function(params) {
                return new PDFFetchStream(params);
              });
            } else {
              var PDFNetworkStream = __w_pdfjs_require__(169).PDFNetworkStream;
              pdfjsDisplayAPI.setPDFNetworkStreamFactory(function(params) {
                return new PDFNetworkStream(params);
              });
            }
          }
          exports2.build = pdfjsDisplayAPI.build;
          exports2.version = pdfjsDisplayAPI.version;
          exports2.getDocument = pdfjsDisplayAPI.getDocument;
          exports2.LoopbackPort = pdfjsDisplayAPI.LoopbackPort;
          exports2.PDFDataRangeTransport = pdfjsDisplayAPI.PDFDataRangeTransport;
          exports2.PDFWorker = pdfjsDisplayAPI.PDFWorker;
          exports2.renderTextLayer = pdfjsDisplayTextLayer.renderTextLayer;
          exports2.AnnotationLayer = pdfjsDisplayAnnotationLayer.AnnotationLayer;
          exports2.createPromiseCapability = pdfjsSharedUtil.createPromiseCapability;
          exports2.PasswordResponses = pdfjsSharedUtil.PasswordResponses;
          exports2.InvalidPDFException = pdfjsSharedUtil.InvalidPDFException;
          exports2.MissingPDFException = pdfjsSharedUtil.MissingPDFException;
          exports2.SVGGraphics = pdfjsDisplaySVG.SVGGraphics;
          exports2.NativeImageDecoding = pdfjsSharedUtil.NativeImageDecoding;
          exports2.CMapCompressionType = pdfjsSharedUtil.CMapCompressionType;
          exports2.PermissionFlag = pdfjsSharedUtil.PermissionFlag;
          exports2.UnexpectedResponseException = pdfjsSharedUtil.UnexpectedResponseException;
          exports2.OPS = pdfjsSharedUtil.OPS;
          exports2.VerbosityLevel = pdfjsSharedUtil.VerbosityLevel;
          exports2.UNSUPPORTED_FEATURES = pdfjsSharedUtil.UNSUPPORTED_FEATURES;
          exports2.createValidAbsoluteUrl = pdfjsSharedUtil.createValidAbsoluteUrl;
          exports2.createObjectURL = pdfjsSharedUtil.createObjectURL;
          exports2.removeNullCharacters = pdfjsSharedUtil.removeNullCharacters;
          exports2.shadow = pdfjsSharedUtil.shadow;
          exports2.Util = pdfjsSharedUtil.Util;
          exports2.ReadableStream = pdfjsSharedUtil.ReadableStream;
          exports2.URL = pdfjsSharedUtil.URL;
          exports2.RenderingCancelledException = pdfjsDisplayDOMUtils.RenderingCancelledException;
          exports2.getFilenameFromUrl = pdfjsDisplayDOMUtils.getFilenameFromUrl;
          exports2.LinkTarget = pdfjsDisplayDOMUtils.LinkTarget;
          exports2.addLinkAttributes = pdfjsDisplayDOMUtils.addLinkAttributes;
          exports2.loadScript = pdfjsDisplayDOMUtils.loadScript;
          exports2.GlobalWorkerOptions = pdfjsDisplayWorkerOptions.GlobalWorkerOptions;
          exports2.apiCompatibilityParams = pdfjsDisplayAPICompatibility.apiCompatibilityParams;
        },
        /* 1 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.toRomanNumerals = toRomanNumerals;
          exports2.arrayByteLength = arrayByteLength;
          exports2.arraysToBytes = arraysToBytes;
          exports2.assert = assert;
          exports2.bytesToString = bytesToString;
          exports2.createPromiseCapability = createPromiseCapability;
          exports2.deprecated = deprecated;
          exports2.getInheritableProperty = getInheritableProperty;
          exports2.getLookupTableFactory = getLookupTableFactory;
          exports2.getVerbosityLevel = getVerbosityLevel;
          exports2.info = info;
          exports2.isArrayBuffer = isArrayBuffer;
          exports2.isBool = isBool;
          exports2.isEmptyObj = isEmptyObj;
          exports2.isNum = isNum;
          exports2.isString = isString2;
          exports2.isSpace = isSpace;
          exports2.isSameOrigin = isSameOrigin;
          exports2.createValidAbsoluteUrl = createValidAbsoluteUrl;
          exports2.isLittleEndian = isLittleEndian;
          exports2.isEvalSupported = isEvalSupported;
          exports2.log2 = log2;
          exports2.readInt8 = readInt82;
          exports2.readUint16 = readUint16;
          exports2.readUint32 = readUint32;
          exports2.removeNullCharacters = removeNullCharacters;
          exports2.setVerbosityLevel = setVerbosityLevel;
          exports2.shadow = shadow;
          exports2.string32 = string32;
          exports2.stringToBytes = stringToBytes;
          exports2.stringToPDFString = stringToPDFString;
          exports2.stringToUTF8String = stringToUTF8String;
          exports2.utf8StringToString = utf8StringToString;
          exports2.warn = warn;
          exports2.unreachable = unreachable;
          Object.defineProperty(exports2, "ReadableStream", {
            enumerable: true,
            get: function get() {
              return _streams_polyfill.ReadableStream;
            }
          });
          Object.defineProperty(exports2, "URL", {
            enumerable: true,
            get: function get() {
              return _url_polyfill.URL;
            }
          });
          exports2.createObjectURL = exports2.FormatError = exports2.XRefParseException = exports2.XRefEntryException = exports2.Util = exports2.UnknownErrorException = exports2.UnexpectedResponseException = exports2.TextRenderingMode = exports2.StreamType = exports2.PermissionFlag = exports2.PasswordResponses = exports2.PasswordException = exports2.NativeImageDecoding = exports2.MissingPDFException = exports2.MissingDataException = exports2.InvalidPDFException = exports2.AbortException = exports2.CMapCompressionType = exports2.ImageKind = exports2.FontType = exports2.AnnotationType = exports2.AnnotationFlag = exports2.AnnotationFieldFlag = exports2.AnnotationBorderStyleType = exports2.UNSUPPORTED_FEATURES = exports2.VerbosityLevel = exports2.OPS = exports2.IDENTITY_MATRIX = exports2.FONT_IDENTITY_MATRIX = void 0;
          __w_pdfjs_require__(2);
          var _streams_polyfill = __w_pdfjs_require__(142);
          var _url_polyfill = __w_pdfjs_require__(144);
          function _typeof(obj) {
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
              _typeof = function _typeof2(obj2) {
                return typeof obj2;
              };
            } else {
              _typeof = function _typeof2(obj2) {
                return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
              };
            }
            return _typeof(obj);
          }
          var IDENTITY_MATRIX = [1, 0, 0, 1, 0, 0];
          exports2.IDENTITY_MATRIX = IDENTITY_MATRIX;
          var FONT_IDENTITY_MATRIX = [1e-3, 0, 0, 1e-3, 0, 0];
          exports2.FONT_IDENTITY_MATRIX = FONT_IDENTITY_MATRIX;
          var NativeImageDecoding = {
            NONE: "none",
            DECODE: "decode",
            DISPLAY: "display"
          };
          exports2.NativeImageDecoding = NativeImageDecoding;
          var PermissionFlag = {
            PRINT: 4,
            MODIFY_CONTENTS: 8,
            COPY: 16,
            MODIFY_ANNOTATIONS: 32,
            FILL_INTERACTIVE_FORMS: 256,
            COPY_FOR_ACCESSIBILITY: 512,
            ASSEMBLE: 1024,
            PRINT_HIGH_QUALITY: 2048
          };
          exports2.PermissionFlag = PermissionFlag;
          var TextRenderingMode = {
            FILL: 0,
            STROKE: 1,
            FILL_STROKE: 2,
            INVISIBLE: 3,
            FILL_ADD_TO_PATH: 4,
            STROKE_ADD_TO_PATH: 5,
            FILL_STROKE_ADD_TO_PATH: 6,
            ADD_TO_PATH: 7,
            FILL_STROKE_MASK: 3,
            ADD_TO_PATH_FLAG: 4
          };
          exports2.TextRenderingMode = TextRenderingMode;
          var ImageKind = {
            GRAYSCALE_1BPP: 1,
            RGB_24BPP: 2,
            RGBA_32BPP: 3
          };
          exports2.ImageKind = ImageKind;
          var AnnotationType = {
            TEXT: 1,
            LINK: 2,
            FREETEXT: 3,
            LINE: 4,
            SQUARE: 5,
            CIRCLE: 6,
            POLYGON: 7,
            POLYLINE: 8,
            HIGHLIGHT: 9,
            UNDERLINE: 10,
            SQUIGGLY: 11,
            STRIKEOUT: 12,
            STAMP: 13,
            CARET: 14,
            INK: 15,
            POPUP: 16,
            FILEATTACHMENT: 17,
            SOUND: 18,
            MOVIE: 19,
            WIDGET: 20,
            SCREEN: 21,
            PRINTERMARK: 22,
            TRAPNET: 23,
            WATERMARK: 24,
            THREED: 25,
            REDACT: 26
          };
          exports2.AnnotationType = AnnotationType;
          var AnnotationFlag = {
            INVISIBLE: 1,
            HIDDEN: 2,
            PRINT: 4,
            NOZOOM: 8,
            NOROTATE: 16,
            NOVIEW: 32,
            READONLY: 64,
            LOCKED: 128,
            TOGGLENOVIEW: 256,
            LOCKEDCONTENTS: 512
          };
          exports2.AnnotationFlag = AnnotationFlag;
          var AnnotationFieldFlag = {
            READONLY: 1,
            REQUIRED: 2,
            NOEXPORT: 4,
            MULTILINE: 4096,
            PASSWORD: 8192,
            NOTOGGLETOOFF: 16384,
            RADIO: 32768,
            PUSHBUTTON: 65536,
            COMBO: 131072,
            EDIT: 262144,
            SORT: 524288,
            FILESELECT: 1048576,
            MULTISELECT: 2097152,
            DONOTSPELLCHECK: 4194304,
            DONOTSCROLL: 8388608,
            COMB: 16777216,
            RICHTEXT: 33554432,
            RADIOSINUNISON: 33554432,
            COMMITONSELCHANGE: 67108864
          };
          exports2.AnnotationFieldFlag = AnnotationFieldFlag;
          var AnnotationBorderStyleType = {
            SOLID: 1,
            DASHED: 2,
            BEVELED: 3,
            INSET: 4,
            UNDERLINE: 5
          };
          exports2.AnnotationBorderStyleType = AnnotationBorderStyleType;
          var StreamType = {
            UNKNOWN: 0,
            FLATE: 1,
            LZW: 2,
            DCT: 3,
            JPX: 4,
            JBIG: 5,
            A85: 6,
            AHX: 7,
            CCF: 8,
            RL: 9
          };
          exports2.StreamType = StreamType;
          var FontType = {
            UNKNOWN: 0,
            TYPE1: 1,
            TYPE1C: 2,
            CIDFONTTYPE0: 3,
            CIDFONTTYPE0C: 4,
            TRUETYPE: 5,
            CIDFONTTYPE2: 6,
            TYPE3: 7,
            OPENTYPE: 8,
            TYPE0: 9,
            MMTYPE1: 10
          };
          exports2.FontType = FontType;
          var VerbosityLevel = {
            ERRORS: 0,
            WARNINGS: 1,
            INFOS: 5
          };
          exports2.VerbosityLevel = VerbosityLevel;
          var CMapCompressionType = {
            NONE: 0,
            BINARY: 1,
            STREAM: 2
          };
          exports2.CMapCompressionType = CMapCompressionType;
          var OPS = {
            dependency: 1,
            setLineWidth: 2,
            setLineCap: 3,
            setLineJoin: 4,
            setMiterLimit: 5,
            setDash: 6,
            setRenderingIntent: 7,
            setFlatness: 8,
            setGState: 9,
            save: 10,
            restore: 11,
            transform: 12,
            moveTo: 13,
            lineTo: 14,
            curveTo: 15,
            curveTo2: 16,
            curveTo3: 17,
            closePath: 18,
            rectangle: 19,
            stroke: 20,
            closeStroke: 21,
            fill: 22,
            eoFill: 23,
            fillStroke: 24,
            eoFillStroke: 25,
            closeFillStroke: 26,
            closeEOFillStroke: 27,
            endPath: 28,
            clip: 29,
            eoClip: 30,
            beginText: 31,
            endText: 32,
            setCharSpacing: 33,
            setWordSpacing: 34,
            setHScale: 35,
            setLeading: 36,
            setFont: 37,
            setTextRenderingMode: 38,
            setTextRise: 39,
            moveText: 40,
            setLeadingMoveText: 41,
            setTextMatrix: 42,
            nextLine: 43,
            showText: 44,
            showSpacedText: 45,
            nextLineShowText: 46,
            nextLineSetSpacingShowText: 47,
            setCharWidth: 48,
            setCharWidthAndBounds: 49,
            setStrokeColorSpace: 50,
            setFillColorSpace: 51,
            setStrokeColor: 52,
            setStrokeColorN: 53,
            setFillColor: 54,
            setFillColorN: 55,
            setStrokeGray: 56,
            setFillGray: 57,
            setStrokeRGBColor: 58,
            setFillRGBColor: 59,
            setStrokeCMYKColor: 60,
            setFillCMYKColor: 61,
            shadingFill: 62,
            beginInlineImage: 63,
            beginImageData: 64,
            endInlineImage: 65,
            paintXObject: 66,
            markPoint: 67,
            markPointProps: 68,
            beginMarkedContent: 69,
            beginMarkedContentProps: 70,
            endMarkedContent: 71,
            beginCompat: 72,
            endCompat: 73,
            paintFormXObjectBegin: 74,
            paintFormXObjectEnd: 75,
            beginGroup: 76,
            endGroup: 77,
            beginAnnotations: 78,
            endAnnotations: 79,
            beginAnnotation: 80,
            endAnnotation: 81,
            paintJpegXObject: 82,
            paintImageMaskXObject: 83,
            paintImageMaskXObjectGroup: 84,
            paintImageXObject: 85,
            paintInlineImageXObject: 86,
            paintInlineImageXObjectGroup: 87,
            paintImageXObjectRepeat: 88,
            paintImageMaskXObjectRepeat: 89,
            paintSolidColorImageMask: 90,
            constructPath: 91
          };
          exports2.OPS = OPS;
          var UNSUPPORTED_FEATURES = {
            unknown: "unknown",
            forms: "forms",
            javaScript: "javaScript",
            smask: "smask",
            shadingPattern: "shadingPattern",
            font: "font"
          };
          exports2.UNSUPPORTED_FEATURES = UNSUPPORTED_FEATURES;
          var PasswordResponses = {
            NEED_PASSWORD: 1,
            INCORRECT_PASSWORD: 2
          };
          exports2.PasswordResponses = PasswordResponses;
          var verbosity = VerbosityLevel.WARNINGS;
          function setVerbosityLevel(level) {
            if (Number.isInteger(level)) {
              verbosity = level;
            }
          }
          function getVerbosityLevel() {
            return verbosity;
          }
          function info(msg) {
            if (verbosity >= VerbosityLevel.INFOS) {
              console.log("Info: " + msg);
            }
          }
          function warn(msg) {
            if (verbosity >= VerbosityLevel.WARNINGS) {
              console.log("Warning: " + msg);
            }
          }
          function deprecated(details) {
            console.log("Deprecated API usage: " + details);
          }
          function unreachable(msg) {
            throw new Error(msg);
          }
          function assert(cond, msg) {
            if (!cond) {
              unreachable(msg);
            }
          }
          function isSameOrigin(baseUrl, otherUrl) {
            try {
              var base2 = new _url_polyfill.URL(baseUrl);
              if (!base2.origin || base2.origin === "null") {
                return false;
              }
            } catch (e) {
              return false;
            }
            var other = new _url_polyfill.URL(otherUrl, base2);
            return base2.origin === other.origin;
          }
          function _isValidProtocol(url) {
            if (!url) {
              return false;
            }
            switch (url.protocol) {
              case "http:":
              case "https:":
              case "ftp:":
              case "mailto:":
              case "tel:":
                return true;
              default:
                return false;
            }
          }
          function createValidAbsoluteUrl(url, baseUrl) {
            if (!url) {
              return null;
            }
            try {
              var absoluteUrl = baseUrl ? new _url_polyfill.URL(url, baseUrl) : new _url_polyfill.URL(url);
              if (_isValidProtocol(absoluteUrl)) {
                return absoluteUrl;
              }
            } catch (ex) {
            }
            return null;
          }
          function shadow(obj, prop, value) {
            Object.defineProperty(obj, prop, {
              value,
              enumerable: true,
              configurable: true,
              writable: false
            });
            return value;
          }
          function getLookupTableFactory(initializer) {
            var lookup2;
            return function() {
              if (initializer) {
                lookup2 = /* @__PURE__ */ Object.create(null);
                initializer(lookup2);
                initializer = null;
              }
              return lookup2;
            };
          }
          var PasswordException = function PasswordExceptionClosure() {
            function PasswordException2(msg, code) {
              this.name = "PasswordException";
              this.message = msg;
              this.code = code;
            }
            PasswordException2.prototype = new Error();
            PasswordException2.constructor = PasswordException2;
            return PasswordException2;
          }();
          exports2.PasswordException = PasswordException;
          var UnknownErrorException = function UnknownErrorExceptionClosure() {
            function UnknownErrorException2(msg, details) {
              this.name = "UnknownErrorException";
              this.message = msg;
              this.details = details;
            }
            UnknownErrorException2.prototype = new Error();
            UnknownErrorException2.constructor = UnknownErrorException2;
            return UnknownErrorException2;
          }();
          exports2.UnknownErrorException = UnknownErrorException;
          var InvalidPDFException = function InvalidPDFExceptionClosure() {
            function InvalidPDFException2(msg) {
              this.name = "InvalidPDFException";
              this.message = msg;
            }
            InvalidPDFException2.prototype = new Error();
            InvalidPDFException2.constructor = InvalidPDFException2;
            return InvalidPDFException2;
          }();
          exports2.InvalidPDFException = InvalidPDFException;
          var MissingPDFException = function MissingPDFExceptionClosure() {
            function MissingPDFException2(msg) {
              this.name = "MissingPDFException";
              this.message = msg;
            }
            MissingPDFException2.prototype = new Error();
            MissingPDFException2.constructor = MissingPDFException2;
            return MissingPDFException2;
          }();
          exports2.MissingPDFException = MissingPDFException;
          var UnexpectedResponseException = function UnexpectedResponseExceptionClosure() {
            function UnexpectedResponseException2(msg, status) {
              this.name = "UnexpectedResponseException";
              this.message = msg;
              this.status = status;
            }
            UnexpectedResponseException2.prototype = new Error();
            UnexpectedResponseException2.constructor = UnexpectedResponseException2;
            return UnexpectedResponseException2;
          }();
          exports2.UnexpectedResponseException = UnexpectedResponseException;
          var MissingDataException = function MissingDataExceptionClosure() {
            function MissingDataException2(begin, end) {
              this.begin = begin;
              this.end = end;
              this.message = "Missing data [" + begin + ", " + end + ")";
            }
            MissingDataException2.prototype = new Error();
            MissingDataException2.prototype.name = "MissingDataException";
            MissingDataException2.constructor = MissingDataException2;
            return MissingDataException2;
          }();
          exports2.MissingDataException = MissingDataException;
          var XRefEntryException = function XRefEntryExceptionClosure() {
            function XRefEntryException2(msg) {
              this.message = msg;
            }
            XRefEntryException2.prototype = new Error();
            XRefEntryException2.prototype.name = "XRefEntryException";
            XRefEntryException2.constructor = XRefEntryException2;
            return XRefEntryException2;
          }();
          exports2.XRefEntryException = XRefEntryException;
          var XRefParseException = function XRefParseExceptionClosure() {
            function XRefParseException2(msg) {
              this.message = msg;
            }
            XRefParseException2.prototype = new Error();
            XRefParseException2.prototype.name = "XRefParseException";
            XRefParseException2.constructor = XRefParseException2;
            return XRefParseException2;
          }();
          exports2.XRefParseException = XRefParseException;
          var FormatError = function FormatErrorClosure() {
            function FormatError2(msg) {
              this.message = msg;
            }
            FormatError2.prototype = new Error();
            FormatError2.prototype.name = "FormatError";
            FormatError2.constructor = FormatError2;
            return FormatError2;
          }();
          exports2.FormatError = FormatError;
          var AbortException = function AbortExceptionClosure() {
            function AbortException2(msg) {
              this.name = "AbortException";
              this.message = msg;
            }
            AbortException2.prototype = new Error();
            AbortException2.constructor = AbortException2;
            return AbortException2;
          }();
          exports2.AbortException = AbortException;
          var NullCharactersRegExp = /\x00/g;
          function removeNullCharacters(str) {
            if (typeof str !== "string") {
              warn("The argument for removeNullCharacters must be a string.");
              return str;
            }
            return str.replace(NullCharactersRegExp, "");
          }
          function bytesToString(bytes) {
            assert(bytes !== null && _typeof(bytes) === "object" && bytes.length !== void 0, "Invalid argument for bytesToString");
            var length = bytes.length;
            var MAX_ARGUMENT_COUNT = 8192;
            if (length < MAX_ARGUMENT_COUNT) {
              return String.fromCharCode.apply(null, bytes);
            }
            var strBuf = [];
            for (var i = 0; i < length; i += MAX_ARGUMENT_COUNT) {
              var chunkEnd = Math.min(i + MAX_ARGUMENT_COUNT, length);
              var chunk = bytes.subarray(i, chunkEnd);
              strBuf.push(String.fromCharCode.apply(null, chunk));
            }
            return strBuf.join("");
          }
          function stringToBytes(str) {
            assert(typeof str === "string", "Invalid argument for stringToBytes");
            var length = str.length;
            var bytes = new Uint8Array(length);
            for (var i = 0; i < length; ++i) {
              bytes[i] = str.charCodeAt(i) & 255;
            }
            return bytes;
          }
          function arrayByteLength(arr) {
            if (arr.length !== void 0) {
              return arr.length;
            }
            assert(arr.byteLength !== void 0);
            return arr.byteLength;
          }
          function arraysToBytes(arr) {
            if (arr.length === 1 && arr[0] instanceof Uint8Array) {
              return arr[0];
            }
            var resultLength = 0;
            var i, ii = arr.length;
            var item, itemLength;
            for (i = 0; i < ii; i++) {
              item = arr[i];
              itemLength = arrayByteLength(item);
              resultLength += itemLength;
            }
            var pos = 0;
            var data = new Uint8Array(resultLength);
            for (i = 0; i < ii; i++) {
              item = arr[i];
              if (!(item instanceof Uint8Array)) {
                if (typeof item === "string") {
                  item = stringToBytes(item);
                } else {
                  item = new Uint8Array(item);
                }
              }
              itemLength = item.byteLength;
              data.set(item, pos);
              pos += itemLength;
            }
            return data;
          }
          function string32(value) {
            return String.fromCharCode(value >> 24 & 255, value >> 16 & 255, value >> 8 & 255, value & 255);
          }
          function log2(x) {
            if (x <= 0) {
              return 0;
            }
            return Math.ceil(Math.log2(x));
          }
          function readInt82(data, start) {
            return data[start] << 24 >> 24;
          }
          function readUint16(data, offset) {
            return data[offset] << 8 | data[offset + 1];
          }
          function readUint32(data, offset) {
            return (data[offset] << 24 | data[offset + 1] << 16 | data[offset + 2] << 8 | data[offset + 3]) >>> 0;
          }
          function isLittleEndian() {
            var buffer8 = new Uint8Array(4);
            buffer8[0] = 1;
            var view32 = new Uint32Array(buffer8.buffer, 0, 1);
            return view32[0] === 1;
          }
          function isEvalSupported() {
            try {
              new Function("");
              return true;
            } catch (e) {
              return false;
            }
          }
          function getInheritableProperty(_ref) {
            var dict = _ref.dict, key = _ref.key, _ref$getArray = _ref.getArray, getArray = _ref$getArray === void 0 ? false : _ref$getArray, _ref$stopWhenFound = _ref.stopWhenFound, stopWhenFound = _ref$stopWhenFound === void 0 ? true : _ref$stopWhenFound;
            var LOOP_LIMIT = 100;
            var loopCount = 0;
            var values;
            while (dict) {
              var value = getArray ? dict.getArray(key) : dict.get(key);
              if (value !== void 0) {
                if (stopWhenFound) {
                  return value;
                }
                if (!values) {
                  values = [];
                }
                values.push(value);
              }
              if (++loopCount > LOOP_LIMIT) {
                warn('getInheritableProperty: maximum loop count exceeded for "'.concat(key, '"'));
                break;
              }
              dict = dict.get("Parent");
            }
            return values;
          }
          var Util = function UtilClosure() {
            function Util2() {
            }
            var rgbBuf = ["rgb(", 0, ",", 0, ",", 0, ")"];
            Util2.makeCssRgb = function Util_makeCssRgb(r2, g, b) {
              rgbBuf[1] = r2;
              rgbBuf[3] = g;
              rgbBuf[5] = b;
              return rgbBuf.join("");
            };
            Util2.transform = function Util_transform(m1, m2) {
              return [m1[0] * m2[0] + m1[2] * m2[1], m1[1] * m2[0] + m1[3] * m2[1], m1[0] * m2[2] + m1[2] * m2[3], m1[1] * m2[2] + m1[3] * m2[3], m1[0] * m2[4] + m1[2] * m2[5] + m1[4], m1[1] * m2[4] + m1[3] * m2[5] + m1[5]];
            };
            Util2.applyTransform = function Util_applyTransform(p, m) {
              var xt = p[0] * m[0] + p[1] * m[2] + m[4];
              var yt = p[0] * m[1] + p[1] * m[3] + m[5];
              return [xt, yt];
            };
            Util2.applyInverseTransform = function Util_applyInverseTransform(p, m) {
              var d = m[0] * m[3] - m[1] * m[2];
              var xt = (p[0] * m[3] - p[1] * m[2] + m[2] * m[5] - m[4] * m[3]) / d;
              var yt = (-p[0] * m[1] + p[1] * m[0] + m[4] * m[1] - m[5] * m[0]) / d;
              return [xt, yt];
            };
            Util2.getAxialAlignedBoundingBox = function Util_getAxialAlignedBoundingBox(r2, m) {
              var p1 = Util2.applyTransform(r2, m);
              var p2 = Util2.applyTransform(r2.slice(2, 4), m);
              var p3 = Util2.applyTransform([r2[0], r2[3]], m);
              var p4 = Util2.applyTransform([r2[2], r2[1]], m);
              return [Math.min(p1[0], p2[0], p3[0], p4[0]), Math.min(p1[1], p2[1], p3[1], p4[1]), Math.max(p1[0], p2[0], p3[0], p4[0]), Math.max(p1[1], p2[1], p3[1], p4[1])];
            };
            Util2.inverseTransform = function Util_inverseTransform(m) {
              var d = m[0] * m[3] - m[1] * m[2];
              return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d, (m[2] * m[5] - m[4] * m[3]) / d, (m[4] * m[1] - m[5] * m[0]) / d];
            };
            Util2.apply3dTransform = function Util_apply3dTransform(m, v) {
              return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
            };
            Util2.singularValueDecompose2dScale = function Util_singularValueDecompose2dScale(m) {
              var transpose = [m[0], m[2], m[1], m[3]];
              var a2 = m[0] * transpose[0] + m[1] * transpose[2];
              var b = m[0] * transpose[1] + m[1] * transpose[3];
              var c2 = m[2] * transpose[0] + m[3] * transpose[2];
              var d = m[2] * transpose[1] + m[3] * transpose[3];
              var first = (a2 + d) / 2;
              var second = Math.sqrt((a2 + d) * (a2 + d) - 4 * (a2 * d - c2 * b)) / 2;
              var sx = first + second || 1;
              var sy = first - second || 1;
              return [Math.sqrt(sx), Math.sqrt(sy)];
            };
            Util2.normalizeRect = function Util_normalizeRect(rect) {
              var r2 = rect.slice(0);
              if (rect[0] > rect[2]) {
                r2[0] = rect[2];
                r2[2] = rect[0];
              }
              if (rect[1] > rect[3]) {
                r2[1] = rect[3];
                r2[3] = rect[1];
              }
              return r2;
            };
            Util2.intersect = function Util_intersect(rect1, rect2) {
              function compare3(a2, b) {
                return a2 - b;
              }
              var orderedX = [rect1[0], rect1[2], rect2[0], rect2[2]].sort(compare3), orderedY = [rect1[1], rect1[3], rect2[1], rect2[3]].sort(compare3), result = [];
              rect1 = Util2.normalizeRect(rect1);
              rect2 = Util2.normalizeRect(rect2);
              if (orderedX[0] === rect1[0] && orderedX[1] === rect2[0] || orderedX[0] === rect2[0] && orderedX[1] === rect1[0]) {
                result[0] = orderedX[1];
                result[2] = orderedX[2];
              } else {
                return false;
              }
              if (orderedY[0] === rect1[1] && orderedY[1] === rect2[1] || orderedY[0] === rect2[1] && orderedY[1] === rect1[1]) {
                result[1] = orderedY[1];
                result[3] = orderedY[2];
              } else {
                return false;
              }
              return result;
            };
            return Util2;
          }();
          exports2.Util = Util;
          var ROMAN_NUMBER_MAP = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM", "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC", "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
          function toRomanNumerals(number) {
            var lowerCase = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
            assert(Number.isInteger(number) && number > 0, "The number should be a positive integer.");
            var pos, romanBuf = [];
            while (number >= 1e3) {
              number -= 1e3;
              romanBuf.push("M");
            }
            pos = number / 100 | 0;
            number %= 100;
            romanBuf.push(ROMAN_NUMBER_MAP[pos]);
            pos = number / 10 | 0;
            number %= 10;
            romanBuf.push(ROMAN_NUMBER_MAP[10 + pos]);
            romanBuf.push(ROMAN_NUMBER_MAP[20 + number]);
            var romanStr = romanBuf.join("");
            return lowerCase ? romanStr.toLowerCase() : romanStr;
          }
          var PDFStringTranslateTable = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 728, 711, 710, 729, 733, 731, 730, 732, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8226, 8224, 8225, 8230, 8212, 8211, 402, 8260, 8249, 8250, 8722, 8240, 8222, 8220, 8221, 8216, 8217, 8218, 8482, 64257, 64258, 321, 338, 352, 376, 381, 305, 322, 339, 353, 382, 0, 8364];
          function stringToPDFString(str) {
            var i, n2 = str.length, strBuf = [];
            if (str[0] === "þ" && str[1] === "ÿ") {
              for (i = 2; i < n2; i += 2) {
                strBuf.push(String.fromCharCode(str.charCodeAt(i) << 8 | str.charCodeAt(i + 1)));
              }
            } else {
              for (i = 0; i < n2; ++i) {
                var code = PDFStringTranslateTable[str.charCodeAt(i)];
                strBuf.push(code ? String.fromCharCode(code) : str.charAt(i));
              }
            }
            return strBuf.join("");
          }
          function stringToUTF8String(str) {
            return decodeURIComponent(escape(str));
          }
          function utf8StringToString(str) {
            return unescape(encodeURIComponent(str));
          }
          function isEmptyObj(obj) {
            for (var key in obj) {
              return false;
            }
            return true;
          }
          function isBool(v) {
            return typeof v === "boolean";
          }
          function isNum(v) {
            return typeof v === "number";
          }
          function isString2(v) {
            return typeof v === "string";
          }
          function isArrayBuffer(v) {
            return _typeof(v) === "object" && v !== null && v.byteLength !== void 0;
          }
          function isSpace(ch) {
            return ch === 32 || ch === 9 || ch === 13 || ch === 10;
          }
          function createPromiseCapability() {
            var capability = /* @__PURE__ */ Object.create(null);
            var isSettled = false;
            Object.defineProperty(capability, "settled", {
              get: function get() {
                return isSettled;
              }
            });
            capability.promise = new Promise(function(resolve, reject) {
              capability.resolve = function(data) {
                isSettled = true;
                resolve(data);
              };
              capability.reject = function(reason) {
                isSettled = true;
                reject(reason);
              };
            });
            return capability;
          }
          var createObjectURL = /* @__PURE__ */ function createObjectURLClosure() {
            var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            return function createObjectURL2(data, contentType) {
              var forceDataSchema = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
              if (!forceDataSchema && _url_polyfill.URL.createObjectURL) {
                var blob = new Blob([data], {
                  type: contentType
                });
                return _url_polyfill.URL.createObjectURL(blob);
              }
              var buffer = "data:" + contentType + ";base64,";
              for (var i = 0, ii = data.length; i < ii; i += 3) {
                var b1 = data[i] & 255;
                var b2 = data[i + 1] & 255;
                var b3 = data[i + 2] & 255;
                var d1 = b1 >> 2, d2 = (b1 & 3) << 4 | b2 >> 4;
                var d3 = i + 1 < ii ? (b2 & 15) << 2 | b3 >> 6 : 64;
                var d4 = i + 2 < ii ? b3 & 63 : 64;
                buffer += digits[d1] + digits[d2] + digits[d3] + digits[d4];
              }
              return buffer;
            };
          }();
          exports2.createObjectURL = createObjectURL;
        },
        /* 2 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          function _typeof(obj) {
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
              _typeof = function _typeof2(obj2) {
                return typeof obj2;
              };
            } else {
              _typeof = function _typeof2(obj2) {
                return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
              };
            }
            return _typeof(obj);
          }
          var globalScope = __w_pdfjs_require__(3);
          if (!globalScope._pdfjsCompatibilityChecked) {
            globalScope._pdfjsCompatibilityChecked = true;
            var isNodeJS = __w_pdfjs_require__(4);
            var hasDOM = (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && (typeof document === "undefined" ? "undefined" : _typeof(document)) === "object";
            (function checkNodeBtoa() {
              if (globalScope.btoa || !isNodeJS()) {
                return;
              }
              globalScope.btoa = function(chars) {
                return Buffer.from(chars, "binary").toString("base64");
              };
            })();
            (function checkNodeAtob() {
              if (globalScope.atob || !isNodeJS()) {
                return;
              }
              globalScope.atob = function(input) {
                return Buffer.from(input, "base64").toString("binary");
              };
            })();
            (function checkChildNodeRemove() {
              if (!hasDOM) {
                return;
              }
              if (typeof Element.prototype.remove !== "undefined") {
                return;
              }
              Element.prototype.remove = function() {
                if (this.parentNode) {
                  this.parentNode.removeChild(this);
                }
              };
            })();
            (function checkDOMTokenListAddRemove() {
              if (!hasDOM || isNodeJS()) {
                return;
              }
              var div = document.createElement("div");
              div.classList.add("testOne", "testTwo");
              if (div.classList.contains("testOne") === true && div.classList.contains("testTwo") === true) {
                return;
              }
              var OriginalDOMTokenListAdd = DOMTokenList.prototype.add;
              var OriginalDOMTokenListRemove = DOMTokenList.prototype.remove;
              DOMTokenList.prototype.add = function() {
                for (var _len = arguments.length, tokens = new Array(_len), _key = 0; _key < _len; _key++) {
                  tokens[_key] = arguments[_key];
                }
                for (var _i = 0; _i < tokens.length; _i++) {
                  var token = tokens[_i];
                  OriginalDOMTokenListAdd.call(this, token);
                }
              };
              DOMTokenList.prototype.remove = function() {
                for (var _len2 = arguments.length, tokens = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                  tokens[_key2] = arguments[_key2];
                }
                for (var _i2 = 0; _i2 < tokens.length; _i2++) {
                  var token = tokens[_i2];
                  OriginalDOMTokenListRemove.call(this, token);
                }
              };
            })();
            (function checkDOMTokenListToggle() {
              if (!hasDOM || isNodeJS()) {
                return;
              }
              var div = document.createElement("div");
              if (div.classList.toggle("test", 0) === false) {
                return;
              }
              DOMTokenList.prototype.toggle = function(token) {
                var force = arguments.length > 1 ? !!arguments[1] : !this.contains(token);
                return this[force ? "add" : "remove"](token), force;
              };
            })();
            (function checkStringStartsWith() {
              if (String.prototype.startsWith) {
                return;
              }
              __w_pdfjs_require__(5);
            })();
            (function checkStringEndsWith() {
              if (String.prototype.endsWith) {
                return;
              }
              __w_pdfjs_require__(35);
            })();
            (function checkStringIncludes() {
              if (String.prototype.includes) {
                return;
              }
              __w_pdfjs_require__(37);
            })();
            (function checkArrayIncludes() {
              if (Array.prototype.includes) {
                return;
              }
              __w_pdfjs_require__(39);
            })();
            (function checkArrayFrom() {
              if (Array.from) {
                return;
              }
              __w_pdfjs_require__(46);
            })();
            (function checkObjectAssign() {
              if (Object.assign) {
                return;
              }
              __w_pdfjs_require__(69);
            })();
            (function checkMathLog2() {
              if (Math.log2) {
                return;
              }
              Math.log2 = __w_pdfjs_require__(74);
            })();
            (function checkNumberIsNaN() {
              if (Number.isNaN) {
                return;
              }
              Number.isNaN = __w_pdfjs_require__(76);
            })();
            (function checkNumberIsInteger() {
              if (Number.isInteger) {
                return;
              }
              Number.isInteger = __w_pdfjs_require__(78);
            })();
            (function checkPromise() {
              if (globalScope.Promise && globalScope.Promise.prototype && globalScope.Promise.prototype.finally) {
                return;
              }
              globalScope.Promise = __w_pdfjs_require__(81);
            })();
            (function checkWeakMap() {
              if (globalScope.WeakMap) {
                return;
              }
              globalScope.WeakMap = __w_pdfjs_require__(101);
            })();
            (function checkWeakSet() {
              if (globalScope.WeakSet) {
                return;
              }
              globalScope.WeakSet = __w_pdfjs_require__(118);
            })();
            (function checkStringCodePointAt() {
              if (String.codePointAt) {
                return;
              }
              String.codePointAt = __w_pdfjs_require__(122);
            })();
            (function checkStringFromCodePoint() {
              if (String.fromCodePoint) {
                return;
              }
              String.fromCodePoint = __w_pdfjs_require__(124);
            })();
            (function checkSymbol() {
              if (globalScope.Symbol) {
                return;
              }
              __w_pdfjs_require__(126);
            })();
            (function checkStringPadStart() {
              if (String.prototype.padStart) {
                return;
              }
              __w_pdfjs_require__(133);
            })();
            (function checkStringPadEnd() {
              if (String.prototype.padEnd) {
                return;
              }
              __w_pdfjs_require__(137);
            })();
            (function checkObjectValues() {
              if (Object.values) {
                return;
              }
              Object.values = __w_pdfjs_require__(139);
            })();
          }
        },
        /* 3 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          module2.exports = typeof window !== "undefined" && window.Math === Math ? window : typeof commonjsGlobal !== "undefined" && commonjsGlobal.Math === Math ? commonjsGlobal : typeof self !== "undefined" && self.Math === Math ? self : {};
        },
        /* 4 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          function _typeof(obj) {
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
              _typeof = function _typeof2(obj2) {
                return typeof obj2;
              };
            } else {
              _typeof = function _typeof2(obj2) {
                return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
              };
            }
            return _typeof(obj);
          }
          module2.exports = function isNodeJS() {
            return (typeof process === "undefined" ? "undefined" : _typeof(process)) === "object" && process + "" === "[object process]" && !process.versions["nw"];
          };
        },
        /* 5 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(6);
          module2.exports = __w_pdfjs_require__(9).String.startsWith;
        },
        /* 6 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $export = __w_pdfjs_require__(7);
          var toLength = __w_pdfjs_require__(25);
          var context = __w_pdfjs_require__(27);
          var STARTS_WITH = "startsWith";
          var $startsWith = ""[STARTS_WITH];
          $export($export.P + $export.F * __w_pdfjs_require__(34)(STARTS_WITH), "String", {
            startsWith: function startsWith(searchString) {
              var that = context(this, searchString, STARTS_WITH);
              var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : void 0, that.length));
              var search = String(searchString);
              return $startsWith ? $startsWith.call(that, search, index) : that.slice(index, index + search.length) === search;
            }
          });
        },
        /* 7 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var global2 = __w_pdfjs_require__(8);
          var core = __w_pdfjs_require__(9);
          var hide = __w_pdfjs_require__(10);
          var redefine = __w_pdfjs_require__(20);
          var ctx = __w_pdfjs_require__(23);
          var PROTOTYPE = "prototype";
          var $export = function $export2(type, name, source) {
            var IS_FORCED = type & $export2.F;
            var IS_GLOBAL = type & $export2.G;
            var IS_STATIC = type & $export2.S;
            var IS_PROTO = type & $export2.P;
            var IS_BIND = type & $export2.B;
            var target = IS_GLOBAL ? global2 : IS_STATIC ? global2[name] || (global2[name] = {}) : (global2[name] || {})[PROTOTYPE];
            var exports3 = IS_GLOBAL ? core : core[name] || (core[name] = {});
            var expProto = exports3[PROTOTYPE] || (exports3[PROTOTYPE] = {});
            var key, own, out, exp;
            if (IS_GLOBAL)
              source = name;
            for (key in source) {
              own = !IS_FORCED && target && target[key] !== void 0;
              out = (own ? target : source)[key];
              exp = IS_BIND && own ? ctx(out, global2) : IS_PROTO && typeof out == "function" ? ctx(Function.call, out) : out;
              if (target)
                redefine(target, key, out, type & $export2.U);
              if (exports3[key] != out)
                hide(exports3, key, exp);
              if (IS_PROTO && expProto[key] != out)
                expProto[key] = out;
            }
          };
          global2.core = core;
          $export.F = 1;
          $export.G = 2;
          $export.S = 4;
          $export.P = 8;
          $export.B = 16;
          $export.W = 32;
          $export.U = 64;
          $export.R = 128;
          module2.exports = $export;
        },
        /* 8 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var global2 = module2.exports = typeof window != "undefined" && window.Math == Math ? window : typeof self != "undefined" && self.Math == Math ? self : Function("return this")();
          if (typeof __g == "number")
            __g = global2;
        },
        /* 9 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var core = module2.exports = {
            version: "2.6.2"
          };
          if (typeof __e == "number")
            __e = core;
        },
        /* 10 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var dP = __w_pdfjs_require__(11);
          var createDesc = __w_pdfjs_require__(19);
          module2.exports = __w_pdfjs_require__(15) ? function(object, key, value) {
            return dP.f(object, key, createDesc(1, value));
          } : function(object, key, value) {
            object[key] = value;
            return object;
          };
        },
        /* 11 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var anObject = __w_pdfjs_require__(12);
          var IE8_DOM_DEFINE = __w_pdfjs_require__(14);
          var toPrimitive = __w_pdfjs_require__(18);
          var dP = Object.defineProperty;
          exports2.f = __w_pdfjs_require__(15) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
            anObject(O);
            P = toPrimitive(P, true);
            anObject(Attributes);
            if (IE8_DOM_DEFINE)
              try {
                return dP(O, P, Attributes);
              } catch (e) {
              }
            if ("get" in Attributes || "set" in Attributes)
              throw TypeError("Accessors not supported!");
            if ("value" in Attributes)
              O[P] = Attributes.value;
            return O;
          };
        },
        /* 12 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var isObject2 = __w_pdfjs_require__(13);
          module2.exports = function(it) {
            if (!isObject2(it))
              throw TypeError(it + " is not an object!");
            return it;
          };
        },
        /* 13 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          function _typeof(obj) {
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
              _typeof = function _typeof2(obj2) {
                return typeof obj2;
              };
            } else {
              _typeof = function _typeof2(obj2) {
                return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
              };
            }
            return _typeof(obj);
          }
          module2.exports = function(it) {
            return _typeof(it) === "object" ? it !== null : typeof it === "function";
          };
        },
        /* 14 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          module2.exports = !__w_pdfjs_require__(15) && !__w_pdfjs_require__(16)(function() {
            return Object.defineProperty(__w_pdfjs_require__(17)("div"), "a", {
              get: function get() {
                return 7;
              }
            }).a != 7;
          });
        },
        /* 15 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          module2.exports = !__w_pdfjs_require__(16)(function() {
            return Object.defineProperty({}, "a", {
              get: function get() {
                return 7;
              }
            }).a != 7;
          });
        },
        /* 16 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          module2.exports = function(exec) {
            try {
              return !!exec();
            } catch (e) {
              return true;
            }
          };
        },
        /* 17 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var isObject2 = __w_pdfjs_require__(13);
          var document2 = __w_pdfjs_require__(8).document;
          var is = isObject2(document2) && isObject2(document2.createElement);
          module2.exports = function(it) {
            return is ? document2.createElement(it) : {};
          };
        },
        /* 18 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var isObject2 = __w_pdfjs_require__(13);
          module2.exports = function(it, S) {
            if (!isObject2(it))
              return it;
            var fn, val;
            if (S && typeof (fn = it.toString) == "function" && !isObject2(val = fn.call(it)))
              return val;
            if (typeof (fn = it.valueOf) == "function" && !isObject2(val = fn.call(it)))
              return val;
            if (!S && typeof (fn = it.toString) == "function" && !isObject2(val = fn.call(it)))
              return val;
            throw TypeError("Can't convert object to primitive value");
          };
        },
        /* 19 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          module2.exports = function(bitmap, value) {
            return {
              enumerable: !(bitmap & 1),
              configurable: !(bitmap & 2),
              writable: !(bitmap & 4),
              value
            };
          };
        },
        /* 20 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var global2 = __w_pdfjs_require__(8);
          var hide = __w_pdfjs_require__(10);
          var has = __w_pdfjs_require__(21);
          var SRC = __w_pdfjs_require__(22)("src");
          var TO_STRING = "toString";
          var $toString = Function[TO_STRING];
          var TPL = ("" + $toString).split(TO_STRING);
          __w_pdfjs_require__(9).inspectSource = function(it) {
            return $toString.call(it);
          };
          (module2.exports = function(O, key, val, safe) {
            var isFunction = typeof val == "function";
            if (isFunction)
              has(val, "name") || hide(val, "name", key);
            if (O[key] === val)
              return;
            if (isFunction)
              has(val, SRC) || hide(val, SRC, O[key] ? "" + O[key] : TPL.join(String(key)));
            if (O === global2) {
              O[key] = val;
            } else if (!safe) {
              delete O[key];
              hide(O, key, val);
            } else if (O[key]) {
              O[key] = val;
            } else {
              hide(O, key, val);
            }
          })(Function.prototype, TO_STRING, function toString3() {
            return typeof this == "function" && this[SRC] || $toString.call(this);
          });
        },
        /* 21 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var hasOwnProperty = {}.hasOwnProperty;
          module2.exports = function(it, key) {
            return hasOwnProperty.call(it, key);
          };
        },
        /* 22 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var id = 0;
          var px = Math.random();
          module2.exports = function(key) {
            return "Symbol(".concat(key === void 0 ? "" : key, ")_", (++id + px).toString(36));
          };
        },
        /* 23 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var aFunction = __w_pdfjs_require__(24);
          module2.exports = function(fn, that, length) {
            aFunction(fn);
            if (that === void 0)
              return fn;
            switch (length) {
              case 1:
                return function(a2) {
                  return fn.call(that, a2);
                };
              case 2:
                return function(a2, b) {
                  return fn.call(that, a2, b);
                };
              case 3:
                return function(a2, b, c2) {
                  return fn.call(that, a2, b, c2);
                };
            }
            return function() {
              return fn.apply(that, arguments);
            };
          };
        },
        /* 24 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          module2.exports = function(it) {
            if (typeof it != "function")
              throw TypeError(it + " is not a function!");
            return it;
          };
        },
        /* 25 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var toInteger = __w_pdfjs_require__(26);
          var min = Math.min;
          module2.exports = function(it) {
            return it > 0 ? min(toInteger(it), 9007199254740991) : 0;
          };
        },
        /* 26 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var ceil = Math.ceil;
          var floor2 = Math.floor;
          module2.exports = function(it) {
            return isNaN(it = +it) ? 0 : (it > 0 ? floor2 : ceil)(it);
          };
        },
        /* 27 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var isRegExp = __w_pdfjs_require__(28);
          var defined = __w_pdfjs_require__(33);
          module2.exports = function(that, searchString, NAME) {
            if (isRegExp(searchString))
              throw TypeError("String#" + NAME + " doesn't accept regex!");
            return String(defined(that));
          };
        },
        /* 28 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var isObject2 = __w_pdfjs_require__(13);
          var cof = __w_pdfjs_require__(29);
          var MATCH = __w_pdfjs_require__(30)("match");
          module2.exports = function(it) {
            var isRegExp;
            return isObject2(it) && ((isRegExp = it[MATCH]) !== void 0 ? !!isRegExp : cof(it) == "RegExp");
          };
        },
        /* 29 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var toString3 = {}.toString;
          module2.exports = function(it) {
            return toString3.call(it).slice(8, -1);
          };
        },
        /* 30 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var store = __w_pdfjs_require__(31)("wks");
          var uid = __w_pdfjs_require__(22);
          var _Symbol = __w_pdfjs_require__(8).Symbol;
          var USE_SYMBOL = typeof _Symbol == "function";
          var $exports = module2.exports = function(name) {
            return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)("Symbol." + name));
          };
          $exports.store = store;
        },
        /* 31 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var core = __w_pdfjs_require__(9);
          var global2 = __w_pdfjs_require__(8);
          var SHARED = "__core-js_shared__";
          var store = global2[SHARED] || (global2[SHARED] = {});
          (module2.exports = function(key, value) {
            return store[key] || (store[key] = value !== void 0 ? value : {});
          })("versions", []).push({
            version: core.version,
            mode: __w_pdfjs_require__(32) ? "pure" : "global",
            copyright: "© 2019 Denis Pushkarev (zloirock.ru)"
          });
        },
        /* 32 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          module2.exports = false;
        },
        /* 33 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          module2.exports = function(it) {
            if (it == void 0)
              throw TypeError("Can't call method on  " + it);
            return it;
          };
        },
        /* 34 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var MATCH = __w_pdfjs_require__(30)("match");
          module2.exports = function(KEY) {
            var re = /./;
            try {
              "/./"[KEY](re);
            } catch (e) {
              try {
                re[MATCH] = false;
                return !"/./"[KEY](re);
              } catch (f) {
              }
            }
            return true;
          };
        },
        /* 35 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(36);
          module2.exports = __w_pdfjs_require__(9).String.endsWith;
        },
        /* 36 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $export = __w_pdfjs_require__(7);
          var toLength = __w_pdfjs_require__(25);
          var context = __w_pdfjs_require__(27);
          var ENDS_WITH = "endsWith";
          var $endsWith = ""[ENDS_WITH];
          $export($export.P + $export.F * __w_pdfjs_require__(34)(ENDS_WITH), "String", {
            endsWith: function endsWith(searchString) {
              var that = context(this, searchString, ENDS_WITH);
              var endPosition = arguments.length > 1 ? arguments[1] : void 0;
              var len = toLength(that.length);
              var end = endPosition === void 0 ? len : Math.min(toLength(endPosition), len);
              var search = String(searchString);
              return $endsWith ? $endsWith.call(that, search, end) : that.slice(end - search.length, end) === search;
            }
          });
        },
        /* 37 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(38);
          module2.exports = __w_pdfjs_require__(9).String.includes;
        },
        /* 38 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $export = __w_pdfjs_require__(7);
          var context = __w_pdfjs_require__(27);
          var INCLUDES = "includes";
          $export($export.P + $export.F * __w_pdfjs_require__(34)(INCLUDES), "String", {
            includes: function includes2(searchString) {
              return !!~context(this, searchString, INCLUDES).indexOf(searchString, arguments.length > 1 ? arguments[1] : void 0);
            }
          });
        },
        /* 39 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(40);
          module2.exports = __w_pdfjs_require__(9).Array.includes;
        },
        /* 40 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $export = __w_pdfjs_require__(7);
          var $includes = __w_pdfjs_require__(41)(true);
          $export($export.P, "Array", {
            includes: function includes2(el) {
              return $includes(this, el, arguments.length > 1 ? arguments[1] : void 0);
            }
          });
          __w_pdfjs_require__(45)("includes");
        },
        /* 41 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var toIObject = __w_pdfjs_require__(42);
          var toLength = __w_pdfjs_require__(25);
          var toAbsoluteIndex = __w_pdfjs_require__(44);
          module2.exports = function(IS_INCLUDES) {
            return function($this, el, fromIndex) {
              var O = toIObject($this);
              var length = toLength(O.length);
              var index = toAbsoluteIndex(fromIndex, length);
              var value;
              if (IS_INCLUDES && el != el)
                while (length > index) {
                  value = O[index++];
                  if (value != value)
                    return true;
                }
              else
                for (; length > index; index++) {
                  if (IS_INCLUDES || index in O) {
                    if (O[index] === el)
                      return IS_INCLUDES || index || 0;
                  }
                }
              return !IS_INCLUDES && -1;
            };
          };
        },
        /* 42 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var IObject = __w_pdfjs_require__(43);
          var defined = __w_pdfjs_require__(33);
          module2.exports = function(it) {
            return IObject(defined(it));
          };
        },
        /* 43 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var cof = __w_pdfjs_require__(29);
          module2.exports = Object("z").propertyIsEnumerable(0) ? Object : function(it) {
            return cof(it) == "String" ? it.split("") : Object(it);
          };
        },
        /* 44 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var toInteger = __w_pdfjs_require__(26);
          var max = Math.max;
          var min = Math.min;
          module2.exports = function(index, length) {
            index = toInteger(index);
            return index < 0 ? max(index + length, 0) : min(index, length);
          };
        },
        /* 45 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var UNSCOPABLES = __w_pdfjs_require__(30)("unscopables");
          var ArrayProto = Array.prototype;
          if (ArrayProto[UNSCOPABLES] == void 0)
            __w_pdfjs_require__(10)(ArrayProto, UNSCOPABLES, {});
          module2.exports = function(key) {
            ArrayProto[UNSCOPABLES][key] = true;
          };
        },
        /* 46 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(47);
          __w_pdfjs_require__(62);
          module2.exports = __w_pdfjs_require__(9).Array.from;
        },
        /* 47 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $at = __w_pdfjs_require__(48)(true);
          __w_pdfjs_require__(49)(String, "String", function(iterated) {
            this._t = String(iterated);
            this._i = 0;
          }, function() {
            var O = this._t;
            var index = this._i;
            var point;
            if (index >= O.length)
              return {
                value: void 0,
                done: true
              };
            point = $at(O, index);
            this._i += point.length;
            return {
              value: point,
              done: false
            };
          });
        },
        /* 48 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var toInteger = __w_pdfjs_require__(26);
          var defined = __w_pdfjs_require__(33);
          module2.exports = function(TO_STRING) {
            return function(that, pos) {
              var s = String(defined(that));
              var i = toInteger(pos);
              var l2 = s.length;
              var a2, b;
              if (i < 0 || i >= l2)
                return TO_STRING ? "" : void 0;
              a2 = s.charCodeAt(i);
              return a2 < 55296 || a2 > 56319 || i + 1 === l2 || (b = s.charCodeAt(i + 1)) < 56320 || b > 57343 ? TO_STRING ? s.charAt(i) : a2 : TO_STRING ? s.slice(i, i + 2) : (a2 - 55296 << 10) + (b - 56320) + 65536;
            };
          };
        },
        /* 49 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var LIBRARY = __w_pdfjs_require__(32);
          var $export = __w_pdfjs_require__(7);
          var redefine = __w_pdfjs_require__(20);
          var hide = __w_pdfjs_require__(10);
          var Iterators = __w_pdfjs_require__(50);
          var $iterCreate = __w_pdfjs_require__(51);
          var setToStringTag = __w_pdfjs_require__(59);
          var getPrototypeOf = __w_pdfjs_require__(60);
          var ITERATOR = __w_pdfjs_require__(30)("iterator");
          var BUGGY = !([].keys && "next" in [].keys());
          var FF_ITERATOR = "@@iterator";
          var KEYS = "keys";
          var VALUES = "values";
          var returnThis = function returnThis2() {
            return this;
          };
          module2.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
            $iterCreate(Constructor, NAME, next);
            var getMethod = function getMethod2(kind) {
              if (!BUGGY && kind in proto)
                return proto[kind];
              switch (kind) {
                case KEYS:
                  return function keys() {
                    return new Constructor(this, kind);
                  };
                case VALUES:
                  return function values() {
                    return new Constructor(this, kind);
                  };
              }
              return function entries() {
                return new Constructor(this, kind);
              };
            };
            var TAG = NAME + " Iterator";
            var DEF_VALUES = DEFAULT == VALUES;
            var VALUES_BUG = false;
            var proto = Base.prototype;
            var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
            var $default = $native || getMethod(DEFAULT);
            var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod("entries") : void 0;
            var $anyNative = NAME == "Array" ? proto.entries || $native : $native;
            var methods, key, IteratorPrototype;
            if ($anyNative) {
              IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
              if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
                setToStringTag(IteratorPrototype, TAG, true);
                if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != "function")
                  hide(IteratorPrototype, ITERATOR, returnThis);
              }
            }
            if (DEF_VALUES && $native && $native.name !== VALUES) {
              VALUES_BUG = true;
              $default = function values() {
                return $native.call(this);
              };
            }
            if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
              hide(proto, ITERATOR, $default);
            }
            Iterators[NAME] = $default;
            Iterators[TAG] = returnThis;
            if (DEFAULT) {
              methods = {
                values: DEF_VALUES ? $default : getMethod(VALUES),
                keys: IS_SET ? $default : getMethod(KEYS),
                entries: $entries
              };
              if (FORCED)
                for (key in methods) {
                  if (!(key in proto))
                    redefine(proto, key, methods[key]);
                }
              else
                $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
            }
            return methods;
          };
        },
        /* 50 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          module2.exports = {};
        },
        /* 51 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var create = __w_pdfjs_require__(52);
          var descriptor = __w_pdfjs_require__(19);
          var setToStringTag = __w_pdfjs_require__(59);
          var IteratorPrototype = {};
          __w_pdfjs_require__(10)(IteratorPrototype, __w_pdfjs_require__(30)("iterator"), function() {
            return this;
          });
          module2.exports = function(Constructor, NAME, next) {
            Constructor.prototype = create(IteratorPrototype, {
              next: descriptor(1, next)
            });
            setToStringTag(Constructor, NAME + " Iterator");
          };
        },
        /* 52 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var anObject = __w_pdfjs_require__(12);
          var dPs = __w_pdfjs_require__(53);
          var enumBugKeys = __w_pdfjs_require__(57);
          var IE_PROTO = __w_pdfjs_require__(56)("IE_PROTO");
          var Empty = function Empty2() {
          };
          var PROTOTYPE = "prototype";
          var _createDict = function createDict() {
            var iframe = __w_pdfjs_require__(17)("iframe");
            var i = enumBugKeys.length;
            var lt = "<";
            var gt = ">";
            var iframeDocument;
            iframe.style.display = "none";
            __w_pdfjs_require__(58).appendChild(iframe);
            iframe.src = "javascript:";
            iframeDocument = iframe.contentWindow.document;
            iframeDocument.open();
            iframeDocument.write(lt + "script" + gt + "document.F=Object" + lt + "/script" + gt);
            iframeDocument.close();
            _createDict = iframeDocument.F;
            while (i--) {
              delete _createDict[PROTOTYPE][enumBugKeys[i]];
            }
            return _createDict();
          };
          module2.exports = Object.create || function create(O, Properties) {
            var result;
            if (O !== null) {
              Empty[PROTOTYPE] = anObject(O);
              result = new Empty();
              Empty[PROTOTYPE] = null;
              result[IE_PROTO] = O;
            } else
              result = _createDict();
            return Properties === void 0 ? result : dPs(result, Properties);
          };
        },
        /* 53 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var dP = __w_pdfjs_require__(11);
          var anObject = __w_pdfjs_require__(12);
          var getKeys = __w_pdfjs_require__(54);
          module2.exports = __w_pdfjs_require__(15) ? Object.defineProperties : function defineProperties(O, Properties) {
            anObject(O);
            var keys = getKeys(Properties);
            var length = keys.length;
            var i = 0;
            var P;
            while (length > i) {
              dP.f(O, P = keys[i++], Properties[P]);
            }
            return O;
          };
        },
        /* 54 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $keys = __w_pdfjs_require__(55);
          var enumBugKeys = __w_pdfjs_require__(57);
          module2.exports = Object.keys || function keys(O) {
            return $keys(O, enumBugKeys);
          };
        },
        /* 55 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var has = __w_pdfjs_require__(21);
          var toIObject = __w_pdfjs_require__(42);
          var arrayIndexOf2 = __w_pdfjs_require__(41)(false);
          var IE_PROTO = __w_pdfjs_require__(56)("IE_PROTO");
          module2.exports = function(object, names) {
            var O = toIObject(object);
            var i = 0;
            var result = [];
            var key;
            for (key in O) {
              if (key != IE_PROTO)
                has(O, key) && result.push(key);
            }
            while (names.length > i) {
              if (has(O, key = names[i++])) {
                ~arrayIndexOf2(result, key) || result.push(key);
              }
            }
            return result;
          };
        },
        /* 56 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var shared = __w_pdfjs_require__(31)("keys");
          var uid = __w_pdfjs_require__(22);
          module2.exports = function(key) {
            return shared[key] || (shared[key] = uid(key));
          };
        },
        /* 57 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          module2.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");
        },
        /* 58 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var document2 = __w_pdfjs_require__(8).document;
          module2.exports = document2 && document2.documentElement;
        },
        /* 59 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var def = __w_pdfjs_require__(11).f;
          var has = __w_pdfjs_require__(21);
          var TAG = __w_pdfjs_require__(30)("toStringTag");
          module2.exports = function(it, tag, stat) {
            if (it && !has(it = stat ? it : it.prototype, TAG))
              def(it, TAG, {
                configurable: true,
                value: tag
              });
          };
        },
        /* 60 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var has = __w_pdfjs_require__(21);
          var toObject = __w_pdfjs_require__(61);
          var IE_PROTO = __w_pdfjs_require__(56)("IE_PROTO");
          var ObjectProto = Object.prototype;
          module2.exports = Object.getPrototypeOf || function(O) {
            O = toObject(O);
            if (has(O, IE_PROTO))
              return O[IE_PROTO];
            if (typeof O.constructor == "function" && O instanceof O.constructor) {
              return O.constructor.prototype;
            }
            return O instanceof Object ? ObjectProto : null;
          };
        },
        /* 61 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var defined = __w_pdfjs_require__(33);
          module2.exports = function(it) {
            return Object(defined(it));
          };
        },
        /* 62 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var ctx = __w_pdfjs_require__(23);
          var $export = __w_pdfjs_require__(7);
          var toObject = __w_pdfjs_require__(61);
          var call = __w_pdfjs_require__(63);
          var isArrayIter = __w_pdfjs_require__(64);
          var toLength = __w_pdfjs_require__(25);
          var createProperty = __w_pdfjs_require__(65);
          var getIterFn = __w_pdfjs_require__(66);
          $export($export.S + $export.F * !__w_pdfjs_require__(68)(function(iter) {
          }), "Array", {
            from: function from2(arrayLike) {
              var O = toObject(arrayLike);
              var C = typeof this == "function" ? this : Array;
              var aLen = arguments.length;
              var mapfn = aLen > 1 ? arguments[1] : void 0;
              var mapping = mapfn !== void 0;
              var index = 0;
              var iterFn = getIterFn(O);
              var length, result, step, iterator;
              if (mapping)
                mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : void 0, 2);
              if (iterFn != void 0 && !(C == Array && isArrayIter(iterFn))) {
                for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
                  createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
                }
              } else {
                length = toLength(O.length);
                for (result = new C(length); length > index; index++) {
                  createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
                }
              }
              result.length = index;
              return result;
            }
          });
        },
        /* 63 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var anObject = __w_pdfjs_require__(12);
          module2.exports = function(iterator, fn, value, entries) {
            try {
              return entries ? fn(anObject(value)[0], value[1]) : fn(value);
            } catch (e) {
              var ret = iterator["return"];
              if (ret !== void 0)
                anObject(ret.call(iterator));
              throw e;
            }
          };
        },
        /* 64 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var Iterators = __w_pdfjs_require__(50);
          var ITERATOR = __w_pdfjs_require__(30)("iterator");
          var ArrayProto = Array.prototype;
          module2.exports = function(it) {
            return it !== void 0 && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
          };
        },
        /* 65 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $defineProperty = __w_pdfjs_require__(11);
          var createDesc = __w_pdfjs_require__(19);
          module2.exports = function(object, index, value) {
            if (index in object)
              $defineProperty.f(object, index, createDesc(0, value));
            else
              object[index] = value;
          };
        },
        /* 66 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var classof = __w_pdfjs_require__(67);
          var ITERATOR = __w_pdfjs_require__(30)("iterator");
          var Iterators = __w_pdfjs_require__(50);
          module2.exports = __w_pdfjs_require__(9).getIteratorMethod = function(it) {
            if (it != void 0)
              return it[ITERATOR] || it["@@iterator"] || Iterators[classof(it)];
          };
        },
        /* 67 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var cof = __w_pdfjs_require__(29);
          var TAG = __w_pdfjs_require__(30)("toStringTag");
          var ARG = cof(/* @__PURE__ */ function() {
            return arguments;
          }()) == "Arguments";
          var tryGet = function tryGet2(it, key) {
            try {
              return it[key];
            } catch (e) {
            }
          };
          module2.exports = function(it) {
            var O, T, B;
            return it === void 0 ? "Undefined" : it === null ? "Null" : typeof (T = tryGet(O = Object(it), TAG)) == "string" ? T : ARG ? cof(O) : (B = cof(O)) == "Object" && typeof O.callee == "function" ? "Arguments" : B;
          };
        },
        /* 68 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var ITERATOR = __w_pdfjs_require__(30)("iterator");
          var SAFE_CLOSING = false;
          try {
            var riter = [7][ITERATOR]();
            riter["return"] = function() {
              SAFE_CLOSING = true;
            };
          } catch (e) {
          }
          module2.exports = function(exec, skipClosing) {
            if (!skipClosing && !SAFE_CLOSING)
              return false;
            var safe = false;
            try {
              var arr = [7];
              var iter = arr[ITERATOR]();
              iter.next = function() {
                return {
                  done: safe = true
                };
              };
              arr[ITERATOR] = function() {
                return iter;
              };
              exec(arr);
            } catch (e) {
            }
            return safe;
          };
        },
        /* 69 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(70);
          module2.exports = __w_pdfjs_require__(9).Object.assign;
        },
        /* 70 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $export = __w_pdfjs_require__(7);
          $export($export.S + $export.F, "Object", {
            assign: __w_pdfjs_require__(71)
          });
        },
        /* 71 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var getKeys = __w_pdfjs_require__(54);
          var gOPS = __w_pdfjs_require__(72);
          var pIE = __w_pdfjs_require__(73);
          var toObject = __w_pdfjs_require__(61);
          var IObject = __w_pdfjs_require__(43);
          var $assign = Object.assign;
          module2.exports = !$assign || __w_pdfjs_require__(16)(function() {
            var A = {};
            var B = {};
            var S = Symbol();
            var K = "abcdefghijklmnopqrst";
            A[S] = 7;
            K.split("").forEach(function(k) {
              B[k] = k;
            });
            return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join("") != K;
          }) ? function assign(target, source) {
            var T = toObject(target);
            var aLen = arguments.length;
            var index = 1;
            var getSymbols = gOPS.f;
            var isEnum = pIE.f;
            while (aLen > index) {
              var S = IObject(arguments[index++]);
              var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
              var length = keys.length;
              var j = 0;
              var key;
              while (length > j) {
                if (isEnum.call(S, key = keys[j++]))
                  T[key] = S[key];
              }
            }
            return T;
          } : $assign;
        },
        /* 72 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          exports2.f = Object.getOwnPropertySymbols;
        },
        /* 73 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          exports2.f = {}.propertyIsEnumerable;
        },
        /* 74 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(75);
          module2.exports = __w_pdfjs_require__(9).Math.log2;
        },
        /* 75 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $export = __w_pdfjs_require__(7);
          $export($export.S, "Math", {
            log2: function log2(x) {
              return Math.log(x) / Math.LN2;
            }
          });
        },
        /* 76 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(77);
          module2.exports = __w_pdfjs_require__(9).Number.isNaN;
        },
        /* 77 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $export = __w_pdfjs_require__(7);
          $export($export.S, "Number", {
            isNaN: function isNaN2(number) {
              return number != number;
            }
          });
        },
        /* 78 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(79);
          module2.exports = __w_pdfjs_require__(9).Number.isInteger;
        },
        /* 79 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $export = __w_pdfjs_require__(7);
          $export($export.S, "Number", {
            isInteger: __w_pdfjs_require__(80)
          });
        },
        /* 80 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var isObject2 = __w_pdfjs_require__(13);
          var floor2 = Math.floor;
          module2.exports = function isInteger(it) {
            return !isObject2(it) && isFinite(it) && floor2(it) === it;
          };
        },
        /* 81 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(82);
          __w_pdfjs_require__(47);
          __w_pdfjs_require__(83);
          __w_pdfjs_require__(86);
          __w_pdfjs_require__(99);
          __w_pdfjs_require__(100);
          module2.exports = __w_pdfjs_require__(9).Promise;
        },
        /* 82 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var classof = __w_pdfjs_require__(67);
          var test = {};
          test[__w_pdfjs_require__(30)("toStringTag")] = "z";
          if (test + "" != "[object z]") {
            __w_pdfjs_require__(20)(Object.prototype, "toString", function toString3() {
              return "[object " + classof(this) + "]";
            }, true);
          }
        },
        /* 83 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $iterators = __w_pdfjs_require__(84);
          var getKeys = __w_pdfjs_require__(54);
          var redefine = __w_pdfjs_require__(20);
          var global2 = __w_pdfjs_require__(8);
          var hide = __w_pdfjs_require__(10);
          var Iterators = __w_pdfjs_require__(50);
          var wks = __w_pdfjs_require__(30);
          var ITERATOR = wks("iterator");
          var TO_STRING_TAG = wks("toStringTag");
          var ArrayValues = Iterators.Array;
          var DOMIterables = {
            CSSRuleList: true,
            CSSStyleDeclaration: false,
            CSSValueList: false,
            ClientRectList: false,
            DOMRectList: false,
            DOMStringList: false,
            DOMTokenList: true,
            DataTransferItemList: false,
            FileList: false,
            HTMLAllCollection: false,
            HTMLCollection: false,
            HTMLFormElement: false,
            HTMLSelectElement: false,
            MediaList: true,
            MimeTypeArray: false,
            NamedNodeMap: false,
            NodeList: true,
            PaintRequestList: false,
            Plugin: false,
            PluginArray: false,
            SVGLengthList: false,
            SVGNumberList: false,
            SVGPathSegList: false,
            SVGPointList: false,
            SVGStringList: false,
            SVGTransformList: false,
            SourceBufferList: false,
            StyleSheetList: true,
            TextTrackCueList: false,
            TextTrackList: false,
            TouchList: false
          };
          for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
            var NAME = collections[i];
            var explicit = DOMIterables[NAME];
            var Collection = global2[NAME];
            var proto = Collection && Collection.prototype;
            var key;
            if (proto) {
              if (!proto[ITERATOR])
                hide(proto, ITERATOR, ArrayValues);
              if (!proto[TO_STRING_TAG])
                hide(proto, TO_STRING_TAG, NAME);
              Iterators[NAME] = ArrayValues;
              if (explicit)
                for (key in $iterators) {
                  if (!proto[key])
                    redefine(proto, key, $iterators[key], true);
                }
            }
          }
        },
        /* 84 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var addToUnscopables = __w_pdfjs_require__(45);
          var step = __w_pdfjs_require__(85);
          var Iterators = __w_pdfjs_require__(50);
          var toIObject = __w_pdfjs_require__(42);
          module2.exports = __w_pdfjs_require__(49)(Array, "Array", function(iterated, kind) {
            this._t = toIObject(iterated);
            this._i = 0;
            this._k = kind;
          }, function() {
            var O = this._t;
            var kind = this._k;
            var index = this._i++;
            if (!O || index >= O.length) {
              this._t = void 0;
              return step(1);
            }
            if (kind == "keys")
              return step(0, index);
            if (kind == "values")
              return step(0, O[index]);
            return step(0, [index, O[index]]);
          }, "values");
          Iterators.Arguments = Iterators.Array;
          addToUnscopables("keys");
          addToUnscopables("values");
          addToUnscopables("entries");
        },
        /* 85 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          module2.exports = function(done, value) {
            return {
              value,
              done: !!done
            };
          };
        },
        /* 86 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var LIBRARY = __w_pdfjs_require__(32);
          var global2 = __w_pdfjs_require__(8);
          var ctx = __w_pdfjs_require__(23);
          var classof = __w_pdfjs_require__(67);
          var $export = __w_pdfjs_require__(7);
          var isObject2 = __w_pdfjs_require__(13);
          var aFunction = __w_pdfjs_require__(24);
          var anInstance = __w_pdfjs_require__(87);
          var forOf = __w_pdfjs_require__(88);
          var speciesConstructor = __w_pdfjs_require__(89);
          var task = __w_pdfjs_require__(90).set;
          var microtask = __w_pdfjs_require__(92)();
          var newPromiseCapabilityModule = __w_pdfjs_require__(93);
          var perform = __w_pdfjs_require__(94);
          var userAgent = __w_pdfjs_require__(95);
          var promiseResolve = __w_pdfjs_require__(96);
          var PROMISE = "Promise";
          var TypeError2 = global2.TypeError;
          var process$$1 = global2.process;
          var versions$$1 = process$$1 && process$$1.versions;
          var v8 = versions$$1 && versions$$1.v8 || "";
          var $Promise = global2[PROMISE];
          var isNode = classof(process$$1) == "process";
          var empty = function empty2() {
          };
          var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
          var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;
          var USE_NATIVE = !!function() {
            try {
              var promise = $Promise.resolve(1);
              var FakePromise = (promise.constructor = {})[__w_pdfjs_require__(30)("species")] = function(exec) {
                exec(empty, empty);
              };
              return (isNode || typeof PromiseRejectionEvent == "function") && promise.then(empty) instanceof FakePromise && v8.indexOf("6.6") !== 0 && userAgent.indexOf("Chrome/66") === -1;
            } catch (e) {
            }
          }();
          var isThenable = function isThenable2(it) {
            var then;
            return isObject2(it) && typeof (then = it.then) == "function" ? then : false;
          };
          var notify = function notify2(promise, isReject) {
            if (promise._n)
              return;
            promise._n = true;
            var chain = promise._c;
            microtask(function() {
              var value = promise._v;
              var ok = promise._s == 1;
              var i = 0;
              var run = function run2(reaction) {
                var handler = ok ? reaction.ok : reaction.fail;
                var resolve = reaction.resolve;
                var reject = reaction.reject;
                var domain = reaction.domain;
                var result, then, exited;
                try {
                  if (handler) {
                    if (!ok) {
                      if (promise._h == 2)
                        onHandleUnhandled(promise);
                      promise._h = 1;
                    }
                    if (handler === true)
                      result = value;
                    else {
                      if (domain)
                        domain.enter();
                      result = handler(value);
                      if (domain) {
                        domain.exit();
                        exited = true;
                      }
                    }
                    if (result === reaction.promise) {
                      reject(TypeError2("Promise-chain cycle"));
                    } else if (then = isThenable(result)) {
                      then.call(result, resolve, reject);
                    } else
                      resolve(result);
                  } else
                    reject(value);
                } catch (e) {
                  if (domain && !exited)
                    domain.exit();
                  reject(e);
                }
              };
              while (chain.length > i) {
                run(chain[i++]);
              }
              promise._c = [];
              promise._n = false;
              if (isReject && !promise._h)
                onUnhandled(promise);
            });
          };
          var onUnhandled = function onUnhandled2(promise) {
            task.call(global2, function() {
              var value = promise._v;
              var unhandled = isUnhandled(promise);
              var result, handler, console2;
              if (unhandled) {
                result = perform(function() {
                  if (isNode) {
                    process$$1.emit("unhandledRejection", value, promise);
                  } else if (handler = global2.onunhandledrejection) {
                    handler({
                      promise,
                      reason: value
                    });
                  } else if ((console2 = global2.console) && console2.error) {
                    console2.error("Unhandled promise rejection", value);
                  }
                });
                promise._h = isNode || isUnhandled(promise) ? 2 : 1;
              }
              promise._a = void 0;
              if (unhandled && result.e)
                throw result.v;
            });
          };
          var isUnhandled = function isUnhandled2(promise) {
            return promise._h !== 1 && (promise._a || promise._c).length === 0;
          };
          var onHandleUnhandled = function onHandleUnhandled2(promise) {
            task.call(global2, function() {
              var handler;
              if (isNode) {
                process$$1.emit("rejectionHandled", promise);
              } else if (handler = global2.onrejectionhandled) {
                handler({
                  promise,
                  reason: promise._v
                });
              }
            });
          };
          var $reject = function $reject2(value) {
            var promise = this;
            if (promise._d)
              return;
            promise._d = true;
            promise = promise._w || promise;
            promise._v = value;
            promise._s = 2;
            if (!promise._a)
              promise._a = promise._c.slice();
            notify(promise, true);
          };
          var $resolve = function $resolve2(value) {
            var promise = this;
            var then;
            if (promise._d)
              return;
            promise._d = true;
            promise = promise._w || promise;
            try {
              if (promise === value)
                throw TypeError2("Promise can't be resolved itself");
              if (then = isThenable(value)) {
                microtask(function() {
                  var wrapper = {
                    _w: promise,
                    _d: false
                  };
                  try {
                    then.call(value, ctx($resolve2, wrapper, 1), ctx($reject, wrapper, 1));
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
              $reject.call({
                _w: promise,
                _d: false
              }, e);
            }
          };
          if (!USE_NATIVE) {
            $Promise = function Promise2(executor) {
              anInstance(this, $Promise, PROMISE, "_h");
              aFunction(executor);
              Internal.call(this);
              try {
                executor(ctx($resolve, this, 1), ctx($reject, this, 1));
              } catch (err) {
                $reject.call(this, err);
              }
            };
            Internal = function Promise2(executor) {
              this._c = [];
              this._a = void 0;
              this._s = 0;
              this._d = false;
              this._v = void 0;
              this._h = 0;
              this._n = false;
            };
            Internal.prototype = __w_pdfjs_require__(97)($Promise.prototype, {
              then: function then(onFulfilled, onRejected) {
                var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
                reaction.ok = typeof onFulfilled == "function" ? onFulfilled : true;
                reaction.fail = typeof onRejected == "function" && onRejected;
                reaction.domain = isNode ? process$$1.domain : void 0;
                this._c.push(reaction);
                if (this._a)
                  this._a.push(reaction);
                if (this._s)
                  notify(this, false);
                return reaction.promise;
              },
              "catch": function _catch(onRejected) {
                return this.then(void 0, onRejected);
              }
            });
            OwnPromiseCapability = function OwnPromiseCapability2() {
              var promise = new Internal();
              this.promise = promise;
              this.resolve = ctx($resolve, promise, 1);
              this.reject = ctx($reject, promise, 1);
            };
            newPromiseCapabilityModule.f = newPromiseCapability = function newPromiseCapability2(C) {
              return C === $Promise || C === Wrapper ? new OwnPromiseCapability(C) : newGenericPromiseCapability(C);
            };
          }
          $export($export.G + $export.W + $export.F * !USE_NATIVE, {
            Promise: $Promise
          });
          __w_pdfjs_require__(59)($Promise, PROMISE);
          __w_pdfjs_require__(98)(PROMISE);
          Wrapper = __w_pdfjs_require__(9)[PROMISE];
          $export($export.S + $export.F * !USE_NATIVE, PROMISE, {
            reject: function reject(r2) {
              var capability = newPromiseCapability(this);
              var $$reject = capability.reject;
              $$reject(r2);
              return capability.promise;
            }
          });
          $export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
            resolve: function resolve(x) {
              return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
            }
          });
          $export($export.S + $export.F * !(USE_NATIVE && __w_pdfjs_require__(68)(function(iter) {
            $Promise.all(iter)["catch"](empty);
          })), PROMISE, {
            all: function all(iterable) {
              var C = this;
              var capability = newPromiseCapability(C);
              var resolve = capability.resolve;
              var reject = capability.reject;
              var result = perform(function() {
                var values = [];
                var index = 0;
                var remaining = 1;
                forOf(iterable, false, function(promise) {
                  var $index = index++;
                  var alreadyCalled = false;
                  values.push(void 0);
                  remaining++;
                  C.resolve(promise).then(function(value) {
                    if (alreadyCalled)
                      return;
                    alreadyCalled = true;
                    values[$index] = value;
                    --remaining || resolve(values);
                  }, reject);
                });
                --remaining || resolve(values);
              });
              if (result.e)
                reject(result.v);
              return capability.promise;
            },
            race: function race(iterable) {
              var C = this;
              var capability = newPromiseCapability(C);
              var reject = capability.reject;
              var result = perform(function() {
                forOf(iterable, false, function(promise) {
                  C.resolve(promise).then(capability.resolve, reject);
                });
              });
              if (result.e)
                reject(result.v);
              return capability.promise;
            }
          });
        },
        /* 87 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          module2.exports = function(it, Constructor, name, forbiddenField) {
            if (!(it instanceof Constructor) || forbiddenField !== void 0 && forbiddenField in it) {
              throw TypeError(name + ": incorrect invocation!");
            }
            return it;
          };
        },
        /* 88 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var ctx = __w_pdfjs_require__(23);
          var call = __w_pdfjs_require__(63);
          var isArrayIter = __w_pdfjs_require__(64);
          var anObject = __w_pdfjs_require__(12);
          var toLength = __w_pdfjs_require__(25);
          var getIterFn = __w_pdfjs_require__(66);
          var BREAK = {};
          var RETURN = {};
          var _exports = module2.exports = function(iterable, entries, fn, that, ITERATOR) {
            var iterFn = ITERATOR ? function() {
              return iterable;
            } : getIterFn(iterable);
            var f = ctx(fn, that, entries ? 2 : 1);
            var index = 0;
            var length, step, iterator, result;
            if (typeof iterFn != "function")
              throw TypeError(iterable + " is not iterable!");
            if (isArrayIter(iterFn))
              for (length = toLength(iterable.length); length > index; index++) {
                result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
                if (result === BREAK || result === RETURN)
                  return result;
              }
            else
              for (iterator = iterFn.call(iterable); !(step = iterator.next()).done; ) {
                result = call(iterator, f, step.value, entries);
                if (result === BREAK || result === RETURN)
                  return result;
              }
          };
          _exports.BREAK = BREAK;
          _exports.RETURN = RETURN;
        },
        /* 89 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var anObject = __w_pdfjs_require__(12);
          var aFunction = __w_pdfjs_require__(24);
          var SPECIES = __w_pdfjs_require__(30)("species");
          module2.exports = function(O, D) {
            var C = anObject(O).constructor;
            var S;
            return C === void 0 || (S = anObject(C)[SPECIES]) == void 0 ? D : aFunction(S);
          };
        },
        /* 90 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var ctx = __w_pdfjs_require__(23);
          var invoke = __w_pdfjs_require__(91);
          var html = __w_pdfjs_require__(58);
          var cel = __w_pdfjs_require__(17);
          var global2 = __w_pdfjs_require__(8);
          var process$$1 = global2.process;
          var setTask = global2.setImmediate;
          var clearTask = global2.clearImmediate;
          var MessageChannel = global2.MessageChannel;
          var Dispatch = global2.Dispatch;
          var counter = 0;
          var queue2 = {};
          var ONREADYSTATECHANGE = "onreadystatechange";
          var defer, channel, port;
          var run = function run2() {
            var id = +this;
            if (queue2.hasOwnProperty(id)) {
              var fn = queue2[id];
              delete queue2[id];
              fn();
            }
          };
          var listener = function listener2(event) {
            run.call(event.data);
          };
          if (!setTask || !clearTask) {
            setTask = function setImmediate(fn) {
              var args = [];
              var i = 1;
              while (arguments.length > i) {
                args.push(arguments[i++]);
              }
              queue2[++counter] = function() {
                invoke(typeof fn == "function" ? fn : Function(fn), args);
              };
              defer(counter);
              return counter;
            };
            clearTask = function clearImmediate(id) {
              delete queue2[id];
            };
            if (__w_pdfjs_require__(29)(process$$1) == "process") {
              defer = function defer2(id) {
                process$$1.nextTick(ctx(run, id, 1));
              };
            } else if (Dispatch && Dispatch.now) {
              defer = function defer2(id) {
                Dispatch.now(ctx(run, id, 1));
              };
            } else if (MessageChannel) {
              channel = new MessageChannel();
              port = channel.port2;
              channel.port1.onmessage = listener;
              defer = ctx(port.postMessage, port, 1);
            } else if (global2.addEventListener && typeof postMessage == "function" && !global2.importScripts) {
              defer = function defer2(id) {
                global2.postMessage(id + "", "*");
              };
              global2.addEventListener("message", listener, false);
            } else if (ONREADYSTATECHANGE in cel("script")) {
              defer = function defer2(id) {
                html.appendChild(cel("script"))[ONREADYSTATECHANGE] = function() {
                  html.removeChild(this);
                  run.call(id);
                };
              };
            } else {
              defer = function defer2(id) {
                setTimeout(ctx(run, id, 1), 0);
              };
            }
          }
          module2.exports = {
            set: setTask,
            clear: clearTask
          };
        },
        /* 91 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          module2.exports = function(fn, args, that) {
            var un = that === void 0;
            switch (args.length) {
              case 0:
                return un ? fn() : fn.call(that);
              case 1:
                return un ? fn(args[0]) : fn.call(that, args[0]);
              case 2:
                return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
              case 3:
                return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
              case 4:
                return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
            }
            return fn.apply(that, args);
          };
        },
        /* 92 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var global2 = __w_pdfjs_require__(8);
          var macrotask = __w_pdfjs_require__(90).set;
          var Observer = global2.MutationObserver || global2.WebKitMutationObserver;
          var process$$1 = global2.process;
          var Promise2 = global2.Promise;
          var isNode = __w_pdfjs_require__(29)(process$$1) == "process";
          module2.exports = function() {
            var head, last, notify;
            var flush = function flush2() {
              var parent, fn;
              if (isNode && (parent = process$$1.domain))
                parent.exit();
              while (head) {
                fn = head.fn;
                head = head.next;
                try {
                  fn();
                } catch (e) {
                  if (head)
                    notify();
                  else
                    last = void 0;
                  throw e;
                }
              }
              last = void 0;
              if (parent)
                parent.enter();
            };
            if (isNode) {
              notify = function notify2() {
                process$$1.nextTick(flush);
              };
            } else if (Observer && !(global2.navigator && global2.navigator.standalone)) {
              var toggle = true;
              var node = document.createTextNode("");
              new Observer(flush).observe(node, {
                characterData: true
              });
              notify = function notify2() {
                node.data = toggle = !toggle;
              };
            } else if (Promise2 && Promise2.resolve) {
              var promise = Promise2.resolve(void 0);
              notify = function notify2() {
                promise.then(flush);
              };
            } else {
              notify = function notify2() {
                macrotask.call(global2, flush);
              };
            }
            return function(fn) {
              var task = {
                fn,
                next: void 0
              };
              if (last)
                last.next = task;
              if (!head) {
                head = task;
                notify();
              }
              last = task;
            };
          };
        },
        /* 93 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var aFunction = __w_pdfjs_require__(24);
          function PromiseCapability(C) {
            var resolve, reject;
            this.promise = new C(function($$resolve, $$reject) {
              if (resolve !== void 0 || reject !== void 0)
                throw TypeError("Bad Promise constructor");
              resolve = $$resolve;
              reject = $$reject;
            });
            this.resolve = aFunction(resolve);
            this.reject = aFunction(reject);
          }
          module2.exports.f = function(C) {
            return new PromiseCapability(C);
          };
        },
        /* 94 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          module2.exports = function(exec) {
            try {
              return {
                e: false,
                v: exec()
              };
            } catch (e) {
              return {
                e: true,
                v: e
              };
            }
          };
        },
        /* 95 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var global2 = __w_pdfjs_require__(8);
          var navigator2 = global2.navigator;
          module2.exports = navigator2 && navigator2.userAgent || "";
        },
        /* 96 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var anObject = __w_pdfjs_require__(12);
          var isObject2 = __w_pdfjs_require__(13);
          var newPromiseCapability = __w_pdfjs_require__(93);
          module2.exports = function(C, x) {
            anObject(C);
            if (isObject2(x) && x.constructor === C)
              return x;
            var promiseCapability = newPromiseCapability.f(C);
            var resolve = promiseCapability.resolve;
            resolve(x);
            return promiseCapability.promise;
          };
        },
        /* 97 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var redefine = __w_pdfjs_require__(20);
          module2.exports = function(target, src, safe) {
            for (var key in src) {
              redefine(target, key, src[key], safe);
            }
            return target;
          };
        },
        /* 98 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var global2 = __w_pdfjs_require__(8);
          var dP = __w_pdfjs_require__(11);
          var DESCRIPTORS = __w_pdfjs_require__(15);
          var SPECIES = __w_pdfjs_require__(30)("species");
          module2.exports = function(KEY) {
            var C = global2[KEY];
            if (DESCRIPTORS && C && !C[SPECIES])
              dP.f(C, SPECIES, {
                configurable: true,
                get: function get() {
                  return this;
                }
              });
          };
        },
        /* 99 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $export = __w_pdfjs_require__(7);
          var core = __w_pdfjs_require__(9);
          var global2 = __w_pdfjs_require__(8);
          var speciesConstructor = __w_pdfjs_require__(89);
          var promiseResolve = __w_pdfjs_require__(96);
          $export($export.P + $export.R, "Promise", {
            "finally": function _finally(onFinally) {
              var C = speciesConstructor(this, core.Promise || global2.Promise);
              var isFunction = typeof onFinally == "function";
              return this.then(isFunction ? function(x) {
                return promiseResolve(C, onFinally()).then(function() {
                  return x;
                });
              } : onFinally, isFunction ? function(e) {
                return promiseResolve(C, onFinally()).then(function() {
                  throw e;
                });
              } : onFinally);
            }
          });
        },
        /* 100 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $export = __w_pdfjs_require__(7);
          var newPromiseCapability = __w_pdfjs_require__(93);
          var perform = __w_pdfjs_require__(94);
          $export($export.S, "Promise", {
            "try": function _try(callbackfn) {
              var promiseCapability = newPromiseCapability.f(this);
              var result = perform(callbackfn);
              (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
              return promiseCapability.promise;
            }
          });
        },
        /* 101 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(82);
          __w_pdfjs_require__(83);
          __w_pdfjs_require__(102);
          __w_pdfjs_require__(114);
          __w_pdfjs_require__(116);
          module2.exports = __w_pdfjs_require__(9).WeakMap;
        },
        /* 102 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var each = __w_pdfjs_require__(103)(0);
          var redefine = __w_pdfjs_require__(20);
          var meta = __w_pdfjs_require__(107);
          var assign = __w_pdfjs_require__(71);
          var weak = __w_pdfjs_require__(108);
          var isObject2 = __w_pdfjs_require__(13);
          var fails = __w_pdfjs_require__(16);
          var validate = __w_pdfjs_require__(109);
          var WEAK_MAP = "WeakMap";
          var getWeak = meta.getWeak;
          var isExtensible = Object.isExtensible;
          var uncaughtFrozenStore = weak.ufstore;
          var tmp = {};
          var InternalMap;
          var wrapper = function wrapper2(get) {
            return function WeakMap2() {
              return get(this, arguments.length > 0 ? arguments[0] : void 0);
            };
          };
          var methods = {
            get: function get(key) {
              if (isObject2(key)) {
                var data = getWeak(key);
                if (data === true)
                  return uncaughtFrozenStore(validate(this, WEAK_MAP)).get(key);
                return data ? data[this._i] : void 0;
              }
            },
            set: function set(key, value) {
              return weak.def(validate(this, WEAK_MAP), key, value);
            }
          };
          var $WeakMap = module2.exports = __w_pdfjs_require__(110)(WEAK_MAP, wrapper, methods, weak, true, true);
          if (fails(function() {
            return new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7;
          })) {
            InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
            assign(InternalMap.prototype, methods);
            meta.NEED = true;
            each(["delete", "has", "get", "set"], function(key) {
              var proto = $WeakMap.prototype;
              var method = proto[key];
              redefine(proto, key, function(a2, b) {
                if (isObject2(a2) && !isExtensible(a2)) {
                  if (!this._f)
                    this._f = new InternalMap();
                  var result = this._f[key](a2, b);
                  return key == "set" ? this : result;
                }
                return method.call(this, a2, b);
              });
            });
          }
        },
        /* 103 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var ctx = __w_pdfjs_require__(23);
          var IObject = __w_pdfjs_require__(43);
          var toObject = __w_pdfjs_require__(61);
          var toLength = __w_pdfjs_require__(25);
          var asc = __w_pdfjs_require__(104);
          module2.exports = function(TYPE, $create) {
            var IS_MAP = TYPE == 1;
            var IS_FILTER = TYPE == 2;
            var IS_SOME = TYPE == 3;
            var IS_EVERY = TYPE == 4;
            var IS_FIND_INDEX = TYPE == 6;
            var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
            var create = $create || asc;
            return function($this, callbackfn, that) {
              var O = toObject($this);
              var self2 = IObject(O);
              var f = ctx(callbackfn, that, 3);
              var length = toLength(self2.length);
              var index = 0;
              var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : void 0;
              var val, res;
              for (; length > index; index++) {
                if (NO_HOLES || index in self2) {
                  val = self2[index];
                  res = f(val, index, O);
                  if (TYPE) {
                    if (IS_MAP)
                      result[index] = res;
                    else if (res)
                      switch (TYPE) {
                        case 3:
                          return true;
                        case 5:
                          return val;
                        case 6:
                          return index;
                        case 2:
                          result.push(val);
                      }
                    else if (IS_EVERY)
                      return false;
                  }
                }
              }
              return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
            };
          };
        },
        /* 104 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var speciesConstructor = __w_pdfjs_require__(105);
          module2.exports = function(original, length) {
            return new (speciesConstructor(original))(length);
          };
        },
        /* 105 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var isObject2 = __w_pdfjs_require__(13);
          var isArray2 = __w_pdfjs_require__(106);
          var SPECIES = __w_pdfjs_require__(30)("species");
          module2.exports = function(original) {
            var C;
            if (isArray2(original)) {
              C = original.constructor;
              if (typeof C == "function" && (C === Array || isArray2(C.prototype)))
                C = void 0;
              if (isObject2(C)) {
                C = C[SPECIES];
                if (C === null)
                  C = void 0;
              }
            }
            return C === void 0 ? Array : C;
          };
        },
        /* 106 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var cof = __w_pdfjs_require__(29);
          module2.exports = Array.isArray || function isArray2(arg) {
            return cof(arg) == "Array";
          };
        },
        /* 107 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          function _typeof(obj) {
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
              _typeof = function _typeof2(obj2) {
                return typeof obj2;
              };
            } else {
              _typeof = function _typeof2(obj2) {
                return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
              };
            }
            return _typeof(obj);
          }
          var META = __w_pdfjs_require__(22)("meta");
          var isObject2 = __w_pdfjs_require__(13);
          var has = __w_pdfjs_require__(21);
          var setDesc = __w_pdfjs_require__(11).f;
          var id = 0;
          var isExtensible = Object.isExtensible || function() {
            return true;
          };
          var FREEZE = !__w_pdfjs_require__(16)(function() {
            return isExtensible(Object.preventExtensions({}));
          });
          var setMeta = function setMeta2(it) {
            setDesc(it, META, {
              value: {
                i: "O" + ++id,
                w: {}
              }
            });
          };
          var fastKey = function fastKey2(it, create) {
            if (!isObject2(it))
              return _typeof(it) == "symbol" ? it : (typeof it == "string" ? "S" : "P") + it;
            if (!has(it, META)) {
              if (!isExtensible(it))
                return "F";
              if (!create)
                return "E";
              setMeta(it);
            }
            return it[META].i;
          };
          var getWeak = function getWeak2(it, create) {
            if (!has(it, META)) {
              if (!isExtensible(it))
                return true;
              if (!create)
                return false;
              setMeta(it);
            }
            return it[META].w;
          };
          var onFreeze = function onFreeze2(it) {
            if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META))
              setMeta(it);
            return it;
          };
          var meta = module2.exports = {
            KEY: META,
            NEED: false,
            fastKey,
            getWeak,
            onFreeze
          };
        },
        /* 108 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var redefineAll = __w_pdfjs_require__(97);
          var getWeak = __w_pdfjs_require__(107).getWeak;
          var anObject = __w_pdfjs_require__(12);
          var isObject2 = __w_pdfjs_require__(13);
          var anInstance = __w_pdfjs_require__(87);
          var forOf = __w_pdfjs_require__(88);
          var createArrayMethod = __w_pdfjs_require__(103);
          var $has = __w_pdfjs_require__(21);
          var validate = __w_pdfjs_require__(109);
          var arrayFind = createArrayMethod(5);
          var arrayFindIndex = createArrayMethod(6);
          var id = 0;
          var uncaughtFrozenStore = function uncaughtFrozenStore2(that) {
            return that._l || (that._l = new UncaughtFrozenStore());
          };
          var UncaughtFrozenStore = function UncaughtFrozenStore2() {
            this.a = [];
          };
          var findUncaughtFrozen = function findUncaughtFrozen2(store, key) {
            return arrayFind(store.a, function(it) {
              return it[0] === key;
            });
          };
          UncaughtFrozenStore.prototype = {
            get: function get(key) {
              var entry = findUncaughtFrozen(this, key);
              if (entry)
                return entry[1];
            },
            has: function has(key) {
              return !!findUncaughtFrozen(this, key);
            },
            set: function set(key, value) {
              var entry = findUncaughtFrozen(this, key);
              if (entry)
                entry[1] = value;
              else
                this.a.push([key, value]);
            },
            "delete": function _delete(key) {
              var index = arrayFindIndex(this.a, function(it) {
                return it[0] === key;
              });
              if (~index)
                this.a.splice(index, 1);
              return !!~index;
            }
          };
          module2.exports = {
            getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
              var C = wrapper(function(that, iterable) {
                anInstance(that, C, NAME, "_i");
                that._t = NAME;
                that._i = id++;
                that._l = void 0;
                if (iterable != void 0)
                  forOf(iterable, IS_MAP, that[ADDER], that);
              });
              redefineAll(C.prototype, {
                "delete": function _delete(key) {
                  if (!isObject2(key))
                    return false;
                  var data = getWeak(key);
                  if (data === true)
                    return uncaughtFrozenStore(validate(this, NAME))["delete"](key);
                  return data && $has(data, this._i) && delete data[this._i];
                },
                has: function has(key) {
                  if (!isObject2(key))
                    return false;
                  var data = getWeak(key);
                  if (data === true)
                    return uncaughtFrozenStore(validate(this, NAME)).has(key);
                  return data && $has(data, this._i);
                }
              });
              return C;
            },
            def: function def(that, key, value) {
              var data = getWeak(anObject(key), true);
              if (data === true)
                uncaughtFrozenStore(that).set(key, value);
              else
                data[that._i] = value;
              return that;
            },
            ufstore: uncaughtFrozenStore
          };
        },
        /* 109 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var isObject2 = __w_pdfjs_require__(13);
          module2.exports = function(it, TYPE) {
            if (!isObject2(it) || it._t !== TYPE)
              throw TypeError("Incompatible receiver, " + TYPE + " required!");
            return it;
          };
        },
        /* 110 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var global2 = __w_pdfjs_require__(8);
          var $export = __w_pdfjs_require__(7);
          var redefine = __w_pdfjs_require__(20);
          var redefineAll = __w_pdfjs_require__(97);
          var meta = __w_pdfjs_require__(107);
          var forOf = __w_pdfjs_require__(88);
          var anInstance = __w_pdfjs_require__(87);
          var isObject2 = __w_pdfjs_require__(13);
          var fails = __w_pdfjs_require__(16);
          var $iterDetect = __w_pdfjs_require__(68);
          var setToStringTag = __w_pdfjs_require__(59);
          var inheritIfRequired = __w_pdfjs_require__(111);
          module2.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
            var Base = global2[NAME];
            var C = Base;
            var ADDER = IS_MAP ? "set" : "add";
            var proto = C && C.prototype;
            var O = {};
            var fixMethod = function fixMethod2(KEY) {
              var fn = proto[KEY];
              redefine(proto, KEY, KEY == "delete" ? function(a2) {
                return IS_WEAK && !isObject2(a2) ? false : fn.call(this, a2 === 0 ? 0 : a2);
              } : KEY == "has" ? function has(a2) {
                return IS_WEAK && !isObject2(a2) ? false : fn.call(this, a2 === 0 ? 0 : a2);
              } : KEY == "get" ? function get(a2) {
                return IS_WEAK && !isObject2(a2) ? void 0 : fn.call(this, a2 === 0 ? 0 : a2);
              } : KEY == "add" ? function add(a2) {
                fn.call(this, a2 === 0 ? 0 : a2);
                return this;
              } : function set(a2, b) {
                fn.call(this, a2 === 0 ? 0 : a2, b);
                return this;
              });
            };
            if (typeof C != "function" || !(IS_WEAK || proto.forEach && !fails(function() {
              new C().entries().next();
            }))) {
              C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
              redefineAll(C.prototype, methods);
              meta.NEED = true;
            } else {
              var instance = new C();
              var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
              var THROWS_ON_PRIMITIVES = fails(function() {
                instance.has(1);
              });
              var ACCEPT_ITERABLES = $iterDetect(function(iter) {
                new C(iter);
              });
              var BUGGY_ZERO = !IS_WEAK && fails(function() {
                var $instance = new C();
                var index = 5;
                while (index--) {
                  $instance[ADDER](index, index);
                }
                return !$instance.has(-0);
              });
              if (!ACCEPT_ITERABLES) {
                C = wrapper(function(target, iterable) {
                  anInstance(target, C, NAME);
                  var that = inheritIfRequired(new Base(), target, C);
                  if (iterable != void 0)
                    forOf(iterable, IS_MAP, that[ADDER], that);
                  return that;
                });
                C.prototype = proto;
                proto.constructor = C;
              }
              if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
                fixMethod("delete");
                fixMethod("has");
                IS_MAP && fixMethod("get");
              }
              if (BUGGY_ZERO || HASNT_CHAINING)
                fixMethod(ADDER);
              if (IS_WEAK && proto.clear)
                delete proto.clear;
            }
            setToStringTag(C, NAME);
            O[NAME] = C;
            $export($export.G + $export.W + $export.F * (C != Base), O);
            if (!IS_WEAK)
              common.setStrong(C, NAME, IS_MAP);
            return C;
          };
        },
        /* 111 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var isObject2 = __w_pdfjs_require__(13);
          var setPrototypeOf = __w_pdfjs_require__(112).set;
          module2.exports = function(that, target, C) {
            var S = target.constructor;
            var P;
            if (S !== C && typeof S == "function" && (P = S.prototype) !== C.prototype && isObject2(P) && setPrototypeOf) {
              setPrototypeOf(that, P);
            }
            return that;
          };
        },
        /* 112 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var isObject2 = __w_pdfjs_require__(13);
          var anObject = __w_pdfjs_require__(12);
          var check = function check2(O, proto) {
            anObject(O);
            if (!isObject2(proto) && proto !== null)
              throw TypeError(proto + ": can't set as prototype!");
          };
          module2.exports = {
            set: Object.setPrototypeOf || ("__proto__" in {} ? function(test, buggy, set) {
              try {
                set = __w_pdfjs_require__(23)(Function.call, __w_pdfjs_require__(113).f(Object.prototype, "__proto__").set, 2);
                set(test, []);
                buggy = !(test instanceof Array);
              } catch (e) {
                buggy = true;
              }
              return function setPrototypeOf(O, proto) {
                check(O, proto);
                if (buggy)
                  O.__proto__ = proto;
                else
                  set(O, proto);
                return O;
              };
            }({}, false) : void 0),
            check
          };
        },
        /* 113 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var pIE = __w_pdfjs_require__(73);
          var createDesc = __w_pdfjs_require__(19);
          var toIObject = __w_pdfjs_require__(42);
          var toPrimitive = __w_pdfjs_require__(18);
          var has = __w_pdfjs_require__(21);
          var IE8_DOM_DEFINE = __w_pdfjs_require__(14);
          var gOPD = Object.getOwnPropertyDescriptor;
          exports2.f = __w_pdfjs_require__(15) ? gOPD : function getOwnPropertyDescriptor(O, P) {
            O = toIObject(O);
            P = toPrimitive(P, true);
            if (IE8_DOM_DEFINE)
              try {
                return gOPD(O, P);
              } catch (e) {
              }
            if (has(O, P))
              return createDesc(!pIE.f.call(O, P), O[P]);
          };
        },
        /* 114 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(115)("WeakMap");
        },
        /* 115 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $export = __w_pdfjs_require__(7);
          module2.exports = function(COLLECTION) {
            $export($export.S, COLLECTION, {
              of: function of() {
                var length = arguments.length;
                var A = new Array(length);
                while (length--) {
                  A[length] = arguments[length];
                }
                return new this(A);
              }
            });
          };
        },
        /* 116 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(117)("WeakMap");
        },
        /* 117 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $export = __w_pdfjs_require__(7);
          var aFunction = __w_pdfjs_require__(24);
          var ctx = __w_pdfjs_require__(23);
          var forOf = __w_pdfjs_require__(88);
          module2.exports = function(COLLECTION) {
            $export($export.S, COLLECTION, {
              from: function from2(source) {
                var mapFn = arguments[1];
                var mapping, A, n2, cb;
                aFunction(this);
                mapping = mapFn !== void 0;
                if (mapping)
                  aFunction(mapFn);
                if (source == void 0)
                  return new this();
                A = [];
                if (mapping) {
                  n2 = 0;
                  cb = ctx(mapFn, arguments[2], 2);
                  forOf(source, false, function(nextItem) {
                    A.push(cb(nextItem, n2++));
                  });
                } else {
                  forOf(source, false, A.push, A);
                }
                return new this(A);
              }
            });
          };
        },
        /* 118 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(82);
          __w_pdfjs_require__(83);
          __w_pdfjs_require__(119);
          __w_pdfjs_require__(120);
          __w_pdfjs_require__(121);
          module2.exports = __w_pdfjs_require__(9).WeakSet;
        },
        /* 119 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var weak = __w_pdfjs_require__(108);
          var validate = __w_pdfjs_require__(109);
          var WEAK_SET = "WeakSet";
          __w_pdfjs_require__(110)(WEAK_SET, function(get) {
            return function WeakSet2() {
              return get(this, arguments.length > 0 ? arguments[0] : void 0);
            };
          }, {
            add: function add(value) {
              return weak.def(validate(this, WEAK_SET), value, true);
            }
          }, weak, false, true);
        },
        /* 120 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(115)("WeakSet");
        },
        /* 121 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(117)("WeakSet");
        },
        /* 122 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(123);
          module2.exports = __w_pdfjs_require__(9).String.codePointAt;
        },
        /* 123 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $export = __w_pdfjs_require__(7);
          var $at = __w_pdfjs_require__(48)(false);
          $export($export.P, "String", {
            codePointAt: function codePointAt(pos) {
              return $at(this, pos);
            }
          });
        },
        /* 124 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(125);
          module2.exports = __w_pdfjs_require__(9).String.fromCodePoint;
        },
        /* 125 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $export = __w_pdfjs_require__(7);
          var toAbsoluteIndex = __w_pdfjs_require__(44);
          var fromCharCode = String.fromCharCode;
          var $fromCodePoint = String.fromCodePoint;
          $export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), "String", {
            fromCodePoint: function fromCodePoint(x) {
              var res = [];
              var aLen = arguments.length;
              var i = 0;
              var code;
              while (aLen > i) {
                code = +arguments[i++];
                if (toAbsoluteIndex(code, 1114111) !== code)
                  throw RangeError(code + " is not a valid code point");
                res.push(code < 65536 ? fromCharCode(code) : fromCharCode(((code -= 65536) >> 10) + 55296, code % 1024 + 56320));
              }
              return res.join("");
            }
          });
        },
        /* 126 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(127);
          __w_pdfjs_require__(82);
          module2.exports = __w_pdfjs_require__(9).Symbol;
        },
        /* 127 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          function _typeof(obj) {
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
              _typeof = function _typeof2(obj2) {
                return typeof obj2;
              };
            } else {
              _typeof = function _typeof2(obj2) {
                return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
              };
            }
            return _typeof(obj);
          }
          var global2 = __w_pdfjs_require__(8);
          var has = __w_pdfjs_require__(21);
          var DESCRIPTORS = __w_pdfjs_require__(15);
          var $export = __w_pdfjs_require__(7);
          var redefine = __w_pdfjs_require__(20);
          var META = __w_pdfjs_require__(107).KEY;
          var $fails = __w_pdfjs_require__(16);
          var shared = __w_pdfjs_require__(31);
          var setToStringTag = __w_pdfjs_require__(59);
          var uid = __w_pdfjs_require__(22);
          var wks = __w_pdfjs_require__(30);
          var wksExt = __w_pdfjs_require__(128);
          var wksDefine = __w_pdfjs_require__(129);
          var enumKeys = __w_pdfjs_require__(130);
          var isArray2 = __w_pdfjs_require__(106);
          var anObject = __w_pdfjs_require__(12);
          var isObject2 = __w_pdfjs_require__(13);
          var toIObject = __w_pdfjs_require__(42);
          var toPrimitive = __w_pdfjs_require__(18);
          var createDesc = __w_pdfjs_require__(19);
          var _create = __w_pdfjs_require__(52);
          var gOPNExt = __w_pdfjs_require__(131);
          var $GOPD = __w_pdfjs_require__(113);
          var $DP = __w_pdfjs_require__(11);
          var $keys = __w_pdfjs_require__(54);
          var gOPD = $GOPD.f;
          var dP = $DP.f;
          var gOPN = gOPNExt.f;
          var $Symbol = global2.Symbol;
          var $JSON = global2.JSON;
          var _stringify = $JSON && $JSON.stringify;
          var PROTOTYPE = "prototype";
          var HIDDEN = wks("_hidden");
          var TO_PRIMITIVE = wks("toPrimitive");
          var isEnum = {}.propertyIsEnumerable;
          var SymbolRegistry = shared("symbol-registry");
          var AllSymbols = shared("symbols");
          var OPSymbols = shared("op-symbols");
          var ObjectProto = Object[PROTOTYPE];
          var USE_NATIVE = typeof $Symbol == "function";
          var QObject = global2.QObject;
          var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
          var setSymbolDesc = DESCRIPTORS && $fails(function() {
            return _create(dP({}, "a", {
              get: function get() {
                return dP(this, "a", {
                  value: 7
                }).a;
              }
            })).a != 7;
          }) ? function(it, key, D) {
            var protoDesc = gOPD(ObjectProto, key);
            if (protoDesc)
              delete ObjectProto[key];
            dP(it, key, D);
            if (protoDesc && it !== ObjectProto)
              dP(ObjectProto, key, protoDesc);
          } : dP;
          var wrap = function wrap2(tag) {
            var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
            sym._k = tag;
            return sym;
          };
          var isSymbol = USE_NATIVE && _typeof($Symbol.iterator) == "symbol" ? function(it) {
            return _typeof(it) == "symbol";
          } : function(it) {
            return it instanceof $Symbol;
          };
          var $defineProperty = function defineProperty(it, key, D) {
            if (it === ObjectProto)
              $defineProperty(OPSymbols, key, D);
            anObject(it);
            key = toPrimitive(key, true);
            anObject(D);
            if (has(AllSymbols, key)) {
              if (!D.enumerable) {
                if (!has(it, HIDDEN))
                  dP(it, HIDDEN, createDesc(1, {}));
                it[HIDDEN][key] = true;
              } else {
                if (has(it, HIDDEN) && it[HIDDEN][key])
                  it[HIDDEN][key] = false;
                D = _create(D, {
                  enumerable: createDesc(0, false)
                });
              }
              return setSymbolDesc(it, key, D);
            }
            return dP(it, key, D);
          };
          var $defineProperties = function defineProperties(it, P) {
            anObject(it);
            var keys = enumKeys(P = toIObject(P));
            var i = 0;
            var l2 = keys.length;
            var key;
            while (l2 > i) {
              $defineProperty(it, key = keys[i++], P[key]);
            }
            return it;
          };
          var $create = function create(it, P) {
            return P === void 0 ? _create(it) : $defineProperties(_create(it), P);
          };
          var $propertyIsEnumerable = function propertyIsEnumerable(key) {
            var E = isEnum.call(this, key = toPrimitive(key, true));
            if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))
              return false;
            return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
          };
          var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
            it = toIObject(it);
            key = toPrimitive(key, true);
            if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))
              return;
            var D = gOPD(it, key);
            if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))
              D.enumerable = true;
            return D;
          };
          var $getOwnPropertyNames = function getOwnPropertyNames(it) {
            var names = gOPN(toIObject(it));
            var result = [];
            var i = 0;
            var key;
            while (names.length > i) {
              if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)
                result.push(key);
            }
            return result;
          };
          var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
            var IS_OP = it === ObjectProto;
            var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
            var result = [];
            var i = 0;
            var key;
            while (names.length > i) {
              if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))
                result.push(AllSymbols[key]);
            }
            return result;
          };
          if (!USE_NATIVE) {
            $Symbol = function _Symbol() {
              if (this instanceof $Symbol)
                throw TypeError("Symbol is not a constructor!");
              var tag = uid(arguments.length > 0 ? arguments[0] : void 0);
              var $set = function $set2(value) {
                if (this === ObjectProto)
                  $set2.call(OPSymbols, value);
                if (has(this, HIDDEN) && has(this[HIDDEN], tag))
                  this[HIDDEN][tag] = false;
                setSymbolDesc(this, tag, createDesc(1, value));
              };
              if (DESCRIPTORS && setter)
                setSymbolDesc(ObjectProto, tag, {
                  configurable: true,
                  set: $set
                });
              return wrap(tag);
            };
            redefine($Symbol[PROTOTYPE], "toString", function toString3() {
              return this._k;
            });
            $GOPD.f = $getOwnPropertyDescriptor;
            $DP.f = $defineProperty;
            __w_pdfjs_require__(132).f = gOPNExt.f = $getOwnPropertyNames;
            __w_pdfjs_require__(73).f = $propertyIsEnumerable;
            __w_pdfjs_require__(72).f = $getOwnPropertySymbols;
            if (DESCRIPTORS && !__w_pdfjs_require__(32)) {
              redefine(ObjectProto, "propertyIsEnumerable", $propertyIsEnumerable, true);
            }
            wksExt.f = function(name) {
              return wrap(wks(name));
            };
          }
          $export($export.G + $export.W + $export.F * !USE_NATIVE, {
            Symbol: $Symbol
          });
          for (var es6Symbols = "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), j = 0; es6Symbols.length > j; ) {
            wks(es6Symbols[j++]);
          }
          for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k; ) {
            wksDefine(wellKnownSymbols[k++]);
          }
          $export($export.S + $export.F * !USE_NATIVE, "Symbol", {
            "for": function _for(key) {
              return has(SymbolRegistry, key += "") ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
            },
            keyFor: function keyFor(sym) {
              if (!isSymbol(sym))
                throw TypeError(sym + " is not a symbol!");
              for (var key in SymbolRegistry) {
                if (SymbolRegistry[key] === sym)
                  return key;
              }
            },
            useSetter: function useSetter() {
              setter = true;
            },
            useSimple: function useSimple() {
              setter = false;
            }
          });
          $export($export.S + $export.F * !USE_NATIVE, "Object", {
            create: $create,
            defineProperty: $defineProperty,
            defineProperties: $defineProperties,
            getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
            getOwnPropertyNames: $getOwnPropertyNames,
            getOwnPropertySymbols: $getOwnPropertySymbols
          });
          $JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function() {
            var S = $Symbol();
            return _stringify([S]) != "[null]" || _stringify({
              a: S
            }) != "{}" || _stringify(Object(S)) != "{}";
          })), "JSON", {
            stringify: function stringify2(it) {
              var args = [it];
              var i = 1;
              var replacer, $replacer;
              while (arguments.length > i) {
                args.push(arguments[i++]);
              }
              $replacer = replacer = args[1];
              if (!isObject2(replacer) && it === void 0 || isSymbol(it))
                return;
              if (!isArray2(replacer))
                replacer = function replacer2(key, value) {
                  if (typeof $replacer == "function")
                    value = $replacer.call(this, key, value);
                  if (!isSymbol(value))
                    return value;
                };
              args[1] = replacer;
              return _stringify.apply($JSON, args);
            }
          });
          $Symbol[PROTOTYPE][TO_PRIMITIVE] || __w_pdfjs_require__(10)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
          setToStringTag($Symbol, "Symbol");
          setToStringTag(Math, "Math", true);
          setToStringTag(global2.JSON, "JSON", true);
        },
        /* 128 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          exports2.f = __w_pdfjs_require__(30);
        },
        /* 129 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var global2 = __w_pdfjs_require__(8);
          var core = __w_pdfjs_require__(9);
          var LIBRARY = __w_pdfjs_require__(32);
          var wksExt = __w_pdfjs_require__(128);
          var defineProperty = __w_pdfjs_require__(11).f;
          module2.exports = function(name) {
            var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global2.Symbol || {});
            if (name.charAt(0) != "_" && !(name in $Symbol))
              defineProperty($Symbol, name, {
                value: wksExt.f(name)
              });
          };
        },
        /* 130 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var getKeys = __w_pdfjs_require__(54);
          var gOPS = __w_pdfjs_require__(72);
          var pIE = __w_pdfjs_require__(73);
          module2.exports = function(it) {
            var result = getKeys(it);
            var getSymbols = gOPS.f;
            if (getSymbols) {
              var symbols = getSymbols(it);
              var isEnum = pIE.f;
              var i = 0;
              var key;
              while (symbols.length > i) {
                if (isEnum.call(it, key = symbols[i++]))
                  result.push(key);
              }
            }
            return result;
          };
        },
        /* 131 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          function _typeof(obj) {
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
              _typeof = function _typeof2(obj2) {
                return typeof obj2;
              };
            } else {
              _typeof = function _typeof2(obj2) {
                return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
              };
            }
            return _typeof(obj);
          }
          var toIObject = __w_pdfjs_require__(42);
          var gOPN = __w_pdfjs_require__(132).f;
          var toString3 = {}.toString;
          var windowNames = (typeof window === "undefined" ? "undefined" : _typeof(window)) == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
          var getWindowNames = function getWindowNames2(it) {
            try {
              return gOPN(it);
            } catch (e) {
              return windowNames.slice();
            }
          };
          module2.exports.f = function getOwnPropertyNames(it) {
            return windowNames && toString3.call(it) == "[object Window]" ? getWindowNames(it) : gOPN(toIObject(it));
          };
        },
        /* 132 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $keys = __w_pdfjs_require__(55);
          var hiddenKeys = __w_pdfjs_require__(57).concat("length", "prototype");
          exports2.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
            return $keys(O, hiddenKeys);
          };
        },
        /* 133 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(134);
          module2.exports = __w_pdfjs_require__(9).String.padStart;
        },
        /* 134 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $export = __w_pdfjs_require__(7);
          var $pad = __w_pdfjs_require__(135);
          var userAgent = __w_pdfjs_require__(95);
          $export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), "String", {
            padStart: function padStart(maxLength) {
              return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : void 0, true);
            }
          });
        },
        /* 135 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var toLength = __w_pdfjs_require__(25);
          var repeat = __w_pdfjs_require__(136);
          var defined = __w_pdfjs_require__(33);
          module2.exports = function(that, maxLength, fillString, left) {
            var S = String(defined(that));
            var stringLength = S.length;
            var fillStr = fillString === void 0 ? " " : String(fillString);
            var intMaxLength = toLength(maxLength);
            if (intMaxLength <= stringLength || fillStr == "")
              return S;
            var fillLen = intMaxLength - stringLength;
            var stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
            if (stringFiller.length > fillLen)
              stringFiller = stringFiller.slice(0, fillLen);
            return left ? stringFiller + S : S + stringFiller;
          };
        },
        /* 136 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var toInteger = __w_pdfjs_require__(26);
          var defined = __w_pdfjs_require__(33);
          module2.exports = function repeat(count) {
            var str = String(defined(this));
            var res = "";
            var n2 = toInteger(count);
            if (n2 < 0 || n2 == Infinity)
              throw RangeError("Count can't be negative");
            for (; n2 > 0; (n2 >>>= 1) && (str += str)) {
              if (n2 & 1)
                res += str;
            }
            return res;
          };
        },
        /* 137 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(138);
          module2.exports = __w_pdfjs_require__(9).String.padEnd;
        },
        /* 138 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $export = __w_pdfjs_require__(7);
          var $pad = __w_pdfjs_require__(135);
          var userAgent = __w_pdfjs_require__(95);
          $export($export.P + $export.F * /Version\/10\.\d+(\.\d+)? Safari\//.test(userAgent), "String", {
            padEnd: function padEnd(maxLength) {
              return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : void 0, false);
            }
          });
        },
        /* 139 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          __w_pdfjs_require__(140);
          module2.exports = __w_pdfjs_require__(9).Object.values;
        },
        /* 140 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var $export = __w_pdfjs_require__(7);
          var $values = __w_pdfjs_require__(141)(false);
          $export($export.S, "Object", {
            values: function values(it) {
              return $values(it);
            }
          });
        },
        /* 141 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var getKeys = __w_pdfjs_require__(54);
          var toIObject = __w_pdfjs_require__(42);
          var isEnum = __w_pdfjs_require__(73).f;
          module2.exports = function(isEntries) {
            return function(it) {
              var O = toIObject(it);
              var keys = getKeys(O);
              var length = keys.length;
              var i = 0;
              var result = [];
              var key;
              while (length > i) {
                if (isEnum.call(O, key = keys[i++])) {
                  result.push(isEntries ? [key, O[key]] : O[key]);
                }
              }
              return result;
            };
          };
        },
        /* 142 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          {
            var isReadableStreamSupported = false;
            if (typeof ReadableStream !== "undefined") {
              try {
                new ReadableStream({
                  start: function start(controller) {
                    controller.close();
                  }
                });
                isReadableStreamSupported = true;
              } catch (e) {
              }
            }
            if (isReadableStreamSupported) {
              exports2.ReadableStream = ReadableStream;
            } else {
              exports2.ReadableStream = __w_pdfjs_require__(143).ReadableStream;
            }
          }
        },
        /* 143 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          function _typeof2(obj) {
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
              _typeof2 = function _typeof22(obj2) {
                return typeof obj2;
              };
            } else {
              _typeof2 = function _typeof22(obj2) {
                return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
              };
            }
            return _typeof2(obj);
          }
          (function(e, a2) {
            for (var i in a2) {
              e[i] = a2[i];
            }
          })(exports2, function(modules) {
            var installedModules = {};
            function __w_pdfjs_require__2(moduleId) {
              if (installedModules[moduleId])
                return installedModules[moduleId].exports;
              var module3 = installedModules[moduleId] = {
                i: moduleId,
                l: false,
                exports: {}
              };
              modules[moduleId].call(module3.exports, module3, module3.exports, __w_pdfjs_require__2);
              module3.l = true;
              return module3.exports;
            }
            __w_pdfjs_require__2.m = modules;
            __w_pdfjs_require__2.c = installedModules;
            __w_pdfjs_require__2.i = function(value) {
              return value;
            };
            __w_pdfjs_require__2.d = function(exports3, name, getter) {
              if (!__w_pdfjs_require__2.o(exports3, name)) {
                Object.defineProperty(exports3, name, {
                  configurable: false,
                  enumerable: true,
                  get: getter
                });
              }
            };
            __w_pdfjs_require__2.n = function(module3) {
              var getter = module3 && module3.__esModule ? function getDefault() {
                return module3["default"];
              } : function getModuleExports() {
                return module3;
              };
              __w_pdfjs_require__2.d(getter, "a", getter);
              return getter;
            };
            __w_pdfjs_require__2.o = function(object, property) {
              return Object.prototype.hasOwnProperty.call(object, property);
            };
            __w_pdfjs_require__2.p = "";
            return __w_pdfjs_require__2(__w_pdfjs_require__2.s = 7);
          }([function(module3, exports3, __w_pdfjs_require__2) {
            var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function(obj) {
              return _typeof2(obj);
            } : function(obj) {
              return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
            };
            var _require = __w_pdfjs_require__2(1), assert = _require.assert;
            function IsPropertyKey(argument) {
              return typeof argument === "string" || (typeof argument === "undefined" ? "undefined" : _typeof(argument)) === "symbol";
            }
            exports3.typeIsObject = function(x) {
              return (typeof x === "undefined" ? "undefined" : _typeof(x)) === "object" && x !== null || typeof x === "function";
            };
            exports3.createDataProperty = function(o2, p, v) {
              assert(exports3.typeIsObject(o2));
              Object.defineProperty(o2, p, {
                value: v,
                writable: true,
                enumerable: true,
                configurable: true
              });
            };
            exports3.createArrayFromList = function(elements) {
              return elements.slice();
            };
            exports3.ArrayBufferCopy = function(dest, destOffset, src, srcOffset, n2) {
              new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n2), destOffset);
            };
            exports3.CreateIterResultObject = function(value, done) {
              assert(typeof done === "boolean");
              var obj = {};
              Object.defineProperty(obj, "value", {
                value,
                enumerable: true,
                writable: true,
                configurable: true
              });
              Object.defineProperty(obj, "done", {
                value: done,
                enumerable: true,
                writable: true,
                configurable: true
              });
              return obj;
            };
            exports3.IsFiniteNonNegativeNumber = function(v) {
              if (Number.isNaN(v)) {
                return false;
              }
              if (v === Infinity) {
                return false;
              }
              if (v < 0) {
                return false;
              }
              return true;
            };
            function Call(F, V, args) {
              if (typeof F !== "function") {
                throw new TypeError("Argument is not a function");
              }
              return Function.prototype.apply.call(F, V, args);
            }
            exports3.InvokeOrNoop = function(O, P, args) {
              assert(O !== void 0);
              assert(IsPropertyKey(P));
              assert(Array.isArray(args));
              var method = O[P];
              if (method === void 0) {
                return void 0;
              }
              return Call(method, O, args);
            };
            exports3.PromiseInvokeOrNoop = function(O, P, args) {
              assert(O !== void 0);
              assert(IsPropertyKey(P));
              assert(Array.isArray(args));
              try {
                return Promise.resolve(exports3.InvokeOrNoop(O, P, args));
              } catch (returnValueE) {
                return Promise.reject(returnValueE);
              }
            };
            exports3.PromiseInvokeOrPerformFallback = function(O, P, args, F, argsF) {
              assert(O !== void 0);
              assert(IsPropertyKey(P));
              assert(Array.isArray(args));
              assert(Array.isArray(argsF));
              var method = void 0;
              try {
                method = O[P];
              } catch (methodE) {
                return Promise.reject(methodE);
              }
              if (method === void 0) {
                return F.apply(null, argsF);
              }
              try {
                return Promise.resolve(Call(method, O, args));
              } catch (e) {
                return Promise.reject(e);
              }
            };
            exports3.TransferArrayBuffer = function(O) {
              return O.slice();
            };
            exports3.ValidateAndNormalizeHighWaterMark = function(highWaterMark) {
              highWaterMark = Number(highWaterMark);
              if (Number.isNaN(highWaterMark) || highWaterMark < 0) {
                throw new RangeError("highWaterMark property of a queuing strategy must be non-negative and non-NaN");
              }
              return highWaterMark;
            };
            exports3.ValidateAndNormalizeQueuingStrategy = function(size, highWaterMark) {
              if (size !== void 0 && typeof size !== "function") {
                throw new TypeError("size property of a queuing strategy must be a function");
              }
              highWaterMark = exports3.ValidateAndNormalizeHighWaterMark(highWaterMark);
              return {
                size,
                highWaterMark
              };
            };
          }, function(module3, exports3, __w_pdfjs_require__2) {
            function rethrowAssertionErrorRejection(e) {
              if (e && e.constructor === AssertionError) {
                setTimeout(function() {
                  throw e;
                }, 0);
              }
            }
            function AssertionError(message) {
              this.name = "AssertionError";
              this.message = message || "";
              this.stack = new Error().stack;
            }
            AssertionError.prototype = Object.create(Error.prototype);
            AssertionError.prototype.constructor = AssertionError;
            function assert(value, message) {
              if (!value) {
                throw new AssertionError(message);
              }
            }
            module3.exports = {
              rethrowAssertionErrorRejection,
              AssertionError,
              assert
            };
          }, function(module3, exports3, __w_pdfjs_require__2) {
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor)
                    descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps)
                  defineProperties(Constructor.prototype, protoProps);
                if (staticProps)
                  defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            var _require = __w_pdfjs_require__2(0), InvokeOrNoop = _require.InvokeOrNoop, PromiseInvokeOrNoop = _require.PromiseInvokeOrNoop, ValidateAndNormalizeQueuingStrategy = _require.ValidateAndNormalizeQueuingStrategy, typeIsObject = _require.typeIsObject;
            var _require2 = __w_pdfjs_require__2(1), assert = _require2.assert, rethrowAssertionErrorRejection = _require2.rethrowAssertionErrorRejection;
            var _require3 = __w_pdfjs_require__2(3), DequeueValue = _require3.DequeueValue, EnqueueValueWithSize = _require3.EnqueueValueWithSize, PeekQueueValue = _require3.PeekQueueValue, ResetQueue = _require3.ResetQueue;
            var WritableStream = function() {
              function WritableStream2() {
                var underlyingSink = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
                var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, size = _ref.size, _ref$highWaterMark = _ref.highWaterMark, highWaterMark = _ref$highWaterMark === void 0 ? 1 : _ref$highWaterMark;
                _classCallCheck(this, WritableStream2);
                this._state = "writable";
                this._storedError = void 0;
                this._writer = void 0;
                this._writableStreamController = void 0;
                this._writeRequests = [];
                this._inFlightWriteRequest = void 0;
                this._closeRequest = void 0;
                this._inFlightCloseRequest = void 0;
                this._pendingAbortRequest = void 0;
                this._backpressure = false;
                var type = underlyingSink.type;
                if (type !== void 0) {
                  throw new RangeError("Invalid type is specified");
                }
                this._writableStreamController = new WritableStreamDefaultController(this, underlyingSink, size, highWaterMark);
                this._writableStreamController.__startSteps();
              }
              _createClass(WritableStream2, [{
                key: "abort",
                value: function abort(reason) {
                  if (IsWritableStream(this) === false) {
                    return Promise.reject(streamBrandCheckException("abort"));
                  }
                  if (IsWritableStreamLocked(this) === true) {
                    return Promise.reject(new TypeError("Cannot abort a stream that already has a writer"));
                  }
                  return WritableStreamAbort(this, reason);
                }
              }, {
                key: "getWriter",
                value: function getWriter() {
                  if (IsWritableStream(this) === false) {
                    throw streamBrandCheckException("getWriter");
                  }
                  return AcquireWritableStreamDefaultWriter(this);
                }
              }, {
                key: "locked",
                get: function get() {
                  if (IsWritableStream(this) === false) {
                    throw streamBrandCheckException("locked");
                  }
                  return IsWritableStreamLocked(this);
                }
              }]);
              return WritableStream2;
            }();
            module3.exports = {
              AcquireWritableStreamDefaultWriter,
              IsWritableStream,
              IsWritableStreamLocked,
              WritableStream,
              WritableStreamAbort,
              WritableStreamDefaultControllerError,
              WritableStreamDefaultWriterCloseWithErrorPropagation,
              WritableStreamDefaultWriterRelease,
              WritableStreamDefaultWriterWrite,
              WritableStreamCloseQueuedOrInFlight
            };
            function AcquireWritableStreamDefaultWriter(stream) {
              return new WritableStreamDefaultWriter(stream);
            }
            function IsWritableStream(x) {
              if (!typeIsObject(x)) {
                return false;
              }
              if (!Object.prototype.hasOwnProperty.call(x, "_writableStreamController")) {
                return false;
              }
              return true;
            }
            function IsWritableStreamLocked(stream) {
              assert(IsWritableStream(stream) === true, "IsWritableStreamLocked should only be used on known writable streams");
              if (stream._writer === void 0) {
                return false;
              }
              return true;
            }
            function WritableStreamAbort(stream, reason) {
              var state = stream._state;
              if (state === "closed") {
                return Promise.resolve(void 0);
              }
              if (state === "errored") {
                return Promise.reject(stream._storedError);
              }
              var error2 = new TypeError("Requested to abort");
              if (stream._pendingAbortRequest !== void 0) {
                return Promise.reject(error2);
              }
              assert(state === "writable" || state === "erroring", "state must be writable or erroring");
              var wasAlreadyErroring = false;
              if (state === "erroring") {
                wasAlreadyErroring = true;
                reason = void 0;
              }
              var promise = new Promise(function(resolve, reject) {
                stream._pendingAbortRequest = {
                  _resolve: resolve,
                  _reject: reject,
                  _reason: reason,
                  _wasAlreadyErroring: wasAlreadyErroring
                };
              });
              if (wasAlreadyErroring === false) {
                WritableStreamStartErroring(stream, error2);
              }
              return promise;
            }
            function WritableStreamAddWriteRequest(stream) {
              assert(IsWritableStreamLocked(stream) === true);
              assert(stream._state === "writable");
              var promise = new Promise(function(resolve, reject) {
                var writeRequest = {
                  _resolve: resolve,
                  _reject: reject
                };
                stream._writeRequests.push(writeRequest);
              });
              return promise;
            }
            function WritableStreamDealWithRejection(stream, error2) {
              var state = stream._state;
              if (state === "writable") {
                WritableStreamStartErroring(stream, error2);
                return;
              }
              assert(state === "erroring");
              WritableStreamFinishErroring(stream);
            }
            function WritableStreamStartErroring(stream, reason) {
              assert(stream._storedError === void 0, "stream._storedError === undefined");
              assert(stream._state === "writable", "state must be writable");
              var controller = stream._writableStreamController;
              assert(controller !== void 0, "controller must not be undefined");
              stream._state = "erroring";
              stream._storedError = reason;
              var writer = stream._writer;
              if (writer !== void 0) {
                WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
              }
              if (WritableStreamHasOperationMarkedInFlight(stream) === false && controller._started === true) {
                WritableStreamFinishErroring(stream);
              }
            }
            function WritableStreamFinishErroring(stream) {
              assert(stream._state === "erroring", "stream._state === erroring");
              assert(WritableStreamHasOperationMarkedInFlight(stream) === false, "WritableStreamHasOperationMarkedInFlight(stream) === false");
              stream._state = "errored";
              stream._writableStreamController.__errorSteps();
              var storedError = stream._storedError;
              for (var i = 0; i < stream._writeRequests.length; i++) {
                var writeRequest = stream._writeRequests[i];
                writeRequest._reject(storedError);
              }
              stream._writeRequests = [];
              if (stream._pendingAbortRequest === void 0) {
                WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
                return;
              }
              var abortRequest = stream._pendingAbortRequest;
              stream._pendingAbortRequest = void 0;
              if (abortRequest._wasAlreadyErroring === true) {
                abortRequest._reject(storedError);
                WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
                return;
              }
              var promise = stream._writableStreamController.__abortSteps(abortRequest._reason);
              promise.then(function() {
                abortRequest._resolve();
                WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
              }, function(reason) {
                abortRequest._reject(reason);
                WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
              });
            }
            function WritableStreamFinishInFlightWrite(stream) {
              assert(stream._inFlightWriteRequest !== void 0);
              stream._inFlightWriteRequest._resolve(void 0);
              stream._inFlightWriteRequest = void 0;
            }
            function WritableStreamFinishInFlightWriteWithError(stream, error2) {
              assert(stream._inFlightWriteRequest !== void 0);
              stream._inFlightWriteRequest._reject(error2);
              stream._inFlightWriteRequest = void 0;
              assert(stream._state === "writable" || stream._state === "erroring");
              WritableStreamDealWithRejection(stream, error2);
            }
            function WritableStreamFinishInFlightClose(stream) {
              assert(stream._inFlightCloseRequest !== void 0);
              stream._inFlightCloseRequest._resolve(void 0);
              stream._inFlightCloseRequest = void 0;
              var state = stream._state;
              assert(state === "writable" || state === "erroring");
              if (state === "erroring") {
                stream._storedError = void 0;
                if (stream._pendingAbortRequest !== void 0) {
                  stream._pendingAbortRequest._resolve();
                  stream._pendingAbortRequest = void 0;
                }
              }
              stream._state = "closed";
              var writer = stream._writer;
              if (writer !== void 0) {
                defaultWriterClosedPromiseResolve(writer);
              }
              assert(stream._pendingAbortRequest === void 0, "stream._pendingAbortRequest === undefined");
              assert(stream._storedError === void 0, "stream._storedError === undefined");
            }
            function WritableStreamFinishInFlightCloseWithError(stream, error2) {
              assert(stream._inFlightCloseRequest !== void 0);
              stream._inFlightCloseRequest._reject(error2);
              stream._inFlightCloseRequest = void 0;
              assert(stream._state === "writable" || stream._state === "erroring");
              if (stream._pendingAbortRequest !== void 0) {
                stream._pendingAbortRequest._reject(error2);
                stream._pendingAbortRequest = void 0;
              }
              WritableStreamDealWithRejection(stream, error2);
            }
            function WritableStreamCloseQueuedOrInFlight(stream) {
              if (stream._closeRequest === void 0 && stream._inFlightCloseRequest === void 0) {
                return false;
              }
              return true;
            }
            function WritableStreamHasOperationMarkedInFlight(stream) {
              if (stream._inFlightWriteRequest === void 0 && stream._inFlightCloseRequest === void 0) {
                return false;
              }
              return true;
            }
            function WritableStreamMarkCloseRequestInFlight(stream) {
              assert(stream._inFlightCloseRequest === void 0);
              assert(stream._closeRequest !== void 0);
              stream._inFlightCloseRequest = stream._closeRequest;
              stream._closeRequest = void 0;
            }
            function WritableStreamMarkFirstWriteRequestInFlight(stream) {
              assert(stream._inFlightWriteRequest === void 0, "there must be no pending write request");
              assert(stream._writeRequests.length !== 0, "writeRequests must not be empty");
              stream._inFlightWriteRequest = stream._writeRequests.shift();
            }
            function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
              assert(stream._state === "errored", '_stream_.[[state]] is `"errored"`');
              if (stream._closeRequest !== void 0) {
                assert(stream._inFlightCloseRequest === void 0);
                stream._closeRequest._reject(stream._storedError);
                stream._closeRequest = void 0;
              }
              var writer = stream._writer;
              if (writer !== void 0) {
                defaultWriterClosedPromiseReject(writer, stream._storedError);
                writer._closedPromise.catch(function() {
                });
              }
            }
            function WritableStreamUpdateBackpressure(stream, backpressure) {
              assert(stream._state === "writable");
              assert(WritableStreamCloseQueuedOrInFlight(stream) === false);
              var writer = stream._writer;
              if (writer !== void 0 && backpressure !== stream._backpressure) {
                if (backpressure === true) {
                  defaultWriterReadyPromiseReset(writer);
                } else {
                  assert(backpressure === false);
                  defaultWriterReadyPromiseResolve(writer);
                }
              }
              stream._backpressure = backpressure;
            }
            var WritableStreamDefaultWriter = function() {
              function WritableStreamDefaultWriter2(stream) {
                _classCallCheck(this, WritableStreamDefaultWriter2);
                if (IsWritableStream(stream) === false) {
                  throw new TypeError("WritableStreamDefaultWriter can only be constructed with a WritableStream instance");
                }
                if (IsWritableStreamLocked(stream) === true) {
                  throw new TypeError("This stream has already been locked for exclusive writing by another writer");
                }
                this._ownerWritableStream = stream;
                stream._writer = this;
                var state = stream._state;
                if (state === "writable") {
                  if (WritableStreamCloseQueuedOrInFlight(stream) === false && stream._backpressure === true) {
                    defaultWriterReadyPromiseInitialize(this);
                  } else {
                    defaultWriterReadyPromiseInitializeAsResolved(this);
                  }
                  defaultWriterClosedPromiseInitialize(this);
                } else if (state === "erroring") {
                  defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
                  this._readyPromise.catch(function() {
                  });
                  defaultWriterClosedPromiseInitialize(this);
                } else if (state === "closed") {
                  defaultWriterReadyPromiseInitializeAsResolved(this);
                  defaultWriterClosedPromiseInitializeAsResolved(this);
                } else {
                  assert(state === "errored", "state must be errored");
                  var storedError = stream._storedError;
                  defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
                  this._readyPromise.catch(function() {
                  });
                  defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
                  this._closedPromise.catch(function() {
                  });
                }
              }
              _createClass(WritableStreamDefaultWriter2, [{
                key: "abort",
                value: function abort(reason) {
                  if (IsWritableStreamDefaultWriter(this) === false) {
                    return Promise.reject(defaultWriterBrandCheckException("abort"));
                  }
                  if (this._ownerWritableStream === void 0) {
                    return Promise.reject(defaultWriterLockException("abort"));
                  }
                  return WritableStreamDefaultWriterAbort(this, reason);
                }
              }, {
                key: "close",
                value: function close() {
                  if (IsWritableStreamDefaultWriter(this) === false) {
                    return Promise.reject(defaultWriterBrandCheckException("close"));
                  }
                  var stream = this._ownerWritableStream;
                  if (stream === void 0) {
                    return Promise.reject(defaultWriterLockException("close"));
                  }
                  if (WritableStreamCloseQueuedOrInFlight(stream) === true) {
                    return Promise.reject(new TypeError("cannot close an already-closing stream"));
                  }
                  return WritableStreamDefaultWriterClose(this);
                }
              }, {
                key: "releaseLock",
                value: function releaseLock() {
                  if (IsWritableStreamDefaultWriter(this) === false) {
                    throw defaultWriterBrandCheckException("releaseLock");
                  }
                  var stream = this._ownerWritableStream;
                  if (stream === void 0) {
                    return;
                  }
                  assert(stream._writer !== void 0);
                  WritableStreamDefaultWriterRelease(this);
                }
              }, {
                key: "write",
                value: function write2(chunk) {
                  if (IsWritableStreamDefaultWriter(this) === false) {
                    return Promise.reject(defaultWriterBrandCheckException("write"));
                  }
                  if (this._ownerWritableStream === void 0) {
                    return Promise.reject(defaultWriterLockException("write to"));
                  }
                  return WritableStreamDefaultWriterWrite(this, chunk);
                }
              }, {
                key: "closed",
                get: function get() {
                  if (IsWritableStreamDefaultWriter(this) === false) {
                    return Promise.reject(defaultWriterBrandCheckException("closed"));
                  }
                  return this._closedPromise;
                }
              }, {
                key: "desiredSize",
                get: function get() {
                  if (IsWritableStreamDefaultWriter(this) === false) {
                    throw defaultWriterBrandCheckException("desiredSize");
                  }
                  if (this._ownerWritableStream === void 0) {
                    throw defaultWriterLockException("desiredSize");
                  }
                  return WritableStreamDefaultWriterGetDesiredSize(this);
                }
              }, {
                key: "ready",
                get: function get() {
                  if (IsWritableStreamDefaultWriter(this) === false) {
                    return Promise.reject(defaultWriterBrandCheckException("ready"));
                  }
                  return this._readyPromise;
                }
              }]);
              return WritableStreamDefaultWriter2;
            }();
            function IsWritableStreamDefaultWriter(x) {
              if (!typeIsObject(x)) {
                return false;
              }
              if (!Object.prototype.hasOwnProperty.call(x, "_ownerWritableStream")) {
                return false;
              }
              return true;
            }
            function WritableStreamDefaultWriterAbort(writer, reason) {
              var stream = writer._ownerWritableStream;
              assert(stream !== void 0);
              return WritableStreamAbort(stream, reason);
            }
            function WritableStreamDefaultWriterClose(writer) {
              var stream = writer._ownerWritableStream;
              assert(stream !== void 0);
              var state = stream._state;
              if (state === "closed" || state === "errored") {
                return Promise.reject(new TypeError("The stream (in " + state + " state) is not in the writable state and cannot be closed"));
              }
              assert(state === "writable" || state === "erroring");
              assert(WritableStreamCloseQueuedOrInFlight(stream) === false);
              var promise = new Promise(function(resolve, reject) {
                var closeRequest = {
                  _resolve: resolve,
                  _reject: reject
                };
                stream._closeRequest = closeRequest;
              });
              if (stream._backpressure === true && state === "writable") {
                defaultWriterReadyPromiseResolve(writer);
              }
              WritableStreamDefaultControllerClose(stream._writableStreamController);
              return promise;
            }
            function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
              var stream = writer._ownerWritableStream;
              assert(stream !== void 0);
              var state = stream._state;
              if (WritableStreamCloseQueuedOrInFlight(stream) === true || state === "closed") {
                return Promise.resolve();
              }
              if (state === "errored") {
                return Promise.reject(stream._storedError);
              }
              assert(state === "writable" || state === "erroring");
              return WritableStreamDefaultWriterClose(writer);
            }
            function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error2) {
              if (writer._closedPromiseState === "pending") {
                defaultWriterClosedPromiseReject(writer, error2);
              } else {
                defaultWriterClosedPromiseResetToRejected(writer, error2);
              }
              writer._closedPromise.catch(function() {
              });
            }
            function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error2) {
              if (writer._readyPromiseState === "pending") {
                defaultWriterReadyPromiseReject(writer, error2);
              } else {
                defaultWriterReadyPromiseResetToRejected(writer, error2);
              }
              writer._readyPromise.catch(function() {
              });
            }
            function WritableStreamDefaultWriterGetDesiredSize(writer) {
              var stream = writer._ownerWritableStream;
              var state = stream._state;
              if (state === "errored" || state === "erroring") {
                return null;
              }
              if (state === "closed") {
                return 0;
              }
              return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
            }
            function WritableStreamDefaultWriterRelease(writer) {
              var stream = writer._ownerWritableStream;
              assert(stream !== void 0);
              assert(stream._writer === writer);
              var releasedError = new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");
              WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
              WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
              stream._writer = void 0;
              writer._ownerWritableStream = void 0;
            }
            function WritableStreamDefaultWriterWrite(writer, chunk) {
              var stream = writer._ownerWritableStream;
              assert(stream !== void 0);
              var controller = stream._writableStreamController;
              var chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
              if (stream !== writer._ownerWritableStream) {
                return Promise.reject(defaultWriterLockException("write to"));
              }
              var state = stream._state;
              if (state === "errored") {
                return Promise.reject(stream._storedError);
              }
              if (WritableStreamCloseQueuedOrInFlight(stream) === true || state === "closed") {
                return Promise.reject(new TypeError("The stream is closing or closed and cannot be written to"));
              }
              if (state === "erroring") {
                return Promise.reject(stream._storedError);
              }
              assert(state === "writable");
              var promise = WritableStreamAddWriteRequest(stream);
              WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
              return promise;
            }
            var WritableStreamDefaultController = function() {
              function WritableStreamDefaultController2(stream, underlyingSink, size, highWaterMark) {
                _classCallCheck(this, WritableStreamDefaultController2);
                if (IsWritableStream(stream) === false) {
                  throw new TypeError("WritableStreamDefaultController can only be constructed with a WritableStream instance");
                }
                if (stream._writableStreamController !== void 0) {
                  throw new TypeError("WritableStreamDefaultController instances can only be created by the WritableStream constructor");
                }
                this._controlledWritableStream = stream;
                this._underlyingSink = underlyingSink;
                this._queue = void 0;
                this._queueTotalSize = void 0;
                ResetQueue(this);
                this._started = false;
                var normalizedStrategy = ValidateAndNormalizeQueuingStrategy(size, highWaterMark);
                this._strategySize = normalizedStrategy.size;
                this._strategyHWM = normalizedStrategy.highWaterMark;
                var backpressure = WritableStreamDefaultControllerGetBackpressure(this);
                WritableStreamUpdateBackpressure(stream, backpressure);
              }
              _createClass(WritableStreamDefaultController2, [{
                key: "error",
                value: function error2(e) {
                  if (IsWritableStreamDefaultController(this) === false) {
                    throw new TypeError("WritableStreamDefaultController.prototype.error can only be used on a WritableStreamDefaultController");
                  }
                  var state = this._controlledWritableStream._state;
                  if (state !== "writable") {
                    return;
                  }
                  WritableStreamDefaultControllerError(this, e);
                }
              }, {
                key: "__abortSteps",
                value: function __abortSteps(reason) {
                  return PromiseInvokeOrNoop(this._underlyingSink, "abort", [reason]);
                }
              }, {
                key: "__errorSteps",
                value: function __errorSteps() {
                  ResetQueue(this);
                }
              }, {
                key: "__startSteps",
                value: function __startSteps() {
                  var _this = this;
                  var startResult = InvokeOrNoop(this._underlyingSink, "start", [this]);
                  var stream = this._controlledWritableStream;
                  Promise.resolve(startResult).then(function() {
                    assert(stream._state === "writable" || stream._state === "erroring");
                    _this._started = true;
                    WritableStreamDefaultControllerAdvanceQueueIfNeeded(_this);
                  }, function(r2) {
                    assert(stream._state === "writable" || stream._state === "erroring");
                    _this._started = true;
                    WritableStreamDealWithRejection(stream, r2);
                  }).catch(rethrowAssertionErrorRejection);
                }
              }]);
              return WritableStreamDefaultController2;
            }();
            function WritableStreamDefaultControllerClose(controller) {
              EnqueueValueWithSize(controller, "close", 0);
              WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
            }
            function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
              var strategySize = controller._strategySize;
              if (strategySize === void 0) {
                return 1;
              }
              try {
                return strategySize(chunk);
              } catch (chunkSizeE) {
                WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
                return 1;
              }
            }
            function WritableStreamDefaultControllerGetDesiredSize(controller) {
              return controller._strategyHWM - controller._queueTotalSize;
            }
            function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
              var writeRecord = {
                chunk
              };
              try {
                EnqueueValueWithSize(controller, writeRecord, chunkSize);
              } catch (enqueueE) {
                WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
                return;
              }
              var stream = controller._controlledWritableStream;
              if (WritableStreamCloseQueuedOrInFlight(stream) === false && stream._state === "writable") {
                var backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
                WritableStreamUpdateBackpressure(stream, backpressure);
              }
              WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
            }
            function IsWritableStreamDefaultController(x) {
              if (!typeIsObject(x)) {
                return false;
              }
              if (!Object.prototype.hasOwnProperty.call(x, "_underlyingSink")) {
                return false;
              }
              return true;
            }
            function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
              var stream = controller._controlledWritableStream;
              if (controller._started === false) {
                return;
              }
              if (stream._inFlightWriteRequest !== void 0) {
                return;
              }
              var state = stream._state;
              if (state === "closed" || state === "errored") {
                return;
              }
              if (state === "erroring") {
                WritableStreamFinishErroring(stream);
                return;
              }
              if (controller._queue.length === 0) {
                return;
              }
              var writeRecord = PeekQueueValue(controller);
              if (writeRecord === "close") {
                WritableStreamDefaultControllerProcessClose(controller);
              } else {
                WritableStreamDefaultControllerProcessWrite(controller, writeRecord.chunk);
              }
            }
            function WritableStreamDefaultControllerErrorIfNeeded(controller, error2) {
              if (controller._controlledWritableStream._state === "writable") {
                WritableStreamDefaultControllerError(controller, error2);
              }
            }
            function WritableStreamDefaultControllerProcessClose(controller) {
              var stream = controller._controlledWritableStream;
              WritableStreamMarkCloseRequestInFlight(stream);
              DequeueValue(controller);
              assert(controller._queue.length === 0, "queue must be empty once the final write record is dequeued");
              var sinkClosePromise = PromiseInvokeOrNoop(controller._underlyingSink, "close", []);
              sinkClosePromise.then(function() {
                WritableStreamFinishInFlightClose(stream);
              }, function(reason) {
                WritableStreamFinishInFlightCloseWithError(stream, reason);
              }).catch(rethrowAssertionErrorRejection);
            }
            function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
              var stream = controller._controlledWritableStream;
              WritableStreamMarkFirstWriteRequestInFlight(stream);
              var sinkWritePromise = PromiseInvokeOrNoop(controller._underlyingSink, "write", [chunk, controller]);
              sinkWritePromise.then(function() {
                WritableStreamFinishInFlightWrite(stream);
                var state = stream._state;
                assert(state === "writable" || state === "erroring");
                DequeueValue(controller);
                if (WritableStreamCloseQueuedOrInFlight(stream) === false && state === "writable") {
                  var backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
                  WritableStreamUpdateBackpressure(stream, backpressure);
                }
                WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
              }, function(reason) {
                WritableStreamFinishInFlightWriteWithError(stream, reason);
              }).catch(rethrowAssertionErrorRejection);
            }
            function WritableStreamDefaultControllerGetBackpressure(controller) {
              var desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
              return desiredSize <= 0;
            }
            function WritableStreamDefaultControllerError(controller, error2) {
              var stream = controller._controlledWritableStream;
              assert(stream._state === "writable");
              WritableStreamStartErroring(stream, error2);
            }
            function streamBrandCheckException(name) {
              return new TypeError("WritableStream.prototype." + name + " can only be used on a WritableStream");
            }
            function defaultWriterBrandCheckException(name) {
              return new TypeError("WritableStreamDefaultWriter.prototype." + name + " can only be used on a WritableStreamDefaultWriter");
            }
            function defaultWriterLockException(name) {
              return new TypeError("Cannot " + name + " a stream using a released writer");
            }
            function defaultWriterClosedPromiseInitialize(writer) {
              writer._closedPromise = new Promise(function(resolve, reject) {
                writer._closedPromise_resolve = resolve;
                writer._closedPromise_reject = reject;
                writer._closedPromiseState = "pending";
              });
            }
            function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
              writer._closedPromise = Promise.reject(reason);
              writer._closedPromise_resolve = void 0;
              writer._closedPromise_reject = void 0;
              writer._closedPromiseState = "rejected";
            }
            function defaultWriterClosedPromiseInitializeAsResolved(writer) {
              writer._closedPromise = Promise.resolve(void 0);
              writer._closedPromise_resolve = void 0;
              writer._closedPromise_reject = void 0;
              writer._closedPromiseState = "resolved";
            }
            function defaultWriterClosedPromiseReject(writer, reason) {
              assert(writer._closedPromise_resolve !== void 0, "writer._closedPromise_resolve !== undefined");
              assert(writer._closedPromise_reject !== void 0, "writer._closedPromise_reject !== undefined");
              assert(writer._closedPromiseState === "pending", "writer._closedPromiseState is pending");
              writer._closedPromise_reject(reason);
              writer._closedPromise_resolve = void 0;
              writer._closedPromise_reject = void 0;
              writer._closedPromiseState = "rejected";
            }
            function defaultWriterClosedPromiseResetToRejected(writer, reason) {
              assert(writer._closedPromise_resolve === void 0, "writer._closedPromise_resolve === undefined");
              assert(writer._closedPromise_reject === void 0, "writer._closedPromise_reject === undefined");
              assert(writer._closedPromiseState !== "pending", "writer._closedPromiseState is not pending");
              writer._closedPromise = Promise.reject(reason);
              writer._closedPromiseState = "rejected";
            }
            function defaultWriterClosedPromiseResolve(writer) {
              assert(writer._closedPromise_resolve !== void 0, "writer._closedPromise_resolve !== undefined");
              assert(writer._closedPromise_reject !== void 0, "writer._closedPromise_reject !== undefined");
              assert(writer._closedPromiseState === "pending", "writer._closedPromiseState is pending");
              writer._closedPromise_resolve(void 0);
              writer._closedPromise_resolve = void 0;
              writer._closedPromise_reject = void 0;
              writer._closedPromiseState = "resolved";
            }
            function defaultWriterReadyPromiseInitialize(writer) {
              writer._readyPromise = new Promise(function(resolve, reject) {
                writer._readyPromise_resolve = resolve;
                writer._readyPromise_reject = reject;
              });
              writer._readyPromiseState = "pending";
            }
            function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
              writer._readyPromise = Promise.reject(reason);
              writer._readyPromise_resolve = void 0;
              writer._readyPromise_reject = void 0;
              writer._readyPromiseState = "rejected";
            }
            function defaultWriterReadyPromiseInitializeAsResolved(writer) {
              writer._readyPromise = Promise.resolve(void 0);
              writer._readyPromise_resolve = void 0;
              writer._readyPromise_reject = void 0;
              writer._readyPromiseState = "fulfilled";
            }
            function defaultWriterReadyPromiseReject(writer, reason) {
              assert(writer._readyPromise_resolve !== void 0, "writer._readyPromise_resolve !== undefined");
              assert(writer._readyPromise_reject !== void 0, "writer._readyPromise_reject !== undefined");
              writer._readyPromise_reject(reason);
              writer._readyPromise_resolve = void 0;
              writer._readyPromise_reject = void 0;
              writer._readyPromiseState = "rejected";
            }
            function defaultWriterReadyPromiseReset(writer) {
              assert(writer._readyPromise_resolve === void 0, "writer._readyPromise_resolve === undefined");
              assert(writer._readyPromise_reject === void 0, "writer._readyPromise_reject === undefined");
              writer._readyPromise = new Promise(function(resolve, reject) {
                writer._readyPromise_resolve = resolve;
                writer._readyPromise_reject = reject;
              });
              writer._readyPromiseState = "pending";
            }
            function defaultWriterReadyPromiseResetToRejected(writer, reason) {
              assert(writer._readyPromise_resolve === void 0, "writer._readyPromise_resolve === undefined");
              assert(writer._readyPromise_reject === void 0, "writer._readyPromise_reject === undefined");
              writer._readyPromise = Promise.reject(reason);
              writer._readyPromiseState = "rejected";
            }
            function defaultWriterReadyPromiseResolve(writer) {
              assert(writer._readyPromise_resolve !== void 0, "writer._readyPromise_resolve !== undefined");
              assert(writer._readyPromise_reject !== void 0, "writer._readyPromise_reject !== undefined");
              writer._readyPromise_resolve(void 0);
              writer._readyPromise_resolve = void 0;
              writer._readyPromise_reject = void 0;
              writer._readyPromiseState = "fulfilled";
            }
          }, function(module3, exports3, __w_pdfjs_require__2) {
            var _require = __w_pdfjs_require__2(0), IsFiniteNonNegativeNumber = _require.IsFiniteNonNegativeNumber;
            var _require2 = __w_pdfjs_require__2(1), assert = _require2.assert;
            exports3.DequeueValue = function(container) {
              assert("_queue" in container && "_queueTotalSize" in container, "Spec-level failure: DequeueValue should only be used on containers with [[queue]] and [[queueTotalSize]].");
              assert(container._queue.length > 0, "Spec-level failure: should never dequeue from an empty queue.");
              var pair = container._queue.shift();
              container._queueTotalSize -= pair.size;
              if (container._queueTotalSize < 0) {
                container._queueTotalSize = 0;
              }
              return pair.value;
            };
            exports3.EnqueueValueWithSize = function(container, value, size) {
              assert("_queue" in container && "_queueTotalSize" in container, "Spec-level failure: EnqueueValueWithSize should only be used on containers with [[queue]] and [[queueTotalSize]].");
              size = Number(size);
              if (!IsFiniteNonNegativeNumber(size)) {
                throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
              }
              container._queue.push({
                value,
                size
              });
              container._queueTotalSize += size;
            };
            exports3.PeekQueueValue = function(container) {
              assert("_queue" in container && "_queueTotalSize" in container, "Spec-level failure: PeekQueueValue should only be used on containers with [[queue]] and [[queueTotalSize]].");
              assert(container._queue.length > 0, "Spec-level failure: should never peek at an empty queue.");
              var pair = container._queue[0];
              return pair.value;
            };
            exports3.ResetQueue = function(container) {
              assert("_queue" in container && "_queueTotalSize" in container, "Spec-level failure: ResetQueue should only be used on containers with [[queue]] and [[queueTotalSize]].");
              container._queue = [];
              container._queueTotalSize = 0;
            };
          }, function(module3, exports3, __w_pdfjs_require__2) {
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor)
                    descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps)
                  defineProperties(Constructor.prototype, protoProps);
                if (staticProps)
                  defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            var _require = __w_pdfjs_require__2(0), ArrayBufferCopy = _require.ArrayBufferCopy, CreateIterResultObject = _require.CreateIterResultObject, IsFiniteNonNegativeNumber = _require.IsFiniteNonNegativeNumber, InvokeOrNoop = _require.InvokeOrNoop, PromiseInvokeOrNoop = _require.PromiseInvokeOrNoop, TransferArrayBuffer = _require.TransferArrayBuffer, ValidateAndNormalizeQueuingStrategy = _require.ValidateAndNormalizeQueuingStrategy, ValidateAndNormalizeHighWaterMark = _require.ValidateAndNormalizeHighWaterMark;
            var _require2 = __w_pdfjs_require__2(0), createArrayFromList = _require2.createArrayFromList, createDataProperty = _require2.createDataProperty, typeIsObject = _require2.typeIsObject;
            var _require3 = __w_pdfjs_require__2(1), assert = _require3.assert, rethrowAssertionErrorRejection = _require3.rethrowAssertionErrorRejection;
            var _require4 = __w_pdfjs_require__2(3), DequeueValue = _require4.DequeueValue, EnqueueValueWithSize = _require4.EnqueueValueWithSize, ResetQueue = _require4.ResetQueue;
            var _require5 = __w_pdfjs_require__2(2), AcquireWritableStreamDefaultWriter = _require5.AcquireWritableStreamDefaultWriter, IsWritableStream = _require5.IsWritableStream, IsWritableStreamLocked = _require5.IsWritableStreamLocked, WritableStreamAbort = _require5.WritableStreamAbort, WritableStreamDefaultWriterCloseWithErrorPropagation = _require5.WritableStreamDefaultWriterCloseWithErrorPropagation, WritableStreamDefaultWriterRelease = _require5.WritableStreamDefaultWriterRelease, WritableStreamDefaultWriterWrite = _require5.WritableStreamDefaultWriterWrite, WritableStreamCloseQueuedOrInFlight = _require5.WritableStreamCloseQueuedOrInFlight;
            var ReadableStream2 = function() {
              function ReadableStream3() {
                var underlyingSource = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
                var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, size = _ref.size, highWaterMark = _ref.highWaterMark;
                _classCallCheck(this, ReadableStream3);
                this._state = "readable";
                this._reader = void 0;
                this._storedError = void 0;
                this._disturbed = false;
                this._readableStreamController = void 0;
                var type = underlyingSource.type;
                var typeString = String(type);
                if (typeString === "bytes") {
                  if (highWaterMark === void 0) {
                    highWaterMark = 0;
                  }
                  this._readableStreamController = new ReadableByteStreamController(this, underlyingSource, highWaterMark);
                } else if (type === void 0) {
                  if (highWaterMark === void 0) {
                    highWaterMark = 1;
                  }
                  this._readableStreamController = new ReadableStreamDefaultController(this, underlyingSource, size, highWaterMark);
                } else {
                  throw new RangeError("Invalid type is specified");
                }
              }
              _createClass(ReadableStream3, [{
                key: "cancel",
                value: function cancel(reason) {
                  if (IsReadableStream(this) === false) {
                    return Promise.reject(streamBrandCheckException("cancel"));
                  }
                  if (IsReadableStreamLocked(this) === true) {
                    return Promise.reject(new TypeError("Cannot cancel a stream that already has a reader"));
                  }
                  return ReadableStreamCancel(this, reason);
                }
              }, {
                key: "getReader",
                value: function getReader() {
                  var _ref2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, mode = _ref2.mode;
                  if (IsReadableStream(this) === false) {
                    throw streamBrandCheckException("getReader");
                  }
                  if (mode === void 0) {
                    return AcquireReadableStreamDefaultReader(this);
                  }
                  mode = String(mode);
                  if (mode === "byob") {
                    return AcquireReadableStreamBYOBReader(this);
                  }
                  throw new RangeError("Invalid mode is specified");
                }
              }, {
                key: "pipeThrough",
                value: function pipeThrough(_ref3, options) {
                  var writable = _ref3.writable, readable = _ref3.readable;
                  var promise = this.pipeTo(writable, options);
                  ifIsObjectAndHasAPromiseIsHandledInternalSlotSetPromiseIsHandledToTrue(promise);
                  return readable;
                }
              }, {
                key: "pipeTo",
                value: function pipeTo(dest) {
                  var _this = this;
                  var _ref4 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, preventClose = _ref4.preventClose, preventAbort = _ref4.preventAbort, preventCancel = _ref4.preventCancel;
                  if (IsReadableStream(this) === false) {
                    return Promise.reject(streamBrandCheckException("pipeTo"));
                  }
                  if (IsWritableStream(dest) === false) {
                    return Promise.reject(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));
                  }
                  preventClose = Boolean(preventClose);
                  preventAbort = Boolean(preventAbort);
                  preventCancel = Boolean(preventCancel);
                  if (IsReadableStreamLocked(this) === true) {
                    return Promise.reject(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
                  }
                  if (IsWritableStreamLocked(dest) === true) {
                    return Promise.reject(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
                  }
                  var reader = AcquireReadableStreamDefaultReader(this);
                  var writer = AcquireWritableStreamDefaultWriter(dest);
                  var shuttingDown = false;
                  var currentWrite = Promise.resolve();
                  return new Promise(function(resolve, reject) {
                    function pipeLoop() {
                      currentWrite = Promise.resolve();
                      if (shuttingDown === true) {
                        return Promise.resolve();
                      }
                      return writer._readyPromise.then(function() {
                        return ReadableStreamDefaultReaderRead(reader).then(function(_ref5) {
                          var value = _ref5.value, done = _ref5.done;
                          if (done === true) {
                            return;
                          }
                          currentWrite = WritableStreamDefaultWriterWrite(writer, value).catch(function() {
                          });
                        });
                      }).then(pipeLoop);
                    }
                    isOrBecomesErrored(_this, reader._closedPromise, function(storedError) {
                      if (preventAbort === false) {
                        shutdownWithAction(function() {
                          return WritableStreamAbort(dest, storedError);
                        }, true, storedError);
                      } else {
                        shutdown(true, storedError);
                      }
                    });
                    isOrBecomesErrored(dest, writer._closedPromise, function(storedError) {
                      if (preventCancel === false) {
                        shutdownWithAction(function() {
                          return ReadableStreamCancel(_this, storedError);
                        }, true, storedError);
                      } else {
                        shutdown(true, storedError);
                      }
                    });
                    isOrBecomesClosed(_this, reader._closedPromise, function() {
                      if (preventClose === false) {
                        shutdownWithAction(function() {
                          return WritableStreamDefaultWriterCloseWithErrorPropagation(writer);
                        });
                      } else {
                        shutdown();
                      }
                    });
                    if (WritableStreamCloseQueuedOrInFlight(dest) === true || dest._state === "closed") {
                      var destClosed = new TypeError("the destination writable stream closed before all data could be piped to it");
                      if (preventCancel === false) {
                        shutdownWithAction(function() {
                          return ReadableStreamCancel(_this, destClosed);
                        }, true, destClosed);
                      } else {
                        shutdown(true, destClosed);
                      }
                    }
                    pipeLoop().catch(function(err) {
                      currentWrite = Promise.resolve();
                      rethrowAssertionErrorRejection(err);
                    });
                    function waitForWritesToFinish() {
                      var oldCurrentWrite = currentWrite;
                      return currentWrite.then(function() {
                        return oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : void 0;
                      });
                    }
                    function isOrBecomesErrored(stream, promise, action) {
                      if (stream._state === "errored") {
                        action(stream._storedError);
                      } else {
                        promise.catch(action).catch(rethrowAssertionErrorRejection);
                      }
                    }
                    function isOrBecomesClosed(stream, promise, action) {
                      if (stream._state === "closed") {
                        action();
                      } else {
                        promise.then(action).catch(rethrowAssertionErrorRejection);
                      }
                    }
                    function shutdownWithAction(action, originalIsError, originalError) {
                      if (shuttingDown === true) {
                        return;
                      }
                      shuttingDown = true;
                      if (dest._state === "writable" && WritableStreamCloseQueuedOrInFlight(dest) === false) {
                        waitForWritesToFinish().then(doTheRest);
                      } else {
                        doTheRest();
                      }
                      function doTheRest() {
                        action().then(function() {
                          return finalize(originalIsError, originalError);
                        }, function(newError) {
                          return finalize(true, newError);
                        }).catch(rethrowAssertionErrorRejection);
                      }
                    }
                    function shutdown(isError, error2) {
                      if (shuttingDown === true) {
                        return;
                      }
                      shuttingDown = true;
                      if (dest._state === "writable" && WritableStreamCloseQueuedOrInFlight(dest) === false) {
                        waitForWritesToFinish().then(function() {
                          return finalize(isError, error2);
                        }).catch(rethrowAssertionErrorRejection);
                      } else {
                        finalize(isError, error2);
                      }
                    }
                    function finalize(isError, error2) {
                      WritableStreamDefaultWriterRelease(writer);
                      ReadableStreamReaderGenericRelease(reader);
                      if (isError) {
                        reject(error2);
                      } else {
                        resolve(void 0);
                      }
                    }
                  });
                }
              }, {
                key: "tee",
                value: function tee() {
                  if (IsReadableStream(this) === false) {
                    throw streamBrandCheckException("tee");
                  }
                  var branches = ReadableStreamTee(this, false);
                  return createArrayFromList(branches);
                }
              }, {
                key: "locked",
                get: function get() {
                  if (IsReadableStream(this) === false) {
                    throw streamBrandCheckException("locked");
                  }
                  return IsReadableStreamLocked(this);
                }
              }]);
              return ReadableStream3;
            }();
            module3.exports = {
              ReadableStream: ReadableStream2,
              IsReadableStreamDisturbed,
              ReadableStreamDefaultControllerClose,
              ReadableStreamDefaultControllerEnqueue,
              ReadableStreamDefaultControllerError,
              ReadableStreamDefaultControllerGetDesiredSize
            };
            function AcquireReadableStreamBYOBReader(stream) {
              return new ReadableStreamBYOBReader(stream);
            }
            function AcquireReadableStreamDefaultReader(stream) {
              return new ReadableStreamDefaultReader(stream);
            }
            function IsReadableStream(x) {
              if (!typeIsObject(x)) {
                return false;
              }
              if (!Object.prototype.hasOwnProperty.call(x, "_readableStreamController")) {
                return false;
              }
              return true;
            }
            function IsReadableStreamDisturbed(stream) {
              assert(IsReadableStream(stream) === true, "IsReadableStreamDisturbed should only be used on known readable streams");
              return stream._disturbed;
            }
            function IsReadableStreamLocked(stream) {
              assert(IsReadableStream(stream) === true, "IsReadableStreamLocked should only be used on known readable streams");
              if (stream._reader === void 0) {
                return false;
              }
              return true;
            }
            function ReadableStreamTee(stream, cloneForBranch2) {
              assert(IsReadableStream(stream) === true);
              assert(typeof cloneForBranch2 === "boolean");
              var reader = AcquireReadableStreamDefaultReader(stream);
              var teeState = {
                closedOrErrored: false,
                canceled1: false,
                canceled2: false,
                reason1: void 0,
                reason2: void 0
              };
              teeState.promise = new Promise(function(resolve) {
                teeState._resolve = resolve;
              });
              var pull = create_ReadableStreamTeePullFunction();
              pull._reader = reader;
              pull._teeState = teeState;
              pull._cloneForBranch2 = cloneForBranch2;
              var cancel1 = create_ReadableStreamTeeBranch1CancelFunction();
              cancel1._stream = stream;
              cancel1._teeState = teeState;
              var cancel2 = create_ReadableStreamTeeBranch2CancelFunction();
              cancel2._stream = stream;
              cancel2._teeState = teeState;
              var underlyingSource1 = Object.create(Object.prototype);
              createDataProperty(underlyingSource1, "pull", pull);
              createDataProperty(underlyingSource1, "cancel", cancel1);
              var branch1Stream = new ReadableStream2(underlyingSource1);
              var underlyingSource2 = Object.create(Object.prototype);
              createDataProperty(underlyingSource2, "pull", pull);
              createDataProperty(underlyingSource2, "cancel", cancel2);
              var branch2Stream = new ReadableStream2(underlyingSource2);
              pull._branch1 = branch1Stream._readableStreamController;
              pull._branch2 = branch2Stream._readableStreamController;
              reader._closedPromise.catch(function(r2) {
                if (teeState.closedOrErrored === true) {
                  return;
                }
                ReadableStreamDefaultControllerError(pull._branch1, r2);
                ReadableStreamDefaultControllerError(pull._branch2, r2);
                teeState.closedOrErrored = true;
              });
              return [branch1Stream, branch2Stream];
            }
            function create_ReadableStreamTeePullFunction() {
              function f() {
                var reader = f._reader, branch1 = f._branch1, branch2 = f._branch2, teeState = f._teeState;
                return ReadableStreamDefaultReaderRead(reader).then(function(result) {
                  assert(typeIsObject(result));
                  var value = result.value;
                  var done = result.done;
                  assert(typeof done === "boolean");
                  if (done === true && teeState.closedOrErrored === false) {
                    if (teeState.canceled1 === false) {
                      ReadableStreamDefaultControllerClose(branch1);
                    }
                    if (teeState.canceled2 === false) {
                      ReadableStreamDefaultControllerClose(branch2);
                    }
                    teeState.closedOrErrored = true;
                  }
                  if (teeState.closedOrErrored === true) {
                    return;
                  }
                  var value1 = value;
                  var value2 = value;
                  if (teeState.canceled1 === false) {
                    ReadableStreamDefaultControllerEnqueue(branch1, value1);
                  }
                  if (teeState.canceled2 === false) {
                    ReadableStreamDefaultControllerEnqueue(branch2, value2);
                  }
                });
              }
              return f;
            }
            function create_ReadableStreamTeeBranch1CancelFunction() {
              function f(reason) {
                var stream = f._stream, teeState = f._teeState;
                teeState.canceled1 = true;
                teeState.reason1 = reason;
                if (teeState.canceled2 === true) {
                  var compositeReason = createArrayFromList([teeState.reason1, teeState.reason2]);
                  var cancelResult = ReadableStreamCancel(stream, compositeReason);
                  teeState._resolve(cancelResult);
                }
                return teeState.promise;
              }
              return f;
            }
            function create_ReadableStreamTeeBranch2CancelFunction() {
              function f(reason) {
                var stream = f._stream, teeState = f._teeState;
                teeState.canceled2 = true;
                teeState.reason2 = reason;
                if (teeState.canceled1 === true) {
                  var compositeReason = createArrayFromList([teeState.reason1, teeState.reason2]);
                  var cancelResult = ReadableStreamCancel(stream, compositeReason);
                  teeState._resolve(cancelResult);
                }
                return teeState.promise;
              }
              return f;
            }
            function ReadableStreamAddReadIntoRequest(stream) {
              assert(IsReadableStreamBYOBReader(stream._reader) === true);
              assert(stream._state === "readable" || stream._state === "closed");
              var promise = new Promise(function(resolve, reject) {
                var readIntoRequest = {
                  _resolve: resolve,
                  _reject: reject
                };
                stream._reader._readIntoRequests.push(readIntoRequest);
              });
              return promise;
            }
            function ReadableStreamAddReadRequest(stream) {
              assert(IsReadableStreamDefaultReader(stream._reader) === true);
              assert(stream._state === "readable");
              var promise = new Promise(function(resolve, reject) {
                var readRequest = {
                  _resolve: resolve,
                  _reject: reject
                };
                stream._reader._readRequests.push(readRequest);
              });
              return promise;
            }
            function ReadableStreamCancel(stream, reason) {
              stream._disturbed = true;
              if (stream._state === "closed") {
                return Promise.resolve(void 0);
              }
              if (stream._state === "errored") {
                return Promise.reject(stream._storedError);
              }
              ReadableStreamClose(stream);
              var sourceCancelPromise = stream._readableStreamController.__cancelSteps(reason);
              return sourceCancelPromise.then(function() {
                return void 0;
              });
            }
            function ReadableStreamClose(stream) {
              assert(stream._state === "readable");
              stream._state = "closed";
              var reader = stream._reader;
              if (reader === void 0) {
                return void 0;
              }
              if (IsReadableStreamDefaultReader(reader) === true) {
                for (var i = 0; i < reader._readRequests.length; i++) {
                  var _resolve = reader._readRequests[i]._resolve;
                  _resolve(CreateIterResultObject(void 0, true));
                }
                reader._readRequests = [];
              }
              defaultReaderClosedPromiseResolve(reader);
              return void 0;
            }
            function ReadableStreamError(stream, e) {
              assert(IsReadableStream(stream) === true, "stream must be ReadableStream");
              assert(stream._state === "readable", "state must be readable");
              stream._state = "errored";
              stream._storedError = e;
              var reader = stream._reader;
              if (reader === void 0) {
                return void 0;
              }
              if (IsReadableStreamDefaultReader(reader) === true) {
                for (var i = 0; i < reader._readRequests.length; i++) {
                  var readRequest = reader._readRequests[i];
                  readRequest._reject(e);
                }
                reader._readRequests = [];
              } else {
                assert(IsReadableStreamBYOBReader(reader), "reader must be ReadableStreamBYOBReader");
                for (var _i = 0; _i < reader._readIntoRequests.length; _i++) {
                  var readIntoRequest = reader._readIntoRequests[_i];
                  readIntoRequest._reject(e);
                }
                reader._readIntoRequests = [];
              }
              defaultReaderClosedPromiseReject(reader, e);
              reader._closedPromise.catch(function() {
              });
            }
            function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
              var reader = stream._reader;
              assert(reader._readIntoRequests.length > 0);
              var readIntoRequest = reader._readIntoRequests.shift();
              readIntoRequest._resolve(CreateIterResultObject(chunk, done));
            }
            function ReadableStreamFulfillReadRequest(stream, chunk, done) {
              var reader = stream._reader;
              assert(reader._readRequests.length > 0);
              var readRequest = reader._readRequests.shift();
              readRequest._resolve(CreateIterResultObject(chunk, done));
            }
            function ReadableStreamGetNumReadIntoRequests(stream) {
              return stream._reader._readIntoRequests.length;
            }
            function ReadableStreamGetNumReadRequests(stream) {
              return stream._reader._readRequests.length;
            }
            function ReadableStreamHasBYOBReader(stream) {
              var reader = stream._reader;
              if (reader === void 0) {
                return false;
              }
              if (IsReadableStreamBYOBReader(reader) === false) {
                return false;
              }
              return true;
            }
            function ReadableStreamHasDefaultReader(stream) {
              var reader = stream._reader;
              if (reader === void 0) {
                return false;
              }
              if (IsReadableStreamDefaultReader(reader) === false) {
                return false;
              }
              return true;
            }
            var ReadableStreamDefaultReader = function() {
              function ReadableStreamDefaultReader2(stream) {
                _classCallCheck(this, ReadableStreamDefaultReader2);
                if (IsReadableStream(stream) === false) {
                  throw new TypeError("ReadableStreamDefaultReader can only be constructed with a ReadableStream instance");
                }
                if (IsReadableStreamLocked(stream) === true) {
                  throw new TypeError("This stream has already been locked for exclusive reading by another reader");
                }
                ReadableStreamReaderGenericInitialize(this, stream);
                this._readRequests = [];
              }
              _createClass(ReadableStreamDefaultReader2, [{
                key: "cancel",
                value: function cancel(reason) {
                  if (IsReadableStreamDefaultReader(this) === false) {
                    return Promise.reject(defaultReaderBrandCheckException("cancel"));
                  }
                  if (this._ownerReadableStream === void 0) {
                    return Promise.reject(readerLockException("cancel"));
                  }
                  return ReadableStreamReaderGenericCancel(this, reason);
                }
              }, {
                key: "read",
                value: function read2() {
                  if (IsReadableStreamDefaultReader(this) === false) {
                    return Promise.reject(defaultReaderBrandCheckException("read"));
                  }
                  if (this._ownerReadableStream === void 0) {
                    return Promise.reject(readerLockException("read from"));
                  }
                  return ReadableStreamDefaultReaderRead(this);
                }
              }, {
                key: "releaseLock",
                value: function releaseLock() {
                  if (IsReadableStreamDefaultReader(this) === false) {
                    throw defaultReaderBrandCheckException("releaseLock");
                  }
                  if (this._ownerReadableStream === void 0) {
                    return;
                  }
                  if (this._readRequests.length > 0) {
                    throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
                  }
                  ReadableStreamReaderGenericRelease(this);
                }
              }, {
                key: "closed",
                get: function get() {
                  if (IsReadableStreamDefaultReader(this) === false) {
                    return Promise.reject(defaultReaderBrandCheckException("closed"));
                  }
                  return this._closedPromise;
                }
              }]);
              return ReadableStreamDefaultReader2;
            }();
            var ReadableStreamBYOBReader = function() {
              function ReadableStreamBYOBReader2(stream) {
                _classCallCheck(this, ReadableStreamBYOBReader2);
                if (!IsReadableStream(stream)) {
                  throw new TypeError("ReadableStreamBYOBReader can only be constructed with a ReadableStream instance given a byte source");
                }
                if (IsReadableByteStreamController(stream._readableStreamController) === false) {
                  throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
                }
                if (IsReadableStreamLocked(stream)) {
                  throw new TypeError("This stream has already been locked for exclusive reading by another reader");
                }
                ReadableStreamReaderGenericInitialize(this, stream);
                this._readIntoRequests = [];
              }
              _createClass(ReadableStreamBYOBReader2, [{
                key: "cancel",
                value: function cancel(reason) {
                  if (!IsReadableStreamBYOBReader(this)) {
                    return Promise.reject(byobReaderBrandCheckException("cancel"));
                  }
                  if (this._ownerReadableStream === void 0) {
                    return Promise.reject(readerLockException("cancel"));
                  }
                  return ReadableStreamReaderGenericCancel(this, reason);
                }
              }, {
                key: "read",
                value: function read2(view) {
                  if (!IsReadableStreamBYOBReader(this)) {
                    return Promise.reject(byobReaderBrandCheckException("read"));
                  }
                  if (this._ownerReadableStream === void 0) {
                    return Promise.reject(readerLockException("read from"));
                  }
                  if (!ArrayBuffer.isView(view)) {
                    return Promise.reject(new TypeError("view must be an array buffer view"));
                  }
                  if (view.byteLength === 0) {
                    return Promise.reject(new TypeError("view must have non-zero byteLength"));
                  }
                  return ReadableStreamBYOBReaderRead(this, view);
                }
              }, {
                key: "releaseLock",
                value: function releaseLock() {
                  if (!IsReadableStreamBYOBReader(this)) {
                    throw byobReaderBrandCheckException("releaseLock");
                  }
                  if (this._ownerReadableStream === void 0) {
                    return;
                  }
                  if (this._readIntoRequests.length > 0) {
                    throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
                  }
                  ReadableStreamReaderGenericRelease(this);
                }
              }, {
                key: "closed",
                get: function get() {
                  if (!IsReadableStreamBYOBReader(this)) {
                    return Promise.reject(byobReaderBrandCheckException("closed"));
                  }
                  return this._closedPromise;
                }
              }]);
              return ReadableStreamBYOBReader2;
            }();
            function IsReadableStreamBYOBReader(x) {
              if (!typeIsObject(x)) {
                return false;
              }
              if (!Object.prototype.hasOwnProperty.call(x, "_readIntoRequests")) {
                return false;
              }
              return true;
            }
            function IsReadableStreamDefaultReader(x) {
              if (!typeIsObject(x)) {
                return false;
              }
              if (!Object.prototype.hasOwnProperty.call(x, "_readRequests")) {
                return false;
              }
              return true;
            }
            function ReadableStreamReaderGenericInitialize(reader, stream) {
              reader._ownerReadableStream = stream;
              stream._reader = reader;
              if (stream._state === "readable") {
                defaultReaderClosedPromiseInitialize(reader);
              } else if (stream._state === "closed") {
                defaultReaderClosedPromiseInitializeAsResolved(reader);
              } else {
                assert(stream._state === "errored", "state must be errored");
                defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
                reader._closedPromise.catch(function() {
                });
              }
            }
            function ReadableStreamReaderGenericCancel(reader, reason) {
              var stream = reader._ownerReadableStream;
              assert(stream !== void 0);
              return ReadableStreamCancel(stream, reason);
            }
            function ReadableStreamReaderGenericRelease(reader) {
              assert(reader._ownerReadableStream !== void 0);
              assert(reader._ownerReadableStream._reader === reader);
              if (reader._ownerReadableStream._state === "readable") {
                defaultReaderClosedPromiseReject(reader, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness"));
              } else {
                defaultReaderClosedPromiseResetToRejected(reader, new TypeError("Reader was released and can no longer be used to monitor the stream's closedness"));
              }
              reader._closedPromise.catch(function() {
              });
              reader._ownerReadableStream._reader = void 0;
              reader._ownerReadableStream = void 0;
            }
            function ReadableStreamBYOBReaderRead(reader, view) {
              var stream = reader._ownerReadableStream;
              assert(stream !== void 0);
              stream._disturbed = true;
              if (stream._state === "errored") {
                return Promise.reject(stream._storedError);
              }
              return ReadableByteStreamControllerPullInto(stream._readableStreamController, view);
            }
            function ReadableStreamDefaultReaderRead(reader) {
              var stream = reader._ownerReadableStream;
              assert(stream !== void 0);
              stream._disturbed = true;
              if (stream._state === "closed") {
                return Promise.resolve(CreateIterResultObject(void 0, true));
              }
              if (stream._state === "errored") {
                return Promise.reject(stream._storedError);
              }
              assert(stream._state === "readable");
              return stream._readableStreamController.__pullSteps();
            }
            var ReadableStreamDefaultController = function() {
              function ReadableStreamDefaultController2(stream, underlyingSource, size, highWaterMark) {
                _classCallCheck(this, ReadableStreamDefaultController2);
                if (IsReadableStream(stream) === false) {
                  throw new TypeError("ReadableStreamDefaultController can only be constructed with a ReadableStream instance");
                }
                if (stream._readableStreamController !== void 0) {
                  throw new TypeError("ReadableStreamDefaultController instances can only be created by the ReadableStream constructor");
                }
                this._controlledReadableStream = stream;
                this._underlyingSource = underlyingSource;
                this._queue = void 0;
                this._queueTotalSize = void 0;
                ResetQueue(this);
                this._started = false;
                this._closeRequested = false;
                this._pullAgain = false;
                this._pulling = false;
                var normalizedStrategy = ValidateAndNormalizeQueuingStrategy(size, highWaterMark);
                this._strategySize = normalizedStrategy.size;
                this._strategyHWM = normalizedStrategy.highWaterMark;
                var controller = this;
                var startResult = InvokeOrNoop(underlyingSource, "start", [this]);
                Promise.resolve(startResult).then(function() {
                  controller._started = true;
                  assert(controller._pulling === false);
                  assert(controller._pullAgain === false);
                  ReadableStreamDefaultControllerCallPullIfNeeded(controller);
                }, function(r2) {
                  ReadableStreamDefaultControllerErrorIfNeeded(controller, r2);
                }).catch(rethrowAssertionErrorRejection);
              }
              _createClass(ReadableStreamDefaultController2, [{
                key: "close",
                value: function close() {
                  if (IsReadableStreamDefaultController(this) === false) {
                    throw defaultControllerBrandCheckException("close");
                  }
                  if (this._closeRequested === true) {
                    throw new TypeError("The stream has already been closed; do not close it again!");
                  }
                  var state = this._controlledReadableStream._state;
                  if (state !== "readable") {
                    throw new TypeError("The stream (in " + state + " state) is not in the readable state and cannot be closed");
                  }
                  ReadableStreamDefaultControllerClose(this);
                }
              }, {
                key: "enqueue",
                value: function enqueue(chunk) {
                  if (IsReadableStreamDefaultController(this) === false) {
                    throw defaultControllerBrandCheckException("enqueue");
                  }
                  if (this._closeRequested === true) {
                    throw new TypeError("stream is closed or draining");
                  }
                  var state = this._controlledReadableStream._state;
                  if (state !== "readable") {
                    throw new TypeError("The stream (in " + state + " state) is not in the readable state and cannot be enqueued to");
                  }
                  return ReadableStreamDefaultControllerEnqueue(this, chunk);
                }
              }, {
                key: "error",
                value: function error2(e) {
                  if (IsReadableStreamDefaultController(this) === false) {
                    throw defaultControllerBrandCheckException("error");
                  }
                  var stream = this._controlledReadableStream;
                  if (stream._state !== "readable") {
                    throw new TypeError("The stream is " + stream._state + " and so cannot be errored");
                  }
                  ReadableStreamDefaultControllerError(this, e);
                }
              }, {
                key: "__cancelSteps",
                value: function __cancelSteps(reason) {
                  ResetQueue(this);
                  return PromiseInvokeOrNoop(this._underlyingSource, "cancel", [reason]);
                }
              }, {
                key: "__pullSteps",
                value: function __pullSteps() {
                  var stream = this._controlledReadableStream;
                  if (this._queue.length > 0) {
                    var chunk = DequeueValue(this);
                    if (this._closeRequested === true && this._queue.length === 0) {
                      ReadableStreamClose(stream);
                    } else {
                      ReadableStreamDefaultControllerCallPullIfNeeded(this);
                    }
                    return Promise.resolve(CreateIterResultObject(chunk, false));
                  }
                  var pendingPromise = ReadableStreamAddReadRequest(stream);
                  ReadableStreamDefaultControllerCallPullIfNeeded(this);
                  return pendingPromise;
                }
              }, {
                key: "desiredSize",
                get: function get() {
                  if (IsReadableStreamDefaultController(this) === false) {
                    throw defaultControllerBrandCheckException("desiredSize");
                  }
                  return ReadableStreamDefaultControllerGetDesiredSize(this);
                }
              }]);
              return ReadableStreamDefaultController2;
            }();
            function IsReadableStreamDefaultController(x) {
              if (!typeIsObject(x)) {
                return false;
              }
              if (!Object.prototype.hasOwnProperty.call(x, "_underlyingSource")) {
                return false;
              }
              return true;
            }
            function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
              var shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
              if (shouldPull === false) {
                return void 0;
              }
              if (controller._pulling === true) {
                controller._pullAgain = true;
                return void 0;
              }
              assert(controller._pullAgain === false);
              controller._pulling = true;
              var pullPromise = PromiseInvokeOrNoop(controller._underlyingSource, "pull", [controller]);
              pullPromise.then(function() {
                controller._pulling = false;
                if (controller._pullAgain === true) {
                  controller._pullAgain = false;
                  return ReadableStreamDefaultControllerCallPullIfNeeded(controller);
                }
                return void 0;
              }, function(e) {
                ReadableStreamDefaultControllerErrorIfNeeded(controller, e);
              }).catch(rethrowAssertionErrorRejection);
              return void 0;
            }
            function ReadableStreamDefaultControllerShouldCallPull(controller) {
              var stream = controller._controlledReadableStream;
              if (stream._state === "closed" || stream._state === "errored") {
                return false;
              }
              if (controller._closeRequested === true) {
                return false;
              }
              if (controller._started === false) {
                return false;
              }
              if (IsReadableStreamLocked(stream) === true && ReadableStreamGetNumReadRequests(stream) > 0) {
                return true;
              }
              var desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
              if (desiredSize > 0) {
                return true;
              }
              return false;
            }
            function ReadableStreamDefaultControllerClose(controller) {
              var stream = controller._controlledReadableStream;
              assert(controller._closeRequested === false);
              assert(stream._state === "readable");
              controller._closeRequested = true;
              if (controller._queue.length === 0) {
                ReadableStreamClose(stream);
              }
            }
            function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
              var stream = controller._controlledReadableStream;
              assert(controller._closeRequested === false);
              assert(stream._state === "readable");
              if (IsReadableStreamLocked(stream) === true && ReadableStreamGetNumReadRequests(stream) > 0) {
                ReadableStreamFulfillReadRequest(stream, chunk, false);
              } else {
                var chunkSize = 1;
                if (controller._strategySize !== void 0) {
                  var strategySize = controller._strategySize;
                  try {
                    chunkSize = strategySize(chunk);
                  } catch (chunkSizeE) {
                    ReadableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
                    throw chunkSizeE;
                  }
                }
                try {
                  EnqueueValueWithSize(controller, chunk, chunkSize);
                } catch (enqueueE) {
                  ReadableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
                  throw enqueueE;
                }
              }
              ReadableStreamDefaultControllerCallPullIfNeeded(controller);
              return void 0;
            }
            function ReadableStreamDefaultControllerError(controller, e) {
              var stream = controller._controlledReadableStream;
              assert(stream._state === "readable");
              ResetQueue(controller);
              ReadableStreamError(stream, e);
            }
            function ReadableStreamDefaultControllerErrorIfNeeded(controller, e) {
              if (controller._controlledReadableStream._state === "readable") {
                ReadableStreamDefaultControllerError(controller, e);
              }
            }
            function ReadableStreamDefaultControllerGetDesiredSize(controller) {
              var stream = controller._controlledReadableStream;
              var state = stream._state;
              if (state === "errored") {
                return null;
              }
              if (state === "closed") {
                return 0;
              }
              return controller._strategyHWM - controller._queueTotalSize;
            }
            var ReadableStreamBYOBRequest = function() {
              function ReadableStreamBYOBRequest2(controller, view) {
                _classCallCheck(this, ReadableStreamBYOBRequest2);
                this._associatedReadableByteStreamController = controller;
                this._view = view;
              }
              _createClass(ReadableStreamBYOBRequest2, [{
                key: "respond",
                value: function respond(bytesWritten) {
                  if (IsReadableStreamBYOBRequest(this) === false) {
                    throw byobRequestBrandCheckException("respond");
                  }
                  if (this._associatedReadableByteStreamController === void 0) {
                    throw new TypeError("This BYOB request has been invalidated");
                  }
                  ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
                }
              }, {
                key: "respondWithNewView",
                value: function respondWithNewView(view) {
                  if (IsReadableStreamBYOBRequest(this) === false) {
                    throw byobRequestBrandCheckException("respond");
                  }
                  if (this._associatedReadableByteStreamController === void 0) {
                    throw new TypeError("This BYOB request has been invalidated");
                  }
                  if (!ArrayBuffer.isView(view)) {
                    throw new TypeError("You can only respond with array buffer views");
                  }
                  ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
                }
              }, {
                key: "view",
                get: function get() {
                  return this._view;
                }
              }]);
              return ReadableStreamBYOBRequest2;
            }();
            var ReadableByteStreamController = function() {
              function ReadableByteStreamController2(stream, underlyingByteSource, highWaterMark) {
                _classCallCheck(this, ReadableByteStreamController2);
                if (IsReadableStream(stream) === false) {
                  throw new TypeError("ReadableByteStreamController can only be constructed with a ReadableStream instance given a byte source");
                }
                if (stream._readableStreamController !== void 0) {
                  throw new TypeError("ReadableByteStreamController instances can only be created by the ReadableStream constructor given a byte source");
                }
                this._controlledReadableStream = stream;
                this._underlyingByteSource = underlyingByteSource;
                this._pullAgain = false;
                this._pulling = false;
                ReadableByteStreamControllerClearPendingPullIntos(this);
                this._queue = this._queueTotalSize = void 0;
                ResetQueue(this);
                this._closeRequested = false;
                this._started = false;
                this._strategyHWM = ValidateAndNormalizeHighWaterMark(highWaterMark);
                var autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
                if (autoAllocateChunkSize !== void 0) {
                  if (Number.isInteger(autoAllocateChunkSize) === false || autoAllocateChunkSize <= 0) {
                    throw new RangeError("autoAllocateChunkSize must be a positive integer");
                  }
                }
                this._autoAllocateChunkSize = autoAllocateChunkSize;
                this._pendingPullIntos = [];
                var controller = this;
                var startResult = InvokeOrNoop(underlyingByteSource, "start", [this]);
                Promise.resolve(startResult).then(function() {
                  controller._started = true;
                  assert(controller._pulling === false);
                  assert(controller._pullAgain === false);
                  ReadableByteStreamControllerCallPullIfNeeded(controller);
                }, function(r2) {
                  if (stream._state === "readable") {
                    ReadableByteStreamControllerError(controller, r2);
                  }
                }).catch(rethrowAssertionErrorRejection);
              }
              _createClass(ReadableByteStreamController2, [{
                key: "close",
                value: function close() {
                  if (IsReadableByteStreamController(this) === false) {
                    throw byteStreamControllerBrandCheckException("close");
                  }
                  if (this._closeRequested === true) {
                    throw new TypeError("The stream has already been closed; do not close it again!");
                  }
                  var state = this._controlledReadableStream._state;
                  if (state !== "readable") {
                    throw new TypeError("The stream (in " + state + " state) is not in the readable state and cannot be closed");
                  }
                  ReadableByteStreamControllerClose(this);
                }
              }, {
                key: "enqueue",
                value: function enqueue(chunk) {
                  if (IsReadableByteStreamController(this) === false) {
                    throw byteStreamControllerBrandCheckException("enqueue");
                  }
                  if (this._closeRequested === true) {
                    throw new TypeError("stream is closed or draining");
                  }
                  var state = this._controlledReadableStream._state;
                  if (state !== "readable") {
                    throw new TypeError("The stream (in " + state + " state) is not in the readable state and cannot be enqueued to");
                  }
                  if (!ArrayBuffer.isView(chunk)) {
                    throw new TypeError("You can only enqueue array buffer views when using a ReadableByteStreamController");
                  }
                  ReadableByteStreamControllerEnqueue(this, chunk);
                }
              }, {
                key: "error",
                value: function error2(e) {
                  if (IsReadableByteStreamController(this) === false) {
                    throw byteStreamControllerBrandCheckException("error");
                  }
                  var stream = this._controlledReadableStream;
                  if (stream._state !== "readable") {
                    throw new TypeError("The stream is " + stream._state + " and so cannot be errored");
                  }
                  ReadableByteStreamControllerError(this, e);
                }
              }, {
                key: "__cancelSteps",
                value: function __cancelSteps(reason) {
                  if (this._pendingPullIntos.length > 0) {
                    var firstDescriptor = this._pendingPullIntos[0];
                    firstDescriptor.bytesFilled = 0;
                  }
                  ResetQueue(this);
                  return PromiseInvokeOrNoop(this._underlyingByteSource, "cancel", [reason]);
                }
              }, {
                key: "__pullSteps",
                value: function __pullSteps() {
                  var stream = this._controlledReadableStream;
                  assert(ReadableStreamHasDefaultReader(stream) === true);
                  if (this._queueTotalSize > 0) {
                    assert(ReadableStreamGetNumReadRequests(stream) === 0);
                    var entry = this._queue.shift();
                    this._queueTotalSize -= entry.byteLength;
                    ReadableByteStreamControllerHandleQueueDrain(this);
                    var view = void 0;
                    try {
                      view = new Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
                    } catch (viewE) {
                      return Promise.reject(viewE);
                    }
                    return Promise.resolve(CreateIterResultObject(view, false));
                  }
                  var autoAllocateChunkSize = this._autoAllocateChunkSize;
                  if (autoAllocateChunkSize !== void 0) {
                    var buffer = void 0;
                    try {
                      buffer = new ArrayBuffer(autoAllocateChunkSize);
                    } catch (bufferE) {
                      return Promise.reject(bufferE);
                    }
                    var pullIntoDescriptor = {
                      buffer,
                      byteOffset: 0,
                      byteLength: autoAllocateChunkSize,
                      bytesFilled: 0,
                      elementSize: 1,
                      ctor: Uint8Array,
                      readerType: "default"
                    };
                    this._pendingPullIntos.push(pullIntoDescriptor);
                  }
                  var promise = ReadableStreamAddReadRequest(stream);
                  ReadableByteStreamControllerCallPullIfNeeded(this);
                  return promise;
                }
              }, {
                key: "byobRequest",
                get: function get() {
                  if (IsReadableByteStreamController(this) === false) {
                    throw byteStreamControllerBrandCheckException("byobRequest");
                  }
                  if (this._byobRequest === void 0 && this._pendingPullIntos.length > 0) {
                    var firstDescriptor = this._pendingPullIntos[0];
                    var view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
                    this._byobRequest = new ReadableStreamBYOBRequest(this, view);
                  }
                  return this._byobRequest;
                }
              }, {
                key: "desiredSize",
                get: function get() {
                  if (IsReadableByteStreamController(this) === false) {
                    throw byteStreamControllerBrandCheckException("desiredSize");
                  }
                  return ReadableByteStreamControllerGetDesiredSize(this);
                }
              }]);
              return ReadableByteStreamController2;
            }();
            function IsReadableByteStreamController(x) {
              if (!typeIsObject(x)) {
                return false;
              }
              if (!Object.prototype.hasOwnProperty.call(x, "_underlyingByteSource")) {
                return false;
              }
              return true;
            }
            function IsReadableStreamBYOBRequest(x) {
              if (!typeIsObject(x)) {
                return false;
              }
              if (!Object.prototype.hasOwnProperty.call(x, "_associatedReadableByteStreamController")) {
                return false;
              }
              return true;
            }
            function ReadableByteStreamControllerCallPullIfNeeded(controller) {
              var shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
              if (shouldPull === false) {
                return void 0;
              }
              if (controller._pulling === true) {
                controller._pullAgain = true;
                return void 0;
              }
              assert(controller._pullAgain === false);
              controller._pulling = true;
              var pullPromise = PromiseInvokeOrNoop(controller._underlyingByteSource, "pull", [controller]);
              pullPromise.then(function() {
                controller._pulling = false;
                if (controller._pullAgain === true) {
                  controller._pullAgain = false;
                  ReadableByteStreamControllerCallPullIfNeeded(controller);
                }
              }, function(e) {
                if (controller._controlledReadableStream._state === "readable") {
                  ReadableByteStreamControllerError(controller, e);
                }
              }).catch(rethrowAssertionErrorRejection);
              return void 0;
            }
            function ReadableByteStreamControllerClearPendingPullIntos(controller) {
              ReadableByteStreamControllerInvalidateBYOBRequest(controller);
              controller._pendingPullIntos = [];
            }
            function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
              assert(stream._state !== "errored", "state must not be errored");
              var done = false;
              if (stream._state === "closed") {
                assert(pullIntoDescriptor.bytesFilled === 0);
                done = true;
              }
              var filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
              if (pullIntoDescriptor.readerType === "default") {
                ReadableStreamFulfillReadRequest(stream, filledView, done);
              } else {
                assert(pullIntoDescriptor.readerType === "byob");
                ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
              }
            }
            function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
              var bytesFilled = pullIntoDescriptor.bytesFilled;
              var elementSize = pullIntoDescriptor.elementSize;
              assert(bytesFilled <= pullIntoDescriptor.byteLength);
              assert(bytesFilled % elementSize === 0);
              return new pullIntoDescriptor.ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
            }
            function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength2) {
              controller._queue.push({
                buffer,
                byteOffset,
                byteLength: byteLength2
              });
              controller._queueTotalSize += byteLength2;
            }
            function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
              var elementSize = pullIntoDescriptor.elementSize;
              var currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % elementSize;
              var maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
              var maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
              var maxAlignedBytes = maxBytesFilled - maxBytesFilled % elementSize;
              var totalBytesToCopyRemaining = maxBytesToCopy;
              var ready = false;
              if (maxAlignedBytes > currentAlignedBytes) {
                totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
                ready = true;
              }
              var queue2 = controller._queue;
              while (totalBytesToCopyRemaining > 0) {
                var headOfQueue = queue2[0];
                var bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
                var destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
                ArrayBufferCopy(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
                if (headOfQueue.byteLength === bytesToCopy) {
                  queue2.shift();
                } else {
                  headOfQueue.byteOffset += bytesToCopy;
                  headOfQueue.byteLength -= bytesToCopy;
                }
                controller._queueTotalSize -= bytesToCopy;
                ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
                totalBytesToCopyRemaining -= bytesToCopy;
              }
              if (ready === false) {
                assert(controller._queueTotalSize === 0, "queue must be empty");
                assert(pullIntoDescriptor.bytesFilled > 0);
                assert(pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize);
              }
              return ready;
            }
            function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
              assert(controller._pendingPullIntos.length === 0 || controller._pendingPullIntos[0] === pullIntoDescriptor);
              ReadableByteStreamControllerInvalidateBYOBRequest(controller);
              pullIntoDescriptor.bytesFilled += size;
            }
            function ReadableByteStreamControllerHandleQueueDrain(controller) {
              assert(controller._controlledReadableStream._state === "readable");
              if (controller._queueTotalSize === 0 && controller._closeRequested === true) {
                ReadableStreamClose(controller._controlledReadableStream);
              } else {
                ReadableByteStreamControllerCallPullIfNeeded(controller);
              }
            }
            function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
              if (controller._byobRequest === void 0) {
                return;
              }
              controller._byobRequest._associatedReadableByteStreamController = void 0;
              controller._byobRequest._view = void 0;
              controller._byobRequest = void 0;
            }
            function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
              assert(controller._closeRequested === false);
              while (controller._pendingPullIntos.length > 0) {
                if (controller._queueTotalSize === 0) {
                  return;
                }
                var pullIntoDescriptor = controller._pendingPullIntos[0];
                if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) === true) {
                  ReadableByteStreamControllerShiftPendingPullInto(controller);
                  ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableStream, pullIntoDescriptor);
                }
              }
            }
            function ReadableByteStreamControllerPullInto(controller, view) {
              var stream = controller._controlledReadableStream;
              var elementSize = 1;
              if (view.constructor !== DataView) {
                elementSize = view.constructor.BYTES_PER_ELEMENT;
              }
              var ctor = view.constructor;
              var pullIntoDescriptor = {
                buffer: view.buffer,
                byteOffset: view.byteOffset,
                byteLength: view.byteLength,
                bytesFilled: 0,
                elementSize,
                ctor,
                readerType: "byob"
              };
              if (controller._pendingPullIntos.length > 0) {
                pullIntoDescriptor.buffer = TransferArrayBuffer(pullIntoDescriptor.buffer);
                controller._pendingPullIntos.push(pullIntoDescriptor);
                return ReadableStreamAddReadIntoRequest(stream);
              }
              if (stream._state === "closed") {
                var emptyView = new view.constructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
                return Promise.resolve(CreateIterResultObject(emptyView, true));
              }
              if (controller._queueTotalSize > 0) {
                if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) === true) {
                  var filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
                  ReadableByteStreamControllerHandleQueueDrain(controller);
                  return Promise.resolve(CreateIterResultObject(filledView, false));
                }
                if (controller._closeRequested === true) {
                  var e = new TypeError("Insufficient bytes to fill elements in the given buffer");
                  ReadableByteStreamControllerError(controller, e);
                  return Promise.reject(e);
                }
              }
              pullIntoDescriptor.buffer = TransferArrayBuffer(pullIntoDescriptor.buffer);
              controller._pendingPullIntos.push(pullIntoDescriptor);
              var promise = ReadableStreamAddReadIntoRequest(stream);
              ReadableByteStreamControllerCallPullIfNeeded(controller);
              return promise;
            }
            function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
              firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
              assert(firstDescriptor.bytesFilled === 0, "bytesFilled must be 0");
              var stream = controller._controlledReadableStream;
              if (ReadableStreamHasBYOBReader(stream) === true) {
                while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
                  var pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
                  ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
                }
              }
            }
            function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
              if (pullIntoDescriptor.bytesFilled + bytesWritten > pullIntoDescriptor.byteLength) {
                throw new RangeError("bytesWritten out of range");
              }
              ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
              if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize) {
                return;
              }
              ReadableByteStreamControllerShiftPendingPullInto(controller);
              var remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
              if (remainderSize > 0) {
                var end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
                var remainder = pullIntoDescriptor.buffer.slice(end - remainderSize, end);
                ReadableByteStreamControllerEnqueueChunkToQueue(controller, remainder, 0, remainder.byteLength);
              }
              pullIntoDescriptor.buffer = TransferArrayBuffer(pullIntoDescriptor.buffer);
              pullIntoDescriptor.bytesFilled -= remainderSize;
              ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableStream, pullIntoDescriptor);
              ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
            }
            function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
              var firstDescriptor = controller._pendingPullIntos[0];
              var stream = controller._controlledReadableStream;
              if (stream._state === "closed") {
                if (bytesWritten !== 0) {
                  throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
                }
                ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor);
              } else {
                assert(stream._state === "readable");
                ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
              }
            }
            function ReadableByteStreamControllerShiftPendingPullInto(controller) {
              var descriptor = controller._pendingPullIntos.shift();
              ReadableByteStreamControllerInvalidateBYOBRequest(controller);
              return descriptor;
            }
            function ReadableByteStreamControllerShouldCallPull(controller) {
              var stream = controller._controlledReadableStream;
              if (stream._state !== "readable") {
                return false;
              }
              if (controller._closeRequested === true) {
                return false;
              }
              if (controller._started === false) {
                return false;
              }
              if (ReadableStreamHasDefaultReader(stream) === true && ReadableStreamGetNumReadRequests(stream) > 0) {
                return true;
              }
              if (ReadableStreamHasBYOBReader(stream) === true && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
                return true;
              }
              if (ReadableByteStreamControllerGetDesiredSize(controller) > 0) {
                return true;
              }
              return false;
            }
            function ReadableByteStreamControllerClose(controller) {
              var stream = controller._controlledReadableStream;
              assert(controller._closeRequested === false);
              assert(stream._state === "readable");
              if (controller._queueTotalSize > 0) {
                controller._closeRequested = true;
                return;
              }
              if (controller._pendingPullIntos.length > 0) {
                var firstPendingPullInto = controller._pendingPullIntos[0];
                if (firstPendingPullInto.bytesFilled > 0) {
                  var e = new TypeError("Insufficient bytes to fill elements in the given buffer");
                  ReadableByteStreamControllerError(controller, e);
                  throw e;
                }
              }
              ReadableStreamClose(stream);
            }
            function ReadableByteStreamControllerEnqueue(controller, chunk) {
              var stream = controller._controlledReadableStream;
              assert(controller._closeRequested === false);
              assert(stream._state === "readable");
              var buffer = chunk.buffer;
              var byteOffset = chunk.byteOffset;
              var byteLength2 = chunk.byteLength;
              var transferredBuffer = TransferArrayBuffer(buffer);
              if (ReadableStreamHasDefaultReader(stream) === true) {
                if (ReadableStreamGetNumReadRequests(stream) === 0) {
                  ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength2);
                } else {
                  assert(controller._queue.length === 0);
                  var transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength2);
                  ReadableStreamFulfillReadRequest(stream, transferredView, false);
                }
              } else if (ReadableStreamHasBYOBReader(stream) === true) {
                ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength2);
                ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
              } else {
                assert(IsReadableStreamLocked(stream) === false, "stream must not be locked");
                ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength2);
              }
            }
            function ReadableByteStreamControllerError(controller, e) {
              var stream = controller._controlledReadableStream;
              assert(stream._state === "readable");
              ReadableByteStreamControllerClearPendingPullIntos(controller);
              ResetQueue(controller);
              ReadableStreamError(stream, e);
            }
            function ReadableByteStreamControllerGetDesiredSize(controller) {
              var stream = controller._controlledReadableStream;
              var state = stream._state;
              if (state === "errored") {
                return null;
              }
              if (state === "closed") {
                return 0;
              }
              return controller._strategyHWM - controller._queueTotalSize;
            }
            function ReadableByteStreamControllerRespond(controller, bytesWritten) {
              bytesWritten = Number(bytesWritten);
              if (IsFiniteNonNegativeNumber(bytesWritten) === false) {
                throw new RangeError("bytesWritten must be a finite");
              }
              assert(controller._pendingPullIntos.length > 0);
              ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
            }
            function ReadableByteStreamControllerRespondWithNewView(controller, view) {
              assert(controller._pendingPullIntos.length > 0);
              var firstDescriptor = controller._pendingPullIntos[0];
              if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
                throw new RangeError("The region specified by view does not match byobRequest");
              }
              if (firstDescriptor.byteLength !== view.byteLength) {
                throw new RangeError("The buffer of view has different capacity than byobRequest");
              }
              firstDescriptor.buffer = view.buffer;
              ReadableByteStreamControllerRespondInternal(controller, view.byteLength);
            }
            function streamBrandCheckException(name) {
              return new TypeError("ReadableStream.prototype." + name + " can only be used on a ReadableStream");
            }
            function readerLockException(name) {
              return new TypeError("Cannot " + name + " a stream using a released reader");
            }
            function defaultReaderBrandCheckException(name) {
              return new TypeError("ReadableStreamDefaultReader.prototype." + name + " can only be used on a ReadableStreamDefaultReader");
            }
            function defaultReaderClosedPromiseInitialize(reader) {
              reader._closedPromise = new Promise(function(resolve, reject) {
                reader._closedPromise_resolve = resolve;
                reader._closedPromise_reject = reject;
              });
            }
            function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
              reader._closedPromise = Promise.reject(reason);
              reader._closedPromise_resolve = void 0;
              reader._closedPromise_reject = void 0;
            }
            function defaultReaderClosedPromiseInitializeAsResolved(reader) {
              reader._closedPromise = Promise.resolve(void 0);
              reader._closedPromise_resolve = void 0;
              reader._closedPromise_reject = void 0;
            }
            function defaultReaderClosedPromiseReject(reader, reason) {
              assert(reader._closedPromise_resolve !== void 0);
              assert(reader._closedPromise_reject !== void 0);
              reader._closedPromise_reject(reason);
              reader._closedPromise_resolve = void 0;
              reader._closedPromise_reject = void 0;
            }
            function defaultReaderClosedPromiseResetToRejected(reader, reason) {
              assert(reader._closedPromise_resolve === void 0);
              assert(reader._closedPromise_reject === void 0);
              reader._closedPromise = Promise.reject(reason);
            }
            function defaultReaderClosedPromiseResolve(reader) {
              assert(reader._closedPromise_resolve !== void 0);
              assert(reader._closedPromise_reject !== void 0);
              reader._closedPromise_resolve(void 0);
              reader._closedPromise_resolve = void 0;
              reader._closedPromise_reject = void 0;
            }
            function byobReaderBrandCheckException(name) {
              return new TypeError("ReadableStreamBYOBReader.prototype." + name + " can only be used on a ReadableStreamBYOBReader");
            }
            function defaultControllerBrandCheckException(name) {
              return new TypeError("ReadableStreamDefaultController.prototype." + name + " can only be used on a ReadableStreamDefaultController");
            }
            function byobRequestBrandCheckException(name) {
              return new TypeError("ReadableStreamBYOBRequest.prototype." + name + " can only be used on a ReadableStreamBYOBRequest");
            }
            function byteStreamControllerBrandCheckException(name) {
              return new TypeError("ReadableByteStreamController.prototype." + name + " can only be used on a ReadableByteStreamController");
            }
            function ifIsObjectAndHasAPromiseIsHandledInternalSlotSetPromiseIsHandledToTrue(promise) {
              try {
                Promise.prototype.then.call(promise, void 0, function() {
                });
              } catch (e) {
              }
            }
          }, function(module3, exports3, __w_pdfjs_require__2) {
            var transformStream = __w_pdfjs_require__2(6);
            var readableStream = __w_pdfjs_require__2(4);
            var writableStream = __w_pdfjs_require__2(2);
            exports3.TransformStream = transformStream.TransformStream;
            exports3.ReadableStream = readableStream.ReadableStream;
            exports3.IsReadableStreamDisturbed = readableStream.IsReadableStreamDisturbed;
            exports3.ReadableStreamDefaultControllerClose = readableStream.ReadableStreamDefaultControllerClose;
            exports3.ReadableStreamDefaultControllerEnqueue = readableStream.ReadableStreamDefaultControllerEnqueue;
            exports3.ReadableStreamDefaultControllerError = readableStream.ReadableStreamDefaultControllerError;
            exports3.ReadableStreamDefaultControllerGetDesiredSize = readableStream.ReadableStreamDefaultControllerGetDesiredSize;
            exports3.AcquireWritableStreamDefaultWriter = writableStream.AcquireWritableStreamDefaultWriter;
            exports3.IsWritableStream = writableStream.IsWritableStream;
            exports3.IsWritableStreamLocked = writableStream.IsWritableStreamLocked;
            exports3.WritableStream = writableStream.WritableStream;
            exports3.WritableStreamAbort = writableStream.WritableStreamAbort;
            exports3.WritableStreamDefaultControllerError = writableStream.WritableStreamDefaultControllerError;
            exports3.WritableStreamDefaultWriterCloseWithErrorPropagation = writableStream.WritableStreamDefaultWriterCloseWithErrorPropagation;
            exports3.WritableStreamDefaultWriterRelease = writableStream.WritableStreamDefaultWriterRelease;
            exports3.WritableStreamDefaultWriterWrite = writableStream.WritableStreamDefaultWriterWrite;
          }, function(module3, exports3, __w_pdfjs_require__2) {
            var _createClass = /* @__PURE__ */ function() {
              function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor)
                    descriptor.writable = true;
                  Object.defineProperty(target, descriptor.key, descriptor);
                }
              }
              return function(Constructor, protoProps, staticProps) {
                if (protoProps)
                  defineProperties(Constructor.prototype, protoProps);
                if (staticProps)
                  defineProperties(Constructor, staticProps);
                return Constructor;
              };
            }();
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            var _require = __w_pdfjs_require__2(1), assert = _require.assert;
            var _require2 = __w_pdfjs_require__2(0), InvokeOrNoop = _require2.InvokeOrNoop, PromiseInvokeOrPerformFallback = _require2.PromiseInvokeOrPerformFallback, PromiseInvokeOrNoop = _require2.PromiseInvokeOrNoop, typeIsObject = _require2.typeIsObject;
            var _require3 = __w_pdfjs_require__2(4), ReadableStream2 = _require3.ReadableStream, ReadableStreamDefaultControllerClose = _require3.ReadableStreamDefaultControllerClose, ReadableStreamDefaultControllerEnqueue = _require3.ReadableStreamDefaultControllerEnqueue, ReadableStreamDefaultControllerError = _require3.ReadableStreamDefaultControllerError, ReadableStreamDefaultControllerGetDesiredSize = _require3.ReadableStreamDefaultControllerGetDesiredSize;
            var _require4 = __w_pdfjs_require__2(2), WritableStream = _require4.WritableStream, WritableStreamDefaultControllerError = _require4.WritableStreamDefaultControllerError;
            function TransformStreamCloseReadable(transformStream) {
              if (transformStream._errored === true) {
                throw new TypeError("TransformStream is already errored");
              }
              if (transformStream._readableClosed === true) {
                throw new TypeError("Readable side is already closed");
              }
              TransformStreamCloseReadableInternal(transformStream);
            }
            function TransformStreamEnqueueToReadable(transformStream, chunk) {
              if (transformStream._errored === true) {
                throw new TypeError("TransformStream is already errored");
              }
              if (transformStream._readableClosed === true) {
                throw new TypeError("Readable side is already closed");
              }
              var controller = transformStream._readableController;
              try {
                ReadableStreamDefaultControllerEnqueue(controller, chunk);
              } catch (e) {
                transformStream._readableClosed = true;
                TransformStreamErrorIfNeeded(transformStream, e);
                throw transformStream._storedError;
              }
              var desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
              var maybeBackpressure = desiredSize <= 0;
              if (maybeBackpressure === true && transformStream._backpressure === false) {
                TransformStreamSetBackpressure(transformStream, true);
              }
            }
            function TransformStreamError(transformStream, e) {
              if (transformStream._errored === true) {
                throw new TypeError("TransformStream is already errored");
              }
              TransformStreamErrorInternal(transformStream, e);
            }
            function TransformStreamCloseReadableInternal(transformStream) {
              assert(transformStream._errored === false);
              assert(transformStream._readableClosed === false);
              try {
                ReadableStreamDefaultControllerClose(transformStream._readableController);
              } catch (e) {
                assert(false);
              }
              transformStream._readableClosed = true;
            }
            function TransformStreamErrorIfNeeded(transformStream, e) {
              if (transformStream._errored === false) {
                TransformStreamErrorInternal(transformStream, e);
              }
            }
            function TransformStreamErrorInternal(transformStream, e) {
              assert(transformStream._errored === false);
              transformStream._errored = true;
              transformStream._storedError = e;
              if (transformStream._writableDone === false) {
                WritableStreamDefaultControllerError(transformStream._writableController, e);
              }
              if (transformStream._readableClosed === false) {
                ReadableStreamDefaultControllerError(transformStream._readableController, e);
              }
            }
            function TransformStreamReadableReadyPromise(transformStream) {
              assert(transformStream._backpressureChangePromise !== void 0, "_backpressureChangePromise should have been initialized");
              if (transformStream._backpressure === false) {
                return Promise.resolve();
              }
              assert(transformStream._backpressure === true, "_backpressure should have been initialized");
              return transformStream._backpressureChangePromise;
            }
            function TransformStreamSetBackpressure(transformStream, backpressure) {
              assert(transformStream._backpressure !== backpressure, "TransformStreamSetBackpressure() should be called only when backpressure is changed");
              if (transformStream._backpressureChangePromise !== void 0) {
                transformStream._backpressureChangePromise_resolve(backpressure);
              }
              transformStream._backpressureChangePromise = new Promise(function(resolve) {
                transformStream._backpressureChangePromise_resolve = resolve;
              });
              transformStream._backpressureChangePromise.then(function(resolution) {
                assert(resolution !== backpressure, "_backpressureChangePromise should be fulfilled only when backpressure is changed");
              });
              transformStream._backpressure = backpressure;
            }
            function TransformStreamDefaultTransform(chunk, transformStreamController) {
              var transformStream = transformStreamController._controlledTransformStream;
              TransformStreamEnqueueToReadable(transformStream, chunk);
              return Promise.resolve();
            }
            function TransformStreamTransform(transformStream, chunk) {
              assert(transformStream._errored === false);
              assert(transformStream._transforming === false);
              assert(transformStream._backpressure === false);
              transformStream._transforming = true;
              var transformer = transformStream._transformer;
              var controller = transformStream._transformStreamController;
              var transformPromise = PromiseInvokeOrPerformFallback(transformer, "transform", [chunk, controller], TransformStreamDefaultTransform, [chunk, controller]);
              return transformPromise.then(function() {
                transformStream._transforming = false;
                return TransformStreamReadableReadyPromise(transformStream);
              }, function(e) {
                TransformStreamErrorIfNeeded(transformStream, e);
                return Promise.reject(e);
              });
            }
            function IsTransformStreamDefaultController(x) {
              if (!typeIsObject(x)) {
                return false;
              }
              if (!Object.prototype.hasOwnProperty.call(x, "_controlledTransformStream")) {
                return false;
              }
              return true;
            }
            function IsTransformStream(x) {
              if (!typeIsObject(x)) {
                return false;
              }
              if (!Object.prototype.hasOwnProperty.call(x, "_transformStreamController")) {
                return false;
              }
              return true;
            }
            var TransformStreamSink = function() {
              function TransformStreamSink2(transformStream, startPromise) {
                _classCallCheck(this, TransformStreamSink2);
                this._transformStream = transformStream;
                this._startPromise = startPromise;
              }
              _createClass(TransformStreamSink2, [{
                key: "start",
                value: function start(c2) {
                  var transformStream = this._transformStream;
                  transformStream._writableController = c2;
                  return this._startPromise.then(function() {
                    return TransformStreamReadableReadyPromise(transformStream);
                  });
                }
              }, {
                key: "write",
                value: function write2(chunk) {
                  var transformStream = this._transformStream;
                  return TransformStreamTransform(transformStream, chunk);
                }
              }, {
                key: "abort",
                value: function abort() {
                  var transformStream = this._transformStream;
                  transformStream._writableDone = true;
                  TransformStreamErrorInternal(transformStream, new TypeError("Writable side aborted"));
                }
              }, {
                key: "close",
                value: function close() {
                  var transformStream = this._transformStream;
                  assert(transformStream._transforming === false);
                  transformStream._writableDone = true;
                  var flushPromise = PromiseInvokeOrNoop(transformStream._transformer, "flush", [transformStream._transformStreamController]);
                  return flushPromise.then(function() {
                    if (transformStream._errored === true) {
                      return Promise.reject(transformStream._storedError);
                    }
                    if (transformStream._readableClosed === false) {
                      TransformStreamCloseReadableInternal(transformStream);
                    }
                    return Promise.resolve();
                  }).catch(function(r2) {
                    TransformStreamErrorIfNeeded(transformStream, r2);
                    return Promise.reject(transformStream._storedError);
                  });
                }
              }]);
              return TransformStreamSink2;
            }();
            var TransformStreamSource = function() {
              function TransformStreamSource2(transformStream, startPromise) {
                _classCallCheck(this, TransformStreamSource2);
                this._transformStream = transformStream;
                this._startPromise = startPromise;
              }
              _createClass(TransformStreamSource2, [{
                key: "start",
                value: function start(c2) {
                  var transformStream = this._transformStream;
                  transformStream._readableController = c2;
                  return this._startPromise.then(function() {
                    assert(transformStream._backpressureChangePromise !== void 0, "_backpressureChangePromise should have been initialized");
                    if (transformStream._backpressure === true) {
                      return Promise.resolve();
                    }
                    assert(transformStream._backpressure === false, "_backpressure should have been initialized");
                    return transformStream._backpressureChangePromise;
                  });
                }
              }, {
                key: "pull",
                value: function pull() {
                  var transformStream = this._transformStream;
                  assert(transformStream._backpressure === true, "pull() should be never called while _backpressure is false");
                  assert(transformStream._backpressureChangePromise !== void 0, "_backpressureChangePromise should have been initialized");
                  TransformStreamSetBackpressure(transformStream, false);
                  return transformStream._backpressureChangePromise;
                }
              }, {
                key: "cancel",
                value: function cancel() {
                  var transformStream = this._transformStream;
                  transformStream._readableClosed = true;
                  TransformStreamErrorInternal(transformStream, new TypeError("Readable side canceled"));
                }
              }]);
              return TransformStreamSource2;
            }();
            var TransformStreamDefaultController = function() {
              function TransformStreamDefaultController2(transformStream) {
                _classCallCheck(this, TransformStreamDefaultController2);
                if (IsTransformStream(transformStream) === false) {
                  throw new TypeError("TransformStreamDefaultController can only be constructed with a TransformStream instance");
                }
                if (transformStream._transformStreamController !== void 0) {
                  throw new TypeError("TransformStreamDefaultController instances can only be created by the TransformStream constructor");
                }
                this._controlledTransformStream = transformStream;
              }
              _createClass(TransformStreamDefaultController2, [{
                key: "enqueue",
                value: function enqueue(chunk) {
                  if (IsTransformStreamDefaultController(this) === false) {
                    throw defaultControllerBrandCheckException("enqueue");
                  }
                  TransformStreamEnqueueToReadable(this._controlledTransformStream, chunk);
                }
              }, {
                key: "close",
                value: function close() {
                  if (IsTransformStreamDefaultController(this) === false) {
                    throw defaultControllerBrandCheckException("close");
                  }
                  TransformStreamCloseReadable(this._controlledTransformStream);
                }
              }, {
                key: "error",
                value: function error2(reason) {
                  if (IsTransformStreamDefaultController(this) === false) {
                    throw defaultControllerBrandCheckException("error");
                  }
                  TransformStreamError(this._controlledTransformStream, reason);
                }
              }, {
                key: "desiredSize",
                get: function get() {
                  if (IsTransformStreamDefaultController(this) === false) {
                    throw defaultControllerBrandCheckException("desiredSize");
                  }
                  var transformStream = this._controlledTransformStream;
                  var readableController = transformStream._readableController;
                  return ReadableStreamDefaultControllerGetDesiredSize(readableController);
                }
              }]);
              return TransformStreamDefaultController2;
            }();
            var TransformStream = function() {
              function TransformStream2() {
                var transformer = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
                _classCallCheck(this, TransformStream2);
                this._transformer = transformer;
                var readableStrategy = transformer.readableStrategy, writableStrategy = transformer.writableStrategy;
                this._transforming = false;
                this._errored = false;
                this._storedError = void 0;
                this._writableController = void 0;
                this._readableController = void 0;
                this._transformStreamController = void 0;
                this._writableDone = false;
                this._readableClosed = false;
                this._backpressure = void 0;
                this._backpressureChangePromise = void 0;
                this._backpressureChangePromise_resolve = void 0;
                this._transformStreamController = new TransformStreamDefaultController(this);
                var startPromise_resolve = void 0;
                var startPromise = new Promise(function(resolve) {
                  startPromise_resolve = resolve;
                });
                var source = new TransformStreamSource(this, startPromise);
                this._readable = new ReadableStream2(source, readableStrategy);
                var sink = new TransformStreamSink(this, startPromise);
                this._writable = new WritableStream(sink, writableStrategy);
                assert(this._writableController !== void 0);
                assert(this._readableController !== void 0);
                var desiredSize = ReadableStreamDefaultControllerGetDesiredSize(this._readableController);
                TransformStreamSetBackpressure(this, desiredSize <= 0);
                var transformStream = this;
                var startResult = InvokeOrNoop(transformer, "start", [transformStream._transformStreamController]);
                startPromise_resolve(startResult);
                startPromise.catch(function(e) {
                  if (transformStream._errored === false) {
                    transformStream._errored = true;
                    transformStream._storedError = e;
                  }
                });
              }
              _createClass(TransformStream2, [{
                key: "readable",
                get: function get() {
                  if (IsTransformStream(this) === false) {
                    throw streamBrandCheckException("readable");
                  }
                  return this._readable;
                }
              }, {
                key: "writable",
                get: function get() {
                  if (IsTransformStream(this) === false) {
                    throw streamBrandCheckException("writable");
                  }
                  return this._writable;
                }
              }]);
              return TransformStream2;
            }();
            module3.exports = {
              TransformStream
            };
            function defaultControllerBrandCheckException(name) {
              return new TypeError("TransformStreamDefaultController.prototype." + name + " can only be used on a TransformStreamDefaultController");
            }
            function streamBrandCheckException(name) {
              return new TypeError("TransformStream.prototype." + name + " can only be used on a TransformStream");
            }
          }, function(module3, exports3, __w_pdfjs_require__2) {
            module3.exports = __w_pdfjs_require__2(5);
          }]));
        },
        /* 144 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          function _typeof(obj) {
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
              _typeof = function _typeof2(obj2) {
                return typeof obj2;
              };
            } else {
              _typeof = function _typeof2(obj2) {
                return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
              };
            }
            return _typeof(obj);
          }
          {
            var isURLSupported = false;
            try {
              if (typeof URL === "function" && _typeof(URL.prototype) === "object" && "origin" in URL.prototype) {
                var u = new URL("b", "http://a");
                u.pathname = "c%20d";
                isURLSupported = u.href === "http://a/c%20d";
              }
            } catch (ex) {
            }
            if (isURLSupported) {
              exports2.URL = URL;
            } else {
              var PolyfillURL = __w_pdfjs_require__(145).URL;
              var OriginalURL = __w_pdfjs_require__(3).URL;
              if (OriginalURL) {
                PolyfillURL.createObjectURL = function(blob) {
                  return OriginalURL.createObjectURL.apply(OriginalURL, arguments);
                };
                PolyfillURL.revokeObjectURL = function(url) {
                  OriginalURL.revokeObjectURL(url);
                };
              }
              exports2.URL = PolyfillURL;
            }
          }
        },
        /* 145 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          (function URLConstructorClosure() {
            var relative = /* @__PURE__ */ Object.create(null);
            relative["ftp"] = 21;
            relative["file"] = 0;
            relative["gopher"] = 70;
            relative["http"] = 80;
            relative["https"] = 443;
            relative["ws"] = 80;
            relative["wss"] = 443;
            var relativePathDotMapping = /* @__PURE__ */ Object.create(null);
            relativePathDotMapping["%2e"] = ".";
            relativePathDotMapping[".%2e"] = "..";
            relativePathDotMapping["%2e."] = "..";
            relativePathDotMapping["%2e%2e"] = "..";
            function isRelativeScheme(scheme) {
              return relative[scheme] !== void 0;
            }
            function invalid() {
              clear.call(this);
              this._isInvalid = true;
            }
            function IDNAToASCII(h) {
              if (h === "") {
                invalid.call(this);
              }
              return h.toLowerCase();
            }
            function percentEscape(c2) {
              var unicode = c2.charCodeAt(0);
              if (unicode > 32 && unicode < 127 && [34, 35, 60, 62, 63, 96].indexOf(unicode) === -1) {
                return c2;
              }
              return encodeURIComponent(c2);
            }
            function percentEscapeQuery(c2) {
              var unicode = c2.charCodeAt(0);
              if (unicode > 32 && unicode < 127 && [34, 35, 60, 62, 96].indexOf(unicode) === -1) {
                return c2;
              }
              return encodeURIComponent(c2);
            }
            var EOF, ALPHA = /[a-zA-Z]/, ALPHANUMERIC = /[a-zA-Z0-9\+\-\.]/;
            function parse2(input, stateOverride, base2) {
              var state = stateOverride || "scheme start", cursor = 0, buffer = "", seenAt = false, seenBracket = false;
              loop:
                while ((input[cursor - 1] !== EOF || cursor === 0) && !this._isInvalid) {
                  var c2 = input[cursor];
                  switch (state) {
                    case "scheme start":
                      if (c2 && ALPHA.test(c2)) {
                        buffer += c2.toLowerCase();
                        state = "scheme";
                      } else if (!stateOverride) {
                        buffer = "";
                        state = "no scheme";
                        continue;
                      } else {
                        break loop;
                      }
                      break;
                    case "scheme":
                      if (c2 && ALPHANUMERIC.test(c2)) {
                        buffer += c2.toLowerCase();
                      } else if (c2 === ":") {
                        this._scheme = buffer;
                        buffer = "";
                        if (stateOverride) {
                          break loop;
                        }
                        if (isRelativeScheme(this._scheme)) {
                          this._isRelative = true;
                        }
                        if (this._scheme === "file") {
                          state = "relative";
                        } else if (this._isRelative && base2 && base2._scheme === this._scheme) {
                          state = "relative or authority";
                        } else if (this._isRelative) {
                          state = "authority first slash";
                        } else {
                          state = "scheme data";
                        }
                      } else if (!stateOverride) {
                        buffer = "";
                        cursor = 0;
                        state = "no scheme";
                        continue;
                      } else if (c2 === EOF) {
                        break loop;
                      } else {
                        break loop;
                      }
                      break;
                    case "scheme data":
                      if (c2 === "?") {
                        this._query = "?";
                        state = "query";
                      } else if (c2 === "#") {
                        this._fragment = "#";
                        state = "fragment";
                      } else {
                        if (c2 !== EOF && c2 !== "	" && c2 !== "\n" && c2 !== "\r") {
                          this._schemeData += percentEscape(c2);
                        }
                      }
                      break;
                    case "no scheme":
                      if (!base2 || !isRelativeScheme(base2._scheme)) {
                        invalid.call(this);
                      } else {
                        state = "relative";
                        continue;
                      }
                      break;
                    case "relative or authority":
                      if (c2 === "/" && input[cursor + 1] === "/") {
                        state = "authority ignore slashes";
                      } else {
                        state = "relative";
                        continue;
                      }
                      break;
                    case "relative":
                      this._isRelative = true;
                      if (this._scheme !== "file") {
                        this._scheme = base2._scheme;
                      }
                      if (c2 === EOF) {
                        this._host = base2._host;
                        this._port = base2._port;
                        this._path = base2._path.slice();
                        this._query = base2._query;
                        this._username = base2._username;
                        this._password = base2._password;
                        break loop;
                      } else if (c2 === "/" || c2 === "\\") {
                        state = "relative slash";
                      } else if (c2 === "?") {
                        this._host = base2._host;
                        this._port = base2._port;
                        this._path = base2._path.slice();
                        this._query = "?";
                        this._username = base2._username;
                        this._password = base2._password;
                        state = "query";
                      } else if (c2 === "#") {
                        this._host = base2._host;
                        this._port = base2._port;
                        this._path = base2._path.slice();
                        this._query = base2._query;
                        this._fragment = "#";
                        this._username = base2._username;
                        this._password = base2._password;
                        state = "fragment";
                      } else {
                        var nextC = input[cursor + 1];
                        var nextNextC = input[cursor + 2];
                        if (this._scheme !== "file" || !ALPHA.test(c2) || nextC !== ":" && nextC !== "|" || nextNextC !== EOF && nextNextC !== "/" && nextNextC !== "\\" && nextNextC !== "?" && nextNextC !== "#") {
                          this._host = base2._host;
                          this._port = base2._port;
                          this._username = base2._username;
                          this._password = base2._password;
                          this._path = base2._path.slice();
                          this._path.pop();
                        }
                        state = "relative path";
                        continue;
                      }
                      break;
                    case "relative slash":
                      if (c2 === "/" || c2 === "\\") {
                        if (this._scheme === "file") {
                          state = "file host";
                        } else {
                          state = "authority ignore slashes";
                        }
                      } else {
                        if (this._scheme !== "file") {
                          this._host = base2._host;
                          this._port = base2._port;
                          this._username = base2._username;
                          this._password = base2._password;
                        }
                        state = "relative path";
                        continue;
                      }
                      break;
                    case "authority first slash":
                      if (c2 === "/") {
                        state = "authority second slash";
                      } else {
                        state = "authority ignore slashes";
                        continue;
                      }
                      break;
                    case "authority second slash":
                      state = "authority ignore slashes";
                      if (c2 !== "/") {
                        continue;
                      }
                      break;
                    case "authority ignore slashes":
                      if (c2 !== "/" && c2 !== "\\") {
                        state = "authority";
                        continue;
                      }
                      break;
                    case "authority":
                      if (c2 === "@") {
                        if (seenAt) {
                          buffer += "%40";
                        }
                        seenAt = true;
                        for (var i = 0; i < buffer.length; i++) {
                          var cp = buffer[i];
                          if (cp === "	" || cp === "\n" || cp === "\r") {
                            continue;
                          }
                          if (cp === ":" && this._password === null) {
                            this._password = "";
                            continue;
                          }
                          var tempC = percentEscape(cp);
                          if (this._password !== null) {
                            this._password += tempC;
                          } else {
                            this._username += tempC;
                          }
                        }
                        buffer = "";
                      } else if (c2 === EOF || c2 === "/" || c2 === "\\" || c2 === "?" || c2 === "#") {
                        cursor -= buffer.length;
                        buffer = "";
                        state = "host";
                        continue;
                      } else {
                        buffer += c2;
                      }
                      break;
                    case "file host":
                      if (c2 === EOF || c2 === "/" || c2 === "\\" || c2 === "?" || c2 === "#") {
                        if (buffer.length === 2 && ALPHA.test(buffer[0]) && (buffer[1] === ":" || buffer[1] === "|")) {
                          state = "relative path";
                        } else if (buffer.length === 0) {
                          state = "relative path start";
                        } else {
                          this._host = IDNAToASCII.call(this, buffer);
                          buffer = "";
                          state = "relative path start";
                        }
                        continue;
                      } else if (c2 === "	" || c2 === "\n" || c2 === "\r")
                        ;
                      else {
                        buffer += c2;
                      }
                      break;
                    case "host":
                    case "hostname":
                      if (c2 === ":" && !seenBracket) {
                        this._host = IDNAToASCII.call(this, buffer);
                        buffer = "";
                        state = "port";
                        if (stateOverride === "hostname") {
                          break loop;
                        }
                      } else if (c2 === EOF || c2 === "/" || c2 === "\\" || c2 === "?" || c2 === "#") {
                        this._host = IDNAToASCII.call(this, buffer);
                        buffer = "";
                        state = "relative path start";
                        if (stateOverride) {
                          break loop;
                        }
                        continue;
                      } else if (c2 !== "	" && c2 !== "\n" && c2 !== "\r") {
                        if (c2 === "[") {
                          seenBracket = true;
                        } else if (c2 === "]") {
                          seenBracket = false;
                        }
                        buffer += c2;
                      }
                      break;
                    case "port":
                      if (/[0-9]/.test(c2)) {
                        buffer += c2;
                      } else if (c2 === EOF || c2 === "/" || c2 === "\\" || c2 === "?" || c2 === "#" || stateOverride) {
                        if (buffer !== "") {
                          var temp = parseInt(buffer, 10);
                          if (temp !== relative[this._scheme]) {
                            this._port = temp + "";
                          }
                          buffer = "";
                        }
                        if (stateOverride) {
                          break loop;
                        }
                        state = "relative path start";
                        continue;
                      } else if (c2 === "	" || c2 === "\n" || c2 === "\r")
                        ;
                      else {
                        invalid.call(this);
                      }
                      break;
                    case "relative path start":
                      state = "relative path";
                      if (c2 !== "/" && c2 !== "\\") {
                        continue;
                      }
                      break;
                    case "relative path":
                      if (c2 === EOF || c2 === "/" || c2 === "\\" || !stateOverride && (c2 === "?" || c2 === "#")) {
                        var tmp;
                        if (tmp = relativePathDotMapping[buffer.toLowerCase()]) {
                          buffer = tmp;
                        }
                        if (buffer === "..") {
                          this._path.pop();
                          if (c2 !== "/" && c2 !== "\\") {
                            this._path.push("");
                          }
                        } else if (buffer === "." && c2 !== "/" && c2 !== "\\") {
                          this._path.push("");
                        } else if (buffer !== ".") {
                          if (this._scheme === "file" && this._path.length === 0 && buffer.length === 2 && ALPHA.test(buffer[0]) && buffer[1] === "|") {
                            buffer = buffer[0] + ":";
                          }
                          this._path.push(buffer);
                        }
                        buffer = "";
                        if (c2 === "?") {
                          this._query = "?";
                          state = "query";
                        } else if (c2 === "#") {
                          this._fragment = "#";
                          state = "fragment";
                        }
                      } else if (c2 !== "	" && c2 !== "\n" && c2 !== "\r") {
                        buffer += percentEscape(c2);
                      }
                      break;
                    case "query":
                      if (!stateOverride && c2 === "#") {
                        this._fragment = "#";
                        state = "fragment";
                      } else if (c2 !== EOF && c2 !== "	" && c2 !== "\n" && c2 !== "\r") {
                        this._query += percentEscapeQuery(c2);
                      }
                      break;
                    case "fragment":
                      if (c2 !== EOF && c2 !== "	" && c2 !== "\n" && c2 !== "\r") {
                        this._fragment += c2;
                      }
                      break;
                  }
                  cursor++;
                }
            }
            function clear() {
              this._scheme = "";
              this._schemeData = "";
              this._username = "";
              this._password = null;
              this._host = "";
              this._port = "";
              this._path = [];
              this._query = "";
              this._fragment = "";
              this._isInvalid = false;
              this._isRelative = false;
            }
            function JURL(url, base2) {
              if (base2 !== void 0 && !(base2 instanceof JURL)) {
                base2 = new JURL(String(base2));
              }
              this._url = url;
              clear.call(this);
              var input = url.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, "");
              parse2.call(this, input, null, base2);
            }
            JURL.prototype = {
              toString: function toString3() {
                return this.href;
              },
              get href() {
                if (this._isInvalid) {
                  return this._url;
                }
                var authority = "";
                if (this._username !== "" || this._password !== null) {
                  authority = this._username + (this._password !== null ? ":" + this._password : "") + "@";
                }
                return this.protocol + (this._isRelative ? "//" + authority + this.host : "") + this.pathname + this._query + this._fragment;
              },
              set href(value) {
                clear.call(this);
                parse2.call(this, value);
              },
              get protocol() {
                return this._scheme + ":";
              },
              set protocol(value) {
                if (this._isInvalid) {
                  return;
                }
                parse2.call(this, value + ":", "scheme start");
              },
              get host() {
                return this._isInvalid ? "" : this._port ? this._host + ":" + this._port : this._host;
              },
              set host(value) {
                if (this._isInvalid || !this._isRelative) {
                  return;
                }
                parse2.call(this, value, "host");
              },
              get hostname() {
                return this._host;
              },
              set hostname(value) {
                if (this._isInvalid || !this._isRelative) {
                  return;
                }
                parse2.call(this, value, "hostname");
              },
              get port() {
                return this._port;
              },
              set port(value) {
                if (this._isInvalid || !this._isRelative) {
                  return;
                }
                parse2.call(this, value, "port");
              },
              get pathname() {
                return this._isInvalid ? "" : this._isRelative ? "/" + this._path.join("/") : this._schemeData;
              },
              set pathname(value) {
                if (this._isInvalid || !this._isRelative) {
                  return;
                }
                this._path = [];
                parse2.call(this, value, "relative path start");
              },
              get search() {
                return this._isInvalid || !this._query || this._query === "?" ? "" : this._query;
              },
              set search(value) {
                if (this._isInvalid || !this._isRelative) {
                  return;
                }
                this._query = "?";
                if (value[0] === "?") {
                  value = value.slice(1);
                }
                parse2.call(this, value, "query");
              },
              get hash() {
                return this._isInvalid || !this._fragment || this._fragment === "#" ? "" : this._fragment;
              },
              set hash(value) {
                if (this._isInvalid) {
                  return;
                }
                this._fragment = "#";
                if (value[0] === "#") {
                  value = value.slice(1);
                }
                parse2.call(this, value, "fragment");
              },
              get origin() {
                var host;
                if (this._isInvalid || !this._scheme) {
                  return "";
                }
                switch (this._scheme) {
                  case "data":
                  case "file":
                  case "javascript":
                  case "mailto":
                    return "null";
                  case "blob":
                    try {
                      return new JURL(this._schemeData).origin || "null";
                    } catch (_) {
                    }
                    return "null";
                }
                host = this.host;
                if (!host) {
                  return "";
                }
                return this._scheme + "://" + host;
              }
            };
            exports2.URL = JURL;
          })();
        },
        /* 146 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.getDocument = getDocument;
          exports2.setPDFNetworkStreamFactory = setPDFNetworkStreamFactory;
          exports2.build = exports2.version = exports2.PDFPageProxy = exports2.PDFDocumentProxy = exports2.PDFWorker = exports2.PDFDataRangeTransport = exports2.LoopbackPort = void 0;
          var _regenerator = _interopRequireDefault(__w_pdfjs_require__(147));
          var _util = __w_pdfjs_require__(1);
          var _dom_utils = __w_pdfjs_require__(151);
          var _font_loader = __w_pdfjs_require__(152);
          var _api_compatibility = __w_pdfjs_require__(153);
          var _canvas = __w_pdfjs_require__(154);
          var _global_scope = _interopRequireDefault(__w_pdfjs_require__(3));
          var _worker_options = __w_pdfjs_require__(156);
          var _message_handler = __w_pdfjs_require__(157);
          var _metadata = __w_pdfjs_require__(158);
          var _transport_stream = __w_pdfjs_require__(160);
          var _webgl = __w_pdfjs_require__(161);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
            try {
              var info = gen[key](arg);
              var value = info.value;
            } catch (error2) {
              reject(error2);
              return;
            }
            if (info.done) {
              resolve(value);
            } else {
              Promise.resolve(value).then(_next, _throw);
            }
          }
          function _asyncToGenerator(fn) {
            return function() {
              var self2 = this, args = arguments;
              return new Promise(function(resolve, reject) {
                var gen = fn.apply(self2, args);
                function _next(value) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                }
                function _throw(err) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                }
                _next(void 0);
              });
            };
          }
          function _slicedToArray(arr, i) {
            return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
          }
          function _nonIterableRest() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
          }
          function _iterableToArrayLimit(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = void 0;
            try {
              for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);
                if (i && _arr.length === i)
                  break;
              }
            } catch (err) {
              _d = true;
              _e = err;
            } finally {
              try {
                if (!_n && _i["return"] != null)
                  _i["return"]();
              } finally {
                if (_d)
                  throw _e;
              }
            }
            return _arr;
          }
          function _arrayWithHoles(arr) {
            if (Array.isArray(arr))
              return arr;
          }
          function _toConsumableArray(arr) {
            return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
          }
          function _nonIterableSpread() {
            throw new TypeError("Invalid attempt to spread non-iterable instance");
          }
          function _iterableToArray(iter) {
            if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]")
              return Array.from(iter);
          }
          function _arrayWithoutHoles(arr) {
            if (Array.isArray(arr)) {
              for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
              }
              return arr2;
            }
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            return Constructor;
          }
          function _typeof(obj) {
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
              _typeof = function _typeof2(obj2) {
                return typeof obj2;
              };
            } else {
              _typeof = function _typeof2(obj2) {
                return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
              };
            }
            return _typeof(obj);
          }
          var DEFAULT_RANGE_CHUNK_SIZE = 65536;
          var isWorkerDisabled = false;
          var fallbackWorkerSrc;
          var fakeWorkerFilesLoader = null;
          {
            var useRequireEnsure = false;
            if (typeof window === "undefined") {
              isWorkerDisabled = true;
              if (typeof commonjsRequire.ensure === "undefined") {
                commonjsRequire.ensure = require$$5;
              }
              useRequireEnsure = true;
            } else if (typeof commonjsRequire !== "undefined" && typeof commonjsRequire.ensure === "function") {
              useRequireEnsure = true;
            }
            if (typeof requirejs !== "undefined" && requirejs.toUrl) {
              fallbackWorkerSrc = requirejs.toUrl("pdfjs-dist/build/pdf.worker.js");
            }
            var dynamicLoaderSupported = typeof requirejs !== "undefined" && requirejs.load;
            fakeWorkerFilesLoader = useRequireEnsure ? function() {
              return new Promise(function(resolve, reject) {
                commonjsRequire.ensure([], function() {
                  try {
                    var worker;
                    worker = require$$1;
                    resolve(worker.WorkerMessageHandler);
                  } catch (ex) {
                    reject(ex);
                  }
                }, reject, "pdfjsWorker");
              });
            } : dynamicLoaderSupported ? function() {
              return new Promise(function(resolve, reject) {
                requirejs(["pdfjs-dist/build/pdf.worker"], function(worker) {
                  try {
                    resolve(worker.WorkerMessageHandler);
                  } catch (ex) {
                    reject(ex);
                  }
                }, reject);
              });
            } : null;
            if (!fallbackWorkerSrc && (typeof document === "undefined" ? "undefined" : _typeof(document)) === "object" && "currentScript" in document) {
              var pdfjsFilePath = document.currentScript && document.currentScript.src;
              if (pdfjsFilePath) {
                fallbackWorkerSrc = pdfjsFilePath.replace(/(\.(?:min\.)?js)(\?.*)?$/i, ".worker$1$2");
              }
            }
          }
          var createPDFNetworkStream;
          function setPDFNetworkStreamFactory(pdfNetworkStreamFactory) {
            createPDFNetworkStream = pdfNetworkStreamFactory;
          }
          function getDocument(src) {
            var task = new PDFDocumentLoadingTask();
            var source;
            if (typeof src === "string") {
              source = {
                url: src
              };
            } else if ((0, _util.isArrayBuffer)(src)) {
              source = {
                data: src
              };
            } else if (src instanceof PDFDataRangeTransport) {
              source = {
                range: src
              };
            } else {
              if (_typeof(src) !== "object") {
                throw new Error("Invalid parameter in getDocument, need either Uint8Array, string or a parameter object");
              }
              if (!src.url && !src.data && !src.range) {
                throw new Error("Invalid parameter object: need either .data, .range or .url");
              }
              source = src;
            }
            var params = /* @__PURE__ */ Object.create(null);
            var rangeTransport = null, worker = null;
            for (var key in source) {
              if (key === "url" && typeof window !== "undefined") {
                params[key] = new _util.URL(source[key], window.location).href;
                continue;
              } else if (key === "range") {
                rangeTransport = source[key];
                continue;
              } else if (key === "worker") {
                worker = source[key];
                continue;
              } else if (key === "data" && !(source[key] instanceof Uint8Array)) {
                var pdfBytes = source[key];
                if (typeof pdfBytes === "string") {
                  params[key] = (0, _util.stringToBytes)(pdfBytes);
                } else if (_typeof(pdfBytes) === "object" && pdfBytes !== null && !isNaN(pdfBytes.length)) {
                  params[key] = new Uint8Array(pdfBytes);
                } else if ((0, _util.isArrayBuffer)(pdfBytes)) {
                  params[key] = new Uint8Array(pdfBytes);
                } else {
                  throw new Error("Invalid PDF binary data: either typed array, string or array-like object is expected in the data property.");
                }
                continue;
              }
              params[key] = source[key];
            }
            params.rangeChunkSize = params.rangeChunkSize || DEFAULT_RANGE_CHUNK_SIZE;
            params.CMapReaderFactory = params.CMapReaderFactory || _dom_utils.DOMCMapReaderFactory;
            params.ignoreErrors = params.stopAtErrors !== true;
            params.pdfBug = params.pdfBug === true;
            var NativeImageDecoderValues = Object.values(_util.NativeImageDecoding);
            if (params.nativeImageDecoderSupport === void 0 || !NativeImageDecoderValues.includes(params.nativeImageDecoderSupport)) {
              params.nativeImageDecoderSupport = _api_compatibility.apiCompatibilityParams.nativeImageDecoderSupport || _util.NativeImageDecoding.DECODE;
            }
            if (!Number.isInteger(params.maxImageSize)) {
              params.maxImageSize = -1;
            }
            if (typeof params.isEvalSupported !== "boolean") {
              params.isEvalSupported = true;
            }
            if (typeof params.disableFontFace !== "boolean") {
              params.disableFontFace = _api_compatibility.apiCompatibilityParams.disableFontFace || false;
            }
            if (typeof params.disableRange !== "boolean") {
              params.disableRange = false;
            }
            if (typeof params.disableStream !== "boolean") {
              params.disableStream = false;
            }
            if (typeof params.disableAutoFetch !== "boolean") {
              params.disableAutoFetch = false;
            }
            if (typeof params.disableCreateObjectURL !== "boolean") {
              params.disableCreateObjectURL = _api_compatibility.apiCompatibilityParams.disableCreateObjectURL || false;
            }
            (0, _util.setVerbosityLevel)(params.verbosity);
            if (!worker) {
              var workerParams = {
                postMessageTransfers: params.postMessageTransfers,
                verbosity: params.verbosity,
                port: _worker_options.GlobalWorkerOptions.workerPort
              };
              worker = workerParams.port ? PDFWorker.fromPort(workerParams) : new PDFWorker(workerParams);
              task._worker = worker;
            }
            var docId = task.docId;
            worker.promise.then(function() {
              if (task.destroyed) {
                throw new Error("Loading aborted");
              }
              return _fetchDocument(worker, params, rangeTransport, docId).then(function(workerId) {
                if (task.destroyed) {
                  throw new Error("Loading aborted");
                }
                var networkStream;
                if (rangeTransport) {
                  networkStream = new _transport_stream.PDFDataTransportStream({
                    length: params.length,
                    initialData: params.initialData,
                    disableRange: params.disableRange,
                    disableStream: params.disableStream
                  }, rangeTransport);
                } else if (!params.data) {
                  networkStream = createPDFNetworkStream({
                    url: params.url,
                    length: params.length,
                    httpHeaders: params.httpHeaders,
                    withCredentials: params.withCredentials,
                    rangeChunkSize: params.rangeChunkSize,
                    disableRange: params.disableRange,
                    disableStream: params.disableStream
                  });
                }
                var messageHandler = new _message_handler.MessageHandler(docId, workerId, worker.port);
                messageHandler.postMessageTransfers = worker.postMessageTransfers;
                var transport = new WorkerTransport(messageHandler, task, networkStream, params);
                task._transport = transport;
                messageHandler.send("Ready", null);
              });
            }).catch(task._capability.reject);
            return task;
          }
          function _fetchDocument(worker, source, pdfDataRangeTransport, docId) {
            if (worker.destroyed) {
              return Promise.reject(new Error("Worker was destroyed"));
            }
            if (pdfDataRangeTransport) {
              source.length = pdfDataRangeTransport.length;
              source.initialData = pdfDataRangeTransport.initialData;
            }
            return worker.messageHandler.sendWithPromise("GetDocRequest", {
              docId,
              apiVersion: "2.1.266",
              source: {
                data: source.data,
                url: source.url,
                password: source.password,
                disableAutoFetch: source.disableAutoFetch,
                rangeChunkSize: source.rangeChunkSize,
                length: source.length
              },
              maxImageSize: source.maxImageSize,
              disableFontFace: source.disableFontFace,
              disableCreateObjectURL: source.disableCreateObjectURL,
              postMessageTransfers: worker.postMessageTransfers,
              docBaseUrl: source.docBaseUrl,
              nativeImageDecoderSupport: source.nativeImageDecoderSupport,
              ignoreErrors: source.ignoreErrors,
              isEvalSupported: source.isEvalSupported
            }).then(function(workerId) {
              if (worker.destroyed) {
                throw new Error("Worker was destroyed");
              }
              return workerId;
            });
          }
          var PDFDocumentLoadingTask = function PDFDocumentLoadingTaskClosure() {
            var nextDocumentId = 0;
            var PDFDocumentLoadingTask2 = function() {
              function PDFDocumentLoadingTask3() {
                _classCallCheck(this, PDFDocumentLoadingTask3);
                this._capability = (0, _util.createPromiseCapability)();
                this._transport = null;
                this._worker = null;
                this.docId = "d" + nextDocumentId++;
                this.destroyed = false;
                this.onPassword = null;
                this.onProgress = null;
                this.onUnsupportedFeature = null;
              }
              _createClass(PDFDocumentLoadingTask3, [{
                key: "destroy",
                value: function destroy() {
                  var _this = this;
                  this.destroyed = true;
                  var transportDestroyed = !this._transport ? Promise.resolve() : this._transport.destroy();
                  return transportDestroyed.then(function() {
                    _this._transport = null;
                    if (_this._worker) {
                      _this._worker.destroy();
                      _this._worker = null;
                    }
                  });
                }
              }, {
                key: "then",
                value: function then(onFulfilled, onRejected) {
                  (0, _util.deprecated)("PDFDocumentLoadingTask.then method, use the `promise` getter instead.");
                  return this.promise.then.apply(this.promise, arguments);
                }
              }, {
                key: "promise",
                get: function get() {
                  return this._capability.promise;
                }
              }]);
              return PDFDocumentLoadingTask3;
            }();
            return PDFDocumentLoadingTask2;
          }();
          var PDFDataRangeTransport = function() {
            function PDFDataRangeTransport2(length, initialData) {
              _classCallCheck(this, PDFDataRangeTransport2);
              this.length = length;
              this.initialData = initialData;
              this._rangeListeners = [];
              this._progressListeners = [];
              this._progressiveReadListeners = [];
              this._readyCapability = (0, _util.createPromiseCapability)();
            }
            _createClass(PDFDataRangeTransport2, [{
              key: "addRangeListener",
              value: function addRangeListener(listener) {
                this._rangeListeners.push(listener);
              }
            }, {
              key: "addProgressListener",
              value: function addProgressListener(listener) {
                this._progressListeners.push(listener);
              }
            }, {
              key: "addProgressiveReadListener",
              value: function addProgressiveReadListener(listener) {
                this._progressiveReadListeners.push(listener);
              }
            }, {
              key: "onDataRange",
              value: function onDataRange(begin, chunk) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = void 0;
                try {
                  for (var _iterator = this._rangeListeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var listener = _step.value;
                    listener(begin, chunk);
                  }
                } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                      _iterator.return();
                    }
                  } finally {
                    if (_didIteratorError) {
                      throw _iteratorError;
                    }
                  }
                }
              }
            }, {
              key: "onDataProgress",
              value: function onDataProgress(loaded) {
                var _this2 = this;
                this._readyCapability.promise.then(function() {
                  var _iteratorNormalCompletion2 = true;
                  var _didIteratorError2 = false;
                  var _iteratorError2 = void 0;
                  try {
                    for (var _iterator2 = _this2._progressListeners[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var listener = _step2.value;
                      listener(loaded);
                    }
                  } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                        _iterator2.return();
                      }
                    } finally {
                      if (_didIteratorError2) {
                        throw _iteratorError2;
                      }
                    }
                  }
                });
              }
            }, {
              key: "onDataProgressiveRead",
              value: function onDataProgressiveRead(chunk) {
                var _this3 = this;
                this._readyCapability.promise.then(function() {
                  var _iteratorNormalCompletion3 = true;
                  var _didIteratorError3 = false;
                  var _iteratorError3 = void 0;
                  try {
                    for (var _iterator3 = _this3._progressiveReadListeners[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                      var listener = _step3.value;
                      listener(chunk);
                    }
                  } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                        _iterator3.return();
                      }
                    } finally {
                      if (_didIteratorError3) {
                        throw _iteratorError3;
                      }
                    }
                  }
                });
              }
            }, {
              key: "transportReady",
              value: function transportReady() {
                this._readyCapability.resolve();
              }
            }, {
              key: "requestDataRange",
              value: function requestDataRange(begin, end) {
                (0, _util.unreachable)("Abstract method PDFDataRangeTransport.requestDataRange");
              }
            }, {
              key: "abort",
              value: function abort() {
              }
            }]);
            return PDFDataRangeTransport2;
          }();
          exports2.PDFDataRangeTransport = PDFDataRangeTransport;
          var PDFDocumentProxy = function() {
            function PDFDocumentProxy2(pdfInfo, transport, loadingTask) {
              _classCallCheck(this, PDFDocumentProxy2);
              this.loadingTask = loadingTask;
              this._pdfInfo = pdfInfo;
              this._transport = transport;
            }
            _createClass(PDFDocumentProxy2, [{
              key: "getPage",
              value: function getPage(pageNumber) {
                return this._transport.getPage(pageNumber);
              }
            }, {
              key: "getPageIndex",
              value: function getPageIndex(ref) {
                return this._transport.getPageIndex(ref);
              }
            }, {
              key: "getDestinations",
              value: function getDestinations() {
                return this._transport.getDestinations();
              }
            }, {
              key: "getDestination",
              value: function getDestination(id) {
                return this._transport.getDestination(id);
              }
            }, {
              key: "getPageLabels",
              value: function getPageLabels() {
                return this._transport.getPageLabels();
              }
            }, {
              key: "getPageMode",
              value: function getPageMode() {
                return this._transport.getPageMode();
              }
            }, {
              key: "getOpenActionDestination",
              value: function getOpenActionDestination() {
                return this._transport.getOpenActionDestination();
              }
            }, {
              key: "getAttachments",
              value: function getAttachments() {
                return this._transport.getAttachments();
              }
            }, {
              key: "getJavaScript",
              value: function getJavaScript() {
                return this._transport.getJavaScript();
              }
            }, {
              key: "getOutline",
              value: function getOutline() {
                return this._transport.getOutline();
              }
            }, {
              key: "getPermissions",
              value: function getPermissions() {
                return this._transport.getPermissions();
              }
            }, {
              key: "getMetadata",
              value: function getMetadata() {
                return this._transport.getMetadata();
              }
            }, {
              key: "getData",
              value: function getData() {
                return this._transport.getData();
              }
            }, {
              key: "getDownloadInfo",
              value: function getDownloadInfo() {
                return this._transport.downloadInfoCapability.promise;
              }
            }, {
              key: "getStats",
              value: function getStats() {
                return this._transport.getStats();
              }
            }, {
              key: "cleanup",
              value: function cleanup() {
                this._transport.startCleanup();
              }
            }, {
              key: "destroy",
              value: function destroy() {
                return this.loadingTask.destroy();
              }
            }, {
              key: "numPages",
              get: function get() {
                return this._pdfInfo.numPages;
              }
            }, {
              key: "fingerprint",
              get: function get() {
                return this._pdfInfo.fingerprint;
              }
            }, {
              key: "loadingParams",
              get: function get() {
                return this._transport.loadingParams;
              }
            }]);
            return PDFDocumentProxy2;
          }();
          exports2.PDFDocumentProxy = PDFDocumentProxy;
          var PDFPageProxy = function() {
            function PDFPageProxy2(pageIndex, pageInfo, transport) {
              var pdfBug = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
              _classCallCheck(this, PDFPageProxy2);
              this.pageIndex = pageIndex;
              this._pageInfo = pageInfo;
              this._transport = transport;
              this._stats = pdfBug ? new _dom_utils.StatTimer() : _dom_utils.DummyStatTimer;
              this._pdfBug = pdfBug;
              this.commonObjs = transport.commonObjs;
              this.objs = new PDFObjects();
              this.cleanupAfterRender = false;
              this.pendingCleanup = false;
              this.intentStates = /* @__PURE__ */ Object.create(null);
              this.destroyed = false;
            }
            _createClass(PDFPageProxy2, [{
              key: "getViewport",
              value: function getViewport() {
                var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, scale = _ref.scale, _ref$rotation = _ref.rotation, rotation = _ref$rotation === void 0 ? this.rotate : _ref$rotation, _ref$dontFlip = _ref.dontFlip, dontFlip = _ref$dontFlip === void 0 ? false : _ref$dontFlip;
                if (arguments.length > 1 || typeof arguments[0] === "number") {
                  (0, _util.deprecated)("getViewport is called with obsolete arguments.");
                  scale = arguments[0];
                  rotation = typeof arguments[1] === "number" ? arguments[1] : this.rotate;
                  dontFlip = typeof arguments[2] === "boolean" ? arguments[2] : false;
                }
                return new _dom_utils.PageViewport({
                  viewBox: this.view,
                  scale,
                  rotation,
                  dontFlip
                });
              }
            }, {
              key: "getAnnotations",
              value: function getAnnotations() {
                var _ref2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, _ref2$intent = _ref2.intent, intent = _ref2$intent === void 0 ? null : _ref2$intent;
                if (!this.annotationsPromise || this.annotationsIntent !== intent) {
                  this.annotationsPromise = this._transport.getAnnotations(this.pageIndex, intent);
                  this.annotationsIntent = intent;
                }
                return this.annotationsPromise;
              }
            }, {
              key: "render",
              value: function render(_ref3) {
                var _this4 = this;
                var canvasContext = _ref3.canvasContext, viewport = _ref3.viewport, _ref3$intent = _ref3.intent, intent = _ref3$intent === void 0 ? "display" : _ref3$intent, _ref3$enableWebGL = _ref3.enableWebGL, enableWebGL = _ref3$enableWebGL === void 0 ? false : _ref3$enableWebGL, _ref3$renderInteracti = _ref3.renderInteractiveForms, renderInteractiveForms = _ref3$renderInteracti === void 0 ? false : _ref3$renderInteracti, _ref3$transform = _ref3.transform, transform = _ref3$transform === void 0 ? null : _ref3$transform, _ref3$imageLayer = _ref3.imageLayer, imageLayer = _ref3$imageLayer === void 0 ? null : _ref3$imageLayer, _ref3$canvasFactory = _ref3.canvasFactory, canvasFactory = _ref3$canvasFactory === void 0 ? null : _ref3$canvasFactory, _ref3$background = _ref3.background, background = _ref3$background === void 0 ? null : _ref3$background;
                var stats = this._stats;
                stats.time("Overall");
                this.pendingCleanup = false;
                var renderingIntent = intent === "print" ? "print" : "display";
                var canvasFactoryInstance = canvasFactory || new _dom_utils.DOMCanvasFactory();
                var webGLContext = new _webgl.WebGLContext({
                  enable: enableWebGL
                });
                if (!this.intentStates[renderingIntent]) {
                  this.intentStates[renderingIntent] = /* @__PURE__ */ Object.create(null);
                }
                var intentState = this.intentStates[renderingIntent];
                if (!intentState.displayReadyCapability) {
                  intentState.receivingOperatorList = true;
                  intentState.displayReadyCapability = (0, _util.createPromiseCapability)();
                  intentState.operatorList = {
                    fnArray: [],
                    argsArray: [],
                    lastChunk: false
                  };
                  stats.time("Page Request");
                  this._transport.messageHandler.send("RenderPageRequest", {
                    pageIndex: this.pageNumber - 1,
                    intent: renderingIntent,
                    renderInteractiveForms: renderInteractiveForms === true
                  });
                }
                var complete = function complete2(error2) {
                  var i = intentState.renderTasks.indexOf(internalRenderTask);
                  if (i >= 0) {
                    intentState.renderTasks.splice(i, 1);
                  }
                  if (_this4.cleanupAfterRender) {
                    _this4.pendingCleanup = true;
                  }
                  _this4._tryCleanup();
                  if (error2) {
                    internalRenderTask.capability.reject(error2);
                  } else {
                    internalRenderTask.capability.resolve();
                  }
                  stats.timeEnd("Rendering");
                  stats.timeEnd("Overall");
                };
                var internalRenderTask = new InternalRenderTask({
                  callback: complete,
                  params: {
                    canvasContext,
                    viewport,
                    transform,
                    imageLayer,
                    background
                  },
                  objs: this.objs,
                  commonObjs: this.commonObjs,
                  operatorList: intentState.operatorList,
                  pageNumber: this.pageNumber,
                  canvasFactory: canvasFactoryInstance,
                  webGLContext,
                  useRequestAnimationFrame: renderingIntent !== "print",
                  pdfBug: this._pdfBug
                });
                if (!intentState.renderTasks) {
                  intentState.renderTasks = [];
                }
                intentState.renderTasks.push(internalRenderTask);
                var renderTask = internalRenderTask.task;
                intentState.displayReadyCapability.promise.then(function(transparency) {
                  if (_this4.pendingCleanup) {
                    complete();
                    return;
                  }
                  stats.time("Rendering");
                  internalRenderTask.initializeGraphics(transparency);
                  internalRenderTask.operatorListChanged();
                }).catch(complete);
                return renderTask;
              }
            }, {
              key: "getOperatorList",
              value: function getOperatorList() {
                function operatorListChanged() {
                  if (intentState.operatorList.lastChunk) {
                    intentState.opListReadCapability.resolve(intentState.operatorList);
                    var i = intentState.renderTasks.indexOf(opListTask);
                    if (i >= 0) {
                      intentState.renderTasks.splice(i, 1);
                    }
                  }
                }
                var renderingIntent = "oplist";
                if (!this.intentStates[renderingIntent]) {
                  this.intentStates[renderingIntent] = /* @__PURE__ */ Object.create(null);
                }
                var intentState = this.intentStates[renderingIntent];
                var opListTask;
                if (!intentState.opListReadCapability) {
                  opListTask = {};
                  opListTask.operatorListChanged = operatorListChanged;
                  intentState.receivingOperatorList = true;
                  intentState.opListReadCapability = (0, _util.createPromiseCapability)();
                  intentState.renderTasks = [];
                  intentState.renderTasks.push(opListTask);
                  intentState.operatorList = {
                    fnArray: [],
                    argsArray: [],
                    lastChunk: false
                  };
                  this._stats.time("Page Request");
                  this._transport.messageHandler.send("RenderPageRequest", {
                    pageIndex: this.pageIndex,
                    intent: renderingIntent
                  });
                }
                return intentState.opListReadCapability.promise;
              }
            }, {
              key: "streamTextContent",
              value: function streamTextContent() {
                var _ref4 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, _ref4$normalizeWhites = _ref4.normalizeWhitespace, normalizeWhitespace = _ref4$normalizeWhites === void 0 ? false : _ref4$normalizeWhites, _ref4$disableCombineT = _ref4.disableCombineTextItems, disableCombineTextItems = _ref4$disableCombineT === void 0 ? false : _ref4$disableCombineT;
                var TEXT_CONTENT_CHUNK_SIZE = 100;
                return this._transport.messageHandler.sendWithStream("GetTextContent", {
                  pageIndex: this.pageNumber - 1,
                  normalizeWhitespace: normalizeWhitespace === true,
                  combineTextItems: disableCombineTextItems !== true
                }, {
                  highWaterMark: TEXT_CONTENT_CHUNK_SIZE,
                  size: function size(textContent) {
                    return textContent.items.length;
                  }
                });
              }
            }, {
              key: "getTextContent",
              value: function getTextContent() {
                var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
                var readableStream = this.streamTextContent(params);
                return new Promise(function(resolve, reject) {
                  function pump() {
                    reader.read().then(function(_ref5) {
                      var _textContent$items;
                      var value = _ref5.value, done = _ref5.done;
                      if (done) {
                        resolve(textContent);
                        return;
                      }
                      Object.assign(textContent.styles, value.styles);
                      (_textContent$items = textContent.items).push.apply(_textContent$items, _toConsumableArray(value.items));
                      pump();
                    }, reject);
                  }
                  var reader = readableStream.getReader();
                  var textContent = {
                    items: [],
                    styles: /* @__PURE__ */ Object.create(null)
                  };
                  pump();
                });
              }
            }, {
              key: "_destroy",
              value: function _destroy() {
                this.destroyed = true;
                this._transport.pageCache[this.pageIndex] = null;
                var waitOn = [];
                Object.keys(this.intentStates).forEach(function(intent) {
                  if (intent === "oplist") {
                    return;
                  }
                  var intentState = this.intentStates[intent];
                  intentState.renderTasks.forEach(function(renderTask) {
                    var renderCompleted = renderTask.capability.promise.catch(function() {
                    });
                    waitOn.push(renderCompleted);
                    renderTask.cancel();
                  });
                }, this);
                this.objs.clear();
                this.annotationsPromise = null;
                this.pendingCleanup = false;
                return Promise.all(waitOn);
              }
            }, {
              key: "cleanup",
              value: function cleanup() {
                var resetStats = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
                this.pendingCleanup = true;
                this._tryCleanup(resetStats);
              }
            }, {
              key: "_tryCleanup",
              value: function _tryCleanup() {
                var resetStats = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
                if (!this.pendingCleanup || Object.keys(this.intentStates).some(function(intent) {
                  var intentState = this.intentStates[intent];
                  return intentState.renderTasks.length !== 0 || intentState.receivingOperatorList;
                }, this)) {
                  return;
                }
                Object.keys(this.intentStates).forEach(function(intent) {
                  delete this.intentStates[intent];
                }, this);
                this.objs.clear();
                this.annotationsPromise = null;
                if (resetStats && this._stats instanceof _dom_utils.StatTimer) {
                  this._stats = new _dom_utils.StatTimer();
                }
                this.pendingCleanup = false;
              }
            }, {
              key: "_startRenderPage",
              value: function _startRenderPage(transparency, intent) {
                var intentState = this.intentStates[intent];
                if (intentState.displayReadyCapability) {
                  intentState.displayReadyCapability.resolve(transparency);
                }
              }
            }, {
              key: "_renderPageChunk",
              value: function _renderPageChunk(operatorListChunk, intent) {
                var intentState = this.intentStates[intent];
                for (var i = 0, ii = operatorListChunk.length; i < ii; i++) {
                  intentState.operatorList.fnArray.push(operatorListChunk.fnArray[i]);
                  intentState.operatorList.argsArray.push(operatorListChunk.argsArray[i]);
                }
                intentState.operatorList.lastChunk = operatorListChunk.lastChunk;
                for (var _i = 0; _i < intentState.renderTasks.length; _i++) {
                  intentState.renderTasks[_i].operatorListChanged();
                }
                if (operatorListChunk.lastChunk) {
                  intentState.receivingOperatorList = false;
                  this._tryCleanup();
                }
              }
            }, {
              key: "pageNumber",
              get: function get() {
                return this.pageIndex + 1;
              }
            }, {
              key: "rotate",
              get: function get() {
                return this._pageInfo.rotate;
              }
            }, {
              key: "ref",
              get: function get() {
                return this._pageInfo.ref;
              }
            }, {
              key: "userUnit",
              get: function get() {
                return this._pageInfo.userUnit;
              }
            }, {
              key: "view",
              get: function get() {
                return this._pageInfo.view;
              }
            }, {
              key: "stats",
              get: function get() {
                return this._stats instanceof _dom_utils.StatTimer ? this._stats : null;
              }
            }]);
            return PDFPageProxy2;
          }();
          exports2.PDFPageProxy = PDFPageProxy;
          var LoopbackPort = function() {
            function LoopbackPort2() {
              var defer = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
              _classCallCheck(this, LoopbackPort2);
              this._listeners = [];
              this._defer = defer;
              this._deferred = Promise.resolve(void 0);
            }
            _createClass(LoopbackPort2, [{
              key: "postMessage",
              value: function postMessage2(obj, transfers) {
                var _this5 = this;
                function cloneValue(value) {
                  if (_typeof(value) !== "object" || value === null) {
                    return value;
                  }
                  if (cloned.has(value)) {
                    return cloned.get(value);
                  }
                  var buffer, result;
                  if ((buffer = value.buffer) && (0, _util.isArrayBuffer)(buffer)) {
                    var transferable = transfers && transfers.includes(buffer);
                    if (value === buffer) {
                      result = value;
                    } else if (transferable) {
                      result = new value.constructor(buffer, value.byteOffset, value.byteLength);
                    } else {
                      result = new value.constructor(value);
                    }
                    cloned.set(value, result);
                    return result;
                  }
                  result = Array.isArray(value) ? [] : {};
                  cloned.set(value, result);
                  for (var i in value) {
                    var desc = void 0, p = value;
                    while (!(desc = Object.getOwnPropertyDescriptor(p, i))) {
                      p = Object.getPrototypeOf(p);
                    }
                    if (typeof desc.value === "undefined" || typeof desc.value === "function") {
                      continue;
                    }
                    result[i] = cloneValue(desc.value);
                  }
                  return result;
                }
                if (!this._defer) {
                  this._listeners.forEach(function(listener) {
                    listener.call(this, {
                      data: obj
                    });
                  }, this);
                  return;
                }
                var cloned = /* @__PURE__ */ new WeakMap();
                var e = {
                  data: cloneValue(obj)
                };
                this._deferred.then(function() {
                  _this5._listeners.forEach(function(listener) {
                    listener.call(this, e);
                  }, _this5);
                });
              }
            }, {
              key: "addEventListener",
              value: function addEventListener(name, listener) {
                this._listeners.push(listener);
              }
            }, {
              key: "removeEventListener",
              value: function removeEventListener(name, listener) {
                var i = this._listeners.indexOf(listener);
                this._listeners.splice(i, 1);
              }
            }, {
              key: "terminate",
              value: function terminate() {
                this._listeners = [];
              }
            }]);
            return LoopbackPort2;
          }();
          exports2.LoopbackPort = LoopbackPort;
          var PDFWorker = function PDFWorkerClosure() {
            var pdfWorkerPorts = /* @__PURE__ */ new WeakMap();
            var nextFakeWorkerId = 0;
            var fakeWorkerFilesLoadedCapability;
            function _getWorkerSrc() {
              if (_worker_options.GlobalWorkerOptions.workerSrc) {
                return _worker_options.GlobalWorkerOptions.workerSrc;
              }
              if (typeof fallbackWorkerSrc !== "undefined") {
                return fallbackWorkerSrc;
              }
              throw new Error('No "GlobalWorkerOptions.workerSrc" specified.');
            }
            function getMainThreadWorkerMessageHandler() {
              try {
                if (typeof window !== "undefined") {
                  return window.pdfjsWorker && window.pdfjsWorker.WorkerMessageHandler;
                }
              } catch (ex) {
              }
              return null;
            }
            function setupFakeWorkerGlobal() {
              if (fakeWorkerFilesLoadedCapability) {
                return fakeWorkerFilesLoadedCapability.promise;
              }
              fakeWorkerFilesLoadedCapability = (0, _util.createPromiseCapability)();
              var mainWorkerMessageHandler = getMainThreadWorkerMessageHandler();
              if (mainWorkerMessageHandler) {
                fakeWorkerFilesLoadedCapability.resolve(mainWorkerMessageHandler);
                return fakeWorkerFilesLoadedCapability.promise;
              }
              var loader = fakeWorkerFilesLoader || function() {
                return (0, _dom_utils.loadScript)(_getWorkerSrc()).then(function() {
                  return window.pdfjsWorker.WorkerMessageHandler;
                });
              };
              loader().then(fakeWorkerFilesLoadedCapability.resolve, fakeWorkerFilesLoadedCapability.reject);
              return fakeWorkerFilesLoadedCapability.promise;
            }
            function createCDNWrapper(url) {
              var wrapper = "importScripts('" + url + "');";
              return _util.URL.createObjectURL(new Blob([wrapper]));
            }
            var PDFWorker2 = function() {
              function PDFWorker3() {
                var _ref6 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, _ref6$name = _ref6.name, name = _ref6$name === void 0 ? null : _ref6$name, _ref6$port = _ref6.port, port = _ref6$port === void 0 ? null : _ref6$port, _ref6$postMessageTran = _ref6.postMessageTransfers, postMessageTransfers = _ref6$postMessageTran === void 0 ? true : _ref6$postMessageTran, _ref6$verbosity = _ref6.verbosity, verbosity = _ref6$verbosity === void 0 ? (0, _util.getVerbosityLevel)() : _ref6$verbosity;
                _classCallCheck(this, PDFWorker3);
                if (port && pdfWorkerPorts.has(port)) {
                  throw new Error("Cannot use more than one PDFWorker per port");
                }
                this.name = name;
                this.destroyed = false;
                this.postMessageTransfers = postMessageTransfers !== false;
                this.verbosity = verbosity;
                this._readyCapability = (0, _util.createPromiseCapability)();
                this._port = null;
                this._webWorker = null;
                this._messageHandler = null;
                if (port) {
                  pdfWorkerPorts.set(port, this);
                  this._initializeFromPort(port);
                  return;
                }
                this._initialize();
              }
              _createClass(PDFWorker3, [{
                key: "_initializeFromPort",
                value: function _initializeFromPort(port) {
                  this._port = port;
                  this._messageHandler = new _message_handler.MessageHandler("main", "worker", port);
                  this._messageHandler.on("ready", function() {
                  });
                  this._readyCapability.resolve();
                }
              }, {
                key: "_initialize",
                value: function _initialize() {
                  var _this6 = this;
                  if (typeof Worker !== "undefined" && !isWorkerDisabled && !getMainThreadWorkerMessageHandler()) {
                    var workerSrc = _getWorkerSrc();
                    try {
                      if (!(0, _util.isSameOrigin)(window.location.href, workerSrc)) {
                        workerSrc = createCDNWrapper(new _util.URL(workerSrc, window.location).href);
                      }
                      var worker = new Worker(workerSrc);
                      var messageHandler = new _message_handler.MessageHandler("main", "worker", worker);
                      var terminateEarly = function terminateEarly2() {
                        worker.removeEventListener("error", onWorkerError);
                        messageHandler.destroy();
                        worker.terminate();
                        if (_this6.destroyed) {
                          _this6._readyCapability.reject(new Error("Worker was destroyed"));
                        } else {
                          _this6._setupFakeWorker();
                        }
                      };
                      var onWorkerError = function onWorkerError2() {
                        if (!_this6._webWorker) {
                          terminateEarly();
                        }
                      };
                      worker.addEventListener("error", onWorkerError);
                      messageHandler.on("test", function(data) {
                        worker.removeEventListener("error", onWorkerError);
                        if (_this6.destroyed) {
                          terminateEarly();
                          return;
                        }
                        if (data && data.supportTypedArray) {
                          _this6._messageHandler = messageHandler;
                          _this6._port = worker;
                          _this6._webWorker = worker;
                          if (!data.supportTransfers) {
                            _this6.postMessageTransfers = false;
                          }
                          _this6._readyCapability.resolve();
                          messageHandler.send("configure", {
                            verbosity: _this6.verbosity
                          });
                        } else {
                          _this6._setupFakeWorker();
                          messageHandler.destroy();
                          worker.terminate();
                        }
                      });
                      messageHandler.on("ready", function(data) {
                        worker.removeEventListener("error", onWorkerError);
                        if (_this6.destroyed) {
                          terminateEarly();
                          return;
                        }
                        try {
                          sendTest();
                        } catch (e) {
                          _this6._setupFakeWorker();
                        }
                      });
                      var sendTest = function sendTest2() {
                        var testObj = new Uint8Array([_this6.postMessageTransfers ? 255 : 0]);
                        try {
                          messageHandler.send("test", testObj, [testObj.buffer]);
                        } catch (ex) {
                          (0, _util.info)("Cannot use postMessage transfers");
                          testObj[0] = 0;
                          messageHandler.send("test", testObj);
                        }
                      };
                      sendTest();
                      return;
                    } catch (e) {
                      (0, _util.info)("The worker has been disabled.");
                    }
                  }
                  this._setupFakeWorker();
                }
              }, {
                key: "_setupFakeWorker",
                value: function _setupFakeWorker() {
                  var _this7 = this;
                  if (!isWorkerDisabled) {
                    (0, _util.warn)("Setting up fake worker.");
                    isWorkerDisabled = true;
                  }
                  setupFakeWorkerGlobal().then(function(WorkerMessageHandler) {
                    if (_this7.destroyed) {
                      _this7._readyCapability.reject(new Error("Worker was destroyed"));
                      return;
                    }
                    var port = new LoopbackPort();
                    _this7._port = port;
                    var id = "fake" + nextFakeWorkerId++;
                    var workerHandler = new _message_handler.MessageHandler(id + "_worker", id, port);
                    WorkerMessageHandler.setup(workerHandler, port);
                    var messageHandler = new _message_handler.MessageHandler(id, id + "_worker", port);
                    _this7._messageHandler = messageHandler;
                    _this7._readyCapability.resolve();
                  }).catch(function(reason) {
                    _this7._readyCapability.reject(new Error('Setting up fake worker failed: "'.concat(reason.message, '".')));
                  });
                }
              }, {
                key: "destroy",
                value: function destroy() {
                  this.destroyed = true;
                  if (this._webWorker) {
                    this._webWorker.terminate();
                    this._webWorker = null;
                  }
                  pdfWorkerPorts.delete(this._port);
                  this._port = null;
                  if (this._messageHandler) {
                    this._messageHandler.destroy();
                    this._messageHandler = null;
                  }
                }
              }, {
                key: "promise",
                get: function get() {
                  return this._readyCapability.promise;
                }
              }, {
                key: "port",
                get: function get() {
                  return this._port;
                }
              }, {
                key: "messageHandler",
                get: function get() {
                  return this._messageHandler;
                }
              }], [{
                key: "fromPort",
                value: function fromPort(params) {
                  if (!params || !params.port) {
                    throw new Error("PDFWorker.fromPort - invalid method signature.");
                  }
                  if (pdfWorkerPorts.has(params.port)) {
                    return pdfWorkerPorts.get(params.port);
                  }
                  return new PDFWorker3(params);
                }
              }, {
                key: "getWorkerSrc",
                value: function getWorkerSrc() {
                  return _getWorkerSrc();
                }
              }]);
              return PDFWorker3;
            }();
            return PDFWorker2;
          }();
          exports2.PDFWorker = PDFWorker;
          var WorkerTransport = function() {
            function WorkerTransport2(messageHandler, loadingTask, networkStream, params) {
              _classCallCheck(this, WorkerTransport2);
              this.messageHandler = messageHandler;
              this.loadingTask = loadingTask;
              this.commonObjs = new PDFObjects();
              this.fontLoader = new _font_loader.FontLoader({
                docId: loadingTask.docId,
                onUnsupportedFeature: this._onUnsupportedFeature.bind(this)
              });
              this._params = params;
              this.CMapReaderFactory = new params.CMapReaderFactory({
                baseUrl: params.cMapUrl,
                isCompressed: params.cMapPacked
              });
              this.destroyed = false;
              this.destroyCapability = null;
              this._passwordCapability = null;
              this._networkStream = networkStream;
              this._fullReader = null;
              this._lastProgress = null;
              this.pageCache = [];
              this.pagePromises = [];
              this.downloadInfoCapability = (0, _util.createPromiseCapability)();
              this.setupMessageHandler();
            }
            _createClass(WorkerTransport2, [{
              key: "destroy",
              value: function destroy() {
                var _this8 = this;
                if (this.destroyCapability) {
                  return this.destroyCapability.promise;
                }
                this.destroyed = true;
                this.destroyCapability = (0, _util.createPromiseCapability)();
                if (this._passwordCapability) {
                  this._passwordCapability.reject(new Error("Worker was destroyed during onPassword callback"));
                }
                var waitOn = [];
                this.pageCache.forEach(function(page) {
                  if (page) {
                    waitOn.push(page._destroy());
                  }
                });
                this.pageCache = [];
                this.pagePromises = [];
                var terminated = this.messageHandler.sendWithPromise("Terminate", null);
                waitOn.push(terminated);
                Promise.all(waitOn).then(function() {
                  _this8.fontLoader.clear();
                  if (_this8._networkStream) {
                    _this8._networkStream.cancelAllRequests();
                  }
                  if (_this8.messageHandler) {
                    _this8.messageHandler.destroy();
                    _this8.messageHandler = null;
                  }
                  _this8.destroyCapability.resolve();
                }, this.destroyCapability.reject);
                return this.destroyCapability.promise;
              }
            }, {
              key: "setupMessageHandler",
              value: function setupMessageHandler() {
                var messageHandler = this.messageHandler, loadingTask = this.loadingTask;
                messageHandler.on("GetReader", function(data, sink) {
                  var _this9 = this;
                  (0, _util.assert)(this._networkStream);
                  this._fullReader = this._networkStream.getFullReader();
                  this._fullReader.onProgress = function(evt) {
                    _this9._lastProgress = {
                      loaded: evt.loaded,
                      total: evt.total
                    };
                  };
                  sink.onPull = function() {
                    _this9._fullReader.read().then(function(_ref7) {
                      var value = _ref7.value, done = _ref7.done;
                      if (done) {
                        sink.close();
                        return;
                      }
                      (0, _util.assert)((0, _util.isArrayBuffer)(value));
                      sink.enqueue(new Uint8Array(value), 1, [value]);
                    }).catch(function(reason) {
                      sink.error(reason);
                    });
                  };
                  sink.onCancel = function(reason) {
                    _this9._fullReader.cancel(reason);
                  };
                }, this);
                messageHandler.on("ReaderHeadersReady", function(data) {
                  var _this10 = this;
                  var headersCapability = (0, _util.createPromiseCapability)();
                  var fullReader = this._fullReader;
                  fullReader.headersReady.then(function() {
                    if (!fullReader.isStreamingSupported || !fullReader.isRangeSupported) {
                      if (_this10._lastProgress && loadingTask.onProgress) {
                        loadingTask.onProgress(_this10._lastProgress);
                      }
                      fullReader.onProgress = function(evt) {
                        if (loadingTask.onProgress) {
                          loadingTask.onProgress({
                            loaded: evt.loaded,
                            total: evt.total
                          });
                        }
                      };
                    }
                    headersCapability.resolve({
                      isStreamingSupported: fullReader.isStreamingSupported,
                      isRangeSupported: fullReader.isRangeSupported,
                      contentLength: fullReader.contentLength
                    });
                  }, headersCapability.reject);
                  return headersCapability.promise;
                }, this);
                messageHandler.on("GetRangeReader", function(data, sink) {
                  (0, _util.assert)(this._networkStream);
                  var rangeReader = this._networkStream.getRangeReader(data.begin, data.end);
                  sink.onPull = function() {
                    rangeReader.read().then(function(_ref8) {
                      var value = _ref8.value, done = _ref8.done;
                      if (done) {
                        sink.close();
                        return;
                      }
                      (0, _util.assert)((0, _util.isArrayBuffer)(value));
                      sink.enqueue(new Uint8Array(value), 1, [value]);
                    }).catch(function(reason) {
                      sink.error(reason);
                    });
                  };
                  sink.onCancel = function(reason) {
                    rangeReader.cancel(reason);
                  };
                }, this);
                messageHandler.on("GetDoc", function(_ref9) {
                  var pdfInfo = _ref9.pdfInfo;
                  this.numPages = pdfInfo.numPages;
                  this.pdfDocument = new PDFDocumentProxy(pdfInfo, this, loadingTask);
                  loadingTask._capability.resolve(this.pdfDocument);
                }, this);
                messageHandler.on("PasswordRequest", function(exception) {
                  var _this11 = this;
                  this._passwordCapability = (0, _util.createPromiseCapability)();
                  if (loadingTask.onPassword) {
                    var updatePassword = function updatePassword2(password) {
                      _this11._passwordCapability.resolve({
                        password
                      });
                    };
                    try {
                      loadingTask.onPassword(updatePassword, exception.code);
                    } catch (ex) {
                      this._passwordCapability.reject(ex);
                    }
                  } else {
                    this._passwordCapability.reject(new _util.PasswordException(exception.message, exception.code));
                  }
                  return this._passwordCapability.promise;
                }, this);
                messageHandler.on("PasswordException", function(exception) {
                  loadingTask._capability.reject(new _util.PasswordException(exception.message, exception.code));
                }, this);
                messageHandler.on("InvalidPDF", function(exception) {
                  loadingTask._capability.reject(new _util.InvalidPDFException(exception.message));
                }, this);
                messageHandler.on("MissingPDF", function(exception) {
                  loadingTask._capability.reject(new _util.MissingPDFException(exception.message));
                }, this);
                messageHandler.on("UnexpectedResponse", function(exception) {
                  loadingTask._capability.reject(new _util.UnexpectedResponseException(exception.message, exception.status));
                }, this);
                messageHandler.on("UnknownError", function(exception) {
                  loadingTask._capability.reject(new _util.UnknownErrorException(exception.message, exception.details));
                }, this);
                messageHandler.on("DataLoaded", function(data) {
                  if (loadingTask.onProgress) {
                    loadingTask.onProgress({
                      loaded: data.length,
                      total: data.length
                    });
                  }
                  this.downloadInfoCapability.resolve(data);
                }, this);
                messageHandler.on("StartRenderPage", function(data) {
                  if (this.destroyed) {
                    return;
                  }
                  var page = this.pageCache[data.pageIndex];
                  page._stats.timeEnd("Page Request");
                  page._startRenderPage(data.transparency, data.intent);
                }, this);
                messageHandler.on("RenderPageChunk", function(data) {
                  if (this.destroyed) {
                    return;
                  }
                  var page = this.pageCache[data.pageIndex];
                  page._renderPageChunk(data.operatorList, data.intent);
                }, this);
                messageHandler.on("commonobj", function(data) {
                  var _this12 = this;
                  if (this.destroyed) {
                    return;
                  }
                  var _data = _slicedToArray(data, 3), id = _data[0], type = _data[1], exportedData = _data[2];
                  if (this.commonObjs.has(id)) {
                    return;
                  }
                  switch (type) {
                    case "Font":
                      var params = this._params;
                      if ("error" in exportedData) {
                        var exportedError = exportedData.error;
                        (0, _util.warn)("Error during font loading: ".concat(exportedError));
                        this.commonObjs.resolve(id, exportedError);
                        break;
                      }
                      var fontRegistry = null;
                      if (params.pdfBug && _global_scope.default.FontInspector && _global_scope.default.FontInspector.enabled) {
                        fontRegistry = {
                          registerFont: function registerFont(font2, url) {
                            _global_scope.default["FontInspector"].fontAdded(font2, url);
                          }
                        };
                      }
                      var font = new _font_loader.FontFaceObject(exportedData, {
                        isEvalSupported: params.isEvalSupported,
                        disableFontFace: params.disableFontFace,
                        ignoreErrors: params.ignoreErrors,
                        onUnsupportedFeature: this._onUnsupportedFeature.bind(this),
                        fontRegistry
                      });
                      this.fontLoader.bind(font).then(function() {
                        _this12.commonObjs.resolve(id, font);
                      }, function(reason) {
                        messageHandler.sendWithPromise("FontFallback", {
                          id
                        }).finally(function() {
                          _this12.commonObjs.resolve(id, font);
                        });
                      });
                      break;
                    case "FontPath":
                      this.commonObjs.resolve(id, exportedData);
                      break;
                    default:
                      throw new Error("Got unknown common object type ".concat(type));
                  }
                }, this);
                messageHandler.on("obj", function(data) {
                  if (this.destroyed) {
                    return;
                  }
                  var _data2 = _slicedToArray(data, 4), id = _data2[0], pageIndex = _data2[1], type = _data2[2], imageData = _data2[3];
                  var pageProxy = this.pageCache[pageIndex];
                  if (pageProxy.objs.has(id)) {
                    return;
                  }
                  switch (type) {
                    case "JpegStream":
                      return new Promise(function(resolve, reject) {
                        var img = new Image();
                        img.onload = function() {
                          resolve(img);
                        };
                        img.onerror = function() {
                          reject(new Error("Error during JPEG image loading"));
                        };
                        img.src = imageData;
                      }).then(function(img) {
                        pageProxy.objs.resolve(id, img);
                      });
                    case "Image":
                      pageProxy.objs.resolve(id, imageData);
                      var MAX_IMAGE_SIZE_TO_STORE = 8e6;
                      if (imageData && "data" in imageData && imageData.data.length > MAX_IMAGE_SIZE_TO_STORE) {
                        pageProxy.cleanupAfterRender = true;
                      }
                      break;
                    default:
                      throw new Error("Got unknown object type ".concat(type));
                  }
                }, this);
                messageHandler.on("DocProgress", function(data) {
                  if (this.destroyed) {
                    return;
                  }
                  if (loadingTask.onProgress) {
                    loadingTask.onProgress({
                      loaded: data.loaded,
                      total: data.total
                    });
                  }
                }, this);
                messageHandler.on("PageError", function(data) {
                  if (this.destroyed) {
                    return;
                  }
                  var page = this.pageCache[data.pageNum - 1];
                  var intentState = page.intentStates[data.intent];
                  if (intentState.displayReadyCapability) {
                    intentState.displayReadyCapability.reject(data.error);
                  } else {
                    throw new Error(data.error);
                  }
                  if (intentState.operatorList) {
                    intentState.operatorList.lastChunk = true;
                    for (var i = 0; i < intentState.renderTasks.length; i++) {
                      intentState.renderTasks[i].operatorListChanged();
                    }
                  }
                }, this);
                messageHandler.on("UnsupportedFeature", this._onUnsupportedFeature, this);
                messageHandler.on("JpegDecode", function(data) {
                  if (this.destroyed) {
                    return Promise.reject(new Error("Worker was destroyed"));
                  }
                  if (typeof document === "undefined") {
                    return Promise.reject(new Error('"document" is not defined.'));
                  }
                  var _data3 = _slicedToArray(data, 2), imageUrl = _data3[0], components = _data3[1];
                  if (components !== 3 && components !== 1) {
                    return Promise.reject(new Error("Only 3 components or 1 component can be returned"));
                  }
                  return new Promise(function(resolve, reject) {
                    var img = new Image();
                    img.onload = function() {
                      var width = img.width;
                      var height = img.height;
                      var size = width * height;
                      var rgbaLength = size * 4;
                      var buf = new Uint8ClampedArray(size * components);
                      var tmpCanvas = document.createElement("canvas");
                      tmpCanvas.width = width;
                      tmpCanvas.height = height;
                      var tmpCtx = tmpCanvas.getContext("2d");
                      tmpCtx.drawImage(img, 0, 0);
                      var data2 = tmpCtx.getImageData(0, 0, width, height).data;
                      if (components === 3) {
                        for (var i = 0, j = 0; i < rgbaLength; i += 4, j += 3) {
                          buf[j] = data2[i];
                          buf[j + 1] = data2[i + 1];
                          buf[j + 2] = data2[i + 2];
                        }
                      } else if (components === 1) {
                        for (var _i2 = 0, _j = 0; _i2 < rgbaLength; _i2 += 4, _j++) {
                          buf[_j] = data2[_i2];
                        }
                      }
                      resolve({
                        data: buf,
                        width,
                        height
                      });
                    };
                    img.onerror = function() {
                      reject(new Error("JpegDecode failed to load image"));
                    };
                    img.src = imageUrl;
                  });
                }, this);
                messageHandler.on("FetchBuiltInCMap", function(data) {
                  if (this.destroyed) {
                    return Promise.reject(new Error("Worker was destroyed"));
                  }
                  return this.CMapReaderFactory.fetch({
                    name: data.name
                  });
                }, this);
              }
            }, {
              key: "_onUnsupportedFeature",
              value: function _onUnsupportedFeature(_ref10) {
                var featureId = _ref10.featureId;
                if (this.destroyed) {
                  return;
                }
                if (this.loadingTask.onUnsupportedFeature) {
                  this.loadingTask.onUnsupportedFeature(featureId);
                }
              }
            }, {
              key: "getData",
              value: function getData() {
                return this.messageHandler.sendWithPromise("GetData", null);
              }
            }, {
              key: "getPage",
              value: function getPage(pageNumber) {
                var _this13 = this;
                if (!Number.isInteger(pageNumber) || pageNumber <= 0 || pageNumber > this.numPages) {
                  return Promise.reject(new Error("Invalid page request"));
                }
                var pageIndex = pageNumber - 1;
                if (pageIndex in this.pagePromises) {
                  return this.pagePromises[pageIndex];
                }
                var promise = this.messageHandler.sendWithPromise("GetPage", {
                  pageIndex
                }).then(function(pageInfo) {
                  if (_this13.destroyed) {
                    throw new Error("Transport destroyed");
                  }
                  var page = new PDFPageProxy(pageIndex, pageInfo, _this13, _this13._params.pdfBug);
                  _this13.pageCache[pageIndex] = page;
                  return page;
                });
                this.pagePromises[pageIndex] = promise;
                return promise;
              }
            }, {
              key: "getPageIndex",
              value: function getPageIndex(ref) {
                return this.messageHandler.sendWithPromise("GetPageIndex", {
                  ref
                }).catch(function(reason) {
                  return Promise.reject(new Error(reason));
                });
              }
            }, {
              key: "getAnnotations",
              value: function getAnnotations(pageIndex, intent) {
                return this.messageHandler.sendWithPromise("GetAnnotations", {
                  pageIndex,
                  intent
                });
              }
            }, {
              key: "getDestinations",
              value: function getDestinations() {
                return this.messageHandler.sendWithPromise("GetDestinations", null);
              }
            }, {
              key: "getDestination",
              value: function getDestination(id) {
                if (typeof id !== "string") {
                  return Promise.reject(new Error("Invalid destination request."));
                }
                return this.messageHandler.sendWithPromise("GetDestination", {
                  id
                });
              }
            }, {
              key: "getPageLabels",
              value: function getPageLabels() {
                return this.messageHandler.sendWithPromise("GetPageLabels", null);
              }
            }, {
              key: "getPageMode",
              value: function getPageMode() {
                return this.messageHandler.sendWithPromise("GetPageMode", null);
              }
            }, {
              key: "getOpenActionDestination",
              value: function getOpenActionDestination() {
                return this.messageHandler.sendWithPromise("getOpenActionDestination", null);
              }
            }, {
              key: "getAttachments",
              value: function getAttachments() {
                return this.messageHandler.sendWithPromise("GetAttachments", null);
              }
            }, {
              key: "getJavaScript",
              value: function getJavaScript() {
                return this.messageHandler.sendWithPromise("GetJavaScript", null);
              }
            }, {
              key: "getOutline",
              value: function getOutline() {
                return this.messageHandler.sendWithPromise("GetOutline", null);
              }
            }, {
              key: "getPermissions",
              value: function getPermissions() {
                return this.messageHandler.sendWithPromise("GetPermissions", null);
              }
            }, {
              key: "getMetadata",
              value: function getMetadata() {
                var _this14 = this;
                return this.messageHandler.sendWithPromise("GetMetadata", null).then(function(results) {
                  return {
                    info: results[0],
                    metadata: results[1] ? new _metadata.Metadata(results[1]) : null,
                    contentDispositionFilename: _this14._fullReader ? _this14._fullReader.filename : null
                  };
                });
              }
            }, {
              key: "getStats",
              value: function getStats() {
                return this.messageHandler.sendWithPromise("GetStats", null);
              }
            }, {
              key: "startCleanup",
              value: function startCleanup() {
                var _this15 = this;
                this.messageHandler.sendWithPromise("Cleanup", null).then(function() {
                  for (var i = 0, ii = _this15.pageCache.length; i < ii; i++) {
                    var page = _this15.pageCache[i];
                    if (page) {
                      page.cleanup();
                    }
                  }
                  _this15.commonObjs.clear();
                  _this15.fontLoader.clear();
                });
              }
            }, {
              key: "loadingParams",
              get: function get() {
                var params = this._params;
                return (0, _util.shadow)(this, "loadingParams", {
                  disableAutoFetch: params.disableAutoFetch,
                  disableCreateObjectURL: params.disableCreateObjectURL,
                  disableFontFace: params.disableFontFace,
                  nativeImageDecoderSupport: params.nativeImageDecoderSupport
                });
              }
            }]);
            return WorkerTransport2;
          }();
          var PDFObjects = function() {
            function PDFObjects2() {
              _classCallCheck(this, PDFObjects2);
              this._objs = /* @__PURE__ */ Object.create(null);
            }
            _createClass(PDFObjects2, [{
              key: "_ensureObj",
              value: function _ensureObj(objId) {
                if (this._objs[objId]) {
                  return this._objs[objId];
                }
                return this._objs[objId] = {
                  capability: (0, _util.createPromiseCapability)(),
                  data: null,
                  resolved: false
                };
              }
            }, {
              key: "get",
              value: function get(objId) {
                var callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
                if (callback) {
                  this._ensureObj(objId).capability.promise.then(callback);
                  return null;
                }
                var obj = this._objs[objId];
                if (!obj || !obj.resolved) {
                  throw new Error("Requesting object that isn't resolved yet ".concat(objId, "."));
                }
                return obj.data;
              }
            }, {
              key: "has",
              value: function has(objId) {
                var obj = this._objs[objId];
                return obj ? obj.resolved : false;
              }
            }, {
              key: "resolve",
              value: function resolve(objId, data) {
                var obj = this._ensureObj(objId);
                obj.resolved = true;
                obj.data = data;
                obj.capability.resolve(data);
              }
            }, {
              key: "clear",
              value: function clear() {
                this._objs = /* @__PURE__ */ Object.create(null);
              }
            }]);
            return PDFObjects2;
          }();
          var RenderTask = function() {
            function RenderTask2(internalRenderTask) {
              _classCallCheck(this, RenderTask2);
              this._internalRenderTask = internalRenderTask;
              this.onContinue = null;
            }
            _createClass(RenderTask2, [{
              key: "cancel",
              value: function cancel() {
                this._internalRenderTask.cancel();
              }
            }, {
              key: "then",
              value: function then(onFulfilled, onRejected) {
                (0, _util.deprecated)("RenderTask.then method, use the `promise` getter instead.");
                return this.promise.then.apply(this.promise, arguments);
              }
            }, {
              key: "promise",
              get: function get() {
                return this._internalRenderTask.capability.promise;
              }
            }]);
            return RenderTask2;
          }();
          var InternalRenderTask = function InternalRenderTaskClosure() {
            var canvasInRendering = /* @__PURE__ */ new WeakSet();
            var InternalRenderTask2 = function() {
              function InternalRenderTask3(_ref11) {
                var callback = _ref11.callback, params = _ref11.params, objs = _ref11.objs, commonObjs = _ref11.commonObjs, operatorList = _ref11.operatorList, pageNumber = _ref11.pageNumber, canvasFactory = _ref11.canvasFactory, webGLContext = _ref11.webGLContext, _ref11$useRequestAnim = _ref11.useRequestAnimationFrame, useRequestAnimationFrame = _ref11$useRequestAnim === void 0 ? false : _ref11$useRequestAnim, _ref11$pdfBug = _ref11.pdfBug, pdfBug = _ref11$pdfBug === void 0 ? false : _ref11$pdfBug;
                _classCallCheck(this, InternalRenderTask3);
                this.callback = callback;
                this.params = params;
                this.objs = objs;
                this.commonObjs = commonObjs;
                this.operatorListIdx = null;
                this.operatorList = operatorList;
                this.pageNumber = pageNumber;
                this.canvasFactory = canvasFactory;
                this.webGLContext = webGLContext;
                this._pdfBug = pdfBug;
                this.running = false;
                this.graphicsReadyCallback = null;
                this.graphicsReady = false;
                this._useRequestAnimationFrame = useRequestAnimationFrame === true && typeof window !== "undefined";
                this.cancelled = false;
                this.capability = (0, _util.createPromiseCapability)();
                this.task = new RenderTask(this);
                this._continueBound = this._continue.bind(this);
                this._scheduleNextBound = this._scheduleNext.bind(this);
                this._nextBound = this._next.bind(this);
                this._canvas = params.canvasContext.canvas;
              }
              _createClass(InternalRenderTask3, [{
                key: "initializeGraphics",
                value: function initializeGraphics() {
                  var transparency = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
                  if (this.cancelled) {
                    return;
                  }
                  if (this._canvas) {
                    if (canvasInRendering.has(this._canvas)) {
                      throw new Error("Cannot use the same canvas during multiple render() operations. Use different canvas or ensure previous operations were cancelled or completed.");
                    }
                    canvasInRendering.add(this._canvas);
                  }
                  if (this._pdfBug && _global_scope.default.StepperManager && _global_scope.default.StepperManager.enabled) {
                    this.stepper = _global_scope.default.StepperManager.create(this.pageNumber - 1);
                    this.stepper.init(this.operatorList);
                    this.stepper.nextBreakPoint = this.stepper.getNextBreakPoint();
                  }
                  var _this$params = this.params, canvasContext = _this$params.canvasContext, viewport = _this$params.viewport, transform = _this$params.transform, imageLayer = _this$params.imageLayer, background = _this$params.background;
                  this.gfx = new _canvas.CanvasGraphics(canvasContext, this.commonObjs, this.objs, this.canvasFactory, this.webGLContext, imageLayer);
                  this.gfx.beginDrawing({
                    transform,
                    viewport,
                    transparency,
                    background
                  });
                  this.operatorListIdx = 0;
                  this.graphicsReady = true;
                  if (this.graphicsReadyCallback) {
                    this.graphicsReadyCallback();
                  }
                }
              }, {
                key: "cancel",
                value: function cancel() {
                  var error2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
                  this.running = false;
                  this.cancelled = true;
                  if (this.gfx) {
                    this.gfx.endDrawing();
                  }
                  if (this._canvas) {
                    canvasInRendering.delete(this._canvas);
                  }
                  this.callback(error2 || new _dom_utils.RenderingCancelledException("Rendering cancelled, page ".concat(this.pageNumber), "canvas"));
                }
              }, {
                key: "operatorListChanged",
                value: function operatorListChanged() {
                  if (!this.graphicsReady) {
                    if (!this.graphicsReadyCallback) {
                      this.graphicsReadyCallback = this._continueBound;
                    }
                    return;
                  }
                  if (this.stepper) {
                    this.stepper.updateOperatorList(this.operatorList);
                  }
                  if (this.running) {
                    return;
                  }
                  this._continue();
                }
              }, {
                key: "_continue",
                value: function _continue() {
                  this.running = true;
                  if (this.cancelled) {
                    return;
                  }
                  if (this.task.onContinue) {
                    this.task.onContinue(this._scheduleNextBound);
                  } else {
                    this._scheduleNext();
                  }
                }
              }, {
                key: "_scheduleNext",
                value: function _scheduleNext() {
                  var _this16 = this;
                  if (this._useRequestAnimationFrame) {
                    window.requestAnimationFrame(function() {
                      _this16._nextBound().catch(_this16.cancel.bind(_this16));
                    });
                  } else {
                    Promise.resolve().then(this._nextBound).catch(this.cancel.bind(this));
                  }
                }
              }, {
                key: "_next",
                value: function() {
                  var _next2 = _asyncToGenerator(
                    _regenerator.default.mark(function _callee() {
                      return _regenerator.default.wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              if (!this.cancelled) {
                                _context.next = 2;
                                break;
                              }
                              return _context.abrupt("return");
                            case 2:
                              this.operatorListIdx = this.gfx.executeOperatorList(this.operatorList, this.operatorListIdx, this._continueBound, this.stepper);
                              if (this.operatorListIdx === this.operatorList.argsArray.length) {
                                this.running = false;
                                if (this.operatorList.lastChunk) {
                                  this.gfx.endDrawing();
                                  if (this._canvas) {
                                    canvasInRendering.delete(this._canvas);
                                  }
                                  this.callback();
                                }
                              }
                            case 4:
                            case "end":
                              return _context.stop();
                          }
                        }
                      }, _callee, this);
                    })
                  );
                  function _next() {
                    return _next2.apply(this, arguments);
                  }
                  return _next;
                }()
              }]);
              return InternalRenderTask3;
            }();
            return InternalRenderTask2;
          }();
          var version$$1 = "2.1.266";
          exports2.version = version$$1;
          var build = "81f5835c";
          exports2.build = build;
        },
        /* 147 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          module2.exports = __w_pdfjs_require__(148);
        },
        /* 148 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          function _typeof(obj) {
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
              _typeof = function _typeof2(obj2) {
                return typeof obj2;
              };
            } else {
              _typeof = function _typeof2(obj2) {
                return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
              };
            }
            return _typeof(obj);
          }
          var g = function() {
            return this || (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" && self;
          }() || Function("return this")();
          var hadRuntime = g.regeneratorRuntime && Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;
          var oldRuntime = hadRuntime && g.regeneratorRuntime;
          g.regeneratorRuntime = void 0;
          module2.exports = __w_pdfjs_require__(149);
          if (hadRuntime) {
            g.regeneratorRuntime = oldRuntime;
          } else {
            try {
              delete g.regeneratorRuntime;
            } catch (e) {
              g.regeneratorRuntime = void 0;
            }
          }
        },
        /* 149 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          (function(module3) {
            function _typeof(obj) {
              if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                _typeof = function _typeof2(obj2) {
                  return typeof obj2;
                };
              } else {
                _typeof = function _typeof2(obj2) {
                  return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
                };
              }
              return _typeof(obj);
            }
            !function(global2) {
              var Op = Object.prototype;
              var hasOwn = Op.hasOwnProperty;
              var undefined2;
              var $Symbol = typeof Symbol === "function" ? Symbol : {};
              var iteratorSymbol = $Symbol.iterator || "@@iterator";
              var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
              var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
              var inModule = _typeof(module3) === "object";
              var runtime = global2.regeneratorRuntime;
              if (runtime) {
                if (inModule) {
                  module3.exports = runtime;
                }
                return;
              }
              runtime = global2.regeneratorRuntime = inModule ? module3.exports : {};
              function wrap(innerFn, outerFn, self2, tryLocsList) {
                var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
                var generator = Object.create(protoGenerator.prototype);
                var context = new Context(tryLocsList || []);
                generator._invoke = makeInvokeMethod(innerFn, self2, context);
                return generator;
              }
              runtime.wrap = wrap;
              function tryCatch(fn, obj, arg) {
                try {
                  return {
                    type: "normal",
                    arg: fn.call(obj, arg)
                  };
                } catch (err) {
                  return {
                    type: "throw",
                    arg: err
                  };
                }
              }
              var GenStateSuspendedStart = "suspendedStart";
              var GenStateSuspendedYield = "suspendedYield";
              var GenStateExecuting = "executing";
              var GenStateCompleted = "completed";
              var ContinueSentinel = {};
              function Generator() {
              }
              function GeneratorFunction() {
              }
              function GeneratorFunctionPrototype() {
              }
              var IteratorPrototype = {};
              IteratorPrototype[iteratorSymbol] = function() {
                return this;
              };
              var getProto = Object.getPrototypeOf;
              var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
              if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
                IteratorPrototype = NativeIteratorPrototype;
              }
              var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
              GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
              GeneratorFunctionPrototype.constructor = GeneratorFunction;
              GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";
              function defineIteratorMethods(prototype) {
                ["next", "throw", "return"].forEach(function(method) {
                  prototype[method] = function(arg) {
                    return this._invoke(method, arg);
                  };
                });
              }
              runtime.isGeneratorFunction = function(genFun) {
                var ctor = typeof genFun === "function" && genFun.constructor;
                return ctor ? ctor === GeneratorFunction || (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
              };
              runtime.mark = function(genFun) {
                if (Object.setPrototypeOf) {
                  Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
                } else {
                  genFun.__proto__ = GeneratorFunctionPrototype;
                  if (!(toStringTagSymbol in genFun)) {
                    genFun[toStringTagSymbol] = "GeneratorFunction";
                  }
                }
                genFun.prototype = Object.create(Gp);
                return genFun;
              };
              runtime.awrap = function(arg) {
                return {
                  __await: arg
                };
              };
              function AsyncIterator(generator) {
                function invoke(method, arg, resolve, reject) {
                  var record = tryCatch(generator[method], generator, arg);
                  if (record.type === "throw") {
                    reject(record.arg);
                  } else {
                    var result = record.arg;
                    var value = result.value;
                    if (value && _typeof(value) === "object" && hasOwn.call(value, "__await")) {
                      return Promise.resolve(value.__await).then(function(value2) {
                        invoke("next", value2, resolve, reject);
                      }, function(err) {
                        invoke("throw", err, resolve, reject);
                      });
                    }
                    return Promise.resolve(value).then(function(unwrapped) {
                      result.value = unwrapped;
                      resolve(result);
                    }, function(error2) {
                      return invoke("throw", error2, resolve, reject);
                    });
                  }
                }
                var previousPromise;
                function enqueue(method, arg) {
                  function callInvokeWithMethodAndArg() {
                    return new Promise(function(resolve, reject) {
                      invoke(method, arg, resolve, reject);
                    });
                  }
                  return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
                }
                this._invoke = enqueue;
              }
              defineIteratorMethods(AsyncIterator.prototype);
              AsyncIterator.prototype[asyncIteratorSymbol] = function() {
                return this;
              };
              runtime.AsyncIterator = AsyncIterator;
              runtime.async = function(innerFn, outerFn, self2, tryLocsList) {
                var iter = new AsyncIterator(wrap(innerFn, outerFn, self2, tryLocsList));
                return runtime.isGeneratorFunction(outerFn) ? iter : iter.next().then(function(result) {
                  return result.done ? result.value : iter.next();
                });
              };
              function makeInvokeMethod(innerFn, self2, context) {
                var state = GenStateSuspendedStart;
                return function invoke(method, arg) {
                  if (state === GenStateExecuting) {
                    throw new Error("Generator is already running");
                  }
                  if (state === GenStateCompleted) {
                    if (method === "throw") {
                      throw arg;
                    }
                    return doneResult();
                  }
                  context.method = method;
                  context.arg = arg;
                  while (true) {
                    var delegate = context.delegate;
                    if (delegate) {
                      var delegateResult = maybeInvokeDelegate(delegate, context);
                      if (delegateResult) {
                        if (delegateResult === ContinueSentinel)
                          continue;
                        return delegateResult;
                      }
                    }
                    if (context.method === "next") {
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
                    var record = tryCatch(innerFn, self2, context);
                    if (record.type === "normal") {
                      state = context.done ? GenStateCompleted : GenStateSuspendedYield;
                      if (record.arg === ContinueSentinel) {
                        continue;
                      }
                      return {
                        value: record.arg,
                        done: context.done
                      };
                    } else if (record.type === "throw") {
                      state = GenStateCompleted;
                      context.method = "throw";
                      context.arg = record.arg;
                    }
                  }
                };
              }
              function maybeInvokeDelegate(delegate, context) {
                var method = delegate.iterator[context.method];
                if (method === undefined2) {
                  context.delegate = null;
                  if (context.method === "throw") {
                    if (delegate.iterator.return) {
                      context.method = "return";
                      context.arg = undefined2;
                      maybeInvokeDelegate(delegate, context);
                      if (context.method === "throw") {
                        return ContinueSentinel;
                      }
                    }
                    context.method = "throw";
                    context.arg = new TypeError("The iterator does not provide a 'throw' method");
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
                if (!info) {
                  context.method = "throw";
                  context.arg = new TypeError("iterator result is not an object");
                  context.delegate = null;
                  return ContinueSentinel;
                }
                if (info.done) {
                  context[delegate.resultName] = info.value;
                  context.next = delegate.nextLoc;
                  if (context.method !== "return") {
                    context.method = "next";
                    context.arg = undefined2;
                  }
                } else {
                  return info;
                }
                context.delegate = null;
                return ContinueSentinel;
              }
              defineIteratorMethods(Gp);
              Gp[toStringTagSymbol] = "Generator";
              Gp[iteratorSymbol] = function() {
                return this;
              };
              Gp.toString = function() {
                return "[object Generator]";
              };
              function pushTryEntry(locs) {
                var entry = {
                  tryLoc: locs[0]
                };
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
                this.tryEntries = [{
                  tryLoc: "root"
                }];
                tryLocsList.forEach(pushTryEntry, this);
                this.reset(true);
              }
              runtime.keys = function(object) {
                var keys = [];
                for (var key in object) {
                  keys.push(key);
                }
                keys.reverse();
                return function next() {
                  while (keys.length) {
                    var key2 = keys.pop();
                    if (key2 in object) {
                      next.value = key2;
                      next.done = false;
                      return next;
                    }
                  }
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
                    var i = -1, next = function next2() {
                      while (++i < iterable.length) {
                        if (hasOwn.call(iterable, i)) {
                          next2.value = iterable[i];
                          next2.done = false;
                          return next2;
                        }
                      }
                      next2.value = undefined2;
                      next2.done = true;
                      return next2;
                    };
                    return next.next = next;
                  }
                }
                return {
                  next: doneResult
                };
              }
              runtime.values = values;
              function doneResult() {
                return {
                  value: undefined2,
                  done: true
                };
              }
              Context.prototype = {
                constructor: Context,
                reset: function reset(skipTempReset) {
                  this.prev = 0;
                  this.next = 0;
                  this.sent = this._sent = undefined2;
                  this.done = false;
                  this.delegate = null;
                  this.method = "next";
                  this.arg = undefined2;
                  this.tryEntries.forEach(resetTryEntry);
                  if (!skipTempReset) {
                    for (var name in this) {
                      if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
                        this[name] = undefined2;
                      }
                    }
                  }
                },
                stop: function stop() {
                  this.done = true;
                  var rootEntry = this.tryEntries[0];
                  var rootRecord = rootEntry.completion;
                  if (rootRecord.type === "throw") {
                    throw rootRecord.arg;
                  }
                  return this.rval;
                },
                dispatchException: function dispatchException(exception) {
                  if (this.done) {
                    throw exception;
                  }
                  var context = this;
                  function handle(loc, caught) {
                    record.type = "throw";
                    record.arg = exception;
                    context.next = loc;
                    if (caught) {
                      context.method = "next";
                      context.arg = undefined2;
                    }
                    return !!caught;
                  }
                  for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                    var entry = this.tryEntries[i];
                    var record = entry.completion;
                    if (entry.tryLoc === "root") {
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
                abrupt: function abrupt(type, arg) {
                  for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                    var entry = this.tryEntries[i];
                    if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
                      var finallyEntry = entry;
                      break;
                    }
                  }
                  if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
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
                complete: function complete(record, afterLoc) {
                  if (record.type === "throw") {
                    throw record.arg;
                  }
                  if (record.type === "break" || record.type === "continue") {
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
                finish: function finish(finallyLoc) {
                  for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                    var entry = this.tryEntries[i];
                    if (entry.finallyLoc === finallyLoc) {
                      this.complete(entry.completion, entry.afterLoc);
                      resetTryEntry(entry);
                      return ContinueSentinel;
                    }
                  }
                },
                "catch": function _catch(tryLoc) {
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
                  throw new Error("illegal catch attempt");
                },
                delegateYield: function delegateYield(iterable, resultName, nextLoc) {
                  this.delegate = {
                    iterator: values(iterable),
                    resultName,
                    nextLoc
                  };
                  if (this.method === "next") {
                    this.arg = undefined2;
                  }
                  return ContinueSentinel;
                }
              };
            }(function() {
              return this || (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" && self;
            }() || Function("return this")());
          }).call(this, __w_pdfjs_require__(150)(module2));
        },
        /* 150 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          module2.exports = function(module3) {
            if (!module3.webpackPolyfill) {
              module3.deprecate = function() {
              };
              module3.paths = [];
              if (!module3.children)
                module3.children = [];
              Object.defineProperty(module3, "loaded", {
                enumerable: true,
                get: function get() {
                  return module3.l;
                }
              });
              Object.defineProperty(module3, "id", {
                enumerable: true,
                get: function get() {
                  return module3.i;
                }
              });
              module3.webpackPolyfill = 1;
            }
            return module3;
          };
        },
        /* 151 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.addLinkAttributes = addLinkAttributes;
          exports2.getFilenameFromUrl = getFilenameFromUrl;
          exports2.loadScript = loadScript;
          exports2.DummyStatTimer = exports2.StatTimer = exports2.DOMSVGFactory = exports2.DOMCMapReaderFactory = exports2.DOMCanvasFactory = exports2.DEFAULT_LINK_REL = exports2.LinkTarget = exports2.RenderingCancelledException = exports2.PageViewport = void 0;
          var _util = __w_pdfjs_require__(1);
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            return Constructor;
          }
          var DEFAULT_LINK_REL = "noopener noreferrer nofollow";
          exports2.DEFAULT_LINK_REL = DEFAULT_LINK_REL;
          var SVG_NS = "http://www.w3.org/2000/svg";
          var DOMCanvasFactory = function() {
            function DOMCanvasFactory2() {
              _classCallCheck(this, DOMCanvasFactory2);
            }
            _createClass(DOMCanvasFactory2, [{
              key: "create",
              value: function create(width, height) {
                if (width <= 0 || height <= 0) {
                  throw new Error("invalid canvas size");
                }
                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");
                canvas.width = width;
                canvas.height = height;
                return {
                  canvas,
                  context
                };
              }
            }, {
              key: "reset",
              value: function reset(canvasAndContext, width, height) {
                if (!canvasAndContext.canvas) {
                  throw new Error("canvas is not specified");
                }
                if (width <= 0 || height <= 0) {
                  throw new Error("invalid canvas size");
                }
                canvasAndContext.canvas.width = width;
                canvasAndContext.canvas.height = height;
              }
            }, {
              key: "destroy",
              value: function destroy(canvasAndContext) {
                if (!canvasAndContext.canvas) {
                  throw new Error("canvas is not specified");
                }
                canvasAndContext.canvas.width = 0;
                canvasAndContext.canvas.height = 0;
                canvasAndContext.canvas = null;
                canvasAndContext.context = null;
              }
            }]);
            return DOMCanvasFactory2;
          }();
          exports2.DOMCanvasFactory = DOMCanvasFactory;
          var DOMCMapReaderFactory = function() {
            function DOMCMapReaderFactory2(_ref) {
              var _ref$baseUrl = _ref.baseUrl, baseUrl = _ref$baseUrl === void 0 ? null : _ref$baseUrl, _ref$isCompressed = _ref.isCompressed, isCompressed = _ref$isCompressed === void 0 ? false : _ref$isCompressed;
              _classCallCheck(this, DOMCMapReaderFactory2);
              this.baseUrl = baseUrl;
              this.isCompressed = isCompressed;
            }
            _createClass(DOMCMapReaderFactory2, [{
              key: "fetch",
              value: function fetch2(_ref2) {
                var _this = this;
                var name = _ref2.name;
                if (!this.baseUrl) {
                  return Promise.reject(new Error('The CMap "baseUrl" parameter must be specified, ensure that the "cMapUrl" and "cMapPacked" API parameters are provided.'));
                }
                if (!name) {
                  return Promise.reject(new Error("CMap name must be specified."));
                }
                return new Promise(function(resolve, reject) {
                  var url = _this.baseUrl + name + (_this.isCompressed ? ".bcmap" : "");
                  var request = new XMLHttpRequest();
                  request.open("GET", url, true);
                  if (_this.isCompressed) {
                    request.responseType = "arraybuffer";
                  }
                  request.onreadystatechange = function() {
                    if (request.readyState !== XMLHttpRequest.DONE) {
                      return;
                    }
                    if (request.status === 200 || request.status === 0) {
                      var data;
                      if (_this.isCompressed && request.response) {
                        data = new Uint8Array(request.response);
                      } else if (!_this.isCompressed && request.responseText) {
                        data = (0, _util.stringToBytes)(request.responseText);
                      }
                      if (data) {
                        resolve({
                          cMapData: data,
                          compressionType: _this.isCompressed ? _util.CMapCompressionType.BINARY : _util.CMapCompressionType.NONE
                        });
                        return;
                      }
                    }
                    reject(new Error("Unable to load " + (_this.isCompressed ? "binary " : "") + "CMap at: " + url));
                  };
                  request.send(null);
                });
              }
            }]);
            return DOMCMapReaderFactory2;
          }();
          exports2.DOMCMapReaderFactory = DOMCMapReaderFactory;
          var DOMSVGFactory = function() {
            function DOMSVGFactory2() {
              _classCallCheck(this, DOMSVGFactory2);
            }
            _createClass(DOMSVGFactory2, [{
              key: "create",
              value: function create(width, height) {
                (0, _util.assert)(width > 0 && height > 0, "Invalid SVG dimensions");
                var svg = document.createElementNS(SVG_NS, "svg:svg");
                svg.setAttribute("version", "1.1");
                svg.setAttribute("width", width + "px");
                svg.setAttribute("height", height + "px");
                svg.setAttribute("preserveAspectRatio", "none");
                svg.setAttribute("viewBox", "0 0 " + width + " " + height);
                return svg;
              }
            }, {
              key: "createElement",
              value: function createElement(type) {
                (0, _util.assert)(typeof type === "string", "Invalid SVG element type");
                return document.createElementNS(SVG_NS, type);
              }
            }]);
            return DOMSVGFactory2;
          }();
          exports2.DOMSVGFactory = DOMSVGFactory;
          var PageViewport = function() {
            function PageViewport2(_ref3) {
              var viewBox = _ref3.viewBox, scale = _ref3.scale, rotation = _ref3.rotation, _ref3$offsetX = _ref3.offsetX, offsetX = _ref3$offsetX === void 0 ? 0 : _ref3$offsetX, _ref3$offsetY = _ref3.offsetY, offsetY = _ref3$offsetY === void 0 ? 0 : _ref3$offsetY, _ref3$dontFlip = _ref3.dontFlip, dontFlip = _ref3$dontFlip === void 0 ? false : _ref3$dontFlip;
              _classCallCheck(this, PageViewport2);
              this.viewBox = viewBox;
              this.scale = scale;
              this.rotation = rotation;
              this.offsetX = offsetX;
              this.offsetY = offsetY;
              var centerX = (viewBox[2] + viewBox[0]) / 2;
              var centerY = (viewBox[3] + viewBox[1]) / 2;
              var rotateA, rotateB, rotateC, rotateD;
              rotation = rotation % 360;
              rotation = rotation < 0 ? rotation + 360 : rotation;
              switch (rotation) {
                case 180:
                  rotateA = -1;
                  rotateB = 0;
                  rotateC = 0;
                  rotateD = 1;
                  break;
                case 90:
                  rotateA = 0;
                  rotateB = 1;
                  rotateC = 1;
                  rotateD = 0;
                  break;
                case 270:
                  rotateA = 0;
                  rotateB = -1;
                  rotateC = -1;
                  rotateD = 0;
                  break;
                default:
                  rotateA = 1;
                  rotateB = 0;
                  rotateC = 0;
                  rotateD = -1;
                  break;
              }
              if (dontFlip) {
                rotateC = -rotateC;
                rotateD = -rotateD;
              }
              var offsetCanvasX, offsetCanvasY;
              var width, height;
              if (rotateA === 0) {
                offsetCanvasX = Math.abs(centerY - viewBox[1]) * scale + offsetX;
                offsetCanvasY = Math.abs(centerX - viewBox[0]) * scale + offsetY;
                width = Math.abs(viewBox[3] - viewBox[1]) * scale;
                height = Math.abs(viewBox[2] - viewBox[0]) * scale;
              } else {
                offsetCanvasX = Math.abs(centerX - viewBox[0]) * scale + offsetX;
                offsetCanvasY = Math.abs(centerY - viewBox[1]) * scale + offsetY;
                width = Math.abs(viewBox[2] - viewBox[0]) * scale;
                height = Math.abs(viewBox[3] - viewBox[1]) * scale;
              }
              this.transform = [rotateA * scale, rotateB * scale, rotateC * scale, rotateD * scale, offsetCanvasX - rotateA * scale * centerX - rotateC * scale * centerY, offsetCanvasY - rotateB * scale * centerX - rotateD * scale * centerY];
              this.width = width;
              this.height = height;
            }
            _createClass(PageViewport2, [{
              key: "clone",
              value: function clone() {
                var _ref4 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, _ref4$scale = _ref4.scale, scale = _ref4$scale === void 0 ? this.scale : _ref4$scale, _ref4$rotation = _ref4.rotation, rotation = _ref4$rotation === void 0 ? this.rotation : _ref4$rotation, _ref4$dontFlip = _ref4.dontFlip, dontFlip = _ref4$dontFlip === void 0 ? false : _ref4$dontFlip;
                return new PageViewport2({
                  viewBox: this.viewBox.slice(),
                  scale,
                  rotation,
                  offsetX: this.offsetX,
                  offsetY: this.offsetY,
                  dontFlip
                });
              }
            }, {
              key: "convertToViewportPoint",
              value: function convertToViewportPoint(x, y) {
                return _util.Util.applyTransform([x, y], this.transform);
              }
            }, {
              key: "convertToViewportRectangle",
              value: function convertToViewportRectangle(rect) {
                var tl = _util.Util.applyTransform([rect[0], rect[1]], this.transform);
                var br = _util.Util.applyTransform([rect[2], rect[3]], this.transform);
                return [tl[0], tl[1], br[0], br[1]];
              }
            }, {
              key: "convertToPdfPoint",
              value: function convertToPdfPoint(x, y) {
                return _util.Util.applyInverseTransform([x, y], this.transform);
              }
            }]);
            return PageViewport2;
          }();
          exports2.PageViewport = PageViewport;
          var RenderingCancelledException = function RenderingCancelledException2() {
            function RenderingCancelledException3(msg, type) {
              this.message = msg;
              this.type = type;
            }
            RenderingCancelledException3.prototype = new Error();
            RenderingCancelledException3.prototype.name = "RenderingCancelledException";
            RenderingCancelledException3.constructor = RenderingCancelledException3;
            return RenderingCancelledException3;
          }();
          exports2.RenderingCancelledException = RenderingCancelledException;
          var LinkTarget = {
            NONE: 0,
            SELF: 1,
            BLANK: 2,
            PARENT: 3,
            TOP: 4
          };
          exports2.LinkTarget = LinkTarget;
          var LinkTargetStringMap = ["", "_self", "_blank", "_parent", "_top"];
          function addLinkAttributes(link) {
            var _ref5 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, url = _ref5.url, target = _ref5.target, rel = _ref5.rel;
            link.href = link.title = url ? (0, _util.removeNullCharacters)(url) : "";
            if (url) {
              var LinkTargetValues = Object.values(LinkTarget);
              var targetIndex = LinkTargetValues.includes(target) ? target : LinkTarget.NONE;
              link.target = LinkTargetStringMap[targetIndex];
              link.rel = typeof rel === "string" ? rel : DEFAULT_LINK_REL;
            }
          }
          function getFilenameFromUrl(url) {
            var anchor = url.indexOf("#");
            var query = url.indexOf("?");
            var end = Math.min(anchor > 0 ? anchor : url.length, query > 0 ? query : url.length);
            return url.substring(url.lastIndexOf("/", end) + 1, end);
          }
          var StatTimer = function() {
            function StatTimer2() {
              var enable = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
              _classCallCheck(this, StatTimer2);
              this.enabled = !!enable;
              this.started = /* @__PURE__ */ Object.create(null);
              this.times = [];
            }
            _createClass(StatTimer2, [{
              key: "time",
              value: function time(name) {
                if (!this.enabled) {
                  return;
                }
                if (name in this.started) {
                  (0, _util.warn)("Timer is already running for " + name);
                }
                this.started[name] = Date.now();
              }
            }, {
              key: "timeEnd",
              value: function timeEnd(name) {
                if (!this.enabled) {
                  return;
                }
                if (!(name in this.started)) {
                  (0, _util.warn)("Timer has not been started for " + name);
                }
                this.times.push({
                  "name": name,
                  "start": this.started[name],
                  "end": Date.now()
                });
                delete this.started[name];
              }
            }, {
              key: "toString",
              value: function toString3() {
                var times = this.times;
                var out = "", longest = 0;
                for (var i = 0, ii = times.length; i < ii; ++i) {
                  var name = times[i]["name"];
                  if (name.length > longest) {
                    longest = name.length;
                  }
                }
                for (var _i = 0, _ii = times.length; _i < _ii; ++_i) {
                  var span = times[_i];
                  var duration = span.end - span.start;
                  out += "".concat(span["name"].padEnd(longest), " ").concat(duration, "ms\n");
                }
                return out;
              }
            }]);
            return StatTimer2;
          }();
          exports2.StatTimer = StatTimer;
          var DummyStatTimer = function() {
            function DummyStatTimer2() {
              _classCallCheck(this, DummyStatTimer2);
              (0, _util.unreachable)("Cannot initialize DummyStatTimer.");
            }
            _createClass(DummyStatTimer2, null, [{
              key: "time",
              value: function time(name) {
              }
            }, {
              key: "timeEnd",
              value: function timeEnd(name) {
              }
            }, {
              key: "toString",
              value: function toString3() {
                return "";
              }
            }]);
            return DummyStatTimer2;
          }();
          exports2.DummyStatTimer = DummyStatTimer;
          function loadScript(src) {
            return new Promise(function(resolve, reject) {
              var script = document.createElement("script");
              script.src = src;
              script.onload = resolve;
              script.onerror = function() {
                reject(new Error("Cannot load script at: ".concat(script.src)));
              };
              (document.head || document.documentElement).appendChild(script);
            });
          }
        },
        /* 152 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.FontLoader = exports2.FontFaceObject = void 0;
          var _regenerator = _interopRequireDefault(__w_pdfjs_require__(147));
          var _util = __w_pdfjs_require__(1);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _typeof(obj) {
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
              _typeof = function _typeof2(obj2) {
                return typeof obj2;
              };
            } else {
              _typeof = function _typeof2(obj2) {
                return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
              };
            }
            return _typeof(obj);
          }
          function _possibleConstructorReturn(self2, call) {
            if (call && (_typeof(call) === "object" || typeof call === "function")) {
              return call;
            }
            return _assertThisInitialized(self2);
          }
          function _assertThisInitialized(self2) {
            if (self2 === void 0) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self2;
          }
          function _getPrototypeOf(o2) {
            _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o3) {
              return o3.__proto__ || Object.getPrototypeOf(o3);
            };
            return _getPrototypeOf(o2);
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass)
              _setPrototypeOf(subClass, superClass);
          }
          function _setPrototypeOf(o2, p) {
            _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o3, p2) {
              o3.__proto__ = p2;
              return o3;
            };
            return _setPrototypeOf(o2, p);
          }
          function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
            try {
              var info = gen[key](arg);
              var value = info.value;
            } catch (error2) {
              reject(error2);
              return;
            }
            if (info.done) {
              resolve(value);
            } else {
              Promise.resolve(value).then(_next, _throw);
            }
          }
          function _asyncToGenerator(fn) {
            return function() {
              var self2 = this, args = arguments;
              return new Promise(function(resolve, reject) {
                var gen = fn.apply(self2, args);
                function _next(value) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                }
                function _throw(err) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                }
                _next(void 0);
              });
            };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            return Constructor;
          }
          var BaseFontLoader = function() {
            function BaseFontLoader2(_ref) {
              var docId = _ref.docId, onUnsupportedFeature = _ref.onUnsupportedFeature;
              _classCallCheck(this, BaseFontLoader2);
              if (this.constructor === BaseFontLoader2) {
                (0, _util.unreachable)("Cannot initialize BaseFontLoader.");
              }
              this.docId = docId;
              this._onUnsupportedFeature = onUnsupportedFeature;
              this.nativeFontFaces = [];
              this.styleElement = null;
            }
            _createClass(BaseFontLoader2, [{
              key: "addNativeFontFace",
              value: function addNativeFontFace(nativeFontFace) {
                this.nativeFontFaces.push(nativeFontFace);
                document.fonts.add(nativeFontFace);
              }
            }, {
              key: "insertRule",
              value: function insertRule(rule) {
                var styleElement = this.styleElement;
                if (!styleElement) {
                  styleElement = this.styleElement = document.createElement("style");
                  styleElement.id = "PDFJS_FONT_STYLE_TAG_".concat(this.docId);
                  document.documentElement.getElementsByTagName("head")[0].appendChild(styleElement);
                }
                var styleSheet = styleElement.sheet;
                styleSheet.insertRule(rule, styleSheet.cssRules.length);
              }
            }, {
              key: "clear",
              value: function clear() {
                this.nativeFontFaces.forEach(function(nativeFontFace) {
                  document.fonts.delete(nativeFontFace);
                });
                this.nativeFontFaces.length = 0;
                if (this.styleElement) {
                  this.styleElement.remove();
                  this.styleElement = null;
                }
              }
            }, {
              key: "bind",
              value: function() {
                var _bind = _asyncToGenerator(
                  _regenerator.default.mark(function _callee(font) {
                    var _this = this;
                    var nativeFontFace, rule;
                    return _regenerator.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            if (!(font.attached || font.missingFile)) {
                              _context.next = 2;
                              break;
                            }
                            return _context.abrupt("return");
                          case 2:
                            font.attached = true;
                            if (!this.isFontLoadingAPISupported) {
                              _context.next = 19;
                              break;
                            }
                            nativeFontFace = font.createNativeFontFace();
                            if (!nativeFontFace) {
                              _context.next = 18;
                              break;
                            }
                            this.addNativeFontFace(nativeFontFace);
                            _context.prev = 7;
                            _context.next = 10;
                            return nativeFontFace.loaded;
                          case 10:
                            _context.next = 18;
                            break;
                          case 12:
                            _context.prev = 12;
                            _context.t0 = _context["catch"](7);
                            this._onUnsupportedFeature({
                              featureId: _util.UNSUPPORTED_FEATURES.font
                            });
                            (0, _util.warn)("Failed to load font '".concat(nativeFontFace.family, "': '").concat(_context.t0, "'."));
                            font.disableFontFace = true;
                            throw _context.t0;
                          case 18:
                            return _context.abrupt("return");
                          case 19:
                            rule = font.createFontFaceRule();
                            if (!rule) {
                              _context.next = 25;
                              break;
                            }
                            this.insertRule(rule);
                            if (!this.isSyncFontLoadingSupported) {
                              _context.next = 24;
                              break;
                            }
                            return _context.abrupt("return");
                          case 24:
                            return _context.abrupt("return", new Promise(function(resolve) {
                              var request = _this._queueLoadingCallback(resolve);
                              _this._prepareFontLoadEvent([rule], [font], request);
                            }));
                          case 25:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, this, [[7, 12]]);
                  })
                );
                function bind(_x) {
                  return _bind.apply(this, arguments);
                }
                return bind;
              }()
            }, {
              key: "_queueLoadingCallback",
              value: function _queueLoadingCallback(callback) {
                (0, _util.unreachable)("Abstract method `_queueLoadingCallback`.");
              }
            }, {
              key: "_prepareFontLoadEvent",
              value: function _prepareFontLoadEvent(rules, fontsToLoad, request) {
                (0, _util.unreachable)("Abstract method `_prepareFontLoadEvent`.");
              }
            }, {
              key: "isFontLoadingAPISupported",
              get: function get() {
                (0, _util.unreachable)("Abstract method `isFontLoadingAPISupported`.");
              }
            }, {
              key: "isSyncFontLoadingSupported",
              get: function get() {
                (0, _util.unreachable)("Abstract method `isSyncFontLoadingSupported`.");
              }
            }, {
              key: "_loadTestFont",
              get: function get() {
                (0, _util.unreachable)("Abstract method `_loadTestFont`.");
              }
            }]);
            return BaseFontLoader2;
          }();
          var FontLoader;
          exports2.FontLoader = FontLoader;
          {
            exports2.FontLoader = FontLoader = function(_BaseFontLoader) {
              _inherits(GenericFontLoader, _BaseFontLoader);
              function GenericFontLoader(docId) {
                var _this2;
                _classCallCheck(this, GenericFontLoader);
                _this2 = _possibleConstructorReturn(this, _getPrototypeOf(GenericFontLoader).call(this, docId));
                _this2.loadingContext = {
                  requests: [],
                  nextRequestId: 0
                };
                _this2.loadTestFontId = 0;
                return _this2;
              }
              _createClass(GenericFontLoader, [{
                key: "_queueLoadingCallback",
                value: function _queueLoadingCallback(callback) {
                  function completeRequest() {
                    (0, _util.assert)(!request.done, "completeRequest() cannot be called twice.");
                    request.done = true;
                    while (context.requests.length > 0 && context.requests[0].done) {
                      var otherRequest = context.requests.shift();
                      setTimeout(otherRequest.callback, 0);
                    }
                  }
                  var context = this.loadingContext;
                  var request = {
                    id: "pdfjs-font-loading-".concat(context.nextRequestId++),
                    done: false,
                    complete: completeRequest,
                    callback
                  };
                  context.requests.push(request);
                  return request;
                }
              }, {
                key: "_prepareFontLoadEvent",
                value: function _prepareFontLoadEvent(rules, fonts, request) {
                  function int32(data2, offset) {
                    return data2.charCodeAt(offset) << 24 | data2.charCodeAt(offset + 1) << 16 | data2.charCodeAt(offset + 2) << 8 | data2.charCodeAt(offset + 3) & 255;
                  }
                  function spliceString(s, offset, remove, insert) {
                    var chunk1 = s.substring(0, offset);
                    var chunk2 = s.substring(offset + remove);
                    return chunk1 + insert + chunk2;
                  }
                  var i, ii;
                  var canvas = document.createElement("canvas");
                  canvas.width = 1;
                  canvas.height = 1;
                  var ctx = canvas.getContext("2d");
                  var called = 0;
                  function isFontReady(name, callback) {
                    called++;
                    if (called > 30) {
                      (0, _util.warn)("Load test font never loaded.");
                      callback();
                      return;
                    }
                    ctx.font = "30px " + name;
                    ctx.fillText(".", 0, 20);
                    var imageData = ctx.getImageData(0, 0, 1, 1);
                    if (imageData.data[3] > 0) {
                      callback();
                      return;
                    }
                    setTimeout(isFontReady.bind(null, name, callback));
                  }
                  var loadTestFontId = "lt".concat(Date.now()).concat(this.loadTestFontId++);
                  var data = this._loadTestFont;
                  var COMMENT_OFFSET = 976;
                  data = spliceString(data, COMMENT_OFFSET, loadTestFontId.length, loadTestFontId);
                  var CFF_CHECKSUM_OFFSET = 16;
                  var XXXX_VALUE = 1482184792;
                  var checksum = int32(data, CFF_CHECKSUM_OFFSET);
                  for (i = 0, ii = loadTestFontId.length - 3; i < ii; i += 4) {
                    checksum = checksum - XXXX_VALUE + int32(loadTestFontId, i) | 0;
                  }
                  if (i < loadTestFontId.length) {
                    checksum = checksum - XXXX_VALUE + int32(loadTestFontId + "XXX", i) | 0;
                  }
                  data = spliceString(data, CFF_CHECKSUM_OFFSET, 4, (0, _util.string32)(checksum));
                  var url = "url(data:font/opentype;base64,".concat(btoa(data), ");");
                  var rule = '@font-face {font-family:"'.concat(loadTestFontId, '";src:').concat(url, "}");
                  this.insertRule(rule);
                  var names = [];
                  for (i = 0, ii = fonts.length; i < ii; i++) {
                    names.push(fonts[i].loadedName);
                  }
                  names.push(loadTestFontId);
                  var div = document.createElement("div");
                  div.setAttribute("style", "visibility: hidden;width: 10px; height: 10px;position: absolute; top: 0px; left: 0px;");
                  for (i = 0, ii = names.length; i < ii; ++i) {
                    var span = document.createElement("span");
                    span.textContent = "Hi";
                    span.style.fontFamily = names[i];
                    div.appendChild(span);
                  }
                  document.body.appendChild(div);
                  isFontReady(loadTestFontId, function() {
                    document.body.removeChild(div);
                    request.complete();
                  });
                }
              }, {
                key: "isFontLoadingAPISupported",
                get: function get() {
                  var supported = typeof document !== "undefined" && !!document.fonts;
                  if (supported && typeof navigator !== "undefined") {
                    var m = /Mozilla\/5.0.*?rv:(\d+).*? Gecko/.exec(navigator.userAgent);
                    if (m && m[1] < 63) {
                      supported = false;
                    }
                  }
                  return (0, _util.shadow)(this, "isFontLoadingAPISupported", supported);
                }
              }, {
                key: "isSyncFontLoadingSupported",
                get: function get() {
                  var supported = false;
                  if (typeof navigator === "undefined") {
                    supported = true;
                  } else {
                    var m = /Mozilla\/5.0.*?rv:(\d+).*? Gecko/.exec(navigator.userAgent);
                    if (m && m[1] >= 14) {
                      supported = true;
                    }
                  }
                  return (0, _util.shadow)(this, "isSyncFontLoadingSupported", supported);
                }
              }, {
                key: "_loadTestFont",
                get: function get() {
                  var getLoadTestFont = function getLoadTestFont2() {
                    return atob("T1RUTwALAIAAAwAwQ0ZGIDHtZg4AAAOYAAAAgUZGVE1lkzZwAAAEHAAAABxHREVGABQAFQAABDgAAAAeT1MvMlYNYwkAAAEgAAAAYGNtYXABDQLUAAACNAAAAUJoZWFk/xVFDQAAALwAAAA2aGhlYQdkA+oAAAD0AAAAJGhtdHgD6AAAAAAEWAAAAAZtYXhwAAJQAAAAARgAAAAGbmFtZVjmdH4AAAGAAAAAsXBvc3T/hgAzAAADeAAAACAAAQAAAAEAALZRFsRfDzz1AAsD6AAAAADOBOTLAAAAAM4KHDwAAAAAA+gDIQAAAAgAAgAAAAAAAAABAAADIQAAAFoD6AAAAAAD6AABAAAAAAAAAAAAAAAAAAAAAQAAUAAAAgAAAAQD6AH0AAUAAAKKArwAAACMAooCvAAAAeAAMQECAAACAAYJAAAAAAAAAAAAAQAAAAAAAAAAAAAAAFBmRWQAwAAuAC4DIP84AFoDIQAAAAAAAQAAAAAAAAAAACAAIAABAAAADgCuAAEAAAAAAAAAAQAAAAEAAAAAAAEAAQAAAAEAAAAAAAIAAQAAAAEAAAAAAAMAAQAAAAEAAAAAAAQAAQAAAAEAAAAAAAUAAQAAAAEAAAAAAAYAAQAAAAMAAQQJAAAAAgABAAMAAQQJAAEAAgABAAMAAQQJAAIAAgABAAMAAQQJAAMAAgABAAMAAQQJAAQAAgABAAMAAQQJAAUAAgABAAMAAQQJAAYAAgABWABYAAAAAAAAAwAAAAMAAAAcAAEAAAAAADwAAwABAAAAHAAEACAAAAAEAAQAAQAAAC7//wAAAC7////TAAEAAAAAAAABBgAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAD/gwAyAAAAAQAAAAAAAAAAAAAAAAAAAAABAAQEAAEBAQJYAAEBASH4DwD4GwHEAvgcA/gXBIwMAYuL+nz5tQXkD5j3CBLnEQACAQEBIVhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYAAABAQAADwACAQEEE/t3Dov6fAH6fAT+fPp8+nwHDosMCvm1Cvm1DAz6fBQAAAAAAAABAAAAAMmJbzEAAAAAzgTjFQAAAADOBOQpAAEAAAAAAAAADAAUAAQAAAABAAAAAgABAAAAAAAAAAAD6AAAAAAAAA==");
                  };
                  return (0, _util.shadow)(this, "_loadTestFont", getLoadTestFont());
                }
              }]);
              return GenericFontLoader;
            }(BaseFontLoader);
          }
          var IsEvalSupportedCached = {
            get value() {
              return (0, _util.shadow)(this, "value", (0, _util.isEvalSupported)());
            }
          };
          var FontFaceObject = function() {
            function FontFaceObject2(translatedData, _ref2) {
              var _ref2$isEvalSupported = _ref2.isEvalSupported, isEvalSupported = _ref2$isEvalSupported === void 0 ? true : _ref2$isEvalSupported, _ref2$disableFontFace = _ref2.disableFontFace, disableFontFace = _ref2$disableFontFace === void 0 ? false : _ref2$disableFontFace, _ref2$ignoreErrors = _ref2.ignoreErrors, ignoreErrors = _ref2$ignoreErrors === void 0 ? false : _ref2$ignoreErrors, _ref2$onUnsupportedFe = _ref2.onUnsupportedFeature, onUnsupportedFeature = _ref2$onUnsupportedFe === void 0 ? null : _ref2$onUnsupportedFe, _ref2$fontRegistry = _ref2.fontRegistry, fontRegistry = _ref2$fontRegistry === void 0 ? null : _ref2$fontRegistry;
              _classCallCheck(this, FontFaceObject2);
              this.compiledGlyphs = /* @__PURE__ */ Object.create(null);
              for (var i in translatedData) {
                this[i] = translatedData[i];
              }
              this.isEvalSupported = isEvalSupported !== false;
              this.disableFontFace = disableFontFace === true;
              this.ignoreErrors = ignoreErrors === true;
              this._onUnsupportedFeature = onUnsupportedFeature;
              this.fontRegistry = fontRegistry;
            }
            _createClass(FontFaceObject2, [{
              key: "createNativeFontFace",
              value: function createNativeFontFace() {
                if (!this.data || this.disableFontFace) {
                  return null;
                }
                var nativeFontFace = new FontFace(this.loadedName, this.data, {});
                if (this.fontRegistry) {
                  this.fontRegistry.registerFont(this);
                }
                return nativeFontFace;
              }
            }, {
              key: "createFontFaceRule",
              value: function createFontFaceRule() {
                if (!this.data || this.disableFontFace) {
                  return null;
                }
                var data = (0, _util.bytesToString)(new Uint8Array(this.data));
                var url = "url(data:".concat(this.mimetype, ";base64,").concat(btoa(data), ");");
                var rule = '@font-face {font-family:"'.concat(this.loadedName, '";src:').concat(url, "}");
                if (this.fontRegistry) {
                  this.fontRegistry.registerFont(this, url);
                }
                return rule;
              }
            }, {
              key: "getPathGenerator",
              value: function getPathGenerator(objs, character) {
                if (this.compiledGlyphs[character] !== void 0) {
                  return this.compiledGlyphs[character];
                }
                var cmds, current;
                try {
                  cmds = objs.get(this.loadedName + "_path_" + character);
                } catch (ex) {
                  if (!this.ignoreErrors) {
                    throw ex;
                  }
                  if (this._onUnsupportedFeature) {
                    this._onUnsupportedFeature({
                      featureId: _util.UNSUPPORTED_FEATURES.font
                    });
                  }
                  (0, _util.warn)('getPathGenerator - ignoring character: "'.concat(ex, '".'));
                  return this.compiledGlyphs[character] = function(c2, size) {
                  };
                }
                if (this.isEvalSupported && IsEvalSupportedCached.value) {
                  var args, js = "";
                  for (var i = 0, ii = cmds.length; i < ii; i++) {
                    current = cmds[i];
                    if (current.args !== void 0) {
                      args = current.args.join(",");
                    } else {
                      args = "";
                    }
                    js += "c." + current.cmd + "(" + args + ");\n";
                  }
                  return this.compiledGlyphs[character] = new Function("c", "size", js);
                }
                return this.compiledGlyphs[character] = function(c2, size) {
                  for (var _i = 0, _ii = cmds.length; _i < _ii; _i++) {
                    current = cmds[_i];
                    if (current.cmd === "scale") {
                      current.args = [size, -size];
                    }
                    c2[current.cmd].apply(c2, current.args);
                  }
                };
              }
            }]);
            return FontFaceObject2;
          }();
          exports2.FontFaceObject = FontFaceObject;
        },
        /* 153 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          var compatibilityParams = /* @__PURE__ */ Object.create(null);
          {
            var isNodeJS = __w_pdfjs_require__(4);
            var userAgent = typeof navigator !== "undefined" && navigator.userAgent || "";
            var isIE = /Trident/.test(userAgent);
            var isIOSChrome = /CriOS/.test(userAgent);
            (function checkOnBlobSupport() {
              if (isIE || isIOSChrome) {
                compatibilityParams.disableCreateObjectURL = true;
              }
            })();
            (function checkFontFaceAndImage() {
              if (isNodeJS()) {
                compatibilityParams.disableFontFace = true;
                compatibilityParams.nativeImageDecoderSupport = "none";
              }
            })();
          }
          exports2.apiCompatibilityParams = Object.freeze(compatibilityParams);
        },
        /* 154 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.CanvasGraphics = void 0;
          var _util = __w_pdfjs_require__(1);
          var _pattern_helper = __w_pdfjs_require__(155);
          var MIN_FONT_SIZE = 16;
          var MAX_FONT_SIZE = 100;
          var MAX_GROUP_SIZE = 4096;
          var MIN_WIDTH_FACTOR = 0.65;
          var MAX_SIZE_TO_COMPILE = 1e3;
          var FULL_CHUNK_HEIGHT = 16;
          var IsLittleEndianCached = {
            get value() {
              return (0, _util.shadow)(IsLittleEndianCached, "value", (0, _util.isLittleEndian)());
            }
          };
          function addContextCurrentTransform(ctx) {
            if (!ctx.mozCurrentTransform) {
              ctx._originalSave = ctx.save;
              ctx._originalRestore = ctx.restore;
              ctx._originalRotate = ctx.rotate;
              ctx._originalScale = ctx.scale;
              ctx._originalTranslate = ctx.translate;
              ctx._originalTransform = ctx.transform;
              ctx._originalSetTransform = ctx.setTransform;
              ctx._transformMatrix = ctx._transformMatrix || [1, 0, 0, 1, 0, 0];
              ctx._transformStack = [];
              Object.defineProperty(ctx, "mozCurrentTransform", {
                get: function getCurrentTransform() {
                  return this._transformMatrix;
                }
              });
              Object.defineProperty(ctx, "mozCurrentTransformInverse", {
                get: function getCurrentTransformInverse() {
                  var m = this._transformMatrix;
                  var a2 = m[0], b = m[1], c2 = m[2], d = m[3], e = m[4], f = m[5];
                  var ad_bc = a2 * d - b * c2;
                  var bc_ad = b * c2 - a2 * d;
                  return [d / ad_bc, b / bc_ad, c2 / bc_ad, a2 / ad_bc, (d * e - c2 * f) / bc_ad, (b * e - a2 * f) / ad_bc];
                }
              });
              ctx.save = function ctxSave() {
                var old = this._transformMatrix;
                this._transformStack.push(old);
                this._transformMatrix = old.slice(0, 6);
                this._originalSave();
              };
              ctx.restore = function ctxRestore() {
                var prev = this._transformStack.pop();
                if (prev) {
                  this._transformMatrix = prev;
                  this._originalRestore();
                }
              };
              ctx.translate = function ctxTranslate(x, y) {
                var m = this._transformMatrix;
                m[4] = m[0] * x + m[2] * y + m[4];
                m[5] = m[1] * x + m[3] * y + m[5];
                this._originalTranslate(x, y);
              };
              ctx.scale = function ctxScale(x, y) {
                var m = this._transformMatrix;
                m[0] = m[0] * x;
                m[1] = m[1] * x;
                m[2] = m[2] * y;
                m[3] = m[3] * y;
                this._originalScale(x, y);
              };
              ctx.transform = function ctxTransform(a2, b, c2, d, e, f) {
                var m = this._transformMatrix;
                this._transformMatrix = [m[0] * a2 + m[2] * b, m[1] * a2 + m[3] * b, m[0] * c2 + m[2] * d, m[1] * c2 + m[3] * d, m[0] * e + m[2] * f + m[4], m[1] * e + m[3] * f + m[5]];
                ctx._originalTransform(a2, b, c2, d, e, f);
              };
              ctx.setTransform = function ctxSetTransform(a2, b, c2, d, e, f) {
                this._transformMatrix = [a2, b, c2, d, e, f];
                ctx._originalSetTransform(a2, b, c2, d, e, f);
              };
              ctx.rotate = function ctxRotate(angle) {
                var cosValue = Math.cos(angle);
                var sinValue = Math.sin(angle);
                var m = this._transformMatrix;
                this._transformMatrix = [m[0] * cosValue + m[2] * sinValue, m[1] * cosValue + m[3] * sinValue, m[0] * -sinValue + m[2] * cosValue, m[1] * -sinValue + m[3] * cosValue, m[4], m[5]];
                this._originalRotate(angle);
              };
            }
          }
          var CachedCanvases = function CachedCanvasesClosure() {
            function CachedCanvases2(canvasFactory) {
              this.canvasFactory = canvasFactory;
              this.cache = /* @__PURE__ */ Object.create(null);
            }
            CachedCanvases2.prototype = {
              getCanvas: function CachedCanvases_getCanvas(id, width, height, trackTransform) {
                var canvasEntry;
                if (this.cache[id] !== void 0) {
                  canvasEntry = this.cache[id];
                  this.canvasFactory.reset(canvasEntry, width, height);
                  canvasEntry.context.setTransform(1, 0, 0, 1, 0, 0);
                } else {
                  canvasEntry = this.canvasFactory.create(width, height);
                  this.cache[id] = canvasEntry;
                }
                if (trackTransform) {
                  addContextCurrentTransform(canvasEntry.context);
                }
                return canvasEntry;
              },
              clear: function clear() {
                for (var id in this.cache) {
                  var canvasEntry = this.cache[id];
                  this.canvasFactory.destroy(canvasEntry);
                  delete this.cache[id];
                }
              }
            };
            return CachedCanvases2;
          }();
          function compileType3Glyph(imgData) {
            var POINT_TO_PROCESS_LIMIT = 1e3;
            var width = imgData.width, height = imgData.height;
            var i, j, j0, width1 = width + 1;
            var points = new Uint8Array(width1 * (height + 1));
            var POINT_TYPES = new Uint8Array([0, 2, 4, 0, 1, 0, 5, 4, 8, 10, 0, 8, 0, 2, 1, 0]);
            var lineSize = width + 7 & ~7, data0 = imgData.data;
            var data = new Uint8Array(lineSize * height), pos = 0, ii;
            for (i = 0, ii = data0.length; i < ii; i++) {
              var mask = 128, elem = data0[i];
              while (mask > 0) {
                data[pos++] = elem & mask ? 0 : 255;
                mask >>= 1;
              }
            }
            var count = 0;
            pos = 0;
            if (data[pos] !== 0) {
              points[0] = 1;
              ++count;
            }
            for (j = 1; j < width; j++) {
              if (data[pos] !== data[pos + 1]) {
                points[j] = data[pos] ? 2 : 1;
                ++count;
              }
              pos++;
            }
            if (data[pos] !== 0) {
              points[j] = 2;
              ++count;
            }
            for (i = 1; i < height; i++) {
              pos = i * lineSize;
              j0 = i * width1;
              if (data[pos - lineSize] !== data[pos]) {
                points[j0] = data[pos] ? 1 : 8;
                ++count;
              }
              var sum = (data[pos] ? 4 : 0) + (data[pos - lineSize] ? 8 : 0);
              for (j = 1; j < width; j++) {
                sum = (sum >> 2) + (data[pos + 1] ? 4 : 0) + (data[pos - lineSize + 1] ? 8 : 0);
                if (POINT_TYPES[sum]) {
                  points[j0 + j] = POINT_TYPES[sum];
                  ++count;
                }
                pos++;
              }
              if (data[pos - lineSize] !== data[pos]) {
                points[j0 + j] = data[pos] ? 2 : 4;
                ++count;
              }
              if (count > POINT_TO_PROCESS_LIMIT) {
                return null;
              }
            }
            pos = lineSize * (height - 1);
            j0 = i * width1;
            if (data[pos] !== 0) {
              points[j0] = 8;
              ++count;
            }
            for (j = 1; j < width; j++) {
              if (data[pos] !== data[pos + 1]) {
                points[j0 + j] = data[pos] ? 4 : 8;
                ++count;
              }
              pos++;
            }
            if (data[pos] !== 0) {
              points[j0 + j] = 4;
              ++count;
            }
            if (count > POINT_TO_PROCESS_LIMIT) {
              return null;
            }
            var steps = new Int32Array([0, width1, -1, 0, -width1, 0, 0, 0, 1]);
            var outlines = [];
            for (i = 0; count && i <= height; i++) {
              var p = i * width1;
              var end = p + width;
              while (p < end && !points[p]) {
                p++;
              }
              if (p === end) {
                continue;
              }
              var coords = [p % width1, i];
              var type = points[p], p0 = p, pp;
              do {
                var step = steps[type];
                do {
                  p += step;
                } while (!points[p]);
                pp = points[p];
                if (pp !== 5 && pp !== 10) {
                  type = pp;
                  points[p] = 0;
                } else {
                  type = pp & 51 * type >> 4;
                  points[p] &= type >> 2 | type << 2;
                }
                coords.push(p % width1);
                coords.push(p / width1 | 0);
                --count;
              } while (p0 !== p);
              outlines.push(coords);
              --i;
            }
            var drawOutline = function drawOutline2(c2) {
              c2.save();
              c2.scale(1 / width, -1 / height);
              c2.translate(0, -height);
              c2.beginPath();
              for (var i2 = 0, ii2 = outlines.length; i2 < ii2; i2++) {
                var o2 = outlines[i2];
                c2.moveTo(o2[0], o2[1]);
                for (var j2 = 2, jj = o2.length; j2 < jj; j2 += 2) {
                  c2.lineTo(o2[j2], o2[j2 + 1]);
                }
              }
              c2.fill();
              c2.beginPath();
              c2.restore();
            };
            return drawOutline;
          }
          var CanvasExtraState = function CanvasExtraStateClosure() {
            function CanvasExtraState2() {
              this.alphaIsShape = false;
              this.fontSize = 0;
              this.fontSizeScale = 1;
              this.textMatrix = _util.IDENTITY_MATRIX;
              this.textMatrixScale = 1;
              this.fontMatrix = _util.FONT_IDENTITY_MATRIX;
              this.leading = 0;
              this.x = 0;
              this.y = 0;
              this.lineX = 0;
              this.lineY = 0;
              this.charSpacing = 0;
              this.wordSpacing = 0;
              this.textHScale = 1;
              this.textRenderingMode = _util.TextRenderingMode.FILL;
              this.textRise = 0;
              this.fillColor = "#000000";
              this.strokeColor = "#000000";
              this.patternFill = false;
              this.fillAlpha = 1;
              this.strokeAlpha = 1;
              this.lineWidth = 1;
              this.activeSMask = null;
              this.resumeSMaskCtx = null;
            }
            CanvasExtraState2.prototype = {
              clone: function CanvasExtraState_clone() {
                return Object.create(this);
              },
              setCurrentPoint: function CanvasExtraState_setCurrentPoint(x, y) {
                this.x = x;
                this.y = y;
              }
            };
            return CanvasExtraState2;
          }();
          var CanvasGraphics = function CanvasGraphicsClosure() {
            var EXECUTION_TIME = 15;
            var EXECUTION_STEPS = 10;
            function CanvasGraphics2(canvasCtx, commonObjs, objs, canvasFactory, webGLContext, imageLayer) {
              this.ctx = canvasCtx;
              this.current = new CanvasExtraState();
              this.stateStack = [];
              this.pendingClip = null;
              this.pendingEOFill = false;
              this.res = null;
              this.xobjs = null;
              this.commonObjs = commonObjs;
              this.objs = objs;
              this.canvasFactory = canvasFactory;
              this.webGLContext = webGLContext;
              this.imageLayer = imageLayer;
              this.groupStack = [];
              this.processingType3 = null;
              this.baseTransform = null;
              this.baseTransformStack = [];
              this.groupLevel = 0;
              this.smaskStack = [];
              this.smaskCounter = 0;
              this.tempSMask = null;
              this.cachedCanvases = new CachedCanvases(this.canvasFactory);
              if (canvasCtx) {
                addContextCurrentTransform(canvasCtx);
              }
              this._cachedGetSinglePixelWidth = null;
            }
            function putBinaryImageData(ctx, imgData) {
              if (typeof ImageData !== "undefined" && imgData instanceof ImageData) {
                ctx.putImageData(imgData, 0, 0);
                return;
              }
              var height = imgData.height, width = imgData.width;
              var partialChunkHeight = height % FULL_CHUNK_HEIGHT;
              var fullChunks = (height - partialChunkHeight) / FULL_CHUNK_HEIGHT;
              var totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;
              var chunkImgData = ctx.createImageData(width, FULL_CHUNK_HEIGHT);
              var srcPos = 0, destPos;
              var src = imgData.data;
              var dest = chunkImgData.data;
              var i, j, thisChunkHeight, elemsInThisChunk;
              if (imgData.kind === _util.ImageKind.GRAYSCALE_1BPP) {
                var srcLength = src.byteLength;
                var dest32 = new Uint32Array(dest.buffer, 0, dest.byteLength >> 2);
                var dest32DataLength = dest32.length;
                var fullSrcDiff = width + 7 >> 3;
                var white = 4294967295;
                var black = IsLittleEndianCached.value ? 4278190080 : 255;
                for (i = 0; i < totalChunks; i++) {
                  thisChunkHeight = i < fullChunks ? FULL_CHUNK_HEIGHT : partialChunkHeight;
                  destPos = 0;
                  for (j = 0; j < thisChunkHeight; j++) {
                    var srcDiff = srcLength - srcPos;
                    var k = 0;
                    var kEnd = srcDiff > fullSrcDiff ? width : srcDiff * 8 - 7;
                    var kEndUnrolled = kEnd & ~7;
                    var mask = 0;
                    var srcByte = 0;
                    for (; k < kEndUnrolled; k += 8) {
                      srcByte = src[srcPos++];
                      dest32[destPos++] = srcByte & 128 ? white : black;
                      dest32[destPos++] = srcByte & 64 ? white : black;
                      dest32[destPos++] = srcByte & 32 ? white : black;
                      dest32[destPos++] = srcByte & 16 ? white : black;
                      dest32[destPos++] = srcByte & 8 ? white : black;
                      dest32[destPos++] = srcByte & 4 ? white : black;
                      dest32[destPos++] = srcByte & 2 ? white : black;
                      dest32[destPos++] = srcByte & 1 ? white : black;
                    }
                    for (; k < kEnd; k++) {
                      if (mask === 0) {
                        srcByte = src[srcPos++];
                        mask = 128;
                      }
                      dest32[destPos++] = srcByte & mask ? white : black;
                      mask >>= 1;
                    }
                  }
                  while (destPos < dest32DataLength) {
                    dest32[destPos++] = 0;
                  }
                  ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
                }
              } else if (imgData.kind === _util.ImageKind.RGBA_32BPP) {
                j = 0;
                elemsInThisChunk = width * FULL_CHUNK_HEIGHT * 4;
                for (i = 0; i < fullChunks; i++) {
                  dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
                  srcPos += elemsInThisChunk;
                  ctx.putImageData(chunkImgData, 0, j);
                  j += FULL_CHUNK_HEIGHT;
                }
                if (i < totalChunks) {
                  elemsInThisChunk = width * partialChunkHeight * 4;
                  dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
                  ctx.putImageData(chunkImgData, 0, j);
                }
              } else if (imgData.kind === _util.ImageKind.RGB_24BPP) {
                thisChunkHeight = FULL_CHUNK_HEIGHT;
                elemsInThisChunk = width * thisChunkHeight;
                for (i = 0; i < totalChunks; i++) {
                  if (i >= fullChunks) {
                    thisChunkHeight = partialChunkHeight;
                    elemsInThisChunk = width * thisChunkHeight;
                  }
                  destPos = 0;
                  for (j = elemsInThisChunk; j--; ) {
                    dest[destPos++] = src[srcPos++];
                    dest[destPos++] = src[srcPos++];
                    dest[destPos++] = src[srcPos++];
                    dest[destPos++] = 255;
                  }
                  ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
                }
              } else {
                throw new Error("bad image kind: ".concat(imgData.kind));
              }
            }
            function putBinaryImageMask(ctx, imgData) {
              var height = imgData.height, width = imgData.width;
              var partialChunkHeight = height % FULL_CHUNK_HEIGHT;
              var fullChunks = (height - partialChunkHeight) / FULL_CHUNK_HEIGHT;
              var totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;
              var chunkImgData = ctx.createImageData(width, FULL_CHUNK_HEIGHT);
              var srcPos = 0;
              var src = imgData.data;
              var dest = chunkImgData.data;
              for (var i = 0; i < totalChunks; i++) {
                var thisChunkHeight = i < fullChunks ? FULL_CHUNK_HEIGHT : partialChunkHeight;
                var destPos = 3;
                for (var j = 0; j < thisChunkHeight; j++) {
                  var mask = 0;
                  for (var k = 0; k < width; k++) {
                    if (!mask) {
                      var elem = src[srcPos++];
                      mask = 128;
                    }
                    dest[destPos] = elem & mask ? 0 : 255;
                    destPos += 4;
                    mask >>= 1;
                  }
                }
                ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
              }
            }
            function copyCtxState(sourceCtx, destCtx) {
              var properties = ["strokeStyle", "fillStyle", "fillRule", "globalAlpha", "lineWidth", "lineCap", "lineJoin", "miterLimit", "globalCompositeOperation", "font"];
              for (var i = 0, ii = properties.length; i < ii; i++) {
                var property = properties[i];
                if (sourceCtx[property] !== void 0) {
                  destCtx[property] = sourceCtx[property];
                }
              }
              if (sourceCtx.setLineDash !== void 0) {
                destCtx.setLineDash(sourceCtx.getLineDash());
                destCtx.lineDashOffset = sourceCtx.lineDashOffset;
              }
            }
            function resetCtxToDefault(ctx) {
              ctx.strokeStyle = "#000000";
              ctx.fillStyle = "#000000";
              ctx.fillRule = "nonzero";
              ctx.globalAlpha = 1;
              ctx.lineWidth = 1;
              ctx.lineCap = "butt";
              ctx.lineJoin = "miter";
              ctx.miterLimit = 10;
              ctx.globalCompositeOperation = "source-over";
              ctx.font = "10px sans-serif";
              if (ctx.setLineDash !== void 0) {
                ctx.setLineDash([]);
                ctx.lineDashOffset = 0;
              }
            }
            function composeSMaskBackdrop(bytes, r0, g0, b0) {
              var length = bytes.length;
              for (var i = 3; i < length; i += 4) {
                var alpha = bytes[i];
                if (alpha === 0) {
                  bytes[i - 3] = r0;
                  bytes[i - 2] = g0;
                  bytes[i - 1] = b0;
                } else if (alpha < 255) {
                  var alpha_ = 255 - alpha;
                  bytes[i - 3] = bytes[i - 3] * alpha + r0 * alpha_ >> 8;
                  bytes[i - 2] = bytes[i - 2] * alpha + g0 * alpha_ >> 8;
                  bytes[i - 1] = bytes[i - 1] * alpha + b0 * alpha_ >> 8;
                }
              }
            }
            function composeSMaskAlpha(maskData, layerData, transferMap) {
              var length = maskData.length;
              var scale = 1 / 255;
              for (var i = 3; i < length; i += 4) {
                var alpha = transferMap ? transferMap[maskData[i]] : maskData[i];
                layerData[i] = layerData[i] * alpha * scale | 0;
              }
            }
            function composeSMaskLuminosity(maskData, layerData, transferMap) {
              var length = maskData.length;
              for (var i = 3; i < length; i += 4) {
                var y = maskData[i - 3] * 77 + maskData[i - 2] * 152 + maskData[i - 1] * 28;
                layerData[i] = transferMap ? layerData[i] * transferMap[y >> 8] >> 8 : layerData[i] * y >> 16;
              }
            }
            function genericComposeSMask(maskCtx, layerCtx, width, height, subtype, backdrop, transferMap) {
              var hasBackdrop = !!backdrop;
              var r0 = hasBackdrop ? backdrop[0] : 0;
              var g0 = hasBackdrop ? backdrop[1] : 0;
              var b0 = hasBackdrop ? backdrop[2] : 0;
              var composeFn;
              if (subtype === "Luminosity") {
                composeFn = composeSMaskLuminosity;
              } else {
                composeFn = composeSMaskAlpha;
              }
              var PIXELS_TO_PROCESS = 1048576;
              var chunkSize = Math.min(height, Math.ceil(PIXELS_TO_PROCESS / width));
              for (var row = 0; row < height; row += chunkSize) {
                var chunkHeight = Math.min(chunkSize, height - row);
                var maskData = maskCtx.getImageData(0, row, width, chunkHeight);
                var layerData = layerCtx.getImageData(0, row, width, chunkHeight);
                if (hasBackdrop) {
                  composeSMaskBackdrop(maskData.data, r0, g0, b0);
                }
                composeFn(maskData.data, layerData.data, transferMap);
                maskCtx.putImageData(layerData, 0, row);
              }
            }
            function composeSMask(ctx, smask, layerCtx, webGLContext) {
              var mask = smask.canvas;
              var maskCtx = smask.context;
              ctx.setTransform(smask.scaleX, 0, 0, smask.scaleY, smask.offsetX, smask.offsetY);
              var backdrop = smask.backdrop || null;
              if (!smask.transferMap && webGLContext.isEnabled) {
                var composed = webGLContext.composeSMask({
                  layer: layerCtx.canvas,
                  mask,
                  properties: {
                    subtype: smask.subtype,
                    backdrop
                  }
                });
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.drawImage(composed, smask.offsetX, smask.offsetY);
                return;
              }
              genericComposeSMask(maskCtx, layerCtx, mask.width, mask.height, smask.subtype, backdrop, smask.transferMap);
              ctx.drawImage(mask, 0, 0);
            }
            var LINE_CAP_STYLES = ["butt", "round", "square"];
            var LINE_JOIN_STYLES = ["miter", "round", "bevel"];
            var NORMAL_CLIP = {};
            var EO_CLIP = {};
            CanvasGraphics2.prototype = {
              beginDrawing: function beginDrawing(_ref) {
                var transform = _ref.transform, viewport = _ref.viewport, _ref$transparency = _ref.transparency, transparency = _ref$transparency === void 0 ? false : _ref$transparency, _ref$background = _ref.background, background = _ref$background === void 0 ? null : _ref$background;
                var width = this.ctx.canvas.width;
                var height = this.ctx.canvas.height;
                this.ctx.save();
                this.ctx.fillStyle = background || "rgb(255, 255, 255)";
                this.ctx.fillRect(0, 0, width, height);
                this.ctx.restore();
                if (transparency) {
                  var transparentCanvas = this.cachedCanvases.getCanvas("transparent", width, height, true);
                  this.compositeCtx = this.ctx;
                  this.transparentCanvas = transparentCanvas.canvas;
                  this.ctx = transparentCanvas.context;
                  this.ctx.save();
                  this.ctx.transform.apply(this.ctx, this.compositeCtx.mozCurrentTransform);
                }
                this.ctx.save();
                resetCtxToDefault(this.ctx);
                if (transform) {
                  this.ctx.transform.apply(this.ctx, transform);
                }
                this.ctx.transform.apply(this.ctx, viewport.transform);
                this.baseTransform = this.ctx.mozCurrentTransform.slice();
                if (this.imageLayer) {
                  this.imageLayer.beginLayout();
                }
              },
              executeOperatorList: function CanvasGraphics_executeOperatorList(operatorList, executionStartIdx, continueCallback, stepper) {
                var argsArray = operatorList.argsArray;
                var fnArray = operatorList.fnArray;
                var i = executionStartIdx || 0;
                var argsArrayLen = argsArray.length;
                if (argsArrayLen === i) {
                  return i;
                }
                var chunkOperations = argsArrayLen - i > EXECUTION_STEPS && typeof continueCallback === "function";
                var endTime = chunkOperations ? Date.now() + EXECUTION_TIME : 0;
                var steps = 0;
                var commonObjs = this.commonObjs;
                var objs = this.objs;
                var fnId;
                while (true) {
                  if (stepper !== void 0 && i === stepper.nextBreakPoint) {
                    stepper.breakIt(i, continueCallback);
                    return i;
                  }
                  fnId = fnArray[i];
                  if (fnId !== _util.OPS.dependency) {
                    this[fnId].apply(this, argsArray[i]);
                  } else {
                    var deps = argsArray[i];
                    for (var n2 = 0, nn = deps.length; n2 < nn; n2++) {
                      var depObjId = deps[n2];
                      var common = depObjId[0] === "g" && depObjId[1] === "_";
                      var objsPool = common ? commonObjs : objs;
                      if (!objsPool.has(depObjId)) {
                        objsPool.get(depObjId, continueCallback);
                        return i;
                      }
                    }
                  }
                  i++;
                  if (i === argsArrayLen) {
                    return i;
                  }
                  if (chunkOperations && ++steps > EXECUTION_STEPS) {
                    if (Date.now() > endTime) {
                      continueCallback();
                      return i;
                    }
                    steps = 0;
                  }
                }
              },
              endDrawing: function CanvasGraphics_endDrawing() {
                if (this.current.activeSMask !== null) {
                  this.endSMaskGroup();
                }
                this.ctx.restore();
                if (this.transparentCanvas) {
                  this.ctx = this.compositeCtx;
                  this.ctx.save();
                  this.ctx.setTransform(1, 0, 0, 1, 0, 0);
                  this.ctx.drawImage(this.transparentCanvas, 0, 0);
                  this.ctx.restore();
                  this.transparentCanvas = null;
                }
                this.cachedCanvases.clear();
                this.webGLContext.clear();
                if (this.imageLayer) {
                  this.imageLayer.endLayout();
                }
              },
              setLineWidth: function CanvasGraphics_setLineWidth(width) {
                this.current.lineWidth = width;
                this.ctx.lineWidth = width;
              },
              setLineCap: function CanvasGraphics_setLineCap(style) {
                this.ctx.lineCap = LINE_CAP_STYLES[style];
              },
              setLineJoin: function CanvasGraphics_setLineJoin(style) {
                this.ctx.lineJoin = LINE_JOIN_STYLES[style];
              },
              setMiterLimit: function CanvasGraphics_setMiterLimit(limit) {
                this.ctx.miterLimit = limit;
              },
              setDash: function CanvasGraphics_setDash(dashArray, dashPhase) {
                var ctx = this.ctx;
                if (ctx.setLineDash !== void 0) {
                  ctx.setLineDash(dashArray);
                  ctx.lineDashOffset = dashPhase;
                }
              },
              setRenderingIntent: function CanvasGraphics_setRenderingIntent(intent) {
              },
              setFlatness: function CanvasGraphics_setFlatness(flatness) {
              },
              setGState: function CanvasGraphics_setGState(states) {
                for (var i = 0, ii = states.length; i < ii; i++) {
                  var state = states[i];
                  var key = state[0];
                  var value = state[1];
                  switch (key) {
                    case "LW":
                      this.setLineWidth(value);
                      break;
                    case "LC":
                      this.setLineCap(value);
                      break;
                    case "LJ":
                      this.setLineJoin(value);
                      break;
                    case "ML":
                      this.setMiterLimit(value);
                      break;
                    case "D":
                      this.setDash(value[0], value[1]);
                      break;
                    case "RI":
                      this.setRenderingIntent(value);
                      break;
                    case "FL":
                      this.setFlatness(value);
                      break;
                    case "Font":
                      this.setFont(value[0], value[1]);
                      break;
                    case "CA":
                      this.current.strokeAlpha = state[1];
                      break;
                    case "ca":
                      this.current.fillAlpha = state[1];
                      this.ctx.globalAlpha = state[1];
                      break;
                    case "BM":
                      this.ctx.globalCompositeOperation = value;
                      break;
                    case "SMask":
                      if (this.current.activeSMask) {
                        if (this.stateStack.length > 0 && this.stateStack[this.stateStack.length - 1].activeSMask === this.current.activeSMask) {
                          this.suspendSMaskGroup();
                        } else {
                          this.endSMaskGroup();
                        }
                      }
                      this.current.activeSMask = value ? this.tempSMask : null;
                      if (this.current.activeSMask) {
                        this.beginSMaskGroup();
                      }
                      this.tempSMask = null;
                      break;
                  }
                }
              },
              beginSMaskGroup: function CanvasGraphics_beginSMaskGroup() {
                var activeSMask = this.current.activeSMask;
                var drawnWidth = activeSMask.canvas.width;
                var drawnHeight = activeSMask.canvas.height;
                var cacheId = "smaskGroupAt" + this.groupLevel;
                var scratchCanvas = this.cachedCanvases.getCanvas(cacheId, drawnWidth, drawnHeight, true);
                var currentCtx = this.ctx;
                var currentTransform = currentCtx.mozCurrentTransform;
                this.ctx.save();
                var groupCtx = scratchCanvas.context;
                groupCtx.scale(1 / activeSMask.scaleX, 1 / activeSMask.scaleY);
                groupCtx.translate(-activeSMask.offsetX, -activeSMask.offsetY);
                groupCtx.transform.apply(groupCtx, currentTransform);
                activeSMask.startTransformInverse = groupCtx.mozCurrentTransformInverse;
                copyCtxState(currentCtx, groupCtx);
                this.ctx = groupCtx;
                this.setGState([["BM", "source-over"], ["ca", 1], ["CA", 1]]);
                this.groupStack.push(currentCtx);
                this.groupLevel++;
              },
              suspendSMaskGroup: function CanvasGraphics_endSMaskGroup() {
                var groupCtx = this.ctx;
                this.groupLevel--;
                this.ctx = this.groupStack.pop();
                composeSMask(this.ctx, this.current.activeSMask, groupCtx, this.webGLContext);
                this.ctx.restore();
                this.ctx.save();
                copyCtxState(groupCtx, this.ctx);
                this.current.resumeSMaskCtx = groupCtx;
                var deltaTransform = _util.Util.transform(this.current.activeSMask.startTransformInverse, groupCtx.mozCurrentTransform);
                this.ctx.transform.apply(this.ctx, deltaTransform);
                groupCtx.save();
                groupCtx.setTransform(1, 0, 0, 1, 0, 0);
                groupCtx.clearRect(0, 0, groupCtx.canvas.width, groupCtx.canvas.height);
                groupCtx.restore();
              },
              resumeSMaskGroup: function CanvasGraphics_endSMaskGroup() {
                var groupCtx = this.current.resumeSMaskCtx;
                var currentCtx = this.ctx;
                this.ctx = groupCtx;
                this.groupStack.push(currentCtx);
                this.groupLevel++;
              },
              endSMaskGroup: function CanvasGraphics_endSMaskGroup() {
                var groupCtx = this.ctx;
                this.groupLevel--;
                this.ctx = this.groupStack.pop();
                composeSMask(this.ctx, this.current.activeSMask, groupCtx, this.webGLContext);
                this.ctx.restore();
                copyCtxState(groupCtx, this.ctx);
                var deltaTransform = _util.Util.transform(this.current.activeSMask.startTransformInverse, groupCtx.mozCurrentTransform);
                this.ctx.transform.apply(this.ctx, deltaTransform);
              },
              save: function CanvasGraphics_save() {
                this.ctx.save();
                var old = this.current;
                this.stateStack.push(old);
                this.current = old.clone();
                this.current.resumeSMaskCtx = null;
              },
              restore: function CanvasGraphics_restore() {
                if (this.current.resumeSMaskCtx) {
                  this.resumeSMaskGroup();
                }
                if (this.current.activeSMask !== null && (this.stateStack.length === 0 || this.stateStack[this.stateStack.length - 1].activeSMask !== this.current.activeSMask)) {
                  this.endSMaskGroup();
                }
                if (this.stateStack.length !== 0) {
                  this.current = this.stateStack.pop();
                  this.ctx.restore();
                  this.pendingClip = null;
                  this._cachedGetSinglePixelWidth = null;
                }
              },
              transform: function CanvasGraphics_transform(a2, b, c2, d, e, f) {
                this.ctx.transform(a2, b, c2, d, e, f);
                this._cachedGetSinglePixelWidth = null;
              },
              constructPath: function CanvasGraphics_constructPath(ops, args) {
                var ctx = this.ctx;
                var current = this.current;
                var x = current.x, y = current.y;
                for (var i = 0, j = 0, ii = ops.length; i < ii; i++) {
                  switch (ops[i] | 0) {
                    case _util.OPS.rectangle:
                      x = args[j++];
                      y = args[j++];
                      var width = args[j++];
                      var height = args[j++];
                      if (width === 0) {
                        width = this.getSinglePixelWidth();
                      }
                      if (height === 0) {
                        height = this.getSinglePixelWidth();
                      }
                      var xw = x + width;
                      var yh = y + height;
                      this.ctx.moveTo(x, y);
                      this.ctx.lineTo(xw, y);
                      this.ctx.lineTo(xw, yh);
                      this.ctx.lineTo(x, yh);
                      this.ctx.lineTo(x, y);
                      this.ctx.closePath();
                      break;
                    case _util.OPS.moveTo:
                      x = args[j++];
                      y = args[j++];
                      ctx.moveTo(x, y);
                      break;
                    case _util.OPS.lineTo:
                      x = args[j++];
                      y = args[j++];
                      ctx.lineTo(x, y);
                      break;
                    case _util.OPS.curveTo:
                      x = args[j + 4];
                      y = args[j + 5];
                      ctx.bezierCurveTo(args[j], args[j + 1], args[j + 2], args[j + 3], x, y);
                      j += 6;
                      break;
                    case _util.OPS.curveTo2:
                      ctx.bezierCurveTo(x, y, args[j], args[j + 1], args[j + 2], args[j + 3]);
                      x = args[j + 2];
                      y = args[j + 3];
                      j += 4;
                      break;
                    case _util.OPS.curveTo3:
                      x = args[j + 2];
                      y = args[j + 3];
                      ctx.bezierCurveTo(args[j], args[j + 1], x, y, x, y);
                      j += 4;
                      break;
                    case _util.OPS.closePath:
                      ctx.closePath();
                      break;
                  }
                }
                current.setCurrentPoint(x, y);
              },
              closePath: function CanvasGraphics_closePath() {
                this.ctx.closePath();
              },
              stroke: function CanvasGraphics_stroke(consumePath) {
                consumePath = typeof consumePath !== "undefined" ? consumePath : true;
                var ctx = this.ctx;
                var strokeColor = this.current.strokeColor;
                ctx.lineWidth = Math.max(this.getSinglePixelWidth() * MIN_WIDTH_FACTOR, this.current.lineWidth);
                ctx.globalAlpha = this.current.strokeAlpha;
                if (strokeColor && strokeColor.hasOwnProperty("type") && strokeColor.type === "Pattern") {
                  ctx.save();
                  ctx.strokeStyle = strokeColor.getPattern(ctx, this);
                  ctx.stroke();
                  ctx.restore();
                } else {
                  ctx.stroke();
                }
                if (consumePath) {
                  this.consumePath();
                }
                ctx.globalAlpha = this.current.fillAlpha;
              },
              closeStroke: function CanvasGraphics_closeStroke() {
                this.closePath();
                this.stroke();
              },
              fill: function CanvasGraphics_fill(consumePath) {
                consumePath = typeof consumePath !== "undefined" ? consumePath : true;
                var ctx = this.ctx;
                var fillColor = this.current.fillColor;
                var isPatternFill = this.current.patternFill;
                var needRestore = false;
                if (isPatternFill) {
                  ctx.save();
                  if (this.baseTransform) {
                    ctx.setTransform.apply(ctx, this.baseTransform);
                  }
                  ctx.fillStyle = fillColor.getPattern(ctx, this);
                  needRestore = true;
                }
                if (this.pendingEOFill) {
                  ctx.fill("evenodd");
                  this.pendingEOFill = false;
                } else {
                  ctx.fill();
                }
                if (needRestore) {
                  ctx.restore();
                }
                if (consumePath) {
                  this.consumePath();
                }
              },
              eoFill: function CanvasGraphics_eoFill() {
                this.pendingEOFill = true;
                this.fill();
              },
              fillStroke: function CanvasGraphics_fillStroke() {
                this.fill(false);
                this.stroke(false);
                this.consumePath();
              },
              eoFillStroke: function CanvasGraphics_eoFillStroke() {
                this.pendingEOFill = true;
                this.fillStroke();
              },
              closeFillStroke: function CanvasGraphics_closeFillStroke() {
                this.closePath();
                this.fillStroke();
              },
              closeEOFillStroke: function CanvasGraphics_closeEOFillStroke() {
                this.pendingEOFill = true;
                this.closePath();
                this.fillStroke();
              },
              endPath: function CanvasGraphics_endPath() {
                this.consumePath();
              },
              clip: function CanvasGraphics_clip() {
                this.pendingClip = NORMAL_CLIP;
              },
              eoClip: function CanvasGraphics_eoClip() {
                this.pendingClip = EO_CLIP;
              },
              beginText: function CanvasGraphics_beginText() {
                this.current.textMatrix = _util.IDENTITY_MATRIX;
                this.current.textMatrixScale = 1;
                this.current.x = this.current.lineX = 0;
                this.current.y = this.current.lineY = 0;
              },
              endText: function CanvasGraphics_endText() {
                var paths = this.pendingTextPaths;
                var ctx = this.ctx;
                if (paths === void 0) {
                  ctx.beginPath();
                  return;
                }
                ctx.save();
                ctx.beginPath();
                for (var i = 0; i < paths.length; i++) {
                  var path = paths[i];
                  ctx.setTransform.apply(ctx, path.transform);
                  ctx.translate(path.x, path.y);
                  path.addToPath(ctx, path.fontSize);
                }
                ctx.restore();
                ctx.clip();
                ctx.beginPath();
                delete this.pendingTextPaths;
              },
              setCharSpacing: function CanvasGraphics_setCharSpacing(spacing) {
                this.current.charSpacing = spacing;
              },
              setWordSpacing: function CanvasGraphics_setWordSpacing(spacing) {
                this.current.wordSpacing = spacing;
              },
              setHScale: function CanvasGraphics_setHScale(scale) {
                this.current.textHScale = scale / 100;
              },
              setLeading: function CanvasGraphics_setLeading(leading) {
                this.current.leading = -leading;
              },
              setFont: function CanvasGraphics_setFont(fontRefName, size) {
                var fontObj = this.commonObjs.get(fontRefName);
                var current = this.current;
                if (!fontObj) {
                  throw new Error("Can't find font for ".concat(fontRefName));
                }
                current.fontMatrix = fontObj.fontMatrix ? fontObj.fontMatrix : _util.FONT_IDENTITY_MATRIX;
                if (current.fontMatrix[0] === 0 || current.fontMatrix[3] === 0) {
                  (0, _util.warn)("Invalid font matrix for font " + fontRefName);
                }
                if (size < 0) {
                  size = -size;
                  current.fontDirection = -1;
                } else {
                  current.fontDirection = 1;
                }
                this.current.font = fontObj;
                this.current.fontSize = size;
                if (fontObj.isType3Font) {
                  return;
                }
                var name = fontObj.loadedName || "sans-serif";
                var bold = fontObj.black ? "900" : fontObj.bold ? "bold" : "normal";
                var italic = fontObj.italic ? "italic" : "normal";
                var typeface = '"'.concat(name, '", ').concat(fontObj.fallbackName);
                var browserFontSize = size < MIN_FONT_SIZE ? MIN_FONT_SIZE : size > MAX_FONT_SIZE ? MAX_FONT_SIZE : size;
                this.current.fontSizeScale = size / browserFontSize;
                this.ctx.font = "".concat(italic, " ").concat(bold, " ").concat(browserFontSize, "px ").concat(typeface);
              },
              setTextRenderingMode: function CanvasGraphics_setTextRenderingMode(mode) {
                this.current.textRenderingMode = mode;
              },
              setTextRise: function CanvasGraphics_setTextRise(rise) {
                this.current.textRise = rise;
              },
              moveText: function CanvasGraphics_moveText(x, y) {
                this.current.x = this.current.lineX += x;
                this.current.y = this.current.lineY += y;
              },
              setLeadingMoveText: function CanvasGraphics_setLeadingMoveText(x, y) {
                this.setLeading(-y);
                this.moveText(x, y);
              },
              setTextMatrix: function CanvasGraphics_setTextMatrix(a2, b, c2, d, e, f) {
                this.current.textMatrix = [a2, b, c2, d, e, f];
                this.current.textMatrixScale = Math.sqrt(a2 * a2 + b * b);
                this.current.x = this.current.lineX = 0;
                this.current.y = this.current.lineY = 0;
              },
              nextLine: function CanvasGraphics_nextLine() {
                this.moveText(0, this.current.leading);
              },
              paintChar: function paintChar(character, x, y, patternTransform) {
                var ctx = this.ctx;
                var current = this.current;
                var font = current.font;
                var textRenderingMode = current.textRenderingMode;
                var fontSize = current.fontSize / current.fontSizeScale;
                var fillStrokeMode = textRenderingMode & _util.TextRenderingMode.FILL_STROKE_MASK;
                var isAddToPathSet = !!(textRenderingMode & _util.TextRenderingMode.ADD_TO_PATH_FLAG);
                var patternFill = current.patternFill && font.data;
                var addToPath;
                if (font.disableFontFace || isAddToPathSet || patternFill) {
                  addToPath = font.getPathGenerator(this.commonObjs, character);
                }
                if (font.disableFontFace || patternFill) {
                  ctx.save();
                  ctx.translate(x, y);
                  ctx.beginPath();
                  addToPath(ctx, fontSize);
                  if (patternTransform) {
                    ctx.setTransform.apply(ctx, patternTransform);
                  }
                  if (fillStrokeMode === _util.TextRenderingMode.FILL || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
                    ctx.fill();
                  }
                  if (fillStrokeMode === _util.TextRenderingMode.STROKE || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
                    ctx.stroke();
                  }
                  ctx.restore();
                } else {
                  if (fillStrokeMode === _util.TextRenderingMode.FILL || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
                    ctx.fillText(character, x, y);
                  }
                  if (fillStrokeMode === _util.TextRenderingMode.STROKE || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
                    ctx.strokeText(character, x, y);
                  }
                }
                if (isAddToPathSet) {
                  var paths = this.pendingTextPaths || (this.pendingTextPaths = []);
                  paths.push({
                    transform: ctx.mozCurrentTransform,
                    x,
                    y,
                    fontSize,
                    addToPath
                  });
                }
              },
              get isFontSubpixelAAEnabled() {
                var ctx = this.canvasFactory.create(10, 10).context;
                ctx.scale(1.5, 1);
                ctx.fillText("I", 0, 10);
                var data = ctx.getImageData(0, 0, 10, 10).data;
                var enabled = false;
                for (var i = 3; i < data.length; i += 4) {
                  if (data[i] > 0 && data[i] < 255) {
                    enabled = true;
                    break;
                  }
                }
                return (0, _util.shadow)(this, "isFontSubpixelAAEnabled", enabled);
              },
              showText: function CanvasGraphics_showText(glyphs) {
                var current = this.current;
                var font = current.font;
                if (font.isType3Font) {
                  return this.showType3Text(glyphs);
                }
                var fontSize = current.fontSize;
                if (fontSize === 0) {
                  return;
                }
                var ctx = this.ctx;
                var fontSizeScale = current.fontSizeScale;
                var charSpacing = current.charSpacing;
                var wordSpacing = current.wordSpacing;
                var fontDirection = current.fontDirection;
                var textHScale = current.textHScale * fontDirection;
                var glyphsLength = glyphs.length;
                var vertical = font.vertical;
                var spacingDir = vertical ? 1 : -1;
                var defaultVMetrics = font.defaultVMetrics;
                var widthAdvanceScale = fontSize * current.fontMatrix[0];
                var simpleFillText = current.textRenderingMode === _util.TextRenderingMode.FILL && !font.disableFontFace && !current.patternFill;
                ctx.save();
                var patternTransform;
                if (current.patternFill) {
                  ctx.save();
                  var pattern = current.fillColor.getPattern(ctx, this);
                  patternTransform = ctx.mozCurrentTransform;
                  ctx.restore();
                  ctx.fillStyle = pattern;
                }
                ctx.transform.apply(ctx, current.textMatrix);
                ctx.translate(current.x, current.y + current.textRise);
                if (fontDirection > 0) {
                  ctx.scale(textHScale, -1);
                } else {
                  ctx.scale(textHScale, 1);
                }
                var lineWidth = current.lineWidth;
                var scale = current.textMatrixScale;
                if (scale === 0 || lineWidth === 0) {
                  var fillStrokeMode = current.textRenderingMode & _util.TextRenderingMode.FILL_STROKE_MASK;
                  if (fillStrokeMode === _util.TextRenderingMode.STROKE || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
                    this._cachedGetSinglePixelWidth = null;
                    lineWidth = this.getSinglePixelWidth() * MIN_WIDTH_FACTOR;
                  }
                } else {
                  lineWidth /= scale;
                }
                if (fontSizeScale !== 1) {
                  ctx.scale(fontSizeScale, fontSizeScale);
                  lineWidth /= fontSizeScale;
                }
                ctx.lineWidth = lineWidth;
                var x = 0, i;
                for (i = 0; i < glyphsLength; ++i) {
                  var glyph = glyphs[i];
                  if ((0, _util.isNum)(glyph)) {
                    x += spacingDir * glyph * fontSize / 1e3;
                    continue;
                  }
                  var restoreNeeded = false;
                  var spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
                  var character = glyph.fontChar;
                  var accent = glyph.accent;
                  var scaledX, scaledY, scaledAccentX, scaledAccentY;
                  var width = glyph.width;
                  if (vertical) {
                    var vmetric, vx, vy;
                    vmetric = glyph.vmetric || defaultVMetrics;
                    vx = glyph.vmetric ? vmetric[1] : width * 0.5;
                    vx = -vx * widthAdvanceScale;
                    vy = vmetric[2] * widthAdvanceScale;
                    width = vmetric ? -vmetric[0] : width;
                    scaledX = vx / fontSizeScale;
                    scaledY = (x + vy) / fontSizeScale;
                  } else {
                    scaledX = x / fontSizeScale;
                    scaledY = 0;
                  }
                  if (font.remeasure && width > 0) {
                    var measuredWidth = ctx.measureText(character).width * 1e3 / fontSize * fontSizeScale;
                    if (width < measuredWidth && this.isFontSubpixelAAEnabled) {
                      var characterScaleX = width / measuredWidth;
                      restoreNeeded = true;
                      ctx.save();
                      ctx.scale(characterScaleX, 1);
                      scaledX /= characterScaleX;
                    } else if (width !== measuredWidth) {
                      scaledX += (width - measuredWidth) / 2e3 * fontSize / fontSizeScale;
                    }
                  }
                  if (glyph.isInFont || font.missingFile) {
                    if (simpleFillText && !accent) {
                      ctx.fillText(character, scaledX, scaledY);
                    } else {
                      this.paintChar(character, scaledX, scaledY, patternTransform);
                      if (accent) {
                        scaledAccentX = scaledX + accent.offset.x / fontSizeScale;
                        scaledAccentY = scaledY - accent.offset.y / fontSizeScale;
                        this.paintChar(accent.fontChar, scaledAccentX, scaledAccentY, patternTransform);
                      }
                    }
                  }
                  var charWidth = width * widthAdvanceScale + spacing * fontDirection;
                  x += charWidth;
                  if (restoreNeeded) {
                    ctx.restore();
                  }
                }
                if (vertical) {
                  current.y -= x * textHScale;
                } else {
                  current.x += x * textHScale;
                }
                ctx.restore();
              },
              showType3Text: function CanvasGraphics_showType3Text(glyphs) {
                var ctx = this.ctx;
                var current = this.current;
                var font = current.font;
                var fontSize = current.fontSize;
                var fontDirection = current.fontDirection;
                var spacingDir = font.vertical ? 1 : -1;
                var charSpacing = current.charSpacing;
                var wordSpacing = current.wordSpacing;
                var textHScale = current.textHScale * fontDirection;
                var fontMatrix = current.fontMatrix || _util.FONT_IDENTITY_MATRIX;
                var glyphsLength = glyphs.length;
                var isTextInvisible = current.textRenderingMode === _util.TextRenderingMode.INVISIBLE;
                var i, glyph, width, spacingLength;
                if (isTextInvisible || fontSize === 0) {
                  return;
                }
                this._cachedGetSinglePixelWidth = null;
                ctx.save();
                ctx.transform.apply(ctx, current.textMatrix);
                ctx.translate(current.x, current.y);
                ctx.scale(textHScale, fontDirection);
                for (i = 0; i < glyphsLength; ++i) {
                  glyph = glyphs[i];
                  if ((0, _util.isNum)(glyph)) {
                    spacingLength = spacingDir * glyph * fontSize / 1e3;
                    this.ctx.translate(spacingLength, 0);
                    current.x += spacingLength * textHScale;
                    continue;
                  }
                  var spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
                  var operatorList = font.charProcOperatorList[glyph.operatorListId];
                  if (!operatorList) {
                    (0, _util.warn)('Type3 character "'.concat(glyph.operatorListId, '" is not available.'));
                    continue;
                  }
                  this.processingType3 = glyph;
                  this.save();
                  ctx.scale(fontSize, fontSize);
                  ctx.transform.apply(ctx, fontMatrix);
                  this.executeOperatorList(operatorList);
                  this.restore();
                  var transformed = _util.Util.applyTransform([glyph.width, 0], fontMatrix);
                  width = transformed[0] * fontSize + spacing;
                  ctx.translate(width, 0);
                  current.x += width * textHScale;
                }
                ctx.restore();
                this.processingType3 = null;
              },
              setCharWidth: function CanvasGraphics_setCharWidth(xWidth, yWidth) {
              },
              setCharWidthAndBounds: function CanvasGraphics_setCharWidthAndBounds(xWidth, yWidth, llx, lly, urx, ury) {
                this.ctx.rect(llx, lly, urx - llx, ury - lly);
                this.clip();
                this.endPath();
              },
              getColorN_Pattern: function CanvasGraphics_getColorN_Pattern(IR) {
                var _this = this;
                var pattern;
                if (IR[0] === "TilingPattern") {
                  var color = IR[1];
                  var baseTransform = this.baseTransform || this.ctx.mozCurrentTransform.slice();
                  var canvasGraphicsFactory = {
                    createCanvasGraphics: function createCanvasGraphics(ctx) {
                      return new CanvasGraphics2(ctx, _this.commonObjs, _this.objs, _this.canvasFactory, _this.webGLContext);
                    }
                  };
                  pattern = new _pattern_helper.TilingPattern(IR, color, this.ctx, canvasGraphicsFactory, baseTransform);
                } else {
                  pattern = (0, _pattern_helper.getShadingPatternFromIR)(IR);
                }
                return pattern;
              },
              setStrokeColorN: function CanvasGraphics_setStrokeColorN() {
                this.current.strokeColor = this.getColorN_Pattern(arguments);
              },
              setFillColorN: function CanvasGraphics_setFillColorN() {
                this.current.fillColor = this.getColorN_Pattern(arguments);
                this.current.patternFill = true;
              },
              setStrokeRGBColor: function CanvasGraphics_setStrokeRGBColor(r2, g, b) {
                var color = _util.Util.makeCssRgb(r2, g, b);
                this.ctx.strokeStyle = color;
                this.current.strokeColor = color;
              },
              setFillRGBColor: function CanvasGraphics_setFillRGBColor(r2, g, b) {
                var color = _util.Util.makeCssRgb(r2, g, b);
                this.ctx.fillStyle = color;
                this.current.fillColor = color;
                this.current.patternFill = false;
              },
              shadingFill: function CanvasGraphics_shadingFill(patternIR) {
                var ctx = this.ctx;
                this.save();
                var pattern = (0, _pattern_helper.getShadingPatternFromIR)(patternIR);
                ctx.fillStyle = pattern.getPattern(ctx, this, true);
                var inv = ctx.mozCurrentTransformInverse;
                if (inv) {
                  var canvas = ctx.canvas;
                  var width = canvas.width;
                  var height = canvas.height;
                  var bl = _util.Util.applyTransform([0, 0], inv);
                  var br = _util.Util.applyTransform([0, height], inv);
                  var ul = _util.Util.applyTransform([width, 0], inv);
                  var ur = _util.Util.applyTransform([width, height], inv);
                  var x0 = Math.min(bl[0], br[0], ul[0], ur[0]);
                  var y0 = Math.min(bl[1], br[1], ul[1], ur[1]);
                  var x1 = Math.max(bl[0], br[0], ul[0], ur[0]);
                  var y1 = Math.max(bl[1], br[1], ul[1], ur[1]);
                  this.ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
                } else {
                  this.ctx.fillRect(-1e10, -1e10, 2e10, 2e10);
                }
                this.restore();
              },
              beginInlineImage: function CanvasGraphics_beginInlineImage() {
                (0, _util.unreachable)("Should not call beginInlineImage");
              },
              beginImageData: function CanvasGraphics_beginImageData() {
                (0, _util.unreachable)("Should not call beginImageData");
              },
              paintFormXObjectBegin: function CanvasGraphics_paintFormXObjectBegin(matrix, bbox) {
                this.save();
                this.baseTransformStack.push(this.baseTransform);
                if (Array.isArray(matrix) && matrix.length === 6) {
                  this.transform.apply(this, matrix);
                }
                this.baseTransform = this.ctx.mozCurrentTransform;
                if (bbox) {
                  var width = bbox[2] - bbox[0];
                  var height = bbox[3] - bbox[1];
                  this.ctx.rect(bbox[0], bbox[1], width, height);
                  this.clip();
                  this.endPath();
                }
              },
              paintFormXObjectEnd: function CanvasGraphics_paintFormXObjectEnd() {
                this.restore();
                this.baseTransform = this.baseTransformStack.pop();
              },
              beginGroup: function CanvasGraphics_beginGroup(group) {
                this.save();
                var currentCtx = this.ctx;
                if (!group.isolated) {
                  (0, _util.info)("TODO: Support non-isolated groups.");
                }
                if (group.knockout) {
                  (0, _util.warn)("Knockout groups not supported.");
                }
                var currentTransform = currentCtx.mozCurrentTransform;
                if (group.matrix) {
                  currentCtx.transform.apply(currentCtx, group.matrix);
                }
                if (!group.bbox) {
                  throw new Error("Bounding box is required.");
                }
                var bounds = _util.Util.getAxialAlignedBoundingBox(group.bbox, currentCtx.mozCurrentTransform);
                var canvasBounds = [0, 0, currentCtx.canvas.width, currentCtx.canvas.height];
                bounds = _util.Util.intersect(bounds, canvasBounds) || [0, 0, 0, 0];
                var offsetX = Math.floor(bounds[0]);
                var offsetY = Math.floor(bounds[1]);
                var drawnWidth = Math.max(Math.ceil(bounds[2]) - offsetX, 1);
                var drawnHeight = Math.max(Math.ceil(bounds[3]) - offsetY, 1);
                var scaleX = 1, scaleY = 1;
                if (drawnWidth > MAX_GROUP_SIZE) {
                  scaleX = drawnWidth / MAX_GROUP_SIZE;
                  drawnWidth = MAX_GROUP_SIZE;
                }
                if (drawnHeight > MAX_GROUP_SIZE) {
                  scaleY = drawnHeight / MAX_GROUP_SIZE;
                  drawnHeight = MAX_GROUP_SIZE;
                }
                var cacheId = "groupAt" + this.groupLevel;
                if (group.smask) {
                  cacheId += "_smask_" + this.smaskCounter++ % 2;
                }
                var scratchCanvas = this.cachedCanvases.getCanvas(cacheId, drawnWidth, drawnHeight, true);
                var groupCtx = scratchCanvas.context;
                groupCtx.scale(1 / scaleX, 1 / scaleY);
                groupCtx.translate(-offsetX, -offsetY);
                groupCtx.transform.apply(groupCtx, currentTransform);
                if (group.smask) {
                  this.smaskStack.push({
                    canvas: scratchCanvas.canvas,
                    context: groupCtx,
                    offsetX,
                    offsetY,
                    scaleX,
                    scaleY,
                    subtype: group.smask.subtype,
                    backdrop: group.smask.backdrop,
                    transferMap: group.smask.transferMap || null,
                    startTransformInverse: null
                  });
                } else {
                  currentCtx.setTransform(1, 0, 0, 1, 0, 0);
                  currentCtx.translate(offsetX, offsetY);
                  currentCtx.scale(scaleX, scaleY);
                }
                copyCtxState(currentCtx, groupCtx);
                this.ctx = groupCtx;
                this.setGState([["BM", "source-over"], ["ca", 1], ["CA", 1]]);
                this.groupStack.push(currentCtx);
                this.groupLevel++;
                this.current.activeSMask = null;
              },
              endGroup: function CanvasGraphics_endGroup(group) {
                this.groupLevel--;
                var groupCtx = this.ctx;
                this.ctx = this.groupStack.pop();
                if (this.ctx.imageSmoothingEnabled !== void 0) {
                  this.ctx.imageSmoothingEnabled = false;
                } else {
                  this.ctx.mozImageSmoothingEnabled = false;
                }
                if (group.smask) {
                  this.tempSMask = this.smaskStack.pop();
                } else {
                  this.ctx.drawImage(groupCtx.canvas, 0, 0);
                }
                this.restore();
              },
              beginAnnotations: function CanvasGraphics_beginAnnotations() {
                this.save();
                if (this.baseTransform) {
                  this.ctx.setTransform.apply(this.ctx, this.baseTransform);
                }
              },
              endAnnotations: function CanvasGraphics_endAnnotations() {
                this.restore();
              },
              beginAnnotation: function CanvasGraphics_beginAnnotation(rect, transform, matrix) {
                this.save();
                resetCtxToDefault(this.ctx);
                this.current = new CanvasExtraState();
                if (Array.isArray(rect) && rect.length === 4) {
                  var width = rect[2] - rect[0];
                  var height = rect[3] - rect[1];
                  this.ctx.rect(rect[0], rect[1], width, height);
                  this.clip();
                  this.endPath();
                }
                this.transform.apply(this, transform);
                this.transform.apply(this, matrix);
              },
              endAnnotation: function CanvasGraphics_endAnnotation() {
                this.restore();
              },
              paintJpegXObject: function CanvasGraphics_paintJpegXObject(objId, w, h) {
                var domImage = this.objs.get(objId);
                if (!domImage) {
                  (0, _util.warn)("Dependent image isn't ready yet");
                  return;
                }
                this.save();
                var ctx = this.ctx;
                ctx.scale(1 / w, -1 / h);
                ctx.drawImage(domImage, 0, 0, domImage.width, domImage.height, 0, -h, w, h);
                if (this.imageLayer) {
                  var currentTransform = ctx.mozCurrentTransformInverse;
                  var position = this.getCanvasPosition(0, 0);
                  this.imageLayer.appendImage({
                    objId,
                    left: position[0],
                    top: position[1],
                    width: w / currentTransform[0],
                    height: h / currentTransform[3]
                  });
                }
                this.restore();
              },
              paintImageMaskXObject: function CanvasGraphics_paintImageMaskXObject(img) {
                var ctx = this.ctx;
                var width = img.width, height = img.height;
                var fillColor = this.current.fillColor;
                var isPatternFill = this.current.patternFill;
                var glyph = this.processingType3;
                if (glyph && glyph.compiled === void 0) {
                  if (width <= MAX_SIZE_TO_COMPILE && height <= MAX_SIZE_TO_COMPILE) {
                    glyph.compiled = compileType3Glyph({
                      data: img.data,
                      width,
                      height
                    });
                  } else {
                    glyph.compiled = null;
                  }
                }
                if (glyph && glyph.compiled) {
                  glyph.compiled(ctx);
                  return;
                }
                var maskCanvas = this.cachedCanvases.getCanvas("maskCanvas", width, height);
                var maskCtx = maskCanvas.context;
                maskCtx.save();
                putBinaryImageMask(maskCtx, img);
                maskCtx.globalCompositeOperation = "source-in";
                maskCtx.fillStyle = isPatternFill ? fillColor.getPattern(maskCtx, this) : fillColor;
                maskCtx.fillRect(0, 0, width, height);
                maskCtx.restore();
                this.paintInlineImageXObject(maskCanvas.canvas);
              },
              paintImageMaskXObjectRepeat: function CanvasGraphics_paintImageMaskXObjectRepeat(imgData, scaleX, scaleY, positions) {
                var width = imgData.width;
                var height = imgData.height;
                var fillColor = this.current.fillColor;
                var isPatternFill = this.current.patternFill;
                var maskCanvas = this.cachedCanvases.getCanvas("maskCanvas", width, height);
                var maskCtx = maskCanvas.context;
                maskCtx.save();
                putBinaryImageMask(maskCtx, imgData);
                maskCtx.globalCompositeOperation = "source-in";
                maskCtx.fillStyle = isPatternFill ? fillColor.getPattern(maskCtx, this) : fillColor;
                maskCtx.fillRect(0, 0, width, height);
                maskCtx.restore();
                var ctx = this.ctx;
                for (var i = 0, ii = positions.length; i < ii; i += 2) {
                  ctx.save();
                  ctx.transform(scaleX, 0, 0, scaleY, positions[i], positions[i + 1]);
                  ctx.scale(1, -1);
                  ctx.drawImage(maskCanvas.canvas, 0, 0, width, height, 0, -1, 1, 1);
                  ctx.restore();
                }
              },
              paintImageMaskXObjectGroup: function CanvasGraphics_paintImageMaskXObjectGroup(images) {
                var ctx = this.ctx;
                var fillColor = this.current.fillColor;
                var isPatternFill = this.current.patternFill;
                for (var i = 0, ii = images.length; i < ii; i++) {
                  var image = images[i];
                  var width = image.width, height = image.height;
                  var maskCanvas = this.cachedCanvases.getCanvas("maskCanvas", width, height);
                  var maskCtx = maskCanvas.context;
                  maskCtx.save();
                  putBinaryImageMask(maskCtx, image);
                  maskCtx.globalCompositeOperation = "source-in";
                  maskCtx.fillStyle = isPatternFill ? fillColor.getPattern(maskCtx, this) : fillColor;
                  maskCtx.fillRect(0, 0, width, height);
                  maskCtx.restore();
                  ctx.save();
                  ctx.transform.apply(ctx, image.transform);
                  ctx.scale(1, -1);
                  ctx.drawImage(maskCanvas.canvas, 0, 0, width, height, 0, -1, 1, 1);
                  ctx.restore();
                }
              },
              paintImageXObject: function CanvasGraphics_paintImageXObject(objId) {
                var imgData = this.objs.get(objId);
                if (!imgData) {
                  (0, _util.warn)("Dependent image isn't ready yet");
                  return;
                }
                this.paintInlineImageXObject(imgData);
              },
              paintImageXObjectRepeat: function CanvasGraphics_paintImageXObjectRepeat(objId, scaleX, scaleY, positions) {
                var imgData = this.objs.get(objId);
                if (!imgData) {
                  (0, _util.warn)("Dependent image isn't ready yet");
                  return;
                }
                var width = imgData.width;
                var height = imgData.height;
                var map2 = [];
                for (var i = 0, ii = positions.length; i < ii; i += 2) {
                  map2.push({
                    transform: [scaleX, 0, 0, scaleY, positions[i], positions[i + 1]],
                    x: 0,
                    y: 0,
                    w: width,
                    h: height
                  });
                }
                this.paintInlineImageXObjectGroup(imgData, map2);
              },
              paintInlineImageXObject: function CanvasGraphics_paintInlineImageXObject(imgData) {
                var width = imgData.width;
                var height = imgData.height;
                var ctx = this.ctx;
                this.save();
                ctx.scale(1 / width, -1 / height);
                var currentTransform = ctx.mozCurrentTransformInverse;
                var a2 = currentTransform[0], b = currentTransform[1];
                var widthScale = Math.max(Math.sqrt(a2 * a2 + b * b), 1);
                var c2 = currentTransform[2], d = currentTransform[3];
                var heightScale = Math.max(Math.sqrt(c2 * c2 + d * d), 1);
                var imgToPaint, tmpCanvas;
                if (typeof HTMLElement === "function" && imgData instanceof HTMLElement || !imgData.data) {
                  imgToPaint = imgData;
                } else {
                  tmpCanvas = this.cachedCanvases.getCanvas("inlineImage", width, height);
                  var tmpCtx = tmpCanvas.context;
                  putBinaryImageData(tmpCtx, imgData);
                  imgToPaint = tmpCanvas.canvas;
                }
                var paintWidth = width, paintHeight = height;
                var tmpCanvasId = "prescale1";
                while (widthScale > 2 && paintWidth > 1 || heightScale > 2 && paintHeight > 1) {
                  var newWidth = paintWidth, newHeight = paintHeight;
                  if (widthScale > 2 && paintWidth > 1) {
                    newWidth = Math.ceil(paintWidth / 2);
                    widthScale /= paintWidth / newWidth;
                  }
                  if (heightScale > 2 && paintHeight > 1) {
                    newHeight = Math.ceil(paintHeight / 2);
                    heightScale /= paintHeight / newHeight;
                  }
                  tmpCanvas = this.cachedCanvases.getCanvas(tmpCanvasId, newWidth, newHeight);
                  tmpCtx = tmpCanvas.context;
                  tmpCtx.clearRect(0, 0, newWidth, newHeight);
                  tmpCtx.drawImage(imgToPaint, 0, 0, paintWidth, paintHeight, 0, 0, newWidth, newHeight);
                  imgToPaint = tmpCanvas.canvas;
                  paintWidth = newWidth;
                  paintHeight = newHeight;
                  tmpCanvasId = tmpCanvasId === "prescale1" ? "prescale2" : "prescale1";
                }
                ctx.drawImage(imgToPaint, 0, 0, paintWidth, paintHeight, 0, -height, width, height);
                if (this.imageLayer) {
                  var position = this.getCanvasPosition(0, -height);
                  this.imageLayer.appendImage({
                    imgData,
                    left: position[0],
                    top: position[1],
                    width: width / currentTransform[0],
                    height: height / currentTransform[3]
                  });
                }
                this.restore();
              },
              paintInlineImageXObjectGroup: function CanvasGraphics_paintInlineImageXObjectGroup(imgData, map2) {
                var ctx = this.ctx;
                var w = imgData.width;
                var h = imgData.height;
                var tmpCanvas = this.cachedCanvases.getCanvas("inlineImage", w, h);
                var tmpCtx = tmpCanvas.context;
                putBinaryImageData(tmpCtx, imgData);
                for (var i = 0, ii = map2.length; i < ii; i++) {
                  var entry = map2[i];
                  ctx.save();
                  ctx.transform.apply(ctx, entry.transform);
                  ctx.scale(1, -1);
                  ctx.drawImage(tmpCanvas.canvas, entry.x, entry.y, entry.w, entry.h, 0, -1, 1, 1);
                  if (this.imageLayer) {
                    var position = this.getCanvasPosition(entry.x, entry.y);
                    this.imageLayer.appendImage({
                      imgData,
                      left: position[0],
                      top: position[1],
                      width: w,
                      height: h
                    });
                  }
                  ctx.restore();
                }
              },
              paintSolidColorImageMask: function CanvasGraphics_paintSolidColorImageMask() {
                this.ctx.fillRect(0, 0, 1, 1);
              },
              paintXObject: function CanvasGraphics_paintXObject() {
                (0, _util.warn)("Unsupported 'paintXObject' command.");
              },
              markPoint: function CanvasGraphics_markPoint(tag) {
              },
              markPointProps: function CanvasGraphics_markPointProps(tag, properties) {
              },
              beginMarkedContent: function CanvasGraphics_beginMarkedContent(tag) {
              },
              beginMarkedContentProps: function CanvasGraphics_beginMarkedContentProps(tag, properties) {
              },
              endMarkedContent: function CanvasGraphics_endMarkedContent() {
              },
              beginCompat: function CanvasGraphics_beginCompat() {
              },
              endCompat: function CanvasGraphics_endCompat() {
              },
              consumePath: function CanvasGraphics_consumePath() {
                var ctx = this.ctx;
                if (this.pendingClip) {
                  if (this.pendingClip === EO_CLIP) {
                    ctx.clip("evenodd");
                  } else {
                    ctx.clip();
                  }
                  this.pendingClip = null;
                }
                ctx.beginPath();
              },
              getSinglePixelWidth: function getSinglePixelWidth(scale) {
                if (this._cachedGetSinglePixelWidth === null) {
                  var inverse = this.ctx.mozCurrentTransformInverse;
                  this._cachedGetSinglePixelWidth = Math.sqrt(Math.max(inverse[0] * inverse[0] + inverse[1] * inverse[1], inverse[2] * inverse[2] + inverse[3] * inverse[3]));
                }
                return this._cachedGetSinglePixelWidth;
              },
              getCanvasPosition: function CanvasGraphics_getCanvasPosition(x, y) {
                var transform = this.ctx.mozCurrentTransform;
                return [transform[0] * x + transform[2] * y + transform[4], transform[1] * x + transform[3] * y + transform[5]];
              }
            };
            for (var op in _util.OPS) {
              CanvasGraphics2.prototype[_util.OPS[op]] = CanvasGraphics2.prototype[op];
            }
            return CanvasGraphics2;
          }();
          exports2.CanvasGraphics = CanvasGraphics;
        },
        /* 155 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.getShadingPatternFromIR = getShadingPatternFromIR;
          exports2.TilingPattern = void 0;
          var _util = __w_pdfjs_require__(1);
          var ShadingIRs = {};
          ShadingIRs.RadialAxial = {
            fromIR: function RadialAxial_fromIR(raw) {
              var type = raw[1];
              var colorStops = raw[2];
              var p0 = raw[3];
              var p1 = raw[4];
              var r0 = raw[5];
              var r1 = raw[6];
              return {
                type: "Pattern",
                getPattern: function RadialAxial_getPattern(ctx) {
                  var grad;
                  if (type === "axial") {
                    grad = ctx.createLinearGradient(p0[0], p0[1], p1[0], p1[1]);
                  } else if (type === "radial") {
                    grad = ctx.createRadialGradient(p0[0], p0[1], r0, p1[0], p1[1], r1);
                  }
                  for (var i = 0, ii = colorStops.length; i < ii; ++i) {
                    var c2 = colorStops[i];
                    grad.addColorStop(c2[0], c2[1]);
                  }
                  return grad;
                }
              };
            }
          };
          var createMeshCanvas = /* @__PURE__ */ function createMeshCanvasClosure() {
            function drawTriangle(data, context, p1, p2, p3, c1, c2, c3) {
              var coords = context.coords, colors = context.colors;
              var bytes = data.data, rowSize = data.width * 4;
              var tmp;
              if (coords[p1 + 1] > coords[p2 + 1]) {
                tmp = p1;
                p1 = p2;
                p2 = tmp;
                tmp = c1;
                c1 = c2;
                c2 = tmp;
              }
              if (coords[p2 + 1] > coords[p3 + 1]) {
                tmp = p2;
                p2 = p3;
                p3 = tmp;
                tmp = c2;
                c2 = c3;
                c3 = tmp;
              }
              if (coords[p1 + 1] > coords[p2 + 1]) {
                tmp = p1;
                p1 = p2;
                p2 = tmp;
                tmp = c1;
                c1 = c2;
                c2 = tmp;
              }
              var x1 = (coords[p1] + context.offsetX) * context.scaleX;
              var y1 = (coords[p1 + 1] + context.offsetY) * context.scaleY;
              var x2 = (coords[p2] + context.offsetX) * context.scaleX;
              var y2 = (coords[p2 + 1] + context.offsetY) * context.scaleY;
              var x3 = (coords[p3] + context.offsetX) * context.scaleX;
              var y3 = (coords[p3 + 1] + context.offsetY) * context.scaleY;
              if (y1 >= y3) {
                return;
              }
              var c1r = colors[c1], c1g = colors[c1 + 1], c1b = colors[c1 + 2];
              var c2r = colors[c2], c2g = colors[c2 + 1], c2b = colors[c2 + 2];
              var c3r = colors[c3], c3g = colors[c3 + 1], c3b = colors[c3 + 2];
              var minY = Math.round(y1), maxY = Math.round(y3);
              var xa, car, cag, cab;
              var xb, cbr, cbg, cbb;
              var k;
              for (var y = minY; y <= maxY; y++) {
                if (y < y2) {
                  k = y < y1 ? 0 : y1 === y2 ? 1 : (y1 - y) / (y1 - y2);
                  xa = x1 - (x1 - x2) * k;
                  car = c1r - (c1r - c2r) * k;
                  cag = c1g - (c1g - c2g) * k;
                  cab = c1b - (c1b - c2b) * k;
                } else {
                  k = y > y3 ? 1 : y2 === y3 ? 0 : (y2 - y) / (y2 - y3);
                  xa = x2 - (x2 - x3) * k;
                  car = c2r - (c2r - c3r) * k;
                  cag = c2g - (c2g - c3g) * k;
                  cab = c2b - (c2b - c3b) * k;
                }
                k = y < y1 ? 0 : y > y3 ? 1 : (y1 - y) / (y1 - y3);
                xb = x1 - (x1 - x3) * k;
                cbr = c1r - (c1r - c3r) * k;
                cbg = c1g - (c1g - c3g) * k;
                cbb = c1b - (c1b - c3b) * k;
                var x1_ = Math.round(Math.min(xa, xb));
                var x2_ = Math.round(Math.max(xa, xb));
                var j = rowSize * y + x1_ * 4;
                for (var x = x1_; x <= x2_; x++) {
                  k = (xa - x) / (xa - xb);
                  k = k < 0 ? 0 : k > 1 ? 1 : k;
                  bytes[j++] = car - (car - cbr) * k | 0;
                  bytes[j++] = cag - (cag - cbg) * k | 0;
                  bytes[j++] = cab - (cab - cbb) * k | 0;
                  bytes[j++] = 255;
                }
              }
            }
            function drawFigure(data, figure, context) {
              var ps = figure.coords;
              var cs = figure.colors;
              var i, ii;
              switch (figure.type) {
                case "lattice":
                  var verticesPerRow = figure.verticesPerRow;
                  var rows = Math.floor(ps.length / verticesPerRow) - 1;
                  var cols = verticesPerRow - 1;
                  for (i = 0; i < rows; i++) {
                    var q = i * verticesPerRow;
                    for (var j = 0; j < cols; j++, q++) {
                      drawTriangle(data, context, ps[q], ps[q + 1], ps[q + verticesPerRow], cs[q], cs[q + 1], cs[q + verticesPerRow]);
                      drawTriangle(data, context, ps[q + verticesPerRow + 1], ps[q + 1], ps[q + verticesPerRow], cs[q + verticesPerRow + 1], cs[q + 1], cs[q + verticesPerRow]);
                    }
                  }
                  break;
                case "triangles":
                  for (i = 0, ii = ps.length; i < ii; i += 3) {
                    drawTriangle(data, context, ps[i], ps[i + 1], ps[i + 2], cs[i], cs[i + 1], cs[i + 2]);
                  }
                  break;
                default:
                  throw new Error("illegal figure");
              }
            }
            function createMeshCanvas2(bounds, combinesScale, coords, colors, figures, backgroundColor, cachedCanvases, webGLContext) {
              var EXPECTED_SCALE = 1.1;
              var MAX_PATTERN_SIZE = 3e3;
              var BORDER_SIZE = 2;
              var offsetX = Math.floor(bounds[0]);
              var offsetY = Math.floor(bounds[1]);
              var boundsWidth = Math.ceil(bounds[2]) - offsetX;
              var boundsHeight = Math.ceil(bounds[3]) - offsetY;
              var width = Math.min(Math.ceil(Math.abs(boundsWidth * combinesScale[0] * EXPECTED_SCALE)), MAX_PATTERN_SIZE);
              var height = Math.min(Math.ceil(Math.abs(boundsHeight * combinesScale[1] * EXPECTED_SCALE)), MAX_PATTERN_SIZE);
              var scaleX = boundsWidth / width;
              var scaleY = boundsHeight / height;
              var context = {
                coords,
                colors,
                offsetX: -offsetX,
                offsetY: -offsetY,
                scaleX: 1 / scaleX,
                scaleY: 1 / scaleY
              };
              var paddedWidth = width + BORDER_SIZE * 2;
              var paddedHeight = height + BORDER_SIZE * 2;
              var canvas, tmpCanvas, i, ii;
              if (webGLContext.isEnabled) {
                canvas = webGLContext.drawFigures({
                  width,
                  height,
                  backgroundColor,
                  figures,
                  context
                });
                tmpCanvas = cachedCanvases.getCanvas("mesh", paddedWidth, paddedHeight, false);
                tmpCanvas.context.drawImage(canvas, BORDER_SIZE, BORDER_SIZE);
                canvas = tmpCanvas.canvas;
              } else {
                tmpCanvas = cachedCanvases.getCanvas("mesh", paddedWidth, paddedHeight, false);
                var tmpCtx = tmpCanvas.context;
                var data = tmpCtx.createImageData(width, height);
                if (backgroundColor) {
                  var bytes = data.data;
                  for (i = 0, ii = bytes.length; i < ii; i += 4) {
                    bytes[i] = backgroundColor[0];
                    bytes[i + 1] = backgroundColor[1];
                    bytes[i + 2] = backgroundColor[2];
                    bytes[i + 3] = 255;
                  }
                }
                for (i = 0; i < figures.length; i++) {
                  drawFigure(data, figures[i], context);
                }
                tmpCtx.putImageData(data, BORDER_SIZE, BORDER_SIZE);
                canvas = tmpCanvas.canvas;
              }
              return {
                canvas,
                offsetX: offsetX - BORDER_SIZE * scaleX,
                offsetY: offsetY - BORDER_SIZE * scaleY,
                scaleX,
                scaleY
              };
            }
            return createMeshCanvas2;
          }();
          ShadingIRs.Mesh = {
            fromIR: function Mesh_fromIR(raw) {
              var coords = raw[2];
              var colors = raw[3];
              var figures = raw[4];
              var bounds = raw[5];
              var matrix = raw[6];
              var background = raw[8];
              return {
                type: "Pattern",
                getPattern: function Mesh_getPattern(ctx, owner, shadingFill) {
                  var scale;
                  if (shadingFill) {
                    scale = _util.Util.singularValueDecompose2dScale(ctx.mozCurrentTransform);
                  } else {
                    scale = _util.Util.singularValueDecompose2dScale(owner.baseTransform);
                    if (matrix) {
                      var matrixScale = _util.Util.singularValueDecompose2dScale(matrix);
                      scale = [scale[0] * matrixScale[0], scale[1] * matrixScale[1]];
                    }
                  }
                  var temporaryPatternCanvas = createMeshCanvas(bounds, scale, coords, colors, figures, shadingFill ? null : background, owner.cachedCanvases, owner.webGLContext);
                  if (!shadingFill) {
                    ctx.setTransform.apply(ctx, owner.baseTransform);
                    if (matrix) {
                      ctx.transform.apply(ctx, matrix);
                    }
                  }
                  ctx.translate(temporaryPatternCanvas.offsetX, temporaryPatternCanvas.offsetY);
                  ctx.scale(temporaryPatternCanvas.scaleX, temporaryPatternCanvas.scaleY);
                  return ctx.createPattern(temporaryPatternCanvas.canvas, "no-repeat");
                }
              };
            }
          };
          ShadingIRs.Dummy = {
            fromIR: function Dummy_fromIR() {
              return {
                type: "Pattern",
                getPattern: function Dummy_fromIR_getPattern() {
                  return "hotpink";
                }
              };
            }
          };
          function getShadingPatternFromIR(raw) {
            var shadingIR = ShadingIRs[raw[0]];
            {
              throw new Error("Unknown IR type: ".concat(raw[0]));
            }
            return shadingIR.fromIR(raw);
          }
          var TilingPattern = function TilingPatternClosure() {
            var PaintType = {
              COLORED: 1,
              UNCOLORED: 2
            };
            var MAX_PATTERN_SIZE = 3e3;
            function TilingPattern2(IR, color, ctx, canvasGraphicsFactory, baseTransform) {
              this.operatorList = IR[2];
              this.matrix = IR[3] || [1, 0, 0, 1, 0, 0];
              this.bbox = IR[4];
              this.xstep = IR[5];
              this.ystep = IR[6];
              this.paintType = IR[7];
              this.tilingType = IR[8];
              this.color = color;
              this.canvasGraphicsFactory = canvasGraphicsFactory;
              this.baseTransform = baseTransform;
              this.type = "Pattern";
              this.ctx = ctx;
            }
            TilingPattern2.prototype = {
              createPatternCanvas: function TilinPattern_createPatternCanvas(owner) {
                var operatorList = this.operatorList;
                var bbox = this.bbox;
                var xstep = this.xstep;
                var ystep = this.ystep;
                var paintType = this.paintType;
                var tilingType = this.tilingType;
                var color = this.color;
                var canvasGraphicsFactory = this.canvasGraphicsFactory;
                (0, _util.info)("TilingType: " + tilingType);
                var x0 = bbox[0], y0 = bbox[1], x1 = bbox[2], y1 = bbox[3];
                var topLeft = [x0, y0];
                var botRight = [x0 + xstep, y0 + ystep];
                var width = botRight[0] - topLeft[0];
                var height = botRight[1] - topLeft[1];
                var matrixScale = _util.Util.singularValueDecompose2dScale(this.matrix);
                var curMatrixScale = _util.Util.singularValueDecompose2dScale(this.baseTransform);
                var combinedScale = [matrixScale[0] * curMatrixScale[0], matrixScale[1] * curMatrixScale[1]];
                width = Math.min(Math.ceil(Math.abs(width * combinedScale[0])), MAX_PATTERN_SIZE);
                height = Math.min(Math.ceil(Math.abs(height * combinedScale[1])), MAX_PATTERN_SIZE);
                var tmpCanvas = owner.cachedCanvases.getCanvas("pattern", width, height, true);
                var tmpCtx = tmpCanvas.context;
                var graphics = canvasGraphicsFactory.createCanvasGraphics(tmpCtx);
                graphics.groupLevel = owner.groupLevel;
                this.setFillAndStrokeStyleToContext(graphics, paintType, color);
                this.setScale(width, height, xstep, ystep);
                this.transformToScale(graphics);
                var tmpTranslate = [1, 0, 0, 1, -topLeft[0], -topLeft[1]];
                graphics.transform.apply(graphics, tmpTranslate);
                this.clipBbox(graphics, bbox, x0, y0, x1, y1);
                graphics.executeOperatorList(operatorList);
                return tmpCanvas.canvas;
              },
              setScale: function TilingPattern_setScale(width, height, xstep, ystep) {
                this.scale = [width / xstep, height / ystep];
              },
              transformToScale: function TilingPattern_transformToScale(graphics) {
                var scale = this.scale;
                var tmpScale = [scale[0], 0, 0, scale[1], 0, 0];
                graphics.transform.apply(graphics, tmpScale);
              },
              scaleToContext: function TilingPattern_scaleToContext() {
                var scale = this.scale;
                this.ctx.scale(1 / scale[0], 1 / scale[1]);
              },
              clipBbox: function clipBbox(graphics, bbox, x0, y0, x1, y1) {
                if (Array.isArray(bbox) && bbox.length === 4) {
                  var bboxWidth = x1 - x0;
                  var bboxHeight = y1 - y0;
                  graphics.ctx.rect(x0, y0, bboxWidth, bboxHeight);
                  graphics.clip();
                  graphics.endPath();
                }
              },
              setFillAndStrokeStyleToContext: function setFillAndStrokeStyleToContext(graphics, paintType, color) {
                var context = graphics.ctx, current = graphics.current;
                switch (paintType) {
                  case PaintType.COLORED:
                    var ctx = this.ctx;
                    context.fillStyle = ctx.fillStyle;
                    context.strokeStyle = ctx.strokeStyle;
                    current.fillColor = ctx.fillStyle;
                    current.strokeColor = ctx.strokeStyle;
                    break;
                  case PaintType.UNCOLORED:
                    var cssColor = _util.Util.makeCssRgb(color[0], color[1], color[2]);
                    context.fillStyle = cssColor;
                    context.strokeStyle = cssColor;
                    current.fillColor = cssColor;
                    current.strokeColor = cssColor;
                    break;
                  default:
                    throw new _util.FormatError("Unsupported paint type: ".concat(paintType));
                }
              },
              getPattern: function TilingPattern_getPattern(ctx, owner) {
                var temporaryPatternCanvas = this.createPatternCanvas(owner);
                ctx = this.ctx;
                ctx.setTransform.apply(ctx, this.baseTransform);
                ctx.transform.apply(ctx, this.matrix);
                this.scaleToContext();
                return ctx.createPattern(temporaryPatternCanvas, "repeat");
              }
            };
            return TilingPattern2;
          }();
          exports2.TilingPattern = TilingPattern;
        },
        /* 156 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.GlobalWorkerOptions = void 0;
          var GlobalWorkerOptions = /* @__PURE__ */ Object.create(null);
          exports2.GlobalWorkerOptions = GlobalWorkerOptions;
          GlobalWorkerOptions.workerPort = GlobalWorkerOptions.workerPort === void 0 ? null : GlobalWorkerOptions.workerPort;
          GlobalWorkerOptions.workerSrc = GlobalWorkerOptions.workerSrc === void 0 ? "" : GlobalWorkerOptions.workerSrc;
        },
        /* 157 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.MessageHandler = MessageHandler;
          var _regenerator = _interopRequireDefault(__w_pdfjs_require__(147));
          var _util = __w_pdfjs_require__(1);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _typeof(obj) {
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
              _typeof = function _typeof2(obj2) {
                return typeof obj2;
              };
            } else {
              _typeof = function _typeof2(obj2) {
                return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
              };
            }
            return _typeof(obj);
          }
          function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
            try {
              var info = gen[key](arg);
              var value = info.value;
            } catch (error2) {
              reject(error2);
              return;
            }
            if (info.done) {
              resolve(value);
            } else {
              Promise.resolve(value).then(_next, _throw);
            }
          }
          function _asyncToGenerator(fn) {
            return function() {
              var self2 = this, args = arguments;
              return new Promise(function(resolve, reject) {
                var gen = fn.apply(self2, args);
                function _next(value) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                }
                function _throw(err) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                }
                _next(void 0);
              });
            };
          }
          function resolveCall(_x, _x2) {
            return _resolveCall.apply(this, arguments);
          }
          function _resolveCall() {
            _resolveCall = _asyncToGenerator(
              _regenerator.default.mark(function _callee(fn, args) {
                var thisArg, _args = arguments;
                return _regenerator.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        thisArg = _args.length > 2 && _args[2] !== void 0 ? _args[2] : null;
                        if (fn) {
                          _context.next = 3;
                          break;
                        }
                        return _context.abrupt("return");
                      case 3:
                        return _context.abrupt("return", fn.apply(thisArg, args));
                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              })
            );
            return _resolveCall.apply(this, arguments);
          }
          function wrapReason(reason) {
            if (_typeof(reason) !== "object") {
              return reason;
            }
            switch (reason.name) {
              case "AbortException":
                return new _util.AbortException(reason.message);
              case "MissingPDFException":
                return new _util.MissingPDFException(reason.message);
              case "UnexpectedResponseException":
                return new _util.UnexpectedResponseException(reason.message, reason.status);
              default:
                return new _util.UnknownErrorException(reason.message, reason.details);
            }
          }
          function makeReasonSerializable(reason) {
            if (!(reason instanceof Error) || reason instanceof _util.AbortException || reason instanceof _util.MissingPDFException || reason instanceof _util.UnexpectedResponseException || reason instanceof _util.UnknownErrorException) {
              return reason;
            }
            return new _util.UnknownErrorException(reason.message, reason.toString());
          }
          function resolveOrReject(capability, success, reason) {
            if (success) {
              capability.resolve();
            } else {
              capability.reject(reason);
            }
          }
          function finalize(promise) {
            return Promise.resolve(promise).catch(function() {
            });
          }
          function MessageHandler(sourceName, targetName, comObj) {
            var _this = this;
            this.sourceName = sourceName;
            this.targetName = targetName;
            this.comObj = comObj;
            this.callbackId = 1;
            this.streamId = 1;
            this.postMessageTransfers = true;
            this.streamSinks = /* @__PURE__ */ Object.create(null);
            this.streamControllers = /* @__PURE__ */ Object.create(null);
            var callbacksCapabilities = this.callbacksCapabilities = /* @__PURE__ */ Object.create(null);
            var ah = this.actionHandler = /* @__PURE__ */ Object.create(null);
            this._onComObjOnMessage = function(event) {
              var data = event.data;
              if (data.targetName !== _this.sourceName) {
                return;
              }
              if (data.stream) {
                _this._processStreamMessage(data);
              } else if (data.isReply) {
                var callbackId = data.callbackId;
                if (data.callbackId in callbacksCapabilities) {
                  var callback = callbacksCapabilities[callbackId];
                  delete callbacksCapabilities[callbackId];
                  if ("error" in data) {
                    callback.reject(wrapReason(data.error));
                  } else {
                    callback.resolve(data.data);
                  }
                } else {
                  throw new Error("Cannot resolve callback ".concat(callbackId));
                }
              } else if (data.action in ah) {
                var action = ah[data.action];
                if (data.callbackId) {
                  var _sourceName = _this.sourceName;
                  var _targetName = data.sourceName;
                  Promise.resolve().then(function() {
                    return action[0].call(action[1], data.data);
                  }).then(function(result) {
                    comObj.postMessage({
                      sourceName: _sourceName,
                      targetName: _targetName,
                      isReply: true,
                      callbackId: data.callbackId,
                      data: result
                    });
                  }, function(reason) {
                    comObj.postMessage({
                      sourceName: _sourceName,
                      targetName: _targetName,
                      isReply: true,
                      callbackId: data.callbackId,
                      error: makeReasonSerializable(reason)
                    });
                  });
                } else if (data.streamId) {
                  _this._createStreamSink(data);
                } else {
                  action[0].call(action[1], data.data);
                }
              } else {
                throw new Error("Unknown action from worker: ".concat(data.action));
              }
            };
            comObj.addEventListener("message", this._onComObjOnMessage);
          }
          MessageHandler.prototype = {
            on: function on$$1(actionName, handler, scope) {
              var ah = this.actionHandler;
              if (ah[actionName]) {
                throw new Error('There is already an actionName called "'.concat(actionName, '"'));
              }
              ah[actionName] = [handler, scope];
            },
            send: function send(actionName, data, transfers) {
              var message = {
                sourceName: this.sourceName,
                targetName: this.targetName,
                action: actionName,
                data
              };
              this.postMessage(message, transfers);
            },
            sendWithPromise: function sendWithPromise(actionName, data, transfers) {
              var callbackId = this.callbackId++;
              var message = {
                sourceName: this.sourceName,
                targetName: this.targetName,
                action: actionName,
                data,
                callbackId
              };
              var capability = (0, _util.createPromiseCapability)();
              this.callbacksCapabilities[callbackId] = capability;
              try {
                this.postMessage(message, transfers);
              } catch (e) {
                capability.reject(e);
              }
              return capability.promise;
            },
            sendWithStream: function sendWithStream(actionName, data, queueingStrategy, transfers) {
              var _this2 = this;
              var streamId = this.streamId++;
              var sourceName = this.sourceName;
              var targetName = this.targetName;
              return new _util.ReadableStream({
                start: function start(controller) {
                  var startCapability = (0, _util.createPromiseCapability)();
                  _this2.streamControllers[streamId] = {
                    controller,
                    startCall: startCapability,
                    isClosed: false
                  };
                  _this2.postMessage({
                    sourceName,
                    targetName,
                    action: actionName,
                    streamId,
                    data,
                    desiredSize: controller.desiredSize
                  });
                  return startCapability.promise;
                },
                pull: function pull(controller) {
                  var pullCapability = (0, _util.createPromiseCapability)();
                  _this2.streamControllers[streamId].pullCall = pullCapability;
                  _this2.postMessage({
                    sourceName,
                    targetName,
                    stream: "pull",
                    streamId,
                    desiredSize: controller.desiredSize
                  });
                  return pullCapability.promise;
                },
                cancel: function cancel(reason) {
                  var cancelCapability = (0, _util.createPromiseCapability)();
                  _this2.streamControllers[streamId].cancelCall = cancelCapability;
                  _this2.streamControllers[streamId].isClosed = true;
                  _this2.postMessage({
                    sourceName,
                    targetName,
                    stream: "cancel",
                    reason,
                    streamId
                  });
                  return cancelCapability.promise;
                }
              }, queueingStrategy);
            },
            _createStreamSink: function _createStreamSink(data) {
              var _this3 = this;
              var self2 = this;
              var action = this.actionHandler[data.action];
              var streamId = data.streamId;
              var desiredSize = data.desiredSize;
              var sourceName = this.sourceName;
              var targetName = data.sourceName;
              var capability = (0, _util.createPromiseCapability)();
              var sendStreamRequest = function sendStreamRequest2(_ref) {
                var stream = _ref.stream, chunk = _ref.chunk, transfers = _ref.transfers, success = _ref.success, reason = _ref.reason;
                _this3.postMessage({
                  sourceName,
                  targetName,
                  stream,
                  streamId,
                  chunk,
                  success,
                  reason
                }, transfers);
              };
              var streamSink = {
                enqueue: function enqueue(chunk) {
                  var size = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
                  var transfers = arguments.length > 2 ? arguments[2] : void 0;
                  if (this.isCancelled) {
                    return;
                  }
                  var lastDesiredSize = this.desiredSize;
                  this.desiredSize -= size;
                  if (lastDesiredSize > 0 && this.desiredSize <= 0) {
                    this.sinkCapability = (0, _util.createPromiseCapability)();
                    this.ready = this.sinkCapability.promise;
                  }
                  sendStreamRequest({
                    stream: "enqueue",
                    chunk,
                    transfers
                  });
                },
                close: function close() {
                  if (this.isCancelled) {
                    return;
                  }
                  this.isCancelled = true;
                  sendStreamRequest({
                    stream: "close"
                  });
                  delete self2.streamSinks[streamId];
                },
                error: function error2(reason) {
                  if (this.isCancelled) {
                    return;
                  }
                  this.isCancelled = true;
                  sendStreamRequest({
                    stream: "error",
                    reason
                  });
                },
                sinkCapability: capability,
                onPull: null,
                onCancel: null,
                isCancelled: false,
                desiredSize,
                ready: null
              };
              streamSink.sinkCapability.resolve();
              streamSink.ready = streamSink.sinkCapability.promise;
              this.streamSinks[streamId] = streamSink;
              resolveCall(action[0], [data.data, streamSink], action[1]).then(function() {
                sendStreamRequest({
                  stream: "start_complete",
                  success: true
                });
              }, function(reason) {
                sendStreamRequest({
                  stream: "start_complete",
                  success: false,
                  reason
                });
              });
            },
            _processStreamMessage: function _processStreamMessage(data) {
              var _this4 = this;
              var sourceName = this.sourceName;
              var targetName = data.sourceName;
              var streamId = data.streamId;
              var sendStreamResponse = function sendStreamResponse2(_ref2) {
                var stream = _ref2.stream, success = _ref2.success, reason = _ref2.reason;
                _this4.comObj.postMessage({
                  sourceName,
                  targetName,
                  stream,
                  success,
                  streamId,
                  reason
                });
              };
              var deleteStreamController = function deleteStreamController2() {
                Promise.all([_this4.streamControllers[data.streamId].startCall, _this4.streamControllers[data.streamId].pullCall, _this4.streamControllers[data.streamId].cancelCall].map(function(capability) {
                  return capability && finalize(capability.promise);
                })).then(function() {
                  delete _this4.streamControllers[data.streamId];
                });
              };
              switch (data.stream) {
                case "start_complete":
                  resolveOrReject(this.streamControllers[data.streamId].startCall, data.success, wrapReason(data.reason));
                  break;
                case "pull_complete":
                  resolveOrReject(this.streamControllers[data.streamId].pullCall, data.success, wrapReason(data.reason));
                  break;
                case "pull":
                  if (!this.streamSinks[data.streamId]) {
                    sendStreamResponse({
                      stream: "pull_complete",
                      success: true
                    });
                    break;
                  }
                  if (this.streamSinks[data.streamId].desiredSize <= 0 && data.desiredSize > 0) {
                    this.streamSinks[data.streamId].sinkCapability.resolve();
                  }
                  this.streamSinks[data.streamId].desiredSize = data.desiredSize;
                  resolveCall(this.streamSinks[data.streamId].onPull).then(function() {
                    sendStreamResponse({
                      stream: "pull_complete",
                      success: true
                    });
                  }, function(reason) {
                    sendStreamResponse({
                      stream: "pull_complete",
                      success: false,
                      reason
                    });
                  });
                  break;
                case "enqueue":
                  (0, _util.assert)(this.streamControllers[data.streamId], "enqueue should have stream controller");
                  if (!this.streamControllers[data.streamId].isClosed) {
                    this.streamControllers[data.streamId].controller.enqueue(data.chunk);
                  }
                  break;
                case "close":
                  (0, _util.assert)(this.streamControllers[data.streamId], "close should have stream controller");
                  if (this.streamControllers[data.streamId].isClosed) {
                    break;
                  }
                  this.streamControllers[data.streamId].isClosed = true;
                  this.streamControllers[data.streamId].controller.close();
                  deleteStreamController();
                  break;
                case "error":
                  (0, _util.assert)(this.streamControllers[data.streamId], "error should have stream controller");
                  this.streamControllers[data.streamId].controller.error(wrapReason(data.reason));
                  deleteStreamController();
                  break;
                case "cancel_complete":
                  resolveOrReject(this.streamControllers[data.streamId].cancelCall, data.success, wrapReason(data.reason));
                  deleteStreamController();
                  break;
                case "cancel":
                  if (!this.streamSinks[data.streamId]) {
                    break;
                  }
                  resolveCall(this.streamSinks[data.streamId].onCancel, [wrapReason(data.reason)]).then(function() {
                    sendStreamResponse({
                      stream: "cancel_complete",
                      success: true
                    });
                  }, function(reason) {
                    sendStreamResponse({
                      stream: "cancel_complete",
                      success: false,
                      reason
                    });
                  });
                  this.streamSinks[data.streamId].sinkCapability.reject(wrapReason(data.reason));
                  this.streamSinks[data.streamId].isCancelled = true;
                  delete this.streamSinks[data.streamId];
                  break;
                default:
                  throw new Error("Unexpected stream case");
              }
            },
            postMessage: function postMessage2(message, transfers) {
              if (transfers && this.postMessageTransfers) {
                this.comObj.postMessage(message, transfers);
              } else {
                this.comObj.postMessage(message);
              }
            },
            destroy: function destroy() {
              this.comObj.removeEventListener("message", this._onComObjOnMessage);
            }
          };
        },
        /* 158 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.Metadata = void 0;
          var _util = __w_pdfjs_require__(1);
          var _xml_parser = __w_pdfjs_require__(159);
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            return Constructor;
          }
          var Metadata = function() {
            function Metadata2(data) {
              _classCallCheck(this, Metadata2);
              (0, _util.assert)(typeof data === "string", "Metadata: input is not a string");
              data = this._repair(data);
              var parser = new _xml_parser.SimpleXMLParser();
              var xmlDocument = parser.parseFromString(data);
              this._metadata = /* @__PURE__ */ Object.create(null);
              if (xmlDocument) {
                this._parse(xmlDocument);
              }
            }
            _createClass(Metadata2, [{
              key: "_repair",
              value: function _repair(data) {
                return data.replace(/^([^<]+)/, "").replace(/>\\376\\377([^<]+)/g, function(all, codes) {
                  var bytes = codes.replace(/\\([0-3])([0-7])([0-7])/g, function(code2, d1, d2, d3) {
                    return String.fromCharCode(d1 * 64 + d2 * 8 + d3 * 1);
                  }).replace(/&(amp|apos|gt|lt|quot);/g, function(str, name) {
                    switch (name) {
                      case "amp":
                        return "&";
                      case "apos":
                        return "'";
                      case "gt":
                        return ">";
                      case "lt":
                        return "<";
                      case "quot":
                        return '"';
                    }
                    throw new Error("_repair: ".concat(name, " isn't defined."));
                  });
                  var chars = "";
                  for (var i = 0, ii = bytes.length; i < ii; i += 2) {
                    var code = bytes.charCodeAt(i) * 256 + bytes.charCodeAt(i + 1);
                    if (code >= 32 && code < 127 && code !== 60 && code !== 62 && code !== 38) {
                      chars += String.fromCharCode(code);
                    } else {
                      chars += "&#x" + (65536 + code).toString(16).substring(1) + ";";
                    }
                  }
                  return ">" + chars;
                });
              }
            }, {
              key: "_parse",
              value: function _parse(xmlDocument) {
                var rdf = xmlDocument.documentElement;
                if (rdf.nodeName.toLowerCase() !== "rdf:rdf") {
                  rdf = rdf.firstChild;
                  while (rdf && rdf.nodeName.toLowerCase() !== "rdf:rdf") {
                    rdf = rdf.nextSibling;
                  }
                }
                var nodeName = rdf ? rdf.nodeName.toLowerCase() : null;
                if (!rdf || nodeName !== "rdf:rdf" || !rdf.hasChildNodes()) {
                  return;
                }
                var children = rdf.childNodes;
                for (var i = 0, ii = children.length; i < ii; i++) {
                  var desc = children[i];
                  if (desc.nodeName.toLowerCase() !== "rdf:description") {
                    continue;
                  }
                  for (var j = 0, jj = desc.childNodes.length; j < jj; j++) {
                    if (desc.childNodes[j].nodeName.toLowerCase() !== "#text") {
                      var entry = desc.childNodes[j];
                      var name = entry.nodeName.toLowerCase();
                      this._metadata[name] = entry.textContent.trim();
                    }
                  }
                }
              }
            }, {
              key: "get",
              value: function get(name) {
                var data = this._metadata[name];
                return typeof data !== "undefined" ? data : null;
              }
            }, {
              key: "getAll",
              value: function getAll() {
                return this._metadata;
              }
            }, {
              key: "has",
              value: function has(name) {
                return typeof this._metadata[name] !== "undefined";
              }
            }]);
            return Metadata2;
          }();
          exports2.Metadata = Metadata;
        },
        /* 159 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.SimpleXMLParser = void 0;
          function _typeof(obj) {
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
              _typeof = function _typeof2(obj2) {
                return typeof obj2;
              };
            } else {
              _typeof = function _typeof2(obj2) {
                return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
              };
            }
            return _typeof(obj);
          }
          function _slicedToArray(arr, i) {
            return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
          }
          function _nonIterableRest() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
          }
          function _iterableToArrayLimit(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = void 0;
            try {
              for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);
                if (i && _arr.length === i)
                  break;
              }
            } catch (err) {
              _d = true;
              _e = err;
            } finally {
              try {
                if (!_n && _i["return"] != null)
                  _i["return"]();
              } finally {
                if (_d)
                  throw _e;
              }
            }
            return _arr;
          }
          function _arrayWithHoles(arr) {
            if (Array.isArray(arr))
              return arr;
          }
          function _possibleConstructorReturn(self2, call) {
            if (call && (_typeof(call) === "object" || typeof call === "function")) {
              return call;
            }
            return _assertThisInitialized(self2);
          }
          function _assertThisInitialized(self2) {
            if (self2 === void 0) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self2;
          }
          function _get(target, property, receiver) {
            if (typeof Reflect !== "undefined" && Reflect.get) {
              _get = Reflect.get;
            } else {
              _get = function _get2(target2, property2, receiver2) {
                var base2 = _superPropBase(target2, property2);
                if (!base2)
                  return;
                var desc = Object.getOwnPropertyDescriptor(base2, property2);
                if (desc.get) {
                  return desc.get.call(receiver2);
                }
                return desc.value;
              };
            }
            return _get(target, property, receiver || target);
          }
          function _superPropBase(object, property) {
            while (!Object.prototype.hasOwnProperty.call(object, property)) {
              object = _getPrototypeOf(object);
              if (object === null)
                break;
            }
            return object;
          }
          function _getPrototypeOf(o2) {
            _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o3) {
              return o3.__proto__ || Object.getPrototypeOf(o3);
            };
            return _getPrototypeOf(o2);
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass)
              _setPrototypeOf(subClass, superClass);
          }
          function _setPrototypeOf(o2, p) {
            _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o3, p2) {
              o3.__proto__ = p2;
              return o3;
            };
            return _setPrototypeOf(o2, p);
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            return Constructor;
          }
          var XMLParserErrorCode = {
            NoError: 0,
            EndOfDocument: -1,
            UnterminatedCdat: -2,
            UnterminatedXmlDeclaration: -3,
            UnterminatedDoctypeDeclaration: -4,
            UnterminatedComment: -5,
            MalformedElement: -6,
            OutOfMemory: -7,
            UnterminatedAttributeValue: -8,
            UnterminatedElement: -9,
            ElementNeverBegun: -10
          };
          function isWhitespace(s, index) {
            var ch = s[index];
            return ch === " " || ch === "\n" || ch === "\r" || ch === "	";
          }
          function isWhitespaceString(s) {
            for (var i = 0, ii = s.length; i < ii; i++) {
              if (!isWhitespace(s, i)) {
                return false;
              }
            }
            return true;
          }
          var XMLParserBase = function() {
            function XMLParserBase2() {
              _classCallCheck(this, XMLParserBase2);
            }
            _createClass(XMLParserBase2, [{
              key: "_resolveEntities",
              value: function _resolveEntities(s) {
                var _this = this;
                return s.replace(/&([^;]+);/g, function(all, entity) {
                  if (entity.substring(0, 2) === "#x") {
                    return String.fromCharCode(parseInt(entity.substring(2), 16));
                  } else if (entity.substring(0, 1) === "#") {
                    return String.fromCharCode(parseInt(entity.substring(1), 10));
                  }
                  switch (entity) {
                    case "lt":
                      return "<";
                    case "gt":
                      return ">";
                    case "amp":
                      return "&";
                    case "quot":
                      return '"';
                  }
                  return _this.onResolveEntity(entity);
                });
              }
            }, {
              key: "_parseContent",
              value: function _parseContent(s, start) {
                var pos = start, name, attributes = [];
                function skipWs() {
                  while (pos < s.length && isWhitespace(s, pos)) {
                    ++pos;
                  }
                }
                while (pos < s.length && !isWhitespace(s, pos) && s[pos] !== ">" && s[pos] !== "/") {
                  ++pos;
                }
                name = s.substring(start, pos);
                skipWs();
                while (pos < s.length && s[pos] !== ">" && s[pos] !== "/" && s[pos] !== "?") {
                  skipWs();
                  var attrName = "", attrValue = "";
                  while (pos < s.length && !isWhitespace(s, pos) && s[pos] !== "=") {
                    attrName += s[pos];
                    ++pos;
                  }
                  skipWs();
                  if (s[pos] !== "=") {
                    return null;
                  }
                  ++pos;
                  skipWs();
                  var attrEndChar = s[pos];
                  if (attrEndChar !== '"' && attrEndChar !== "'") {
                    return null;
                  }
                  var attrEndIndex = s.indexOf(attrEndChar, ++pos);
                  if (attrEndIndex < 0) {
                    return null;
                  }
                  attrValue = s.substring(pos, attrEndIndex);
                  attributes.push({
                    name: attrName,
                    value: this._resolveEntities(attrValue)
                  });
                  pos = attrEndIndex + 1;
                  skipWs();
                }
                return {
                  name,
                  attributes,
                  parsed: pos - start
                };
              }
            }, {
              key: "_parseProcessingInstruction",
              value: function _parseProcessingInstruction(s, start) {
                var pos = start, name, value;
                function skipWs() {
                  while (pos < s.length && isWhitespace(s, pos)) {
                    ++pos;
                  }
                }
                while (pos < s.length && !isWhitespace(s, pos) && s[pos] !== ">" && s[pos] !== "/") {
                  ++pos;
                }
                name = s.substring(start, pos);
                skipWs();
                var attrStart = pos;
                while (pos < s.length && (s[pos] !== "?" || s[pos + 1] !== ">")) {
                  ++pos;
                }
                value = s.substring(attrStart, pos);
                return {
                  name,
                  value,
                  parsed: pos - start
                };
              }
            }, {
              key: "parseXml",
              value: function parseXml(s) {
                var i = 0;
                while (i < s.length) {
                  var ch = s[i];
                  var j = i;
                  if (ch === "<") {
                    ++j;
                    var ch2 = s[j];
                    var q = void 0;
                    switch (ch2) {
                      case "/":
                        ++j;
                        q = s.indexOf(">", j);
                        if (q < 0) {
                          this.onError(XMLParserErrorCode.UnterminatedElement);
                          return;
                        }
                        this.onEndElement(s.substring(j, q));
                        j = q + 1;
                        break;
                      case "?":
                        ++j;
                        var pi = this._parseProcessingInstruction(s, j);
                        if (s.substring(j + pi.parsed, j + pi.parsed + 2) !== "?>") {
                          this.onError(XMLParserErrorCode.UnterminatedXmlDeclaration);
                          return;
                        }
                        this.onPi(pi.name, pi.value);
                        j += pi.parsed + 2;
                        break;
                      case "!":
                        if (s.substring(j + 1, j + 3) === "--") {
                          q = s.indexOf("-->", j + 3);
                          if (q < 0) {
                            this.onError(XMLParserErrorCode.UnterminatedComment);
                            return;
                          }
                          this.onComment(s.substring(j + 3, q));
                          j = q + 3;
                        } else if (s.substring(j + 1, j + 8) === "[CDATA[") {
                          q = s.indexOf("]]>", j + 8);
                          if (q < 0) {
                            this.onError(XMLParserErrorCode.UnterminatedCdat);
                            return;
                          }
                          this.onCdata(s.substring(j + 8, q));
                          j = q + 3;
                        } else if (s.substring(j + 1, j + 8) === "DOCTYPE") {
                          var q2 = s.indexOf("[", j + 8);
                          var complexDoctype = false;
                          q = s.indexOf(">", j + 8);
                          if (q < 0) {
                            this.onError(XMLParserErrorCode.UnterminatedDoctypeDeclaration);
                            return;
                          }
                          if (q2 > 0 && q > q2) {
                            q = s.indexOf("]>", j + 8);
                            if (q < 0) {
                              this.onError(XMLParserErrorCode.UnterminatedDoctypeDeclaration);
                              return;
                            }
                            complexDoctype = true;
                          }
                          var doctypeContent = s.substring(j + 8, q + (complexDoctype ? 1 : 0));
                          this.onDoctype(doctypeContent);
                          j = q + (complexDoctype ? 2 : 1);
                        } else {
                          this.onError(XMLParserErrorCode.MalformedElement);
                          return;
                        }
                        break;
                      default:
                        var content = this._parseContent(s, j);
                        if (content === null) {
                          this.onError(XMLParserErrorCode.MalformedElement);
                          return;
                        }
                        var isClosed = false;
                        if (s.substring(j + content.parsed, j + content.parsed + 2) === "/>") {
                          isClosed = true;
                        } else if (s.substring(j + content.parsed, j + content.parsed + 1) !== ">") {
                          this.onError(XMLParserErrorCode.UnterminatedElement);
                          return;
                        }
                        this.onBeginElement(content.name, content.attributes, isClosed);
                        j += content.parsed + (isClosed ? 2 : 1);
                        break;
                    }
                  } else {
                    while (j < s.length && s[j] !== "<") {
                      j++;
                    }
                    var text = s.substring(i, j);
                    this.onText(this._resolveEntities(text));
                  }
                  i = j;
                }
              }
            }, {
              key: "onResolveEntity",
              value: function onResolveEntity(name) {
                return "&".concat(name, ";");
              }
            }, {
              key: "onPi",
              value: function onPi(name, value) {
              }
            }, {
              key: "onComment",
              value: function onComment(text) {
              }
            }, {
              key: "onCdata",
              value: function onCdata(text) {
              }
            }, {
              key: "onDoctype",
              value: function onDoctype(doctypeContent) {
              }
            }, {
              key: "onText",
              value: function onText(text) {
              }
            }, {
              key: "onBeginElement",
              value: function onBeginElement(name, attributes, isEmpty) {
              }
            }, {
              key: "onEndElement",
              value: function onEndElement(name) {
              }
            }, {
              key: "onError",
              value: function onError(code) {
              }
            }]);
            return XMLParserBase2;
          }();
          var SimpleDOMNode = function() {
            function SimpleDOMNode2(nodeName, nodeValue) {
              _classCallCheck(this, SimpleDOMNode2);
              this.nodeName = nodeName;
              this.nodeValue = nodeValue;
              Object.defineProperty(this, "parentNode", {
                value: null,
                writable: true
              });
            }
            _createClass(SimpleDOMNode2, [{
              key: "hasChildNodes",
              value: function hasChildNodes() {
                return this.childNodes && this.childNodes.length > 0;
              }
            }, {
              key: "firstChild",
              get: function get() {
                return this.childNodes && this.childNodes[0];
              }
            }, {
              key: "nextSibling",
              get: function get() {
                var childNodes = this.parentNode.childNodes;
                if (!childNodes) {
                  return void 0;
                }
                var index = childNodes.indexOf(this);
                if (index === -1) {
                  return void 0;
                }
                return childNodes[index + 1];
              }
            }, {
              key: "textContent",
              get: function get() {
                if (!this.childNodes) {
                  return this.nodeValue || "";
                }
                return this.childNodes.map(function(child) {
                  return child.textContent;
                }).join("");
              }
            }]);
            return SimpleDOMNode2;
          }();
          var SimpleXMLParser = function(_XMLParserBase) {
            _inherits(SimpleXMLParser2, _XMLParserBase);
            function SimpleXMLParser2() {
              var _this2;
              _classCallCheck(this, SimpleXMLParser2);
              _this2 = _possibleConstructorReturn(this, _getPrototypeOf(SimpleXMLParser2).call(this));
              _this2._currentFragment = null;
              _this2._stack = null;
              _this2._errorCode = XMLParserErrorCode.NoError;
              return _this2;
            }
            _createClass(SimpleXMLParser2, [{
              key: "parseFromString",
              value: function parseFromString(data) {
                this._currentFragment = [];
                this._stack = [];
                this._errorCode = XMLParserErrorCode.NoError;
                this.parseXml(data);
                if (this._errorCode !== XMLParserErrorCode.NoError) {
                  return void 0;
                }
                var _this$_currentFragmen = _slicedToArray(this._currentFragment, 1), documentElement = _this$_currentFragmen[0];
                if (!documentElement) {
                  return void 0;
                }
                return {
                  documentElement
                };
              }
            }, {
              key: "onResolveEntity",
              value: function onResolveEntity(name) {
                switch (name) {
                  case "apos":
                    return "'";
                }
                return _get(_getPrototypeOf(SimpleXMLParser2.prototype), "onResolveEntity", this).call(this, name);
              }
            }, {
              key: "onText",
              value: function onText(text) {
                if (isWhitespaceString(text)) {
                  return;
                }
                var node = new SimpleDOMNode("#text", text);
                this._currentFragment.push(node);
              }
            }, {
              key: "onCdata",
              value: function onCdata(text) {
                var node = new SimpleDOMNode("#text", text);
                this._currentFragment.push(node);
              }
            }, {
              key: "onBeginElement",
              value: function onBeginElement(name, attributes, isEmpty) {
                var node = new SimpleDOMNode(name);
                node.childNodes = [];
                this._currentFragment.push(node);
                if (isEmpty) {
                  return;
                }
                this._stack.push(this._currentFragment);
                this._currentFragment = node.childNodes;
              }
            }, {
              key: "onEndElement",
              value: function onEndElement(name) {
                this._currentFragment = this._stack.pop() || [];
                var lastElement = this._currentFragment[this._currentFragment.length - 1];
                if (!lastElement) {
                  return;
                }
                for (var i = 0, ii = lastElement.childNodes.length; i < ii; i++) {
                  lastElement.childNodes[i].parentNode = lastElement;
                }
              }
            }, {
              key: "onError",
              value: function onError(code) {
                this._errorCode = code;
              }
            }]);
            return SimpleXMLParser2;
          }(XMLParserBase);
          exports2.SimpleXMLParser = SimpleXMLParser;
        },
        /* 160 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.PDFDataTransportStream = void 0;
          var _regenerator = _interopRequireDefault(__w_pdfjs_require__(147));
          var _util = __w_pdfjs_require__(1);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
            try {
              var info = gen[key](arg);
              var value = info.value;
            } catch (error2) {
              reject(error2);
              return;
            }
            if (info.done) {
              resolve(value);
            } else {
              Promise.resolve(value).then(_next, _throw);
            }
          }
          function _asyncToGenerator(fn) {
            return function() {
              var self2 = this, args = arguments;
              return new Promise(function(resolve, reject) {
                var gen = fn.apply(self2, args);
                function _next(value) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                }
                function _throw(err) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                }
                _next(void 0);
              });
            };
          }
          var PDFDataTransportStream = function PDFDataTransportStreamClosure() {
            function PDFDataTransportStream2(params, pdfDataRangeTransport) {
              var _this = this;
              (0, _util.assert)(pdfDataRangeTransport);
              this._queuedChunks = [];
              var initialData = params.initialData;
              if (initialData && initialData.length > 0) {
                var buffer = new Uint8Array(initialData).buffer;
                this._queuedChunks.push(buffer);
              }
              this._pdfDataRangeTransport = pdfDataRangeTransport;
              this._isStreamingSupported = !params.disableStream;
              this._isRangeSupported = !params.disableRange;
              this._contentLength = params.length;
              this._fullRequestReader = null;
              this._rangeReaders = [];
              this._pdfDataRangeTransport.addRangeListener(function(begin, chunk) {
                _this._onReceiveData({
                  begin,
                  chunk
                });
              });
              this._pdfDataRangeTransport.addProgressListener(function(loaded) {
                _this._onProgress({
                  loaded
                });
              });
              this._pdfDataRangeTransport.addProgressiveReadListener(function(chunk) {
                _this._onReceiveData({
                  chunk
                });
              });
              this._pdfDataRangeTransport.transportReady();
            }
            PDFDataTransportStream2.prototype = {
              _onReceiveData: function PDFDataTransportStream_onReceiveData(args) {
                var buffer = new Uint8Array(args.chunk).buffer;
                if (args.begin === void 0) {
                  if (this._fullRequestReader) {
                    this._fullRequestReader._enqueue(buffer);
                  } else {
                    this._queuedChunks.push(buffer);
                  }
                } else {
                  var found = this._rangeReaders.some(function(rangeReader) {
                    if (rangeReader._begin !== args.begin) {
                      return false;
                    }
                    rangeReader._enqueue(buffer);
                    return true;
                  });
                  (0, _util.assert)(found);
                }
              },
              _onProgress: function PDFDataTransportStream_onDataProgress(evt) {
                if (this._rangeReaders.length > 0) {
                  var firstReader = this._rangeReaders[0];
                  if (firstReader.onProgress) {
                    firstReader.onProgress({
                      loaded: evt.loaded
                    });
                  }
                }
              },
              _removeRangeReader: function PDFDataTransportStream_removeRangeReader(reader) {
                var i = this._rangeReaders.indexOf(reader);
                if (i >= 0) {
                  this._rangeReaders.splice(i, 1);
                }
              },
              getFullReader: function PDFDataTransportStream_getFullReader() {
                (0, _util.assert)(!this._fullRequestReader);
                var queuedChunks = this._queuedChunks;
                this._queuedChunks = null;
                return new PDFDataTransportStreamReader(this, queuedChunks);
              },
              getRangeReader: function PDFDataTransportStream_getRangeReader(begin, end) {
                var reader = new PDFDataTransportStreamRangeReader(this, begin, end);
                this._pdfDataRangeTransport.requestDataRange(begin, end);
                this._rangeReaders.push(reader);
                return reader;
              },
              cancelAllRequests: function PDFDataTransportStream_cancelAllRequests(reason) {
                if (this._fullRequestReader) {
                  this._fullRequestReader.cancel(reason);
                }
                var readers = this._rangeReaders.slice(0);
                readers.forEach(function(rangeReader) {
                  rangeReader.cancel(reason);
                });
                this._pdfDataRangeTransport.abort();
              }
            };
            function PDFDataTransportStreamReader(stream, queuedChunks) {
              this._stream = stream;
              this._done = false;
              this._filename = null;
              this._queuedChunks = queuedChunks || [];
              this._requests = [];
              this._headersReady = Promise.resolve();
              stream._fullRequestReader = this;
              this.onProgress = null;
            }
            PDFDataTransportStreamReader.prototype = {
              _enqueue: function PDFDataTransportStreamReader_enqueue(chunk) {
                if (this._done) {
                  return;
                }
                if (this._requests.length > 0) {
                  var requestCapability = this._requests.shift();
                  requestCapability.resolve({
                    value: chunk,
                    done: false
                  });
                  return;
                }
                this._queuedChunks.push(chunk);
              },
              get headersReady() {
                return this._headersReady;
              },
              get filename() {
                return this._filename;
              },
              get isRangeSupported() {
                return this._stream._isRangeSupported;
              },
              get isStreamingSupported() {
                return this._stream._isStreamingSupported;
              },
              get contentLength() {
                return this._stream._contentLength;
              },
              read: function() {
                var _read = _asyncToGenerator(
                  _regenerator.default.mark(function _callee() {
                    var chunk, requestCapability;
                    return _regenerator.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            if (!(this._queuedChunks.length > 0)) {
                              _context.next = 3;
                              break;
                            }
                            chunk = this._queuedChunks.shift();
                            return _context.abrupt("return", {
                              value: chunk,
                              done: false
                            });
                          case 3:
                            if (!this._done) {
                              _context.next = 5;
                              break;
                            }
                            return _context.abrupt("return", {
                              value: void 0,
                              done: true
                            });
                          case 5:
                            requestCapability = (0, _util.createPromiseCapability)();
                            this._requests.push(requestCapability);
                            return _context.abrupt("return", requestCapability.promise);
                          case 8:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, this);
                  })
                );
                function read2() {
                  return _read.apply(this, arguments);
                }
                return read2;
              }(),
              cancel: function PDFDataTransportStreamReader_cancel(reason) {
                this._done = true;
                this._requests.forEach(function(requestCapability) {
                  requestCapability.resolve({
                    value: void 0,
                    done: true
                  });
                });
                this._requests = [];
              }
            };
            function PDFDataTransportStreamRangeReader(stream, begin, end) {
              this._stream = stream;
              this._begin = begin;
              this._end = end;
              this._queuedChunk = null;
              this._requests = [];
              this._done = false;
              this.onProgress = null;
            }
            PDFDataTransportStreamRangeReader.prototype = {
              _enqueue: function PDFDataTransportStreamRangeReader_enqueue(chunk) {
                if (this._done) {
                  return;
                }
                if (this._requests.length === 0) {
                  this._queuedChunk = chunk;
                } else {
                  var requestsCapability = this._requests.shift();
                  requestsCapability.resolve({
                    value: chunk,
                    done: false
                  });
                  this._requests.forEach(function(requestCapability) {
                    requestCapability.resolve({
                      value: void 0,
                      done: true
                    });
                  });
                  this._requests = [];
                }
                this._done = true;
                this._stream._removeRangeReader(this);
              },
              get isStreamingSupported() {
                return false;
              },
              read: function() {
                var _read2 = _asyncToGenerator(
                  _regenerator.default.mark(function _callee2() {
                    var chunk, requestCapability;
                    return _regenerator.default.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            if (!this._queuedChunk) {
                              _context2.next = 4;
                              break;
                            }
                            chunk = this._queuedChunk;
                            this._queuedChunk = null;
                            return _context2.abrupt("return", {
                              value: chunk,
                              done: false
                            });
                          case 4:
                            if (!this._done) {
                              _context2.next = 6;
                              break;
                            }
                            return _context2.abrupt("return", {
                              value: void 0,
                              done: true
                            });
                          case 6:
                            requestCapability = (0, _util.createPromiseCapability)();
                            this._requests.push(requestCapability);
                            return _context2.abrupt("return", requestCapability.promise);
                          case 9:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2, this);
                  })
                );
                function read2() {
                  return _read2.apply(this, arguments);
                }
                return read2;
              }(),
              cancel: function PDFDataTransportStreamRangeReader_cancel(reason) {
                this._done = true;
                this._requests.forEach(function(requestCapability) {
                  requestCapability.resolve({
                    value: void 0,
                    done: true
                  });
                });
                this._requests = [];
                this._stream._removeRangeReader(this);
              }
            };
            return PDFDataTransportStream2;
          }();
          exports2.PDFDataTransportStream = PDFDataTransportStream;
        },
        /* 161 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.WebGLContext = void 0;
          var _util = __w_pdfjs_require__(1);
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            return Constructor;
          }
          var WebGLContext = function() {
            function WebGLContext2(_ref) {
              var _ref$enable = _ref.enable, enable = _ref$enable === void 0 ? false : _ref$enable;
              _classCallCheck(this, WebGLContext2);
              this._enabled = enable === true;
            }
            _createClass(WebGLContext2, [{
              key: "composeSMask",
              value: function composeSMask(_ref2) {
                var layer = _ref2.layer, mask = _ref2.mask, properties = _ref2.properties;
                return WebGLUtils.composeSMask(layer, mask, properties);
              }
            }, {
              key: "drawFigures",
              value: function drawFigures(_ref3) {
                var width = _ref3.width, height = _ref3.height, backgroundColor = _ref3.backgroundColor, figures = _ref3.figures, context = _ref3.context;
                return WebGLUtils.drawFigures(width, height, backgroundColor, figures, context);
              }
            }, {
              key: "clear",
              value: function clear() {
                WebGLUtils.cleanup();
              }
            }, {
              key: "isEnabled",
              get: function get() {
                var enabled = this._enabled;
                if (enabled) {
                  enabled = WebGLUtils.tryInitGL();
                }
                return (0, _util.shadow)(this, "isEnabled", enabled);
              }
            }]);
            return WebGLContext2;
          }();
          exports2.WebGLContext = WebGLContext;
          var WebGLUtils = /* @__PURE__ */ function WebGLUtilsClosure() {
            function loadShader(gl, code, shaderType) {
              var shader = gl.createShader(shaderType);
              gl.shaderSource(shader, code);
              gl.compileShader(shader);
              var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
              if (!compiled) {
                var errorMsg = gl.getShaderInfoLog(shader);
                throw new Error("Error during shader compilation: " + errorMsg);
              }
              return shader;
            }
            function createVertexShader(gl, code) {
              return loadShader(gl, code, gl.VERTEX_SHADER);
            }
            function createFragmentShader(gl, code) {
              return loadShader(gl, code, gl.FRAGMENT_SHADER);
            }
            function createProgram(gl, shaders) {
              var program = gl.createProgram();
              for (var i = 0, ii = shaders.length; i < ii; ++i) {
                gl.attachShader(program, shaders[i]);
              }
              gl.linkProgram(program);
              var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
              if (!linked) {
                var errorMsg = gl.getProgramInfoLog(program);
                throw new Error("Error during program linking: " + errorMsg);
              }
              return program;
            }
            function createTexture(gl, image, textureId) {
              gl.activeTexture(textureId);
              var texture = gl.createTexture();
              gl.bindTexture(gl.TEXTURE_2D, texture);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
              return texture;
            }
            var currentGL, currentCanvas;
            function generateGL() {
              if (currentGL) {
                return;
              }
              currentCanvas = document.createElement("canvas");
              currentGL = currentCanvas.getContext("webgl", {
                premultipliedalpha: false
              });
            }
            var smaskVertexShaderCode = "  attribute vec2 a_position;                                      attribute vec2 a_texCoord;                                                                                                      uniform vec2 u_resolution;                                                                                                      varying vec2 v_texCoord;                                                                                                        void main() {                                                     vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;       gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);                                                                              v_texCoord = a_texCoord;                                      }                                                             ";
            var smaskFragmentShaderCode = "  precision mediump float;                                                                                                        uniform vec4 u_backdrop;                                        uniform int u_subtype;                                          uniform sampler2D u_image;                                      uniform sampler2D u_mask;                                                                                                       varying vec2 v_texCoord;                                                                                                        void main() {                                                     vec4 imageColor = texture2D(u_image, v_texCoord);               vec4 maskColor = texture2D(u_mask, v_texCoord);                 if (u_backdrop.a > 0.0) {                                         maskColor.rgb = maskColor.rgb * maskColor.a +                                   u_backdrop.rgb * (1.0 - maskColor.a);         }                                                               float lum;                                                      if (u_subtype == 0) {                                             lum = maskColor.a;                                            } else {                                                          lum = maskColor.r * 0.3 + maskColor.g * 0.59 +                        maskColor.b * 0.11;                                     }                                                               imageColor.a *= lum;                                            imageColor.rgb *= imageColor.a;                                 gl_FragColor = imageColor;                                    }                                                             ";
            var smaskCache = null;
            function initSmaskGL() {
              var canvas, gl;
              generateGL();
              canvas = currentCanvas;
              currentCanvas = null;
              gl = currentGL;
              currentGL = null;
              var vertexShader = createVertexShader(gl, smaskVertexShaderCode);
              var fragmentShader = createFragmentShader(gl, smaskFragmentShaderCode);
              var program = createProgram(gl, [vertexShader, fragmentShader]);
              gl.useProgram(program);
              var cache = {};
              cache.gl = gl;
              cache.canvas = canvas;
              cache.resolutionLocation = gl.getUniformLocation(program, "u_resolution");
              cache.positionLocation = gl.getAttribLocation(program, "a_position");
              cache.backdropLocation = gl.getUniformLocation(program, "u_backdrop");
              cache.subtypeLocation = gl.getUniformLocation(program, "u_subtype");
              var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
              var texLayerLocation = gl.getUniformLocation(program, "u_image");
              var texMaskLocation = gl.getUniformLocation(program, "u_mask");
              var texCoordBuffer = gl.createBuffer();
              gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
              gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);
              gl.enableVertexAttribArray(texCoordLocation);
              gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
              gl.uniform1i(texLayerLocation, 0);
              gl.uniform1i(texMaskLocation, 1);
              smaskCache = cache;
            }
            function composeSMask(layer, mask, properties) {
              var width = layer.width, height = layer.height;
              if (!smaskCache) {
                initSmaskGL();
              }
              var cache = smaskCache, canvas = cache.canvas, gl = cache.gl;
              canvas.width = width;
              canvas.height = height;
              gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
              gl.uniform2f(cache.resolutionLocation, width, height);
              if (properties.backdrop) {
                gl.uniform4f(cache.resolutionLocation, properties.backdrop[0], properties.backdrop[1], properties.backdrop[2], 1);
              } else {
                gl.uniform4f(cache.resolutionLocation, 0, 0, 0, 0);
              }
              gl.uniform1i(cache.subtypeLocation, properties.subtype === "Luminosity" ? 1 : 0);
              var texture = createTexture(gl, layer, gl.TEXTURE0);
              var maskTexture = createTexture(gl, mask, gl.TEXTURE1);
              var buffer = gl.createBuffer();
              gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
              gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, width, 0, 0, height, 0, height, width, 0, width, height]), gl.STATIC_DRAW);
              gl.enableVertexAttribArray(cache.positionLocation);
              gl.vertexAttribPointer(cache.positionLocation, 2, gl.FLOAT, false, 0, 0);
              gl.clearColor(0, 0, 0, 0);
              gl.enable(gl.BLEND);
              gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
              gl.clear(gl.COLOR_BUFFER_BIT);
              gl.drawArrays(gl.TRIANGLES, 0, 6);
              gl.flush();
              gl.deleteTexture(texture);
              gl.deleteTexture(maskTexture);
              gl.deleteBuffer(buffer);
              return canvas;
            }
            var figuresVertexShaderCode = "  attribute vec2 a_position;                                      attribute vec3 a_color;                                                                                                         uniform vec2 u_resolution;                                      uniform vec2 u_scale;                                           uniform vec2 u_offset;                                                                                                          varying vec4 v_color;                                                                                                           void main() {                                                     vec2 position = (a_position + u_offset) * u_scale;              vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;         gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);                                                                              v_color = vec4(a_color / 255.0, 1.0);                         }                                                             ";
            var figuresFragmentShaderCode = "  precision mediump float;                                                                                                        varying vec4 v_color;                                                                                                           void main() {                                                     gl_FragColor = v_color;                                       }                                                             ";
            var figuresCache = null;
            function initFiguresGL() {
              var canvas, gl;
              generateGL();
              canvas = currentCanvas;
              currentCanvas = null;
              gl = currentGL;
              currentGL = null;
              var vertexShader = createVertexShader(gl, figuresVertexShaderCode);
              var fragmentShader = createFragmentShader(gl, figuresFragmentShaderCode);
              var program = createProgram(gl, [vertexShader, fragmentShader]);
              gl.useProgram(program);
              var cache = {};
              cache.gl = gl;
              cache.canvas = canvas;
              cache.resolutionLocation = gl.getUniformLocation(program, "u_resolution");
              cache.scaleLocation = gl.getUniformLocation(program, "u_scale");
              cache.offsetLocation = gl.getUniformLocation(program, "u_offset");
              cache.positionLocation = gl.getAttribLocation(program, "a_position");
              cache.colorLocation = gl.getAttribLocation(program, "a_color");
              figuresCache = cache;
            }
            function drawFigures(width, height, backgroundColor, figures, context) {
              if (!figuresCache) {
                initFiguresGL();
              }
              var cache = figuresCache, canvas = cache.canvas, gl = cache.gl;
              canvas.width = width;
              canvas.height = height;
              gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
              gl.uniform2f(cache.resolutionLocation, width, height);
              var count = 0;
              var i, ii, rows;
              for (i = 0, ii = figures.length; i < ii; i++) {
                switch (figures[i].type) {
                  case "lattice":
                    rows = figures[i].coords.length / figures[i].verticesPerRow | 0;
                    count += (rows - 1) * (figures[i].verticesPerRow - 1) * 6;
                    break;
                  case "triangles":
                    count += figures[i].coords.length;
                    break;
                }
              }
              var coords = new Float32Array(count * 2);
              var colors = new Uint8Array(count * 3);
              var coordsMap = context.coords, colorsMap = context.colors;
              var pIndex = 0, cIndex = 0;
              for (i = 0, ii = figures.length; i < ii; i++) {
                var figure = figures[i], ps = figure.coords, cs = figure.colors;
                switch (figure.type) {
                  case "lattice":
                    var cols = figure.verticesPerRow;
                    rows = ps.length / cols | 0;
                    for (var row = 1; row < rows; row++) {
                      var offset = row * cols + 1;
                      for (var col = 1; col < cols; col++, offset++) {
                        coords[pIndex] = coordsMap[ps[offset - cols - 1]];
                        coords[pIndex + 1] = coordsMap[ps[offset - cols - 1] + 1];
                        coords[pIndex + 2] = coordsMap[ps[offset - cols]];
                        coords[pIndex + 3] = coordsMap[ps[offset - cols] + 1];
                        coords[pIndex + 4] = coordsMap[ps[offset - 1]];
                        coords[pIndex + 5] = coordsMap[ps[offset - 1] + 1];
                        colors[cIndex] = colorsMap[cs[offset - cols - 1]];
                        colors[cIndex + 1] = colorsMap[cs[offset - cols - 1] + 1];
                        colors[cIndex + 2] = colorsMap[cs[offset - cols - 1] + 2];
                        colors[cIndex + 3] = colorsMap[cs[offset - cols]];
                        colors[cIndex + 4] = colorsMap[cs[offset - cols] + 1];
                        colors[cIndex + 5] = colorsMap[cs[offset - cols] + 2];
                        colors[cIndex + 6] = colorsMap[cs[offset - 1]];
                        colors[cIndex + 7] = colorsMap[cs[offset - 1] + 1];
                        colors[cIndex + 8] = colorsMap[cs[offset - 1] + 2];
                        coords[pIndex + 6] = coords[pIndex + 2];
                        coords[pIndex + 7] = coords[pIndex + 3];
                        coords[pIndex + 8] = coords[pIndex + 4];
                        coords[pIndex + 9] = coords[pIndex + 5];
                        coords[pIndex + 10] = coordsMap[ps[offset]];
                        coords[pIndex + 11] = coordsMap[ps[offset] + 1];
                        colors[cIndex + 9] = colors[cIndex + 3];
                        colors[cIndex + 10] = colors[cIndex + 4];
                        colors[cIndex + 11] = colors[cIndex + 5];
                        colors[cIndex + 12] = colors[cIndex + 6];
                        colors[cIndex + 13] = colors[cIndex + 7];
                        colors[cIndex + 14] = colors[cIndex + 8];
                        colors[cIndex + 15] = colorsMap[cs[offset]];
                        colors[cIndex + 16] = colorsMap[cs[offset] + 1];
                        colors[cIndex + 17] = colorsMap[cs[offset] + 2];
                        pIndex += 12;
                        cIndex += 18;
                      }
                    }
                    break;
                  case "triangles":
                    for (var j = 0, jj = ps.length; j < jj; j++) {
                      coords[pIndex] = coordsMap[ps[j]];
                      coords[pIndex + 1] = coordsMap[ps[j] + 1];
                      colors[cIndex] = colorsMap[cs[j]];
                      colors[cIndex + 1] = colorsMap[cs[j] + 1];
                      colors[cIndex + 2] = colorsMap[cs[j] + 2];
                      pIndex += 2;
                      cIndex += 3;
                    }
                    break;
                }
              }
              if (backgroundColor) {
                gl.clearColor(backgroundColor[0] / 255, backgroundColor[1] / 255, backgroundColor[2] / 255, 1);
              } else {
                gl.clearColor(0, 0, 0, 0);
              }
              gl.clear(gl.COLOR_BUFFER_BIT);
              var coordsBuffer = gl.createBuffer();
              gl.bindBuffer(gl.ARRAY_BUFFER, coordsBuffer);
              gl.bufferData(gl.ARRAY_BUFFER, coords, gl.STATIC_DRAW);
              gl.enableVertexAttribArray(cache.positionLocation);
              gl.vertexAttribPointer(cache.positionLocation, 2, gl.FLOAT, false, 0, 0);
              var colorsBuffer = gl.createBuffer();
              gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
              gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
              gl.enableVertexAttribArray(cache.colorLocation);
              gl.vertexAttribPointer(cache.colorLocation, 3, gl.UNSIGNED_BYTE, false, 0, 0);
              gl.uniform2f(cache.scaleLocation, context.scaleX, context.scaleY);
              gl.uniform2f(cache.offsetLocation, context.offsetX, context.offsetY);
              gl.drawArrays(gl.TRIANGLES, 0, count);
              gl.flush();
              gl.deleteBuffer(coordsBuffer);
              gl.deleteBuffer(colorsBuffer);
              return canvas;
            }
            return {
              tryInitGL: function tryInitGL() {
                try {
                  generateGL();
                  return !!currentGL;
                } catch (ex) {
                }
                return false;
              },
              composeSMask,
              drawFigures,
              cleanup: function cleanup() {
                if (smaskCache && smaskCache.canvas) {
                  smaskCache.canvas.width = 0;
                  smaskCache.canvas.height = 0;
                }
                if (figuresCache && figuresCache.canvas) {
                  figuresCache.canvas.width = 0;
                  figuresCache.canvas.height = 0;
                }
                smaskCache = null;
                figuresCache = null;
              }
            };
          }();
        },
        /* 162 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.renderTextLayer = void 0;
          var _util = __w_pdfjs_require__(1);
          var _global_scope = _interopRequireDefault(__w_pdfjs_require__(3));
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          var renderTextLayer = function renderTextLayerClosure() {
            var MAX_TEXT_DIVS_TO_RENDER = 1e5;
            var NonWhitespaceRegexp = /\S/;
            function isAllWhitespace(str) {
              return !NonWhitespaceRegexp.test(str);
            }
            var styleBuf = ["left: ", 0, "px; top: ", 0, "px; font-size: ", 0, "px; font-family: ", "", ";"];
            function appendText(task, geom, styles) {
              var textDiv = document.createElement("span");
              var textDivProperties = {
                style: null,
                angle: 0,
                canvasWidth: 0,
                isWhitespace: false,
                originalTransform: null,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
                scale: 1
              };
              task._textDivs.push(textDiv);
              if (isAllWhitespace(geom.str)) {
                textDivProperties.isWhitespace = true;
                task._textDivProperties.set(textDiv, textDivProperties);
                return;
              }
              var tx = _util.Util.transform(task._viewport.transform, geom.transform);
              var angle = Math.atan2(tx[1], tx[0]);
              var style = styles[geom.fontName];
              if (style.vertical) {
                angle += Math.PI / 2;
              }
              var fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
              var fontAscent = fontHeight;
              if (style.ascent) {
                fontAscent = style.ascent * fontAscent;
              } else if (style.descent) {
                fontAscent = (1 + style.descent) * fontAscent;
              }
              var left;
              var top;
              if (angle === 0) {
                left = tx[4];
                top = tx[5] - fontAscent;
              } else {
                left = tx[4] + fontAscent * Math.sin(angle);
                top = tx[5] - fontAscent * Math.cos(angle);
              }
              styleBuf[1] = left;
              styleBuf[3] = top;
              styleBuf[5] = fontHeight;
              styleBuf[7] = style.fontFamily;
              textDivProperties.style = styleBuf.join("");
              textDiv.setAttribute("style", textDivProperties.style);
              textDiv.textContent = geom.str;
              if (task._fontInspectorEnabled) {
                textDiv.dataset.fontName = geom.fontName;
              }
              if (angle !== 0) {
                textDivProperties.angle = angle * (180 / Math.PI);
              }
              if (geom.str.length > 1) {
                if (style.vertical) {
                  textDivProperties.canvasWidth = geom.height * task._viewport.scale;
                } else {
                  textDivProperties.canvasWidth = geom.width * task._viewport.scale;
                }
              }
              task._textDivProperties.set(textDiv, textDivProperties);
              if (task._textContentStream) {
                task._layoutText(textDiv);
              }
              if (task._enhanceTextSelection) {
                var angleCos = 1, angleSin = 0;
                if (angle !== 0) {
                  angleCos = Math.cos(angle);
                  angleSin = Math.sin(angle);
                }
                var divWidth = (style.vertical ? geom.height : geom.width) * task._viewport.scale;
                var divHeight = fontHeight;
                var m, b;
                if (angle !== 0) {
                  m = [angleCos, angleSin, -angleSin, angleCos, left, top];
                  b = _util.Util.getAxialAlignedBoundingBox([0, 0, divWidth, divHeight], m);
                } else {
                  b = [left, top, left + divWidth, top + divHeight];
                }
                task._bounds.push({
                  left: b[0],
                  top: b[1],
                  right: b[2],
                  bottom: b[3],
                  div: textDiv,
                  size: [divWidth, divHeight],
                  m
                });
              }
            }
            function render(task) {
              if (task._canceled) {
                return;
              }
              var textDivs = task._textDivs;
              var capability = task._capability;
              var textDivsLength = textDivs.length;
              if (textDivsLength > MAX_TEXT_DIVS_TO_RENDER) {
                task._renderingDone = true;
                capability.resolve();
                return;
              }
              if (!task._textContentStream) {
                for (var i = 0; i < textDivsLength; i++) {
                  task._layoutText(textDivs[i]);
                }
              }
              task._renderingDone = true;
              capability.resolve();
            }
            function expand(task) {
              var bounds = task._bounds;
              var viewport = task._viewport;
              var expanded = expandBounds(viewport.width, viewport.height, bounds);
              for (var i = 0; i < expanded.length; i++) {
                var div = bounds[i].div;
                var divProperties = task._textDivProperties.get(div);
                if (divProperties.angle === 0) {
                  divProperties.paddingLeft = bounds[i].left - expanded[i].left;
                  divProperties.paddingTop = bounds[i].top - expanded[i].top;
                  divProperties.paddingRight = expanded[i].right - bounds[i].right;
                  divProperties.paddingBottom = expanded[i].bottom - bounds[i].bottom;
                  task._textDivProperties.set(div, divProperties);
                  continue;
                }
                var e = expanded[i], b = bounds[i];
                var m = b.m, c2 = m[0], s = m[1];
                var points = [[0, 0], [0, b.size[1]], [b.size[0], 0], b.size];
                var ts = new Float64Array(64);
                points.forEach(function(p, i2) {
                  var t2 = _util.Util.applyTransform(p, m);
                  ts[i2 + 0] = c2 && (e.left - t2[0]) / c2;
                  ts[i2 + 4] = s && (e.top - t2[1]) / s;
                  ts[i2 + 8] = c2 && (e.right - t2[0]) / c2;
                  ts[i2 + 12] = s && (e.bottom - t2[1]) / s;
                  ts[i2 + 16] = s && (e.left - t2[0]) / -s;
                  ts[i2 + 20] = c2 && (e.top - t2[1]) / c2;
                  ts[i2 + 24] = s && (e.right - t2[0]) / -s;
                  ts[i2 + 28] = c2 && (e.bottom - t2[1]) / c2;
                  ts[i2 + 32] = c2 && (e.left - t2[0]) / -c2;
                  ts[i2 + 36] = s && (e.top - t2[1]) / -s;
                  ts[i2 + 40] = c2 && (e.right - t2[0]) / -c2;
                  ts[i2 + 44] = s && (e.bottom - t2[1]) / -s;
                  ts[i2 + 48] = s && (e.left - t2[0]) / s;
                  ts[i2 + 52] = c2 && (e.top - t2[1]) / -c2;
                  ts[i2 + 56] = s && (e.right - t2[0]) / s;
                  ts[i2 + 60] = c2 && (e.bottom - t2[1]) / -c2;
                });
                var findPositiveMin = function findPositiveMin2(ts2, offset, count) {
                  var result = 0;
                  for (var i2 = 0; i2 < count; i2++) {
                    var t2 = ts2[offset++];
                    if (t2 > 0) {
                      result = result ? Math.min(t2, result) : t2;
                    }
                  }
                  return result;
                };
                var boxScale = 1 + Math.min(Math.abs(c2), Math.abs(s));
                divProperties.paddingLeft = findPositiveMin(ts, 32, 16) / boxScale;
                divProperties.paddingTop = findPositiveMin(ts, 48, 16) / boxScale;
                divProperties.paddingRight = findPositiveMin(ts, 0, 16) / boxScale;
                divProperties.paddingBottom = findPositiveMin(ts, 16, 16) / boxScale;
                task._textDivProperties.set(div, divProperties);
              }
            }
            function expandBounds(width, height, boxes) {
              var bounds = boxes.map(function(box, i) {
                return {
                  x1: box.left,
                  y1: box.top,
                  x2: box.right,
                  y2: box.bottom,
                  index: i,
                  x1New: void 0,
                  x2New: void 0
                };
              });
              expandBoundsLTR(width, bounds);
              var expanded = new Array(boxes.length);
              bounds.forEach(function(b) {
                var i = b.index;
                expanded[i] = {
                  left: b.x1New,
                  top: 0,
                  right: b.x2New,
                  bottom: 0
                };
              });
              boxes.map(function(box, i) {
                var e = expanded[i], b = bounds[i];
                b.x1 = box.top;
                b.y1 = width - e.right;
                b.x2 = box.bottom;
                b.y2 = width - e.left;
                b.index = i;
                b.x1New = void 0;
                b.x2New = void 0;
              });
              expandBoundsLTR(height, bounds);
              bounds.forEach(function(b) {
                var i = b.index;
                expanded[i].top = b.x1New;
                expanded[i].bottom = b.x2New;
              });
              return expanded;
            }
            function expandBoundsLTR(width, bounds) {
              bounds.sort(function(a2, b) {
                return a2.x1 - b.x1 || a2.index - b.index;
              });
              var fakeBoundary = {
                x1: -Infinity,
                y1: -Infinity,
                x2: 0,
                y2: Infinity,
                index: -1,
                x1New: 0,
                x2New: 0
              };
              var horizon = [{
                start: -Infinity,
                end: Infinity,
                boundary: fakeBoundary
              }];
              bounds.forEach(function(boundary) {
                var i = 0;
                while (i < horizon.length && horizon[i].end <= boundary.y1) {
                  i++;
                }
                var j = horizon.length - 1;
                while (j >= 0 && horizon[j].start >= boundary.y2) {
                  j--;
                }
                var horizonPart, affectedBoundary;
                var q, k, maxXNew = -Infinity;
                for (q = i; q <= j; q++) {
                  horizonPart = horizon[q];
                  affectedBoundary = horizonPart.boundary;
                  var xNew;
                  if (affectedBoundary.x2 > boundary.x1) {
                    xNew = affectedBoundary.index > boundary.index ? affectedBoundary.x1New : boundary.x1;
                  } else if (affectedBoundary.x2New === void 0) {
                    xNew = (affectedBoundary.x2 + boundary.x1) / 2;
                  } else {
                    xNew = affectedBoundary.x2New;
                  }
                  if (xNew > maxXNew) {
                    maxXNew = xNew;
                  }
                }
                boundary.x1New = maxXNew;
                for (q = i; q <= j; q++) {
                  horizonPart = horizon[q];
                  affectedBoundary = horizonPart.boundary;
                  if (affectedBoundary.x2New === void 0) {
                    if (affectedBoundary.x2 > boundary.x1) {
                      if (affectedBoundary.index > boundary.index) {
                        affectedBoundary.x2New = affectedBoundary.x2;
                      }
                    } else {
                      affectedBoundary.x2New = maxXNew;
                    }
                  } else if (affectedBoundary.x2New > maxXNew) {
                    affectedBoundary.x2New = Math.max(maxXNew, affectedBoundary.x2);
                  }
                }
                var changedHorizon = [], lastBoundary = null;
                for (q = i; q <= j; q++) {
                  horizonPart = horizon[q];
                  affectedBoundary = horizonPart.boundary;
                  var useBoundary = affectedBoundary.x2 > boundary.x2 ? affectedBoundary : boundary;
                  if (lastBoundary === useBoundary) {
                    changedHorizon[changedHorizon.length - 1].end = horizonPart.end;
                  } else {
                    changedHorizon.push({
                      start: horizonPart.start,
                      end: horizonPart.end,
                      boundary: useBoundary
                    });
                    lastBoundary = useBoundary;
                  }
                }
                if (horizon[i].start < boundary.y1) {
                  changedHorizon[0].start = boundary.y1;
                  changedHorizon.unshift({
                    start: horizon[i].start,
                    end: boundary.y1,
                    boundary: horizon[i].boundary
                  });
                }
                if (boundary.y2 < horizon[j].end) {
                  changedHorizon[changedHorizon.length - 1].end = boundary.y2;
                  changedHorizon.push({
                    start: boundary.y2,
                    end: horizon[j].end,
                    boundary: horizon[j].boundary
                  });
                }
                for (q = i; q <= j; q++) {
                  horizonPart = horizon[q];
                  affectedBoundary = horizonPart.boundary;
                  if (affectedBoundary.x2New !== void 0) {
                    continue;
                  }
                  var used = false;
                  for (k = i - 1; !used && k >= 0 && horizon[k].start >= affectedBoundary.y1; k--) {
                    used = horizon[k].boundary === affectedBoundary;
                  }
                  for (k = j + 1; !used && k < horizon.length && horizon[k].end <= affectedBoundary.y2; k++) {
                    used = horizon[k].boundary === affectedBoundary;
                  }
                  for (k = 0; !used && k < changedHorizon.length; k++) {
                    used = changedHorizon[k].boundary === affectedBoundary;
                  }
                  if (!used) {
                    affectedBoundary.x2New = maxXNew;
                  }
                }
                Array.prototype.splice.apply(horizon, [i, j - i + 1].concat(changedHorizon));
              });
              horizon.forEach(function(horizonPart) {
                var affectedBoundary = horizonPart.boundary;
                if (affectedBoundary.x2New === void 0) {
                  affectedBoundary.x2New = Math.max(width, affectedBoundary.x2);
                }
              });
            }
            function TextLayerRenderTask(_ref) {
              var textContent = _ref.textContent, textContentStream = _ref.textContentStream, container = _ref.container, viewport = _ref.viewport, textDivs = _ref.textDivs, textContentItemsStr = _ref.textContentItemsStr, enhanceTextSelection = _ref.enhanceTextSelection;
              this._textContent = textContent;
              this._textContentStream = textContentStream;
              this._container = container;
              this._viewport = viewport;
              this._textDivs = textDivs || [];
              this._textContentItemsStr = textContentItemsStr || [];
              this._enhanceTextSelection = !!enhanceTextSelection;
              this._fontInspectorEnabled = !!(_global_scope.default.FontInspector && _global_scope.default.FontInspector.enabled);
              this._reader = null;
              this._layoutTextLastFontSize = null;
              this._layoutTextLastFontFamily = null;
              this._layoutTextCtx = null;
              this._textDivProperties = /* @__PURE__ */ new WeakMap();
              this._renderingDone = false;
              this._canceled = false;
              this._capability = (0, _util.createPromiseCapability)();
              this._renderTimer = null;
              this._bounds = [];
            }
            TextLayerRenderTask.prototype = {
              get promise() {
                return this._capability.promise;
              },
              cancel: function TextLayer_cancel() {
                if (this._reader) {
                  this._reader.cancel(new _util.AbortException("text layer task cancelled"));
                  this._reader = null;
                }
                this._canceled = true;
                if (this._renderTimer !== null) {
                  clearTimeout(this._renderTimer);
                  this._renderTimer = null;
                }
                this._capability.reject("canceled");
              },
              _processItems: function _processItems(items, styleCache) {
                for (var i = 0, len = items.length; i < len; i++) {
                  this._textContentItemsStr.push(items[i].str);
                  appendText(this, items[i], styleCache);
                }
              },
              _layoutText: function _layoutText(textDiv) {
                var textLayerFrag = this._container;
                var textDivProperties = this._textDivProperties.get(textDiv);
                if (textDivProperties.isWhitespace) {
                  return;
                }
                var fontSize = textDiv.style.fontSize;
                var fontFamily = textDiv.style.fontFamily;
                if (fontSize !== this._layoutTextLastFontSize || fontFamily !== this._layoutTextLastFontFamily) {
                  this._layoutTextCtx.font = fontSize + " " + fontFamily;
                  this._layoutTextLastFontSize = fontSize;
                  this._layoutTextLastFontFamily = fontFamily;
                }
                var width = this._layoutTextCtx.measureText(textDiv.textContent).width;
                var transform = "";
                if (textDivProperties.canvasWidth !== 0 && width > 0) {
                  textDivProperties.scale = textDivProperties.canvasWidth / width;
                  transform = "scaleX(".concat(textDivProperties.scale, ")");
                }
                if (textDivProperties.angle !== 0) {
                  transform = "rotate(".concat(textDivProperties.angle, "deg) ").concat(transform);
                }
                if (transform.length > 0) {
                  textDivProperties.originalTransform = transform;
                  textDiv.style.transform = transform;
                }
                this._textDivProperties.set(textDiv, textDivProperties);
                textLayerFrag.appendChild(textDiv);
              },
              _render: function TextLayer_render(timeout) {
                var _this = this;
                var capability = (0, _util.createPromiseCapability)();
                var styleCache = /* @__PURE__ */ Object.create(null);
                var canvas = document.createElement("canvas");
                canvas.mozOpaque = true;
                this._layoutTextCtx = canvas.getContext("2d", {
                  alpha: false
                });
                if (this._textContent) {
                  var textItems = this._textContent.items;
                  var textStyles = this._textContent.styles;
                  this._processItems(textItems, textStyles);
                  capability.resolve();
                } else if (this._textContentStream) {
                  var pump = function pump2() {
                    _this._reader.read().then(function(_ref2) {
                      var value = _ref2.value, done = _ref2.done;
                      if (done) {
                        capability.resolve();
                        return;
                      }
                      Object.assign(styleCache, value.styles);
                      _this._processItems(value.items, styleCache);
                      pump2();
                    }, capability.reject);
                  };
                  this._reader = this._textContentStream.getReader();
                  pump();
                } else {
                  throw new Error('Neither "textContent" nor "textContentStream" parameters specified.');
                }
                capability.promise.then(function() {
                  styleCache = null;
                  if (!timeout) {
                    render(_this);
                  } else {
                    _this._renderTimer = setTimeout(function() {
                      render(_this);
                      _this._renderTimer = null;
                    }, timeout);
                  }
                }, this._capability.reject);
              },
              expandTextDivs: function TextLayer_expandTextDivs(expandDivs) {
                if (!this._enhanceTextSelection || !this._renderingDone) {
                  return;
                }
                if (this._bounds !== null) {
                  expand(this);
                  this._bounds = null;
                }
                for (var i = 0, ii = this._textDivs.length; i < ii; i++) {
                  var div = this._textDivs[i];
                  var divProperties = this._textDivProperties.get(div);
                  if (divProperties.isWhitespace) {
                    continue;
                  }
                  if (expandDivs) {
                    var transform = "", padding = "";
                    if (divProperties.scale !== 1) {
                      transform = "scaleX(" + divProperties.scale + ")";
                    }
                    if (divProperties.angle !== 0) {
                      transform = "rotate(" + divProperties.angle + "deg) " + transform;
                    }
                    if (divProperties.paddingLeft !== 0) {
                      padding += " padding-left: " + divProperties.paddingLeft / divProperties.scale + "px;";
                      transform += " translateX(" + -divProperties.paddingLeft / divProperties.scale + "px)";
                    }
                    if (divProperties.paddingTop !== 0) {
                      padding += " padding-top: " + divProperties.paddingTop + "px;";
                      transform += " translateY(" + -divProperties.paddingTop + "px)";
                    }
                    if (divProperties.paddingRight !== 0) {
                      padding += " padding-right: " + divProperties.paddingRight / divProperties.scale + "px;";
                    }
                    if (divProperties.paddingBottom !== 0) {
                      padding += " padding-bottom: " + divProperties.paddingBottom + "px;";
                    }
                    if (padding !== "") {
                      div.setAttribute("style", divProperties.style + padding);
                    }
                    if (transform !== "") {
                      div.style.transform = transform;
                    }
                  } else {
                    div.style.padding = 0;
                    div.style.transform = divProperties.originalTransform || "";
                  }
                }
              }
            };
            function renderTextLayer2(renderParameters) {
              var task = new TextLayerRenderTask({
                textContent: renderParameters.textContent,
                textContentStream: renderParameters.textContentStream,
                container: renderParameters.container,
                viewport: renderParameters.viewport,
                textDivs: renderParameters.textDivs,
                textContentItemsStr: renderParameters.textContentItemsStr,
                enhanceTextSelection: renderParameters.enhanceTextSelection
              });
              task._render(renderParameters.timeout);
              return task;
            }
            return renderTextLayer2;
          }();
          exports2.renderTextLayer = renderTextLayer;
        },
        /* 163 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.AnnotationLayer = void 0;
          var _dom_utils = __w_pdfjs_require__(151);
          var _util = __w_pdfjs_require__(1);
          function _get(target, property, receiver) {
            if (typeof Reflect !== "undefined" && Reflect.get) {
              _get = Reflect.get;
            } else {
              _get = function _get2(target2, property2, receiver2) {
                var base2 = _superPropBase(target2, property2);
                if (!base2)
                  return;
                var desc = Object.getOwnPropertyDescriptor(base2, property2);
                if (desc.get) {
                  return desc.get.call(receiver2);
                }
                return desc.value;
              };
            }
            return _get(target, property, receiver || target);
          }
          function _superPropBase(object, property) {
            while (!Object.prototype.hasOwnProperty.call(object, property)) {
              object = _getPrototypeOf(object);
              if (object === null)
                break;
            }
            return object;
          }
          function _typeof(obj) {
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
              _typeof = function _typeof2(obj2) {
                return typeof obj2;
              };
            } else {
              _typeof = function _typeof2(obj2) {
                return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
              };
            }
            return _typeof(obj);
          }
          function _possibleConstructorReturn(self2, call) {
            if (call && (_typeof(call) === "object" || typeof call === "function")) {
              return call;
            }
            return _assertThisInitialized(self2);
          }
          function _assertThisInitialized(self2) {
            if (self2 === void 0) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self2;
          }
          function _getPrototypeOf(o2) {
            _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o3) {
              return o3.__proto__ || Object.getPrototypeOf(o3);
            };
            return _getPrototypeOf(o2);
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass)
              _setPrototypeOf(subClass, superClass);
          }
          function _setPrototypeOf(o2, p) {
            _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o3, p2) {
              o3.__proto__ = p2;
              return o3;
            };
            return _setPrototypeOf(o2, p);
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            return Constructor;
          }
          var AnnotationElementFactory = function() {
            function AnnotationElementFactory2() {
              _classCallCheck(this, AnnotationElementFactory2);
            }
            _createClass(AnnotationElementFactory2, null, [{
              key: "create",
              value: function create(parameters) {
                var subtype = parameters.data.annotationType;
                switch (subtype) {
                  case _util.AnnotationType.LINK:
                    return new LinkAnnotationElement(parameters);
                  case _util.AnnotationType.TEXT:
                    return new TextAnnotationElement(parameters);
                  case _util.AnnotationType.WIDGET:
                    var fieldType = parameters.data.fieldType;
                    switch (fieldType) {
                      case "Tx":
                        return new TextWidgetAnnotationElement(parameters);
                      case "Btn":
                        if (parameters.data.radioButton) {
                          return new RadioButtonWidgetAnnotationElement(parameters);
                        } else if (parameters.data.checkBox) {
                          return new CheckboxWidgetAnnotationElement(parameters);
                        }
                        return new PushButtonWidgetAnnotationElement(parameters);
                      case "Ch":
                        return new ChoiceWidgetAnnotationElement(parameters);
                    }
                    return new WidgetAnnotationElement(parameters);
                  case _util.AnnotationType.POPUP:
                    return new PopupAnnotationElement(parameters);
                  case _util.AnnotationType.LINE:
                    return new LineAnnotationElement(parameters);
                  case _util.AnnotationType.SQUARE:
                    return new SquareAnnotationElement(parameters);
                  case _util.AnnotationType.CIRCLE:
                    return new CircleAnnotationElement(parameters);
                  case _util.AnnotationType.POLYLINE:
                    return new PolylineAnnotationElement(parameters);
                  case _util.AnnotationType.INK:
                    return new InkAnnotationElement(parameters);
                  case _util.AnnotationType.POLYGON:
                    return new PolygonAnnotationElement(parameters);
                  case _util.AnnotationType.HIGHLIGHT:
                    return new HighlightAnnotationElement(parameters);
                  case _util.AnnotationType.UNDERLINE:
                    return new UnderlineAnnotationElement(parameters);
                  case _util.AnnotationType.SQUIGGLY:
                    return new SquigglyAnnotationElement(parameters);
                  case _util.AnnotationType.STRIKEOUT:
                    return new StrikeOutAnnotationElement(parameters);
                  case _util.AnnotationType.STAMP:
                    return new StampAnnotationElement(parameters);
                  case _util.AnnotationType.FILEATTACHMENT:
                    return new FileAttachmentAnnotationElement(parameters);
                  default:
                    return new AnnotationElement(parameters);
                }
              }
            }]);
            return AnnotationElementFactory2;
          }();
          var AnnotationElement = function() {
            function AnnotationElement2(parameters) {
              var isRenderable = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
              var ignoreBorder = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
              _classCallCheck(this, AnnotationElement2);
              this.isRenderable = isRenderable;
              this.data = parameters.data;
              this.layer = parameters.layer;
              this.page = parameters.page;
              this.viewport = parameters.viewport;
              this.linkService = parameters.linkService;
              this.downloadManager = parameters.downloadManager;
              this.imageResourcesPath = parameters.imageResourcesPath;
              this.renderInteractiveForms = parameters.renderInteractiveForms;
              this.svgFactory = parameters.svgFactory;
              if (isRenderable) {
                this.container = this._createContainer(ignoreBorder);
              }
            }
            _createClass(AnnotationElement2, [{
              key: "_createContainer",
              value: function _createContainer() {
                var ignoreBorder = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
                var data = this.data, page = this.page, viewport = this.viewport;
                var container = document.createElement("section");
                var width = data.rect[2] - data.rect[0];
                var height = data.rect[3] - data.rect[1];
                container.setAttribute("data-annotation-id", data.id);
                var rect = _util.Util.normalizeRect([data.rect[0], page.view[3] - data.rect[1] + page.view[1], data.rect[2], page.view[3] - data.rect[3] + page.view[1]]);
                container.style.transform = "matrix(" + viewport.transform.join(",") + ")";
                container.style.transformOrigin = -rect[0] + "px " + -rect[1] + "px";
                if (!ignoreBorder && data.borderStyle.width > 0) {
                  container.style.borderWidth = data.borderStyle.width + "px";
                  if (data.borderStyle.style !== _util.AnnotationBorderStyleType.UNDERLINE) {
                    width = width - 2 * data.borderStyle.width;
                    height = height - 2 * data.borderStyle.width;
                  }
                  var horizontalRadius = data.borderStyle.horizontalCornerRadius;
                  var verticalRadius = data.borderStyle.verticalCornerRadius;
                  if (horizontalRadius > 0 || verticalRadius > 0) {
                    var radius = horizontalRadius + "px / " + verticalRadius + "px";
                    container.style.borderRadius = radius;
                  }
                  switch (data.borderStyle.style) {
                    case _util.AnnotationBorderStyleType.SOLID:
                      container.style.borderStyle = "solid";
                      break;
                    case _util.AnnotationBorderStyleType.DASHED:
                      container.style.borderStyle = "dashed";
                      break;
                    case _util.AnnotationBorderStyleType.BEVELED:
                      (0, _util.warn)("Unimplemented border style: beveled");
                      break;
                    case _util.AnnotationBorderStyleType.INSET:
                      (0, _util.warn)("Unimplemented border style: inset");
                      break;
                    case _util.AnnotationBorderStyleType.UNDERLINE:
                      container.style.borderBottomStyle = "solid";
                      break;
                    default:
                      break;
                  }
                  if (data.color) {
                    container.style.borderColor = _util.Util.makeCssRgb(data.color[0] | 0, data.color[1] | 0, data.color[2] | 0);
                  } else {
                    container.style.borderWidth = 0;
                  }
                }
                container.style.left = rect[0] + "px";
                container.style.top = rect[1] + "px";
                container.style.width = width + "px";
                container.style.height = height + "px";
                return container;
              }
            }, {
              key: "_createPopup",
              value: function _createPopup(container, trigger, data) {
                if (!trigger) {
                  trigger = document.createElement("div");
                  trigger.style.height = container.style.height;
                  trigger.style.width = container.style.width;
                  container.appendChild(trigger);
                }
                var popupElement = new PopupElement({
                  container,
                  trigger,
                  color: data.color,
                  title: data.title,
                  contents: data.contents,
                  hideWrapper: true
                });
                var popup = popupElement.render();
                popup.style.left = container.style.width;
                container.appendChild(popup);
              }
            }, {
              key: "render",
              value: function render() {
                (0, _util.unreachable)("Abstract method `AnnotationElement.render` called");
              }
            }]);
            return AnnotationElement2;
          }();
          var LinkAnnotationElement = function(_AnnotationElement) {
            _inherits(LinkAnnotationElement2, _AnnotationElement);
            function LinkAnnotationElement2(parameters) {
              _classCallCheck(this, LinkAnnotationElement2);
              var isRenderable = !!(parameters.data.url || parameters.data.dest || parameters.data.action);
              return _possibleConstructorReturn(this, _getPrototypeOf(LinkAnnotationElement2).call(this, parameters, isRenderable));
            }
            _createClass(LinkAnnotationElement2, [{
              key: "render",
              value: function render() {
                this.container.className = "linkAnnotation";
                var data = this.data, linkService = this.linkService;
                var link = document.createElement("a");
                (0, _dom_utils.addLinkAttributes)(link, {
                  url: data.url,
                  target: data.newWindow ? _dom_utils.LinkTarget.BLANK : linkService.externalLinkTarget,
                  rel: linkService.externalLinkRel
                });
                if (!data.url) {
                  if (data.action) {
                    this._bindNamedAction(link, data.action);
                  } else {
                    this._bindLink(link, data.dest);
                  }
                }
                this.container.appendChild(link);
                return this.container;
              }
            }, {
              key: "_bindLink",
              value: function _bindLink(link, destination) {
                var _this = this;
                link.href = this.linkService.getDestinationHash(destination);
                link.onclick = function() {
                  if (destination) {
                    _this.linkService.navigateTo(destination);
                  }
                  return false;
                };
                if (destination) {
                  link.className = "internalLink";
                }
              }
            }, {
              key: "_bindNamedAction",
              value: function _bindNamedAction(link, action) {
                var _this2 = this;
                link.href = this.linkService.getAnchorUrl("");
                link.onclick = function() {
                  _this2.linkService.executeNamedAction(action);
                  return false;
                };
                link.className = "internalLink";
              }
            }]);
            return LinkAnnotationElement2;
          }(AnnotationElement);
          var TextAnnotationElement = function(_AnnotationElement2) {
            _inherits(TextAnnotationElement2, _AnnotationElement2);
            function TextAnnotationElement2(parameters) {
              _classCallCheck(this, TextAnnotationElement2);
              var isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
              return _possibleConstructorReturn(this, _getPrototypeOf(TextAnnotationElement2).call(this, parameters, isRenderable));
            }
            _createClass(TextAnnotationElement2, [{
              key: "render",
              value: function render() {
                this.container.className = "textAnnotation";
                var image = document.createElement("img");
                image.style.height = this.container.style.height;
                image.style.width = this.container.style.width;
                image.src = this.imageResourcesPath + "annotation-" + this.data.name.toLowerCase() + ".svg";
                image.alt = "[{{type}} Annotation]";
                image.dataset.l10nId = "text_annotation_type";
                image.dataset.l10nArgs = JSON.stringify({
                  type: this.data.name
                });
                if (!this.data.hasPopup) {
                  this._createPopup(this.container, image, this.data);
                }
                this.container.appendChild(image);
                return this.container;
              }
            }]);
            return TextAnnotationElement2;
          }(AnnotationElement);
          var WidgetAnnotationElement = function(_AnnotationElement3) {
            _inherits(WidgetAnnotationElement2, _AnnotationElement3);
            function WidgetAnnotationElement2() {
              _classCallCheck(this, WidgetAnnotationElement2);
              return _possibleConstructorReturn(this, _getPrototypeOf(WidgetAnnotationElement2).apply(this, arguments));
            }
            _createClass(WidgetAnnotationElement2, [{
              key: "render",
              value: function render() {
                return this.container;
              }
            }]);
            return WidgetAnnotationElement2;
          }(AnnotationElement);
          var TextWidgetAnnotationElement = function(_WidgetAnnotationElem) {
            _inherits(TextWidgetAnnotationElement2, _WidgetAnnotationElem);
            function TextWidgetAnnotationElement2(parameters) {
              _classCallCheck(this, TextWidgetAnnotationElement2);
              var isRenderable = parameters.renderInteractiveForms || !parameters.data.hasAppearance && !!parameters.data.fieldValue;
              return _possibleConstructorReturn(this, _getPrototypeOf(TextWidgetAnnotationElement2).call(this, parameters, isRenderable));
            }
            _createClass(TextWidgetAnnotationElement2, [{
              key: "render",
              value: function render() {
                var TEXT_ALIGNMENT = ["left", "center", "right"];
                this.container.className = "textWidgetAnnotation";
                var element = null;
                if (this.renderInteractiveForms) {
                  if (this.data.multiLine) {
                    element = document.createElement("textarea");
                    element.textContent = this.data.fieldValue;
                  } else {
                    element = document.createElement("input");
                    element.type = "text";
                    element.setAttribute("value", this.data.fieldValue);
                  }
                  element.disabled = this.data.readOnly;
                  if (this.data.maxLen !== null) {
                    element.maxLength = this.data.maxLen;
                  }
                  if (this.data.comb) {
                    var fieldWidth = this.data.rect[2] - this.data.rect[0];
                    var combWidth = fieldWidth / this.data.maxLen;
                    element.classList.add("comb");
                    element.style.letterSpacing = "calc(" + combWidth + "px - 1ch)";
                  }
                } else {
                  element = document.createElement("div");
                  element.textContent = this.data.fieldValue;
                  element.style.verticalAlign = "middle";
                  element.style.display = "table-cell";
                  var font = null;
                  if (this.data.fontRefName && this.page.commonObjs.has(this.data.fontRefName)) {
                    font = this.page.commonObjs.get(this.data.fontRefName);
                  }
                  this._setTextStyle(element, font);
                }
                if (this.data.textAlignment !== null) {
                  element.style.textAlign = TEXT_ALIGNMENT[this.data.textAlignment];
                }
                this.container.appendChild(element);
                return this.container;
              }
            }, {
              key: "_setTextStyle",
              value: function _setTextStyle(element, font) {
                var style = element.style;
                style.fontSize = this.data.fontSize + "px";
                style.direction = this.data.fontDirection < 0 ? "rtl" : "ltr";
                if (!font) {
                  return;
                }
                style.fontWeight = font.black ? font.bold ? "900" : "bold" : font.bold ? "bold" : "normal";
                style.fontStyle = font.italic ? "italic" : "normal";
                var fontFamily = font.loadedName ? '"' + font.loadedName + '", ' : "";
                var fallbackName = font.fallbackName || "Helvetica, sans-serif";
                style.fontFamily = fontFamily + fallbackName;
              }
            }]);
            return TextWidgetAnnotationElement2;
          }(WidgetAnnotationElement);
          var CheckboxWidgetAnnotationElement = function(_WidgetAnnotationElem2) {
            _inherits(CheckboxWidgetAnnotationElement2, _WidgetAnnotationElem2);
            function CheckboxWidgetAnnotationElement2(parameters) {
              _classCallCheck(this, CheckboxWidgetAnnotationElement2);
              return _possibleConstructorReturn(this, _getPrototypeOf(CheckboxWidgetAnnotationElement2).call(this, parameters, parameters.renderInteractiveForms));
            }
            _createClass(CheckboxWidgetAnnotationElement2, [{
              key: "render",
              value: function render() {
                this.container.className = "buttonWidgetAnnotation checkBox";
                var element = document.createElement("input");
                element.disabled = this.data.readOnly;
                element.type = "checkbox";
                if (this.data.fieldValue && this.data.fieldValue !== "Off") {
                  element.setAttribute("checked", true);
                }
                this.container.appendChild(element);
                return this.container;
              }
            }]);
            return CheckboxWidgetAnnotationElement2;
          }(WidgetAnnotationElement);
          var RadioButtonWidgetAnnotationElement = function(_WidgetAnnotationElem3) {
            _inherits(RadioButtonWidgetAnnotationElement2, _WidgetAnnotationElem3);
            function RadioButtonWidgetAnnotationElement2(parameters) {
              _classCallCheck(this, RadioButtonWidgetAnnotationElement2);
              return _possibleConstructorReturn(this, _getPrototypeOf(RadioButtonWidgetAnnotationElement2).call(this, parameters, parameters.renderInteractiveForms));
            }
            _createClass(RadioButtonWidgetAnnotationElement2, [{
              key: "render",
              value: function render() {
                this.container.className = "buttonWidgetAnnotation radioButton";
                var element = document.createElement("input");
                element.disabled = this.data.readOnly;
                element.type = "radio";
                element.name = this.data.fieldName;
                if (this.data.fieldValue === this.data.buttonValue) {
                  element.setAttribute("checked", true);
                }
                this.container.appendChild(element);
                return this.container;
              }
            }]);
            return RadioButtonWidgetAnnotationElement2;
          }(WidgetAnnotationElement);
          var PushButtonWidgetAnnotationElement = function(_LinkAnnotationElemen) {
            _inherits(PushButtonWidgetAnnotationElement2, _LinkAnnotationElemen);
            function PushButtonWidgetAnnotationElement2() {
              _classCallCheck(this, PushButtonWidgetAnnotationElement2);
              return _possibleConstructorReturn(this, _getPrototypeOf(PushButtonWidgetAnnotationElement2).apply(this, arguments));
            }
            _createClass(PushButtonWidgetAnnotationElement2, [{
              key: "render",
              value: function render() {
                var container = _get(_getPrototypeOf(PushButtonWidgetAnnotationElement2.prototype), "render", this).call(this);
                container.className = "buttonWidgetAnnotation pushButton";
                return container;
              }
            }]);
            return PushButtonWidgetAnnotationElement2;
          }(LinkAnnotationElement);
          var ChoiceWidgetAnnotationElement = function(_WidgetAnnotationElem4) {
            _inherits(ChoiceWidgetAnnotationElement2, _WidgetAnnotationElem4);
            function ChoiceWidgetAnnotationElement2(parameters) {
              _classCallCheck(this, ChoiceWidgetAnnotationElement2);
              return _possibleConstructorReturn(this, _getPrototypeOf(ChoiceWidgetAnnotationElement2).call(this, parameters, parameters.renderInteractiveForms));
            }
            _createClass(ChoiceWidgetAnnotationElement2, [{
              key: "render",
              value: function render() {
                this.container.className = "choiceWidgetAnnotation";
                var selectElement = document.createElement("select");
                selectElement.disabled = this.data.readOnly;
                if (!this.data.combo) {
                  selectElement.size = this.data.options.length;
                  if (this.data.multiSelect) {
                    selectElement.multiple = true;
                  }
                }
                for (var i = 0, ii = this.data.options.length; i < ii; i++) {
                  var option = this.data.options[i];
                  var optionElement = document.createElement("option");
                  optionElement.textContent = option.displayValue;
                  optionElement.value = option.exportValue;
                  if (this.data.fieldValue.includes(option.displayValue)) {
                    optionElement.setAttribute("selected", true);
                  }
                  selectElement.appendChild(optionElement);
                }
                this.container.appendChild(selectElement);
                return this.container;
              }
            }]);
            return ChoiceWidgetAnnotationElement2;
          }(WidgetAnnotationElement);
          var PopupAnnotationElement = function(_AnnotationElement4) {
            _inherits(PopupAnnotationElement2, _AnnotationElement4);
            function PopupAnnotationElement2(parameters) {
              _classCallCheck(this, PopupAnnotationElement2);
              var isRenderable = !!(parameters.data.title || parameters.data.contents);
              return _possibleConstructorReturn(this, _getPrototypeOf(PopupAnnotationElement2).call(this, parameters, isRenderable));
            }
            _createClass(PopupAnnotationElement2, [{
              key: "render",
              value: function render() {
                var IGNORE_TYPES = ["Line", "Square", "Circle", "PolyLine", "Polygon", "Ink"];
                this.container.className = "popupAnnotation";
                if (IGNORE_TYPES.includes(this.data.parentType)) {
                  return this.container;
                }
                var selector = '[data-annotation-id="' + this.data.parentId + '"]';
                var parentElement = this.layer.querySelector(selector);
                if (!parentElement) {
                  return this.container;
                }
                var popup = new PopupElement({
                  container: this.container,
                  trigger: parentElement,
                  color: this.data.color,
                  title: this.data.title,
                  contents: this.data.contents
                });
                var parentLeft = parseFloat(parentElement.style.left);
                var parentWidth = parseFloat(parentElement.style.width);
                this.container.style.transformOrigin = -(parentLeft + parentWidth) + "px -" + parentElement.style.top;
                this.container.style.left = parentLeft + parentWidth + "px";
                this.container.appendChild(popup.render());
                return this.container;
              }
            }]);
            return PopupAnnotationElement2;
          }(AnnotationElement);
          var PopupElement = function() {
            function PopupElement2(parameters) {
              _classCallCheck(this, PopupElement2);
              this.container = parameters.container;
              this.trigger = parameters.trigger;
              this.color = parameters.color;
              this.title = parameters.title;
              this.contents = parameters.contents;
              this.hideWrapper = parameters.hideWrapper || false;
              this.pinned = false;
            }
            _createClass(PopupElement2, [{
              key: "render",
              value: function render() {
                var BACKGROUND_ENLIGHT = 0.7;
                var wrapper = document.createElement("div");
                wrapper.className = "popupWrapper";
                this.hideElement = this.hideWrapper ? wrapper : this.container;
                this.hideElement.setAttribute("hidden", true);
                var popup = document.createElement("div");
                popup.className = "popup";
                var color = this.color;
                if (color) {
                  var r2 = BACKGROUND_ENLIGHT * (255 - color[0]) + color[0];
                  var g = BACKGROUND_ENLIGHT * (255 - color[1]) + color[1];
                  var b = BACKGROUND_ENLIGHT * (255 - color[2]) + color[2];
                  popup.style.backgroundColor = _util.Util.makeCssRgb(r2 | 0, g | 0, b | 0);
                }
                var contents = this._formatContents(this.contents);
                var title$$1 = document.createElement("h1");
                title$$1.textContent = this.title;
                this.trigger.addEventListener("click", this._toggle.bind(this));
                this.trigger.addEventListener("mouseover", this._show.bind(this, false));
                this.trigger.addEventListener("mouseout", this._hide.bind(this, false));
                popup.addEventListener("click", this._hide.bind(this, true));
                popup.appendChild(title$$1);
                popup.appendChild(contents);
                wrapper.appendChild(popup);
                return wrapper;
              }
            }, {
              key: "_formatContents",
              value: function _formatContents(contents) {
                var p = document.createElement("p");
                var lines = contents.split(/(?:\r\n?|\n)/);
                for (var i = 0, ii = lines.length; i < ii; ++i) {
                  var line = lines[i];
                  p.appendChild(document.createTextNode(line));
                  if (i < ii - 1) {
                    p.appendChild(document.createElement("br"));
                  }
                }
                return p;
              }
            }, {
              key: "_toggle",
              value: function _toggle() {
                if (this.pinned) {
                  this._hide(true);
                } else {
                  this._show(true);
                }
              }
            }, {
              key: "_show",
              value: function _show() {
                var pin = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
                if (pin) {
                  this.pinned = true;
                }
                if (this.hideElement.hasAttribute("hidden")) {
                  this.hideElement.removeAttribute("hidden");
                  this.container.style.zIndex += 1;
                }
              }
            }, {
              key: "_hide",
              value: function _hide() {
                var unpin = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
                if (unpin) {
                  this.pinned = false;
                }
                if (!this.hideElement.hasAttribute("hidden") && !this.pinned) {
                  this.hideElement.setAttribute("hidden", true);
                  this.container.style.zIndex -= 1;
                }
              }
            }]);
            return PopupElement2;
          }();
          var LineAnnotationElement = function(_AnnotationElement5) {
            _inherits(LineAnnotationElement2, _AnnotationElement5);
            function LineAnnotationElement2(parameters) {
              _classCallCheck(this, LineAnnotationElement2);
              var isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
              return _possibleConstructorReturn(this, _getPrototypeOf(LineAnnotationElement2).call(this, parameters, isRenderable, true));
            }
            _createClass(LineAnnotationElement2, [{
              key: "render",
              value: function render() {
                this.container.className = "lineAnnotation";
                var data = this.data;
                var width = data.rect[2] - data.rect[0];
                var height = data.rect[3] - data.rect[1];
                var svg = this.svgFactory.create(width, height);
                var line = this.svgFactory.createElement("svg:line");
                line.setAttribute("x1", data.rect[2] - data.lineCoordinates[0]);
                line.setAttribute("y1", data.rect[3] - data.lineCoordinates[1]);
                line.setAttribute("x2", data.rect[2] - data.lineCoordinates[2]);
                line.setAttribute("y2", data.rect[3] - data.lineCoordinates[3]);
                line.setAttribute("stroke-width", data.borderStyle.width);
                line.setAttribute("stroke", "transparent");
                svg.appendChild(line);
                this.container.append(svg);
                this._createPopup(this.container, line, data);
                return this.container;
              }
            }]);
            return LineAnnotationElement2;
          }(AnnotationElement);
          var SquareAnnotationElement = function(_AnnotationElement6) {
            _inherits(SquareAnnotationElement2, _AnnotationElement6);
            function SquareAnnotationElement2(parameters) {
              _classCallCheck(this, SquareAnnotationElement2);
              var isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
              return _possibleConstructorReturn(this, _getPrototypeOf(SquareAnnotationElement2).call(this, parameters, isRenderable, true));
            }
            _createClass(SquareAnnotationElement2, [{
              key: "render",
              value: function render() {
                this.container.className = "squareAnnotation";
                var data = this.data;
                var width = data.rect[2] - data.rect[0];
                var height = data.rect[3] - data.rect[1];
                var svg = this.svgFactory.create(width, height);
                var borderWidth = data.borderStyle.width;
                var square = this.svgFactory.createElement("svg:rect");
                square.setAttribute("x", borderWidth / 2);
                square.setAttribute("y", borderWidth / 2);
                square.setAttribute("width", width - borderWidth);
                square.setAttribute("height", height - borderWidth);
                square.setAttribute("stroke-width", borderWidth);
                square.setAttribute("stroke", "transparent");
                square.setAttribute("fill", "none");
                svg.appendChild(square);
                this.container.append(svg);
                this._createPopup(this.container, square, data);
                return this.container;
              }
            }]);
            return SquareAnnotationElement2;
          }(AnnotationElement);
          var CircleAnnotationElement = function(_AnnotationElement7) {
            _inherits(CircleAnnotationElement2, _AnnotationElement7);
            function CircleAnnotationElement2(parameters) {
              _classCallCheck(this, CircleAnnotationElement2);
              var isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
              return _possibleConstructorReturn(this, _getPrototypeOf(CircleAnnotationElement2).call(this, parameters, isRenderable, true));
            }
            _createClass(CircleAnnotationElement2, [{
              key: "render",
              value: function render() {
                this.container.className = "circleAnnotation";
                var data = this.data;
                var width = data.rect[2] - data.rect[0];
                var height = data.rect[3] - data.rect[1];
                var svg = this.svgFactory.create(width, height);
                var borderWidth = data.borderStyle.width;
                var circle = this.svgFactory.createElement("svg:ellipse");
                circle.setAttribute("cx", width / 2);
                circle.setAttribute("cy", height / 2);
                circle.setAttribute("rx", width / 2 - borderWidth / 2);
                circle.setAttribute("ry", height / 2 - borderWidth / 2);
                circle.setAttribute("stroke-width", borderWidth);
                circle.setAttribute("stroke", "transparent");
                circle.setAttribute("fill", "none");
                svg.appendChild(circle);
                this.container.append(svg);
                this._createPopup(this.container, circle, data);
                return this.container;
              }
            }]);
            return CircleAnnotationElement2;
          }(AnnotationElement);
          var PolylineAnnotationElement = function(_AnnotationElement8) {
            _inherits(PolylineAnnotationElement2, _AnnotationElement8);
            function PolylineAnnotationElement2(parameters) {
              var _this3;
              _classCallCheck(this, PolylineAnnotationElement2);
              var isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
              _this3 = _possibleConstructorReturn(this, _getPrototypeOf(PolylineAnnotationElement2).call(this, parameters, isRenderable, true));
              _this3.containerClassName = "polylineAnnotation";
              _this3.svgElementName = "svg:polyline";
              return _this3;
            }
            _createClass(PolylineAnnotationElement2, [{
              key: "render",
              value: function render() {
                this.container.className = this.containerClassName;
                var data = this.data;
                var width = data.rect[2] - data.rect[0];
                var height = data.rect[3] - data.rect[1];
                var svg = this.svgFactory.create(width, height);
                var vertices = data.vertices;
                var points = [];
                for (var i = 0, ii = vertices.length; i < ii; i++) {
                  var x = vertices[i].x - data.rect[0];
                  var y = data.rect[3] - vertices[i].y;
                  points.push(x + "," + y);
                }
                points = points.join(" ");
                var borderWidth = data.borderStyle.width;
                var polyline = this.svgFactory.createElement(this.svgElementName);
                polyline.setAttribute("points", points);
                polyline.setAttribute("stroke-width", borderWidth);
                polyline.setAttribute("stroke", "transparent");
                polyline.setAttribute("fill", "none");
                svg.appendChild(polyline);
                this.container.append(svg);
                this._createPopup(this.container, polyline, data);
                return this.container;
              }
            }]);
            return PolylineAnnotationElement2;
          }(AnnotationElement);
          var PolygonAnnotationElement = function(_PolylineAnnotationEl) {
            _inherits(PolygonAnnotationElement2, _PolylineAnnotationEl);
            function PolygonAnnotationElement2(parameters) {
              var _this4;
              _classCallCheck(this, PolygonAnnotationElement2);
              _this4 = _possibleConstructorReturn(this, _getPrototypeOf(PolygonAnnotationElement2).call(this, parameters));
              _this4.containerClassName = "polygonAnnotation";
              _this4.svgElementName = "svg:polygon";
              return _this4;
            }
            return PolygonAnnotationElement2;
          }(PolylineAnnotationElement);
          var InkAnnotationElement = function(_AnnotationElement9) {
            _inherits(InkAnnotationElement2, _AnnotationElement9);
            function InkAnnotationElement2(parameters) {
              var _this5;
              _classCallCheck(this, InkAnnotationElement2);
              var isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
              _this5 = _possibleConstructorReturn(this, _getPrototypeOf(InkAnnotationElement2).call(this, parameters, isRenderable, true));
              _this5.containerClassName = "inkAnnotation";
              _this5.svgElementName = "svg:polyline";
              return _this5;
            }
            _createClass(InkAnnotationElement2, [{
              key: "render",
              value: function render() {
                this.container.className = this.containerClassName;
                var data = this.data;
                var width = data.rect[2] - data.rect[0];
                var height = data.rect[3] - data.rect[1];
                var svg = this.svgFactory.create(width, height);
                var inkLists = data.inkLists;
                for (var i = 0, ii = inkLists.length; i < ii; i++) {
                  var inkList = inkLists[i];
                  var points = [];
                  for (var j = 0, jj = inkList.length; j < jj; j++) {
                    var x = inkList[j].x - data.rect[0];
                    var y = data.rect[3] - inkList[j].y;
                    points.push(x + "," + y);
                  }
                  points = points.join(" ");
                  var borderWidth = data.borderStyle.width;
                  var polyline = this.svgFactory.createElement(this.svgElementName);
                  polyline.setAttribute("points", points);
                  polyline.setAttribute("stroke-width", borderWidth);
                  polyline.setAttribute("stroke", "transparent");
                  polyline.setAttribute("fill", "none");
                  this._createPopup(this.container, polyline, data);
                  svg.appendChild(polyline);
                }
                this.container.append(svg);
                return this.container;
              }
            }]);
            return InkAnnotationElement2;
          }(AnnotationElement);
          var HighlightAnnotationElement = function(_AnnotationElement10) {
            _inherits(HighlightAnnotationElement2, _AnnotationElement10);
            function HighlightAnnotationElement2(parameters) {
              _classCallCheck(this, HighlightAnnotationElement2);
              var isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
              return _possibleConstructorReturn(this, _getPrototypeOf(HighlightAnnotationElement2).call(this, parameters, isRenderable, true));
            }
            _createClass(HighlightAnnotationElement2, [{
              key: "render",
              value: function render() {
                this.container.className = "highlightAnnotation";
                if (!this.data.hasPopup) {
                  this._createPopup(this.container, null, this.data);
                }
                return this.container;
              }
            }]);
            return HighlightAnnotationElement2;
          }(AnnotationElement);
          var UnderlineAnnotationElement = function(_AnnotationElement11) {
            _inherits(UnderlineAnnotationElement2, _AnnotationElement11);
            function UnderlineAnnotationElement2(parameters) {
              _classCallCheck(this, UnderlineAnnotationElement2);
              var isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
              return _possibleConstructorReturn(this, _getPrototypeOf(UnderlineAnnotationElement2).call(this, parameters, isRenderable, true));
            }
            _createClass(UnderlineAnnotationElement2, [{
              key: "render",
              value: function render() {
                this.container.className = "underlineAnnotation";
                if (!this.data.hasPopup) {
                  this._createPopup(this.container, null, this.data);
                }
                return this.container;
              }
            }]);
            return UnderlineAnnotationElement2;
          }(AnnotationElement);
          var SquigglyAnnotationElement = function(_AnnotationElement12) {
            _inherits(SquigglyAnnotationElement2, _AnnotationElement12);
            function SquigglyAnnotationElement2(parameters) {
              _classCallCheck(this, SquigglyAnnotationElement2);
              var isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
              return _possibleConstructorReturn(this, _getPrototypeOf(SquigglyAnnotationElement2).call(this, parameters, isRenderable, true));
            }
            _createClass(SquigglyAnnotationElement2, [{
              key: "render",
              value: function render() {
                this.container.className = "squigglyAnnotation";
                if (!this.data.hasPopup) {
                  this._createPopup(this.container, null, this.data);
                }
                return this.container;
              }
            }]);
            return SquigglyAnnotationElement2;
          }(AnnotationElement);
          var StrikeOutAnnotationElement = function(_AnnotationElement13) {
            _inherits(StrikeOutAnnotationElement2, _AnnotationElement13);
            function StrikeOutAnnotationElement2(parameters) {
              _classCallCheck(this, StrikeOutAnnotationElement2);
              var isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
              return _possibleConstructorReturn(this, _getPrototypeOf(StrikeOutAnnotationElement2).call(this, parameters, isRenderable, true));
            }
            _createClass(StrikeOutAnnotationElement2, [{
              key: "render",
              value: function render() {
                this.container.className = "strikeoutAnnotation";
                if (!this.data.hasPopup) {
                  this._createPopup(this.container, null, this.data);
                }
                return this.container;
              }
            }]);
            return StrikeOutAnnotationElement2;
          }(AnnotationElement);
          var StampAnnotationElement = function(_AnnotationElement14) {
            _inherits(StampAnnotationElement2, _AnnotationElement14);
            function StampAnnotationElement2(parameters) {
              _classCallCheck(this, StampAnnotationElement2);
              var isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
              return _possibleConstructorReturn(this, _getPrototypeOf(StampAnnotationElement2).call(this, parameters, isRenderable, true));
            }
            _createClass(StampAnnotationElement2, [{
              key: "render",
              value: function render() {
                this.container.className = "stampAnnotation";
                if (!this.data.hasPopup) {
                  this._createPopup(this.container, null, this.data);
                }
                return this.container;
              }
            }]);
            return StampAnnotationElement2;
          }(AnnotationElement);
          var FileAttachmentAnnotationElement = function(_AnnotationElement15) {
            _inherits(FileAttachmentAnnotationElement2, _AnnotationElement15);
            function FileAttachmentAnnotationElement2(parameters) {
              var _this6;
              _classCallCheck(this, FileAttachmentAnnotationElement2);
              _this6 = _possibleConstructorReturn(this, _getPrototypeOf(FileAttachmentAnnotationElement2).call(this, parameters, true));
              var _this6$data$file = _this6.data.file, filename = _this6$data$file.filename, content = _this6$data$file.content;
              _this6.filename = (0, _dom_utils.getFilenameFromUrl)(filename);
              _this6.content = content;
              if (_this6.linkService.eventBus) {
                _this6.linkService.eventBus.dispatch("fileattachmentannotation", {
                  source: _assertThisInitialized(_assertThisInitialized(_this6)),
                  id: (0, _util.stringToPDFString)(filename),
                  filename,
                  content
                });
              }
              return _this6;
            }
            _createClass(FileAttachmentAnnotationElement2, [{
              key: "render",
              value: function render() {
                this.container.className = "fileAttachmentAnnotation";
                var trigger = document.createElement("div");
                trigger.style.height = this.container.style.height;
                trigger.style.width = this.container.style.width;
                trigger.addEventListener("dblclick", this._download.bind(this));
                if (!this.data.hasPopup && (this.data.title || this.data.contents)) {
                  this._createPopup(this.container, trigger, this.data);
                }
                this.container.appendChild(trigger);
                return this.container;
              }
            }, {
              key: "_download",
              value: function _download() {
                if (!this.downloadManager) {
                  (0, _util.warn)("Download cannot be started due to unavailable download manager");
                  return;
                }
                this.downloadManager.downloadData(this.content, this.filename, "");
              }
            }]);
            return FileAttachmentAnnotationElement2;
          }(AnnotationElement);
          var AnnotationLayer = function() {
            function AnnotationLayer2() {
              _classCallCheck(this, AnnotationLayer2);
            }
            _createClass(AnnotationLayer2, null, [{
              key: "render",
              value: function render(parameters) {
                for (var i = 0, ii = parameters.annotations.length; i < ii; i++) {
                  var data = parameters.annotations[i];
                  if (!data) {
                    continue;
                  }
                  var element = AnnotationElementFactory.create({
                    data,
                    layer: parameters.div,
                    page: parameters.page,
                    viewport: parameters.viewport,
                    linkService: parameters.linkService,
                    downloadManager: parameters.downloadManager,
                    imageResourcesPath: parameters.imageResourcesPath || "",
                    renderInteractiveForms: parameters.renderInteractiveForms || false,
                    svgFactory: new _dom_utils.DOMSVGFactory()
                  });
                  if (element.isRenderable) {
                    parameters.div.appendChild(element.render());
                  }
                }
              }
            }, {
              key: "update",
              value: function update(parameters) {
                for (var i = 0, ii = parameters.annotations.length; i < ii; i++) {
                  var data = parameters.annotations[i];
                  var element = parameters.div.querySelector('[data-annotation-id="' + data.id + '"]');
                  if (element) {
                    element.style.transform = "matrix(" + parameters.viewport.transform.join(",") + ")";
                  }
                }
                parameters.div.removeAttribute("hidden");
              }
            }]);
            return AnnotationLayer2;
          }();
          exports2.AnnotationLayer = AnnotationLayer;
        },
        /* 164 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.SVGGraphics = void 0;
          var _util = __w_pdfjs_require__(1);
          var _dom_utils = __w_pdfjs_require__(151);
          var _is_node = _interopRequireDefault(__w_pdfjs_require__(4));
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          var SVGGraphics = function SVGGraphics2() {
            throw new Error("Not implemented: SVGGraphics");
          };
          exports2.SVGGraphics = SVGGraphics;
          {
            var SVG_DEFAULTS = {
              fontStyle: "normal",
              fontWeight: "normal",
              fillColor: "#000000"
            };
            var convertImgDataToPng = function convertImgDataToPngClosure() {
              var PNG_HEADER = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
              var CHUNK_WRAPPER_SIZE = 12;
              var crcTable = new Int32Array(256);
              for (var i = 0; i < 256; i++) {
                var c2 = i;
                for (var h = 0; h < 8; h++) {
                  if (c2 & 1) {
                    c2 = 3988292384 ^ c2 >> 1 & 2147483647;
                  } else {
                    c2 = c2 >> 1 & 2147483647;
                  }
                }
                crcTable[i] = c2;
              }
              function crc32(data, start, end) {
                var crc = -1;
                for (var i2 = start; i2 < end; i2++) {
                  var a2 = (crc ^ data[i2]) & 255;
                  var b = crcTable[a2];
                  crc = crc >>> 8 ^ b;
                }
                return crc ^ -1;
              }
              function writePngChunk(type, body, data, offset) {
                var p = offset;
                var len = body.length;
                data[p] = len >> 24 & 255;
                data[p + 1] = len >> 16 & 255;
                data[p + 2] = len >> 8 & 255;
                data[p + 3] = len & 255;
                p += 4;
                data[p] = type.charCodeAt(0) & 255;
                data[p + 1] = type.charCodeAt(1) & 255;
                data[p + 2] = type.charCodeAt(2) & 255;
                data[p + 3] = type.charCodeAt(3) & 255;
                p += 4;
                data.set(body, p);
                p += body.length;
                var crc = crc32(data, offset + 4, p);
                data[p] = crc >> 24 & 255;
                data[p + 1] = crc >> 16 & 255;
                data[p + 2] = crc >> 8 & 255;
                data[p + 3] = crc & 255;
              }
              function adler32(data, start, end) {
                var a2 = 1;
                var b = 0;
                for (var i2 = start; i2 < end; ++i2) {
                  a2 = (a2 + (data[i2] & 255)) % 65521;
                  b = (b + a2) % 65521;
                }
                return b << 16 | a2;
              }
              function deflateSync(literals) {
                if (!(0, _is_node.default)()) {
                  return deflateSyncUncompressed(literals);
                }
                try {
                  var input;
                  if (parseInt(process.versions.node) >= 8) {
                    input = literals;
                  } else {
                    input = new Buffer(literals);
                  }
                  var output = require$$5.deflateSync(input, {
                    level: 9
                  });
                  return output instanceof Uint8Array ? output : new Uint8Array(output);
                } catch (e) {
                  (0, _util.warn)("Not compressing PNG because zlib.deflateSync is unavailable: " + e);
                }
                return deflateSyncUncompressed(literals);
              }
              function deflateSyncUncompressed(literals) {
                var len = literals.length;
                var maxBlockLength = 65535;
                var deflateBlocks = Math.ceil(len / maxBlockLength);
                var idat = new Uint8Array(2 + len + deflateBlocks * 5 + 4);
                var pi = 0;
                idat[pi++] = 120;
                idat[pi++] = 156;
                var pos = 0;
                while (len > maxBlockLength) {
                  idat[pi++] = 0;
                  idat[pi++] = 255;
                  idat[pi++] = 255;
                  idat[pi++] = 0;
                  idat[pi++] = 0;
                  idat.set(literals.subarray(pos, pos + maxBlockLength), pi);
                  pi += maxBlockLength;
                  pos += maxBlockLength;
                  len -= maxBlockLength;
                }
                idat[pi++] = 1;
                idat[pi++] = len & 255;
                idat[pi++] = len >> 8 & 255;
                idat[pi++] = ~len & 65535 & 255;
                idat[pi++] = (~len & 65535) >> 8 & 255;
                idat.set(literals.subarray(pos), pi);
                pi += literals.length - pos;
                var adler = adler32(literals, 0, literals.length);
                idat[pi++] = adler >> 24 & 255;
                idat[pi++] = adler >> 16 & 255;
                idat[pi++] = adler >> 8 & 255;
                idat[pi++] = adler & 255;
                return idat;
              }
              function encode2(imgData, kind, forceDataSchema, isMask) {
                var width = imgData.width;
                var height = imgData.height;
                var bitDepth, colorType, lineSize;
                var bytes = imgData.data;
                switch (kind) {
                  case _util.ImageKind.GRAYSCALE_1BPP:
                    colorType = 0;
                    bitDepth = 1;
                    lineSize = width + 7 >> 3;
                    break;
                  case _util.ImageKind.RGB_24BPP:
                    colorType = 2;
                    bitDepth = 8;
                    lineSize = width * 3;
                    break;
                  case _util.ImageKind.RGBA_32BPP:
                    colorType = 6;
                    bitDepth = 8;
                    lineSize = width * 4;
                    break;
                  default:
                    throw new Error("invalid format");
                }
                var literals = new Uint8Array((1 + lineSize) * height);
                var offsetLiterals = 0, offsetBytes = 0;
                var y, i2;
                for (y = 0; y < height; ++y) {
                  literals[offsetLiterals++] = 0;
                  literals.set(bytes.subarray(offsetBytes, offsetBytes + lineSize), offsetLiterals);
                  offsetBytes += lineSize;
                  offsetLiterals += lineSize;
                }
                if (kind === _util.ImageKind.GRAYSCALE_1BPP && isMask) {
                  offsetLiterals = 0;
                  for (y = 0; y < height; y++) {
                    offsetLiterals++;
                    for (i2 = 0; i2 < lineSize; i2++) {
                      literals[offsetLiterals++] ^= 255;
                    }
                  }
                }
                var ihdr = new Uint8Array([width >> 24 & 255, width >> 16 & 255, width >> 8 & 255, width & 255, height >> 24 & 255, height >> 16 & 255, height >> 8 & 255, height & 255, bitDepth, colorType, 0, 0, 0]);
                var idat = deflateSync(literals);
                var pngLength = PNG_HEADER.length + CHUNK_WRAPPER_SIZE * 3 + ihdr.length + idat.length;
                var data = new Uint8Array(pngLength);
                var offset = 0;
                data.set(PNG_HEADER, offset);
                offset += PNG_HEADER.length;
                writePngChunk("IHDR", ihdr, data, offset);
                offset += CHUNK_WRAPPER_SIZE + ihdr.length;
                writePngChunk("IDATA", idat, data, offset);
                offset += CHUNK_WRAPPER_SIZE + idat.length;
                writePngChunk("IEND", new Uint8Array(0), data, offset);
                return (0, _util.createObjectURL)(data, "image/png", forceDataSchema);
              }
              return function convertImgDataToPng2(imgData, forceDataSchema, isMask) {
                var kind = imgData.kind === void 0 ? _util.ImageKind.GRAYSCALE_1BPP : imgData.kind;
                return encode2(imgData, kind, forceDataSchema, isMask);
              };
            }();
            var SVGExtraState = function SVGExtraStateClosure() {
              function SVGExtraState2() {
                this.fontSizeScale = 1;
                this.fontWeight = SVG_DEFAULTS.fontWeight;
                this.fontSize = 0;
                this.textMatrix = _util.IDENTITY_MATRIX;
                this.fontMatrix = _util.FONT_IDENTITY_MATRIX;
                this.leading = 0;
                this.textRenderingMode = _util.TextRenderingMode.FILL;
                this.x = 0;
                this.y = 0;
                this.lineX = 0;
                this.lineY = 0;
                this.charSpacing = 0;
                this.wordSpacing = 0;
                this.textHScale = 1;
                this.textRise = 0;
                this.fillColor = SVG_DEFAULTS.fillColor;
                this.strokeColor = "#000000";
                this.fillAlpha = 1;
                this.strokeAlpha = 1;
                this.lineWidth = 1;
                this.lineJoin = "";
                this.lineCap = "";
                this.miterLimit = 0;
                this.dashArray = [];
                this.dashPhase = 0;
                this.dependencies = [];
                this.activeClipUrl = null;
                this.clipGroup = null;
                this.maskId = "";
              }
              SVGExtraState2.prototype = {
                clone: function SVGExtraState_clone() {
                  return Object.create(this);
                },
                setCurrentPoint: function SVGExtraState_setCurrentPoint(x, y) {
                  this.x = x;
                  this.y = y;
                }
              };
              return SVGExtraState2;
            }();
            exports2.SVGGraphics = SVGGraphics = function SVGGraphicsClosure() {
              function opListToTree(opList) {
                var opTree = [];
                var tmp = [];
                var opListLen = opList.length;
                for (var x = 0; x < opListLen; x++) {
                  if (opList[x].fn === "save") {
                    opTree.push({
                      "fnId": 92,
                      "fn": "group",
                      "items": []
                    });
                    tmp.push(opTree);
                    opTree = opTree[opTree.length - 1].items;
                    continue;
                  }
                  if (opList[x].fn === "restore") {
                    opTree = tmp.pop();
                  } else {
                    opTree.push(opList[x]);
                  }
                }
                return opTree;
              }
              function pf(value) {
                if (Number.isInteger(value)) {
                  return value.toString();
                }
                var s = value.toFixed(10);
                var i = s.length - 1;
                if (s[i] !== "0") {
                  return s;
                }
                do {
                  i--;
                } while (s[i] === "0");
                return s.substring(0, s[i] === "." ? i : i + 1);
              }
              function pm(m) {
                if (m[4] === 0 && m[5] === 0) {
                  if (m[1] === 0 && m[2] === 0) {
                    if (m[0] === 1 && m[3] === 1) {
                      return "";
                    }
                    return "scale(" + pf(m[0]) + " " + pf(m[3]) + ")";
                  }
                  if (m[0] === m[3] && m[1] === -m[2]) {
                    var a2 = Math.acos(m[0]) * 180 / Math.PI;
                    return "rotate(" + pf(a2) + ")";
                  }
                } else {
                  if (m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1) {
                    return "translate(" + pf(m[4]) + " " + pf(m[5]) + ")";
                  }
                }
                return "matrix(" + pf(m[0]) + " " + pf(m[1]) + " " + pf(m[2]) + " " + pf(m[3]) + " " + pf(m[4]) + " " + pf(m[5]) + ")";
              }
              function SVGGraphics2(commonObjs, objs, forceDataSchema) {
                this.svgFactory = new _dom_utils.DOMSVGFactory();
                this.current = new SVGExtraState();
                this.transformMatrix = _util.IDENTITY_MATRIX;
                this.transformStack = [];
                this.extraStack = [];
                this.commonObjs = commonObjs;
                this.objs = objs;
                this.pendingClip = null;
                this.pendingEOFill = false;
                this.embedFonts = false;
                this.embeddedFonts = /* @__PURE__ */ Object.create(null);
                this.cssStyle = null;
                this.forceDataSchema = !!forceDataSchema;
              }
              var XML_NS = "http://www.w3.org/XML/1998/namespace";
              var XLINK_NS = "http://www.w3.org/1999/xlink";
              var LINE_CAP_STYLES = ["butt", "round", "square"];
              var LINE_JOIN_STYLES = ["miter", "round", "bevel"];
              var clipCount = 0;
              var maskCount = 0;
              SVGGraphics2.prototype = {
                save: function SVGGraphics_save() {
                  this.transformStack.push(this.transformMatrix);
                  var old = this.current;
                  this.extraStack.push(old);
                  this.current = old.clone();
                },
                restore: function SVGGraphics_restore() {
                  this.transformMatrix = this.transformStack.pop();
                  this.current = this.extraStack.pop();
                  this.pendingClip = null;
                  this.tgrp = null;
                },
                group: function SVGGraphics_group(items) {
                  this.save();
                  this.executeOpTree(items);
                  this.restore();
                },
                loadDependencies: function SVGGraphics_loadDependencies(operatorList) {
                  var _this = this;
                  var fnArray = operatorList.fnArray;
                  var fnArrayLen = fnArray.length;
                  var argsArray = operatorList.argsArray;
                  for (var i = 0; i < fnArrayLen; i++) {
                    if (_util.OPS.dependency === fnArray[i]) {
                      var deps = argsArray[i];
                      for (var n2 = 0, nn = deps.length; n2 < nn; n2++) {
                        var obj = deps[n2];
                        var common = obj.substring(0, 2) === "g_";
                        var promise;
                        if (common) {
                          promise = new Promise(function(resolve) {
                            _this.commonObjs.get(obj, resolve);
                          });
                        } else {
                          promise = new Promise(function(resolve) {
                            _this.objs.get(obj, resolve);
                          });
                        }
                        this.current.dependencies.push(promise);
                      }
                    }
                  }
                  return Promise.all(this.current.dependencies);
                },
                transform: function SVGGraphics_transform(a2, b, c2, d, e, f) {
                  var transformMatrix = [a2, b, c2, d, e, f];
                  this.transformMatrix = _util.Util.transform(this.transformMatrix, transformMatrix);
                  this.tgrp = null;
                },
                getSVG: function SVGGraphics_getSVG(operatorList, viewport) {
                  var _this2 = this;
                  this.viewport = viewport;
                  var svgElement = this._initialize(viewport);
                  return this.loadDependencies(operatorList).then(function() {
                    _this2.transformMatrix = _util.IDENTITY_MATRIX;
                    var opTree = _this2.convertOpList(operatorList);
                    _this2.executeOpTree(opTree);
                    return svgElement;
                  });
                },
                convertOpList: function SVGGraphics_convertOpList(operatorList) {
                  var argsArray = operatorList.argsArray;
                  var fnArray = operatorList.fnArray;
                  var fnArrayLen = fnArray.length;
                  var REVOPS = [];
                  var opList = [];
                  for (var op in _util.OPS) {
                    REVOPS[_util.OPS[op]] = op;
                  }
                  for (var x = 0; x < fnArrayLen; x++) {
                    var fnId = fnArray[x];
                    opList.push({
                      "fnId": fnId,
                      "fn": REVOPS[fnId],
                      "args": argsArray[x]
                    });
                  }
                  return opListToTree(opList);
                },
                executeOpTree: function SVGGraphics_executeOpTree(opTree) {
                  var opTreeLen = opTree.length;
                  for (var x = 0; x < opTreeLen; x++) {
                    var fn = opTree[x].fn;
                    var fnId = opTree[x].fnId;
                    var args = opTree[x].args;
                    switch (fnId | 0) {
                      case _util.OPS.beginText:
                        this.beginText();
                        break;
                      case _util.OPS.dependency:
                        break;
                      case _util.OPS.setLeading:
                        this.setLeading(args);
                        break;
                      case _util.OPS.setLeadingMoveText:
                        this.setLeadingMoveText(args[0], args[1]);
                        break;
                      case _util.OPS.setFont:
                        this.setFont(args);
                        break;
                      case _util.OPS.showText:
                        this.showText(args[0]);
                        break;
                      case _util.OPS.showSpacedText:
                        this.showText(args[0]);
                        break;
                      case _util.OPS.endText:
                        this.endText();
                        break;
                      case _util.OPS.moveText:
                        this.moveText(args[0], args[1]);
                        break;
                      case _util.OPS.setCharSpacing:
                        this.setCharSpacing(args[0]);
                        break;
                      case _util.OPS.setWordSpacing:
                        this.setWordSpacing(args[0]);
                        break;
                      case _util.OPS.setHScale:
                        this.setHScale(args[0]);
                        break;
                      case _util.OPS.setTextMatrix:
                        this.setTextMatrix(args[0], args[1], args[2], args[3], args[4], args[5]);
                        break;
                      case _util.OPS.setTextRise:
                        this.setTextRise(args[0]);
                        break;
                      case _util.OPS.setTextRenderingMode:
                        this.setTextRenderingMode(args[0]);
                        break;
                      case _util.OPS.setLineWidth:
                        this.setLineWidth(args[0]);
                        break;
                      case _util.OPS.setLineJoin:
                        this.setLineJoin(args[0]);
                        break;
                      case _util.OPS.setLineCap:
                        this.setLineCap(args[0]);
                        break;
                      case _util.OPS.setMiterLimit:
                        this.setMiterLimit(args[0]);
                        break;
                      case _util.OPS.setFillRGBColor:
                        this.setFillRGBColor(args[0], args[1], args[2]);
                        break;
                      case _util.OPS.setStrokeRGBColor:
                        this.setStrokeRGBColor(args[0], args[1], args[2]);
                        break;
                      case _util.OPS.setDash:
                        this.setDash(args[0], args[1]);
                        break;
                      case _util.OPS.setGState:
                        this.setGState(args[0]);
                        break;
                      case _util.OPS.fill:
                        this.fill();
                        break;
                      case _util.OPS.eoFill:
                        this.eoFill();
                        break;
                      case _util.OPS.stroke:
                        this.stroke();
                        break;
                      case _util.OPS.fillStroke:
                        this.fillStroke();
                        break;
                      case _util.OPS.eoFillStroke:
                        this.eoFillStroke();
                        break;
                      case _util.OPS.clip:
                        this.clip("nonzero");
                        break;
                      case _util.OPS.eoClip:
                        this.clip("evenodd");
                        break;
                      case _util.OPS.paintSolidColorImageMask:
                        this.paintSolidColorImageMask();
                        break;
                      case _util.OPS.paintJpegXObject:
                        this.paintJpegXObject(args[0], args[1], args[2]);
                        break;
                      case _util.OPS.paintImageXObject:
                        this.paintImageXObject(args[0]);
                        break;
                      case _util.OPS.paintInlineImageXObject:
                        this.paintInlineImageXObject(args[0]);
                        break;
                      case _util.OPS.paintImageMaskXObject:
                        this.paintImageMaskXObject(args[0]);
                        break;
                      case _util.OPS.paintFormXObjectBegin:
                        this.paintFormXObjectBegin(args[0], args[1]);
                        break;
                      case _util.OPS.paintFormXObjectEnd:
                        this.paintFormXObjectEnd();
                        break;
                      case _util.OPS.closePath:
                        this.closePath();
                        break;
                      case _util.OPS.closeStroke:
                        this.closeStroke();
                        break;
                      case _util.OPS.closeFillStroke:
                        this.closeFillStroke();
                        break;
                      case _util.OPS.closeEOFillStroke:
                        this.closeEOFillStroke();
                        break;
                      case _util.OPS.nextLine:
                        this.nextLine();
                        break;
                      case _util.OPS.transform:
                        this.transform(args[0], args[1], args[2], args[3], args[4], args[5]);
                        break;
                      case _util.OPS.constructPath:
                        this.constructPath(args[0], args[1]);
                        break;
                      case _util.OPS.endPath:
                        this.endPath();
                        break;
                      case 92:
                        this.group(opTree[x].items);
                        break;
                      default:
                        (0, _util.warn)("Unimplemented operator " + fn);
                        break;
                    }
                  }
                },
                setWordSpacing: function SVGGraphics_setWordSpacing(wordSpacing) {
                  this.current.wordSpacing = wordSpacing;
                },
                setCharSpacing: function SVGGraphics_setCharSpacing(charSpacing) {
                  this.current.charSpacing = charSpacing;
                },
                nextLine: function SVGGraphics_nextLine() {
                  this.moveText(0, this.current.leading);
                },
                setTextMatrix: function SVGGraphics_setTextMatrix(a2, b, c2, d, e, f) {
                  var current = this.current;
                  this.current.textMatrix = this.current.lineMatrix = [a2, b, c2, d, e, f];
                  this.current.x = this.current.lineX = 0;
                  this.current.y = this.current.lineY = 0;
                  current.xcoords = [];
                  current.tspan = this.svgFactory.createElement("svg:tspan");
                  current.tspan.setAttributeNS(null, "font-family", current.fontFamily);
                  current.tspan.setAttributeNS(null, "font-size", pf(current.fontSize) + "px");
                  current.tspan.setAttributeNS(null, "y", pf(-current.y));
                  current.txtElement = this.svgFactory.createElement("svg:text");
                  current.txtElement.appendChild(current.tspan);
                },
                beginText: function SVGGraphics_beginText() {
                  this.current.x = this.current.lineX = 0;
                  this.current.y = this.current.lineY = 0;
                  this.current.textMatrix = _util.IDENTITY_MATRIX;
                  this.current.lineMatrix = _util.IDENTITY_MATRIX;
                  this.current.tspan = this.svgFactory.createElement("svg:tspan");
                  this.current.txtElement = this.svgFactory.createElement("svg:text");
                  this.current.txtgrp = this.svgFactory.createElement("svg:g");
                  this.current.xcoords = [];
                },
                moveText: function SVGGraphics_moveText(x, y) {
                  var current = this.current;
                  this.current.x = this.current.lineX += x;
                  this.current.y = this.current.lineY += y;
                  current.xcoords = [];
                  current.tspan = this.svgFactory.createElement("svg:tspan");
                  current.tspan.setAttributeNS(null, "font-family", current.fontFamily);
                  current.tspan.setAttributeNS(null, "font-size", pf(current.fontSize) + "px");
                  current.tspan.setAttributeNS(null, "y", pf(-current.y));
                },
                showText: function SVGGraphics_showText(glyphs) {
                  var current = this.current;
                  var font = current.font;
                  var fontSize = current.fontSize;
                  if (fontSize === 0) {
                    return;
                  }
                  var charSpacing = current.charSpacing;
                  var wordSpacing = current.wordSpacing;
                  var fontDirection = current.fontDirection;
                  var textHScale = current.textHScale * fontDirection;
                  var glyphsLength = glyphs.length;
                  var vertical = font.vertical;
                  var widthAdvanceScale = fontSize * current.fontMatrix[0];
                  var x = 0, i;
                  for (i = 0; i < glyphsLength; ++i) {
                    var glyph = glyphs[i];
                    if (glyph === null) {
                      x += fontDirection * wordSpacing;
                      continue;
                    } else if ((0, _util.isNum)(glyph)) {
                      x += -glyph * fontSize * 1e-3;
                      continue;
                    }
                    var width = glyph.width;
                    var character = glyph.fontChar;
                    var spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
                    var charWidth = width * widthAdvanceScale + spacing * fontDirection;
                    if (!glyph.isInFont && !font.missingFile) {
                      x += charWidth;
                      continue;
                    }
                    current.xcoords.push(current.x + x * textHScale);
                    current.tspan.textContent += character;
                    x += charWidth;
                  }
                  if (vertical) {
                    current.y -= x * textHScale;
                  } else {
                    current.x += x * textHScale;
                  }
                  current.tspan.setAttributeNS(null, "x", current.xcoords.map(pf).join(" "));
                  current.tspan.setAttributeNS(null, "y", pf(-current.y));
                  current.tspan.setAttributeNS(null, "font-family", current.fontFamily);
                  current.tspan.setAttributeNS(null, "font-size", pf(current.fontSize) + "px");
                  if (current.fontStyle !== SVG_DEFAULTS.fontStyle) {
                    current.tspan.setAttributeNS(null, "font-style", current.fontStyle);
                  }
                  if (current.fontWeight !== SVG_DEFAULTS.fontWeight) {
                    current.tspan.setAttributeNS(null, "font-weight", current.fontWeight);
                  }
                  var fillStrokeMode = current.textRenderingMode & _util.TextRenderingMode.FILL_STROKE_MASK;
                  if (fillStrokeMode === _util.TextRenderingMode.FILL || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
                    if (current.fillColor !== SVG_DEFAULTS.fillColor) {
                      current.tspan.setAttributeNS(null, "fill", current.fillColor);
                    }
                    if (current.fillAlpha < 1) {
                      current.tspan.setAttributeNS(null, "fill-opacity", current.fillAlpha);
                    }
                  } else if (current.textRenderingMode === _util.TextRenderingMode.ADD_TO_PATH) {
                    current.tspan.setAttributeNS(null, "fill", "transparent");
                  } else {
                    current.tspan.setAttributeNS(null, "fill", "none");
                  }
                  if (fillStrokeMode === _util.TextRenderingMode.STROKE || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
                    this._setStrokeAttributes(current.tspan);
                  }
                  var textMatrix = current.textMatrix;
                  if (current.textRise !== 0) {
                    textMatrix = textMatrix.slice();
                    textMatrix[5] += current.textRise;
                  }
                  current.txtElement.setAttributeNS(null, "transform", pm(textMatrix) + " scale(1, -1)");
                  current.txtElement.setAttributeNS(XML_NS, "xml:space", "preserve");
                  current.txtElement.appendChild(current.tspan);
                  current.txtgrp.appendChild(current.txtElement);
                  this._ensureTransformGroup().appendChild(current.txtElement);
                },
                setLeadingMoveText: function SVGGraphics_setLeadingMoveText(x, y) {
                  this.setLeading(-y);
                  this.moveText(x, y);
                },
                addFontStyle: function SVGGraphics_addFontStyle(fontObj) {
                  if (!this.cssStyle) {
                    this.cssStyle = this.svgFactory.createElement("svg:style");
                    this.cssStyle.setAttributeNS(null, "type", "text/css");
                    this.defs.appendChild(this.cssStyle);
                  }
                  var url = (0, _util.createObjectURL)(fontObj.data, fontObj.mimetype, this.forceDataSchema);
                  this.cssStyle.textContent += '@font-face { font-family: "' + fontObj.loadedName + '"; src: url(' + url + "); }\n";
                },
                setFont: function SVGGraphics_setFont(details) {
                  var current = this.current;
                  var fontObj = this.commonObjs.get(details[0]);
                  var size = details[1];
                  this.current.font = fontObj;
                  if (this.embedFonts && fontObj.data && !this.embeddedFonts[fontObj.loadedName]) {
                    this.addFontStyle(fontObj);
                    this.embeddedFonts[fontObj.loadedName] = fontObj;
                  }
                  current.fontMatrix = fontObj.fontMatrix ? fontObj.fontMatrix : _util.FONT_IDENTITY_MATRIX;
                  var bold = fontObj.black ? fontObj.bold ? "bolder" : "bold" : fontObj.bold ? "bold" : "normal";
                  var italic = fontObj.italic ? "italic" : "normal";
                  if (size < 0) {
                    size = -size;
                    current.fontDirection = -1;
                  } else {
                    current.fontDirection = 1;
                  }
                  current.fontSize = size;
                  current.fontFamily = fontObj.loadedName;
                  current.fontWeight = bold;
                  current.fontStyle = italic;
                  current.tspan = this.svgFactory.createElement("svg:tspan");
                  current.tspan.setAttributeNS(null, "y", pf(-current.y));
                  current.xcoords = [];
                },
                endText: function endText() {
                  var current = this.current;
                  if (current.textRenderingMode & _util.TextRenderingMode.ADD_TO_PATH_FLAG && current.txtElement && current.txtElement.hasChildNodes()) {
                    current.element = current.txtElement;
                    this.clip("nonzero");
                    this.endPath();
                  }
                },
                setLineWidth: function SVGGraphics_setLineWidth(width) {
                  if (width > 0) {
                    this.current.lineWidth = width;
                  }
                },
                setLineCap: function SVGGraphics_setLineCap(style) {
                  this.current.lineCap = LINE_CAP_STYLES[style];
                },
                setLineJoin: function SVGGraphics_setLineJoin(style) {
                  this.current.lineJoin = LINE_JOIN_STYLES[style];
                },
                setMiterLimit: function SVGGraphics_setMiterLimit(limit) {
                  this.current.miterLimit = limit;
                },
                setStrokeAlpha: function SVGGraphics_setStrokeAlpha(strokeAlpha) {
                  this.current.strokeAlpha = strokeAlpha;
                },
                setStrokeRGBColor: function SVGGraphics_setStrokeRGBColor(r2, g, b) {
                  var color = _util.Util.makeCssRgb(r2, g, b);
                  this.current.strokeColor = color;
                },
                setFillAlpha: function SVGGraphics_setFillAlpha(fillAlpha) {
                  this.current.fillAlpha = fillAlpha;
                },
                setFillRGBColor: function SVGGraphics_setFillRGBColor(r2, g, b) {
                  var color = _util.Util.makeCssRgb(r2, g, b);
                  this.current.fillColor = color;
                  this.current.tspan = this.svgFactory.createElement("svg:tspan");
                  this.current.xcoords = [];
                },
                setDash: function SVGGraphics_setDash(dashArray, dashPhase) {
                  this.current.dashArray = dashArray;
                  this.current.dashPhase = dashPhase;
                },
                constructPath: function SVGGraphics_constructPath(ops, args) {
                  var current = this.current;
                  var x = current.x, y = current.y;
                  current.path = this.svgFactory.createElement("svg:path");
                  var d = [];
                  var opLength = ops.length;
                  for (var i = 0, j = 0; i < opLength; i++) {
                    switch (ops[i] | 0) {
                      case _util.OPS.rectangle:
                        x = args[j++];
                        y = args[j++];
                        var width = args[j++];
                        var height = args[j++];
                        var xw = x + width;
                        var yh = y + height;
                        d.push("M", pf(x), pf(y), "L", pf(xw), pf(y), "L", pf(xw), pf(yh), "L", pf(x), pf(yh), "Z");
                        break;
                      case _util.OPS.moveTo:
                        x = args[j++];
                        y = args[j++];
                        d.push("M", pf(x), pf(y));
                        break;
                      case _util.OPS.lineTo:
                        x = args[j++];
                        y = args[j++];
                        d.push("L", pf(x), pf(y));
                        break;
                      case _util.OPS.curveTo:
                        x = args[j + 4];
                        y = args[j + 5];
                        d.push("C", pf(args[j]), pf(args[j + 1]), pf(args[j + 2]), pf(args[j + 3]), pf(x), pf(y));
                        j += 6;
                        break;
                      case _util.OPS.curveTo2:
                        x = args[j + 2];
                        y = args[j + 3];
                        d.push("C", pf(x), pf(y), pf(args[j]), pf(args[j + 1]), pf(args[j + 2]), pf(args[j + 3]));
                        j += 4;
                        break;
                      case _util.OPS.curveTo3:
                        x = args[j + 2];
                        y = args[j + 3];
                        d.push("C", pf(args[j]), pf(args[j + 1]), pf(x), pf(y), pf(x), pf(y));
                        j += 4;
                        break;
                      case _util.OPS.closePath:
                        d.push("Z");
                        break;
                    }
                  }
                  current.path.setAttributeNS(null, "d", d.join(" "));
                  current.path.setAttributeNS(null, "fill", "none");
                  this._ensureTransformGroup().appendChild(current.path);
                  current.element = current.path;
                  current.setCurrentPoint(x, y);
                },
                endPath: function SVGGraphics_endPath() {
                  if (!this.pendingClip) {
                    return;
                  }
                  var current = this.current;
                  var clipId = "clippath" + clipCount;
                  clipCount++;
                  var clipPath = this.svgFactory.createElement("svg:clipPath");
                  clipPath.setAttributeNS(null, "id", clipId);
                  clipPath.setAttributeNS(null, "transform", pm(this.transformMatrix));
                  var clipElement = current.element.cloneNode(true);
                  if (this.pendingClip === "evenodd") {
                    clipElement.setAttributeNS(null, "clip-rule", "evenodd");
                  } else {
                    clipElement.setAttributeNS(null, "clip-rule", "nonzero");
                  }
                  this.pendingClip = null;
                  clipPath.appendChild(clipElement);
                  this.defs.appendChild(clipPath);
                  if (current.activeClipUrl) {
                    current.clipGroup = null;
                    this.extraStack.forEach(function(prev) {
                      prev.clipGroup = null;
                    });
                    clipPath.setAttributeNS(null, "clip-path", current.activeClipUrl);
                  }
                  current.activeClipUrl = "url(#" + clipId + ")";
                  this.tgrp = null;
                },
                clip: function SVGGraphics_clip(type) {
                  this.pendingClip = type;
                },
                closePath: function SVGGraphics_closePath() {
                  var current = this.current;
                  if (current.path) {
                    var d = current.path.getAttributeNS(null, "d");
                    d += "Z";
                    current.path.setAttributeNS(null, "d", d);
                  }
                },
                setLeading: function SVGGraphics_setLeading(leading) {
                  this.current.leading = -leading;
                },
                setTextRise: function SVGGraphics_setTextRise(textRise) {
                  this.current.textRise = textRise;
                },
                setTextRenderingMode: function setTextRenderingMode(textRenderingMode) {
                  this.current.textRenderingMode = textRenderingMode;
                },
                setHScale: function SVGGraphics_setHScale(scale) {
                  this.current.textHScale = scale / 100;
                },
                setGState: function SVGGraphics_setGState(states) {
                  for (var i = 0, ii = states.length; i < ii; i++) {
                    var state = states[i];
                    var key = state[0];
                    var value = state[1];
                    switch (key) {
                      case "LW":
                        this.setLineWidth(value);
                        break;
                      case "LC":
                        this.setLineCap(value);
                        break;
                      case "LJ":
                        this.setLineJoin(value);
                        break;
                      case "ML":
                        this.setMiterLimit(value);
                        break;
                      case "D":
                        this.setDash(value[0], value[1]);
                        break;
                      case "Font":
                        this.setFont(value);
                        break;
                      case "CA":
                        this.setStrokeAlpha(value);
                        break;
                      case "ca":
                        this.setFillAlpha(value);
                        break;
                      default:
                        (0, _util.warn)("Unimplemented graphic state " + key);
                        break;
                    }
                  }
                },
                fill: function SVGGraphics_fill() {
                  var current = this.current;
                  if (current.element) {
                    current.element.setAttributeNS(null, "fill", current.fillColor);
                    current.element.setAttributeNS(null, "fill-opacity", current.fillAlpha);
                    this.endPath();
                  }
                },
                stroke: function SVGGraphics_stroke() {
                  var current = this.current;
                  if (current.element) {
                    this._setStrokeAttributes(current.element);
                    current.element.setAttributeNS(null, "fill", "none");
                    this.endPath();
                  }
                },
                _setStrokeAttributes: function _setStrokeAttributes(element) {
                  var current = this.current;
                  element.setAttributeNS(null, "stroke", current.strokeColor);
                  element.setAttributeNS(null, "stroke-opacity", current.strokeAlpha);
                  element.setAttributeNS(null, "stroke-miterlimit", pf(current.miterLimit));
                  element.setAttributeNS(null, "stroke-linecap", current.lineCap);
                  element.setAttributeNS(null, "stroke-linejoin", current.lineJoin);
                  element.setAttributeNS(null, "stroke-width", pf(current.lineWidth) + "px");
                  element.setAttributeNS(null, "stroke-dasharray", current.dashArray.map(pf).join(" "));
                  element.setAttributeNS(null, "stroke-dashoffset", pf(current.dashPhase) + "px");
                },
                eoFill: function SVGGraphics_eoFill() {
                  if (this.current.element) {
                    this.current.element.setAttributeNS(null, "fill-rule", "evenodd");
                  }
                  this.fill();
                },
                fillStroke: function SVGGraphics_fillStroke() {
                  this.stroke();
                  this.fill();
                },
                eoFillStroke: function SVGGraphics_eoFillStroke() {
                  if (this.current.element) {
                    this.current.element.setAttributeNS(null, "fill-rule", "evenodd");
                  }
                  this.fillStroke();
                },
                closeStroke: function SVGGraphics_closeStroke() {
                  this.closePath();
                  this.stroke();
                },
                closeFillStroke: function SVGGraphics_closeFillStroke() {
                  this.closePath();
                  this.fillStroke();
                },
                closeEOFillStroke: function closeEOFillStroke() {
                  this.closePath();
                  this.eoFillStroke();
                },
                paintSolidColorImageMask: function SVGGraphics_paintSolidColorImageMask() {
                  var current = this.current;
                  var rect = this.svgFactory.createElement("svg:rect");
                  rect.setAttributeNS(null, "x", "0");
                  rect.setAttributeNS(null, "y", "0");
                  rect.setAttributeNS(null, "width", "1px");
                  rect.setAttributeNS(null, "height", "1px");
                  rect.setAttributeNS(null, "fill", current.fillColor);
                  this._ensureTransformGroup().appendChild(rect);
                },
                paintJpegXObject: function SVGGraphics_paintJpegXObject(objId, w, h) {
                  var imgObj = this.objs.get(objId);
                  var imgEl = this.svgFactory.createElement("svg:image");
                  imgEl.setAttributeNS(XLINK_NS, "xlink:href", imgObj.src);
                  imgEl.setAttributeNS(null, "width", pf(w));
                  imgEl.setAttributeNS(null, "height", pf(h));
                  imgEl.setAttributeNS(null, "x", "0");
                  imgEl.setAttributeNS(null, "y", pf(-h));
                  imgEl.setAttributeNS(null, "transform", "scale(" + pf(1 / w) + " " + pf(-1 / h) + ")");
                  this._ensureTransformGroup().appendChild(imgEl);
                },
                paintImageXObject: function SVGGraphics_paintImageXObject(objId) {
                  var imgData = this.objs.get(objId);
                  if (!imgData) {
                    (0, _util.warn)("Dependent image isn't ready yet");
                    return;
                  }
                  this.paintInlineImageXObject(imgData);
                },
                paintInlineImageXObject: function SVGGraphics_paintInlineImageXObject(imgData, mask) {
                  var width = imgData.width;
                  var height = imgData.height;
                  var imgSrc = convertImgDataToPng(imgData, this.forceDataSchema, !!mask);
                  var cliprect = this.svgFactory.createElement("svg:rect");
                  cliprect.setAttributeNS(null, "x", "0");
                  cliprect.setAttributeNS(null, "y", "0");
                  cliprect.setAttributeNS(null, "width", pf(width));
                  cliprect.setAttributeNS(null, "height", pf(height));
                  this.current.element = cliprect;
                  this.clip("nonzero");
                  var imgEl = this.svgFactory.createElement("svg:image");
                  imgEl.setAttributeNS(XLINK_NS, "xlink:href", imgSrc);
                  imgEl.setAttributeNS(null, "x", "0");
                  imgEl.setAttributeNS(null, "y", pf(-height));
                  imgEl.setAttributeNS(null, "width", pf(width) + "px");
                  imgEl.setAttributeNS(null, "height", pf(height) + "px");
                  imgEl.setAttributeNS(null, "transform", "scale(" + pf(1 / width) + " " + pf(-1 / height) + ")");
                  if (mask) {
                    mask.appendChild(imgEl);
                  } else {
                    this._ensureTransformGroup().appendChild(imgEl);
                  }
                },
                paintImageMaskXObject: function SVGGraphics_paintImageMaskXObject(imgData) {
                  var current = this.current;
                  var width = imgData.width;
                  var height = imgData.height;
                  var fillColor = current.fillColor;
                  current.maskId = "mask" + maskCount++;
                  var mask = this.svgFactory.createElement("svg:mask");
                  mask.setAttributeNS(null, "id", current.maskId);
                  var rect = this.svgFactory.createElement("svg:rect");
                  rect.setAttributeNS(null, "x", "0");
                  rect.setAttributeNS(null, "y", "0");
                  rect.setAttributeNS(null, "width", pf(width));
                  rect.setAttributeNS(null, "height", pf(height));
                  rect.setAttributeNS(null, "fill", fillColor);
                  rect.setAttributeNS(null, "mask", "url(#" + current.maskId + ")");
                  this.defs.appendChild(mask);
                  this._ensureTransformGroup().appendChild(rect);
                  this.paintInlineImageXObject(imgData, mask);
                },
                paintFormXObjectBegin: function SVGGraphics_paintFormXObjectBegin(matrix, bbox) {
                  if (Array.isArray(matrix) && matrix.length === 6) {
                    this.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
                  }
                  if (bbox) {
                    var width = bbox[2] - bbox[0];
                    var height = bbox[3] - bbox[1];
                    var cliprect = this.svgFactory.createElement("svg:rect");
                    cliprect.setAttributeNS(null, "x", bbox[0]);
                    cliprect.setAttributeNS(null, "y", bbox[1]);
                    cliprect.setAttributeNS(null, "width", pf(width));
                    cliprect.setAttributeNS(null, "height", pf(height));
                    this.current.element = cliprect;
                    this.clip("nonzero");
                    this.endPath();
                  }
                },
                paintFormXObjectEnd: function SVGGraphics_paintFormXObjectEnd() {
                },
                _initialize: function _initialize(viewport) {
                  var svg = this.svgFactory.create(viewport.width, viewport.height);
                  var definitions = this.svgFactory.createElement("svg:defs");
                  svg.appendChild(definitions);
                  this.defs = definitions;
                  var rootGroup = this.svgFactory.createElement("svg:g");
                  rootGroup.setAttributeNS(null, "transform", pm(viewport.transform));
                  svg.appendChild(rootGroup);
                  this.svg = rootGroup;
                  return svg;
                },
                _ensureClipGroup: function SVGGraphics_ensureClipGroup() {
                  if (!this.current.clipGroup) {
                    var clipGroup = this.svgFactory.createElement("svg:g");
                    clipGroup.setAttributeNS(null, "clip-path", this.current.activeClipUrl);
                    this.svg.appendChild(clipGroup);
                    this.current.clipGroup = clipGroup;
                  }
                  return this.current.clipGroup;
                },
                _ensureTransformGroup: function SVGGraphics_ensureTransformGroup() {
                  if (!this.tgrp) {
                    this.tgrp = this.svgFactory.createElement("svg:g");
                    this.tgrp.setAttributeNS(null, "transform", pm(this.transformMatrix));
                    if (this.current.activeClipUrl) {
                      this._ensureClipGroup().appendChild(this.tgrp);
                    } else {
                      this.svg.appendChild(this.tgrp);
                    }
                  }
                  return this.tgrp;
                }
              };
              return SVGGraphics2;
            }();
          }
        },
        /* 165 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.PDFNodeStream = void 0;
          var _regenerator = _interopRequireDefault(__w_pdfjs_require__(147));
          var _util = __w_pdfjs_require__(1);
          var _network_utils = __w_pdfjs_require__(166);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function _typeof(obj) {
            if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
              _typeof = function _typeof2(obj2) {
                return typeof obj2;
              };
            } else {
              _typeof = function _typeof2(obj2) {
                return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
              };
            }
            return _typeof(obj);
          }
          function _possibleConstructorReturn(self2, call) {
            if (call && (_typeof(call) === "object" || typeof call === "function")) {
              return call;
            }
            return _assertThisInitialized(self2);
          }
          function _assertThisInitialized(self2) {
            if (self2 === void 0) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            }
            return self2;
          }
          function _getPrototypeOf(o2) {
            _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o3) {
              return o3.__proto__ || Object.getPrototypeOf(o3);
            };
            return _getPrototypeOf(o2);
          }
          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function");
            }
            subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
            if (superClass)
              _setPrototypeOf(subClass, superClass);
          }
          function _setPrototypeOf(o2, p) {
            _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o3, p2) {
              o3.__proto__ = p2;
              return o3;
            };
            return _setPrototypeOf(o2, p);
          }
          function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
            try {
              var info = gen[key](arg);
              var value = info.value;
            } catch (error2) {
              reject(error2);
              return;
            }
            if (info.done) {
              resolve(value);
            } else {
              Promise.resolve(value).then(_next, _throw);
            }
          }
          function _asyncToGenerator(fn) {
            return function() {
              var self2 = this, args = arguments;
              return new Promise(function(resolve, reject) {
                var gen = fn.apply(self2, args);
                function _next(value) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                }
                function _throw(err) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                }
                _next(void 0);
              });
            };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            return Constructor;
          }
          var fs = require$$5;
          var http = require$$5;
          var https = require$$5;
          var url = require$$6;
          var fileUriRegex = /^file:\/\/\/[a-zA-Z]:\//;
          function parseUrl(sourceUrl) {
            var parsedUrl = url.parse(sourceUrl);
            if (parsedUrl.protocol === "file:" || parsedUrl.host) {
              return parsedUrl;
            }
            if (/^[a-z]:[/\\]/i.test(sourceUrl)) {
              return url.parse("file:///".concat(sourceUrl));
            }
            if (!parsedUrl.host) {
              parsedUrl.protocol = "file:";
            }
            return parsedUrl;
          }
          var PDFNodeStream = function() {
            function PDFNodeStream2(source) {
              _classCallCheck(this, PDFNodeStream2);
              this.source = source;
              this.url = parseUrl(source.url);
              this.isHttp = this.url.protocol === "http:" || this.url.protocol === "https:";
              this.isFsUrl = this.url.protocol === "file:";
              this.httpHeaders = this.isHttp && source.httpHeaders || {};
              this._fullRequest = null;
              this._rangeRequestReaders = [];
            }
            _createClass(PDFNodeStream2, [{
              key: "getFullReader",
              value: function getFullReader() {
                (0, _util.assert)(!this._fullRequest);
                this._fullRequest = this.isFsUrl ? new PDFNodeStreamFsFullReader(this) : new PDFNodeStreamFullReader(this);
                return this._fullRequest;
              }
            }, {
              key: "getRangeReader",
              value: function getRangeReader(start, end) {
                var rangeReader = this.isFsUrl ? new PDFNodeStreamFsRangeReader(this, start, end) : new PDFNodeStreamRangeReader(this, start, end);
                this._rangeRequestReaders.push(rangeReader);
                return rangeReader;
              }
            }, {
              key: "cancelAllRequests",
              value: function cancelAllRequests(reason) {
                if (this._fullRequest) {
                  this._fullRequest.cancel(reason);
                }
                var readers = this._rangeRequestReaders.slice(0);
                readers.forEach(function(reader) {
                  reader.cancel(reason);
                });
              }
            }]);
            return PDFNodeStream2;
          }();
          exports2.PDFNodeStream = PDFNodeStream;
          var BaseFullReader = function() {
            function BaseFullReader2(stream) {
              _classCallCheck(this, BaseFullReader2);
              this._url = stream.url;
              this._done = false;
              this._storedError = null;
              this.onProgress = null;
              var source = stream.source;
              this._contentLength = source.length;
              this._loaded = 0;
              this._filename = null;
              this._disableRange = source.disableRange || false;
              this._rangeChunkSize = source.rangeChunkSize;
              if (!this._rangeChunkSize && !this._disableRange) {
                this._disableRange = true;
              }
              this._isStreamingSupported = !source.disableStream;
              this._isRangeSupported = !source.disableRange;
              this._readableStream = null;
              this._readCapability = (0, _util.createPromiseCapability)();
              this._headersCapability = (0, _util.createPromiseCapability)();
            }
            _createClass(BaseFullReader2, [{
              key: "read",
              value: function() {
                var _read = _asyncToGenerator(
                  _regenerator.default.mark(function _callee() {
                    var chunk, buffer;
                    return _regenerator.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return this._readCapability.promise;
                          case 2:
                            if (!this._done) {
                              _context.next = 4;
                              break;
                            }
                            return _context.abrupt("return", {
                              value: void 0,
                              done: true
                            });
                          case 4:
                            if (!this._storedError) {
                              _context.next = 6;
                              break;
                            }
                            throw this._storedError;
                          case 6:
                            chunk = this._readableStream.read();
                            if (!(chunk === null)) {
                              _context.next = 10;
                              break;
                            }
                            this._readCapability = (0, _util.createPromiseCapability)();
                            return _context.abrupt("return", this.read());
                          case 10:
                            this._loaded += chunk.length;
                            if (this.onProgress) {
                              this.onProgress({
                                loaded: this._loaded,
                                total: this._contentLength
                              });
                            }
                            buffer = new Uint8Array(chunk).buffer;
                            return _context.abrupt("return", {
                              value: buffer,
                              done: false
                            });
                          case 14:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, this);
                  })
                );
                function read2() {
                  return _read.apply(this, arguments);
                }
                return read2;
              }()
            }, {
              key: "cancel",
              value: function cancel(reason) {
                if (!this._readableStream) {
                  this._error(reason);
                  return;
                }
                this._readableStream.destroy(reason);
              }
            }, {
              key: "_error",
              value: function _error(reason) {
                this._storedError = reason;
                this._readCapability.resolve();
              }
            }, {
              key: "_setReadableStream",
              value: function _setReadableStream(readableStream) {
                var _this = this;
                this._readableStream = readableStream;
                readableStream.on("readable", function() {
                  _this._readCapability.resolve();
                });
                readableStream.on("end", function() {
                  readableStream.destroy();
                  _this._done = true;
                  _this._readCapability.resolve();
                });
                readableStream.on("error", function(reason) {
                  _this._error(reason);
                });
                if (!this._isStreamingSupported && this._isRangeSupported) {
                  this._error(new _util.AbortException("streaming is disabled"));
                }
                if (this._storedError) {
                  this._readableStream.destroy(this._storedError);
                }
              }
            }, {
              key: "headersReady",
              get: function get() {
                return this._headersCapability.promise;
              }
            }, {
              key: "filename",
              get: function get() {
                return this._filename;
              }
            }, {
              key: "contentLength",
              get: function get() {
                return this._contentLength;
              }
            }, {
              key: "isRangeSupported",
              get: function get() {
                return this._isRangeSupported;
              }
            }, {
              key: "isStreamingSupported",
              get: function get() {
                return this._isStreamingSupported;
              }
            }]);
            return BaseFullReader2;
          }();
          var BaseRangeReader = function() {
            function BaseRangeReader2(stream) {
              _classCallCheck(this, BaseRangeReader2);
              this._url = stream.url;
              this._done = false;
              this._storedError = null;
              this.onProgress = null;
              this._loaded = 0;
              this._readableStream = null;
              this._readCapability = (0, _util.createPromiseCapability)();
              var source = stream.source;
              this._isStreamingSupported = !source.disableStream;
            }
            _createClass(BaseRangeReader2, [{
              key: "read",
              value: function() {
                var _read2 = _asyncToGenerator(
                  _regenerator.default.mark(function _callee2() {
                    var chunk, buffer;
                    return _regenerator.default.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return this._readCapability.promise;
                          case 2:
                            if (!this._done) {
                              _context2.next = 4;
                              break;
                            }
                            return _context2.abrupt("return", {
                              value: void 0,
                              done: true
                            });
                          case 4:
                            if (!this._storedError) {
                              _context2.next = 6;
                              break;
                            }
                            throw this._storedError;
                          case 6:
                            chunk = this._readableStream.read();
                            if (!(chunk === null)) {
                              _context2.next = 10;
                              break;
                            }
                            this._readCapability = (0, _util.createPromiseCapability)();
                            return _context2.abrupt("return", this.read());
                          case 10:
                            this._loaded += chunk.length;
                            if (this.onProgress) {
                              this.onProgress({
                                loaded: this._loaded
                              });
                            }
                            buffer = new Uint8Array(chunk).buffer;
                            return _context2.abrupt("return", {
                              value: buffer,
                              done: false
                            });
                          case 14:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2, this);
                  })
                );
                function read2() {
                  return _read2.apply(this, arguments);
                }
                return read2;
              }()
            }, {
              key: "cancel",
              value: function cancel(reason) {
                if (!this._readableStream) {
                  this._error(reason);
                  return;
                }
                this._readableStream.destroy(reason);
              }
            }, {
              key: "_error",
              value: function _error(reason) {
                this._storedError = reason;
                this._readCapability.resolve();
              }
            }, {
              key: "_setReadableStream",
              value: function _setReadableStream(readableStream) {
                var _this2 = this;
                this._readableStream = readableStream;
                readableStream.on("readable", function() {
                  _this2._readCapability.resolve();
                });
                readableStream.on("end", function() {
                  readableStream.destroy();
                  _this2._done = true;
                  _this2._readCapability.resolve();
                });
                readableStream.on("error", function(reason) {
                  _this2._error(reason);
                });
                if (this._storedError) {
                  this._readableStream.destroy(this._storedError);
                }
              }
            }, {
              key: "isStreamingSupported",
              get: function get() {
                return this._isStreamingSupported;
              }
            }]);
            return BaseRangeReader2;
          }();
          function createRequestOptions(url2, headers) {
            return {
              protocol: url2.protocol,
              auth: url2.auth,
              host: url2.hostname,
              port: url2.port,
              path: url2.path,
              method: "GET",
              headers
            };
          }
          var PDFNodeStreamFullReader = function(_BaseFullReader) {
            _inherits(PDFNodeStreamFullReader2, _BaseFullReader);
            function PDFNodeStreamFullReader2(stream) {
              var _this3;
              _classCallCheck(this, PDFNodeStreamFullReader2);
              _this3 = _possibleConstructorReturn(this, _getPrototypeOf(PDFNodeStreamFullReader2).call(this, stream));
              var handleResponse = function handleResponse2(response) {
                if (response.statusCode === 404) {
                  var error2 = new _util.MissingPDFException('Missing PDF "'.concat(_this3._url, '".'));
                  _this3._storedError = error2;
                  _this3._headersCapability.reject(error2);
                  return;
                }
                _this3._headersCapability.resolve();
                _this3._setReadableStream(response);
                var getResponseHeader = function getResponseHeader2(name) {
                  return _this3._readableStream.headers[name.toLowerCase()];
                };
                var _validateRangeRequest = (0, _network_utils.validateRangeRequestCapabilities)({
                  getResponseHeader,
                  isHttp: stream.isHttp,
                  rangeChunkSize: _this3._rangeChunkSize,
                  disableRange: _this3._disableRange
                }), allowRangeRequests = _validateRangeRequest.allowRangeRequests, suggestedLength = _validateRangeRequest.suggestedLength;
                _this3._isRangeSupported = allowRangeRequests;
                _this3._contentLength = suggestedLength || _this3._contentLength;
                _this3._filename = (0, _network_utils.extractFilenameFromHeader)(getResponseHeader);
              };
              _this3._request = null;
              if (_this3._url.protocol === "http:") {
                _this3._request = http.request(createRequestOptions(_this3._url, stream.httpHeaders), handleResponse);
              } else {
                _this3._request = https.request(createRequestOptions(_this3._url, stream.httpHeaders), handleResponse);
              }
              _this3._request.on("error", function(reason) {
                _this3._storedError = reason;
                _this3._headersCapability.reject(reason);
              });
              _this3._request.end();
              return _this3;
            }
            return PDFNodeStreamFullReader2;
          }(BaseFullReader);
          var PDFNodeStreamRangeReader = function(_BaseRangeReader) {
            _inherits(PDFNodeStreamRangeReader2, _BaseRangeReader);
            function PDFNodeStreamRangeReader2(stream, start, end) {
              var _this4;
              _classCallCheck(this, PDFNodeStreamRangeReader2);
              _this4 = _possibleConstructorReturn(this, _getPrototypeOf(PDFNodeStreamRangeReader2).call(this, stream));
              _this4._httpHeaders = {};
              for (var property in stream.httpHeaders) {
                var value = stream.httpHeaders[property];
                if (typeof value === "undefined") {
                  continue;
                }
                _this4._httpHeaders[property] = value;
              }
              _this4._httpHeaders["Range"] = "bytes=".concat(start, "-").concat(end - 1);
              var handleResponse = function handleResponse2(response) {
                if (response.statusCode === 404) {
                  var error2 = new _util.MissingPDFException('Missing PDF "'.concat(_this4._url, '".'));
                  _this4._storedError = error2;
                  return;
                }
                _this4._setReadableStream(response);
              };
              _this4._request = null;
              if (_this4._url.protocol === "http:") {
                _this4._request = http.request(createRequestOptions(_this4._url, _this4._httpHeaders), handleResponse);
              } else {
                _this4._request = https.request(createRequestOptions(_this4._url, _this4._httpHeaders), handleResponse);
              }
              _this4._request.on("error", function(reason) {
                _this4._storedError = reason;
              });
              _this4._request.end();
              return _this4;
            }
            return PDFNodeStreamRangeReader2;
          }(BaseRangeReader);
          var PDFNodeStreamFsFullReader = function(_BaseFullReader2) {
            _inherits(PDFNodeStreamFsFullReader2, _BaseFullReader2);
            function PDFNodeStreamFsFullReader2(stream) {
              var _this5;
              _classCallCheck(this, PDFNodeStreamFsFullReader2);
              _this5 = _possibleConstructorReturn(this, _getPrototypeOf(PDFNodeStreamFsFullReader2).call(this, stream));
              var path = decodeURIComponent(_this5._url.path);
              if (fileUriRegex.test(_this5._url.href)) {
                path = path.replace(/^\//, "");
              }
              fs.lstat(path, function(error2, stat) {
                if (error2) {
                  if (error2.code === "ENOENT") {
                    error2 = new _util.MissingPDFException('Missing PDF "'.concat(path, '".'));
                  }
                  _this5._storedError = error2;
                  _this5._headersCapability.reject(error2);
                  return;
                }
                _this5._contentLength = stat.size;
                _this5._setReadableStream(fs.createReadStream(path));
                _this5._headersCapability.resolve();
              });
              return _this5;
            }
            return PDFNodeStreamFsFullReader2;
          }(BaseFullReader);
          var PDFNodeStreamFsRangeReader = function(_BaseRangeReader2) {
            _inherits(PDFNodeStreamFsRangeReader2, _BaseRangeReader2);
            function PDFNodeStreamFsRangeReader2(stream, start, end) {
              var _this6;
              _classCallCheck(this, PDFNodeStreamFsRangeReader2);
              _this6 = _possibleConstructorReturn(this, _getPrototypeOf(PDFNodeStreamFsRangeReader2).call(this, stream));
              var path = decodeURIComponent(_this6._url.path);
              if (fileUriRegex.test(_this6._url.href)) {
                path = path.replace(/^\//, "");
              }
              _this6._setReadableStream(fs.createReadStream(path, {
                start,
                end: end - 1
              }));
              return _this6;
            }
            return PDFNodeStreamFsRangeReader2;
          }(BaseRangeReader);
        },
        /* 166 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.createResponseStatusError = createResponseStatusError;
          exports2.extractFilenameFromHeader = extractFilenameFromHeader;
          exports2.validateRangeRequestCapabilities = validateRangeRequestCapabilities;
          exports2.validateResponseStatus = validateResponseStatus;
          var _util = __w_pdfjs_require__(1);
          var _content_disposition = __w_pdfjs_require__(167);
          function validateRangeRequestCapabilities(_ref) {
            var getResponseHeader = _ref.getResponseHeader, isHttp = _ref.isHttp, rangeChunkSize = _ref.rangeChunkSize, disableRange = _ref.disableRange;
            (0, _util.assert)(rangeChunkSize > 0, "Range chunk size must be larger than zero");
            var returnValues = {
              allowRangeRequests: false,
              suggestedLength: void 0
            };
            var length = parseInt(getResponseHeader("Content-Length"), 10);
            if (!Number.isInteger(length)) {
              return returnValues;
            }
            returnValues.suggestedLength = length;
            if (length <= 2 * rangeChunkSize) {
              return returnValues;
            }
            if (disableRange || !isHttp) {
              return returnValues;
            }
            if (getResponseHeader("Accept-Ranges") !== "bytes") {
              return returnValues;
            }
            var contentEncoding = getResponseHeader("Content-Encoding") || "identity";
            if (contentEncoding !== "identity") {
              return returnValues;
            }
            returnValues.allowRangeRequests = true;
            return returnValues;
          }
          function extractFilenameFromHeader(getResponseHeader) {
            var contentDisposition = getResponseHeader("Content-Disposition");
            if (contentDisposition) {
              var filename = (0, _content_disposition.getFilenameFromContentDispositionHeader)(contentDisposition);
              if (/\.pdf$/i.test(filename)) {
                return filename;
              }
            }
            return null;
          }
          function createResponseStatusError(status, url) {
            if (status === 404 || status === 0 && /^file:/.test(url)) {
              return new _util.MissingPDFException('Missing PDF "' + url + '".');
            }
            return new _util.UnexpectedResponseException("Unexpected server response (" + status + ') while retrieving PDF "' + url + '".', status);
          }
          function validateResponseStatus(status) {
            return status === 200 || status === 206;
          }
        },
        /* 167 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.getFilenameFromContentDispositionHeader = getFilenameFromContentDispositionHeader;
          function _slicedToArray(arr, i) {
            return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
          }
          function _nonIterableRest() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
          }
          function _iterableToArrayLimit(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = void 0;
            try {
              for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);
                if (i && _arr.length === i)
                  break;
              }
            } catch (err) {
              _d = true;
              _e = err;
            } finally {
              try {
                if (!_n && _i["return"] != null)
                  _i["return"]();
              } finally {
                if (_d)
                  throw _e;
              }
            }
            return _arr;
          }
          function _arrayWithHoles(arr) {
            if (Array.isArray(arr))
              return arr;
          }
          function getFilenameFromContentDispositionHeader(contentDisposition) {
            var needsEncodingFixup = true;
            var tmp = toParamRegExp("filename\\*", "i").exec(contentDisposition);
            if (tmp) {
              tmp = tmp[1];
              var filename = rfc2616unquote(tmp);
              filename = unescape(filename);
              filename = rfc5987decode(filename);
              filename = rfc2047decode(filename);
              return fixupEncoding(filename);
            }
            tmp = rfc2231getparam(contentDisposition);
            if (tmp) {
              var _filename = rfc2047decode(tmp);
              return fixupEncoding(_filename);
            }
            tmp = toParamRegExp("filename", "i").exec(contentDisposition);
            if (tmp) {
              tmp = tmp[1];
              var _filename2 = rfc2616unquote(tmp);
              _filename2 = rfc2047decode(_filename2);
              return fixupEncoding(_filename2);
            }
            function toParamRegExp(attributePattern, flags) {
              return new RegExp("(?:^|;)\\s*" + attributePattern + '\\s*=\\s*([^";\\s][^;\\s]*|"(?:[^"\\\\]|\\\\"?)+"?)', flags);
            }
            function textdecode(encoding, value) {
              if (encoding) {
                if (!/^[\x00-\xFF]+$/.test(value)) {
                  return value;
                }
                try {
                  var decoder = new TextDecoder(encoding, {
                    fatal: true
                  });
                  var bytes = Array.from(value, function(ch) {
                    return ch.charCodeAt(0) & 255;
                  });
                  value = decoder.decode(new Uint8Array(bytes));
                  needsEncodingFixup = false;
                } catch (e) {
                  if (/^utf-?8$/i.test(encoding)) {
                    try {
                      value = decodeURIComponent(escape(value));
                      needsEncodingFixup = false;
                    } catch (err) {
                    }
                  }
                }
              }
              return value;
            }
            function fixupEncoding(value) {
              if (needsEncodingFixup && /[\x80-\xff]/.test(value)) {
                value = textdecode("utf-8", value);
                if (needsEncodingFixup) {
                  value = textdecode("iso-8859-1", value);
                }
              }
              return value;
            }
            function rfc2231getparam(contentDisposition2) {
              var matches = [], match;
              var iter = toParamRegExp("filename\\*((?!0\\d)\\d+)(\\*?)", "ig");
              while ((match = iter.exec(contentDisposition2)) !== null) {
                var _match = match, _match2 = _slicedToArray(_match, 4), n2 = _match2[1], quot = _match2[2], part = _match2[3];
                n2 = parseInt(n2, 10);
                if (n2 in matches) {
                  if (n2 === 0) {
                    break;
                  }
                  continue;
                }
                matches[n2] = [quot, part];
              }
              var parts = [];
              for (var n2 = 0; n2 < matches.length; ++n2) {
                if (!(n2 in matches)) {
                  break;
                }
                var _matches$n = _slicedToArray(matches[n2], 2), quot = _matches$n[0], part = _matches$n[1];
                part = rfc2616unquote(part);
                if (quot) {
                  part = unescape(part);
                  if (n2 === 0) {
                    part = rfc5987decode(part);
                  }
                }
                parts.push(part);
              }
              return parts.join("");
            }
            function rfc2616unquote(value) {
              if (value.startsWith('"')) {
                var parts = value.slice(1).split('\\"');
                for (var i = 0; i < parts.length; ++i) {
                  var quotindex = parts[i].indexOf('"');
                  if (quotindex !== -1) {
                    parts[i] = parts[i].slice(0, quotindex);
                    parts.length = i + 1;
                  }
                  parts[i] = parts[i].replace(/\\(.)/g, "$1");
                }
                value = parts.join('"');
              }
              return value;
            }
            function rfc5987decode(extvalue) {
              var encodingend = extvalue.indexOf("'");
              if (encodingend === -1) {
                return extvalue;
              }
              var encoding = extvalue.slice(0, encodingend);
              var langvalue = extvalue.slice(encodingend + 1);
              var value = langvalue.replace(/^[^']*'/, "");
              return textdecode(encoding, value);
            }
            function rfc2047decode(value) {
              if (!value.startsWith("=?") || /[\x00-\x19\x80-\xff]/.test(value)) {
                return value;
              }
              return value.replace(/=\?([\w-]*)\?([QqBb])\?((?:[^?]|\?(?!=))*)\?=/g, function(_, charset, encoding, text) {
                if (encoding === "q" || encoding === "Q") {
                  text = text.replace(/_/g, " ");
                  text = text.replace(/=([0-9a-fA-F]{2})/g, function(_2, hex) {
                    return String.fromCharCode(parseInt(hex, 16));
                  });
                  return textdecode(charset, text);
                }
                try {
                  text = atob(text);
                } catch (e) {
                }
                return textdecode(charset, text);
              });
            }
            return "";
          }
        },
        /* 168 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.PDFFetchStream = void 0;
          var _regenerator = _interopRequireDefault(__w_pdfjs_require__(147));
          var _util = __w_pdfjs_require__(1);
          var _network_utils = __w_pdfjs_require__(166);
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
            try {
              var info = gen[key](arg);
              var value = info.value;
            } catch (error2) {
              reject(error2);
              return;
            }
            if (info.done) {
              resolve(value);
            } else {
              Promise.resolve(value).then(_next, _throw);
            }
          }
          function _asyncToGenerator(fn) {
            return function() {
              var self2 = this, args = arguments;
              return new Promise(function(resolve, reject) {
                var gen = fn.apply(self2, args);
                function _next(value) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                }
                function _throw(err) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                }
                _next(void 0);
              });
            };
          }
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }
          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              _defineProperties(Constructor, staticProps);
            return Constructor;
          }
          function createFetchOptions(headers, withCredentials, abortController) {
            return {
              method: "GET",
              headers,
              signal: abortController && abortController.signal,
              mode: "cors",
              credentials: withCredentials ? "include" : "same-origin",
              redirect: "follow"
            };
          }
          var PDFFetchStream = function() {
            function PDFFetchStream2(source) {
              _classCallCheck(this, PDFFetchStream2);
              this.source = source;
              this.isHttp = /^https?:/i.test(source.url);
              this.httpHeaders = this.isHttp && source.httpHeaders || {};
              this._fullRequestReader = null;
              this._rangeRequestReaders = [];
            }
            _createClass(PDFFetchStream2, [{
              key: "getFullReader",
              value: function getFullReader() {
                (0, _util.assert)(!this._fullRequestReader);
                this._fullRequestReader = new PDFFetchStreamReader(this);
                return this._fullRequestReader;
              }
            }, {
              key: "getRangeReader",
              value: function getRangeReader(begin, end) {
                var reader = new PDFFetchStreamRangeReader(this, begin, end);
                this._rangeRequestReaders.push(reader);
                return reader;
              }
            }, {
              key: "cancelAllRequests",
              value: function cancelAllRequests(reason) {
                if (this._fullRequestReader) {
                  this._fullRequestReader.cancel(reason);
                }
                var readers = this._rangeRequestReaders.slice(0);
                readers.forEach(function(reader) {
                  reader.cancel(reason);
                });
              }
            }]);
            return PDFFetchStream2;
          }();
          exports2.PDFFetchStream = PDFFetchStream;
          var PDFFetchStreamReader = function() {
            function PDFFetchStreamReader2(stream) {
              var _this = this;
              _classCallCheck(this, PDFFetchStreamReader2);
              this._stream = stream;
              this._reader = null;
              this._loaded = 0;
              this._filename = null;
              var source = stream.source;
              this._withCredentials = source.withCredentials;
              this._contentLength = source.length;
              this._headersCapability = (0, _util.createPromiseCapability)();
              this._disableRange = source.disableRange || false;
              this._rangeChunkSize = source.rangeChunkSize;
              if (!this._rangeChunkSize && !this._disableRange) {
                this._disableRange = true;
              }
              if (typeof AbortController !== "undefined") {
                this._abortController = new AbortController();
              }
              this._isStreamingSupported = !source.disableStream;
              this._isRangeSupported = !source.disableRange;
              this._headers = new Headers();
              for (var property in this._stream.httpHeaders) {
                var value = this._stream.httpHeaders[property];
                if (typeof value === "undefined") {
                  continue;
                }
                this._headers.append(property, value);
              }
              var url = source.url;
              fetch(url, createFetchOptions(this._headers, this._withCredentials, this._abortController)).then(function(response) {
                if (!(0, _network_utils.validateResponseStatus)(response.status)) {
                  throw (0, _network_utils.createResponseStatusError)(response.status, url);
                }
                _this._reader = response.body.getReader();
                _this._headersCapability.resolve();
                var getResponseHeader = function getResponseHeader2(name) {
                  return response.headers.get(name);
                };
                var _validateRangeRequest = (0, _network_utils.validateRangeRequestCapabilities)({
                  getResponseHeader,
                  isHttp: _this._stream.isHttp,
                  rangeChunkSize: _this._rangeChunkSize,
                  disableRange: _this._disableRange
                }), allowRangeRequests = _validateRangeRequest.allowRangeRequests, suggestedLength = _validateRangeRequest.suggestedLength;
                _this._isRangeSupported = allowRangeRequests;
                _this._contentLength = suggestedLength || _this._contentLength;
                _this._filename = (0, _network_utils.extractFilenameFromHeader)(getResponseHeader);
                if (!_this._isStreamingSupported && _this._isRangeSupported) {
                  _this.cancel(new _util.AbortException("streaming is disabled"));
                }
              }).catch(this._headersCapability.reject);
              this.onProgress = null;
            }
            _createClass(PDFFetchStreamReader2, [{
              key: "read",
              value: function() {
                var _read = _asyncToGenerator(
                  _regenerator.default.mark(function _callee() {
                    var _ref, value, done, buffer;
                    return _regenerator.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return this._headersCapability.promise;
                          case 2:
                            _context.next = 4;
                            return this._reader.read();
                          case 4:
                            _ref = _context.sent;
                            value = _ref.value;
                            done = _ref.done;
                            if (!done) {
                              _context.next = 9;
                              break;
                            }
                            return _context.abrupt("return", {
                              value,
                              done
                            });
                          case 9:
                            this._loaded += value.byteLength;
                            if (this.onProgress) {
                              this.onProgress({
                                loaded: this._loaded,
                                total: this._contentLength
                              });
                            }
                            buffer = new Uint8Array(value).buffer;
                            return _context.abrupt("return", {
                              value: buffer,
                              done: false
                            });
                          case 13:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, this);
                  })
                );
                function read2() {
                  return _read.apply(this, arguments);
                }
                return read2;
              }()
            }, {
              key: "cancel",
              value: function cancel(reason) {
                if (this._reader) {
                  this._reader.cancel(reason);
                }
                if (this._abortController) {
                  this._abortController.abort();
                }
              }
            }, {
              key: "headersReady",
              get: function get() {
                return this._headersCapability.promise;
              }
            }, {
              key: "filename",
              get: function get() {
                return this._filename;
              }
            }, {
              key: "contentLength",
              get: function get() {
                return this._contentLength;
              }
            }, {
              key: "isRangeSupported",
              get: function get() {
                return this._isRangeSupported;
              }
            }, {
              key: "isStreamingSupported",
              get: function get() {
                return this._isStreamingSupported;
              }
            }]);
            return PDFFetchStreamReader2;
          }();
          var PDFFetchStreamRangeReader = function() {
            function PDFFetchStreamRangeReader2(stream, begin, end) {
              var _this2 = this;
              _classCallCheck(this, PDFFetchStreamRangeReader2);
              this._stream = stream;
              this._reader = null;
              this._loaded = 0;
              var source = stream.source;
              this._withCredentials = source.withCredentials;
              this._readCapability = (0, _util.createPromiseCapability)();
              this._isStreamingSupported = !source.disableStream;
              if (typeof AbortController !== "undefined") {
                this._abortController = new AbortController();
              }
              this._headers = new Headers();
              for (var property in this._stream.httpHeaders) {
                var value = this._stream.httpHeaders[property];
                if (typeof value === "undefined") {
                  continue;
                }
                this._headers.append(property, value);
              }
              var rangeStr = begin + "-" + (end - 1);
              this._headers.append("Range", "bytes=" + rangeStr);
              var url = source.url;
              fetch(url, createFetchOptions(this._headers, this._withCredentials, this._abortController)).then(function(response) {
                if (!(0, _network_utils.validateResponseStatus)(response.status)) {
                  throw (0, _network_utils.createResponseStatusError)(response.status, url);
                }
                _this2._readCapability.resolve();
                _this2._reader = response.body.getReader();
              });
              this.onProgress = null;
            }
            _createClass(PDFFetchStreamRangeReader2, [{
              key: "read",
              value: function() {
                var _read2 = _asyncToGenerator(
                  _regenerator.default.mark(function _callee2() {
                    var _ref2, value, done, buffer;
                    return _regenerator.default.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.next = 2;
                            return this._readCapability.promise;
                          case 2:
                            _context2.next = 4;
                            return this._reader.read();
                          case 4:
                            _ref2 = _context2.sent;
                            value = _ref2.value;
                            done = _ref2.done;
                            if (!done) {
                              _context2.next = 9;
                              break;
                            }
                            return _context2.abrupt("return", {
                              value,
                              done
                            });
                          case 9:
                            this._loaded += value.byteLength;
                            if (this.onProgress) {
                              this.onProgress({
                                loaded: this._loaded
                              });
                            }
                            buffer = new Uint8Array(value).buffer;
                            return _context2.abrupt("return", {
                              value: buffer,
                              done: false
                            });
                          case 13:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2, this);
                  })
                );
                function read2() {
                  return _read2.apply(this, arguments);
                }
                return read2;
              }()
            }, {
              key: "cancel",
              value: function cancel(reason) {
                if (this._reader) {
                  this._reader.cancel(reason);
                }
                if (this._abortController) {
                  this._abortController.abort();
                }
              }
            }, {
              key: "isStreamingSupported",
              get: function get() {
                return this._isStreamingSupported;
              }
            }]);
            return PDFFetchStreamRangeReader2;
          }();
        },
        /* 169 */
        /***/
        function(module2, exports2, __w_pdfjs_require__) {
          Object.defineProperty(exports2, "__esModule", {
            value: true
          });
          exports2.PDFNetworkStream = PDFNetworkStream;
          exports2.NetworkManager = NetworkManager;
          var _regenerator = _interopRequireDefault(__w_pdfjs_require__(147));
          var _util = __w_pdfjs_require__(1);
          var _network_utils = __w_pdfjs_require__(166);
          var _global_scope = _interopRequireDefault(__w_pdfjs_require__(3));
          function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
          }
          function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
            try {
              var info = gen[key](arg);
              var value = info.value;
            } catch (error2) {
              reject(error2);
              return;
            }
            if (info.done) {
              resolve(value);
            } else {
              Promise.resolve(value).then(_next, _throw);
            }
          }
          function _asyncToGenerator(fn) {
            return function() {
              var self2 = this, args = arguments;
              return new Promise(function(resolve, reject) {
                var gen = fn.apply(self2, args);
                function _next(value) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                }
                function _throw(err) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                }
                _next(void 0);
              });
            };
          }
          var OK_RESPONSE = 200;
          var PARTIAL_CONTENT_RESPONSE = 206;
          function NetworkManager(url, args) {
            this.url = url;
            args = args || {};
            this.isHttp = /^https?:/i.test(url);
            this.httpHeaders = this.isHttp && args.httpHeaders || {};
            this.withCredentials = args.withCredentials || false;
            this.getXhr = args.getXhr || function NetworkManager_getXhr() {
              return new XMLHttpRequest();
            };
            this.currXhrId = 0;
            this.pendingRequests = /* @__PURE__ */ Object.create(null);
            this.loadedRequests = /* @__PURE__ */ Object.create(null);
          }
          function getArrayBuffer(xhr) {
            var data = xhr.response;
            if (typeof data !== "string") {
              return data;
            }
            var array = (0, _util.stringToBytes)(data);
            return array.buffer;
          }
          var supportsMozChunked = function supportsMozChunkedClosure() {
            try {
              var x = new XMLHttpRequest();
              x.open("GET", _global_scope.default.location.href);
              x.responseType = "moz-chunked-arraybuffer";
              return x.responseType === "moz-chunked-arraybuffer";
            } catch (e) {
              return false;
            }
          }();
          NetworkManager.prototype = {
            requestRange: function NetworkManager_requestRange(begin, end, listeners) {
              var args = {
                begin,
                end
              };
              for (var prop in listeners) {
                args[prop] = listeners[prop];
              }
              return this.request(args);
            },
            requestFull: function NetworkManager_requestFull(listeners) {
              return this.request(listeners);
            },
            request: function NetworkManager_request(args) {
              var xhr = this.getXhr();
              var xhrId = this.currXhrId++;
              var pendingRequest = this.pendingRequests[xhrId] = {
                xhr
              };
              xhr.open("GET", this.url);
              xhr.withCredentials = this.withCredentials;
              for (var property in this.httpHeaders) {
                var value = this.httpHeaders[property];
                if (typeof value === "undefined") {
                  continue;
                }
                xhr.setRequestHeader(property, value);
              }
              if (this.isHttp && "begin" in args && "end" in args) {
                var rangeStr = args.begin + "-" + (args.end - 1);
                xhr.setRequestHeader("Range", "bytes=" + rangeStr);
                pendingRequest.expectedStatus = 206;
              } else {
                pendingRequest.expectedStatus = 200;
              }
              var useMozChunkedLoading = supportsMozChunked && !!args.onProgressiveData;
              if (useMozChunkedLoading) {
                xhr.responseType = "moz-chunked-arraybuffer";
                pendingRequest.onProgressiveData = args.onProgressiveData;
                pendingRequest.mozChunked = true;
              } else {
                xhr.responseType = "arraybuffer";
              }
              if (args.onError) {
                xhr.onerror = function(evt) {
                  args.onError(xhr.status);
                };
              }
              xhr.onreadystatechange = this.onStateChange.bind(this, xhrId);
              xhr.onprogress = this.onProgress.bind(this, xhrId);
              pendingRequest.onHeadersReceived = args.onHeadersReceived;
              pendingRequest.onDone = args.onDone;
              pendingRequest.onError = args.onError;
              pendingRequest.onProgress = args.onProgress;
              xhr.send(null);
              return xhrId;
            },
            onProgress: function NetworkManager_onProgress(xhrId, evt) {
              var pendingRequest = this.pendingRequests[xhrId];
              if (!pendingRequest) {
                return;
              }
              if (pendingRequest.mozChunked) {
                var chunk = getArrayBuffer(pendingRequest.xhr);
                pendingRequest.onProgressiveData(chunk);
              }
              var onProgress = pendingRequest.onProgress;
              if (onProgress) {
                onProgress(evt);
              }
            },
            onStateChange: function NetworkManager_onStateChange(xhrId, evt) {
              var pendingRequest = this.pendingRequests[xhrId];
              if (!pendingRequest) {
                return;
              }
              var xhr = pendingRequest.xhr;
              if (xhr.readyState >= 2 && pendingRequest.onHeadersReceived) {
                pendingRequest.onHeadersReceived();
                delete pendingRequest.onHeadersReceived;
              }
              if (xhr.readyState !== 4) {
                return;
              }
              if (!(xhrId in this.pendingRequests)) {
                return;
              }
              delete this.pendingRequests[xhrId];
              if (xhr.status === 0 && this.isHttp) {
                if (pendingRequest.onError) {
                  pendingRequest.onError(xhr.status);
                }
                return;
              }
              var xhrStatus = xhr.status || OK_RESPONSE;
              var ok_response_on_range_request = xhrStatus === OK_RESPONSE && pendingRequest.expectedStatus === PARTIAL_CONTENT_RESPONSE;
              if (!ok_response_on_range_request && xhrStatus !== pendingRequest.expectedStatus) {
                if (pendingRequest.onError) {
                  pendingRequest.onError(xhr.status);
                }
                return;
              }
              this.loadedRequests[xhrId] = true;
              var chunk = getArrayBuffer(xhr);
              if (xhrStatus === PARTIAL_CONTENT_RESPONSE) {
                var rangeHeader = xhr.getResponseHeader("Content-Range");
                var matches = /bytes (\d+)-(\d+)\/(\d+)/.exec(rangeHeader);
                var begin = parseInt(matches[1], 10);
                pendingRequest.onDone({
                  begin,
                  chunk
                });
              } else if (pendingRequest.onProgressiveData) {
                pendingRequest.onDone(null);
              } else if (chunk) {
                pendingRequest.onDone({
                  begin: 0,
                  chunk
                });
              } else if (pendingRequest.onError) {
                pendingRequest.onError(xhr.status);
              }
            },
            hasPendingRequests: function NetworkManager_hasPendingRequests() {
              for (var xhrId in this.pendingRequests) {
                return true;
              }
              return false;
            },
            getRequestXhr: function NetworkManager_getXhr(xhrId) {
              return this.pendingRequests[xhrId].xhr;
            },
            isStreamingRequest: function NetworkManager_isStreamingRequest(xhrId) {
              return !!this.pendingRequests[xhrId].onProgressiveData;
            },
            isPendingRequest: function NetworkManager_isPendingRequest(xhrId) {
              return xhrId in this.pendingRequests;
            },
            isLoadedRequest: function NetworkManager_isLoadedRequest(xhrId) {
              return xhrId in this.loadedRequests;
            },
            abortAllRequests: function NetworkManager_abortAllRequests() {
              for (var xhrId in this.pendingRequests) {
                this.abortRequest(xhrId | 0);
              }
            },
            abortRequest: function NetworkManager_abortRequest(xhrId) {
              var xhr = this.pendingRequests[xhrId].xhr;
              delete this.pendingRequests[xhrId];
              xhr.abort();
            }
          };
          function PDFNetworkStream(source) {
            this._source = source;
            this._manager = new NetworkManager(source.url, {
              httpHeaders: source.httpHeaders,
              withCredentials: source.withCredentials
            });
            this._rangeChunkSize = source.rangeChunkSize;
            this._fullRequestReader = null;
            this._rangeRequestReaders = [];
          }
          PDFNetworkStream.prototype = {
            _onRangeRequestReaderClosed: function PDFNetworkStream_onRangeRequestReaderClosed(reader) {
              var i = this._rangeRequestReaders.indexOf(reader);
              if (i >= 0) {
                this._rangeRequestReaders.splice(i, 1);
              }
            },
            getFullReader: function PDFNetworkStream_getFullReader() {
              (0, _util.assert)(!this._fullRequestReader);
              this._fullRequestReader = new PDFNetworkStreamFullRequestReader(this._manager, this._source);
              return this._fullRequestReader;
            },
            getRangeReader: function PDFNetworkStream_getRangeReader(begin, end) {
              var reader = new PDFNetworkStreamRangeRequestReader(this._manager, begin, end);
              reader.onClosed = this._onRangeRequestReaderClosed.bind(this);
              this._rangeRequestReaders.push(reader);
              return reader;
            },
            cancelAllRequests: function PDFNetworkStream_cancelAllRequests(reason) {
              if (this._fullRequestReader) {
                this._fullRequestReader.cancel(reason);
              }
              var readers = this._rangeRequestReaders.slice(0);
              readers.forEach(function(reader) {
                reader.cancel(reason);
              });
            }
          };
          function PDFNetworkStreamFullRequestReader(manager, source) {
            this._manager = manager;
            var args = {
              onHeadersReceived: this._onHeadersReceived.bind(this),
              onProgressiveData: source.disableStream ? null : this._onProgressiveData.bind(this),
              onDone: this._onDone.bind(this),
              onError: this._onError.bind(this),
              onProgress: this._onProgress.bind(this)
            };
            this._url = source.url;
            this._fullRequestId = manager.requestFull(args);
            this._headersReceivedCapability = (0, _util.createPromiseCapability)();
            this._disableRange = source.disableRange || false;
            this._contentLength = source.length;
            this._rangeChunkSize = source.rangeChunkSize;
            if (!this._rangeChunkSize && !this._disableRange) {
              this._disableRange = true;
            }
            this._isStreamingSupported = false;
            this._isRangeSupported = false;
            this._cachedChunks = [];
            this._requests = [];
            this._done = false;
            this._storedError = void 0;
            this._filename = null;
            this.onProgress = null;
          }
          PDFNetworkStreamFullRequestReader.prototype = {
            _onHeadersReceived: function PDFNetworkStreamFullRequestReader_onHeadersReceived() {
              var fullRequestXhrId = this._fullRequestId;
              var fullRequestXhr = this._manager.getRequestXhr(fullRequestXhrId);
              var getResponseHeader = function getResponseHeader2(name) {
                return fullRequestXhr.getResponseHeader(name);
              };
              var _validateRangeRequest = (0, _network_utils.validateRangeRequestCapabilities)({
                getResponseHeader,
                isHttp: this._manager.isHttp,
                rangeChunkSize: this._rangeChunkSize,
                disableRange: this._disableRange
              }), allowRangeRequests = _validateRangeRequest.allowRangeRequests, suggestedLength = _validateRangeRequest.suggestedLength;
              if (allowRangeRequests) {
                this._isRangeSupported = true;
              }
              this._contentLength = suggestedLength || this._contentLength;
              this._filename = (0, _network_utils.extractFilenameFromHeader)(getResponseHeader);
              var networkManager = this._manager;
              if (networkManager.isStreamingRequest(fullRequestXhrId)) {
                this._isStreamingSupported = true;
              } else if (this._isRangeSupported) {
                networkManager.abortRequest(fullRequestXhrId);
              }
              this._headersReceivedCapability.resolve();
            },
            _onProgressiveData: function PDFNetworkStreamFullRequestReader_onProgressiveData(chunk) {
              if (this._requests.length > 0) {
                var requestCapability = this._requests.shift();
                requestCapability.resolve({
                  value: chunk,
                  done: false
                });
              } else {
                this._cachedChunks.push(chunk);
              }
            },
            _onDone: function PDFNetworkStreamFullRequestReader_onDone(args) {
              if (args) {
                this._onProgressiveData(args.chunk);
              }
              this._done = true;
              if (this._cachedChunks.length > 0) {
                return;
              }
              this._requests.forEach(function(requestCapability) {
                requestCapability.resolve({
                  value: void 0,
                  done: true
                });
              });
              this._requests = [];
            },
            _onError: function PDFNetworkStreamFullRequestReader_onError(status) {
              var url = this._url;
              var exception = (0, _network_utils.createResponseStatusError)(status, url);
              this._storedError = exception;
              this._headersReceivedCapability.reject(exception);
              this._requests.forEach(function(requestCapability) {
                requestCapability.reject(exception);
              });
              this._requests = [];
              this._cachedChunks = [];
            },
            _onProgress: function PDFNetworkStreamFullRequestReader_onProgress(data) {
              if (this.onProgress) {
                this.onProgress({
                  loaded: data.loaded,
                  total: data.lengthComputable ? data.total : this._contentLength
                });
              }
            },
            get filename() {
              return this._filename;
            },
            get isRangeSupported() {
              return this._isRangeSupported;
            },
            get isStreamingSupported() {
              return this._isStreamingSupported;
            },
            get contentLength() {
              return this._contentLength;
            },
            get headersReady() {
              return this._headersReceivedCapability.promise;
            },
            read: function() {
              var _read = _asyncToGenerator(
                _regenerator.default.mark(function _callee() {
                  var chunk, requestCapability;
                  return _regenerator.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (!this._storedError) {
                            _context.next = 2;
                            break;
                          }
                          throw this._storedError;
                        case 2:
                          if (!(this._cachedChunks.length > 0)) {
                            _context.next = 5;
                            break;
                          }
                          chunk = this._cachedChunks.shift();
                          return _context.abrupt("return", {
                            value: chunk,
                            done: false
                          });
                        case 5:
                          if (!this._done) {
                            _context.next = 7;
                            break;
                          }
                          return _context.abrupt("return", {
                            value: void 0,
                            done: true
                          });
                        case 7:
                          requestCapability = (0, _util.createPromiseCapability)();
                          this._requests.push(requestCapability);
                          return _context.abrupt("return", requestCapability.promise);
                        case 10:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee, this);
                })
              );
              function read2() {
                return _read.apply(this, arguments);
              }
              return read2;
            }(),
            cancel: function PDFNetworkStreamFullRequestReader_cancel(reason) {
              this._done = true;
              this._headersReceivedCapability.reject(reason);
              this._requests.forEach(function(requestCapability) {
                requestCapability.resolve({
                  value: void 0,
                  done: true
                });
              });
              this._requests = [];
              if (this._manager.isPendingRequest(this._fullRequestId)) {
                this._manager.abortRequest(this._fullRequestId);
              }
              this._fullRequestReader = null;
            }
          };
          function PDFNetworkStreamRangeRequestReader(manager, begin, end) {
            this._manager = manager;
            var args = {
              onDone: this._onDone.bind(this),
              onProgress: this._onProgress.bind(this)
            };
            this._requestId = manager.requestRange(begin, end, args);
            this._requests = [];
            this._queuedChunk = null;
            this._done = false;
            this.onProgress = null;
            this.onClosed = null;
          }
          PDFNetworkStreamRangeRequestReader.prototype = {
            _close: function PDFNetworkStreamRangeRequestReader_close() {
              if (this.onClosed) {
                this.onClosed(this);
              }
            },
            _onDone: function PDFNetworkStreamRangeRequestReader_onDone(data) {
              var chunk = data.chunk;
              if (this._requests.length > 0) {
                var requestCapability = this._requests.shift();
                requestCapability.resolve({
                  value: chunk,
                  done: false
                });
              } else {
                this._queuedChunk = chunk;
              }
              this._done = true;
              this._requests.forEach(function(requestCapability2) {
                requestCapability2.resolve({
                  value: void 0,
                  done: true
                });
              });
              this._requests = [];
              this._close();
            },
            _onProgress: function PDFNetworkStreamRangeRequestReader_onProgress(evt) {
              if (!this.isStreamingSupported && this.onProgress) {
                this.onProgress({
                  loaded: evt.loaded
                });
              }
            },
            get isStreamingSupported() {
              return false;
            },
            read: function() {
              var _read2 = _asyncToGenerator(
                _regenerator.default.mark(function _callee2() {
                  var chunk, requestCapability;
                  return _regenerator.default.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          if (!(this._queuedChunk !== null)) {
                            _context2.next = 4;
                            break;
                          }
                          chunk = this._queuedChunk;
                          this._queuedChunk = null;
                          return _context2.abrupt("return", {
                            value: chunk,
                            done: false
                          });
                        case 4:
                          if (!this._done) {
                            _context2.next = 6;
                            break;
                          }
                          return _context2.abrupt("return", {
                            value: void 0,
                            done: true
                          });
                        case 6:
                          requestCapability = (0, _util.createPromiseCapability)();
                          this._requests.push(requestCapability);
                          return _context2.abrupt("return", requestCapability.promise);
                        case 9:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2, this);
                })
              );
              function read2() {
                return _read2.apply(this, arguments);
              }
              return read2;
            }(),
            cancel: function PDFNetworkStreamRangeRequestReader_cancel(reason) {
              this._done = true;
              this._requests.forEach(function(requestCapability) {
                requestCapability.resolve({
                  value: void 0,
                  done: true
                });
              });
              this._requests = [];
              if (this._manager.isPendingRequest(this._requestId)) {
                this._manager.abortRequest(this._requestId);
              }
              this._close();
            }
          };
        }
        /******/
      ])
    );
  });
});
unwrapExports(pdf);
var pdf_1 = pdf;
var pdf_default = pdf_1;

// node_modules/react-pdf-js/dist/react-pdf-js.es.production.js
var import_react = __toESM(require_react());
var n = ({ file: e, onDocumentComplete: a2, page: c2, scale: n2, rotate: s, cMapUrl: i, cMapPacked: d, workerSrc: p, withCredentials: h }) => {
  const u = (0, import_react.useRef)(null), [, w] = l({ canvasEl: u, file: e, page: c2, scale: n2, rotate: s, cMapUrl: i, cMapPacked: d, workerSrc: p, withCredentials: h });
  return (0, import_react.useEffect)(() => {
    a2(w);
  }, [w]), import_react.default.createElement("canvas", { ref: u });
};
n.defaultProps = { onDocumentComplete: () => {
} };
var l = ({ canvasEl: t2, file: r2, scale: n2 = 1, rotate: l2 = 0, page: s = 1, cMapUrl: i, cMapPacked: d, workerSrc: p = "//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.1.266/pdf.worker.js", withCredentials: h = false }) => {
  const [u, w] = (0, import_react.useState)();
  (0, import_react.useEffect)(() => {
    pdf_default.GlobalWorkerOptions.workerSrc = p;
  }, []), (0, import_react.useEffect)(() => {
    const t3 = { url: r2, withCredentials: h };
    i && (t3.cMapUrl = i, t3.cMapPacked = d), pdf_default.getDocument(t3).promise.then(w);
  }, [r2, h]), (0, import_react.useEffect)(() => {
    u && u.getPage(s).then((e) => f(e));
  }, [u, s, n2, l2, t2]);
  const f = (e) => {
    const r3 = 0 === l2 ? e.rotate : e.rotate + l2;
    let o2 = 1;
    o2 = window.devicePixelRatio;
    const a2 = n2 * o2, c2 = e.getViewport({ scale: a2, rotation: r3 }), s2 = t2.current;
    if (!s2)
      return;
    const i2 = s2.getContext("2d");
    s2.style.width = `${c2.width / o2}px`, s2.style.height = `${c2.height / o2}px`, s2.height = c2.height, s2.width = c2.width;
    const d2 = { canvasContext: i2, viewport: c2 };
    e.render(d2);
  }, m = (0, import_react.useMemo)(() => !u, [u]), g = (0, import_react.useMemo)(() => u ? u._pdfInfo.numPages : null, [u]);
  return [m, g];
};
var react_pdf_js_es_production_default = n;
export {
  react_pdf_js_es_production_default as default,
  l as usePdf
};
//# sourceMappingURL=react-pdf-js.js.map
