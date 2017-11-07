module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("syncano-server");

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return awsConfig; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aws_sdk__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aws_sdk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_aws_sdk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_syncano_server__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_syncano_server___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_syncano_server__);



function awsConfig({ctx, region}) {
  const {data, logger} = __WEBPACK_IMPORTED_MODULE_1_syncano_server___default()(ctx)
  const {debug, error, warn, info} = logger('aws-utils@aws-config:')
  var aws_id;
  try {
      aws_id = data.aws_id.firstOrFail()
  } catch(e) {
      throw {message: "Please install and configure aws-config socket."}
  }
  const {AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY} = aws_id
  const creds = new __WEBPACK_IMPORTED_MODULE_0_aws_sdk___default.a.Credentials({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  })
  const config = new __WEBPACK_IMPORTED_MODULE_0_aws_sdk___default.a.Config({
    region,
    credentials:creds
  })
  error(config)
  return config
}




/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("aws-sdk");

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export awsDefaultRegion */
const awsDefaultRegion = ctx => {
  const {REGION = 'eu-central-1'} = ctx.config
  return REGION
}




/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return awsDefaultBucket; });
const awsDefaultBucket = ctx => `${ctx.meta.instance}-bucket`



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export defaultHash */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return compareHash; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_crypto__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_crypto___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_crypto__);


function defaultHash(raw) {
    return __WEBPACK_IMPORTED_MODULE_0_crypto___default.a.createHash("sha256").update(raw).digest("hex") 
}

function compareHash(raw, hash) {
    if(raw === "undefined") {
        return false
    }
    if(raw.length === 0) {
        return false
    }
    return defaultHash(raw) === hash
}




/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export makeid */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__aws_config_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__default_region_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__default_bucket_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__default_s3_context_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__aws_security_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__s3_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils_js__ = __webpack_require__(5);
/* unused harmony reexport awsConfig */
/* unused harmony reexport awsDefaultRegion */
/* unused harmony reexport awsDefaultBucket */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_3__default_s3_context_js__["awsDefaultS3Context"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_4__aws_security_js__["a"]; });
/* unused harmony reexport defaultHash */
/* unused harmony reexport compareHash */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_5__s3_js__["s3"]; });








function makeid(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}




/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__default_bucket__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__default_region__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_syncano_server__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_syncano_server___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_syncano_server__);



/* unused harmony default export */ var _unused_webpack_default_export = (async ctx => {
  const db = Object(__WEBPACK_IMPORTED_MODULE_0__default_bucket__["a" /* awsDefaultBucket */])(ctx)
  const dr = defaultRegion(ctx)
  const {data, socket} = __WEBPACK_IMPORTED_MODULE_2_syncano_server___default()(ctx)
  // Check if default bucket exists if not create one
  try {
    const bucket = await data.bucket.where('name', db).firstOrFail()
  } catch (error) {
    const newBucket = await socket.get('aws-storage/create_bucket', {
      name: db,
      region: dr,
      AMAZON_KEY: ctx.config.AMAZON_KEY
    })
  }
  const {AMAZON_KEY, bucketName = db, region = dr} = ctx.args
  // If somebody wants to enter another socket or bucket AMAZON_KEY is needed as argument
  if (bucketName !== db || region !== dr) {
    if (AMAZON_KEY !== ctx.config.AMAZON_KEY) {
      throw new Error(
        'You are not allowed to perform operations on this region or bucket. Pass AMAZON_KEY to do that'
      )
    }
  }
  return {
    bucketName,
    region
  }
});


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return isAdmin; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_syncano_server__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_syncano_server___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_syncano_server__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_js__ = __webpack_require__(5);



async function isAdmin(ctx) {
    const {data} = __WEBPACK_IMPORTED_MODULE_0_syncano_server___default()(ctx)
    var security
    try {
        security = await data.security.firstOrFail()
    } catch(e) {
        throw {message: "Please install and configure aws-config socket."}
    }
    return Object(__WEBPACK_IMPORTED_MODULE_1__utils_js__["a" /* compareHash */])(ctx.args.AMAZON_KEY, security.AMAZON_KEY)
}




/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aws_sdk__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_aws_sdk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_aws_sdk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__aws_config__ = __webpack_require__(1);


/* unused harmony default export */ var _unused_webpack_default_export = (({ctx,region}) => {
    const conf = Object(__WEBPACK_IMPORTED_MODULE_1__aws_config__["a" /* awsConfig */])({ctx,region})
    return new __WEBPACK_IMPORTED_MODULE_0_aws_sdk___default.a.S3(conf)
});


/***/ }),
/* 11 */,
/* 12 */,
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_syncano_server__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_syncano_server___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_syncano_server__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_aws_utils__ = __webpack_require__(6);



/* harmony default export */ __webpack_exports__["default"] = (async ctx => {
  const {data, response} = __WEBPACK_IMPORTED_MODULE_0_syncano_server___default()(ctx)
  try {
    const {bucketName, region} = await Object(__WEBPACK_IMPORTED_MODULE_1_aws_utils__["a" /* awsDefaultS3Context */])(ctx)
    const {name} = ctx.args
    const {EXPIRE = 60} = ctx.config
    if (name.indexOf('/') !== -1) {
      throw new Error('You are not allowed to do that')
    }
    const s3instance = Object(__WEBPACK_IMPORTED_MODULE_1_aws_utils__["c" /* s3 */])({ctx, region})
    const link = s3instance.getSignedUrl('putObject',{
      Bucket: bucketName,
      Key: name,
      Expires: EXPIRE,
      ACL: 'public-read'
    })
    return response.json({link})
  } catch (error) {
    return response.json(error.message, 400)
  }
});


/***/ })
/******/ ]);
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = module.exports["default"]
module.exports = exports["default"];
