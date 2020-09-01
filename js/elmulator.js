(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.cy.as === region.c1.as)
	{
		return 'on line ' + region.cy.as;
	}
	return 'on lines ' + region.cy.as + ' through ' + region.c1.as;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.ey,
		impl.e5,
		impl.e0,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		G: func(record.G),
		cB: record.cB,
		ct: record.ct
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.G;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.cB;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.ct) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.ey,
		impl.e5,
		impl.e0,
		function(sendToApp, initialModel) {
			var view = impl.e7;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.ey,
		impl.e5,
		impl.e0,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.cx && impl.cx(sendToApp)
			var view = impl.e7;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.d5);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.e3) && (_VirtualDom_doc.title = title = doc.e3);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.eQ;
	var onUrlRequest = impl.eR;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		cx: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.dA === next.dA
							&& curr.c7 === next.c7
							&& curr.dv.a === next.dv.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		ey: function(flags)
		{
			return A3(impl.ey, flags, _Browser_getUrl(), key);
		},
		e7: impl.e7,
		e5: impl.e5,
		e0: impl.e0
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { ev: 'hidden', d8: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { ev: 'mozHidden', d8: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { ev: 'msHidden', d8: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { ev: 'webkitHidden', d8: 'webkitvisibilitychange' }
		: { ev: 'hidden', d8: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		dH: _Browser_getScene(),
		dX: {
			dZ: _Browser_window.pageXOffset,
			d_: _Browser_window.pageYOffset,
			dY: _Browser_doc.documentElement.clientWidth,
			c6: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		dY: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		c6: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			dH: {
				dY: node.scrollWidth,
				c6: node.scrollHeight
			},
			dX: {
				dZ: node.scrollLeft,
				d_: node.scrollTop,
				dY: node.clientWidth,
				c6: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			dH: _Browser_getScene(),
			dX: {
				dZ: x,
				d_: y,
				dY: _Browser_doc.documentElement.clientWidth,
				c6: _Browser_doc.documentElement.clientHeight
			},
			ek: {
				dZ: x + rect.left,
				d_: y + rect.top,
				dY: rect.width,
				c6: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



// DECODER

var _File_decoder = _Json_decodePrim(function(value) {
	// NOTE: checks if `File` exists in case this is run on node
	return (typeof File !== 'undefined' && value instanceof File)
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FILE', value);
});


// METADATA

function _File_name(file) { return file.name; }
function _File_mime(file) { return file.type; }
function _File_size(file) { return file.size; }

function _File_lastModified(file)
{
	return $elm$time$Time$millisToPosix(file.lastModified);
}


// DOWNLOAD

var _File_downloadNode;

function _File_getDownloadNode()
{
	return _File_downloadNode || (_File_downloadNode = document.createElement('a'));
}

var _File_download = F3(function(name, mime, content)
{
	return _Scheduler_binding(function(callback)
	{
		var blob = new Blob([content], {type: mime});

		// for IE10+
		if (navigator.msSaveOrOpenBlob)
		{
			navigator.msSaveOrOpenBlob(blob, name);
			return;
		}

		// for HTML5
		var node = _File_getDownloadNode();
		var objectUrl = URL.createObjectURL(blob);
		node.href = objectUrl;
		node.download = name;
		_File_click(node);
		URL.revokeObjectURL(objectUrl);
	});
});

function _File_downloadUrl(href)
{
	return _Scheduler_binding(function(callback)
	{
		var node = _File_getDownloadNode();
		node.href = href;
		node.download = '';
		node.origin === location.origin || (node.target = '_blank');
		_File_click(node);
	});
}


// IE COMPATIBILITY

function _File_makeBytesSafeForInternetExplorer(bytes)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/10
	// all other browsers can just run `new Blob([bytes])` directly with no problem
	//
	return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

function _File_click(node)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/11
	// all other browsers have MouseEvent and do not need this conditional stuff
	//
	if (typeof MouseEvent === 'function')
	{
		node.dispatchEvent(new MouseEvent('click'));
	}
	else
	{
		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		document.body.appendChild(node);
		node.dispatchEvent(event);
		document.body.removeChild(node);
	}
}


// UPLOAD

var _File_node;

function _File_uploadOne(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			callback(_Scheduler_succeed(event.target.files[0]));
		});
		_File_click(_File_node);
	});
}

function _File_uploadOneOrMore(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.multiple = true;
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			var elmFiles = _List_fromArray(event.target.files);
			callback(_Scheduler_succeed(_Utils_Tuple2(elmFiles.a, elmFiles.b)));
		});
		_File_click(_File_node);
	});
}


// CONTENT

function _File_toString(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsText(blob);
		return function() { reader.abort(); };
	});
}

function _File_toBytes(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(new DataView(reader.result)));
		});
		reader.readAsArrayBuffer(blob);
		return function() { reader.abort(); };
	});
}

function _File_toUrl(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsDataURL(blob);
		return function() { reader.abort(); };
	});
}



// BYTES

function _Bytes_width(bytes)
{
	return bytes.byteLength;
}

var _Bytes_getHostEndianness = F2(function(le, be)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(new Uint8Array(new Uint32Array([1]))[0] === 1 ? le : be));
	});
});


// ENCODERS

function _Bytes_encode(encoder)
{
	var mutableBytes = new DataView(new ArrayBuffer($elm$bytes$Bytes$Encode$getWidth(encoder)));
	$elm$bytes$Bytes$Encode$write(encoder)(mutableBytes)(0);
	return mutableBytes;
}


// SIGNED INTEGERS

var _Bytes_write_i8  = F3(function(mb, i, n) { mb.setInt8(i, n); return i + 1; });
var _Bytes_write_i16 = F4(function(mb, i, n, isLE) { mb.setInt16(i, n, isLE); return i + 2; });
var _Bytes_write_i32 = F4(function(mb, i, n, isLE) { mb.setInt32(i, n, isLE); return i + 4; });


// UNSIGNED INTEGERS

var _Bytes_write_u8  = F3(function(mb, i, n) { mb.setUint8(i, n); return i + 1 ;});
var _Bytes_write_u16 = F4(function(mb, i, n, isLE) { mb.setUint16(i, n, isLE); return i + 2; });
var _Bytes_write_u32 = F4(function(mb, i, n, isLE) { mb.setUint32(i, n, isLE); return i + 4; });


// FLOATS

var _Bytes_write_f32 = F4(function(mb, i, n, isLE) { mb.setFloat32(i, n, isLE); return i + 4; });
var _Bytes_write_f64 = F4(function(mb, i, n, isLE) { mb.setFloat64(i, n, isLE); return i + 8; });


// BYTES

var _Bytes_write_bytes = F3(function(mb, offset, bytes)
{
	for (var i = 0, len = bytes.byteLength, limit = len - 4; i <= limit; i += 4)
	{
		mb.setUint32(offset + i, bytes.getUint32(i));
	}
	for (; i < len; i++)
	{
		mb.setUint8(offset + i, bytes.getUint8(i));
	}
	return offset + len;
});


// STRINGS

function _Bytes_getStringWidth(string)
{
	for (var width = 0, i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		width +=
			(code < 0x80) ? 1 :
			(code < 0x800) ? 2 :
			(code < 0xD800 || 0xDBFF < code) ? 3 : (i++, 4);
	}
	return width;
}

var _Bytes_write_string = F3(function(mb, offset, string)
{
	for (var i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		offset +=
			(code < 0x80)
				? (mb.setUint8(offset, code)
				, 1
				)
				:
			(code < 0x800)
				? (mb.setUint16(offset, 0xC080 /* 0b1100000010000000 */
					| (code >>> 6 & 0x1F /* 0b00011111 */) << 8
					| code & 0x3F /* 0b00111111 */)
				, 2
				)
				:
			(code < 0xD800 || 0xDBFF < code)
				? (mb.setUint16(offset, 0xE080 /* 0b1110000010000000 */
					| (code >>> 12 & 0xF /* 0b00001111 */) << 8
					| code >>> 6 & 0x3F /* 0b00111111 */)
				, mb.setUint8(offset + 2, 0x80 /* 0b10000000 */
					| code & 0x3F /* 0b00111111 */)
				, 3
				)
				:
			(code = (code - 0xD800) * 0x400 + string.charCodeAt(++i) - 0xDC00 + 0x10000
			, mb.setUint32(offset, 0xF0808080 /* 0b11110000100000001000000010000000 */
				| (code >>> 18 & 0x7 /* 0b00000111 */) << 24
				| (code >>> 12 & 0x3F /* 0b00111111 */) << 16
				| (code >>> 6 & 0x3F /* 0b00111111 */) << 8
				| code & 0x3F /* 0b00111111 */)
			, 4
			);
	}
	return offset;
});


// DECODER

var _Bytes_decode = F2(function(decoder, bytes)
{
	try {
		return $elm$core$Maybe$Just(A2(decoder, bytes, 0).b);
	} catch(e) {
		return $elm$core$Maybe$Nothing;
	}
});

var _Bytes_read_i8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getInt8(offset)); });
var _Bytes_read_i16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getInt16(offset, isLE)); });
var _Bytes_read_i32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getInt32(offset, isLE)); });
var _Bytes_read_u8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getUint8(offset)); });
var _Bytes_read_u16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getUint16(offset, isLE)); });
var _Bytes_read_u32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getUint32(offset, isLE)); });
var _Bytes_read_f32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getFloat32(offset, isLE)); });
var _Bytes_read_f64 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 8, bytes.getFloat64(offset, isLE)); });

var _Bytes_read_bytes = F3(function(len, bytes, offset)
{
	return _Utils_Tuple2(offset + len, new DataView(bytes.buffer, bytes.byteOffset + offset, len));
});

var _Bytes_read_string = F3(function(len, bytes, offset)
{
	var string = '';
	var end = offset + len;
	for (; offset < end;)
	{
		var byte = bytes.getUint8(offset++);
		string +=
			(byte < 128)
				? String.fromCharCode(byte)
				:
			((byte & 0xE0 /* 0b11100000 */) === 0xC0 /* 0b11000000 */)
				? String.fromCharCode((byte & 0x1F /* 0b00011111 */) << 6 | bytes.getUint8(offset++) & 0x3F /* 0b00111111 */)
				:
			((byte & 0xF0 /* 0b11110000 */) === 0xE0 /* 0b11100000 */)
				? String.fromCharCode(
					(byte & 0xF /* 0b00001111 */) << 12
					| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
					| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
				)
				:
				(byte =
					((byte & 0x7 /* 0b00000111 */) << 18
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 12
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
						| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
					) - 0x10000
				, String.fromCharCode(Math.floor(byte / 0x400) + 0xD800, byte % 0x400 + 0xDC00)
				);
	}
	return _Utils_Tuple2(offset, string);
});

var _Bytes_decodeFailure = F2(function() { throw 0; });
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.c) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.e),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.e);
		} else {
			var treeLen = builder.c * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.f) : builder.f;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.c);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.e) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.e);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{f: nodeList, c: (len / $elm$core$Array$branchFactor) | 0, e: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {c3: fragment, c7: host, dr: path, dv: port_, dA: protocol, dB: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$EmulatorState$Invalid = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Main$Model = F8(
	function (data, disassembledProgram, currentCpuState, nsteps, ticks, ticksDiff, ticksDiffReal, screen) {
		return {b: currentCpuState, cX: data, c$: disassembledProgram, bn: nsteps, cw: screen, aB: ticks, cG: ticksDiff, b_: ticksDiffReal};
	});
var $joakin$elm_canvas$Canvas$Internal$Canvas$Fill = function (a) {
	return {$: 1, a: a};
};
var $joakin$elm_canvas$Canvas$Internal$Canvas$SettingDrawOp = function (a) {
	return {$: 2, a: a};
};
var $joakin$elm_canvas$Canvas$Settings$fill = function (color) {
	return $joakin$elm_canvas$Canvas$Internal$Canvas$SettingDrawOp(
		$joakin$elm_canvas$Canvas$Internal$Canvas$Fill(color));
};
var $avh4$elm_color$Color$RgbaSpace = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $avh4$elm_color$Color$green = A4($avh4$elm_color$Color$RgbaSpace, 115 / 255, 210 / 255, 22 / 255, 1.0);
var $joakin$elm_canvas$Canvas$Internal$Canvas$Rect = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $joakin$elm_canvas$Canvas$rect = F3(
	function (pos, width, height) {
		return A3($joakin$elm_canvas$Canvas$Internal$Canvas$Rect, pos, width, height);
	});
var $joakin$elm_canvas$Canvas$Internal$Canvas$DrawableShapes = function (a) {
	return {$: 1, a: a};
};
var $joakin$elm_canvas$Canvas$Internal$Canvas$NotSpecified = {$: 0};
var $joakin$elm_canvas$Canvas$Renderable = $elm$core$Basics$identity;
var $joakin$elm_canvas$Canvas$Internal$Canvas$FillAndStroke = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $joakin$elm_canvas$Canvas$Internal$Canvas$Stroke = function (a) {
	return {$: 2, a: a};
};
var $joakin$elm_canvas$Canvas$mergeDrawOp = F2(
	function (op1, op2) {
		var _v0 = _Utils_Tuple2(op1, op2);
		_v0$7:
		while (true) {
			switch (_v0.b.$) {
				case 3:
					var _v1 = _v0.b;
					var c = _v1.a;
					var sc = _v1.b;
					return A2($joakin$elm_canvas$Canvas$Internal$Canvas$FillAndStroke, c, sc);
				case 1:
					switch (_v0.a.$) {
						case 1:
							var c = _v0.b.a;
							return $joakin$elm_canvas$Canvas$Internal$Canvas$Fill(c);
						case 2:
							var c1 = _v0.a.a;
							var c2 = _v0.b.a;
							return A2($joakin$elm_canvas$Canvas$Internal$Canvas$FillAndStroke, c2, c1);
						case 3:
							var _v2 = _v0.a;
							var c = _v2.a;
							var sc = _v2.b;
							var c2 = _v0.b.a;
							return A2($joakin$elm_canvas$Canvas$Internal$Canvas$FillAndStroke, c2, sc);
						default:
							break _v0$7;
					}
				case 2:
					switch (_v0.a.$) {
						case 2:
							var c = _v0.b.a;
							return $joakin$elm_canvas$Canvas$Internal$Canvas$Stroke(c);
						case 1:
							var c1 = _v0.a.a;
							var c2 = _v0.b.a;
							return A2($joakin$elm_canvas$Canvas$Internal$Canvas$FillAndStroke, c1, c2);
						case 3:
							var _v3 = _v0.a;
							var c = _v3.a;
							var sc = _v3.b;
							var sc2 = _v0.b.a;
							return A2($joakin$elm_canvas$Canvas$Internal$Canvas$FillAndStroke, c, sc2);
						default:
							break _v0$7;
					}
				default:
					if (!_v0.a.$) {
						break _v0$7;
					} else {
						var whatever = _v0.a;
						var _v5 = _v0.b;
						return whatever;
					}
			}
		}
		var _v4 = _v0.a;
		var whatever = _v0.b;
		return whatever;
	});
var $joakin$elm_canvas$Canvas$addSettingsToRenderable = F2(
	function (settings, renderable) {
		var addSetting = F2(
			function (setting, _v1) {
				var r = _v1;
				switch (setting.$) {
					case 0:
						var cmd = setting.a;
						return _Utils_update(
							r,
							{
								z: A2($elm$core$List$cons, cmd, r.z)
							});
					case 1:
						var cmds = setting.a;
						return _Utils_update(
							r,
							{
								z: A3($elm$core$List$foldl, $elm$core$List$cons, r.z, cmds)
							});
					case 3:
						var f = setting.a;
						return _Utils_update(
							r,
							{
								O: f(r.O)
							});
					default:
						var op = setting.a;
						return _Utils_update(
							r,
							{
								N: A2($joakin$elm_canvas$Canvas$mergeDrawOp, r.N, op)
							});
				}
			});
		return A3($elm$core$List$foldl, addSetting, renderable, settings);
	});
var $joakin$elm_canvas$Canvas$shapes = F2(
	function (settings, ss) {
		return A2(
			$joakin$elm_canvas$Canvas$addSettingsToRenderable,
			settings,
			{
				z: _List_Nil,
				N: $joakin$elm_canvas$Canvas$Internal$Canvas$NotSpecified,
				O: $joakin$elm_canvas$Canvas$Internal$Canvas$DrawableShapes(ss)
			});
	});
var $author$project$Main$greenScreen = _List_fromArray(
	[
		A2(
		$joakin$elm_canvas$Canvas$shapes,
		_List_fromArray(
			[
				$joakin$elm_canvas$Canvas$Settings$fill($avh4$elm_color$Color$green)
			]),
		_List_fromArray(
			[
				A3(
				$joakin$elm_canvas$Canvas$rect,
				_Utils_Tuple2(0, 0),
				256,
				224)
			]))
	]);
var $elm$html$Html$canvas = _VirtualDom_node('canvas');
var $joakin$elm_canvas$Canvas$cnvs = A2($elm$html$Html$canvas, _List_Nil, _List_Nil);
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$property = $elm$virtual_dom$VirtualDom$property;
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$commands = function (list) {
	return A2(
		$elm$html$Html$Attributes$property,
		'cmds',
		A2($elm$json$Json$Encode$list, $elm$core$Basics$identity, list));
};
var $elm$html$Html$Attributes$height = function (n) {
	return A2(
		_VirtualDom_attribute,
		'height',
		$elm$core$String$fromInt(n));
};
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNode;
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$empty = _List_Nil;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn = F2(
	function (name, args) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('function')),
					_Utils_Tuple2(
					'name',
					$elm$json$Json$Encode$string(name)),
					_Utils_Tuple2(
					'args',
					A2($elm$json$Json$Encode$list, $elm$core$Basics$identity, args))
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$beginPath = A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn, 'beginPath', _List_Nil);
var $elm$json$Json$Encode$float = _Json_wrap;
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$clearRect = F4(
	function (x, y, width, height) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'clearRect',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y),
					$elm$json$Json$Encode$float(width),
					$elm$json$Json$Encode$float(height)
				]));
	});
var $joakin$elm_canvas$Canvas$renderClear = F4(
	function (_v0, w, h, cmds) {
		var x = _v0.a;
		var y = _v0.b;
		return A2(
			$elm$core$List$cons,
			A4($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$clearRect, x, y, w, h),
			cmds);
	});
var $elm$json$Json$Encode$bool = _Json_wrap;
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$arc = F6(
	function (x, y, radius, startAngle, endAngle, anticlockwise) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'arc',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y),
					$elm$json$Json$Encode$float(radius),
					$elm$json$Json$Encode$float(startAngle),
					$elm$json$Json$Encode$float(endAngle),
					$elm$json$Json$Encode$bool(anticlockwise)
				]));
	});
var $elm$core$Basics$pi = _Basics_pi;
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$circle = F3(
	function (x, y, r) {
		return A6($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$arc, x, y, r, 0, 2 * $elm$core$Basics$pi, false);
	});
var $elm$core$Basics$cos = _Basics_cos;
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo = F2(
	function (x, y) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'moveTo',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$rect = F4(
	function (x, y, w, h) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'rect',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y),
					$elm$json$Json$Encode$float(w),
					$elm$json$Json$Encode$float(h)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$arcTo = F5(
	function (x1, y1, x2, y2, radius) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'arcTo',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(x1),
					$elm$json$Json$Encode$float(y1),
					$elm$json$Json$Encode$float(x2),
					$elm$json$Json$Encode$float(y2),
					$elm$json$Json$Encode$float(radius)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$bezierCurveTo = F6(
	function (cp1x, cp1y, cp2x, cp2y, x, y) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'bezierCurveTo',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(cp1x),
					$elm$json$Json$Encode$float(cp1y),
					$elm$json$Json$Encode$float(cp2x),
					$elm$json$Json$Encode$float(cp2y),
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$lineTo = F2(
	function (x, y) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'lineTo',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$quadraticCurveTo = F4(
	function (cpx, cpy, x, y) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'quadraticCurveTo',
			_List_fromArray(
				[
					$elm$json$Json$Encode$float(cpx),
					$elm$json$Json$Encode$float(cpy),
					$elm$json$Json$Encode$float(x),
					$elm$json$Json$Encode$float(y)
				]));
	});
var $joakin$elm_canvas$Canvas$renderLineSegment = F2(
	function (segment, cmds) {
		switch (segment.$) {
			case 0:
				var _v1 = segment.a;
				var x = _v1.a;
				var y = _v1.b;
				var _v2 = segment.b;
				var x2 = _v2.a;
				var y2 = _v2.b;
				var radius = segment.c;
				return A2(
					$elm$core$List$cons,
					A5($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$arcTo, x, y, x2, y2, radius),
					cmds);
			case 1:
				var _v3 = segment.a;
				var cp1x = _v3.a;
				var cp1y = _v3.b;
				var _v4 = segment.b;
				var cp2x = _v4.a;
				var cp2y = _v4.b;
				var _v5 = segment.c;
				var x = _v5.a;
				var y = _v5.b;
				return A2(
					$elm$core$List$cons,
					A6($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$bezierCurveTo, cp1x, cp1y, cp2x, cp2y, x, y),
					cmds);
			case 2:
				var _v6 = segment.a;
				var x = _v6.a;
				var y = _v6.b;
				return A2(
					$elm$core$List$cons,
					A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$lineTo, x, y),
					cmds);
			case 3:
				var _v7 = segment.a;
				var x = _v7.a;
				var y = _v7.b;
				return A2(
					$elm$core$List$cons,
					A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo, x, y),
					cmds);
			default:
				var _v8 = segment.a;
				var cpx = _v8.a;
				var cpy = _v8.b;
				var _v9 = segment.b;
				var x = _v9.a;
				var y = _v9.b;
				return A2(
					$elm$core$List$cons,
					A4($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$quadraticCurveTo, cpx, cpy, x, y),
					cmds);
		}
	});
var $elm$core$Basics$sin = _Basics_sin;
var $joakin$elm_canvas$Canvas$renderShape = F2(
	function (shape, cmds) {
		switch (shape.$) {
			case 0:
				var _v1 = shape.a;
				var x = _v1.a;
				var y = _v1.b;
				var w = shape.b;
				var h = shape.c;
				return A2(
					$elm$core$List$cons,
					A4($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$rect, x, y, w, h),
					A2(
						$elm$core$List$cons,
						A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo, x, y),
						cmds));
			case 1:
				var _v2 = shape.a;
				var x = _v2.a;
				var y = _v2.b;
				var r = shape.b;
				return A2(
					$elm$core$List$cons,
					A3($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$circle, x, y, r),
					A2(
						$elm$core$List$cons,
						A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo, x + r, y),
						cmds));
			case 2:
				var _v3 = shape.a;
				var x = _v3.a;
				var y = _v3.b;
				var segments = shape.b;
				return A3(
					$elm$core$List$foldl,
					$joakin$elm_canvas$Canvas$renderLineSegment,
					A2(
						$elm$core$List$cons,
						A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo, x, y),
						cmds),
					segments);
			default:
				var _v4 = shape.a;
				var x = _v4.a;
				var y = _v4.b;
				var radius = shape.b;
				var startAngle = shape.c;
				var endAngle = shape.d;
				var anticlockwise = shape.e;
				return A2(
					$elm$core$List$cons,
					A2(
						$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo,
						x + (radius * $elm$core$Basics$cos(endAngle)),
						y + (radius * $elm$core$Basics$sin(endAngle))),
					A2(
						$elm$core$List$cons,
						A6($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$arc, x, y, radius, startAngle, endAngle, anticlockwise),
						A2(
							$elm$core$List$cons,
							A2(
								$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$moveTo,
								x + (radius * $elm$core$Basics$cos(startAngle)),
								y + (radius * $elm$core$Basics$sin(startAngle))),
							cmds)));
		}
	});
var $avh4$elm_color$Color$black = A4($avh4$elm_color$Color$RgbaSpace, 0 / 255, 0 / 255, 0 / 255, 1.0);
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$NonZero = 0;
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillRuleToString = function (fillRule) {
	if (!fillRule) {
		return 'nonzero';
	} else {
		return 'evenodd';
	}
};
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fill = function (fillRule) {
	return A2(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
		'fill',
		_List_fromArray(
			[
				$elm$json$Json$Encode$string(
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillRuleToString(fillRule))
			]));
};
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$field = F2(
	function (name, value) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'type',
					$elm$json$Json$Encode$string('field')),
					_Utils_Tuple2(
					'name',
					$elm$json$Json$Encode$string(name)),
					_Utils_Tuple2('value', value)
				]));
	});
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$core$Basics$round = _Basics_round;
var $avh4$elm_color$Color$toCssString = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	var roundTo = function (x) {
		return $elm$core$Basics$round(x * 1000) / 1000;
	};
	var pct = function (x) {
		return $elm$core$Basics$round(x * 10000) / 100;
	};
	return $elm$core$String$concat(
		_List_fromArray(
			[
				'rgba(',
				$elm$core$String$fromFloat(
				pct(r)),
				'%,',
				$elm$core$String$fromFloat(
				pct(g)),
				'%,',
				$elm$core$String$fromFloat(
				pct(b)),
				'%,',
				$elm$core$String$fromFloat(
				roundTo(a)),
				')'
			]));
};
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillStyle = function (color) {
	return A2(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$field,
		'fillStyle',
		$elm$json$Json$Encode$string(
			$avh4$elm_color$Color$toCssString(color)));
};
var $joakin$elm_canvas$Canvas$renderShapeFill = F2(
	function (c, cmds) {
		return A2(
			$elm$core$List$cons,
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fill(0),
			A2(
				$elm$core$List$cons,
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillStyle(c),
				cmds));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$stroke = A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn, 'stroke', _List_Nil);
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$strokeStyle = function (color) {
	return A2(
		$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$field,
		'strokeStyle',
		$elm$json$Json$Encode$string(
			$avh4$elm_color$Color$toCssString(color)));
};
var $joakin$elm_canvas$Canvas$renderShapeStroke = F2(
	function (c, cmds) {
		return A2(
			$elm$core$List$cons,
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$stroke,
			A2(
				$elm$core$List$cons,
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$strokeStyle(c),
				cmds));
	});
var $joakin$elm_canvas$Canvas$renderShapeDrawOp = F2(
	function (drawOp, cmds) {
		switch (drawOp.$) {
			case 0:
				return A2($joakin$elm_canvas$Canvas$renderShapeFill, $avh4$elm_color$Color$black, cmds);
			case 1:
				var c = drawOp.a;
				return A2($joakin$elm_canvas$Canvas$renderShapeFill, c, cmds);
			case 2:
				var c = drawOp.a;
				return A2($joakin$elm_canvas$Canvas$renderShapeStroke, c, cmds);
			default:
				var fc = drawOp.a;
				var sc = drawOp.b;
				return A2(
					$joakin$elm_canvas$Canvas$renderShapeStroke,
					sc,
					A2($joakin$elm_canvas$Canvas$renderShapeFill, fc, cmds));
		}
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillText = F4(
	function (text, x, y, maybeMaxWidth) {
		if (maybeMaxWidth.$ === 1) {
			return A2(
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
				'fillText',
				_List_fromArray(
					[
						$elm$json$Json$Encode$string(text),
						$elm$json$Json$Encode$float(x),
						$elm$json$Json$Encode$float(y)
					]));
		} else {
			var maxWidth = maybeMaxWidth.a;
			return A2(
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
				'fillText',
				_List_fromArray(
					[
						$elm$json$Json$Encode$string(text),
						$elm$json$Json$Encode$float(x),
						$elm$json$Json$Encode$float(y),
						$elm$json$Json$Encode$float(maxWidth)
					]));
		}
	});
var $joakin$elm_canvas$Canvas$renderTextFill = F5(
	function (txt, x, y, color, cmds) {
		return A2(
			$elm$core$List$cons,
			A4($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillText, txt.cF, x, y, txt.cl),
			A2(
				$elm$core$List$cons,
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fillStyle(color),
				cmds));
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$strokeText = F4(
	function (text, x, y, maybeMaxWidth) {
		if (maybeMaxWidth.$ === 1) {
			return A2(
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
				'strokeText',
				_List_fromArray(
					[
						$elm$json$Json$Encode$string(text),
						$elm$json$Json$Encode$float(x),
						$elm$json$Json$Encode$float(y)
					]));
		} else {
			var maxWidth = maybeMaxWidth.a;
			return A2(
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
				'strokeText',
				_List_fromArray(
					[
						$elm$json$Json$Encode$string(text),
						$elm$json$Json$Encode$float(x),
						$elm$json$Json$Encode$float(y),
						$elm$json$Json$Encode$float(maxWidth)
					]));
		}
	});
var $joakin$elm_canvas$Canvas$renderTextStroke = F5(
	function (txt, x, y, color, cmds) {
		return A2(
			$elm$core$List$cons,
			A4($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$strokeText, txt.cF, x, y, txt.cl),
			A2(
				$elm$core$List$cons,
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$strokeStyle(color),
				cmds));
	});
var $joakin$elm_canvas$Canvas$renderTextDrawOp = F3(
	function (drawOp, txt, cmds) {
		var _v0 = txt.du;
		var x = _v0.a;
		var y = _v0.b;
		switch (drawOp.$) {
			case 0:
				return A5($joakin$elm_canvas$Canvas$renderTextFill, txt, x, y, $avh4$elm_color$Color$black, cmds);
			case 1:
				var c = drawOp.a;
				return A5($joakin$elm_canvas$Canvas$renderTextFill, txt, x, y, c, cmds);
			case 2:
				var c = drawOp.a;
				return A5($joakin$elm_canvas$Canvas$renderTextStroke, txt, x, y, c, cmds);
			default:
				var fc = drawOp.a;
				var sc = drawOp.b;
				return A5(
					$joakin$elm_canvas$Canvas$renderTextStroke,
					txt,
					x,
					y,
					sc,
					A5($joakin$elm_canvas$Canvas$renderTextFill, txt, x, y, fc, cmds));
		}
	});
var $joakin$elm_canvas$Canvas$renderText = F3(
	function (drawOp, txt, cmds) {
		return A3($joakin$elm_canvas$Canvas$renderTextDrawOp, drawOp, txt, cmds);
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$drawImage = F9(
	function (sx, sy, sw, sh, dx, dy, dw, dh, imageObj) {
		return A2(
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn,
			'drawImage',
			_List_fromArray(
				[
					imageObj,
					$elm$json$Json$Encode$float(sx),
					$elm$json$Json$Encode$float(sy),
					$elm$json$Json$Encode$float(sw),
					$elm$json$Json$Encode$float(sh),
					$elm$json$Json$Encode$float(dx),
					$elm$json$Json$Encode$float(dy),
					$elm$json$Json$Encode$float(dw),
					$elm$json$Json$Encode$float(dh)
				]));
	});
var $joakin$elm_canvas$Canvas$Internal$Texture$drawTexture = F4(
	function (x, y, t, cmds) {
		return A2(
			$elm$core$List$cons,
			function () {
				if (!t.$) {
					var image = t.a;
					return A9($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$drawImage, 0, 0, image.dY, image.c6, x, y, image.dY, image.c6, image.bg);
				} else {
					var sprite = t.a;
					var image = t.b;
					return A9($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$drawImage, sprite.dZ, sprite.d_, sprite.dY, sprite.c6, x, y, sprite.dY, sprite.c6, image.bg);
				}
			}(),
			cmds);
	});
var $joakin$elm_canvas$Canvas$renderTexture = F3(
	function (_v0, t, cmds) {
		var x = _v0.a;
		var y = _v0.b;
		return A4($joakin$elm_canvas$Canvas$Internal$Texture$drawTexture, x, y, t, cmds);
	});
var $joakin$elm_canvas$Canvas$renderDrawable = F3(
	function (drawable, drawOp, cmds) {
		switch (drawable.$) {
			case 0:
				var txt = drawable.a;
				return A3($joakin$elm_canvas$Canvas$renderText, drawOp, txt, cmds);
			case 1:
				var ss = drawable.a;
				return A2(
					$joakin$elm_canvas$Canvas$renderShapeDrawOp,
					drawOp,
					A3(
						$elm$core$List$foldl,
						$joakin$elm_canvas$Canvas$renderShape,
						A2($elm$core$List$cons, $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$beginPath, cmds),
						ss));
			case 2:
				var p = drawable.a;
				var t = drawable.b;
				return A3($joakin$elm_canvas$Canvas$renderTexture, p, t, cmds);
			default:
				var p = drawable.a;
				var w = drawable.b;
				var h = drawable.c;
				return A4($joakin$elm_canvas$Canvas$renderClear, p, w, h, cmds);
		}
	});
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$restore = A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn, 'restore', _List_Nil);
var $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$save = A2($joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$fn, 'save', _List_Nil);
var $joakin$elm_canvas$Canvas$renderOne = F2(
	function (_v0, cmds) {
		var data = _v0;
		var commands = data.z;
		var drawable = data.O;
		var drawOp = data.N;
		return A2(
			$elm$core$List$cons,
			$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$restore,
			A3(
				$joakin$elm_canvas$Canvas$renderDrawable,
				drawable,
				drawOp,
				_Utils_ap(
					commands,
					A2($elm$core$List$cons, $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$save, cmds))));
	});
var $joakin$elm_canvas$Canvas$render = function (entities) {
	return A3($elm$core$List$foldl, $joakin$elm_canvas$Canvas$renderOne, $joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$empty, entities);
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $joakin$elm_canvas$Canvas$Internal$Texture$TImage = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $joakin$elm_canvas$Canvas$Internal$Texture$decodeTextureImage = A2(
	$elm$json$Json$Decode$andThen,
	function (image) {
		return A4(
			$elm$json$Json$Decode$map3,
			F3(
				function (tagName, width, height) {
					return (tagName === 'IMG') ? $elm$core$Maybe$Just(
						$joakin$elm_canvas$Canvas$Internal$Texture$TImage(
							{c6: height, bg: image, dY: width})) : $elm$core$Maybe$Nothing;
				}),
			A2($elm$json$Json$Decode$field, 'tagName', $elm$json$Json$Decode$string),
			A2($elm$json$Json$Decode$field, 'width', $elm$json$Json$Decode$float),
			A2($elm$json$Json$Decode$field, 'height', $elm$json$Json$Decode$float));
	},
	$elm$json$Json$Decode$value);
var $joakin$elm_canvas$Canvas$Internal$Texture$decodeImageLoadEvent = A2($elm$json$Json$Decode$field, 'target', $joakin$elm_canvas$Canvas$Internal$Texture$decodeTextureImage);
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $joakin$elm_canvas$Canvas$renderTextureSource = function (textureSource) {
	var url = textureSource.a;
	var onLoad = textureSource.b;
	return _Utils_Tuple2(
		url,
		A2(
			$elm$html$Html$img,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$src(url),
					A2($elm$html$Html$Attributes$attribute, 'crossorigin', 'anonymous'),
					A2($elm$html$Html$Attributes$style, 'display', 'none'),
					A2(
					$elm$html$Html$Events$on,
					'load',
					A2($elm$json$Json$Decode$map, onLoad, $joakin$elm_canvas$Canvas$Internal$Texture$decodeImageLoadEvent)),
					A2(
					$elm$html$Html$Events$on,
					'error',
					$elm$json$Json$Decode$succeed(
						onLoad($elm$core$Maybe$Nothing)))
				]),
			_List_Nil));
};
var $elm$html$Html$Attributes$width = function (n) {
	return A2(
		_VirtualDom_attribute,
		'width',
		$elm$core$String$fromInt(n));
};
var $joakin$elm_canvas$Canvas$toHtmlWith = F3(
	function (options, attrs, entities) {
		return A3(
			$elm$html$Html$Keyed$node,
			'elm-canvas',
			A2(
				$elm$core$List$cons,
				$joakin$elm_canvas$Canvas$Internal$CustomElementJsonApi$commands(
					$joakin$elm_canvas$Canvas$render(entities)),
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$height(options.c6),
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$width(options.dY),
						attrs))),
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2('__canvas', $joakin$elm_canvas$Canvas$cnvs),
				A2($elm$core$List$map, $joakin$elm_canvas$Canvas$renderTextureSource, options.dQ)));
	});
var $joakin$elm_canvas$Canvas$toHtml = F3(
	function (_v0, attrs, entities) {
		var w = _v0.a;
		var h = _v0.b;
		return A3(
			$joakin$elm_canvas$Canvas$toHtmlWith,
			{c6: h, dQ: _List_Nil, dY: w},
			attrs,
			entities);
	});
var $author$project$Main$greenScreenHtml = function () {
	var width = 256;
	var height = 224;
	return A3(
		$joakin$elm_canvas$Canvas$toHtml,
		_Utils_Tuple2(width, height),
		_List_Nil,
		$author$project$Main$greenScreen);
}();
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2(
		A8(
			$author$project$Main$Model,
			$elm$core$Maybe$Nothing,
			$elm$core$Maybe$Nothing,
			A2($author$project$EmulatorState$Invalid, $elm$core$Maybe$Nothing, 'No ROM loaded yet'),
			0,
			0,
			0,
			0,
			$author$project$Main$greenScreenHtml),
		$elm$core$Platform$Cmd$none);
};
var $author$project$UI$Msg$EmulationWithInterrupt = function (a) {
	return {$: 5, a: a};
};
var $author$project$UI$Msg$RenderScreen = function (a) {
	return {$: 10, a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $author$project$Config$clock = 2000;
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {dz: processes, dO: taggers};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 1) {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.dz;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.dO);
		if (_v0.$ === 1) {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $author$project$UI$Msg$InterruptRequested = {$: 11};
var $author$project$UI$Msg$KeyDown = function (a) {
	return {$: 6, a: a};
};
var $author$project$UI$Msg$Left = 0;
var $author$project$UI$Msg$NextStepsRequested = function (a) {
	return {$: 3, a: a};
};
var $author$project$UI$Msg$Reset = {$: 8};
var $author$project$UI$Msg$Right = 1;
var $author$project$UI$Msg$RomRequested = {$: 0};
var $author$project$UI$Msg$Space = 2;
var $author$project$UI$Msg$StepsSubmitted = {$: 13};
var $elm$json$Json$Decode$fail = _Json_fail;
var $author$project$UI$KeyDecoder$keyDecoderDown = A2(
	$elm$json$Json$Decode$andThen,
	function (string) {
		switch (string) {
			case 'l':
				return $elm$json$Json$Decode$succeed($author$project$UI$Msg$RomRequested);
			case 'r':
				return $elm$json$Json$Decode$succeed($author$project$UI$Msg$Reset);
			case 'n':
				return $elm$json$Json$Decode$succeed(
					$author$project$UI$Msg$NextStepsRequested(1));
			case 'x':
				return $elm$json$Json$Decode$succeed(
					$author$project$UI$Msg$NextStepsRequested(1500));
			case 'i':
				return $elm$json$Json$Decode$succeed($author$project$UI$Msg$InterruptRequested);
			case 'a':
				return $elm$json$Json$Decode$succeed(
					$author$project$UI$Msg$KeyDown(0));
			case 'd':
				return $elm$json$Json$Decode$succeed(
					$author$project$UI$Msg$KeyDown(1));
			case 'e':
				return $elm$json$Json$Decode$succeed($author$project$UI$Msg$StepsSubmitted);
			case 's':
				return $elm$json$Json$Decode$succeed(
					$author$project$UI$Msg$KeyDown(2));
			default:
				return $elm$json$Json$Decode$fail('Pressed key is not a Elmulator Button');
		}
	},
	A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
var $author$project$UI$Msg$KeyUp = function (a) {
	return {$: 7, a: a};
};
var $author$project$UI$KeyDecoder$keyDecoderUp = A2(
	$elm$json$Json$Decode$andThen,
	function (string) {
		switch (string) {
			case 'a':
				return $elm$json$Json$Decode$succeed(
					$author$project$UI$Msg$KeyUp(0));
			case 'd':
				return $elm$json$Json$Decode$succeed(
					$author$project$UI$Msg$KeyUp(1));
			case 's':
				return $elm$json$Json$Decode$succeed(
					$author$project$UI$Msg$KeyUp(2));
			default:
				return $elm$json$Json$Decode$fail('Pressed key is not a Elmulator Button');
		}
	},
	A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
var $elm$browser$Browser$Events$Document = 0;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {dt: pids, dN: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {c2: event, de: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.dt,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.de;
		var event = _v0.c2;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.dN);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, 0, 'keydown');
var $elm$browser$Browser$Events$onKeyUp = A2($elm$browser$Browser$Events$on, 0, 'keyup');
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$elm$browser$Browser$Events$onKeyDown($author$project$UI$KeyDecoder$keyDecoderDown),
				$elm$browser$Browser$Events$onKeyUp($author$project$UI$KeyDecoder$keyDecoderUp),
				A2($elm$time$Time$every, 40, $author$project$UI$Msg$RenderScreen),
				A2($elm$time$Time$every, $author$project$Config$clock, $author$project$UI$Msg$EmulationWithInterrupt)
			]));
};
var $author$project$UI$Msg$RomLoaded = function (a) {
	return {$: 2, a: a};
};
var $author$project$UI$Msg$RomSelected = function (a) {
	return {$: 1, a: a};
};
var $author$project$EmulatorState$Valid = function (a) {
	return {$: 0, a: a};
};
var $author$project$Cpu$setFlag = F2(
	function (event, conditionCodes) {
		switch (event.$) {
			case 0:
				var flag = event.a;
				return _Utils_update(
					conditionCodes,
					{e9: flag});
			case 1:
				var flag = event.a;
				return _Utils_update(
					conditionCodes,
					{eX: flag});
			case 2:
				var flag = event.a;
				return _Utils_update(
					conditionCodes,
					{eU: flag});
			case 3:
				var flag = event.a;
				return _Utils_update(
					conditionCodes,
					{ed: flag});
			default:
				var flag = event.a;
				return _Utils_update(
					conditionCodes,
					{d1: flag});
		}
	});
var $author$project$Cpu$setCpuState = F2(
	function (event, cpuState) {
		switch (event.$) {
			case 0:
				var register = event.a;
				return _Utils_update(
					cpuState,
					{d0: register});
			case 1:
				var register = event.a;
				return _Utils_update(
					cpuState,
					{d4: register});
			case 2:
				var register = event.a;
				return _Utils_update(
					cpuState,
					{d7: register});
			case 3:
				var register = event.a;
				return _Utils_update(
					cpuState,
					{ee: register});
			case 4:
				var register = event.a;
				return _Utils_update(
					cpuState,
					{ej: register});
			case 5:
				var register = event.a;
				return _Utils_update(
					cpuState,
					{es: register});
			case 6:
				var register = event.a;
				return _Utils_update(
					cpuState,
					{ez: register});
			case 7:
				var value = event.a;
				return _Utils_update(
					cpuState,
					{ay: value});
			case 8:
				var value = event.a;
				return _Utils_update(
					cpuState,
					{eZ: value});
			case 9:
				var setFlagEvent = event.a;
				return _Utils_update(
					cpuState,
					{
						cT: A2($author$project$Cpu$setFlag, setFlagEvent, cpuState.cT)
					});
			case 10:
				var flag = event.a;
				return _Utils_update(
					cpuState,
					{db: flag});
			default:
				var cycles = event.a;
				return _Utils_update(
					cpuState,
					{cV: cpuState.cV + cycles});
		}
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (!_v0.$) {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $author$project$Cpu$setMemory = F3(
	function (address, value, cpuState) {
		var updatedMemory = A3($elm$core$Array$set, address, value, cpuState.bk);
		return _Utils_update(
			cpuState,
			{bk: updatedMemory});
	});
var $author$project$Cpu$setPorts = F2(
	function (event, ports) {
		if (!event.$) {
			var data = event.a;
			return _Utils_update(
				ports,
				{$7: data});
		} else {
			var data = event.a;
			return _Utils_update(
				ports,
				{$7: data});
		}
	});
var $author$project$Cpu$setShiftRegister = F2(
	function (event, shiftRegister) {
		switch (event.$) {
			case 0:
				var data = event.a;
				return _Utils_update(
					shiftRegister,
					{eB: data});
			case 1:
				var data = event.a;
				return _Utils_update(
					shiftRegister,
					{e6: data});
			default:
				var data = event.a;
				return _Utils_update(
					shiftRegister,
					{eP: data});
		}
	});
var $author$project$Cpu$applyEvent = F2(
	function (event, machineState) {
		switch (event.$) {
			case 1:
				var address = event.a;
				var value = event.b;
				return A3($author$project$Cpu$setMemory, address, value, machineState);
			case 0:
				var setCpuStateEvent = event.a;
				var newCpuState = A2($author$project$Cpu$setCpuState, setCpuStateEvent, machineState.K);
				return _Utils_update(
					machineState,
					{K: newCpuState});
			case 2:
				var shiftRegisterEvent = event.a;
				var newShiftRegister = A2($author$project$Cpu$setShiftRegister, shiftRegisterEvent, machineState.dJ);
				return _Utils_update(
					machineState,
					{dJ: newShiftRegister});
			default:
				var setPortEvent = event.a;
				var newPorts = A2($author$project$Cpu$setPorts, setPortEvent, machineState.dw);
				return _Utils_update(
					machineState,
					{dw: newPorts});
		}
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$CpuValidator$validate = function (machineState) {
	return (((machineState.cA === 100) && ((machineState.K.d0 !== 248) || ((machineState.K.d4 !== 241) || ((!(!machineState.K.d7)) || ((machineState.K.ee !== 27) || ((machineState.K.ej !== 15) || ((machineState.K.es !== 32) || ((machineState.K.ez !== 15) || ((machineState.K.ay !== 6706) || ((machineState.K.eZ !== 9214) || (machineState.K.cT.d1 || (machineState.K.cT.ed || ((!machineState.K.cT.eX) || (machineState.K.cT.eU || machineState.K.cT.e9)))))))))))))) || (((machineState.cA === 150) && ((machineState.K.d0 !== 12) || ((machineState.K.d4 !== 233) || ((!(!machineState.K.d7)) || ((machineState.K.ee !== 27) || ((machineState.K.ej !== 23) || ((machineState.K.es !== 32) || ((machineState.K.ez !== 23) || ((machineState.K.ay !== 6708) || ((machineState.K.eZ !== 9214) || (machineState.K.cT.d1 || (machineState.K.cT.ed || ((!machineState.K.cT.eX) || (machineState.K.cT.eU || machineState.K.cT.e9)))))))))))))) || (((machineState.cA === 175) && ((machineState.K.d0 !== 48) || ((machineState.K.d4 !== 229) || ((!(!machineState.K.d7)) || ((machineState.K.ee !== 27) || ((machineState.K.ej !== 27) || ((machineState.K.es !== 32) || ((machineState.K.ez !== 28) || ((machineState.K.ay !== 6709) || ((machineState.K.eZ !== 9214) || (machineState.K.cT.d1 || (machineState.K.cT.ed || ((!machineState.K.cT.eX) || (machineState.K.cT.eU || machineState.K.cT.e9)))))))))))))) || (((machineState.cA === 1000) && ((machineState.K.d0 !== 20) || ((machineState.K.d4 !== 91) || ((!(!machineState.K.d7)) || ((machineState.K.ee !== 27) || ((machineState.K.ej !== 165) || ((machineState.K.es !== 32) || ((machineState.K.ez !== 165) || ((machineState.K.ay !== 6706) || ((machineState.K.eZ !== 9214) || (machineState.K.cT.d1 || (machineState.K.cT.ed || (machineState.K.cT.eX || (machineState.K.cT.eU || machineState.K.cT.e9)))))))))))))) || (((machineState.cA === 1500) && ((!(!machineState.K.d0)) || ((machineState.K.d4 !== 8) || ((!(!machineState.K.d7)) || ((machineState.K.ee !== 27) || ((machineState.K.ej !== 248) || ((machineState.K.es !== 32) || ((machineState.K.ez !== 248) || ((machineState.K.ay !== 6708) || ((machineState.K.eZ !== 9214) || (machineState.K.cT.d1 || (machineState.K.cT.ed || (machineState.K.cT.eX || ((!machineState.K.cT.eU) || machineState.K.cT.e9)))))))))))))) || (((machineState.cA === 2000) && ((machineState.K.d0 !== 36) || ((!(!machineState.K.d4)) || ((!(!machineState.K.d7)) || ((machineState.K.ee !== 28) || ((!(!machineState.K.ej)) || ((machineState.K.es !== 36) || ((machineState.K.ez !== 90) || ((machineState.K.ay !== 6751) || ((machineState.K.eZ !== 9212) || (machineState.K.cT.d1 || ((!machineState.K.cT.ed) || ((!machineState.K.cT.eX) || ((!machineState.K.cT.eU) || machineState.K.cT.e9)))))))))))))) || (((machineState.cA === 3000) && ((machineState.K.d0 !== 37) || ((!(!machineState.K.d4)) || ((!(!machineState.K.d7)) || ((machineState.K.ee !== 28) || ((!(!machineState.K.ej)) || ((machineState.K.es !== 37) || ((machineState.K.ez !== 34) || ((machineState.K.ay !== 6751) || ((machineState.K.eZ !== 9212) || (machineState.K.cT.d1 || ((!machineState.K.cT.ed) || ((!machineState.K.cT.eX) || (machineState.K.cT.eU || machineState.K.cT.e9)))))))))))))) || (((machineState.cA === 6000) && ((machineState.K.d0 !== 39) || ((!(!machineState.K.d4)) || ((!(!machineState.K.d7)) || ((machineState.K.ee !== 28) || ((!(!machineState.K.ej)) || ((machineState.K.es !== 39) || ((machineState.K.ez !== 122) || ((machineState.K.ay !== 6751) || ((machineState.K.eZ !== 9212) || (machineState.K.cT.d1 || ((!machineState.K.cT.ed) || ((!machineState.K.cT.eX) || (machineState.K.cT.eU || machineState.K.cT.e9)))))))))))))) || (((machineState.cA === 9000) && ((machineState.K.d0 !== 41) || ((!(!machineState.K.d4)) || ((!(!machineState.K.d7)) || ((machineState.K.ee !== 28) || ((!(!machineState.K.ej)) || ((machineState.K.es !== 41) || ((machineState.K.ez !== 210) || ((machineState.K.ay !== 6751) || ((machineState.K.eZ !== 9212) || (machineState.K.cT.d1 || ((!machineState.K.cT.ed) || ((!machineState.K.cT.eX) || (machineState.K.cT.eU || machineState.K.cT.e9)))))))))))))) || (((machineState.cA === 12000) && ((machineState.K.d0 !== 44) || ((!(!machineState.K.d4)) || ((!(!machineState.K.d7)) || ((machineState.K.ee !== 28) || ((!(!machineState.K.ej)) || ((machineState.K.es !== 44) || ((machineState.K.ez !== 42) || ((machineState.K.ay !== 6751) || ((machineState.K.eZ !== 9212) || (machineState.K.cT.d1 || ((!machineState.K.cT.ed) || ((!machineState.K.cT.eX) || ((!machineState.K.cT.eU) || machineState.K.cT.e9)))))))))))))) || (((machineState.cA === 15000) && ((machineState.K.d0 !== 46) || ((!(!machineState.K.d4)) || ((!(!machineState.K.d7)) || ((machineState.K.ee !== 28) || ((!(!machineState.K.ej)) || ((machineState.K.es !== 46) || ((machineState.K.ez !== 130) || ((machineState.K.ay !== 6751) || ((machineState.K.eZ !== 9212) || (machineState.K.cT.d1 || ((!machineState.K.cT.ed) || ((!machineState.K.cT.eX) || ((!machineState.K.cT.eU) || machineState.K.cT.e9)))))))))))))) || (((machineState.cA === 30000) && ((machineState.K.d0 !== 58) || ((!(!machineState.K.d4)) || ((!(!machineState.K.d7)) || ((machineState.K.ee !== 28) || ((!(!machineState.K.ej)) || ((machineState.K.es !== 58) || ((machineState.K.ez !== 58) || ((machineState.K.ay !== 6751) || ((machineState.K.eZ !== 9212) || (machineState.K.cT.d1 || ((!machineState.K.cT.ed) || ((!machineState.K.cT.eX) || ((!machineState.K.cT.eU) || machineState.K.cT.e9)))))))))))))) || (((machineState.cA === 35000) && ((machineState.K.d0 !== 62) || ((!(!machineState.K.d4)) || ((!(!machineState.K.d7)) || ((machineState.K.ee !== 28) || ((!(!machineState.K.ej)) || ((machineState.K.es !== 62) || ((machineState.K.ez !== 34) || ((machineState.K.ay !== 6751) || ((machineState.K.eZ !== 9212) || (machineState.K.cT.d1 || ((!machineState.K.cT.ed) || ((!machineState.K.cT.eX) || ((!machineState.K.cT.eU) || machineState.K.cT.e9)))))))))))))) || (((machineState.cA === 40000) && ((!(!machineState.K.d0)) || ((!(!machineState.K.d4)) || ((!(!machineState.K.d7)) || ((machineState.K.ee !== 27) || ((!(!machineState.K.ej)) || ((machineState.K.es !== 64) || ((machineState.K.ez !== 30) || ((machineState.K.ay !== 2302) || ((machineState.K.eZ !== 9212) || (machineState.K.cT.d1 || (machineState.K.cT.ed || (machineState.K.cT.eX || ((!machineState.K.cT.eU) || (!machineState.K.cT.e9))))))))))))))) || ((machineState.cA === 40204) && ((!(!machineState.K.d0)) || ((!(!machineState.K.d4)) || ((!(!machineState.K.d7)) || ((!(!machineState.K.ee)) || ((!(!machineState.K.ej)) || ((machineState.K.es !== 41) || ((machineState.K.ez !== 28) || ((machineState.K.ay !== 2481) || ((machineState.K.eZ !== 9212) || (machineState.K.cT.d1 || (machineState.K.cT.ed || (machineState.K.cT.eX || ((!machineState.K.cT.eU) || (!machineState.K.cT.e9))))))))))))))))))))))))))))) ? A2(
		$author$project$EmulatorState$Invalid,
		$elm$core$Maybe$Just(machineState),
		'Invalid state, step=' + $elm$core$String$fromInt(machineState.cA)) : $author$project$EmulatorState$Valid(machineState);
};
var $author$project$Cpu$apply = F2(
	function (machineStateDiff, cpuState) {
		var newStep = cpuState.cA + 1;
		if (!machineStateDiff.$) {
			var maybePreviousState = machineStateDiff.a;
			var errorMessage = machineStateDiff.b;
			return A2($author$project$EmulatorState$Invalid, maybePreviousState, errorMessage);
		} else {
			var machineStateDiffEvents = machineStateDiff.a;
			return $author$project$CpuValidator$validate(
				A3(
					$elm$core$List$foldl,
					$author$project$Cpu$applyEvent,
					_Utils_update(
						cpuState,
						{cA: newStep}),
					machineStateDiffEvents));
		}
	});
var $author$project$EmulatorState$Events = function (a) {
	return {$: 1, a: a};
};
var $author$project$EmulatorState$SetCpu = function (a) {
	return {$: 0, a: a};
};
var $author$project$EmulatorState$SetPC = function (a) {
	return {$: 7, a: a};
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $author$project$Cpu$extractEvents = function (machineStateDiff) {
	if (!machineStateDiff.$) {
		return _List_Nil;
	} else {
		var list = machineStateDiff.a;
		return list;
	}
};
var $author$project$MachineInstructions$getPC = function (machineState) {
	return machineState.K.ay;
};
var $author$project$MachineInstructions$getSP = function (machineState) {
	return machineState.K.eZ;
};
var $author$project$EmulatorState$SetMemory = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$MachineInstructions$setMemory = F2(
	function (address, value) {
		return A2($author$project$EmulatorState$SetMemory, address, value);
	});
var $author$project$MachineInstructions$setPC = function (newValue) {
	return $author$project$EmulatorState$SetCpu(
		$author$project$EmulatorState$SetPC(newValue));
};
var $author$project$EmulatorState$SetSP = function (a) {
	return {$: 8, a: a};
};
var $author$project$MachineInstructions$setSP = function (newValue) {
	return $author$project$EmulatorState$SetCpu(
		$author$project$EmulatorState$SetSP(newValue));
};
var $author$project$MachineInstructions$push_ = F3(
	function (firstArg, secondArg, machineState) {
		var newSp = $author$project$MachineInstructions$getSP(machineState) - 2;
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
		var addressForTwo = $author$project$MachineInstructions$getSP(machineState) - 2;
		var addressForOne = $author$project$MachineInstructions$getSP(machineState) - 1;
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					A2($author$project$MachineInstructions$setMemory, addressForOne, firstArg),
					A2($author$project$MachineInstructions$setMemory, addressForTwo, secondArg),
					$author$project$MachineInstructions$setSP(newSp),
					$author$project$MachineInstructions$setPC(newPc)
				]));
	});
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $author$project$Cpu$generateInterruptEvents = F2(
	function (machineState, number) {
		var pcLow = machineState.K.ay & 255;
		var pcHigh = (machineState.K.ay & 65280) >> 8;
		var newPc = 8 * number;
		var pushEvents = $author$project$Cpu$extractEvents(
			A3($author$project$MachineInstructions$push_, pcHigh, pcLow, machineState));
		return $author$project$EmulatorState$Events(
			$elm$core$List$concat(
				_List_fromArray(
					[
						pushEvents,
						_List_fromArray(
						[
							$author$project$EmulatorState$SetCpu(
							$author$project$EmulatorState$SetPC(newPc))
						])
					])));
	});
var $author$project$Cpu$generateInterrupt = F2(
	function (machineState, number) {
		var machineStateDiff = A2($author$project$Cpu$generateInterruptEvents, machineState, number);
		return A2($author$project$Cpu$apply, machineStateDiff, machineState);
	});
var $author$project$Cpu$checkForInterrupt = function (machineState) {
	var intEnabled = machineState.K.db;
	return intEnabled ? A2($author$project$Cpu$generateInterrupt, machineState, 2) : $author$project$EmulatorState$Valid(machineState);
};
var $elm$file$File$Select$file = F2(
	function (mimes, toMsg) {
		return A2(
			$elm$core$Task$perform,
			toMsg,
			_File_uploadOne(mimes));
	});
var $author$project$Cpu$interrupt = function (machineState) {
	return A2($author$project$Cpu$generateInterrupt, machineState, 2);
};
var $author$project$EmulatorState$SetOne = function (a) {
	return {$: 0, a: a};
};
var $author$project$EmulatorState$SetPort = function (a) {
	return {$: 3, a: a};
};
var $elm$core$Bitwise$or = _Bitwise_or;
var $author$project$IO$pressLeft = function (machineState) {
	var newValue = machineState.dw.$7 | 16;
	return $author$project$EmulatorState$Events(
		_List_fromArray(
			[
				$author$project$EmulatorState$SetPort(
				$author$project$EmulatorState$SetOne(newValue))
			]));
};
var $author$project$IO$pressRight = function (machineState) {
	var newValue = machineState.dw.$7 | 32;
	return $author$project$EmulatorState$Events(
		_List_fromArray(
			[
				$author$project$EmulatorState$SetPort(
				$author$project$EmulatorState$SetOne(newValue))
			]));
};
var $author$project$IO$pressSpace = function (machineState) {
	var newValue = machineState.dw.$7 | 8;
	return $author$project$EmulatorState$Events(
		_List_fromArray(
			[
				$author$project$EmulatorState$SetPort(
				$author$project$EmulatorState$SetOne(newValue))
			]));
};
var $author$project$Cpu$keyPressed = F2(
	function (key, machineState) {
		switch (key) {
			case 0:
				return A2(
					$author$project$Cpu$apply,
					$author$project$IO$pressLeft(machineState),
					machineState);
			case 1:
				return A2(
					$author$project$Cpu$apply,
					$author$project$IO$pressRight(machineState),
					machineState);
			default:
				return A2(
					$author$project$Cpu$apply,
					$author$project$IO$pressSpace(machineState),
					machineState);
		}
	});
var $author$project$IO$relaseLeft = function (machineState) {
	var newValue = machineState.dw.$7 & (255 - 16);
	return $author$project$EmulatorState$Events(
		_List_fromArray(
			[
				$author$project$EmulatorState$SetPort(
				$author$project$EmulatorState$SetOne(newValue))
			]));
};
var $author$project$IO$relaseRight = function (machineState) {
	var newValue = machineState.dw.$7 & (255 - 32);
	return $author$project$EmulatorState$Events(
		_List_fromArray(
			[
				$author$project$EmulatorState$SetPort(
				$author$project$EmulatorState$SetOne(newValue))
			]));
};
var $author$project$IO$relaseSpace = function (machineState) {
	var newValue = machineState.dw.$7 & (255 - 8);
	return $author$project$EmulatorState$Events(
		_List_fromArray(
			[
				$author$project$EmulatorState$SetPort(
				$author$project$EmulatorState$SetOne(newValue))
			]));
};
var $author$project$Cpu$keyReleased = F2(
	function (key, machineState) {
		switch (key) {
			case 0:
				return A2(
					$author$project$Cpu$apply,
					$author$project$IO$relaseLeft(machineState),
					machineState);
			case 1:
				return A2(
					$author$project$Cpu$apply,
					$author$project$IO$relaseRight(machineState),
					machineState);
			default:
				return A2(
					$author$project$Cpu$apply,
					$author$project$IO$relaseSpace(machineState),
					machineState);
		}
	});
var $elm$bytes$Bytes$Decode$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$bytes$Bytes$Decode$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$bytes$Bytes$Decode$Decoder = $elm$core$Basics$identity;
var $elm$bytes$Bytes$Decode$map = F2(
	function (func, _v0) {
		var decodeA = _v0;
		return F2(
			function (bites, offset) {
				var _v1 = A2(decodeA, bites, offset);
				var aOffset = _v1.a;
				var a = _v1.b;
				return _Utils_Tuple2(
					aOffset,
					func(a));
			});
	});
var $elm$bytes$Bytes$Decode$succeed = function (a) {
	return F2(
		function (_v0, offset) {
			return _Utils_Tuple2(offset, a);
		});
};
var $author$project$FileDecoder$listStep = F2(
	function (decoder, _v0) {
		var n = _v0.a;
		var xs = _v0.b;
		return (n <= 0) ? $elm$bytes$Bytes$Decode$succeed(
			$elm$bytes$Bytes$Decode$Done(xs)) : A2(
			$elm$bytes$Bytes$Decode$map,
			function (x) {
				return $elm$bytes$Bytes$Decode$Loop(
					_Utils_Tuple2(
						n - 1,
						_Utils_ap(
							xs,
							_List_fromArray(
								[x]))));
			},
			decoder);
	});
var $elm$bytes$Bytes$Decode$loopHelp = F4(
	function (state, callback, bites, offset) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var decoder = _v0;
			var _v1 = A2(decoder, bites, offset);
			var newOffset = _v1.a;
			var step = _v1.b;
			if (!step.$) {
				var newState = step.a;
				var $temp$state = newState,
					$temp$callback = callback,
					$temp$bites = bites,
					$temp$offset = newOffset;
				state = $temp$state;
				callback = $temp$callback;
				bites = $temp$bites;
				offset = $temp$offset;
				continue loopHelp;
			} else {
				var result = step.a;
				return _Utils_Tuple2(newOffset, result);
			}
		}
	});
var $elm$bytes$Bytes$Decode$loop = F2(
	function (state, callback) {
		return A2($elm$bytes$Bytes$Decode$loopHelp, state, callback);
	});
var $author$project$FileDecoder$bytesListDecoder = F2(
	function (decoder, len) {
		return A2(
			$elm$bytes$Bytes$Decode$loop,
			_Utils_Tuple2(len, _List_Nil),
			$author$project$FileDecoder$listStep(decoder));
	});
var $elm$bytes$Bytes$Encode$getWidth = function (builder) {
	switch (builder.$) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 4;
		case 3:
			return 1;
		case 4:
			return 2;
		case 5:
			return 4;
		case 6:
			return 4;
		case 7:
			return 8;
		case 8:
			var w = builder.a;
			return w;
		case 9:
			var w = builder.a;
			return w;
		default:
			var bs = builder.a;
			return _Bytes_width(bs);
	}
};
var $elm$bytes$Bytes$LE = 0;
var $elm$bytes$Bytes$Encode$write = F3(
	function (builder, mb, offset) {
		switch (builder.$) {
			case 0:
				var n = builder.a;
				return A3(_Bytes_write_i8, mb, offset, n);
			case 1:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_i16, mb, offset, n, !e);
			case 2:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_i32, mb, offset, n, !e);
			case 3:
				var n = builder.a;
				return A3(_Bytes_write_u8, mb, offset, n);
			case 4:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_u16, mb, offset, n, !e);
			case 5:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_u32, mb, offset, n, !e);
			case 6:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_f32, mb, offset, n, !e);
			case 7:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_f64, mb, offset, n, !e);
			case 8:
				var bs = builder.b;
				return A3($elm$bytes$Bytes$Encode$writeSequence, bs, mb, offset);
			case 9:
				var s = builder.b;
				return A3(_Bytes_write_string, mb, offset, s);
			default:
				var bs = builder.a;
				return A3(_Bytes_write_bytes, mb, offset, bs);
		}
	});
var $elm$bytes$Bytes$Encode$writeSequence = F3(
	function (builders, mb, offset) {
		writeSequence:
		while (true) {
			if (!builders.b) {
				return offset;
			} else {
				var b = builders.a;
				var bs = builders.b;
				var $temp$builders = bs,
					$temp$mb = mb,
					$temp$offset = A3($elm$bytes$Bytes$Encode$write, b, mb, offset);
				builders = $temp$builders;
				mb = $temp$mb;
				offset = $temp$offset;
				continue writeSequence;
			}
		}
	});
var $elm$bytes$Bytes$Decode$decode = F2(
	function (_v0, bs) {
		var decoder = _v0;
		return A2(_Bytes_decode, decoder, bs);
	});
var $elm$bytes$Bytes$Decode$unsignedInt8 = _Bytes_read_u8;
var $elm$bytes$Bytes$width = _Bytes_width;
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$FileDecoder$decodeFile = function (rawData) {
	var listDecoder = A2(
		$author$project$FileDecoder$bytesListDecoder,
		$elm$bytes$Bytes$Decode$unsignedInt8,
		$elm$bytes$Bytes$width(rawData));
	return A2(
		$elm$core$Maybe$withDefault,
		_List_Nil,
		A2($elm$bytes$Bytes$Decode$decode, listDecoder, rawData));
};
var $author$project$InstructionDisassembler$DisassemblyState = F3(
	function (currentPosition, remainingBytes, disassembledInstructions) {
		return {cU: currentPosition, cd: disassembledInstructions, bR: remainingBytes};
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Instruction$Instruction = F3(
	function (address, opCode, payload) {
		return {cK: address, dp: opCode, ds: payload};
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $author$project$OpCode$getSpec = function (opCode) {
	return opCode.cX.dq;
};
var $author$project$OpCode$getOpCodeLength = function (opCode) {
	var opCodeSpec = $author$project$OpCode$getSpec(opCode);
	switch (opCodeSpec.$) {
		case 0:
			return 1;
		case 1:
			return 2;
		default:
			return 3;
	}
};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$InstructionDisassembler$applyOpCodeToDisassemblyState = F2(
	function (opCode, _v0) {
		var currentPosition = _v0.cU;
		var remainingBytes = _v0.bR;
		var disassembledInstructions = _v0.cd;
		var length = $author$project$OpCode$getOpCodeLength(opCode);
		var newPosition = currentPosition + length;
		var newRemainingBytes = A2($elm$core$List$drop, length, remainingBytes);
		var instructionBytes = A2($elm$core$List$take, length, remainingBytes);
		var currentInstruction = A3($author$project$Instruction$Instruction, currentPosition, opCode, instructionBytes);
		return A3(
			$author$project$InstructionDisassembler$DisassemblyState,
			newPosition,
			newRemainingBytes,
			_Utils_ap(
				disassembledInstructions,
				_List_fromArray(
					[currentInstruction])));
	});
var $author$project$OpCode$OpCode = F2(
	function (hexCode, data) {
		return {cX: data, eu: hexCode};
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$OpCode$OneByte = function (a) {
	return {$: 0, a: a};
};
var $author$project$OpCode$OpCodeData = F3(
	function (name, cycles, opCodeSpec) {
		return {cW: cycles, dk: name, dq: opCodeSpec};
	});
var $author$project$OpCode$ThreeBytes = function (a) {
	return {$: 2, a: a};
};
var $author$project$OpCode$TwoBytes = function (a) {
	return {$: 1, a: a};
};
var $author$project$EmulatorState$SetFlag = function (a) {
	return {$: 9, a: a};
};
var $author$project$EmulatorState$SetFlagAC = function (a) {
	return {$: 4, a: a};
};
var $author$project$LogicFlags$setFlagAC = function (newValue) {
	return $author$project$EmulatorState$SetCpu(
		$author$project$EmulatorState$SetFlag(
			$author$project$EmulatorState$SetFlagAC(newValue)));
};
var $author$project$LogicFlags$check_flag_AC = F2(
	function (valueOne, valueTwo) {
		var lowerR = 15 & valueTwo;
		var lowerA = 15 & valueOne;
		return ((16 & (lowerA + lowerR)) === 16) ? $author$project$LogicFlags$setFlagAC(true) : $author$project$LogicFlags$setFlagAC(false);
	});
var $author$project$EmulatorState$SetFlagCY = function (a) {
	return {$: 3, a: a};
};
var $author$project$LogicFlags$setFlagCY = function (newValue) {
	return $author$project$EmulatorState$SetCpu(
		$author$project$EmulatorState$SetFlag(
			$author$project$EmulatorState$SetFlagCY(newValue)));
};
var $author$project$LogicFlags$check_flag_CY = function (value) {
	return $author$project$LogicFlags$setFlagCY(value > 255);
};
var $elm$core$Basics$modBy = _Basics_modBy;
var $author$project$EmulatorState$SetFlagP = function (a) {
	return {$: 2, a: a};
};
var $author$project$LogicFlags$setFlagP = function (newValue) {
	return $author$project$EmulatorState$SetCpu(
		$author$project$EmulatorState$SetFlag(
			$author$project$EmulatorState$SetFlagP(newValue)));
};
var $author$project$EmulatorState$SetFlagS = function (a) {
	return {$: 1, a: a};
};
var $author$project$LogicFlags$setFlagS = function (newValue) {
	return $author$project$EmulatorState$SetCpu(
		$author$project$EmulatorState$SetFlag(
			$author$project$EmulatorState$SetFlagS(newValue)));
};
var $author$project$EmulatorState$SetFlagZ = function (a) {
	return {$: 0, a: a};
};
var $author$project$LogicFlags$setFlagZ = function (newValue) {
	return $author$project$EmulatorState$SetCpu(
		$author$project$EmulatorState$SetFlag(
			$author$project$EmulatorState$SetFlagZ(newValue)));
};
var $author$project$LogicFlags$flags_ZSP = function (value) {
	return _List_fromArray(
		[
			$author$project$LogicFlags$setFlagZ(!value),
			$author$project$LogicFlags$setFlagS((128 & value) === 128),
			$author$project$LogicFlags$setFlagP(
			!A2($elm$core$Basics$modBy, 2, value))
		]);
};
var $author$project$MachineInstructions$getA = function (machineState) {
	return machineState.K.d0;
};
var $author$project$EmulatorState$SetRegisterA = function (a) {
	return {$: 0, a: a};
};
var $author$project$MachineInstructions$setRegisterA = function (newValue) {
	return $author$project$EmulatorState$SetCpu(
		$author$project$EmulatorState$SetRegisterA(newValue));
};
var $author$project$MachineInstructions$add_r_ = F2(
	function (fromRegister, machineState) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
		var newA = $author$project$MachineInstructions$getA(machineState) + fromRegister(machineState);
		return $author$project$EmulatorState$Events(
			$elm$core$List$concat(
				_List_fromArray(
					[
						_List_fromArray(
						[
							$author$project$MachineInstructions$setRegisterA(
							A2($elm$core$Basics$modBy, 256, newA)),
							$author$project$MachineInstructions$setPC(newPc),
							$author$project$LogicFlags$check_flag_CY(newA),
							A2(
							$author$project$LogicFlags$check_flag_AC,
							$author$project$MachineInstructions$getA(machineState),
							fromRegister(machineState))
						]),
						$author$project$LogicFlags$flags_ZSP(newA)
					])));
	});
var $author$project$MachineInstructions$getB = function (machineState) {
	return machineState.K.d4;
};
var $author$project$MachineInstructions$add_b = function (machineState) {
	return A2($author$project$MachineInstructions$add_r_, $author$project$MachineInstructions$getB, machineState);
};
var $author$project$ConditionCodesFlags$cyFlag = function (result) {
	return (result > 255) ? true : false;
};
var $author$project$ConditionCodesFlags$pFlag = function (result) {
	return (!A2($elm$core$Basics$modBy, 2, result)) ? true : false;
};
var $author$project$MachineInstructions$setFlagCY = function (newValue) {
	return $author$project$EmulatorState$SetCpu(
		$author$project$EmulatorState$SetFlag(
			$author$project$EmulatorState$SetFlagCY(newValue)));
};
var $author$project$MachineInstructions$setFlagP = function (newValue) {
	return $author$project$EmulatorState$SetCpu(
		$author$project$EmulatorState$SetFlag(
			$author$project$EmulatorState$SetFlagP(newValue)));
};
var $author$project$MachineInstructions$setFlagS = function (newValue) {
	return $author$project$EmulatorState$SetCpu(
		$author$project$EmulatorState$SetFlag(
			$author$project$EmulatorState$SetFlagS(newValue)));
};
var $author$project$MachineInstructions$setFlagZ = function (newValue) {
	return $author$project$EmulatorState$SetCpu(
		$author$project$EmulatorState$SetFlag(
			$author$project$EmulatorState$SetFlagZ(newValue)));
};
var $author$project$MachineInstructions$adi_d8 = F2(
	function (firstArg, machineState) {
		var x = $author$project$MachineInstructions$getA(machineState) + firstArg;
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 2;
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					$author$project$MachineInstructions$setRegisterA(x),
					$author$project$MachineInstructions$setFlagZ(!(x & 255)),
					$author$project$MachineInstructions$setFlagS(128 === (x & 128)),
					$author$project$MachineInstructions$setFlagP(
					$author$project$ConditionCodesFlags$pFlag(x & 255)),
					$author$project$MachineInstructions$setFlagCY(
					$author$project$ConditionCodesFlags$cyFlag(x)),
					$author$project$MachineInstructions$setPC(newPc)
				]));
	});
var $author$project$MachineInstructions$ana_ = F2(
	function (registerValue, machineState) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
		var newA = $author$project$MachineInstructions$getA(machineState) & registerValue;
		return $author$project$EmulatorState$Events(
			$elm$core$List$concat(
				_List_fromArray(
					[
						_List_fromArray(
						[
							$author$project$MachineInstructions$setRegisterA(newA),
							$author$project$MachineInstructions$setPC(newPc),
							$author$project$MachineInstructions$setFlagCY(false)
						]),
						$author$project$LogicFlags$flags_ZSP(newA)
					])));
	});
var $author$project$MachineInstructions$ana_a = function (machineState) {
	return A2(
		$author$project$MachineInstructions$ana_,
		$author$project$MachineInstructions$getA(machineState),
		machineState);
};
var $author$project$MachineInstructions$ana_b = function (machineState) {
	return A2(
		$author$project$MachineInstructions$ana_,
		$author$project$MachineInstructions$getB(machineState),
		machineState);
};
var $author$project$ConditionCodesFlags$sFlag = function (result) {
	return ((128 & result) === 128) ? true : false;
};
var $author$project$MachineInstructions$setFlagAC = function (newValue) {
	return $author$project$EmulatorState$SetCpu(
		$author$project$EmulatorState$SetFlag(
			$author$project$EmulatorState$SetFlagAC(newValue)));
};
var $author$project$ConditionCodesFlags$zFlag = function (result) {
	return (!result) ? true : false;
};
var $author$project$MachineInstructions$logic_flags_a = function (newA) {
	return _List_fromArray(
		[
			$author$project$MachineInstructions$setFlagCY(false),
			$author$project$MachineInstructions$setFlagAC(false),
			$author$project$MachineInstructions$setFlagZ(
			$author$project$ConditionCodesFlags$zFlag(newA)),
			$author$project$MachineInstructions$setFlagS(
			$author$project$ConditionCodesFlags$sFlag(newA)),
			$author$project$MachineInstructions$setFlagP(
			$author$project$ConditionCodesFlags$pFlag(newA))
		]);
};
var $author$project$MachineInstructions$ani = F2(
	function (firstArg, machineState) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 2;
		var newA = $author$project$MachineInstructions$getA(machineState) & firstArg;
		return $author$project$EmulatorState$Events(
			$elm$core$List$concat(
				_List_fromArray(
					[
						_List_fromArray(
						[
							$author$project$MachineInstructions$setRegisterA(newA),
							$author$project$MachineInstructions$setPC(newPc)
						]),
						$author$project$MachineInstructions$logic_flags_a(newA)
					])));
	});
var $author$project$BitOperations$combineBytes = F2(
	function (high, low) {
		return (high << 8) + low;
	});
var $author$project$BitOperations$getAddressLE = F2(
	function (low, high) {
		return A2($author$project$BitOperations$combineBytes, high, low);
	});
var $author$project$MachineInstructions$call = F3(
	function (firstArg, secondArg, machineState) {
		var returnAddress = $author$project$MachineInstructions$getPC(machineState) + 3;
		var newSp = $author$project$MachineInstructions$getSP(machineState) - 2;
		var newPc = A2($author$project$BitOperations$getAddressLE, firstArg, secondArg);
		var memoryForL = $author$project$MachineInstructions$getSP(machineState) - 2;
		var memoryForH = $author$project$MachineInstructions$getSP(machineState) - 1;
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					A2($author$project$MachineInstructions$setMemory, memoryForH, (returnAddress >> 8) & 255),
					A2($author$project$MachineInstructions$setMemory, memoryForL, returnAddress & 255),
					$author$project$MachineInstructions$setSP(newSp),
					$author$project$MachineInstructions$setPC(newPc)
				]));
	});
var $author$project$MachineInstructions$getConditionCodes = function (machineState) {
	return machineState.K.cT;
};
var $author$project$MachineInstructions$getFlagCY = function (machineState) {
	var conditionCodes = $author$project$MachineInstructions$getConditionCodes(machineState);
	return conditionCodes.ed;
};
var $author$project$MachineInstructions$cnc = F3(
	function (firstArg, secondArg, machineState) {
		if ($author$project$MachineInstructions$getFlagCY(machineState)) {
			var newPc = $author$project$MachineInstructions$getPC(machineState) + 3;
			return $author$project$EmulatorState$Events(
				_List_fromArray(
					[
						$author$project$MachineInstructions$setPC(newPc)
					]));
		} else {
			return A3($author$project$MachineInstructions$call, firstArg, secondArg, machineState);
		}
	});
var $author$project$MachineInstructions$getFlagZ = function (machineState) {
	var conditionCodes = $author$project$MachineInstructions$getConditionCodes(machineState);
	return conditionCodes.e9;
};
var $author$project$MachineInstructions$cnz = F3(
	function (firstArg, secondArg, machineState) {
		if ($author$project$MachineInstructions$getFlagZ(machineState)) {
			var newPc = $author$project$MachineInstructions$getPC(machineState) + 3;
			return $author$project$EmulatorState$Events(
				_List_fromArray(
					[
						$author$project$MachineInstructions$setPC(newPc)
					]));
		} else {
			return A3($author$project$MachineInstructions$call, firstArg, secondArg, machineState);
		}
	});
var $author$project$MachineInstructions$cpi = F2(
	function (firstArg, machineState) {
		var x = $author$project$MachineInstructions$getA(machineState) - firstArg;
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 2;
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					$author$project$MachineInstructions$setFlagZ(
					$author$project$ConditionCodesFlags$zFlag(x)),
					$author$project$MachineInstructions$setFlagS(
					$author$project$ConditionCodesFlags$sFlag(x)),
					$author$project$MachineInstructions$setFlagP(
					$author$project$ConditionCodesFlags$pFlag(x)),
					$author$project$MachineInstructions$setFlagCY(
					_Utils_cmp(
						$author$project$MachineInstructions$getA(machineState),
						firstArg) < 0),
					$author$project$MachineInstructions$setPC(newPc)
				]));
	});
var $author$project$MachineInstructions$cz = F3(
	function (firstArg, secondArg, machineState) {
		if ($author$project$MachineInstructions$getFlagZ(machineState)) {
			return A3($author$project$MachineInstructions$call, firstArg, secondArg, machineState);
		} else {
			var newPc = $author$project$MachineInstructions$getPC(machineState) + 3;
			return $author$project$EmulatorState$Events(
				_List_fromArray(
					[
						$author$project$MachineInstructions$setPC(newPc)
					]));
		}
	});
var $author$project$MachineInstructions$daa = function (machineState) {
	var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
	var currentA = $author$project$MachineInstructions$getA(machineState);
	var lower = 15 & currentA;
	if ((lower > 9) || machineState.K.cT.d1) {
		var newA = currentA + 6;
		var newLower = 15 & newA;
		var newUpper = 240 & newA;
		if ((newUpper > 9) || machineState.K.cT.ed) {
			var newnewA = ((newUpper + 6) << 4) | newLower;
			return $author$project$EmulatorState$Events(
				_List_fromArray(
					[
						$author$project$MachineInstructions$setRegisterA(
						A2($elm$core$Basics$modBy, 256, newnewA)),
						$author$project$MachineInstructions$setPC(newPc),
						$author$project$MachineInstructions$setFlagCY(newnewA > 255),
						$author$project$MachineInstructions$setFlagAC((16 & (lower & 6)) === 16),
						$author$project$MachineInstructions$setFlagZ(
						$author$project$ConditionCodesFlags$zFlag(newnewA)),
						$author$project$MachineInstructions$setFlagS(
						$author$project$ConditionCodesFlags$sFlag(newnewA)),
						$author$project$MachineInstructions$setFlagP(
						$author$project$ConditionCodesFlags$pFlag(newnewA))
					]));
		} else {
			return $author$project$EmulatorState$Events(
				_List_fromArray(
					[
						$author$project$MachineInstructions$setRegisterA(
						A2($elm$core$Basics$modBy, 256, newA)),
						$author$project$MachineInstructions$setPC(newPc),
						$author$project$MachineInstructions$setFlagCY(newA > 255),
						$author$project$MachineInstructions$setFlagAC((16 & (lower & 6)) === 16),
						$author$project$MachineInstructions$setFlagZ(
						$author$project$ConditionCodesFlags$zFlag(newA)),
						$author$project$MachineInstructions$setFlagS(
						$author$project$ConditionCodesFlags$sFlag(newA)),
						$author$project$MachineInstructions$setFlagP(
						$author$project$ConditionCodesFlags$pFlag(newA))
					]));
		}
	} else {
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					$author$project$MachineInstructions$setPC(newPc)
				]));
	}
};
var $author$project$MachineInstructions$getH = function (machineState) {
	return machineState.K.es;
};
var $author$project$MachineInstructions$getL = function (machineState) {
	return machineState.K.ez;
};
var $author$project$EmulatorState$SetRegisterH = function (a) {
	return {$: 5, a: a};
};
var $author$project$MachineInstructions$setRegisterH = function (newValue) {
	return $author$project$EmulatorState$SetCpu(
		$author$project$EmulatorState$SetRegisterH(newValue));
};
var $author$project$EmulatorState$SetRegisterL = function (a) {
	return {$: 6, a: a};
};
var $author$project$MachineInstructions$setRegisterL = function (newValue) {
	return $author$project$EmulatorState$SetCpu(
		$author$project$EmulatorState$SetRegisterL(newValue));
};
var $author$project$MachineInstructions$dad_ = F3(
	function (firstRegister, secondRegister, machineState) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
		var hl = ($author$project$MachineInstructions$getH(machineState) << 8) | $author$project$MachineInstructions$getL(machineState);
		var combinedRegister = (firstRegister << 8) | secondRegister;
		var newL = (hl + combinedRegister) & 255;
		var newH = ((hl + combinedRegister) & 65280) >> 8;
		var newCY = ((hl + combinedRegister) & 4294901760) > 0;
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					$author$project$MachineInstructions$setRegisterH(newH),
					$author$project$MachineInstructions$setRegisterL(newL),
					$author$project$MachineInstructions$setFlagCY(newCY),
					$author$project$MachineInstructions$setPC(newPc)
				]));
	});
var $author$project$MachineInstructions$getC = function (machineState) {
	return machineState.K.d7;
};
var $author$project$MachineInstructions$dad_b = function (machineState) {
	return A3(
		$author$project$MachineInstructions$dad_,
		$author$project$MachineInstructions$getB(machineState),
		$author$project$MachineInstructions$getC(machineState),
		machineState);
};
var $author$project$MachineInstructions$getD = function (machineState) {
	return machineState.K.ee;
};
var $author$project$MachineInstructions$getE = function (machineState) {
	return machineState.K.ej;
};
var $author$project$MachineInstructions$dad_d = function (machineState) {
	return A3(
		$author$project$MachineInstructions$dad_,
		$author$project$MachineInstructions$getD(machineState),
		$author$project$MachineInstructions$getE(machineState),
		machineState);
};
var $author$project$MachineInstructions$dad_h = function (machineState) {
	return A3(
		$author$project$MachineInstructions$dad_,
		$author$project$MachineInstructions$getH(machineState),
		$author$project$MachineInstructions$getL(machineState),
		machineState);
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $author$project$MachineInstructions$dcr_ = F3(
	function (diffEvent, registerValue, machineState) {
		var newRegisterValue = registerValue - 1;
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
		return (newRegisterValue < 0) ? $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					diffEvent(
					256 - $elm$core$Basics$abs(newRegisterValue)),
					$author$project$MachineInstructions$setFlagZ(
					$author$project$ConditionCodesFlags$zFlag(newRegisterValue)),
					$author$project$MachineInstructions$setFlagS(
					$author$project$ConditionCodesFlags$sFlag(newRegisterValue)),
					$author$project$MachineInstructions$setFlagP(
					$author$project$ConditionCodesFlags$pFlag(newRegisterValue)),
					$author$project$MachineInstructions$setPC(newPc)
				])) : $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					diffEvent(newRegisterValue),
					$author$project$MachineInstructions$setFlagZ(
					$author$project$ConditionCodesFlags$zFlag(newRegisterValue)),
					$author$project$MachineInstructions$setFlagS(
					$author$project$ConditionCodesFlags$sFlag(newRegisterValue)),
					$author$project$MachineInstructions$setFlagP(
					$author$project$ConditionCodesFlags$pFlag(newRegisterValue)),
					$author$project$MachineInstructions$setPC(newPc)
				]));
	});
var $author$project$MachineInstructions$dcr_a = function (machineState) {
	return A3(
		$author$project$MachineInstructions$dcr_,
		function (value) {
			return $author$project$MachineInstructions$setRegisterA(value);
		},
		$author$project$MachineInstructions$getA(machineState),
		machineState);
};
var $author$project$EmulatorState$SetRegisterB = function (a) {
	return {$: 1, a: a};
};
var $author$project$MachineInstructions$setRegisterB = function (newValue) {
	return $author$project$EmulatorState$SetCpu(
		$author$project$EmulatorState$SetRegisterB(newValue));
};
var $author$project$MachineInstructions$dcr_b = function (machineState) {
	return A3(
		$author$project$MachineInstructions$dcr_,
		function (value) {
			return $author$project$MachineInstructions$setRegisterB(value);
		},
		$author$project$MachineInstructions$getB(machineState),
		machineState);
};
var $author$project$EmulatorState$SetRegisterC = function (a) {
	return {$: 2, a: a};
};
var $author$project$MachineInstructions$setRegisterC = function (newValue) {
	return $author$project$EmulatorState$SetCpu(
		$author$project$EmulatorState$SetRegisterC(newValue));
};
var $author$project$MachineInstructions$dcr_c = function (machineState) {
	return A3(
		$author$project$MachineInstructions$dcr_,
		function (value) {
			return $author$project$MachineInstructions$setRegisterC(value);
		},
		$author$project$MachineInstructions$getC(machineState),
		machineState);
};
var $author$project$EmulatorState$Failed = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Memory$Invalid = function (a) {
	return {$: 1, a: a};
};
var $author$project$Memory$Valid = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $elm$core$String$fromList = _String_fromList;
var $author$project$Hex$unsafeToDigit = function (num) {
	unsafeToDigit:
	while (true) {
		switch (num) {
			case 0:
				return '0';
			case 1:
				return '1';
			case 2:
				return '2';
			case 3:
				return '3';
			case 4:
				return '4';
			case 5:
				return '5';
			case 6:
				return '6';
			case 7:
				return '7';
			case 8:
				return '8';
			case 9:
				return '9';
			case 10:
				return 'a';
			case 11:
				return 'b';
			case 12:
				return 'c';
			case 13:
				return 'd';
			case 14:
				return 'e';
			case 15:
				return 'f';
			default:
				var $temp$num = num;
				num = $temp$num;
				continue unsafeToDigit;
		}
	}
};
var $author$project$Hex$unsafePositiveToDigits = F2(
	function (digits, num) {
		unsafePositiveToDigits:
		while (true) {
			if (num < 16) {
				return A2(
					$elm$core$List$cons,
					$author$project$Hex$unsafeToDigit(num),
					digits);
			} else {
				var $temp$digits = A2(
					$elm$core$List$cons,
					$author$project$Hex$unsafeToDigit(
						A2($elm$core$Basics$modBy, 16, num)),
					digits),
					$temp$num = (num / 16) | 0;
				digits = $temp$digits;
				num = $temp$num;
				continue unsafePositiveToDigits;
			}
		}
	});
var $author$project$Hex$toString = function (num) {
	return $elm$core$String$fromList(
		(num < 0) ? A2(
			$elm$core$List$cons,
			'-',
			A2($author$project$Hex$unsafePositiveToDigits, _List_Nil, -num)) : A2($author$project$Hex$unsafePositiveToDigits, _List_Nil, num));
};
var $author$project$Hex$toPaddedString = F2(
	function (padding, num) {
		var hexString = $author$project$Hex$toString(num);
		return A3($elm$core$String$padLeft, padding, '0', hexString);
	});
var $author$project$Hex$pad4 = $author$project$Hex$toPaddedString(4);
var $author$project$Hex$prefixX = function (string) {
	return '0x' + string;
};
var $author$project$Hex$padX4 = function (x) {
	return $author$project$Hex$prefixX(
		$author$project$Hex$pad4(x));
};
var $author$project$Memory$readMemory = F2(
	function (address, memory) {
		var readValue = A2($elm$core$Array$get, address, memory);
		if (!readValue.$) {
			var value = readValue.a;
			return $author$project$Memory$Valid(value);
		} else {
			return $author$project$Memory$Invalid(
				'Illegal memory access occurred at ' + $author$project$Hex$padX4(address));
		}
	});
var $author$project$MachineInstructions$dcr_m = function (machineState) {
	var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
	var memoryAccessResult = A2(
		$author$project$Memory$readMemory,
		A2($author$project$BitOperations$getAddressLE, machineState.K.ez, machineState.K.es),
		machineState.bk);
	if (!memoryAccessResult.$) {
		var memoryValue = memoryAccessResult.a;
		var newMemoryValue = memoryValue - 1;
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					A2(
					$author$project$MachineInstructions$setMemory,
					A2($author$project$BitOperations$getAddressLE, machineState.K.ez, machineState.K.es),
					newMemoryValue),
					$author$project$MachineInstructions$setFlagZ(
					$author$project$ConditionCodesFlags$zFlag(newMemoryValue)),
					$author$project$MachineInstructions$setFlagS(
					$author$project$ConditionCodesFlags$sFlag(newMemoryValue)),
					$author$project$MachineInstructions$setFlagP(
					$author$project$ConditionCodesFlags$pFlag(newMemoryValue)),
					$author$project$MachineInstructions$setPC(newPc)
				]));
	} else {
		var message = memoryAccessResult.a;
		return A2(
			$author$project$EmulatorState$Failed,
			$elm$core$Maybe$Just(machineState),
			message);
	}
};
var $author$project$MachineInstructions$dcx_rp_ = F5(
	function (registerHigh, highRegisterEvent, registerLow, lowRegisterEvent, machineState) {
		var newPC = $author$project$MachineInstructions$getPC(machineState) + 1;
		var currentRegisterPairValue = A2(
			$author$project$BitOperations$getAddressLE,
			registerLow(machineState),
			registerHigh(machineState));
		var newValue = currentRegisterPairValue - 1;
		var newHigh = (65280 & newValue) >> 8;
		var newLow = 255 & newValue;
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					$author$project$EmulatorState$SetCpu(
					highRegisterEvent(newHigh)),
					$author$project$EmulatorState$SetCpu(
					lowRegisterEvent(newLow)),
					$author$project$MachineInstructions$setPC(newPC)
				]));
	});
var $author$project$MachineInstructions$dcx_b = function (machineState) {
	return A5(
		$author$project$MachineInstructions$dcx_rp_,
		$author$project$MachineInstructions$getB,
		function (data) {
			return $author$project$EmulatorState$SetRegisterB(data);
		},
		$author$project$MachineInstructions$getC,
		function (data) {
			return $author$project$EmulatorState$SetRegisterC(data);
		},
		machineState);
};
var $author$project$MachineInstructions$dcx_h = function (machineState) {
	return A5(
		$author$project$MachineInstructions$dcx_rp_,
		$author$project$MachineInstructions$getH,
		function (data) {
			return $author$project$EmulatorState$SetRegisterH(data);
		},
		$author$project$MachineInstructions$getL,
		function (data) {
			return $author$project$EmulatorState$SetRegisterL(data);
		},
		machineState);
};
var $author$project$EmulatorState$SetIntEnable = function (a) {
	return {$: 10, a: a};
};
var $author$project$MachineInstructions$setIntEnable = function (newValue) {
	return $author$project$EmulatorState$SetCpu(
		$author$project$EmulatorState$SetIntEnable(newValue));
};
var $author$project$MachineInstructions$ei = function (machineState) {
	var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
	return $author$project$EmulatorState$Events(
		_List_fromArray(
			[
				$author$project$MachineInstructions$setIntEnable(true),
				$author$project$MachineInstructions$setPC(newPc)
			]));
};
var $author$project$MachineInstructions$inr_r_ = F3(
	function (setRegisterEvent, fromRegister, machineState) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
		var currentRegisterValue = fromRegister(machineState);
		var newRegisterValue = currentRegisterValue + 1;
		return $author$project$EmulatorState$Events(
			$elm$core$List$concat(
				_List_fromArray(
					[
						_List_fromArray(
						[
							$author$project$EmulatorState$SetCpu(
							setRegisterEvent(
								A2($elm$core$Basics$modBy, 256, newRegisterValue))),
							$author$project$MachineInstructions$setPC(newPc),
							A2($author$project$LogicFlags$check_flag_AC, currentRegisterValue, 1)
						]),
						$author$project$LogicFlags$flags_ZSP(newRegisterValue)
					])));
	});
var $author$project$MachineInstructions$inr_a = function (machineState) {
	return A3(
		$author$project$MachineInstructions$inr_r_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterA(data);
		},
		$author$project$MachineInstructions$getA,
		machineState);
};
var $author$project$MachineInstructions$inr_b = function (machineState) {
	return A3(
		$author$project$MachineInstructions$inr_r_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterB(data);
		},
		$author$project$MachineInstructions$getB,
		machineState);
};
var $author$project$MachineInstructions$inx_ = F5(
	function (firstArg, firstDiffEvent, secondArg, secondDiffEvent, machineState) {
		var newSecond = A2($elm$core$Basics$modBy, 256, secondArg + 1);
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
		return (!newSecond) ? $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					firstDiffEvent(
					A2($elm$core$Basics$modBy, 256, firstArg + 1)),
					secondDiffEvent(newSecond),
					$author$project$MachineInstructions$setPC(newPc)
				])) : $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					secondDiffEvent(newSecond),
					$author$project$MachineInstructions$setPC(newPc)
				]));
	});
var $author$project$MachineInstructions$inx_b = function (machineState) {
	return A5(
		$author$project$MachineInstructions$inx_,
		$author$project$MachineInstructions$getB(machineState),
		function (data) {
			return $author$project$MachineInstructions$setRegisterB(data);
		},
		$author$project$MachineInstructions$getC(machineState),
		function (data) {
			return $author$project$MachineInstructions$setRegisterC(data);
		},
		machineState);
};
var $author$project$EmulatorState$SetRegisterD = function (a) {
	return {$: 3, a: a};
};
var $author$project$MachineInstructions$setRegisterD = function (newValue) {
	return $author$project$EmulatorState$SetCpu(
		$author$project$EmulatorState$SetRegisterD(newValue));
};
var $author$project$EmulatorState$SetRegisterE = function (a) {
	return {$: 4, a: a};
};
var $author$project$MachineInstructions$setRegisterE = function (newValue) {
	return $author$project$EmulatorState$SetCpu(
		$author$project$EmulatorState$SetRegisterE(newValue));
};
var $author$project$MachineInstructions$inx_d = function (machineState) {
	return A5(
		$author$project$MachineInstructions$inx_,
		$author$project$MachineInstructions$getD(machineState),
		function (data) {
			return $author$project$MachineInstructions$setRegisterD(data);
		},
		$author$project$MachineInstructions$getE(machineState),
		function (data) {
			return $author$project$MachineInstructions$setRegisterE(data);
		},
		machineState);
};
var $author$project$MachineInstructions$inx_h = function (machineState) {
	return A5(
		$author$project$MachineInstructions$inx_,
		$author$project$MachineInstructions$getH(machineState),
		function (data) {
			return $author$project$MachineInstructions$setRegisterH(data);
		},
		$author$project$MachineInstructions$getL(machineState),
		function (data) {
			return $author$project$MachineInstructions$setRegisterL(data);
		},
		machineState);
};
var $author$project$IO$io_in = F2(
	function (address, machineState) {
		var temp = (8 << machineState.dJ.e6) | machineState.dJ.eB;
		var newPc = machineState.K.ay + 2;
		switch (address) {
			case 1:
				return $author$project$EmulatorState$Events(
					_List_fromArray(
						[
							$author$project$EmulatorState$SetCpu(
							$author$project$EmulatorState$SetRegisterA(machineState.dw.$7)),
							$author$project$EmulatorState$SetCpu(
							$author$project$EmulatorState$SetPC(newPc))
						]));
			case 2:
				return $author$project$EmulatorState$Events(
					_List_fromArray(
						[
							$author$project$EmulatorState$SetCpu(
							$author$project$EmulatorState$SetRegisterA(machineState.dw.e4)),
							$author$project$EmulatorState$SetCpu(
							$author$project$EmulatorState$SetPC(newPc))
						]));
			case 3:
				var v = (machineState.dJ.e6 << 8) | machineState.dJ.eB;
				return $author$project$EmulatorState$Events(
					_List_fromArray(
						[
							$author$project$EmulatorState$SetCpu(
							$author$project$EmulatorState$SetRegisterA(
								(temp >> A2($elm$core$Basics$modBy, 256, 8 - machineState.dJ.eP)) & 255)),
							$author$project$EmulatorState$SetCpu(
							$author$project$EmulatorState$SetPC(newPc))
						]));
			default:
				return $author$project$EmulatorState$Events(
					_List_fromArray(
						[
							$author$project$EmulatorState$SetCpu(
							$author$project$EmulatorState$SetPC(newPc))
						]));
		}
	});
var $author$project$EmulatorState$SetLower = function (a) {
	return {$: 0, a: a};
};
var $author$project$EmulatorState$SetOffset = function (a) {
	return {$: 2, a: a};
};
var $author$project$EmulatorState$SetShiftRegister = function (a) {
	return {$: 2, a: a};
};
var $author$project$EmulatorState$SetUpper = function (a) {
	return {$: 1, a: a};
};
var $author$project$IO$io_out = F2(
	function (address, machineState) {
		var newPc = machineState.K.ay + 2;
		var data = machineState.K.d0;
		switch (address) {
			case 2:
				return $author$project$EmulatorState$Events(
					_List_fromArray(
						[
							$author$project$EmulatorState$SetShiftRegister(
							$author$project$EmulatorState$SetOffset(data & 7)),
							$author$project$EmulatorState$SetCpu(
							$author$project$EmulatorState$SetPC(newPc))
						]));
			case 4:
				var newLower = machineState.dJ.e6;
				return $author$project$EmulatorState$Events(
					_List_fromArray(
						[
							$author$project$EmulatorState$SetShiftRegister(
							$author$project$EmulatorState$SetLower(newLower)),
							$author$project$EmulatorState$SetShiftRegister(
							$author$project$EmulatorState$SetUpper(data)),
							$author$project$EmulatorState$SetCpu(
							$author$project$EmulatorState$SetPC(newPc))
						]));
			default:
				return $author$project$EmulatorState$Events(
					_List_fromArray(
						[
							$author$project$EmulatorState$SetCpu(
							$author$project$EmulatorState$SetPC(newPc))
						]));
		}
	});
var $author$project$MachineInstructions$j_ = F2(
	function (firstArg, secondArg) {
		var newPc = A2($author$project$BitOperations$getAddressLE, firstArg, secondArg);
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					$author$project$MachineInstructions$setPC(newPc)
				]));
	});
var $author$project$MachineInstructions$jc = F3(
	function (firstArg, secondArg, machineState) {
		if ($author$project$MachineInstructions$getFlagCY(machineState)) {
			return A2($author$project$MachineInstructions$j_, firstArg, secondArg);
		} else {
			var newPc = $author$project$MachineInstructions$getPC(machineState) + 3;
			return $author$project$EmulatorState$Events(
				_List_fromArray(
					[
						$author$project$MachineInstructions$setPC(newPc)
					]));
		}
	});
var $author$project$MachineInstructions$jmp = F3(
	function (firstArg, secondArg, _v0) {
		return A2($author$project$MachineInstructions$j_, firstArg, secondArg);
	});
var $author$project$MachineInstructions$jnc = F3(
	function (firstArg, secondArg, machineState) {
		if ($author$project$MachineInstructions$getFlagCY(machineState)) {
			var newPc = $author$project$MachineInstructions$getPC(machineState) + 3;
			return $author$project$EmulatorState$Events(
				_List_fromArray(
					[
						$author$project$MachineInstructions$setPC(newPc)
					]));
		} else {
			return A2($author$project$MachineInstructions$j_, firstArg, secondArg);
		}
	});
var $author$project$MachineInstructions$jnz = F3(
	function (firstArg, secondArg, machineState) {
		if ($author$project$MachineInstructions$getFlagZ(machineState)) {
			var nwePc = $author$project$MachineInstructions$getPC(machineState) + 3;
			return $author$project$EmulatorState$Events(
				_List_fromArray(
					[
						$author$project$MachineInstructions$setPC(nwePc)
					]));
		} else {
			return A2($author$project$MachineInstructions$j_, firstArg, secondArg);
		}
	});
var $author$project$MachineInstructions$jz = F3(
	function (firstArg, secondArg, machineState) {
		if ($author$project$MachineInstructions$getFlagZ(machineState)) {
			return A2($author$project$MachineInstructions$j_, firstArg, secondArg);
		} else {
			var newPc = $author$project$MachineInstructions$getPC(machineState) + 3;
			return $author$project$EmulatorState$Events(
				_List_fromArray(
					[
						$author$project$MachineInstructions$setPC(newPc)
					]));
		}
	});
var $author$project$MachineInstructions$getMemory = function (machineState) {
	return machineState.bk;
};
var $author$project$MachineInstructions$lda = F3(
	function (firstArg, secondArg, machineState) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 3;
		var memoryAddress = A2($author$project$BitOperations$getAddressLE, firstArg, secondArg);
		var memoryAccessResult = A2(
			$author$project$Memory$readMemory,
			memoryAddress,
			$author$project$MachineInstructions$getMemory(machineState));
		if (!memoryAccessResult.$) {
			var byteValue = memoryAccessResult.a;
			return $author$project$EmulatorState$Events(
				_List_fromArray(
					[
						$author$project$MachineInstructions$setRegisterA(byteValue),
						$author$project$MachineInstructions$setPC(newPc)
					]));
		} else {
			var message = memoryAccessResult.a;
			return A2(
				$author$project$EmulatorState$Failed,
				$elm$core$Maybe$Just(machineState),
				message);
		}
	});
var $author$project$MachineInstructions$ldax_b = function (machineState) {
	var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
	var memoryAddress = A2(
		$author$project$BitOperations$getAddressLE,
		$author$project$MachineInstructions$getC(machineState),
		$author$project$MachineInstructions$getB(machineState));
	var memoryAccessResult = A2(
		$author$project$Memory$readMemory,
		memoryAddress,
		$author$project$MachineInstructions$getMemory(machineState));
	if (!memoryAccessResult.$) {
		var byteValue = memoryAccessResult.a;
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					$author$project$MachineInstructions$setRegisterA(byteValue),
					$author$project$MachineInstructions$setPC(newPc)
				]));
	} else {
		var message = memoryAccessResult.a;
		return A2(
			$author$project$EmulatorState$Failed,
			$elm$core$Maybe$Just(machineState),
			message);
	}
};
var $author$project$MachineInstructions$ldax_d = function (machineState) {
	var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
	var memoryAddress = ($author$project$MachineInstructions$getD(machineState) << 8) | $author$project$MachineInstructions$getE(machineState);
	var memoryAccessResult = A2(
		$author$project$Memory$readMemory,
		memoryAddress,
		$author$project$MachineInstructions$getMemory(machineState));
	if (!memoryAccessResult.$) {
		var byteValue = memoryAccessResult.a;
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					$author$project$MachineInstructions$setRegisterA(byteValue),
					$author$project$MachineInstructions$setPC(newPc)
				]));
	} else {
		var message = memoryAccessResult.a;
		return A2(
			$author$project$EmulatorState$Failed,
			$elm$core$Maybe$Just(machineState),
			message);
	}
};
var $author$project$MachineInstructions$lhld = F3(
	function (firstArg, secondArg, machineState) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 3;
		var addressForL = A2($author$project$BitOperations$getAddressLE, firstArg, secondArg);
		var memoryAccessResultL = A2(
			$author$project$Memory$readMemory,
			addressForL,
			$author$project$MachineInstructions$getMemory(machineState));
		var addressForH = A2($author$project$BitOperations$getAddressLE, firstArg, secondArg) + 1;
		var memoryAccessResultH = A2(
			$author$project$Memory$readMemory,
			addressForH,
			$author$project$MachineInstructions$getMemory(machineState));
		var _v0 = _Utils_Tuple2(memoryAccessResultL, memoryAccessResultH);
		if (!_v0.a.$) {
			if (!_v0.b.$) {
				var byteValueL = _v0.a.a;
				var byteValueH = _v0.b.a;
				return $author$project$EmulatorState$Events(
					_List_fromArray(
						[
							$author$project$MachineInstructions$setRegisterL(byteValueL),
							$author$project$MachineInstructions$setRegisterH(byteValueH),
							$author$project$MachineInstructions$setPC(newPc)
						]));
			} else {
				var message = _v0.b.a;
				return A2(
					$author$project$EmulatorState$Failed,
					$elm$core$Maybe$Just(machineState),
					message);
			}
		} else {
			var message = _v0.a.a;
			return A2(
				$author$project$EmulatorState$Failed,
				$elm$core$Maybe$Just(machineState),
				message);
		}
	});
var $author$project$MachineInstructions$lxi_d16_ = F3(
	function (firstDiffEvent, secondDiffEvent, machineState) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 3;
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					firstDiffEvent,
					secondDiffEvent,
					$author$project$MachineInstructions$setPC(newPc)
				]));
	});
var $author$project$MachineInstructions$lxi_b_d16 = F3(
	function (firstArg, secondArg, machineState) {
		return A3(
			$author$project$MachineInstructions$lxi_d16_,
			$author$project$MachineInstructions$setRegisterB(secondArg),
			$author$project$MachineInstructions$setRegisterC(firstArg),
			machineState);
	});
var $author$project$MachineInstructions$lxi_d_d16 = F3(
	function (firstArg, secondArg, machineState) {
		return A3(
			$author$project$MachineInstructions$lxi_d16_,
			$author$project$MachineInstructions$setRegisterD(secondArg),
			$author$project$MachineInstructions$setRegisterE(firstArg),
			machineState);
	});
var $author$project$MachineInstructions$lxi_h_d16 = F3(
	function (firstArg, secondArg, machineState) {
		return A3(
			$author$project$MachineInstructions$lxi_d16_,
			$author$project$MachineInstructions$setRegisterH(secondArg),
			$author$project$MachineInstructions$setRegisterL(firstArg),
			machineState);
	});
var $author$project$MachineInstructions$lxi_sp_d16 = F3(
	function (firstArg, secondArg, machineState) {
		var newSp = A2($author$project$BitOperations$getAddressLE, firstArg, secondArg);
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 3;
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					$author$project$MachineInstructions$setSP(newSp),
					$author$project$MachineInstructions$setPC(newPc)
				]));
	});
var $author$project$MachineInstructions$mov_r_r_ = F3(
	function (setRegisterEvent, fromRegister, machineState) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					$author$project$EmulatorState$SetCpu(
					setRegisterEvent(
						fromRegister(machineState))),
					$author$project$MachineInstructions$setPC(newPc)
				]));
	});
var $author$project$MachineInstructions$mov_a_b = function (machineState) {
	return A3(
		$author$project$MachineInstructions$mov_r_r_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterA(data);
		},
		$author$project$MachineInstructions$getB,
		machineState);
};
var $author$project$MachineInstructions$mov_a_c = function (machineState) {
	return A3(
		$author$project$MachineInstructions$mov_r_r_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterA(data);
		},
		$author$project$MachineInstructions$getC,
		machineState);
};
var $author$project$MachineInstructions$mov_a_d = function (machineState) {
	return A3(
		$author$project$MachineInstructions$mov_r_r_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterA(data);
		},
		$author$project$MachineInstructions$getD,
		machineState);
};
var $author$project$MachineInstructions$mov_a_e = function (machineState) {
	return A3(
		$author$project$MachineInstructions$mov_r_r_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterA(data);
		},
		$author$project$MachineInstructions$getE,
		machineState);
};
var $author$project$MachineInstructions$mov_a_h = function (machineState) {
	return A3(
		$author$project$MachineInstructions$mov_r_r_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterA(data);
		},
		$author$project$MachineInstructions$getH,
		machineState);
};
var $author$project$MachineInstructions$mov_a_l = function (machineState) {
	return A3(
		$author$project$MachineInstructions$mov_r_r_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterA(data);
		},
		$author$project$MachineInstructions$getL,
		machineState);
};
var $author$project$MachineInstructions$mov_r_m_ = F2(
	function (setRegisterEvent, machineState) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
		var memoryAddress = A2(
			$author$project$BitOperations$getAddressLE,
			$author$project$MachineInstructions$getL(machineState),
			$author$project$MachineInstructions$getH(machineState));
		var memoryAccessResult = A2(
			$author$project$Memory$readMemory,
			memoryAddress,
			$author$project$MachineInstructions$getMemory(machineState));
		if (!memoryAccessResult.$) {
			var valueFromMemory = memoryAccessResult.a;
			return $author$project$EmulatorState$Events(
				_List_fromArray(
					[
						$author$project$EmulatorState$SetCpu(
						setRegisterEvent(valueFromMemory)),
						$author$project$MachineInstructions$setPC(newPc)
					]));
		} else {
			var message = memoryAccessResult.a;
			return A2(
				$author$project$EmulatorState$Failed,
				$elm$core$Maybe$Just(machineState),
				message);
		}
	});
var $author$project$MachineInstructions$mov_a_m = function (machineState) {
	return A2(
		$author$project$MachineInstructions$mov_r_m_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterA(data);
		},
		machineState);
};
var $author$project$MachineInstructions$mov_b_a = function (machineState) {
	return A3(
		$author$project$MachineInstructions$mov_r_r_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterB(data);
		},
		$author$project$MachineInstructions$getA,
		machineState);
};
var $author$project$MachineInstructions$mov_b_m = function (machineState) {
	return A2(
		$author$project$MachineInstructions$mov_r_m_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterB(data);
		},
		machineState);
};
var $author$project$MachineInstructions$mov_c_a = function (machineState) {
	return A3(
		$author$project$MachineInstructions$mov_r_r_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterC(data);
		},
		$author$project$MachineInstructions$getA,
		machineState);
};
var $author$project$MachineInstructions$mov_c_m = function (machineState) {
	return A2(
		$author$project$MachineInstructions$mov_r_m_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterC(data);
		},
		machineState);
};
var $author$project$MachineInstructions$mov_d_a = function (machineState) {
	return A3(
		$author$project$MachineInstructions$mov_r_r_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterD(data);
		},
		$author$project$MachineInstructions$getA,
		machineState);
};
var $author$project$MachineInstructions$mov_d_m = function (machineState) {
	return A2(
		$author$project$MachineInstructions$mov_r_m_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterD(data);
		},
		machineState);
};
var $author$project$MachineInstructions$mov_e_a = function (machineState) {
	return A3(
		$author$project$MachineInstructions$mov_r_r_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterE(data);
		},
		$author$project$MachineInstructions$getA,
		machineState);
};
var $author$project$MachineInstructions$mov_e_m = function (machineState) {
	return A2(
		$author$project$MachineInstructions$mov_r_m_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterE(data);
		},
		machineState);
};
var $author$project$MachineInstructions$mov_h_a = function (machineState) {
	return A3(
		$author$project$MachineInstructions$mov_r_r_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterH(data);
		},
		$author$project$MachineInstructions$getA,
		machineState);
};
var $author$project$MachineInstructions$mov_h_c = function (machineState) {
	return A3(
		$author$project$MachineInstructions$mov_r_r_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterH(data);
		},
		$author$project$MachineInstructions$getC,
		machineState);
};
var $author$project$MachineInstructions$mov_h_m = function (machineState) {
	return A2(
		$author$project$MachineInstructions$mov_r_m_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterH(data);
		},
		machineState);
};
var $author$project$MachineInstructions$mov_l_a = function (machineState) {
	return A3(
		$author$project$MachineInstructions$mov_r_r_,
		function (data) {
			return $author$project$EmulatorState$SetRegisterL(data);
		},
		$author$project$MachineInstructions$getA,
		machineState);
};
var $author$project$MachineInstructions$move_m_r_ = F2(
	function (fromRegister, machineState) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
		var memoryAddress = A2(
			$author$project$BitOperations$getAddressLE,
			$author$project$MachineInstructions$getL(machineState),
			$author$project$MachineInstructions$getH(machineState));
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					A2(
					$author$project$MachineInstructions$setMemory,
					memoryAddress,
					fromRegister(machineState)),
					$author$project$MachineInstructions$setPC(newPc)
				]));
	});
var $author$project$MachineInstructions$mov_m_a = function (machineState) {
	return A2($author$project$MachineInstructions$move_m_r_, $author$project$MachineInstructions$getA, machineState);
};
var $author$project$MachineInstructions$mov_m_b = function (machineState) {
	return A2($author$project$MachineInstructions$move_m_r_, $author$project$MachineInstructions$getB, machineState);
};
var $author$project$MachineInstructions$mvi_d8_ = F2(
	function (diffEvent, machineState) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 2;
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					diffEvent,
					$author$project$MachineInstructions$setPC(newPc)
				]));
	});
var $author$project$MachineInstructions$mvi_a_d8 = F2(
	function (firstArg, machineState) {
		return A2(
			$author$project$MachineInstructions$mvi_d8_,
			$author$project$MachineInstructions$setRegisterA(firstArg),
			machineState);
	});
var $author$project$MachineInstructions$mvi_b_d8 = F2(
	function (firstArg, machineState) {
		return A2(
			$author$project$MachineInstructions$mvi_d8_,
			$author$project$MachineInstructions$setRegisterB(firstArg),
			machineState);
	});
var $author$project$MachineInstructions$mvi_c_d8 = F2(
	function (firstArg, machineState) {
		return A2(
			$author$project$MachineInstructions$mvi_d8_,
			$author$project$MachineInstructions$setRegisterC(firstArg),
			machineState);
	});
var $author$project$MachineInstructions$mvi_d_d8 = F2(
	function (firstArg, machineState) {
		return A2(
			$author$project$MachineInstructions$mvi_d8_,
			$author$project$MachineInstructions$setRegisterD(firstArg),
			machineState);
	});
var $author$project$MachineInstructions$mvi_h_d8 = F2(
	function (firstArg, machineState) {
		return A2(
			$author$project$MachineInstructions$mvi_d8_,
			$author$project$MachineInstructions$setRegisterH(firstArg),
			machineState);
	});
var $author$project$MachineInstructions$mvi_l_d8 = F2(
	function (firstArg, machineState) {
		return A2(
			$author$project$MachineInstructions$mvi_d8_,
			$author$project$MachineInstructions$setRegisterL(firstArg),
			machineState);
	});
var $author$project$MachineInstructions$mvi_m_d8 = F2(
	function (firstArg, machineState) {
		var address = A2(
			$author$project$BitOperations$getAddressLE,
			$author$project$MachineInstructions$getL(machineState),
			$author$project$MachineInstructions$getH(machineState));
		return A2(
			$author$project$MachineInstructions$mvi_d8_,
			A2($author$project$EmulatorState$SetMemory, address, firstArg),
			machineState);
	});
var $author$project$MachineInstructions$nop = function (machineState) {
	var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
	return $author$project$EmulatorState$Events(
		_List_fromArray(
			[
				$author$project$MachineInstructions$setPC(newPc)
			]));
};
var $author$project$MachineInstructions$ora_ = F2(
	function (value, machineState) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
		var newA = $author$project$MachineInstructions$getA(machineState) | value;
		return $author$project$EmulatorState$Events(
			$elm$core$List$concat(
				_List_fromArray(
					[
						_List_fromArray(
						[
							$author$project$MachineInstructions$setRegisterA(newA),
							$author$project$MachineInstructions$setPC(newPc),
							$author$project$MachineInstructions$setFlagCY(false),
							$author$project$MachineInstructions$setFlagAC(false)
						]),
						$author$project$LogicFlags$flags_ZSP(newA)
					])));
	});
var $author$project$MachineInstructions$ora_b = function (machineState) {
	return A2(
		$author$project$MachineInstructions$ora_,
		$author$project$MachineInstructions$getB(machineState),
		machineState);
};
var $author$project$MachineInstructions$ora_h = function (machineState) {
	return A2(
		$author$project$MachineInstructions$ora_,
		$author$project$MachineInstructions$getH(machineState),
		machineState);
};
var $author$project$MachineInstructions$ora_m = function (machineState) {
	var memoryAddress = A2(
		$author$project$BitOperations$getAddressLE,
		$author$project$MachineInstructions$getL(machineState),
		$author$project$MachineInstructions$getH(machineState));
	var memoryAccessResult = A2(
		$author$project$Memory$readMemory,
		memoryAddress,
		$author$project$MachineInstructions$getMemory(machineState));
	if (!memoryAccessResult.$) {
		var byteValue = memoryAccessResult.a;
		return A2($author$project$MachineInstructions$ora_, byteValue, machineState);
	} else {
		var message = memoryAccessResult.a;
		return A2(
			$author$project$EmulatorState$Failed,
			$elm$core$Maybe$Just(machineState),
			message);
	}
};
var $author$project$MachineInstructions$ori_d8 = F2(
	function (firstArg, machineState) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 2;
		var newA = $author$project$MachineInstructions$getA(machineState) | firstArg;
		return $author$project$EmulatorState$Events(
			$elm$core$List$concat(
				_List_fromArray(
					[
						_List_fromArray(
						[
							$author$project$MachineInstructions$setRegisterA(newA),
							$author$project$MachineInstructions$setPC(newPc)
						]),
						$author$project$MachineInstructions$logic_flags_a(newA)
					])));
	});
var $author$project$MachineInstructions$pchl = function (machineState) {
	var newPc = ($author$project$MachineInstructions$getH(machineState) << 8) | $author$project$MachineInstructions$getL(machineState);
	return $author$project$EmulatorState$Events(
		_List_fromArray(
			[
				$author$project$MachineInstructions$setPC(newPc)
			]));
};
var $author$project$MachineInstructions$pop_ = F3(
	function (firstDiffEvent, secondDiffEvent, machineState) {
		var newSp = $author$project$MachineInstructions$getSP(machineState) + 2;
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
		var memory = $author$project$MachineInstructions$getMemory(machineState);
		var addressForTwo = $author$project$MachineInstructions$getSP(machineState);
		var secondMemoryAccessResult = A2($author$project$Memory$readMemory, addressForTwo, memory);
		var addressForOne = $author$project$MachineInstructions$getSP(machineState) + 1;
		var firstMemoryAccessResult = A2($author$project$Memory$readMemory, addressForOne, memory);
		var _v0 = _Utils_Tuple2(firstMemoryAccessResult, secondMemoryAccessResult);
		if (!_v0.a.$) {
			if (!_v0.b.$) {
				var firstByteValue = _v0.a.a;
				var secondByteValue = _v0.b.a;
				return $author$project$EmulatorState$Events(
					_List_fromArray(
						[
							secondDiffEvent(secondByteValue),
							firstDiffEvent(firstByteValue),
							$author$project$MachineInstructions$setSP(newSp),
							$author$project$MachineInstructions$setPC(newPc)
						]));
			} else {
				var message = _v0.b.a;
				return A2(
					$author$project$EmulatorState$Failed,
					$elm$core$Maybe$Just(machineState),
					message);
			}
		} else {
			var message = _v0.a.a;
			return A2(
				$author$project$EmulatorState$Failed,
				$elm$core$Maybe$Just(machineState),
				message);
		}
	});
var $author$project$MachineInstructions$pop_b = function (machineState) {
	return A3(
		$author$project$MachineInstructions$pop_,
		function (data) {
			return $author$project$MachineInstructions$setRegisterB(data);
		},
		function (data) {
			return $author$project$MachineInstructions$setRegisterC(data);
		},
		machineState);
};
var $author$project$MachineInstructions$pop_d = function (machineState) {
	return A3(
		$author$project$MachineInstructions$pop_,
		function (data) {
			return $author$project$MachineInstructions$setRegisterD(data);
		},
		function (data) {
			return $author$project$MachineInstructions$setRegisterE(data);
		},
		machineState);
};
var $author$project$MachineInstructions$pop_h = function (machineState) {
	return A3(
		$author$project$MachineInstructions$pop_,
		function (data) {
			return $author$project$MachineInstructions$setRegisterH(data);
		},
		function (data) {
			return $author$project$MachineInstructions$setRegisterL(data);
		},
		machineState);
};
var $author$project$Psw$readPSW = function (psw) {
	return _List_fromArray(
		[
			$author$project$EmulatorState$SetCpu(
			$author$project$EmulatorState$SetFlag(
				$author$project$EmulatorState$SetFlagZ(64 === (psw & 64)))),
			$author$project$EmulatorState$SetCpu(
			$author$project$EmulatorState$SetFlag(
				$author$project$EmulatorState$SetFlagS(128 === (psw & 128)))),
			$author$project$EmulatorState$SetCpu(
			$author$project$EmulatorState$SetFlag(
				$author$project$EmulatorState$SetFlagP(4 === (psw & 4)))),
			$author$project$EmulatorState$SetCpu(
			$author$project$EmulatorState$SetFlag(
				$author$project$EmulatorState$SetFlagCY(1 === (psw & 1)))),
			$author$project$EmulatorState$SetCpu(
			$author$project$EmulatorState$SetFlag(
				$author$project$EmulatorState$SetFlagAC(16 === (psw & 16))))
		]);
};
var $author$project$MachineInstructions$pop_psw = function (machineState) {
	var pswAccessResult = A2(
		$author$project$Memory$readMemory,
		$author$project$MachineInstructions$getSP(machineState),
		$author$project$MachineInstructions$getMemory(machineState));
	var newSp = $author$project$MachineInstructions$getSP(machineState) + 2;
	var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
	var addressForA = $author$project$MachineInstructions$getSP(machineState) + 1;
	var memoryAccessResult = A2(
		$author$project$Memory$readMemory,
		addressForA,
		$author$project$MachineInstructions$getMemory(machineState));
	var _v0 = _Utils_Tuple2(pswAccessResult, memoryAccessResult);
	if (_v0.a.$ === 1) {
		var message = _v0.a.a;
		return A2(
			$author$project$EmulatorState$Failed,
			$elm$core$Maybe$Just(machineState),
			message);
	} else {
		if (!_v0.b.$) {
			var psw = _v0.a.a;
			var byteValue = _v0.b.a;
			return $author$project$EmulatorState$Events(
				$elm$core$List$concat(
					_List_fromArray(
						[
							$author$project$Psw$readPSW(psw),
							_List_fromArray(
							[
								$author$project$MachineInstructions$setRegisterA(byteValue),
								$author$project$MachineInstructions$setSP(newSp),
								$author$project$MachineInstructions$setPC(newPc)
							])
						])));
		} else {
			var message = _v0.b.a;
			return A2(
				$author$project$EmulatorState$Failed,
				$elm$core$Maybe$Just(machineState),
				message);
		}
	}
};
var $author$project$MachineInstructions$push_b = function (machineState) {
	return A3(
		$author$project$MachineInstructions$push_,
		$author$project$MachineInstructions$getB(machineState),
		$author$project$MachineInstructions$getC(machineState),
		machineState);
};
var $author$project$MachineInstructions$push_d = function (machineState) {
	return A3(
		$author$project$MachineInstructions$push_,
		$author$project$MachineInstructions$getD(machineState),
		$author$project$MachineInstructions$getE(machineState),
		machineState);
};
var $author$project$MachineInstructions$push_h = function (machineState) {
	return A3(
		$author$project$MachineInstructions$push_,
		$author$project$MachineInstructions$getH(machineState),
		$author$project$MachineInstructions$getL(machineState),
		machineState);
};
var $author$project$BitOperations$flagToByte = function (bool) {
	if (bool) {
		return 1;
	} else {
		return 0;
	}
};
var $author$project$Psw$createPSW = function (conditionCodes) {
	var zero = $author$project$BitOperations$flagToByte(conditionCodes.ed);
	var two = $author$project$BitOperations$flagToByte(conditionCodes.eU) << 2;
	var three = 0;
	var six = $author$project$BitOperations$flagToByte(conditionCodes.e9) << 6;
	var seven = $author$project$BitOperations$flagToByte(conditionCodes.eX) << 7;
	var one = 1 << 1;
	var four = $author$project$BitOperations$flagToByte(conditionCodes.d1) << 4;
	var five = 0;
	return A3(
		$elm$core$List$foldl,
		$elm$core$Bitwise$or,
		0,
		_List_fromArray(
			[seven, six, five, four, three, two, one, zero]));
};
var $author$project$MachineInstructions$push_psw = function (machineState) {
	var psw = $author$project$Psw$createPSW(
		$author$project$MachineInstructions$getConditionCodes(machineState));
	var newSP = $author$project$MachineInstructions$getSP(machineState) - 2;
	var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
	var addressForPSW = $author$project$MachineInstructions$getSP(machineState) - 2;
	var addressForA = $author$project$MachineInstructions$getSP(machineState) - 1;
	return $author$project$EmulatorState$Events(
		_List_fromArray(
			[
				A2(
				$author$project$MachineInstructions$setMemory,
				addressForA,
				$author$project$MachineInstructions$getA(machineState)),
				A2($author$project$MachineInstructions$setMemory, addressForPSW, psw),
				$author$project$MachineInstructions$setSP(newSP),
				$author$project$MachineInstructions$setPC(newPc)
			]));
};
var $author$project$MachineInstructions$rar = function (machineState) {
	var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
	var currentA = $author$project$MachineInstructions$getA(machineState);
	var newAWithoutCarry = currentA >> 1;
	var newA = machineState.K.cT.ed ? (newAWithoutCarry + 128) : newAWithoutCarry;
	var newCy = (1 & currentA) === 1;
	return $author$project$EmulatorState$Events(
		_List_fromArray(
			[
				$author$project$MachineInstructions$setRegisterA(newA),
				$author$project$MachineInstructions$setFlagCY(newCy),
				$author$project$MachineInstructions$setPC(newPc)
			]));
};
var $author$project$MachineInstructions$ret = function (machineState) {
	var addressLow = $author$project$MachineInstructions$getSP(machineState);
	var memSpLow = A2(
		$author$project$Memory$readMemory,
		addressLow,
		$author$project$MachineInstructions$getMemory(machineState));
	var addressHigh = $author$project$MachineInstructions$getSP(machineState) + 1;
	var memSpHigh = A2(
		$author$project$Memory$readMemory,
		addressHigh,
		$author$project$MachineInstructions$getMemory(machineState));
	var _v0 = _Utils_Tuple2(memSpLow, memSpHigh);
	if (!_v0.a.$) {
		if (!_v0.b.$) {
			var spLowByteValue = _v0.a.a;
			var spHighByteValue = _v0.b.a;
			var newSp = $author$project$MachineInstructions$getSP(machineState) + 2;
			var memSpHighShifted = spHighByteValue << 8;
			var newPC = spLowByteValue | memSpHighShifted;
			return $author$project$EmulatorState$Events(
				_List_fromArray(
					[
						$author$project$MachineInstructions$setSP(newSp),
						$author$project$MachineInstructions$setPC(newPC)
					]));
		} else {
			var message = _v0.b.a;
			return A2(
				$author$project$EmulatorState$Failed,
				$elm$core$Maybe$Just(machineState),
				message);
		}
	} else {
		var message = _v0.a.a;
		return A2(
			$author$project$EmulatorState$Failed,
			$elm$core$Maybe$Just(machineState),
			message);
	}
};
var $author$project$MachineInstructions$rc = function (machineState) {
	if ($author$project$MachineInstructions$getFlagCY(machineState)) {
		return $author$project$MachineInstructions$ret(machineState);
	} else {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					$author$project$MachineInstructions$setPC(newPc)
				]));
	}
};
var $author$project$MachineInstructions$rlc = function (machineState) {
	var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
	var currentA = $author$project$MachineInstructions$getA(machineState);
	var newA = A2($elm$core$Basics$modBy, 256, (currentA << 1) | (currentA >> 7));
	var newCy = (128 & currentA) === 128;
	return $author$project$EmulatorState$Events(
		_List_fromArray(
			[
				$author$project$MachineInstructions$setRegisterA(newA),
				$author$project$MachineInstructions$setFlagCY(newCy),
				$author$project$MachineInstructions$setPC(newPc)
			]));
};
var $author$project$MachineInstructions$rnc = function (machineState) {
	if ($author$project$MachineInstructions$getFlagCY(machineState)) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					$author$project$MachineInstructions$setPC(newPc)
				]));
	} else {
		return $author$project$MachineInstructions$ret(machineState);
	}
};
var $author$project$MachineInstructions$rnz = function (machineState) {
	if ($author$project$MachineInstructions$getFlagZ(machineState)) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					$author$project$MachineInstructions$setPC(newPc)
				]));
	} else {
		return $author$project$MachineInstructions$ret(machineState);
	}
};
var $author$project$MachineInstructions$rrc = function (machineState) {
	var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
	var newCY = 1 === ($author$project$MachineInstructions$getA(machineState) & 1);
	var newA = (($author$project$MachineInstructions$getA(machineState) & 1) << 7) | ($author$project$MachineInstructions$getA(machineState) >> 1);
	return $author$project$EmulatorState$Events(
		_List_fromArray(
			[
				$author$project$MachineInstructions$setRegisterA(newA),
				$author$project$MachineInstructions$setFlagCY(newCY),
				$author$project$MachineInstructions$setPC(newPc)
			]));
};
var $author$project$MachineInstructions$rz = function (machineState) {
	if ($author$project$MachineInstructions$getFlagZ(machineState)) {
		return $author$project$MachineInstructions$ret(machineState);
	} else {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					$author$project$MachineInstructions$setPC(newPc)
				]));
	}
};
var $author$project$MachineInstructions$shld_d16 = F3(
	function (firstArg, secondArg, machineState) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 3;
		var addressForL = A2($author$project$BitOperations$getAddressLE, firstArg, secondArg);
		var addressForH = A2($author$project$BitOperations$getAddressLE, firstArg, secondArg) + 1;
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					A2(
					$author$project$MachineInstructions$setMemory,
					addressForL,
					$author$project$MachineInstructions$getL(machineState)),
					A2(
					$author$project$MachineInstructions$setMemory,
					addressForH,
					$author$project$MachineInstructions$getH(machineState)),
					$author$project$MachineInstructions$setPC(newPc)
				]));
	});
var $author$project$MachineInstructions$sta = F3(
	function (firstArg, secondArg, machineState) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 3;
		var address = A2($author$project$BitOperations$getAddressLE, firstArg, secondArg);
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					A2(
					$author$project$MachineInstructions$setMemory,
					address,
					$author$project$MachineInstructions$getA(machineState)),
					$author$project$MachineInstructions$setPC(newPc)
				]));
	});
var $author$project$MachineInstructions$stax_rp_ = F3(
	function (registerHigh, registerLow, machineState) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
		var address = A2(
			$author$project$BitOperations$getAddressLE,
			registerLow(machineState),
			registerHigh(machineState));
		return $author$project$EmulatorState$Events(
			_List_fromArray(
				[
					A2(
					$author$project$MachineInstructions$setMemory,
					address,
					$author$project$MachineInstructions$getA(machineState)),
					$author$project$MachineInstructions$setPC(newPc)
				]));
	});
var $author$project$MachineInstructions$stax_b = function (machineState) {
	return A3($author$project$MachineInstructions$stax_rp_, $author$project$MachineInstructions$getB, $author$project$MachineInstructions$getC, machineState);
};
var $author$project$MachineInstructions$stax_d = function (machineState) {
	return A3($author$project$MachineInstructions$stax_rp_, $author$project$MachineInstructions$getD, $author$project$MachineInstructions$getE, machineState);
};
var $author$project$MachineInstructions$stc = function (machineState) {
	var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
	return $author$project$EmulatorState$Events(
		_List_fromArray(
			[
				$author$project$MachineInstructions$setFlagCY(true),
				$author$project$MachineInstructions$setPC(newPc)
			]));
};
var $elm$core$Bitwise$complement = _Bitwise_complement;
var $author$project$MachineInstructions$sui_d8 = F2(
	function (firstArg, machineState) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 2;
		var newA = ($author$project$MachineInstructions$getA(machineState) + (~firstArg)) + 1;
		var newCY = $author$project$ConditionCodesFlags$cyFlag(newA);
		return $author$project$EmulatorState$Events(
			$elm$core$List$concat(
				_List_fromArray(
					[
						_List_fromArray(
						[
							$author$project$MachineInstructions$setPC(newPc),
							$author$project$MachineInstructions$setRegisterA(newA),
							$author$project$MachineInstructions$setFlagCY(newCY)
						]),
						$author$project$LogicFlags$flags_ZSP(newA)
					])));
	});
var $author$project$OpCodeTable$unimplementedInstructionOne = F2(
	function (firstArg, cpuState) {
		return A2(
			$author$project$EmulatorState$Failed,
			$elm$core$Maybe$Just(cpuState),
			'not implemented yet, first arg: ' + $elm$core$String$fromInt(firstArg));
	});
var $author$project$OpCodeTable$unimplementedInstructionTwo = F3(
	function (firstArg, secondArg, cpuState) {
		return A2(
			$author$project$EmulatorState$Failed,
			$elm$core$Maybe$Just(cpuState),
			'not implemented yet, first arg: ' + ($elm$core$String$fromInt(firstArg) + (', second arg: ' + $elm$core$String$fromInt(secondArg))));
	});
var $author$project$OpCodeTable$unimplementedInstructionZero = function (cpuState) {
	return A2(
		$author$project$EmulatorState$Failed,
		$elm$core$Maybe$Just(cpuState),
		'not implemented yet, no args');
};
var $author$project$OpCodeTable$unknownInstruction = function (cpuState) {
	return A2(
		$author$project$EmulatorState$Failed,
		$elm$core$Maybe$Just(cpuState),
		'unknown instruction');
};
var $author$project$MachineInstructions$xchg = function (machineState) {
	var saveTwo = $author$project$MachineInstructions$getE(machineState);
	var saveOne = $author$project$MachineInstructions$getD(machineState);
	var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
	return $author$project$EmulatorState$Events(
		_List_fromArray(
			[
				$author$project$MachineInstructions$setRegisterD(
				$author$project$MachineInstructions$getH(machineState)),
				$author$project$MachineInstructions$setRegisterE(
				$author$project$MachineInstructions$getL(machineState)),
				$author$project$MachineInstructions$setRegisterH(saveOne),
				$author$project$MachineInstructions$setRegisterL(saveTwo),
				$author$project$MachineInstructions$setPC(newPc)
			]));
};
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $author$project$MachineInstructions$xra_r_ = F2(
	function (fromRegister, machineState) {
		var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
		var newA = $author$project$MachineInstructions$getA(machineState) ^ fromRegister(machineState);
		return $author$project$EmulatorState$Events(
			$elm$core$List$concat(
				_List_fromArray(
					[
						_List_fromArray(
						[
							$author$project$MachineInstructions$setRegisterA(newA),
							$author$project$MachineInstructions$setPC(newPc),
							$author$project$MachineInstructions$setFlagCY(false),
							$author$project$MachineInstructions$setFlagAC(false)
						]),
						$author$project$LogicFlags$flags_ZSP(newA)
					])));
	});
var $author$project$MachineInstructions$xra_a = function (machineState) {
	return A2($author$project$MachineInstructions$xra_r_, $author$project$MachineInstructions$getA, machineState);
};
var $author$project$MachineInstructions$xra_b = function (machineState) {
	return A2($author$project$MachineInstructions$xra_r_, $author$project$MachineInstructions$getB, machineState);
};
var $author$project$MachineInstructions$xthl = function (machineState) {
	var newPc = $author$project$MachineInstructions$getPC(machineState) + 1;
	var currentL = $author$project$MachineInstructions$getL(machineState);
	var currentH = $author$project$MachineInstructions$getH(machineState);
	var addressForL = $author$project$MachineInstructions$getSP(machineState);
	var memoryAccessResultForL = A2(
		$author$project$Memory$readMemory,
		addressForL,
		$author$project$MachineInstructions$getMemory(machineState));
	var addressForH = $author$project$MachineInstructions$getSP(machineState) + 1;
	var memoryAccessResultForH = A2(
		$author$project$Memory$readMemory,
		addressForH,
		$author$project$MachineInstructions$getMemory(machineState));
	var _v0 = _Utils_Tuple2(memoryAccessResultForL, memoryAccessResultForH);
	if (_v0.a.$ === 1) {
		var message = _v0.a.a;
		return A2(
			$author$project$EmulatorState$Failed,
			$elm$core$Maybe$Just(machineState),
			message);
	} else {
		if (!_v0.b.$) {
			var valueL = _v0.a.a;
			var valueH = _v0.b.a;
			return $author$project$EmulatorState$Events(
				_List_fromArray(
					[
						$author$project$MachineInstructions$setRegisterL(valueL),
						$author$project$MachineInstructions$setRegisterH(valueH),
						A2($author$project$MachineInstructions$setMemory, addressForL, currentL),
						A2($author$project$MachineInstructions$setMemory, addressForH, currentH),
						$author$project$MachineInstructions$setPC(newPc)
					]));
		} else {
			var message = _v0.b.a;
			return A2(
				$author$project$EmulatorState$Failed,
				$elm$core$Maybe$Just(machineState),
				message);
		}
	}
};
var $author$project$OpCodeTable$opCodeTable = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			0,
			A3(
				$author$project$OpCode$OpCodeData,
				'NOP',
				4,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$nop))),
			_Utils_Tuple2(
			1,
			A3(
				$author$project$OpCode$OpCodeData,
				'LXI B,D16',
				10,
				$author$project$OpCode$ThreeBytes($author$project$MachineInstructions$lxi_b_d16))),
			_Utils_Tuple2(
			2,
			A3(
				$author$project$OpCode$OpCodeData,
				'STAX B',
				7,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$stax_b))),
			_Utils_Tuple2(
			3,
			A3(
				$author$project$OpCode$OpCodeData,
				'INX B',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$inx_b))),
			_Utils_Tuple2(
			4,
			A3(
				$author$project$OpCode$OpCodeData,
				'INR B',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$inr_b))),
			_Utils_Tuple2(
			5,
			A3(
				$author$project$OpCode$OpCodeData,
				'DCR B',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$dcr_b))),
			_Utils_Tuple2(
			6,
			A3(
				$author$project$OpCode$OpCodeData,
				'MVI B, D8',
				7,
				$author$project$OpCode$TwoBytes($author$project$MachineInstructions$mvi_b_d8))),
			_Utils_Tuple2(
			7,
			A3(
				$author$project$OpCode$OpCodeData,
				'RLC',
				4,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$rlc))),
			_Utils_Tuple2(
			8,
			A3(
				$author$project$OpCode$OpCodeData,
				'-',
				0,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unknownInstruction))),
			_Utils_Tuple2(
			9,
			A3(
				$author$project$OpCode$OpCodeData,
				'DAD B',
				10,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$dad_b))),
			_Utils_Tuple2(
			10,
			A3(
				$author$project$OpCode$OpCodeData,
				'LDAX B',
				7,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$ldax_b))),
			_Utils_Tuple2(
			11,
			A3(
				$author$project$OpCode$OpCodeData,
				'DCX B',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$dcx_b))),
			_Utils_Tuple2(
			12,
			A3(
				$author$project$OpCode$OpCodeData,
				'INR C',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			13,
			A3(
				$author$project$OpCode$OpCodeData,
				'DCR C',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$dcr_c))),
			_Utils_Tuple2(
			14,
			A3(
				$author$project$OpCode$OpCodeData,
				'MVI C,D8',
				7,
				$author$project$OpCode$TwoBytes($author$project$MachineInstructions$mvi_c_d8))),
			_Utils_Tuple2(
			15,
			A3(
				$author$project$OpCode$OpCodeData,
				'RRC',
				4,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$rrc))),
			_Utils_Tuple2(
			16,
			A3(
				$author$project$OpCode$OpCodeData,
				'-',
				0,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unknownInstruction))),
			_Utils_Tuple2(
			17,
			A3(
				$author$project$OpCode$OpCodeData,
				'LXI D,D16',
				10,
				$author$project$OpCode$ThreeBytes($author$project$MachineInstructions$lxi_d_d16))),
			_Utils_Tuple2(
			18,
			A3(
				$author$project$OpCode$OpCodeData,
				'STAX D',
				7,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$stax_d))),
			_Utils_Tuple2(
			19,
			A3(
				$author$project$OpCode$OpCodeData,
				'INX D',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$inx_d))),
			_Utils_Tuple2(
			20,
			A3(
				$author$project$OpCode$OpCodeData,
				'INR D',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			21,
			A3(
				$author$project$OpCode$OpCodeData,
				'DCR D',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			22,
			A3(
				$author$project$OpCode$OpCodeData,
				'MVI D, D8',
				7,
				$author$project$OpCode$TwoBytes($author$project$MachineInstructions$mvi_d_d8))),
			_Utils_Tuple2(
			23,
			A3(
				$author$project$OpCode$OpCodeData,
				'RAL',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			24,
			A3(
				$author$project$OpCode$OpCodeData,
				'-',
				0,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unknownInstruction))),
			_Utils_Tuple2(
			25,
			A3(
				$author$project$OpCode$OpCodeData,
				'DAD D',
				10,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$dad_d))),
			_Utils_Tuple2(
			26,
			A3(
				$author$project$OpCode$OpCodeData,
				'LDAX D',
				7,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$ldax_d))),
			_Utils_Tuple2(
			27,
			A3(
				$author$project$OpCode$OpCodeData,
				'DCX D',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			28,
			A3(
				$author$project$OpCode$OpCodeData,
				'INR E',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			29,
			A3(
				$author$project$OpCode$OpCodeData,
				'DCR E',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			30,
			A3(
				$author$project$OpCode$OpCodeData,
				'MVI E,D8',
				7,
				$author$project$OpCode$TwoBytes($author$project$OpCodeTable$unimplementedInstructionOne))),
			_Utils_Tuple2(
			31,
			A3(
				$author$project$OpCode$OpCodeData,
				'RAR',
				4,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$rar))),
			_Utils_Tuple2(
			32,
			A3(
				$author$project$OpCode$OpCodeData,
				'RIM',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			33,
			A3(
				$author$project$OpCode$OpCodeData,
				'LXI H,D16',
				10,
				$author$project$OpCode$ThreeBytes($author$project$MachineInstructions$lxi_h_d16))),
			_Utils_Tuple2(
			34,
			A3(
				$author$project$OpCode$OpCodeData,
				'SHLD adr',
				16,
				$author$project$OpCode$ThreeBytes($author$project$MachineInstructions$shld_d16))),
			_Utils_Tuple2(
			35,
			A3(
				$author$project$OpCode$OpCodeData,
				'INX H',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$inx_h))),
			_Utils_Tuple2(
			36,
			A3(
				$author$project$OpCode$OpCodeData,
				'INR H',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			37,
			A3(
				$author$project$OpCode$OpCodeData,
				'DCR H',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			38,
			A3(
				$author$project$OpCode$OpCodeData,
				'MVI H,D8',
				7,
				$author$project$OpCode$TwoBytes($author$project$MachineInstructions$mvi_h_d8))),
			_Utils_Tuple2(
			39,
			A3(
				$author$project$OpCode$OpCodeData,
				'DAA',
				4,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$daa))),
			_Utils_Tuple2(
			40,
			A3(
				$author$project$OpCode$OpCodeData,
				'-',
				0,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unknownInstruction))),
			_Utils_Tuple2(
			41,
			A3(
				$author$project$OpCode$OpCodeData,
				'DAD H',
				10,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$dad_h))),
			_Utils_Tuple2(
			42,
			A3(
				$author$project$OpCode$OpCodeData,
				'LHLD adr',
				16,
				$author$project$OpCode$ThreeBytes($author$project$MachineInstructions$lhld))),
			_Utils_Tuple2(
			43,
			A3(
				$author$project$OpCode$OpCodeData,
				'DCX H',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$dcx_h))),
			_Utils_Tuple2(
			44,
			A3(
				$author$project$OpCode$OpCodeData,
				'INR L',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			45,
			A3(
				$author$project$OpCode$OpCodeData,
				'DCR L',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			46,
			A3(
				$author$project$OpCode$OpCodeData,
				'MVI L, D8',
				7,
				$author$project$OpCode$TwoBytes($author$project$MachineInstructions$mvi_l_d8))),
			_Utils_Tuple2(
			47,
			A3(
				$author$project$OpCode$OpCodeData,
				'CMA',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			48,
			A3(
				$author$project$OpCode$OpCodeData,
				'SIM',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			49,
			A3(
				$author$project$OpCode$OpCodeData,
				'LXI SP, D16',
				10,
				$author$project$OpCode$ThreeBytes($author$project$MachineInstructions$lxi_sp_d16))),
			_Utils_Tuple2(
			50,
			A3(
				$author$project$OpCode$OpCodeData,
				'STA adr',
				13,
				$author$project$OpCode$ThreeBytes($author$project$MachineInstructions$sta))),
			_Utils_Tuple2(
			51,
			A3(
				$author$project$OpCode$OpCodeData,
				'INX SP',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			52,
			A3(
				$author$project$OpCode$OpCodeData,
				'INR M',
				10,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			53,
			A3(
				$author$project$OpCode$OpCodeData,
				'DCR M',
				10,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$dcr_m))),
			_Utils_Tuple2(
			54,
			A3(
				$author$project$OpCode$OpCodeData,
				'MVI M,D8',
				10,
				$author$project$OpCode$TwoBytes($author$project$MachineInstructions$mvi_m_d8))),
			_Utils_Tuple2(
			55,
			A3(
				$author$project$OpCode$OpCodeData,
				'STC',
				4,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$stc))),
			_Utils_Tuple2(
			56,
			A3(
				$author$project$OpCode$OpCodeData,
				'-',
				0,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unknownInstruction))),
			_Utils_Tuple2(
			57,
			A3(
				$author$project$OpCode$OpCodeData,
				'DAD SP',
				10,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			58,
			A3(
				$author$project$OpCode$OpCodeData,
				'LDA adr',
				13,
				$author$project$OpCode$ThreeBytes($author$project$MachineInstructions$lda))),
			_Utils_Tuple2(
			59,
			A3(
				$author$project$OpCode$OpCodeData,
				'DCX SP',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			60,
			A3(
				$author$project$OpCode$OpCodeData,
				'INR A',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$inr_a))),
			_Utils_Tuple2(
			61,
			A3(
				$author$project$OpCode$OpCodeData,
				'DCR A',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$dcr_a))),
			_Utils_Tuple2(
			62,
			A3(
				$author$project$OpCode$OpCodeData,
				'MVI A,D8',
				7,
				$author$project$OpCode$TwoBytes($author$project$MachineInstructions$mvi_a_d8))),
			_Utils_Tuple2(
			63,
			A3(
				$author$project$OpCode$OpCodeData,
				'CMC',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			64,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV B,B',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			65,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV B,C',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			66,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV B,D',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			67,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV B,E',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			68,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV B,H',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			69,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV B,L',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			70,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV B,M',
				7,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_b_m))),
			_Utils_Tuple2(
			71,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV B,A',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_b_a))),
			_Utils_Tuple2(
			72,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV C,B',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			73,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV C,C',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			74,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV C,D',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			75,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV C,E',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			76,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV C,H',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			77,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV C,L',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			78,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV C,M',
				7,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_c_m))),
			_Utils_Tuple2(
			79,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV C,A',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_c_a))),
			_Utils_Tuple2(
			80,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV D,B',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			81,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV D,C',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			82,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV D,D',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			83,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV D,E',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			84,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV D,H',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			85,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV D,L',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			86,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV D,M',
				7,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_d_m))),
			_Utils_Tuple2(
			87,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV D,A',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_d_a))),
			_Utils_Tuple2(
			88,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV E,B',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			89,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV E,C',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			90,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV E,D',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			91,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV E,E',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			92,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV E,H',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			93,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV E,L',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			94,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV E,M',
				7,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_e_m))),
			_Utils_Tuple2(
			95,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV E,A',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_e_a))),
			_Utils_Tuple2(
			96,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV H,B',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			97,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV H,C',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_h_c))),
			_Utils_Tuple2(
			98,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV H,D',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			99,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV H,E',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			100,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV H,H',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			101,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV H,L',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			102,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV H,M',
				7,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_h_m))),
			_Utils_Tuple2(
			103,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV H,A',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_h_a))),
			_Utils_Tuple2(
			104,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV L,B',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			105,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV L,C',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			106,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV L,D',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			107,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV L,E',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			108,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV L,H',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			109,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV L,L',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			110,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV L,M',
				7,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			111,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV L,A',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_l_a))),
			_Utils_Tuple2(
			112,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV M,B',
				7,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_m_b))),
			_Utils_Tuple2(
			113,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV M,C',
				7,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			114,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV M,D',
				7,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			115,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV M,E',
				7,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			116,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV M,H',
				7,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			117,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV M,L',
				7,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			118,
			A3(
				$author$project$OpCode$OpCodeData,
				'HLT',
				7,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			119,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV M,A',
				7,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_m_a))),
			_Utils_Tuple2(
			120,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV A,B',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_a_b))),
			_Utils_Tuple2(
			121,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV A,C',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_a_c))),
			_Utils_Tuple2(
			122,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV A,D',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_a_d))),
			_Utils_Tuple2(
			123,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV A,E',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_a_e))),
			_Utils_Tuple2(
			124,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV A,H',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_a_h))),
			_Utils_Tuple2(
			125,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV A,L',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_a_l))),
			_Utils_Tuple2(
			126,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV A,M',
				7,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$mov_a_m))),
			_Utils_Tuple2(
			127,
			A3(
				$author$project$OpCode$OpCodeData,
				'MOV A,A',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			128,
			A3(
				$author$project$OpCode$OpCodeData,
				'ADD B',
				4,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$add_b))),
			_Utils_Tuple2(
			129,
			A3(
				$author$project$OpCode$OpCodeData,
				'ADD C',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			130,
			A3(
				$author$project$OpCode$OpCodeData,
				'ADD D',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			131,
			A3(
				$author$project$OpCode$OpCodeData,
				'ADD E',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			132,
			A3(
				$author$project$OpCode$OpCodeData,
				'ADD H',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			133,
			A3(
				$author$project$OpCode$OpCodeData,
				'ADD L',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			134,
			A3(
				$author$project$OpCode$OpCodeData,
				'ADD M',
				7,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			135,
			A3(
				$author$project$OpCode$OpCodeData,
				'ADD A',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			136,
			A3(
				$author$project$OpCode$OpCodeData,
				'ADC B',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			137,
			A3(
				$author$project$OpCode$OpCodeData,
				'ADC C',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			138,
			A3(
				$author$project$OpCode$OpCodeData,
				'ADC D',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			139,
			A3(
				$author$project$OpCode$OpCodeData,
				'ADC E',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			140,
			A3(
				$author$project$OpCode$OpCodeData,
				'ADC H',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			141,
			A3(
				$author$project$OpCode$OpCodeData,
				'ADC L',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			142,
			A3(
				$author$project$OpCode$OpCodeData,
				'ADC M',
				7,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			143,
			A3(
				$author$project$OpCode$OpCodeData,
				'ADC A',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			144,
			A3(
				$author$project$OpCode$OpCodeData,
				'SUB B',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			145,
			A3(
				$author$project$OpCode$OpCodeData,
				'SUB C',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			146,
			A3(
				$author$project$OpCode$OpCodeData,
				'SUB D',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			147,
			A3(
				$author$project$OpCode$OpCodeData,
				'SUB E',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			148,
			A3(
				$author$project$OpCode$OpCodeData,
				'SUB H',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			149,
			A3(
				$author$project$OpCode$OpCodeData,
				'SUB L',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			150,
			A3(
				$author$project$OpCode$OpCodeData,
				'SUB M',
				7,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			151,
			A3(
				$author$project$OpCode$OpCodeData,
				'SUB A',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			152,
			A3(
				$author$project$OpCode$OpCodeData,
				'SBB B',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			153,
			A3(
				$author$project$OpCode$OpCodeData,
				'SBB C',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			154,
			A3(
				$author$project$OpCode$OpCodeData,
				'SBB D',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			155,
			A3(
				$author$project$OpCode$OpCodeData,
				'SBB E',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			156,
			A3(
				$author$project$OpCode$OpCodeData,
				'SBB H',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			157,
			A3(
				$author$project$OpCode$OpCodeData,
				'SBB L',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			158,
			A3(
				$author$project$OpCode$OpCodeData,
				'SBB M',
				7,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			159,
			A3(
				$author$project$OpCode$OpCodeData,
				'SBB A',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			160,
			A3(
				$author$project$OpCode$OpCodeData,
				'ANA B',
				4,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$ana_b))),
			_Utils_Tuple2(
			161,
			A3(
				$author$project$OpCode$OpCodeData,
				'ANA C',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			162,
			A3(
				$author$project$OpCode$OpCodeData,
				'ANA D',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			163,
			A3(
				$author$project$OpCode$OpCodeData,
				'ANA E',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			164,
			A3(
				$author$project$OpCode$OpCodeData,
				'ANA H',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			165,
			A3(
				$author$project$OpCode$OpCodeData,
				'ANA L',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			166,
			A3(
				$author$project$OpCode$OpCodeData,
				'ANA M',
				7,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			167,
			A3(
				$author$project$OpCode$OpCodeData,
				'ANA A',
				4,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$ana_a))),
			_Utils_Tuple2(
			168,
			A3(
				$author$project$OpCode$OpCodeData,
				'XRA B',
				4,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$xra_b))),
			_Utils_Tuple2(
			169,
			A3(
				$author$project$OpCode$OpCodeData,
				'XRA C',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			170,
			A3(
				$author$project$OpCode$OpCodeData,
				'XRA D',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			171,
			A3(
				$author$project$OpCode$OpCodeData,
				'XRA E',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			172,
			A3(
				$author$project$OpCode$OpCodeData,
				'XRA H',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			173,
			A3(
				$author$project$OpCode$OpCodeData,
				'XRA L',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			174,
			A3(
				$author$project$OpCode$OpCodeData,
				'XRA M',
				7,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			175,
			A3(
				$author$project$OpCode$OpCodeData,
				'XRA A',
				4,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$xra_a))),
			_Utils_Tuple2(
			176,
			A3(
				$author$project$OpCode$OpCodeData,
				'ORA B',
				4,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$ora_b))),
			_Utils_Tuple2(
			177,
			A3(
				$author$project$OpCode$OpCodeData,
				'ORA C',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			178,
			A3(
				$author$project$OpCode$OpCodeData,
				'ORA D',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			179,
			A3(
				$author$project$OpCode$OpCodeData,
				'ORA E',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			180,
			A3(
				$author$project$OpCode$OpCodeData,
				'ORA H',
				4,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$ora_h))),
			_Utils_Tuple2(
			181,
			A3(
				$author$project$OpCode$OpCodeData,
				'ORA L',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			182,
			A3(
				$author$project$OpCode$OpCodeData,
				'ORA M',
				7,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$ora_m))),
			_Utils_Tuple2(
			183,
			A3(
				$author$project$OpCode$OpCodeData,
				'ORA A',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			184,
			A3(
				$author$project$OpCode$OpCodeData,
				'CMP B',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			185,
			A3(
				$author$project$OpCode$OpCodeData,
				'CMP C',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			186,
			A3(
				$author$project$OpCode$OpCodeData,
				'CMP D',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			187,
			A3(
				$author$project$OpCode$OpCodeData,
				'CMP E',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			188,
			A3(
				$author$project$OpCode$OpCodeData,
				'CMP H',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			189,
			A3(
				$author$project$OpCode$OpCodeData,
				'CMP L',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			190,
			A3(
				$author$project$OpCode$OpCodeData,
				'CMP M',
				7,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			191,
			A3(
				$author$project$OpCode$OpCodeData,
				'CMP A',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			192,
			A3(
				$author$project$OpCode$OpCodeData,
				'RNZ',
				11,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$rnz))),
			_Utils_Tuple2(
			193,
			A3(
				$author$project$OpCode$OpCodeData,
				'POP B',
				10,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$pop_b))),
			_Utils_Tuple2(
			194,
			A3(
				$author$project$OpCode$OpCodeData,
				'JNZ adr',
				10,
				$author$project$OpCode$ThreeBytes($author$project$MachineInstructions$jnz))),
			_Utils_Tuple2(
			195,
			A3(
				$author$project$OpCode$OpCodeData,
				'JMP adr',
				10,
				$author$project$OpCode$ThreeBytes($author$project$MachineInstructions$jmp))),
			_Utils_Tuple2(
			196,
			A3(
				$author$project$OpCode$OpCodeData,
				'CNZ adr',
				17,
				$author$project$OpCode$ThreeBytes($author$project$MachineInstructions$cnz))),
			_Utils_Tuple2(
			197,
			A3(
				$author$project$OpCode$OpCodeData,
				'PUSH B',
				11,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$push_b))),
			_Utils_Tuple2(
			198,
			A3(
				$author$project$OpCode$OpCodeData,
				'ADI D8',
				7,
				$author$project$OpCode$TwoBytes($author$project$MachineInstructions$adi_d8))),
			_Utils_Tuple2(
			199,
			A3(
				$author$project$OpCode$OpCodeData,
				'RST 0',
				11,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			200,
			A3(
				$author$project$OpCode$OpCodeData,
				'RZ',
				11,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$rz))),
			_Utils_Tuple2(
			201,
			A3(
				$author$project$OpCode$OpCodeData,
				'RET',
				10,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$ret))),
			_Utils_Tuple2(
			202,
			A3(
				$author$project$OpCode$OpCodeData,
				'JZ adr',
				10,
				$author$project$OpCode$ThreeBytes($author$project$MachineInstructions$jz))),
			_Utils_Tuple2(
			203,
			A3(
				$author$project$OpCode$OpCodeData,
				'-',
				0,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unknownInstruction))),
			_Utils_Tuple2(
			204,
			A3(
				$author$project$OpCode$OpCodeData,
				'CZ adr',
				10,
				$author$project$OpCode$ThreeBytes($author$project$MachineInstructions$cz))),
			_Utils_Tuple2(
			205,
			A3(
				$author$project$OpCode$OpCodeData,
				'CALL adr',
				17,
				$author$project$OpCode$ThreeBytes($author$project$MachineInstructions$call))),
			_Utils_Tuple2(
			206,
			A3(
				$author$project$OpCode$OpCodeData,
				'ACI D8',
				7,
				$author$project$OpCode$TwoBytes($author$project$OpCodeTable$unimplementedInstructionOne))),
			_Utils_Tuple2(
			207,
			A3(
				$author$project$OpCode$OpCodeData,
				'RST 1',
				11,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			208,
			A3(
				$author$project$OpCode$OpCodeData,
				'RNC',
				11,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$rnc))),
			_Utils_Tuple2(
			209,
			A3(
				$author$project$OpCode$OpCodeData,
				'POP D',
				10,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$pop_d))),
			_Utils_Tuple2(
			210,
			A3(
				$author$project$OpCode$OpCodeData,
				'JNC adr',
				10,
				$author$project$OpCode$ThreeBytes($author$project$MachineInstructions$jnc))),
			_Utils_Tuple2(
			211,
			A3(
				$author$project$OpCode$OpCodeData,
				'OUT D8',
				10,
				$author$project$OpCode$TwoBytes($author$project$IO$io_out))),
			_Utils_Tuple2(
			212,
			A3(
				$author$project$OpCode$OpCodeData,
				'CNC adr',
				17,
				$author$project$OpCode$ThreeBytes($author$project$MachineInstructions$cnc))),
			_Utils_Tuple2(
			213,
			A3(
				$author$project$OpCode$OpCodeData,
				'PUSH D',
				11,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$push_d))),
			_Utils_Tuple2(
			214,
			A3(
				$author$project$OpCode$OpCodeData,
				'SUI D8',
				7,
				$author$project$OpCode$TwoBytes($author$project$MachineInstructions$sui_d8))),
			_Utils_Tuple2(
			215,
			A3(
				$author$project$OpCode$OpCodeData,
				'RST 2',
				11,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			216,
			A3(
				$author$project$OpCode$OpCodeData,
				'RC',
				11,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$rc))),
			_Utils_Tuple2(
			217,
			A3(
				$author$project$OpCode$OpCodeData,
				'-',
				0,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unknownInstruction))),
			_Utils_Tuple2(
			218,
			A3(
				$author$project$OpCode$OpCodeData,
				'JC adr',
				10,
				$author$project$OpCode$ThreeBytes($author$project$MachineInstructions$jc))),
			_Utils_Tuple2(
			219,
			A3(
				$author$project$OpCode$OpCodeData,
				'IN D8',
				10,
				$author$project$OpCode$TwoBytes($author$project$IO$io_in))),
			_Utils_Tuple2(
			220,
			A3(
				$author$project$OpCode$OpCodeData,
				'CC adr',
				10,
				$author$project$OpCode$ThreeBytes($author$project$OpCodeTable$unimplementedInstructionTwo))),
			_Utils_Tuple2(
			221,
			A3(
				$author$project$OpCode$OpCodeData,
				'-',
				0,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unknownInstruction))),
			_Utils_Tuple2(
			222,
			A3(
				$author$project$OpCode$OpCodeData,
				'SBI D8',
				7,
				$author$project$OpCode$TwoBytes($author$project$OpCodeTable$unimplementedInstructionOne))),
			_Utils_Tuple2(
			223,
			A3(
				$author$project$OpCode$OpCodeData,
				'RST 3',
				11,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			224,
			A3(
				$author$project$OpCode$OpCodeData,
				'RPO',
				11,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			225,
			A3(
				$author$project$OpCode$OpCodeData,
				'POP H',
				10,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$pop_h))),
			_Utils_Tuple2(
			226,
			A3(
				$author$project$OpCode$OpCodeData,
				'JPO adr',
				10,
				$author$project$OpCode$ThreeBytes($author$project$OpCodeTable$unimplementedInstructionTwo))),
			_Utils_Tuple2(
			227,
			A3(
				$author$project$OpCode$OpCodeData,
				'XTHL',
				18,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$xthl))),
			_Utils_Tuple2(
			228,
			A3(
				$author$project$OpCode$OpCodeData,
				'CPO adr',
				17,
				$author$project$OpCode$ThreeBytes($author$project$OpCodeTable$unimplementedInstructionTwo))),
			_Utils_Tuple2(
			229,
			A3(
				$author$project$OpCode$OpCodeData,
				'PUSH H',
				11,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$push_h))),
			_Utils_Tuple2(
			230,
			A3(
				$author$project$OpCode$OpCodeData,
				'ANI D8',
				7,
				$author$project$OpCode$TwoBytes($author$project$MachineInstructions$ani))),
			_Utils_Tuple2(
			231,
			A3(
				$author$project$OpCode$OpCodeData,
				'RST 4',
				11,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			232,
			A3(
				$author$project$OpCode$OpCodeData,
				'RPE',
				11,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			233,
			A3(
				$author$project$OpCode$OpCodeData,
				'PCHL',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$pchl))),
			_Utils_Tuple2(
			234,
			A3(
				$author$project$OpCode$OpCodeData,
				'JPE adr',
				10,
				$author$project$OpCode$ThreeBytes($author$project$OpCodeTable$unimplementedInstructionTwo))),
			_Utils_Tuple2(
			235,
			A3(
				$author$project$OpCode$OpCodeData,
				'XCHG',
				5,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$xchg))),
			_Utils_Tuple2(
			236,
			A3(
				$author$project$OpCode$OpCodeData,
				'CPE adr',
				17,
				$author$project$OpCode$ThreeBytes($author$project$OpCodeTable$unimplementedInstructionTwo))),
			_Utils_Tuple2(
			237,
			A3(
				$author$project$OpCode$OpCodeData,
				'-',
				0,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unknownInstruction))),
			_Utils_Tuple2(
			238,
			A3(
				$author$project$OpCode$OpCodeData,
				'XRI D8',
				7,
				$author$project$OpCode$TwoBytes($author$project$OpCodeTable$unimplementedInstructionOne))),
			_Utils_Tuple2(
			239,
			A3(
				$author$project$OpCode$OpCodeData,
				'RST 5',
				11,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			240,
			A3(
				$author$project$OpCode$OpCodeData,
				'RP',
				11,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			241,
			A3(
				$author$project$OpCode$OpCodeData,
				'POP PSW',
				10,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$pop_psw))),
			_Utils_Tuple2(
			242,
			A3(
				$author$project$OpCode$OpCodeData,
				'JP adr',
				10,
				$author$project$OpCode$ThreeBytes($author$project$OpCodeTable$unimplementedInstructionTwo))),
			_Utils_Tuple2(
			243,
			A3(
				$author$project$OpCode$OpCodeData,
				'DI',
				4,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			244,
			A3(
				$author$project$OpCode$OpCodeData,
				'CP adr',
				17,
				$author$project$OpCode$ThreeBytes($author$project$OpCodeTable$unimplementedInstructionTwo))),
			_Utils_Tuple2(
			245,
			A3(
				$author$project$OpCode$OpCodeData,
				'PUSH PSW',
				11,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$push_psw))),
			_Utils_Tuple2(
			246,
			A3(
				$author$project$OpCode$OpCodeData,
				'ORI D8',
				7,
				$author$project$OpCode$TwoBytes($author$project$MachineInstructions$ori_d8))),
			_Utils_Tuple2(
			247,
			A3(
				$author$project$OpCode$OpCodeData,
				'RST 6',
				11,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			248,
			A3(
				$author$project$OpCode$OpCodeData,
				'RM',
				11,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			249,
			A3(
				$author$project$OpCode$OpCodeData,
				'SPHL',
				5,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero))),
			_Utils_Tuple2(
			250,
			A3(
				$author$project$OpCode$OpCodeData,
				'JM adr',
				10,
				$author$project$OpCode$ThreeBytes($author$project$OpCodeTable$unimplementedInstructionTwo))),
			_Utils_Tuple2(
			251,
			A3(
				$author$project$OpCode$OpCodeData,
				'EI',
				4,
				$author$project$OpCode$OneByte($author$project$MachineInstructions$ei))),
			_Utils_Tuple2(
			252,
			A3(
				$author$project$OpCode$OpCodeData,
				'CM adr',
				17,
				$author$project$OpCode$ThreeBytes($author$project$OpCodeTable$unimplementedInstructionTwo))),
			_Utils_Tuple2(
			253,
			A3(
				$author$project$OpCode$OpCodeData,
				'-',
				0,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unknownInstruction))),
			_Utils_Tuple2(
			254,
			A3(
				$author$project$OpCode$OpCodeData,
				'CPI D8',
				7,
				$author$project$OpCode$TwoBytes($author$project$MachineInstructions$cpi))),
			_Utils_Tuple2(
			255,
			A3(
				$author$project$OpCode$OpCodeData,
				'RST 7',
				11,
				$author$project$OpCode$OneByte($author$project$OpCodeTable$unimplementedInstructionZero)))
		]));
var $author$project$OpCodeTable$getOpCodeFromTable = function (opCodeByte) {
	return A2(
		$elm$core$Maybe$map,
		function (metaInfo) {
			return A2($author$project$OpCode$OpCode, opCodeByte, metaInfo);
		},
		A2($elm$core$Dict$get, opCodeByte, $author$project$OpCodeTable$opCodeTable));
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$InstructionDisassembler$disassembleOneInstruction = function (state) {
	var _v0 = state.bR;
	if (!_v0.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		return A2(
			$elm$core$Maybe$map,
			function (opCode) {
				return A2($author$project$InstructionDisassembler$applyOpCodeToDisassemblyState, opCode, state);
			},
			A2(
				$elm$core$Maybe$andThen,
				$author$project$OpCodeTable$getOpCodeFromTable,
				$elm$core$List$head(state.bR)));
	}
};
var $author$project$InstructionDisassembler$disassembleToInstructionsRec = function (state) {
	disassembleToInstructionsRec:
	while (true) {
		var disassembledInstruction = $author$project$InstructionDisassembler$disassembleOneInstruction(state);
		if (disassembledInstruction.$ === 1) {
			return state;
		} else {
			var newState = disassembledInstruction.a;
			var $temp$state = newState;
			state = $temp$state;
			continue disassembleToInstructionsRec;
		}
	}
};
var $author$project$InstructionDisassembler$disassembleToInstructions = function (byteCodes) {
	return $author$project$InstructionDisassembler$disassembleToInstructionsRec(
		A3($author$project$InstructionDisassembler$DisassemblyState, 0, byteCodes, _List_Nil)).cd;
};
var $author$project$OpCode$getName = function (opCode) {
	return opCode.cX.dk;
};
var $author$project$Hex$pad2 = $author$project$Hex$toPaddedString(2);
var $author$project$Instruction$instructionToString = function (instruction) {
	var payloadHex = A2($elm$core$List$map, $author$project$Hex$pad2, instruction.ds);
	var payload = A3(
		$elm$core$String$padLeft,
		8,
		' ',
		A2($elm$core$String$join, ' ', payloadHex));
	var instructionName = $author$project$OpCode$getName(instruction.dp);
	var address = $author$project$Hex$padX4(instruction.cK);
	return address + (': ' + (payload + (' -- ' + instructionName)));
};
var $author$project$Main$disassemble = function (data) {
	var decodedFile = $author$project$FileDecoder$decodeFile(data);
	var disassembledFile = $author$project$InstructionDisassembler$disassembleToInstructions(decodedFile);
	return A2(
		$elm$core$String$join,
		'\n',
		A2($elm$core$List$map, $author$project$Instruction$instructionToString, disassembledFile));
};
var $author$project$EmulatorState$CpuState = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (h) {
						return function (l) {
							return function (sp) {
								return function (pc) {
									return function (conditionCodes) {
										return function (intEnable) {
											return function (cycleCount) {
												return {d0: a, d4: b, d7: c, cT: conditionCodes, cV: cycleCount, ee: d, ej: e, es: h, db: intEnable, ez: l, ay: pc, eZ: sp};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$EmulatorState$MachineState = F5(
	function (cpuState, memory, shiftRegister, ports, step) {
		return {K: cpuState, bk: memory, dw: ports, dJ: shiftRegister, cA: step};
	});
var $author$project$EmulatorState$ConditionCodes = F5(
	function (z, s, p, cy, ac) {
		return {d1: ac, ed: cy, eU: p, eX: s, e9: z};
	});
var $author$project$Cpu$initConditionCodes = A5($author$project$EmulatorState$ConditionCodes, false, false, false, false, false);
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{f: nodeList, c: nodeListSize, e: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $author$project$Cpu$initMemory = function (rom) {
	var lengthRom = $elm$core$List$length(rom);
	var paddingAmount = 65535 - lengthRom;
	var padding = A2($elm$core$List$repeat, paddingAmount, 0);
	var memory = $elm$core$List$concat(
		_List_fromArray(
			[rom, padding]));
	return $elm$core$Array$fromList(memory);
};
var $author$project$EmulatorState$Ports = F2(
	function (one, two) {
		return {$7: one, e4: two};
	});
var $author$project$Cpu$initPorts = A2($author$project$EmulatorState$Ports, 14, 8);
var $author$project$EmulatorState$ShiftRegister = F3(
	function (lower, upper, offset) {
		return {eB: lower, eP: offset, e6: upper};
	});
var $author$project$Cpu$initShiftRegister = A3($author$project$EmulatorState$ShiftRegister, 0, 0, 0);
var $author$project$Cpu$init = function (rom) {
	var shiftRegister = $author$project$Cpu$initShiftRegister;
	var ports = $author$project$Cpu$initPorts;
	var memory = $author$project$Cpu$initMemory(rom);
	var conditionCodes = $author$project$Cpu$initConditionCodes;
	return $author$project$EmulatorState$Valid(
		A5(
			$author$project$EmulatorState$MachineState,
			$author$project$EmulatorState$CpuState(0)(0)(0)(0)(0)(0)(0)(65535)(0)(conditionCodes)(false)(0),
			memory,
			shiftRegister,
			ports,
			0));
};
var $author$project$Main$loadDataIntoMemory = F2(
	function (_v0, data) {
		var disassembledProgram = $author$project$Main$disassemble(data);
		var decodedFile = $author$project$FileDecoder$decodeFile(data);
		var initialCpuState = $author$project$Cpu$init(decodedFile);
		return A8(
			$author$project$Main$Model,
			$elm$core$Maybe$Just(data),
			$elm$core$Maybe$Just(disassembledProgram),
			initialCpuState,
			0,
			0,
			0,
			0,
			$author$project$Main$greenScreenHtml);
	});
var $author$project$EmulatorState$AddCycles = function (a) {
	return {$: 11, a: a};
};
var $author$project$Cpu$addCycles = F2(
	function (cycles, machineStateDiff) {
		if (!machineStateDiff.$) {
			return machineStateDiff;
		} else {
			var list = machineStateDiff.a;
			return $author$project$EmulatorState$Events(
				_Utils_ap(
					list,
					_List_fromArray(
						[
							$author$project$EmulatorState$SetCpu(
							$author$project$EmulatorState$AddCycles(cycles))
						])));
		}
	});
var $author$project$Memory$createMemoryProvider = F3(
	function (address, offset, memory) {
		var readValue = A2($elm$core$Array$get, address + offset, memory);
		return function (_v0) {
			if (!readValue.$) {
				var value = readValue.a;
				return $author$project$Memory$Valid(value);
			} else {
				return $author$project$Memory$Invalid(
					'Illegal memory access occurred at ' + $author$project$Hex$padX4(address));
			}
		};
	});
var $author$project$OpCode$getCycles = function (opCode) {
	return opCode.cX.cW;
};
var $author$project$OpCode$illegalMemoryAccess = F2(
	function (message, previousState) {
		return A2(
			$author$project$EmulatorState$Failed,
			$elm$core$Maybe$Just(previousState),
			message);
	});
var $author$project$OpCode$unwrapMemoryAccessThreeBytes = F3(
	function (implThreeBytes, firstAccessResult, secondAccessResult) {
		var _v0 = _Utils_Tuple2(firstAccessResult, secondAccessResult);
		if (!_v0.a.$) {
			if (!_v0.b.$) {
				var firstByteValue = _v0.a.a;
				var secondByteValue = _v0.b.a;
				return A2(implThreeBytes, firstByteValue, secondByteValue);
			} else {
				var message = _v0.b.a;
				return $author$project$OpCode$illegalMemoryAccess(message);
			}
		} else {
			var message = _v0.a.a;
			return $author$project$OpCode$illegalMemoryAccess(message);
		}
	});
var $author$project$OpCode$unwrapMemoryAccessTwoBytes = F2(
	function (implTwoBytes, firstAccessResult) {
		if (!firstAccessResult.$) {
			var byteValue = firstAccessResult.a;
			return implTwoBytes(byteValue);
		} else {
			var message = firstAccessResult.a;
			return $author$project$OpCode$illegalMemoryAccess(message);
		}
	});
var $author$project$OpCode$getImplementation = F3(
	function (opCode, firstValueProvider, secondValueProvider) {
		var opCodeSpec = $author$project$OpCode$getSpec(opCode);
		switch (opCodeSpec.$) {
			case 0:
				var implOneByte = opCodeSpec.a;
				return implOneByte;
			case 1:
				var implTwoBytes = opCodeSpec.a;
				var firstArg = firstValueProvider(0);
				return A2($author$project$OpCode$unwrapMemoryAccessTwoBytes, implTwoBytes, firstArg);
			default:
				var implThreeBytes = opCodeSpec.a;
				var secondArg = secondValueProvider(0);
				var firstArg = firstValueProvider(0);
				return A3($author$project$OpCode$unwrapMemoryAccessThreeBytes, implThreeBytes, firstArg, secondArg);
		}
	});
var $author$project$Cpu$evaluate = F2(
	function (machineState, opCode) {
		var memory = machineState.bk;
		var cycles = $author$project$OpCode$getCycles(opCode);
		var address = machineState.K.ay;
		var firstValueProvider = A3($author$project$Memory$createMemoryProvider, address, 1, memory);
		var secondValueProvider = A3($author$project$Memory$createMemoryProvider, address, 2, memory);
		var implementation = A3($author$project$OpCode$getImplementation, opCode, firstValueProvider, secondValueProvider);
		return A2(
			$author$project$Cpu$addCycles,
			cycles,
			implementation(machineState));
	});
var $author$project$Cpu$getCurrentOpCode = function (machineState) {
	var pc = machineState.K.ay;
	var maybeOpCode = A2($elm$core$Array$get, pc, machineState.bk);
	if (!maybeOpCode.$) {
		var opCode = maybeOpCode.a;
		return opCode;
	} else {
		return 0;
	}
};
var $author$project$Cpu$oneStep = function (cpuState) {
	var opcode = $author$project$Cpu$getCurrentOpCode(cpuState);
	var opCodeFromTable = $author$project$OpCodeTable$getOpCodeFromTable(opcode);
	var machineStateDiff = A2(
		$elm$core$Maybe$withDefault,
		A2(
			$author$project$EmulatorState$Failed,
			$elm$core$Maybe$Just(cpuState),
			'Error while getting OpCode'),
		A2(
			$elm$core$Maybe$map,
			$author$project$Cpu$evaluate(cpuState),
			opCodeFromTable));
	return A2($author$project$Cpu$apply, machineStateDiff, cpuState);
};
var $author$project$Cpu$nStep = F2(
	function (n, machineState) {
		nStep:
		while (true) {
			var ns = $author$project$Cpu$oneStep(machineState);
			if (n > 1) {
				if (!ns.$) {
					var cs = ns.a;
					var $temp$n = n - 1,
						$temp$machineState = cs;
					n = $temp$n;
					machineState = $temp$machineState;
					continue nStep;
				} else {
					return ns;
				}
			} else {
				return ns;
			}
		}
	});
var $author$project$Config$steps_per_clock = 100000;
var $author$project$Config$speed = 2000.0 / ($author$project$Config$steps_per_clock / $author$project$Config$clock);
var $author$project$Config$interrupt_every = $elm$core$Basics$round(33333.0 / $author$project$Config$speed);
var $author$project$Cpu$nStep_withInterrupt = F2(
	function (n, machineState) {
		nStep_withInterrupt:
		while (true) {
			var ns = $author$project$Cpu$oneStep(machineState);
			if (n > 1) {
				if (!ns.$) {
					var cs = ns.a;
					if (!A2($elm$core$Basics$modBy, $author$project$Config$interrupt_every, machineState.cA)) {
						var newNs = $author$project$Cpu$checkForInterrupt(cs);
						if (!newNs.$) {
							var ncs = newNs.a;
							var $temp$n = n - 1,
								$temp$machineState = ncs;
							n = $temp$n;
							machineState = $temp$machineState;
							continue nStep_withInterrupt;
						} else {
							return newNs;
						}
					} else {
						var $temp$n = n - 1,
							$temp$machineState = cs;
						n = $temp$n;
						machineState = $temp$machineState;
						continue nStep_withInterrupt;
					}
				} else {
					return ns;
				}
			} else {
				return ns;
			}
		}
	});
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.e)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.e, tail);
		return (notAppended < 0) ? {
			f: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.f),
			c: builder.c + 1,
			e: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			f: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.f),
			c: builder.c + 1,
			e: $elm$core$Elm$JsArray$empty
		} : {f: builder.f, c: builder.c, e: appended});
	});
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (!node.$) {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						f: _List_Nil,
						c: 0,
						e: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (!_v0.$) {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (!_v0.$) {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $author$project$Memory$readMemorySlice = F3(
	function (startAddress, endAddress, memory) {
		return A3($elm$core$Array$slice, startAddress, endAddress, memory);
	});
var $author$project$Main$readGraphicsMemory = function (emulatorState) {
	if (!emulatorState.$) {
		var machineState = emulatorState.a;
		return $elm$core$Maybe$Just(
			A3($author$project$Memory$readMemorySlice, 9216, 16383, machineState.bk));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $avh4$elm_color$Color$white = A4($avh4$elm_color$Color$RgbaSpace, 255 / 255, 255 / 255, 255 / 255, 1.0);
var $author$project$Graphics$renderPixel = function (pixel) {
	var width = 1;
	var height = 1;
	var _v0 = pixel;
	var y = _v0.a;
	var x = _v0.b;
	var pixelColor = _v0.c;
	var color = function () {
		if (!pixelColor) {
			return $avh4$elm_color$Color$black;
		} else {
			return $avh4$elm_color$Color$white;
		}
	}();
	var position = _Utils_Tuple2(x, y);
	return A2(
		$joakin$elm_canvas$Canvas$shapes,
		_List_fromArray(
			[
				$joakin$elm_canvas$Canvas$Settings$fill(color)
			]),
		_List_fromArray(
			[
				A3($joakin$elm_canvas$Canvas$rect, position, width, height)
			]));
};
var $author$project$Graphics$renderScreen = function (screen) {
	return A2($elm$core$List$map, $author$project$Graphics$renderPixel, screen);
};
var $author$project$Graphics$calculateDisplayIndices = F2(
	function (memoryRowIndex, memoryColumnIndex) {
		var y = memoryRowIndex;
		var x = 255 - memoryColumnIndex;
		return _Utils_Tuple2(x, y);
	});
var $author$project$Graphics$calculateMemoryPixelIndex = F2(
	function (memoryRowIndex, memoryColumnIndex) {
		return (memoryRowIndex * ((256 / 8) | 0)) + ((memoryColumnIndex / 8) | 0);
	});
var $author$project$Graphics$Black = 0;
var $author$project$Graphics$Pixel = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $author$project$Graphics$White = 1;
var $author$project$Graphics$positionToPixel = F4(
	function (displayRowIndex, displayColumnIndex, _byte, offset) {
		var shiftedRowIndex = displayRowIndex - offset;
		var mask = 1 << offset;
		var maskedByte = mask & _byte;
		var isSet = !(!maskedByte);
		var color = isSet ? 1 : 0;
		return A3($author$project$Graphics$Pixel, shiftedRowIndex, displayColumnIndex, color);
	});
var $author$project$Graphics$oneByteToPixel = F3(
	function (displayRowIndex, displayColumnIndex, _byte) {
		var offsets = A2($elm$core$List$range, 0, 7);
		return A2(
			$elm$core$List$map,
			A3($author$project$Graphics$positionToPixel, displayRowIndex, displayColumnIndex, _byte),
			offsets);
	});
var $author$project$Graphics$createSinglePixel = F3(
	function (bytes, memoryRowIndex, memoryColumnIndex) {
		var pixelIndex = A2($author$project$Graphics$calculateMemoryPixelIndex, memoryRowIndex, memoryColumnIndex);
		var _byte = A2($elm$core$Array$get, pixelIndex, bytes);
		var _v0 = A2($author$project$Graphics$calculateDisplayIndices, memoryRowIndex, memoryColumnIndex);
		var displayRowIndex = _v0.a;
		var displayColumnIndex = _v0.b;
		if (!_byte.$) {
			var value = _byte.a;
			return A3($author$project$Graphics$oneByteToPixel, displayRowIndex, displayColumnIndex, value);
		} else {
			return _List_Nil;
		}
	});
var $author$project$Graphics$createPixelRow = F2(
	function (bytes, memoryRowIndex) {
		var memoryColumnIndices = A2(
			$elm$core$List$map,
			function (x) {
				return x * 8;
			},
			A2($elm$core$List$range, 0, 32));
		return A3(
			$elm$core$List$foldl,
			$elm$core$Basics$append,
			_List_Nil,
			A2(
				$elm$core$List$map,
				A2($author$project$Graphics$createSinglePixel, bytes, memoryRowIndex),
				memoryColumnIndices));
	});
var $author$project$Graphics$toPixels = function (bytes) {
	var memoryRowIndices = A2($elm$core$List$range, 0, 224);
	return A3(
		$elm$core$List$foldl,
		$elm$core$Basics$append,
		_List_Nil,
		A2(
			$elm$core$List$map,
			$author$project$Graphics$createPixelRow(bytes),
			memoryRowIndices));
};
var $author$project$Main$toRenderable = function (maybeGraphicsMemory) {
	if (!maybeGraphicsMemory.$) {
		var graphicsMemory = maybeGraphicsMemory.a;
		return $author$project$Graphics$renderScreen(
			$author$project$Graphics$toPixels(graphicsMemory));
	} else {
		return $author$project$Main$greenScreen;
	}
};
var $author$project$Main$screen = function (emulatorState) {
	var width = 256;
	var renderedScreen = $author$project$Main$toRenderable(
		$author$project$Main$readGraphicsMemory(emulatorState));
	var height = 224;
	return A3(
		$joakin$elm_canvas$Canvas$toHtml,
		_Utils_Tuple2(width, height),
		_List_Nil,
		renderedScreen);
};
var $elm$file$File$toBytes = _File_toBytes;
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				return _Utils_Tuple2(
					model,
					A2(
						$elm$file$File$Select$file,
						_List_fromArray(
							['application/any']),
						$author$project$UI$Msg$RomSelected));
			case 1:
				var file = msg.a;
				return _Utils_Tuple2(
					model,
					A2(
						$elm$core$Task$perform,
						$author$project$UI$Msg$RomLoaded,
						$elm$file$File$toBytes(file)));
			case 2:
				var content = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Main$loadDataIntoMemory, model, content),
					$elm$core$Platform$Cmd$none);
			case 3:
				var n = msg.a;
				var _v1 = model.b;
				if (!_v1.$) {
					var currentCpuState = _v1.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								b: A2($author$project$Cpu$nStep, n, currentCpuState)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 6:
				var key = msg.a;
				var _v2 = model.b;
				if (!_v2.$) {
					var currentCpuState = _v2.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								b: A2($author$project$Cpu$keyPressed, key, currentCpuState)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 7:
				var key = msg.a;
				var _v3 = model.b;
				if (!_v3.$) {
					var currentCpuState = _v3.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								b: A2($author$project$Cpu$keyReleased, key, currentCpuState)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 9:
				var _v4 = model.b;
				if (!_v4.$) {
					var currentCpuState = _v4.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								b: $author$project$Cpu$checkForInterrupt(currentCpuState)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 4:
				var posix = msg.a;
				var _v5 = model.b;
				if (!_v5.$) {
					var currentCpuState = _v5.a;
					var lastTicks = model.aB;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								b: A2($author$project$Cpu$nStep, 2000, currentCpuState),
								aB: $elm$time$Time$posixToMillis(posix),
								cG: $elm$time$Time$posixToMillis(posix) - lastTicks,
								b_: $elm$time$Time$posixToMillis(posix) - lastTicks
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 5:
				var posix = msg.a;
				var _v6 = model.b;
				if (!_v6.$) {
					var currentCpuState = _v6.a;
					var lastTicks = model.aB;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								b: A2($author$project$Cpu$nStep_withInterrupt, $author$project$Config$steps_per_clock, currentCpuState),
								aB: $elm$time$Time$posixToMillis(posix),
								cG: $elm$time$Time$posixToMillis(posix) - lastTicks,
								b_: $elm$time$Time$posixToMillis(posix) - lastTicks
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 10:
				var _v7 = model.b;
				if (!_v7.$) {
					var renderedScreen = $author$project$Main$screen(model.b);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{cw: renderedScreen}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 11:
				var _v8 = model.b;
				if (!_v8.$) {
					var currentCpuState = _v8.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								b: $author$project$Cpu$interrupt(currentCpuState)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 8:
				return $author$project$Main$init(0);
			case 12:
				var n = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bn: A2(
								$elm$core$Maybe$withDefault,
								0,
								$elm$core$String$toInt(n))
						}),
					$elm$core$Platform$Cmd$none);
			default:
				var _v9 = model.b;
				if (!_v9.$) {
					var currentCpuState = _v9.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								b: A2($author$project$Cpu$nStep, model.bn, currentCpuState)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$UI$Msg$StepsUpdated = function (a) {
	return {$: 12, a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Attrs = function (a) {
	return {$: 4, a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Button$attrs = function (attrs_) {
	return $rundis$elm_bootstrap$Bootstrap$Internal$Button$Attrs(attrs_);
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 0:
				var size = modifier.a;
				return _Utils_update(
					options,
					{
						eY: $elm$core$Maybe$Just(size)
					});
			case 1:
				var coloring = modifier.a;
				return _Utils_update(
					options,
					{
						E: $elm$core$Maybe$Just(coloring)
					});
			case 2:
				return _Utils_update(
					options,
					{aZ: true});
			case 3:
				var val = modifier.a;
				return _Utils_update(
					options,
					{a5: val});
			default:
				var attrs = modifier.a;
				return _Utils_update(
					options,
					{
						aW: _Utils_ap(options.aW, attrs)
					});
		}
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$defaultOptions = {aW: _List_Nil, aZ: false, E: $elm$core$Maybe$Nothing, a5: false, eY: $elm$core$Maybe$Nothing};
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass = function (role) {
	switch (role) {
		case 0:
			return 'primary';
		case 1:
			return 'secondary';
		case 2:
			return 'success';
		case 3:
			return 'info';
		case 4:
			return 'warning';
		case 5:
			return 'danger';
		case 6:
			return 'dark';
		case 7:
			return 'light';
		default:
			return 'link';
	}
};
var $rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption = function (size) {
	switch (size) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			return $elm$core$Maybe$Just('sm');
		case 2:
			return $elm$core$Maybe$Just('md');
		case 3:
			return $elm$core$Maybe$Just('lg');
		default:
			return $elm$core$Maybe$Just('xl');
	}
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$buttonAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Internal$Button$applyModifier, $rundis$elm_bootstrap$Bootstrap$Internal$Button$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('btn', true),
						_Utils_Tuple2('btn-block', options.aZ),
						_Utils_Tuple2('disabled', options.a5)
					])),
				$elm$html$Html$Attributes$disabled(options.a5)
			]),
		_Utils_ap(
			function () {
				var _v0 = A2($elm$core$Maybe$andThen, $rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption, options.eY);
				if (!_v0.$) {
					var s = _v0.a;
					return _List_fromArray(
						[
							$elm$html$Html$Attributes$class('btn-' + s)
						]);
				} else {
					return _List_Nil;
				}
			}(),
			_Utils_ap(
				function () {
					var _v1 = options.E;
					if (!_v1.$) {
						if (!_v1.a.$) {
							var role = _v1.a.a;
							return _List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									'btn-' + $rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass(role))
								]);
						} else {
							var role = _v1.a.a;
							return _List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									'btn-outline-' + $rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass(role))
								]);
						}
					} else {
						return _List_Nil;
					}
				}(),
				options.aW)));
};
var $rundis$elm_bootstrap$Bootstrap$Button$button = F2(
	function (options, children) {
		return A2(
			$elm$html$Html$button,
			$rundis$elm_bootstrap$Bootstrap$Internal$Button$buttonAttributes(options),
			children);
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Column = function (a) {
	return {$: 0, a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Grid$col = F2(
	function (options, children) {
		return $rundis$elm_bootstrap$Bootstrap$Grid$Column(
			{d9: children, eT: options});
	});
var $elm$html$Html$div = _VirtualDom_node('div');
var $rundis$elm_bootstrap$Bootstrap$Grid$container = F2(
	function (attributes, children) {
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container')
					]),
				attributes),
			children);
	});
var $author$project$Psw$createFlags = function (conditionCodes) {
	var zFlag = conditionCodes.e9 ? 'z' : '.';
	var sFlag = conditionCodes.eX ? 's' : '.';
	var pFlag = conditionCodes.eU ? 'p' : '.';
	var cyFlag = conditionCodes.ed ? '(cy)' : '.';
	var acFlag = conditionCodes.d1 ? '(ac)' : '.';
	return $elm$core$String$concat(
		_List_fromArray(
			[sFlag, zFlag, acFlag, pFlag, cyFlag]));
};
var $author$project$Hex$padX2 = function (x) {
	return $author$project$Hex$prefixX(
		$author$project$Hex$pad2(x));
};
var $author$project$UI$Formatter$displayMemory = F3(
	function (address, offset, memory) {
		var memoryAccessResult = A2($author$project$Memory$readMemory, address + offset, memory);
		if (!memoryAccessResult.$) {
			var byteValue = memoryAccessResult.a;
			return $author$project$Hex$padX2(byteValue);
		} else {
			var message = memoryAccessResult.a;
			return 'ERROR: ' + message;
		}
	});
var $author$project$UI$Formatter$formatRegisters = function (machineState) {
	return _List_fromArray(
		[
			'a:   ' + $author$project$Hex$padX2(machineState.K.d0),
			'b:   ' + $author$project$Hex$padX2(machineState.K.d4),
			'c:   ' + $author$project$Hex$padX2(machineState.K.d7),
			'd:   ' + $author$project$Hex$padX2(machineState.K.ee),
			'e:   ' + $author$project$Hex$padX2(machineState.K.ej),
			'h:   ' + $author$project$Hex$padX2(machineState.K.es),
			'l:   ' + $author$project$Hex$padX2(machineState.K.ez),
			'psw: ' + ($author$project$Hex$padX2(
			$author$project$Psw$createPSW(machineState.K.cT)) + (' flags: ' + $author$project$Psw$createFlags(machineState.K.cT))),
			'sp:  ' + $author$project$Hex$padX4(machineState.K.eZ),
			'pc:  ' + $author$project$Hex$padX4(machineState.K.ay),
			'ie:  ' + $author$project$Hex$padX2(
			$author$project$BitOperations$flagToByte(machineState.K.db)),
			'cycleCount: ' + $elm$core$String$fromInt(machineState.K.cV),
			'step: ' + $elm$core$String$fromInt(machineState.cA),
			'-----------------------',
			'sr l:  ' + $author$project$Hex$padX2(machineState.dJ.eB),
			'sr u:  ' + $author$project$Hex$padX2(machineState.dJ.e6),
			'sr o:  ' + $author$project$Hex$padX2(machineState.dJ.eP),
			'p 1:   ' + $author$project$Hex$padX2(machineState.dw.$7),
			'p 2:   ' + $author$project$Hex$padX2(machineState.dw.e4),
			'-----------------------',
			'sp -1: ' + A3($author$project$UI$Formatter$displayMemory, machineState.K.eZ, -1, machineState.bk),
			'sp 0:  ' + A3($author$project$UI$Formatter$displayMemory, machineState.K.eZ, 0, machineState.bk),
			'sp 1:  ' + A3($author$project$UI$Formatter$displayMemory, machineState.K.eZ, 1, machineState.bk),
			'sp 2:  ' + A3($author$project$UI$Formatter$displayMemory, machineState.K.eZ, 2, machineState.bk),
			'-----------------------',
			'pc -4: ' + A3($author$project$UI$Formatter$displayMemory, machineState.K.ay, -4, machineState.bk),
			'pc -3: ' + A3($author$project$UI$Formatter$displayMemory, machineState.K.ay, -3, machineState.bk),
			'pc -2: ' + A3($author$project$UI$Formatter$displayMemory, machineState.K.ay, -2, machineState.bk),
			'pc -1: ' + A3($author$project$UI$Formatter$displayMemory, machineState.K.ay, -1, machineState.bk),
			'pc 0:  ' + A3($author$project$UI$Formatter$displayMemory, machineState.K.ay, 0, machineState.bk),
			'pc 1:  ' + A3($author$project$UI$Formatter$displayMemory, machineState.K.ay, 1, machineState.bk),
			'pc 2:  ' + A3($author$project$UI$Formatter$displayMemory, machineState.K.ay, 2, machineState.bk),
			'pc 3:  ' + A3($author$project$UI$Formatter$displayMemory, machineState.K.ay, 3, machineState.bk),
			'pc 4:  ' + A3($author$project$UI$Formatter$displayMemory, machineState.K.ay, 4, machineState.bk),
			'-----------------------'
		]);
};
var $author$project$UI$Formatter$formatCpuState = function (cpuState) {
	return A2(
		$elm$core$String$join,
		'\n',
		$author$project$UI$Formatter$formatRegisters(cpuState));
};
var $author$project$UI$Formatter$cpustate = function (state) {
	if (state.$ === 1) {
		if (state.a.$ === 1) {
			var _v1 = state.a;
			var string = state.b;
			return 'ERROR:' + ('\n' + (string + ('\n\n' + 'No last known CPU state')));
		} else {
			var cpuState = state.a.a;
			var string = state.b;
			return 'ERROR:' + ('\n' + (string + ('\n\n' + ('Last known CPU state:' + ('\n' + $author$project$UI$Formatter$formatCpuState(cpuState))))));
		}
	} else {
		var cpuState = state.a;
		return $author$project$UI$Formatter$formatCpuState(cpuState);
	}
};
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Id = function (a) {
	return {$: 1, a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$id = function (id_) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Input$Id(id_);
};
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$OnInput = function (a) {
	return {$: 5, a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$onInput = function (toMsg) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Input$OnInput(toMsg);
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring = function (a) {
	return {$: 1, a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Danger = 5;
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Outlined = function (a) {
	return {$: 1, a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Button$outlineDanger = $rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring(
	$rundis$elm_bootstrap$Bootstrap$Internal$Button$Outlined(5));
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Primary = 0;
var $rundis$elm_bootstrap$Bootstrap$Button$outlinePrimary = $rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring(
	$rundis$elm_bootstrap$Bootstrap$Internal$Button$Outlined(0));
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Success = 2;
var $rundis$elm_bootstrap$Bootstrap$Button$outlineSuccess = $rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring(
	$rundis$elm_bootstrap$Bootstrap$Internal$Button$Outlined(2));
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Main$pageHeader = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h1,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Elmulator '),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('lead')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('A 8080 Emulator written in Elm')
						]))
				]))
		]));
var $elm$html$Html$pre = _VirtualDom_node('pre');
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$Col = 0;
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$Width = F2(
	function (screenSize, columnCount) {
		return {cS: columnCount, dI: screenSize};
	});
var $rundis$elm_bootstrap$Bootstrap$General$Internal$XS = 0;
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColAlign = F2(
	function (align_, options) {
		var _v0 = align_.dI;
		switch (_v0) {
			case 0:
				return _Utils_update(
					options,
					{
						aT: $elm$core$Maybe$Just(align_)
					});
			case 1:
				return _Utils_update(
					options,
					{
						aR: $elm$core$Maybe$Just(align_)
					});
			case 2:
				return _Utils_update(
					options,
					{
						aQ: $elm$core$Maybe$Just(align_)
					});
			case 3:
				return _Utils_update(
					options,
					{
						aP: $elm$core$Maybe$Just(align_)
					});
			default:
				return _Utils_update(
					options,
					{
						aS: $elm$core$Maybe$Just(align_)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColOffset = F2(
	function (offset_, options) {
		var _v0 = offset_.dI;
		switch (_v0) {
			case 0:
				return _Utils_update(
					options,
					{
						bt: $elm$core$Maybe$Just(offset_)
					});
			case 1:
				return _Utils_update(
					options,
					{
						bq: $elm$core$Maybe$Just(offset_)
					});
			case 2:
				return _Utils_update(
					options,
					{
						bp: $elm$core$Maybe$Just(offset_)
					});
			case 3:
				return _Utils_update(
					options,
					{
						bo: $elm$core$Maybe$Just(offset_)
					});
			default:
				return _Utils_update(
					options,
					{
						bs: $elm$core$Maybe$Just(offset_)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColOrder = F2(
	function (order_, options) {
		var _v0 = order_.dI;
		switch (_v0) {
			case 0:
				return _Utils_update(
					options,
					{
						bD: $elm$core$Maybe$Just(order_)
					});
			case 1:
				return _Utils_update(
					options,
					{
						bB: $elm$core$Maybe$Just(order_)
					});
			case 2:
				return _Utils_update(
					options,
					{
						bA: $elm$core$Maybe$Just(order_)
					});
			case 3:
				return _Utils_update(
					options,
					{
						bz: $elm$core$Maybe$Just(order_)
					});
			default:
				return _Utils_update(
					options,
					{
						bC: $elm$core$Maybe$Just(order_)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColPull = F2(
	function (pull_, options) {
		var _v0 = pull_.dI;
		switch (_v0) {
			case 0:
				return _Utils_update(
					options,
					{
						bK: $elm$core$Maybe$Just(pull_)
					});
			case 1:
				return _Utils_update(
					options,
					{
						bI: $elm$core$Maybe$Just(pull_)
					});
			case 2:
				return _Utils_update(
					options,
					{
						bH: $elm$core$Maybe$Just(pull_)
					});
			case 3:
				return _Utils_update(
					options,
					{
						bG: $elm$core$Maybe$Just(pull_)
					});
			default:
				return _Utils_update(
					options,
					{
						bJ: $elm$core$Maybe$Just(pull_)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColPush = F2(
	function (push_, options) {
		var _v0 = push_.dI;
		switch (_v0) {
			case 0:
				return _Utils_update(
					options,
					{
						bP: $elm$core$Maybe$Just(push_)
					});
			case 1:
				return _Utils_update(
					options,
					{
						bN: $elm$core$Maybe$Just(push_)
					});
			case 2:
				return _Utils_update(
					options,
					{
						bM: $elm$core$Maybe$Just(push_)
					});
			case 3:
				return _Utils_update(
					options,
					{
						bL: $elm$core$Maybe$Just(push_)
					});
			default:
				return _Utils_update(
					options,
					{
						bO: $elm$core$Maybe$Just(push_)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColWidth = F2(
	function (width_, options) {
		var _v0 = width_.dI;
		switch (_v0) {
			case 0:
				return _Utils_update(
					options,
					{
						aK: $elm$core$Maybe$Just(width_)
					});
			case 1:
				return _Utils_update(
					options,
					{
						aI: $elm$core$Maybe$Just(width_)
					});
			case 2:
				return _Utils_update(
					options,
					{
						aH: $elm$core$Maybe$Just(width_)
					});
			case 3:
				return _Utils_update(
					options,
					{
						aG: $elm$core$Maybe$Just(width_)
					});
			default:
				return _Utils_update(
					options,
					{
						aJ: $elm$core$Maybe$Just(width_)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColOption = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 6:
				var attrs = modifier.a;
				return _Utils_update(
					options,
					{
						aW: _Utils_ap(options.aW, attrs)
					});
			case 0:
				var width_ = modifier.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColWidth, width_, options);
			case 1:
				var offset_ = modifier.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColOffset, offset_, options);
			case 2:
				var pull_ = modifier.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColPull, pull_, options);
			case 3:
				var push_ = modifier.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColPush, push_, options);
			case 4:
				var order_ = modifier.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColOrder, order_, options);
			case 5:
				var align = modifier.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColAlign, align, options);
			default:
				var align = modifier.a;
				return _Utils_update(
					options,
					{
						bZ: $elm$core$Maybe$Just(align)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$columnCountOption = function (size) {
	switch (size) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			return $elm$core$Maybe$Just('1');
		case 2:
			return $elm$core$Maybe$Just('2');
		case 3:
			return $elm$core$Maybe$Just('3');
		case 4:
			return $elm$core$Maybe$Just('4');
		case 5:
			return $elm$core$Maybe$Just('5');
		case 6:
			return $elm$core$Maybe$Just('6');
		case 7:
			return $elm$core$Maybe$Just('7');
		case 8:
			return $elm$core$Maybe$Just('8');
		case 9:
			return $elm$core$Maybe$Just('9');
		case 10:
			return $elm$core$Maybe$Just('10');
		case 11:
			return $elm$core$Maybe$Just('11');
		case 12:
			return $elm$core$Maybe$Just('12');
		default:
			return $elm$core$Maybe$Just('auto');
	}
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$colWidthClass = function (_v0) {
	var screenSize = _v0.dI;
	var columnCount = _v0.cS;
	return $elm$html$Html$Attributes$class(
		'col' + (A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				function (v) {
					return '-' + v;
				},
				$rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(screenSize))) + A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				function (v) {
					return '-' + v;
				},
				$rundis$elm_bootstrap$Bootstrap$Grid$Internal$columnCountOption(columnCount)))));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$colWidthsToAttributes = function (widths) {
	var width_ = function (w) {
		return A2($elm$core$Maybe$map, $rundis$elm_bootstrap$Bootstrap$Grid$Internal$colWidthClass, w);
	};
	return A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2($elm$core$List$map, width_, widths));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$defaultColOptions = {aP: $elm$core$Maybe$Nothing, aQ: $elm$core$Maybe$Nothing, aR: $elm$core$Maybe$Nothing, aS: $elm$core$Maybe$Nothing, aT: $elm$core$Maybe$Nothing, aW: _List_Nil, bo: $elm$core$Maybe$Nothing, bp: $elm$core$Maybe$Nothing, bq: $elm$core$Maybe$Nothing, bs: $elm$core$Maybe$Nothing, bt: $elm$core$Maybe$Nothing, bz: $elm$core$Maybe$Nothing, bA: $elm$core$Maybe$Nothing, bB: $elm$core$Maybe$Nothing, bC: $elm$core$Maybe$Nothing, bD: $elm$core$Maybe$Nothing, bG: $elm$core$Maybe$Nothing, bH: $elm$core$Maybe$Nothing, bI: $elm$core$Maybe$Nothing, bJ: $elm$core$Maybe$Nothing, bK: $elm$core$Maybe$Nothing, bL: $elm$core$Maybe$Nothing, bM: $elm$core$Maybe$Nothing, bN: $elm$core$Maybe$Nothing, bO: $elm$core$Maybe$Nothing, bP: $elm$core$Maybe$Nothing, bZ: $elm$core$Maybe$Nothing, aG: $elm$core$Maybe$Nothing, aH: $elm$core$Maybe$Nothing, aI: $elm$core$Maybe$Nothing, aJ: $elm$core$Maybe$Nothing, aK: $elm$core$Maybe$Nothing};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$offsetCountOption = function (size) {
	switch (size) {
		case 0:
			return '0';
		case 1:
			return '1';
		case 2:
			return '2';
		case 3:
			return '3';
		case 4:
			return '4';
		case 5:
			return '5';
		case 6:
			return '6';
		case 7:
			return '7';
		case 8:
			return '8';
		case 9:
			return '9';
		case 10:
			return '10';
		default:
			return '11';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$screenSizeToPartialString = function (screenSize) {
	var _v0 = $rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(screenSize);
	if (!_v0.$) {
		var s = _v0.a;
		return '-' + (s + '-');
	} else {
		return '-';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$offsetClass = function (_v0) {
	var screenSize = _v0.dI;
	var offsetCount = _v0.dn;
	return $elm$html$Html$Attributes$class(
		'offset' + ($rundis$elm_bootstrap$Bootstrap$Grid$Internal$screenSizeToPartialString(screenSize) + $rundis$elm_bootstrap$Bootstrap$Grid$Internal$offsetCountOption(offsetCount)));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$offsetsToAttributes = function (offsets) {
	var offset_ = function (m) {
		return A2($elm$core$Maybe$map, $rundis$elm_bootstrap$Bootstrap$Grid$Internal$offsetClass, m);
	};
	return A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2($elm$core$List$map, offset_, offsets));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$orderColOption = function (size) {
	switch (size) {
		case 0:
			return 'first';
		case 1:
			return '1';
		case 2:
			return '2';
		case 3:
			return '3';
		case 4:
			return '4';
		case 5:
			return '5';
		case 6:
			return '6';
		case 7:
			return '7';
		case 8:
			return '8';
		case 9:
			return '9';
		case 10:
			return '10';
		case 11:
			return '11';
		case 12:
			return '12';
		default:
			return 'last';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$orderToAttributes = function (orders) {
	var order_ = function (m) {
		if (!m.$) {
			var screenSize = m.a.dI;
			var moveCount = m.a.ae;
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class(
					'order' + ($rundis$elm_bootstrap$Bootstrap$Grid$Internal$screenSizeToPartialString(screenSize) + $rundis$elm_bootstrap$Bootstrap$Grid$Internal$orderColOption(moveCount))));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	return A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2($elm$core$List$map, order_, orders));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$moveCountOption = function (size) {
	switch (size) {
		case 0:
			return '0';
		case 1:
			return '1';
		case 2:
			return '2';
		case 3:
			return '3';
		case 4:
			return '4';
		case 5:
			return '5';
		case 6:
			return '6';
		case 7:
			return '7';
		case 8:
			return '8';
		case 9:
			return '9';
		case 10:
			return '10';
		case 11:
			return '11';
		default:
			return '12';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$pullsToAttributes = function (pulls) {
	var pull_ = function (m) {
		if (!m.$) {
			var screenSize = m.a.dI;
			var moveCount = m.a.ae;
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class(
					'pull' + ($rundis$elm_bootstrap$Bootstrap$Grid$Internal$screenSizeToPartialString(screenSize) + $rundis$elm_bootstrap$Bootstrap$Grid$Internal$moveCountOption(moveCount))));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	return A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2($elm$core$List$map, pull_, pulls));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$pushesToAttributes = function (pushes) {
	var push_ = function (m) {
		if (!m.$) {
			var screenSize = m.a.dI;
			var moveCount = m.a.ae;
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class(
					'push' + ($rundis$elm_bootstrap$Bootstrap$Grid$Internal$screenSizeToPartialString(screenSize) + $rundis$elm_bootstrap$Bootstrap$Grid$Internal$moveCountOption(moveCount))));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	return A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2($elm$core$List$map, push_, pushes));
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignDirOption = function (dir) {
	switch (dir) {
		case 1:
			return 'center';
		case 0:
			return 'left';
		default:
			return 'right';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignClass = function (_v0) {
	var dir = _v0.c_;
	var size = _v0.eY;
	return $elm$html$Html$Attributes$class(
		'text' + (A2(
			$elm$core$Maybe$withDefault,
			'-',
			A2(
				$elm$core$Maybe$map,
				function (s) {
					return '-' + (s + '-');
				},
				$rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(size))) + $rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignDirOption(dir)));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$verticalAlignOption = function (align) {
	switch (align) {
		case 0:
			return 'start';
		case 1:
			return 'center';
		default:
			return 'end';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$vAlignClass = F2(
	function (prefix, _v0) {
		var align = _v0.cL;
		var screenSize = _v0.dI;
		return $elm$html$Html$Attributes$class(
			_Utils_ap(
				prefix,
				_Utils_ap(
					A2(
						$elm$core$Maybe$withDefault,
						'',
						A2(
							$elm$core$Maybe$map,
							function (v) {
								return v + '-';
							},
							$rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(screenSize))),
					$rundis$elm_bootstrap$Bootstrap$Grid$Internal$verticalAlignOption(align))));
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$vAlignsToAttributes = F2(
	function (prefix, aligns) {
		var align = function (a) {
			return A2(
				$elm$core$Maybe$map,
				$rundis$elm_bootstrap$Bootstrap$Grid$Internal$vAlignClass(prefix),
				a);
		};
		return A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			A2($elm$core$List$map, align, aligns));
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$colAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyColOption, $rundis$elm_bootstrap$Bootstrap$Grid$Internal$defaultColOptions, modifiers);
	var shouldAddDefaultXs = !$elm$core$List$length(
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[options.aK, options.aI, options.aH, options.aG, options.aJ])));
	return _Utils_ap(
		$rundis$elm_bootstrap$Bootstrap$Grid$Internal$colWidthsToAttributes(
			_List_fromArray(
				[
					shouldAddDefaultXs ? $elm$core$Maybe$Just(
					A2($rundis$elm_bootstrap$Bootstrap$Grid$Internal$Width, 0, 0)) : options.aK,
					options.aI,
					options.aH,
					options.aG,
					options.aJ
				])),
		_Utils_ap(
			$rundis$elm_bootstrap$Bootstrap$Grid$Internal$offsetsToAttributes(
				_List_fromArray(
					[options.bt, options.bq, options.bp, options.bo, options.bs])),
			_Utils_ap(
				$rundis$elm_bootstrap$Bootstrap$Grid$Internal$pullsToAttributes(
					_List_fromArray(
						[options.bK, options.bI, options.bH, options.bG, options.bJ])),
				_Utils_ap(
					$rundis$elm_bootstrap$Bootstrap$Grid$Internal$pushesToAttributes(
						_List_fromArray(
							[options.bP, options.bN, options.bM, options.bL, options.bO])),
					_Utils_ap(
						$rundis$elm_bootstrap$Bootstrap$Grid$Internal$orderToAttributes(
							_List_fromArray(
								[options.bD, options.bB, options.bA, options.bz, options.bC])),
						_Utils_ap(
							A2(
								$rundis$elm_bootstrap$Bootstrap$Grid$Internal$vAlignsToAttributes,
								'align-self-',
								_List_fromArray(
									[options.aT, options.aR, options.aQ, options.aP, options.aS])),
							_Utils_ap(
								function () {
									var _v0 = options.bZ;
									if (!_v0.$) {
										var a = _v0.a;
										return _List_fromArray(
											[
												$rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignClass(a)
											]);
									} else {
										return _List_Nil;
									}
								}(),
								options.aW)))))));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$renderCol = function (column) {
	switch (column.$) {
		case 0:
			var options = column.a.eT;
			var children = column.a.d9;
			return A2(
				$elm$html$Html$div,
				$rundis$elm_bootstrap$Bootstrap$Grid$Internal$colAttributes(options),
				children);
		case 1:
			var e = column.a;
			return e;
		default:
			var options = column.a.eT;
			var children = column.a.d9;
			return A3(
				$elm$html$Html$Keyed$node,
				'div',
				$rundis$elm_bootstrap$Bootstrap$Grid$Internal$colAttributes(options),
				children);
	}
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyRowHAlign = F2(
	function (align, options) {
		var _v0 = align.dI;
		switch (_v0) {
			case 0:
				return _Utils_update(
					options,
					{
						bb: $elm$core$Maybe$Just(align)
					});
			case 1:
				return _Utils_update(
					options,
					{
						a9: $elm$core$Maybe$Just(align)
					});
			case 2:
				return _Utils_update(
					options,
					{
						a8: $elm$core$Maybe$Just(align)
					});
			case 3:
				return _Utils_update(
					options,
					{
						a7: $elm$core$Maybe$Just(align)
					});
			default:
				return _Utils_update(
					options,
					{
						ba: $elm$core$Maybe$Just(align)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyRowVAlign = F2(
	function (align_, options) {
		var _v0 = align_.dI;
		switch (_v0) {
			case 0:
				return _Utils_update(
					options,
					{
						b6: $elm$core$Maybe$Just(align_)
					});
			case 1:
				return _Utils_update(
					options,
					{
						b4: $elm$core$Maybe$Just(align_)
					});
			case 2:
				return _Utils_update(
					options,
					{
						b3: $elm$core$Maybe$Just(align_)
					});
			case 3:
				return _Utils_update(
					options,
					{
						b2: $elm$core$Maybe$Just(align_)
					});
			default:
				return _Utils_update(
					options,
					{
						b5: $elm$core$Maybe$Just(align_)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyRowOption = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 2:
				var attrs = modifier.a;
				return _Utils_update(
					options,
					{
						aW: _Utils_ap(options.aW, attrs)
					});
			case 0:
				var align = modifier.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyRowVAlign, align, options);
			default:
				var align = modifier.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyRowHAlign, align, options);
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$defaultRowOptions = {aW: _List_Nil, a7: $elm$core$Maybe$Nothing, a8: $elm$core$Maybe$Nothing, a9: $elm$core$Maybe$Nothing, ba: $elm$core$Maybe$Nothing, bb: $elm$core$Maybe$Nothing, b2: $elm$core$Maybe$Nothing, b3: $elm$core$Maybe$Nothing, b4: $elm$core$Maybe$Nothing, b5: $elm$core$Maybe$Nothing, b6: $elm$core$Maybe$Nothing};
var $rundis$elm_bootstrap$Bootstrap$General$Internal$horizontalAlignOption = function (align) {
	switch (align) {
		case 0:
			return 'start';
		case 1:
			return 'center';
		case 2:
			return 'end';
		case 3:
			return 'around';
		default:
			return 'between';
	}
};
var $rundis$elm_bootstrap$Bootstrap$General$Internal$hAlignClass = function (_v0) {
	var align = _v0.cL;
	var screenSize = _v0.dI;
	return $elm$html$Html$Attributes$class(
		'justify-content-' + (A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$elm$core$Maybe$map,
				function (v) {
					return v + '-';
				},
				$rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(screenSize))) + $rundis$elm_bootstrap$Bootstrap$General$Internal$horizontalAlignOption(align)));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$hAlignsToAttributes = function (aligns) {
	var align = function (a) {
		return A2($elm$core$Maybe$map, $rundis$elm_bootstrap$Bootstrap$General$Internal$hAlignClass, a);
	};
	return A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2($elm$core$List$map, align, aligns));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$Internal$rowAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Grid$Internal$applyRowOption, $rundis$elm_bootstrap$Bootstrap$Grid$Internal$defaultRowOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('row')
			]),
		_Utils_ap(
			A2(
				$rundis$elm_bootstrap$Bootstrap$Grid$Internal$vAlignsToAttributes,
				'align-items-',
				_List_fromArray(
					[options.b6, options.b4, options.b3, options.b2, options.b5])),
			_Utils_ap(
				$rundis$elm_bootstrap$Bootstrap$Grid$Internal$hAlignsToAttributes(
					_List_fromArray(
						[options.bb, options.a9, options.a8, options.a7, options.ba])),
				options.aW)));
};
var $rundis$elm_bootstrap$Bootstrap$Grid$row = F2(
	function (options, cols) {
		return A2(
			$elm$html$Html$div,
			$rundis$elm_bootstrap$Bootstrap$Grid$Internal$rowAttributes(options),
			A2($elm$core$List$map, $rundis$elm_bootstrap$Bootstrap$Grid$renderCol, cols));
	});
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $elm$html$Html$Attributes$rel = _VirtualDom_attribute('rel');
var $rundis$elm_bootstrap$Bootstrap$CDN$stylesheet = A3(
	$elm$html$Html$node,
	'link',
	_List_fromArray(
		[
			$elm$html$Html$Attributes$rel('stylesheet'),
			$elm$html$Html$Attributes$href('https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css')
		]),
	_List_Nil);
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Text = 0;
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Input = $elm$core$Basics$identity;
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Type = function (a) {
	return {$: 2, a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$create = F2(
	function (tipe, options) {
		return {
			eT: A2(
				$elm$core$List$cons,
				$rundis$elm_bootstrap$Bootstrap$Form$Input$Type(tipe),
				options)
		};
	});
var $elm$html$Html$input = _VirtualDom_node('input');
var $rundis$elm_bootstrap$Bootstrap$Form$Input$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 0:
				var size_ = modifier.a;
				return _Utils_update(
					options,
					{
						eY: $elm$core$Maybe$Just(size_)
					});
			case 1:
				var id_ = modifier.a;
				return _Utils_update(
					options,
					{
						an: $elm$core$Maybe$Just(id_)
					});
			case 2:
				var tipe = modifier.a;
				return _Utils_update(
					options,
					{aC: tipe});
			case 3:
				var val = modifier.a;
				return _Utils_update(
					options,
					{a5: val});
			case 4:
				var value_ = modifier.a;
				return _Utils_update(
					options,
					{
						B: $elm$core$Maybe$Just(value_)
					});
			case 7:
				var value_ = modifier.a;
				return _Utils_update(
					options,
					{
						bF: $elm$core$Maybe$Just(value_)
					});
			case 5:
				var onInput_ = modifier.a;
				return _Utils_update(
					options,
					{
						bx: $elm$core$Maybe$Just(onInput_)
					});
			case 6:
				var validation_ = modifier.a;
				return _Utils_update(
					options,
					{
						b7: $elm$core$Maybe$Just(validation_)
					});
			case 8:
				var val = modifier.a;
				return _Utils_update(
					options,
					{bQ: val});
			case 9:
				var val = modifier.a;
				return _Utils_update(
					options,
					{az: val});
			default:
				var attrs_ = modifier.a;
				return _Utils_update(
					options,
					{
						aW: _Utils_ap(options.aW, attrs_)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Input$defaultOptions = {aW: _List_Nil, a5: false, an: $elm$core$Maybe$Nothing, bx: $elm$core$Maybe$Nothing, bF: $elm$core$Maybe$Nothing, az: false, bQ: false, eY: $elm$core$Maybe$Nothing, aC: 0, b7: $elm$core$Maybe$Nothing, B: $elm$core$Maybe$Nothing};
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$Attributes$readonly = $elm$html$Html$Attributes$boolProperty('readOnly');
var $rundis$elm_bootstrap$Bootstrap$Form$Input$sizeAttribute = function (size) {
	return A2(
		$elm$core$Maybe$map,
		function (s) {
			return $elm$html$Html$Attributes$class('form-control-' + s);
		},
		$rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(size));
};
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $rundis$elm_bootstrap$Bootstrap$Form$Input$typeAttribute = function (inputType) {
	return $elm$html$Html$Attributes$type_(
		function () {
			switch (inputType) {
				case 0:
					return 'text';
				case 1:
					return 'password';
				case 2:
					return 'datetime-local';
				case 3:
					return 'date';
				case 4:
					return 'month';
				case 5:
					return 'time';
				case 6:
					return 'week';
				case 7:
					return 'number';
				case 8:
					return 'email';
				case 9:
					return 'url';
				case 10:
					return 'search';
				case 11:
					return 'tel';
				default:
					return 'color';
			}
		}());
};
var $rundis$elm_bootstrap$Bootstrap$Form$FormInternal$validationToString = function (validation) {
	if (!validation) {
		return 'is-valid';
	} else {
		return 'is-invalid';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$validationAttribute = function (validation) {
	return $elm$html$Html$Attributes$class(
		$rundis$elm_bootstrap$Bootstrap$Form$FormInternal$validationToString(validation));
};
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $rundis$elm_bootstrap$Bootstrap$Form$Input$toAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Form$Input$applyModifier, $rundis$elm_bootstrap$Bootstrap$Form$Input$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				options.az ? 'form-control-plaintext' : 'form-control'),
				$elm$html$Html$Attributes$disabled(options.a5),
				$elm$html$Html$Attributes$readonly(options.bQ || options.az),
				$rundis$elm_bootstrap$Bootstrap$Form$Input$typeAttribute(options.aC)
			]),
		_Utils_ap(
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2($elm$core$Maybe$map, $elm$html$Html$Attributes$id, options.an),
						A2($elm$core$Maybe$andThen, $rundis$elm_bootstrap$Bootstrap$Form$Input$sizeAttribute, options.eY),
						A2($elm$core$Maybe$map, $elm$html$Html$Attributes$value, options.B),
						A2($elm$core$Maybe$map, $elm$html$Html$Attributes$placeholder, options.bF),
						A2($elm$core$Maybe$map, $elm$html$Html$Events$onInput, options.bx),
						A2($elm$core$Maybe$map, $rundis$elm_bootstrap$Bootstrap$Form$Input$validationAttribute, options.b7)
					])),
			options.aW));
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$view = function (_v0) {
	var options = _v0.eT;
	return A2(
		$elm$html$Html$input,
		$rundis$elm_bootstrap$Bootstrap$Form$Input$toAttributes(options),
		_List_Nil);
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$input = F2(
	function (tipe, options) {
		return $rundis$elm_bootstrap$Bootstrap$Form$Input$view(
			A2($rundis$elm_bootstrap$Bootstrap$Form$Input$create, tipe, options));
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Input$text = $rundis$elm_bootstrap$Bootstrap$Form$Input$input(0);
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Value = function (a) {
	return {$: 4, a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$value = function (value_) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Input$Value(value_);
};
var $author$project$Main$view = function (model) {
	var _v0 = model.cX;
	if (_v0.$ === 1) {
		return A2(
			$rundis$elm_bootstrap$Bootstrap$Grid$container,
			_List_Nil,
			_List_fromArray(
				[
					$rundis$elm_bootstrap$Bootstrap$CDN$stylesheet,
					$author$project$Main$pageHeader,
					A2(
					$rundis$elm_bootstrap$Bootstrap$Grid$row,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rundis$elm_bootstrap$Bootstrap$Grid$col,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$rundis$elm_bootstrap$Bootstrap$Button$button,
									_List_fromArray(
										[
											$rundis$elm_bootstrap$Bootstrap$Button$outlineSuccess,
											$rundis$elm_bootstrap$Bootstrap$Button$attrs(
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick($author$project$UI$Msg$RomRequested)
												]))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('(l)oad rom')
										]))
								]))
						]))
				]));
	} else {
		return A2(
			$rundis$elm_bootstrap$Bootstrap$Grid$container,
			_List_Nil,
			_List_fromArray(
				[
					$rundis$elm_bootstrap$Bootstrap$CDN$stylesheet,
					$author$project$Main$pageHeader,
					A2(
					$rundis$elm_bootstrap$Bootstrap$Button$button,
					_List_fromArray(
						[
							$rundis$elm_bootstrap$Bootstrap$Button$outlinePrimary,
							$rundis$elm_bootstrap$Bootstrap$Button$attrs(
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$UI$Msg$NextStepsRequested(1))
								]))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('(n)ext step')
						])),
					$elm$html$Html$text('   '),
					$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
					_List_fromArray(
						[
							$rundis$elm_bootstrap$Bootstrap$Form$Input$id('steps'),
							$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput($author$project$UI$Msg$StepsUpdated),
							$rundis$elm_bootstrap$Bootstrap$Form$Input$value(
							$elm$core$String$fromInt(model.bn))
						])),
					A2(
					$rundis$elm_bootstrap$Bootstrap$Button$button,
					_List_fromArray(
						[
							$rundis$elm_bootstrap$Bootstrap$Button$outlinePrimary,
							$rundis$elm_bootstrap$Bootstrap$Button$attrs(
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick($author$project$UI$Msg$StepsSubmitted)
								]))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('n(e)xt n steps')
						])),
					$elm$html$Html$text('   '),
					A2(
					$rundis$elm_bootstrap$Bootstrap$Button$button,
					_List_fromArray(
						[
							$rundis$elm_bootstrap$Bootstrap$Button$outlinePrimary,
							$rundis$elm_bootstrap$Bootstrap$Button$attrs(
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$UI$Msg$NextStepsRequested(20000))
								]))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('ne(x)t 20000 steps')
						])),
					$elm$html$Html$text('   '),
					A2(
					$rundis$elm_bootstrap$Bootstrap$Button$button,
					_List_fromArray(
						[
							$rundis$elm_bootstrap$Bootstrap$Button$outlinePrimary,
							$rundis$elm_bootstrap$Bootstrap$Button$attrs(
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick($author$project$UI$Msg$InterruptRequested)
								]))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('(i)nterrupt')
						])),
					$elm$html$Html$text('   '),
					A2(
					$rundis$elm_bootstrap$Bootstrap$Button$button,
					_List_fromArray(
						[
							$rundis$elm_bootstrap$Bootstrap$Button$outlineDanger,
							$rundis$elm_bootstrap$Bootstrap$Button$attrs(
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick($author$project$UI$Msg$Reset)
								]))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('(r)eset')
						])),
					A2(
					$rundis$elm_bootstrap$Bootstrap$Grid$row,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rundis$elm_bootstrap$Bootstrap$Grid$col,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h3,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Screen')
										])),
									model.cw
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Grid$col,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h3,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Machine State')
										])),
									A2(
									$elm$html$Html$pre,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$UI$Formatter$cpustate(model.b))
										])),
									A2(
									$elm$html$Html$pre,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											'speed: ' + ($elm$core$String$fromFloat($author$project$Config$speed) + ' ms for 1ms'))
										])),
									A2(
									$elm$html$Html$pre,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											'clock diff: ' + ($elm$core$String$fromFloat(model.b_ - $author$project$Config$clock) + ' ms'))
										]))
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Grid$col,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h3,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Code')
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('code-wrapper')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$pre,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													A2($elm$core$Maybe$withDefault, '', model.c$))
												]))
										]))
								]))
						]))
				]));
	}
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{ey: $author$project$Main$init, e0: $author$project$Main$subscriptions, e5: $author$project$Main$update, e7: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));