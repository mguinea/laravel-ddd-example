/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 186:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {


;// CONCATENATED MODULE: ./src/main/js/util/dom.js
function createElementFromHtml(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}
function toId(string) {
  return string.trim().replace(/[\W_]+/g, "-").toLowerCase();
}
// EXTERNAL MODULE: ./.yarn/cache/jquery-npm-3.6.0-ca7872bdbb-8fd5fef4aa.zip/node_modules/jquery/dist/jquery.js
var jquery = __webpack_require__(7601);
var jquery_default = /*#__PURE__*/__webpack_require__.n(jquery);
// EXTERNAL MODULE: ./.yarn/cache/window-handle-npm-1.0.1-369b8e9cbe-8f2c183a0d.zip/node_modules/window-handle/index.js
var window_handle = __webpack_require__(30);
;// CONCATENATED MODULE: ./src/main/js/util/page.js


var timestamp = new Date().getTime();
var loadedClass = "jenkins-loaded-" + timestamp;
/**
 * Wait for the specified element to be added to the DOM.
 * <p>
 * A jQuery based alternative to Behaviour.specify. Grrrr.
 * @param selector The jQuery selector.
 * @param callback The callback to call after finding new elements. This
 * callback must return a boolean value of true if scanning is to continue.
 * @param contextEl The jQuery selector context (optional).
 */

function page_onload(selector, callback, contextEl) {
  function registerRescan() {
    setTimeout(scan, 50);
  }

  function scan() {
    var elements = jquery_default()(selector, contextEl).not(loadedClass);

    if (elements.length > 0) {
      elements.addClass(loadedClass);

      if (callback(elements) === true) {
        registerRescan();
      }
    } else {
      registerRescan();
    }
  }

  scan();
}

function winScrollTop() {
  var win = jquery_default()((0,window_handle.getWindow)());
  return win.scrollTop();
}

function onWinScroll(callback) {
  jquery_default()((0,window_handle.getWindow)()).on("scroll", callback);
}

function pageHeaderHeight() {
  return elementHeight("#page-header") + breadcrumbBarHeight();
}

function breadcrumbBarHeight() {
  return elementHeight("#breadcrumbBar");
}

function removeTextHighlighting(selector) {
  jquery_default()("span.highlight-split", selector).each(function () {
    var highlightSplit = jquery_default()(this);
    highlightSplit.before(highlightSplit.text());
    highlightSplit.remove();
  });
}

function elementHeight(selector) {
  return jquery_default()(selector).height();
}

/* harmony default export */ var page = ({
  onload: page_onload,
  winScrollTop,
  onWinScroll,
  pageHeaderHeight,
  breadcrumbBarHeight,
  removeTextHighlighting
});
;// CONCATENATED MODULE: ./src/main/js/section-to-sidebar-items.js


const HEADER_SELECTOR = ".config-table .jenkins-app-bar h2, .config-table > .jenkins-section > .jenkins-section__title";
const DEFAULT_ICON = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><path d=\"M262.29 192.31a64 64 0 1057.4 57.4 64.13 64.13 0 00-57.4-57.4zM416.39 256a154.34 154.34 0 01-1.53 20.79l45.21 35.46a10.81 10.81 0 012.45 13.75l-42.77 74a10.81 10.81 0 01-13.14 4.59l-44.9-18.08a16.11 16.11 0 00-15.17 1.75A164.48 164.48 0 01325 400.8a15.94 15.94 0 00-8.82 12.14l-6.73 47.89a11.08 11.08 0 01-10.68 9.17h-85.54a11.11 11.11 0 01-10.69-8.87l-6.72-47.82a16.07 16.07 0 00-9-12.22 155.3 155.3 0 01-21.46-12.57 16 16 0 00-15.11-1.71l-44.89 18.07a10.81 10.81 0 01-13.14-4.58l-42.77-74a10.8 10.8 0 012.45-13.75l38.21-30a16.05 16.05 0 006-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 00-6.07-13.94l-38.19-30A10.81 10.81 0 0149.48 186l42.77-74a10.81 10.81 0 0113.14-4.59l44.9 18.08a16.11 16.11 0 0015.17-1.75A164.48 164.48 0 01187 111.2a15.94 15.94 0 008.82-12.14l6.73-47.89A11.08 11.08 0 01213.23 42h85.54a11.11 11.11 0 0110.69 8.87l6.72 47.82a16.07 16.07 0 009 12.22 155.3 155.3 0 0121.46 12.57 16 16 0 0015.11 1.71l44.89-18.07a10.81 10.81 0 0113.14 4.58l42.77 74a10.8 10.8 0 01-2.45 13.75l-38.21 30a16.05 16.05 0 00-6.05 14.08c.33 4.14.55 8.3.55 12.47z\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"32\"/></svg>";
window.addEventListener("load", function () {
  const sidebar = document.querySelector("#tasks");
  const sectionHeaders = document.querySelectorAll(HEADER_SELECTOR); // Ensure sidebar is sticky

  sidebar.style.position = "sticky";
  sidebar.style.top = "calc(".concat(page.breadcrumbBarHeight(), "px + 1.6rem)"); // Create the sidebar items

  sectionHeaders.forEach(function (header, i) {
    const headerId = toId(header.textContent);
    header.id = headerId;
    const icon = header.querySelector("svg") ? header.querySelector("svg").outerHTML : DEFAULT_ICON;
    const item = createElementFromHtml("\n        <div class=\"task\">\n            <span class=\"task-link-wrapper\">\n                <button data-section-id=".concat(headerId, " class=\"task-link\">\n                    <span class=\"task-icon-link\">\n                        ").concat(icon, "\n                    </span>\n                    <span class=\"task-link-text\">\n                        ").concat(header.textContent, "\n                    </span>\n                </button>\n            </span>\n        </div>\n    "));
    item.addEventListener("click", () => {
      const headerToScrollTo = document.getElementById(item.querySelector(".task-link").dataset.sectionId);
      document.documentElement.scrollTop = i === 0 ? 0 : headerToScrollTo.getBoundingClientRect().top + window.scrollY - 70;
    });
    sidebar.insertAdjacentElement("beforeend", item);
  }); // TODO - Remove when Matrix-Project plugin has been updated to only have one enable/disable project toggle
  // Having multiple toggles on the same page for the same field corrupts submission for that field, so
  // remove all but the first

  document.querySelectorAll(".jenkins-form-item + span input[name='enable']").forEach(input => {
    input.parentElement.remove();
  });
  document.addEventListener("scroll", () => onScroll());
  onScroll();
});
/**
 * Change the selected item depending on the user's vertical scroll position
 */

function onScroll() {
  const scrollY = Math.max(window.scrollY, 0);
  const sectionHeaders = document.querySelectorAll(HEADER_SELECTOR);
  let selectedSection = null; // Calculate the top and height of each section to know when to switch selected sidebar item

  sectionHeaders.forEach(function (section, i) {
    const previousSection = i === 1 ? document.querySelectorAll(".jenkins-section")[0] : sectionHeaders[Math.max(i - 1, 0)].parentNode;
    const viewportEntryOffset = i === 0 ? 0 : section.parentNode.getBoundingClientRect().top + window.scrollY - previousSection.offsetHeight / 2;

    if (scrollY >= viewportEntryOffset) {
      selectedSection = section;
    }
  });
  document.querySelectorAll(".task-link--active").forEach(function (selected) {
    selected.classList.remove("task-link--active");
  });
  document.querySelector(".task-link[data-section-id='" + selectedSection.id + "']").classList.add("task-link--active");
}

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/runtimeId */
/******/ 	!function() {
/******/ 		__webpack_require__.j = 609;
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			609: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkjenkins_ui"] = self["webpackChunkjenkins_ui"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	!function() {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [216], function() { return __webpack_require__(186); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=section-to-sidebar-items.js.map