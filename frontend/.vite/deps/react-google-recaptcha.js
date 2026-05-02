import { r as __toESM, t as __commonJSMin } from "./chunk-CYJPkc-J.js";
import { t as require_react } from "./react.js";
//#region node_modules/prop-types/node_modules/react-is/cjs/react-is.development.js
/** @license React v16.13.1
* react-is.development.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_is_development$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	(function() {
		"use strict";
		var hasSymbol = typeof Symbol === "function" && Symbol.for;
		var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for("react.element") : 60103;
		var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for("react.portal") : 60106;
		var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for("react.fragment") : 60107;
		var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for("react.strict_mode") : 60108;
		var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for("react.profiler") : 60114;
		var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for("react.provider") : 60109;
		var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for("react.context") : 60110;
		var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for("react.async_mode") : 60111;
		var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for("react.concurrent_mode") : 60111;
		var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for("react.forward_ref") : 60112;
		var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for("react.suspense") : 60113;
		var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for("react.suspense_list") : 60120;
		var REACT_MEMO_TYPE = hasSymbol ? Symbol.for("react.memo") : 60115;
		var REACT_LAZY_TYPE = hasSymbol ? Symbol.for("react.lazy") : 60116;
		var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for("react.block") : 60121;
		var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for("react.fundamental") : 60117;
		var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for("react.responder") : 60118;
		var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for("react.scope") : 60119;
		function isValidElementType(type) {
			return typeof type === "string" || typeof type === "function" || type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
		}
		function typeOf(object) {
			if (typeof object === "object" && object !== null) {
				var $$typeof = object.$$typeof;
				switch ($$typeof) {
					case REACT_ELEMENT_TYPE:
						var type = object.type;
						switch (type) {
							case REACT_ASYNC_MODE_TYPE:
							case REACT_CONCURRENT_MODE_TYPE:
							case REACT_FRAGMENT_TYPE:
							case REACT_PROFILER_TYPE:
							case REACT_STRICT_MODE_TYPE:
							case REACT_SUSPENSE_TYPE: return type;
							default:
								var $$typeofType = type && type.$$typeof;
								switch ($$typeofType) {
									case REACT_CONTEXT_TYPE:
									case REACT_FORWARD_REF_TYPE:
									case REACT_LAZY_TYPE:
									case REACT_MEMO_TYPE:
									case REACT_PROVIDER_TYPE: return $$typeofType;
									default: return $$typeof;
								}
						}
					case REACT_PORTAL_TYPE: return $$typeof;
				}
			}
		}
		var AsyncMode = REACT_ASYNC_MODE_TYPE;
		var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
		var ContextConsumer = REACT_CONTEXT_TYPE;
		var ContextProvider = REACT_PROVIDER_TYPE;
		var Element = REACT_ELEMENT_TYPE;
		var ForwardRef = REACT_FORWARD_REF_TYPE;
		var Fragment = REACT_FRAGMENT_TYPE;
		var Lazy = REACT_LAZY_TYPE;
		var Memo = REACT_MEMO_TYPE;
		var Portal = REACT_PORTAL_TYPE;
		var Profiler = REACT_PROFILER_TYPE;
		var StrictMode = REACT_STRICT_MODE_TYPE;
		var Suspense = REACT_SUSPENSE_TYPE;
		var hasWarnedAboutDeprecatedIsAsyncMode = false;
		function isAsyncMode(object) {
			if (!hasWarnedAboutDeprecatedIsAsyncMode) {
				hasWarnedAboutDeprecatedIsAsyncMode = true;
				console["warn"]("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.");
			}
			return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
		}
		function isConcurrentMode(object) {
			return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
		}
		function isContextConsumer(object) {
			return typeOf(object) === REACT_CONTEXT_TYPE;
		}
		function isContextProvider(object) {
			return typeOf(object) === REACT_PROVIDER_TYPE;
		}
		function isElement(object) {
			return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
		}
		function isForwardRef(object) {
			return typeOf(object) === REACT_FORWARD_REF_TYPE;
		}
		function isFragment(object) {
			return typeOf(object) === REACT_FRAGMENT_TYPE;
		}
		function isLazy(object) {
			return typeOf(object) === REACT_LAZY_TYPE;
		}
		function isMemo(object) {
			return typeOf(object) === REACT_MEMO_TYPE;
		}
		function isPortal(object) {
			return typeOf(object) === REACT_PORTAL_TYPE;
		}
		function isProfiler(object) {
			return typeOf(object) === REACT_PROFILER_TYPE;
		}
		function isStrictMode(object) {
			return typeOf(object) === REACT_STRICT_MODE_TYPE;
		}
		function isSuspense(object) {
			return typeOf(object) === REACT_SUSPENSE_TYPE;
		}
		exports.AsyncMode = AsyncMode;
		exports.ConcurrentMode = ConcurrentMode;
		exports.ContextConsumer = ContextConsumer;
		exports.ContextProvider = ContextProvider;
		exports.Element = Element;
		exports.ForwardRef = ForwardRef;
		exports.Fragment = Fragment;
		exports.Lazy = Lazy;
		exports.Memo = Memo;
		exports.Portal = Portal;
		exports.Profiler = Profiler;
		exports.StrictMode = StrictMode;
		exports.Suspense = Suspense;
		exports.isAsyncMode = isAsyncMode;
		exports.isConcurrentMode = isConcurrentMode;
		exports.isContextConsumer = isContextConsumer;
		exports.isContextProvider = isContextProvider;
		exports.isElement = isElement;
		exports.isForwardRef = isForwardRef;
		exports.isFragment = isFragment;
		exports.isLazy = isLazy;
		exports.isMemo = isMemo;
		exports.isPortal = isPortal;
		exports.isProfiler = isProfiler;
		exports.isStrictMode = isStrictMode;
		exports.isSuspense = isSuspense;
		exports.isValidElementType = isValidElementType;
		exports.typeOf = typeOf;
	})();
}));
//#endregion
//#region node_modules/prop-types/node_modules/react-is/index.js
var require_react_is$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_is_development$1();
}));
//#endregion
//#region node_modules/object-assign/index.js
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var require_object_assign = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;
	function toObject(val) {
		if (val === null || val === void 0) throw new TypeError("Object.assign cannot be called with null or undefined");
		return Object(val);
	}
	function shouldUseNative() {
		try {
			if (!Object.assign) return false;
			var test1 = /* @__PURE__ */ new String("abc");
			test1[5] = "de";
			if (Object.getOwnPropertyNames(test1)[0] === "5") return false;
			var test2 = {};
			for (var i = 0; i < 10; i++) test2["_" + String.fromCharCode(i)] = i;
			if (Object.getOwnPropertyNames(test2).map(function(n) {
				return test2[n];
			}).join("") !== "0123456789") return false;
			var test3 = {};
			"abcdefghijklmnopqrst".split("").forEach(function(letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") return false;
			return true;
		} catch (err) {
			return false;
		}
	}
	module.exports = shouldUseNative() ? Object.assign : function(target, source) {
		var from;
		var to = toObject(target);
		var symbols;
		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);
			for (var key in from) if (hasOwnProperty.call(from, key)) to[key] = from[key];
			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) if (propIsEnumerable.call(from, symbols[i])) to[symbols[i]] = from[symbols[i]];
			}
		}
		return to;
	};
}));
//#endregion
//#region node_modules/prop-types/lib/ReactPropTypesSecret.js
/**
* Copyright (c) 2013-present, Facebook, Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_ReactPropTypesSecret = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
}));
//#endregion
//#region node_modules/prop-types/lib/has.js
var require_has = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = Function.call.bind(Object.prototype.hasOwnProperty);
}));
//#endregion
//#region node_modules/prop-types/checkPropTypes.js
/**
* Copyright (c) 2013-present, Facebook, Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_checkPropTypes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var printWarning = function() {};
	var ReactPropTypesSecret = require_ReactPropTypesSecret();
	var loggedTypeFailures = {};
	var has = require_has();
	printWarning = function(text) {
		var message = "Warning: " + text;
		if (typeof console !== "undefined") console.error(message);
		try {
			throw new Error(message);
		} catch (x) {}
	};
	/**
	* Assert that the values match with the type specs.
	* Error messages are memorized and will only be shown once.
	*
	* @param {object} typeSpecs Map of name to a ReactPropType
	* @param {object} values Runtime values that need to be type-checked
	* @param {string} location e.g. "prop", "context", "child context"
	* @param {string} componentName Name of the component for error messages.
	* @param {?Function} getStack Returns the component stack.
	* @private
	*/
	function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
		for (var typeSpecName in typeSpecs) if (has(typeSpecs, typeSpecName)) {
			var error;
			try {
				if (typeof typeSpecs[typeSpecName] !== "function") {
					var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
					err.name = "Invariant Violation";
					throw err;
				}
				error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
			} catch (ex) {
				error = ex;
			}
			if (error && !(error instanceof Error)) printWarning((componentName || "React class") + ": type specification of " + location + " `" + typeSpecName + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof error + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).");
			if (error instanceof Error && !(error.message in loggedTypeFailures)) {
				loggedTypeFailures[error.message] = true;
				var stack = getStack ? getStack() : "";
				printWarning("Failed " + location + " type: " + error.message + (stack != null ? stack : ""));
			}
		}
	}
	/**
	* Resets warning cache when testing.
	*
	* @private
	*/
	checkPropTypes.resetWarningCache = function() {
		loggedTypeFailures = {};
	};
	module.exports = checkPropTypes;
}));
//#endregion
//#region node_modules/prop-types/factoryWithTypeCheckers.js
/**
* Copyright (c) 2013-present, Facebook, Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_factoryWithTypeCheckers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ReactIs = require_react_is$1();
	var assign = require_object_assign();
	var ReactPropTypesSecret = require_ReactPropTypesSecret();
	var has = require_has();
	var checkPropTypes = require_checkPropTypes();
	var printWarning = function() {};
	printWarning = function(text) {
		var message = "Warning: " + text;
		if (typeof console !== "undefined") console.error(message);
		try {
			throw new Error(message);
		} catch (x) {}
	};
	function emptyFunctionThatReturnsNull() {
		return null;
	}
	module.exports = function(isValidElement, throwOnDirectAccess) {
		var ITERATOR_SYMBOL = typeof Symbol === "function" && Symbol.iterator;
		var FAUX_ITERATOR_SYMBOL = "@@iterator";
		/**
		* Returns the iterator method function contained on the iterable object.
		*
		* Be sure to invoke the function with the iterable as context:
		*
		*     var iteratorFn = getIteratorFn(myIterable);
		*     if (iteratorFn) {
		*       var iterator = iteratorFn.call(myIterable);
		*       ...
		*     }
		*
		* @param {?object} maybeIterable
		* @return {?function}
		*/
		function getIteratorFn(maybeIterable) {
			var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
			if (typeof iteratorFn === "function") return iteratorFn;
		}
		/**
		* Collection of methods that allow declaration and validation of props that are
		* supplied to React components. Example usage:
		*
		*   var Props = require('ReactPropTypes');
		*   var MyArticle = React.createClass({
		*     propTypes: {
		*       // An optional string prop named "description".
		*       description: Props.string,
		*
		*       // A required enum prop named "category".
		*       category: Props.oneOf(['News','Photos']).isRequired,
		*
		*       // A prop named "dialog" that requires an instance of Dialog.
		*       dialog: Props.instanceOf(Dialog).isRequired
		*     },
		*     render: function() { ... }
		*   });
		*
		* A more formal specification of how these methods are used:
		*
		*   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
		*   decl := ReactPropTypes.{type}(.isRequired)?
		*
		* Each and every declaration produces a function with the same signature. This
		* allows the creation of custom validation functions. For example:
		*
		*  var MyLink = React.createClass({
		*    propTypes: {
		*      // An optional string or URI prop named "href".
		*      href: function(props, propName, componentName) {
		*        var propValue = props[propName];
		*        if (propValue != null && typeof propValue !== 'string' &&
		*            !(propValue instanceof URI)) {
		*          return new Error(
		*            'Expected a string or an URI for ' + propName + ' in ' +
		*            componentName
		*          );
		*        }
		*      }
		*    },
		*    render: function() {...}
		*  });
		*
		* @internal
		*/
		var ANONYMOUS = "<<anonymous>>";
		var ReactPropTypes = {
			array: createPrimitiveTypeChecker("array"),
			bigint: createPrimitiveTypeChecker("bigint"),
			bool: createPrimitiveTypeChecker("boolean"),
			func: createPrimitiveTypeChecker("function"),
			number: createPrimitiveTypeChecker("number"),
			object: createPrimitiveTypeChecker("object"),
			string: createPrimitiveTypeChecker("string"),
			symbol: createPrimitiveTypeChecker("symbol"),
			any: createAnyTypeChecker(),
			arrayOf: createArrayOfTypeChecker,
			element: createElementTypeChecker(),
			elementType: createElementTypeTypeChecker(),
			instanceOf: createInstanceTypeChecker,
			node: createNodeChecker(),
			objectOf: createObjectOfTypeChecker,
			oneOf: createEnumTypeChecker,
			oneOfType: createUnionTypeChecker,
			shape: createShapeTypeChecker,
			exact: createStrictShapeTypeChecker
		};
		/**
		* inlined Object.is polyfill to avoid requiring consumers ship their own
		* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
		*/
		function is(x, y) {
			if (x === y) return x !== 0 || 1 / x === 1 / y;
			else return x !== x && y !== y;
		}
		/**
		* We use an Error-like object for backward compatibility as people may call
		* PropTypes directly and inspect their output. However, we don't use real
		* Errors anymore. We don't inspect their stack anyway, and creating them
		* is prohibitively expensive if they are created too often, such as what
		* happens in oneOfType() for any type before the one that matched.
		*/
		function PropTypeError(message, data) {
			this.message = message;
			this.data = data && typeof data === "object" ? data : {};
			this.stack = "";
		}
		PropTypeError.prototype = Error.prototype;
		function createChainableTypeChecker(validate) {
			var manualPropTypeCallCache = {};
			var manualPropTypeWarningCount = 0;
			function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
				componentName = componentName || ANONYMOUS;
				propFullName = propFullName || propName;
				if (secret !== ReactPropTypesSecret) {
					if (throwOnDirectAccess) {
						var err = /* @__PURE__ */ new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types");
						err.name = "Invariant Violation";
						throw err;
					} else if (typeof console !== "undefined") {
						var cacheKey = componentName + ":" + propName;
						if (!manualPropTypeCallCache[cacheKey] && manualPropTypeWarningCount < 3) {
							printWarning("You are manually calling a React.PropTypes validation function for the `" + propFullName + "` prop on `" + componentName + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details.");
							manualPropTypeCallCache[cacheKey] = true;
							manualPropTypeWarningCount++;
						}
					}
				}
				if (props[propName] == null) {
					if (isRequired) {
						if (props[propName] === null) return new PropTypeError("The " + location + " `" + propFullName + "` is marked as required " + ("in `" + componentName + "`, but its value is `null`."));
						return new PropTypeError("The " + location + " `" + propFullName + "` is marked as required in " + ("`" + componentName + "`, but its value is `undefined`."));
					}
					return null;
				} else return validate(props, propName, componentName, location, propFullName);
			}
			var chainedCheckType = checkType.bind(null, false);
			chainedCheckType.isRequired = checkType.bind(null, true);
			return chainedCheckType;
		}
		function createPrimitiveTypeChecker(expectedType) {
			function validate(props, propName, componentName, location, propFullName, secret) {
				var propValue = props[propName];
				if (getPropType(propValue) !== expectedType) {
					var preciseType = getPreciseType(propValue);
					return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + preciseType + "` supplied to `" + componentName + "`, expected ") + ("`" + expectedType + "`."), { expectedType });
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createAnyTypeChecker() {
			return createChainableTypeChecker(emptyFunctionThatReturnsNull);
		}
		function createArrayOfTypeChecker(typeChecker) {
			function validate(props, propName, componentName, location, propFullName) {
				if (typeof typeChecker !== "function") return new PropTypeError("Property `" + propFullName + "` of component `" + componentName + "` has invalid PropType notation inside arrayOf.");
				var propValue = props[propName];
				if (!Array.isArray(propValue)) {
					var propType = getPropType(propValue);
					return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an array."));
				}
				for (var i = 0; i < propValue.length; i++) {
					var error = typeChecker(propValue, i, componentName, location, propFullName + "[" + i + "]", ReactPropTypesSecret);
					if (error instanceof Error) return error;
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createElementTypeChecker() {
			function validate(props, propName, componentName, location, propFullName) {
				var propValue = props[propName];
				if (!isValidElement(propValue)) {
					var propType = getPropType(propValue);
					return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected a single ReactElement."));
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createElementTypeTypeChecker() {
			function validate(props, propName, componentName, location, propFullName) {
				var propValue = props[propName];
				if (!ReactIs.isValidElementType(propValue)) {
					var propType = getPropType(propValue);
					return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected a single ReactElement type."));
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createInstanceTypeChecker(expectedClass) {
			function validate(props, propName, componentName, location, propFullName) {
				if (!(props[propName] instanceof expectedClass)) {
					var expectedClassName = expectedClass.name || ANONYMOUS;
					var actualClassName = getClassName(props[propName]);
					return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + actualClassName + "` supplied to `" + componentName + "`, expected ") + ("instance of `" + expectedClassName + "`."));
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createEnumTypeChecker(expectedValues) {
			if (!Array.isArray(expectedValues)) {
				if (arguments.length > 1) printWarning("Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).");
				else printWarning("Invalid argument supplied to oneOf, expected an array.");
				return emptyFunctionThatReturnsNull;
			}
			function validate(props, propName, componentName, location, propFullName) {
				var propValue = props[propName];
				for (var i = 0; i < expectedValues.length; i++) if (is(propValue, expectedValues[i])) return null;
				var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
					if (getPreciseType(value) === "symbol") return String(value);
					return value;
				});
				return new PropTypeError("Invalid " + location + " `" + propFullName + "` of value `" + String(propValue) + "` " + ("supplied to `" + componentName + "`, expected one of " + valuesString + "."));
			}
			return createChainableTypeChecker(validate);
		}
		function createObjectOfTypeChecker(typeChecker) {
			function validate(props, propName, componentName, location, propFullName) {
				if (typeof typeChecker !== "function") return new PropTypeError("Property `" + propFullName + "` of component `" + componentName + "` has invalid PropType notation inside objectOf.");
				var propValue = props[propName];
				var propType = getPropType(propValue);
				if (propType !== "object") return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an object."));
				for (var key in propValue) if (has(propValue, key)) {
					var error = typeChecker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
					if (error instanceof Error) return error;
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createUnionTypeChecker(arrayOfTypeCheckers) {
			if (!Array.isArray(arrayOfTypeCheckers)) {
				printWarning("Invalid argument supplied to oneOfType, expected an instance of array.");
				return emptyFunctionThatReturnsNull;
			}
			for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
				var checker = arrayOfTypeCheckers[i];
				if (typeof checker !== "function") {
					printWarning("Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + getPostfixForTypeWarning(checker) + " at index " + i + ".");
					return emptyFunctionThatReturnsNull;
				}
			}
			function validate(props, propName, componentName, location, propFullName) {
				var expectedTypes = [];
				for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
					var checker = arrayOfTypeCheckers[i];
					var checkerResult = checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
					if (checkerResult == null) return null;
					if (checkerResult.data && has(checkerResult.data, "expectedType")) expectedTypes.push(checkerResult.data.expectedType);
				}
				var expectedTypesMessage = expectedTypes.length > 0 ? ", expected one of type [" + expectedTypes.join(", ") + "]" : "";
				return new PropTypeError("Invalid " + location + " `" + propFullName + "` supplied to " + ("`" + componentName + "`" + expectedTypesMessage + "."));
			}
			return createChainableTypeChecker(validate);
		}
		function createNodeChecker() {
			function validate(props, propName, componentName, location, propFullName) {
				if (!isNode(props[propName])) return new PropTypeError("Invalid " + location + " `" + propFullName + "` supplied to " + ("`" + componentName + "`, expected a ReactNode."));
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function invalidValidatorError(componentName, location, propFullName, key, type) {
			return new PropTypeError((componentName || "React class") + ": " + location + " type `" + propFullName + "." + key + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + type + "`.");
		}
		function createShapeTypeChecker(shapeTypes) {
			function validate(props, propName, componentName, location, propFullName) {
				var propValue = props[propName];
				var propType = getPropType(propValue);
				if (propType !== "object") return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."));
				for (var key in shapeTypes) {
					var checker = shapeTypes[key];
					if (typeof checker !== "function") return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
					var error = checker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
					if (error) return error;
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function createStrictShapeTypeChecker(shapeTypes) {
			function validate(props, propName, componentName, location, propFullName) {
				var propValue = props[propName];
				var propType = getPropType(propValue);
				if (propType !== "object") return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."));
				for (var key in assign({}, props[propName], shapeTypes)) {
					var checker = shapeTypes[key];
					if (has(shapeTypes, key) && typeof checker !== "function") return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
					if (!checker) return new PropTypeError("Invalid " + location + " `" + propFullName + "` key `" + key + "` supplied to `" + componentName + "`.\nBad object: " + JSON.stringify(props[propName], null, "  ") + "\nValid keys: " + JSON.stringify(Object.keys(shapeTypes), null, "  "));
					var error = checker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
					if (error) return error;
				}
				return null;
			}
			return createChainableTypeChecker(validate);
		}
		function isNode(propValue) {
			switch (typeof propValue) {
				case "number":
				case "string":
				case "undefined": return true;
				case "boolean": return !propValue;
				case "object":
					if (Array.isArray(propValue)) return propValue.every(isNode);
					if (propValue === null || isValidElement(propValue)) return true;
					var iteratorFn = getIteratorFn(propValue);
					if (iteratorFn) {
						var iterator = iteratorFn.call(propValue);
						var step;
						if (iteratorFn !== propValue.entries) {
							while (!(step = iterator.next()).done) if (!isNode(step.value)) return false;
						} else while (!(step = iterator.next()).done) {
							var entry = step.value;
							if (entry) {
								if (!isNode(entry[1])) return false;
							}
						}
					} else return false;
					return true;
				default: return false;
			}
		}
		function isSymbol(propType, propValue) {
			if (propType === "symbol") return true;
			if (!propValue) return false;
			if (propValue["@@toStringTag"] === "Symbol") return true;
			if (typeof Symbol === "function" && propValue instanceof Symbol) return true;
			return false;
		}
		function getPropType(propValue) {
			var propType = typeof propValue;
			if (Array.isArray(propValue)) return "array";
			if (propValue instanceof RegExp) return "object";
			if (isSymbol(propType, propValue)) return "symbol";
			return propType;
		}
		function getPreciseType(propValue) {
			if (typeof propValue === "undefined" || propValue === null) return "" + propValue;
			var propType = getPropType(propValue);
			if (propType === "object") {
				if (propValue instanceof Date) return "date";
				else if (propValue instanceof RegExp) return "regexp";
			}
			return propType;
		}
		function getPostfixForTypeWarning(value) {
			var type = getPreciseType(value);
			switch (type) {
				case "array":
				case "object": return "an " + type;
				case "boolean":
				case "date":
				case "regexp": return "a " + type;
				default: return type;
			}
		}
		function getClassName(propValue) {
			if (!propValue.constructor || !propValue.constructor.name) return ANONYMOUS;
			return propValue.constructor.name;
		}
		ReactPropTypes.checkPropTypes = checkPropTypes;
		ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
		ReactPropTypes.PropTypes = ReactPropTypes;
		return ReactPropTypes;
	};
}));
//#endregion
//#region node_modules/prop-types/index.js
var require_prop_types = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ReactIs = require_react_is$1();
	module.exports = require_factoryWithTypeCheckers()(ReactIs.isElement, true);
}));
//#endregion
//#region node_modules/react-google-recaptcha/lib/esm/recaptcha.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_prop_types = /* @__PURE__ */ __toESM(require_prop_types());
var _excluded = [
	"sitekey",
	"onChange",
	"theme",
	"type",
	"tabindex",
	"onExpired",
	"onErrored",
	"size",
	"stoken",
	"grecaptcha",
	"badge",
	"hl",
	"isolated"
];
function _extends$1() {
	_extends$1 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$1.apply(this, arguments);
}
function _objectWithoutPropertiesLoose$1(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function _assertThisInitialized(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _inheritsLoose$1(subClass, superClass) {
	subClass.prototype = Object.create(superClass.prototype);
	subClass.prototype.constructor = subClass;
	_setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
	_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf(o, p);
}
var ReCAPTCHA = /* @__PURE__ */ function(_React$Component) {
	_inheritsLoose$1(ReCAPTCHA, _React$Component);
	function ReCAPTCHA() {
		var _this = _React$Component.call(this) || this;
		_this.handleExpired = _this.handleExpired.bind(_assertThisInitialized(_this));
		_this.handleErrored = _this.handleErrored.bind(_assertThisInitialized(_this));
		_this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
		_this.handleRecaptchaRef = _this.handleRecaptchaRef.bind(_assertThisInitialized(_this));
		return _this;
	}
	var _proto = ReCAPTCHA.prototype;
	_proto.getCaptchaFunction = function getCaptchaFunction(fnName) {
		if (this.props.grecaptcha) {
			if (this.props.grecaptcha.enterprise) return this.props.grecaptcha.enterprise[fnName];
			return this.props.grecaptcha[fnName];
		}
		return null;
	};
	_proto.getValue = function getValue() {
		var getResponse = this.getCaptchaFunction("getResponse");
		if (getResponse && this._widgetId !== void 0) return getResponse(this._widgetId);
		return null;
	};
	_proto.getWidgetId = function getWidgetId() {
		if (this.props.grecaptcha && this._widgetId !== void 0) return this._widgetId;
		return null;
	};
	_proto.execute = function execute() {
		var execute = this.getCaptchaFunction("execute");
		if (execute && this._widgetId !== void 0) return execute(this._widgetId);
		else this._executeRequested = true;
	};
	_proto.executeAsync = function executeAsync() {
		var _this2 = this;
		return new Promise(function(resolve, reject) {
			_this2.executionResolve = resolve;
			_this2.executionReject = reject;
			_this2.execute();
		});
	};
	_proto.reset = function reset() {
		var resetter = this.getCaptchaFunction("reset");
		if (resetter && this._widgetId !== void 0) resetter(this._widgetId);
	};
	_proto.forceReset = function forceReset() {
		var resetter = this.getCaptchaFunction("reset");
		if (resetter) resetter();
	};
	_proto.handleExpired = function handleExpired() {
		if (this.props.onExpired) this.props.onExpired();
		else this.handleChange(null);
	};
	_proto.handleErrored = function handleErrored() {
		if (this.props.onErrored) this.props.onErrored();
		if (this.executionReject) {
			this.executionReject();
			delete this.executionResolve;
			delete this.executionReject;
		}
	};
	_proto.handleChange = function handleChange(token) {
		if (this.props.onChange) this.props.onChange(token);
		if (this.executionResolve) {
			this.executionResolve(token);
			delete this.executionReject;
			delete this.executionResolve;
		}
	};
	_proto.explicitRender = function explicitRender() {
		var render = this.getCaptchaFunction("render");
		if (render && this._widgetId === void 0) {
			var wrapper = document.createElement("div");
			this._widgetId = render(wrapper, {
				sitekey: this.props.sitekey,
				callback: this.handleChange,
				theme: this.props.theme,
				type: this.props.type,
				tabindex: this.props.tabindex,
				"expired-callback": this.handleExpired,
				"error-callback": this.handleErrored,
				size: this.props.size,
				stoken: this.props.stoken,
				hl: this.props.hl,
				badge: this.props.badge,
				isolated: this.props.isolated
			});
			this.captcha.appendChild(wrapper);
		}
		if (this._executeRequested && this.props.grecaptcha && this._widgetId !== void 0) {
			this._executeRequested = false;
			this.execute();
		}
	};
	_proto.componentDidMount = function componentDidMount() {
		this.explicitRender();
	};
	_proto.componentDidUpdate = function componentDidUpdate() {
		this.explicitRender();
	};
	_proto.handleRecaptchaRef = function handleRecaptchaRef(elem) {
		this.captcha = elem;
	};
	_proto.render = function render() {
		var _this$props = this.props;
		_this$props.sitekey;
		_this$props.onChange;
		_this$props.theme;
		_this$props.type;
		_this$props.tabindex;
		_this$props.onExpired;
		_this$props.onErrored;
		_this$props.size;
		_this$props.stoken;
		_this$props.grecaptcha;
		_this$props.badge;
		_this$props.hl;
		_this$props.isolated;
		var childProps = _objectWithoutPropertiesLoose$1(_this$props, _excluded);
		return /* @__PURE__ */ import_react.createElement("div", _extends$1({}, childProps, { ref: this.handleRecaptchaRef }));
	};
	return ReCAPTCHA;
}(import_react.Component);
ReCAPTCHA.displayName = "ReCAPTCHA";
ReCAPTCHA.propTypes = {
	sitekey: import_prop_types.default.string.isRequired,
	onChange: import_prop_types.default.func,
	grecaptcha: import_prop_types.default.object,
	theme: import_prop_types.default.oneOf(["dark", "light"]),
	type: import_prop_types.default.oneOf(["image", "audio"]),
	tabindex: import_prop_types.default.number,
	onExpired: import_prop_types.default.func,
	onErrored: import_prop_types.default.func,
	size: import_prop_types.default.oneOf([
		"compact",
		"normal",
		"invisible"
	]),
	stoken: import_prop_types.default.string,
	hl: import_prop_types.default.string,
	badge: import_prop_types.default.oneOf([
		"bottomright",
		"bottomleft",
		"inline"
	]),
	isolated: import_prop_types.default.bool
};
ReCAPTCHA.defaultProps = {
	onChange: function onChange() {},
	theme: "light",
	type: "image",
	tabindex: 0,
	size: "normal",
	badge: "bottomright"
};
//#endregion
//#region node_modules/hoist-non-react-statics/node_modules/react-is/cjs/react-is.development.js
/** @license React v16.13.1
* react-is.development.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_is_development = /* @__PURE__ */ __commonJSMin(((exports) => {
	(function() {
		"use strict";
		var hasSymbol = typeof Symbol === "function" && Symbol.for;
		var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for("react.element") : 60103;
		var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for("react.portal") : 60106;
		var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for("react.fragment") : 60107;
		var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for("react.strict_mode") : 60108;
		var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for("react.profiler") : 60114;
		var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for("react.provider") : 60109;
		var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for("react.context") : 60110;
		var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for("react.async_mode") : 60111;
		var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for("react.concurrent_mode") : 60111;
		var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for("react.forward_ref") : 60112;
		var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for("react.suspense") : 60113;
		var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for("react.suspense_list") : 60120;
		var REACT_MEMO_TYPE = hasSymbol ? Symbol.for("react.memo") : 60115;
		var REACT_LAZY_TYPE = hasSymbol ? Symbol.for("react.lazy") : 60116;
		var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for("react.block") : 60121;
		var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for("react.fundamental") : 60117;
		var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for("react.responder") : 60118;
		var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for("react.scope") : 60119;
		function isValidElementType(type) {
			return typeof type === "string" || typeof type === "function" || type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
		}
		function typeOf(object) {
			if (typeof object === "object" && object !== null) {
				var $$typeof = object.$$typeof;
				switch ($$typeof) {
					case REACT_ELEMENT_TYPE:
						var type = object.type;
						switch (type) {
							case REACT_ASYNC_MODE_TYPE:
							case REACT_CONCURRENT_MODE_TYPE:
							case REACT_FRAGMENT_TYPE:
							case REACT_PROFILER_TYPE:
							case REACT_STRICT_MODE_TYPE:
							case REACT_SUSPENSE_TYPE: return type;
							default:
								var $$typeofType = type && type.$$typeof;
								switch ($$typeofType) {
									case REACT_CONTEXT_TYPE:
									case REACT_FORWARD_REF_TYPE:
									case REACT_LAZY_TYPE:
									case REACT_MEMO_TYPE:
									case REACT_PROVIDER_TYPE: return $$typeofType;
									default: return $$typeof;
								}
						}
					case REACT_PORTAL_TYPE: return $$typeof;
				}
			}
		}
		var AsyncMode = REACT_ASYNC_MODE_TYPE;
		var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
		var ContextConsumer = REACT_CONTEXT_TYPE;
		var ContextProvider = REACT_PROVIDER_TYPE;
		var Element = REACT_ELEMENT_TYPE;
		var ForwardRef = REACT_FORWARD_REF_TYPE;
		var Fragment = REACT_FRAGMENT_TYPE;
		var Lazy = REACT_LAZY_TYPE;
		var Memo = REACT_MEMO_TYPE;
		var Portal = REACT_PORTAL_TYPE;
		var Profiler = REACT_PROFILER_TYPE;
		var StrictMode = REACT_STRICT_MODE_TYPE;
		var Suspense = REACT_SUSPENSE_TYPE;
		var hasWarnedAboutDeprecatedIsAsyncMode = false;
		function isAsyncMode(object) {
			if (!hasWarnedAboutDeprecatedIsAsyncMode) {
				hasWarnedAboutDeprecatedIsAsyncMode = true;
				console["warn"]("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.");
			}
			return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
		}
		function isConcurrentMode(object) {
			return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
		}
		function isContextConsumer(object) {
			return typeOf(object) === REACT_CONTEXT_TYPE;
		}
		function isContextProvider(object) {
			return typeOf(object) === REACT_PROVIDER_TYPE;
		}
		function isElement(object) {
			return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
		}
		function isForwardRef(object) {
			return typeOf(object) === REACT_FORWARD_REF_TYPE;
		}
		function isFragment(object) {
			return typeOf(object) === REACT_FRAGMENT_TYPE;
		}
		function isLazy(object) {
			return typeOf(object) === REACT_LAZY_TYPE;
		}
		function isMemo(object) {
			return typeOf(object) === REACT_MEMO_TYPE;
		}
		function isPortal(object) {
			return typeOf(object) === REACT_PORTAL_TYPE;
		}
		function isProfiler(object) {
			return typeOf(object) === REACT_PROFILER_TYPE;
		}
		function isStrictMode(object) {
			return typeOf(object) === REACT_STRICT_MODE_TYPE;
		}
		function isSuspense(object) {
			return typeOf(object) === REACT_SUSPENSE_TYPE;
		}
		exports.AsyncMode = AsyncMode;
		exports.ConcurrentMode = ConcurrentMode;
		exports.ContextConsumer = ContextConsumer;
		exports.ContextProvider = ContextProvider;
		exports.Element = Element;
		exports.ForwardRef = ForwardRef;
		exports.Fragment = Fragment;
		exports.Lazy = Lazy;
		exports.Memo = Memo;
		exports.Portal = Portal;
		exports.Profiler = Profiler;
		exports.StrictMode = StrictMode;
		exports.Suspense = Suspense;
		exports.isAsyncMode = isAsyncMode;
		exports.isConcurrentMode = isConcurrentMode;
		exports.isContextConsumer = isContextConsumer;
		exports.isContextProvider = isContextProvider;
		exports.isElement = isElement;
		exports.isForwardRef = isForwardRef;
		exports.isFragment = isFragment;
		exports.isLazy = isLazy;
		exports.isMemo = isMemo;
		exports.isPortal = isPortal;
		exports.isProfiler = isProfiler;
		exports.isStrictMode = isStrictMode;
		exports.isSuspense = isSuspense;
		exports.isValidElementType = isValidElementType;
		exports.typeOf = typeOf;
	})();
}));
//#endregion
//#region node_modules/hoist-non-react-statics/node_modules/react-is/index.js
var require_react_is = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_is_development();
}));
//#endregion
//#region node_modules/react-async-script/lib/esm/async-script-loader.js
var import_hoist_non_react_statics_cjs = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var reactIs = require_react_is();
	/**
	* Copyright 2015, Yahoo! Inc.
	* Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
	*/
	var REACT_STATICS = {
		childContextTypes: true,
		contextType: true,
		contextTypes: true,
		defaultProps: true,
		displayName: true,
		getDefaultProps: true,
		getDerivedStateFromError: true,
		getDerivedStateFromProps: true,
		mixins: true,
		propTypes: true,
		type: true
	};
	var KNOWN_STATICS = {
		name: true,
		length: true,
		prototype: true,
		caller: true,
		callee: true,
		arguments: true,
		arity: true
	};
	var FORWARD_REF_STATICS = {
		"$$typeof": true,
		render: true,
		defaultProps: true,
		displayName: true,
		propTypes: true
	};
	var MEMO_STATICS = {
		"$$typeof": true,
		compare: true,
		defaultProps: true,
		displayName: true,
		propTypes: true,
		type: true
	};
	var TYPE_STATICS = {};
	TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
	TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;
	function getStatics(component) {
		if (reactIs.isMemo(component)) return MEMO_STATICS;
		return TYPE_STATICS[component["$$typeof"]] || REACT_STATICS;
	}
	var defineProperty = Object.defineProperty;
	var getOwnPropertyNames = Object.getOwnPropertyNames;
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var getPrototypeOf = Object.getPrototypeOf;
	var objectPrototype = Object.prototype;
	function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
		if (typeof sourceComponent !== "string") {
			if (objectPrototype) {
				var inheritedComponent = getPrototypeOf(sourceComponent);
				if (inheritedComponent && inheritedComponent !== objectPrototype) hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
			}
			var keys = getOwnPropertyNames(sourceComponent);
			if (getOwnPropertySymbols) keys = keys.concat(getOwnPropertySymbols(sourceComponent));
			var targetStatics = getStatics(targetComponent);
			var sourceStatics = getStatics(sourceComponent);
			for (var i = 0; i < keys.length; ++i) {
				var key = keys[i];
				if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
					var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
					try {
						defineProperty(targetComponent, key, descriptor);
					} catch (e) {}
				}
			}
		}
		return targetComponent;
	}
	module.exports = hoistNonReactStatics;
})))());
function _extends() {
	_extends = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
	if (source == null) return {};
	var target = {};
	var sourceKeys = Object.keys(source);
	var key, i;
	for (i = 0; i < sourceKeys.length; i++) {
		key = sourceKeys[i];
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function _inheritsLoose(subClass, superClass) {
	subClass.prototype = Object.create(superClass.prototype);
	subClass.prototype.constructor = subClass;
	subClass.__proto__ = superClass;
}
var SCRIPT_MAP = {};
var idCount = 0;
function makeAsyncScript(getScriptURL, options) {
	options = options || {};
	return function wrapWithAsyncScript(WrappedComponent) {
		var wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || "Component";
		var AsyncScriptLoader = /* @__PURE__ */ function(_Component) {
			_inheritsLoose(AsyncScriptLoader, _Component);
			function AsyncScriptLoader(props, context) {
				var _this = _Component.call(this, props, context) || this;
				_this.state = {};
				_this.__scriptURL = "";
				return _this;
			}
			var _proto = AsyncScriptLoader.prototype;
			_proto.asyncScriptLoaderGetScriptLoaderID = function asyncScriptLoaderGetScriptLoaderID() {
				if (!this.__scriptLoaderID) this.__scriptLoaderID = "async-script-loader-" + idCount++;
				return this.__scriptLoaderID;
			};
			_proto.setupScriptURL = function setupScriptURL() {
				this.__scriptURL = typeof getScriptURL === "function" ? getScriptURL() : getScriptURL;
				return this.__scriptURL;
			};
			_proto.asyncScriptLoaderHandleLoad = function asyncScriptLoaderHandleLoad(state) {
				var _this2 = this;
				this.setState(state, function() {
					return _this2.props.asyncScriptOnLoad && _this2.props.asyncScriptOnLoad(_this2.state);
				});
			};
			_proto.asyncScriptLoaderTriggerOnScriptLoaded = function asyncScriptLoaderTriggerOnScriptLoaded() {
				var mapEntry = SCRIPT_MAP[this.__scriptURL];
				if (!mapEntry || !mapEntry.loaded) throw new Error("Script is not loaded.");
				for (var obsKey in mapEntry.observers) mapEntry.observers[obsKey](mapEntry);
				delete window[options.callbackName];
			};
			_proto.componentDidMount = function componentDidMount() {
				var _this3 = this;
				var scriptURL = this.setupScriptURL();
				var key = this.asyncScriptLoaderGetScriptLoaderID();
				var _options = options, globalName = _options.globalName, callbackName = _options.callbackName, scriptId = _options.scriptId;
				if (globalName && typeof window[globalName] !== "undefined") SCRIPT_MAP[scriptURL] = {
					loaded: true,
					observers: {}
				};
				if (SCRIPT_MAP[scriptURL]) {
					var entry = SCRIPT_MAP[scriptURL];
					if (entry && (entry.loaded || entry.errored)) {
						this.asyncScriptLoaderHandleLoad(entry);
						return;
					}
					entry.observers[key] = function(entry) {
						return _this3.asyncScriptLoaderHandleLoad(entry);
					};
					return;
				}
				var observers = {};
				observers[key] = function(entry) {
					return _this3.asyncScriptLoaderHandleLoad(entry);
				};
				SCRIPT_MAP[scriptURL] = {
					loaded: false,
					observers
				};
				var script = document.createElement("script");
				script.src = scriptURL;
				script.async = true;
				for (var attribute in options.attributes) script.setAttribute(attribute, options.attributes[attribute]);
				if (scriptId) script.id = scriptId;
				var callObserverFuncAndRemoveObserver = function callObserverFuncAndRemoveObserver(func) {
					if (SCRIPT_MAP[scriptURL]) {
						var observersMap = SCRIPT_MAP[scriptURL].observers;
						for (var obsKey in observersMap) if (func(observersMap[obsKey])) delete observersMap[obsKey];
					}
				};
				if (callbackName && typeof window !== "undefined") window[callbackName] = function() {
					return _this3.asyncScriptLoaderTriggerOnScriptLoaded();
				};
				script.onload = function() {
					var mapEntry = SCRIPT_MAP[scriptURL];
					if (mapEntry) {
						mapEntry.loaded = true;
						callObserverFuncAndRemoveObserver(function(observer) {
							if (callbackName) return false;
							observer(mapEntry);
							return true;
						});
					}
				};
				script.onerror = function() {
					var mapEntry = SCRIPT_MAP[scriptURL];
					if (mapEntry) {
						mapEntry.errored = true;
						callObserverFuncAndRemoveObserver(function(observer) {
							observer(mapEntry);
							return true;
						});
					}
				};
				document.body.appendChild(script);
			};
			_proto.componentWillUnmount = function componentWillUnmount() {
				var scriptURL = this.__scriptURL;
				if (options.removeOnUnmount === true) {
					var allScripts = document.getElementsByTagName("script");
					for (var i = 0; i < allScripts.length; i += 1) if (allScripts[i].src.indexOf(scriptURL) > -1) {
						if (allScripts[i].parentNode) allScripts[i].parentNode.removeChild(allScripts[i]);
					}
				}
				var mapEntry = SCRIPT_MAP[scriptURL];
				if (mapEntry) {
					delete mapEntry.observers[this.asyncScriptLoaderGetScriptLoaderID()];
					if (options.removeOnUnmount === true) delete SCRIPT_MAP[scriptURL];
				}
			};
			_proto.render = function render() {
				var globalName = options.globalName, _this$props = this.props;
				_this$props.asyncScriptOnLoad;
				var forwardedRef = _this$props.forwardedRef, childProps = _objectWithoutPropertiesLoose(_this$props, ["asyncScriptOnLoad", "forwardedRef"]);
				if (globalName && typeof window !== "undefined") childProps[globalName] = typeof window[globalName] !== "undefined" ? window[globalName] : void 0;
				childProps.ref = forwardedRef;
				return (0, import_react.createElement)(WrappedComponent, childProps);
			};
			return AsyncScriptLoader;
		}(import_react.Component);
		var ForwardedComponent = (0, import_react.forwardRef)(function(props, ref) {
			return (0, import_react.createElement)(AsyncScriptLoader, _extends({}, props, { forwardedRef: ref }));
		});
		ForwardedComponent.displayName = "AsyncScriptLoader(" + wrappedComponentName + ")";
		ForwardedComponent.propTypes = { asyncScriptOnLoad: import_prop_types.default.func };
		return (0, import_hoist_non_react_statics_cjs.default)(ForwardedComponent, WrappedComponent);
	};
}
//#endregion
//#region node_modules/react-google-recaptcha/lib/esm/recaptcha-wrapper.js
var callbackName = "onloadcallback";
var globalName = "grecaptcha";
function getOptions() {
	return typeof window !== "undefined" && window.recaptchaOptions || {};
}
function getURL() {
	var dynamicOptions = getOptions();
	var hostname = dynamicOptions.useRecaptchaNet ? "recaptcha.net" : "www.google.com";
	if (dynamicOptions.enterprise) return "https://" + hostname + "/recaptcha/enterprise.js?onload=" + callbackName + "&render=explicit";
	return "https://" + hostname + "/recaptcha/api.js?onload=" + callbackName + "&render=explicit";
}
//#endregion
//#region node_modules/react-google-recaptcha/lib/esm/index.js
var esm_default = makeAsyncScript(getURL, {
	callbackName,
	globalName,
	attributes: getOptions().nonce ? { nonce: getOptions().nonce } : {}
})(ReCAPTCHA);
//#endregion
export { ReCAPTCHA, esm_default as default };

//# sourceMappingURL=react-google-recaptcha.js.map