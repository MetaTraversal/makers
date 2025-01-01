/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/vendor/vendor.js":
/*!*********************************!*\
  !*** ./src/js/vendor/vendor.js ***!
  \*********************************/
/***/ (() => {

eval("var vendorz = {\n  \"ad\": '345'\n};\n\n// console.log(vendorz)\nfunction mandelbrot(cX, cY, maxIter) {\n  var zX = 0;\n  var zY = 0;\n  var n = 0;\n  while (zX * zX + zY * zY <= 4 && n < maxIter) {\n    var tempX = zX * zX - zY * zY + cX;\n    zY = 2 * zX * zY + cY;\n    zX = tempX;\n    n++;\n  }\n  return n;\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvdmVuZG9yL3ZlbmRvci5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWFrZXJzLy4vc3JjL2pzL3ZlbmRvci92ZW5kb3IuanM/MDQ3MyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdmVuZG9yeiA9IHtcbiAgXCJhZFwiOiAnMzQ1J1xufTtcblxuLy8gY29uc29sZS5sb2codmVuZG9yeilcbmZ1bmN0aW9uIG1hbmRlbGJyb3QoY1gsIGNZLCBtYXhJdGVyKSB7XG4gIHZhciB6WCA9IDA7XG4gIHZhciB6WSA9IDA7XG4gIHZhciBuID0gMDtcbiAgd2hpbGUgKHpYICogelggKyB6WSAqIHpZIDw9IDQgJiYgbiA8IG1heEl0ZXIpIHtcbiAgICB2YXIgdGVtcFggPSB6WCAqIHpYIC0gelkgKiB6WSArIGNYO1xuICAgIHpZID0gMiAqIHpYICogelkgKyBjWTtcbiAgICB6WCA9IHRlbXBYO1xuICAgIG4rKztcbiAgfVxuICByZXR1cm4gbjtcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/js/vendor/vendor.js\n");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/vendor/vendor.js"]();
/******/ 	
/******/ })()
;