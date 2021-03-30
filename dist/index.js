function __WEBPACK_PURE_REQUIRE__(content) {
  /******/ return require(content)
} 


/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/lint-md-action.ts":
/*!*******************************!*\
  !*** ./src/lint-md-action.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LintMdAction = void 0;
const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "path");
const core = __webpack_require__(/*! @actions/core */ "@actions/core");
const index_1 = __webpack_require__(/*! @lint-md/cli/lib/index */ "@lint-md/cli/lib/index");
class LintMdAction {
    constructor(basePath) {
        if (!basePath) {
            this.basePath = process.env.GITHUB_WORKSPACE;
        }
        this.config = this.getConfig();
        this.lintFiles = core
            .getInput('files')
            .split(' ')
            .map(res => path.resolve(this.basePath, res));
    }
    getConfig() {
        const configPath = path.resolve(process.env.GITHUB_WORKSPACE, core.getInput('configFile'));
        if (!fs.existsSync(configPath)) {
            core.warning('The user does not have a configuration file to pass in, we will use the default configuration instead...');
            return {};
        }
        if (configPath.endsWith('.js')) {
            return __WEBPACK_PURE_REQUIRE__(`${configPath}`);
        }
        const content = fs.readFileSync(configPath).toString();
        return JSON.parse(content);
    }
    isPass() {
        if (!this.linter) {
            return true;
        }
        const result = this.linter.countError();
        const noErrorAndWarn = result.error === 0 && result.warning === 0;
        return core.getInput('failOnWarnings') === 'true' ? noErrorAndWarn : result.error === 0;
    }
    async lint() {
        this.linter = new index_1.Lint(this.lintFiles, this.config);
        await this.linter.start();
        return this;
    }
    showResult() {
        if (this.linter) {
            this.linter.printOverview();
        }
        return this;
    }
    showErrorOrPassInfo() {
        if (this.isPass()) {
            core.info('\nMarkdown Lint free! 🎉');
        }
        else {
            core.setFailed('\nThere are some lint errors in your files 😭...');
        }
    }
    getErrors() {
        return this.linter.errorFiles;
    }
}
exports.LintMdAction = LintMdAction;


/***/ }),

/***/ "@actions/core":
/*!********************************!*\
  !*** external "@actions/core" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("@actions/core");;

/***/ }),

/***/ "@lint-md/cli/lib/index":
/*!*****************************************!*\
  !*** external "@lint-md/cli/lib/index" ***!
  \*****************************************/
/***/ ((module) => {

module.exports = require("@lint-md/cli/lib/index");;

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");;

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const lint_md_action_1 = __webpack_require__(/*! ./lint-md-action */ "./src/lint-md-action.ts");
const runAction = async () => {
    const lintMdAction = new lint_md_action_1.LintMdAction();
    await lintMdAction.lint();
    lintMdAction
        .showResult()
        .showErrorOrPassInfo();
};
runAction().catch(res => {
    console.log(res);
    throw new Error('unknown error!');
});

})();

/******/ })()
;