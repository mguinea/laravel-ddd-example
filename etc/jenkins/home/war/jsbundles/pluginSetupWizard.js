/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 553:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ id; }
/* harmony export */ });
function id(str) {
  return ("" + str).replace(/\W+/g, "_");
}

/***/ }),

/***/ 6664:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./.yarn/cache/jquery-npm-3.6.0-ca7872bdbb-8fd5fef4aa.zip/node_modules/jquery/dist/jquery.js
var jquery = __webpack_require__(7601);
var jquery_default = /*#__PURE__*/__webpack_require__.n(jquery);
// EXTERNAL MODULE: ./.yarn/cache/handlebars-npm-3.0.8-9f5246b0fd-79e80cfcd5.zip/node_modules/handlebars/runtime.js
var runtime = __webpack_require__(3449);
var runtime_default = /*#__PURE__*/__webpack_require__.n(runtime);
// EXTERNAL MODULE: ./.yarn/cache/window-handle-npm-1.0.1-369b8e9cbe-8f2c183a0d.zip/node_modules/window-handle/index.js
var window_handle = __webpack_require__(30);
;// CONCATENATED MODULE: ./src/main/js/util/jenkins.js
/**
 * Jenkins JS Modules common utility functions
 */



var debug = false;
var jenkins = {}; // gets the base Jenkins URL including context path

jenkins.baseUrl = function () {
  var u = jquery_default()("head").attr("data-rooturl");

  if (!u) {
    u = "";
  }

  return u;
}; // awful hack to get around JSONifying things with Prototype taking over wrong. ugh. Prototype is the worst.


jenkins.stringify = function (o) {
  if (Array.prototype.toJSON) {
    // Prototype f's this up something bad
    var protoJSON = {
      a: Array.prototype.toJSON,
      o: Object.prototype.toJSON,
      h: Hash.prototype.toJSON,
      s: String.prototype.toJSON
    };

    try {
      delete Array.prototype.toJSON;
      delete Object.prototype.toJSON;
      delete Hash.prototype.toJSON;
      delete String.prototype.toJSON;
      return JSON.stringify(o);
    } finally {
      if (protoJSON.a) {
        Array.prototype.toJSON = protoJSON.a;
      }

      if (protoJSON.o) {
        Object.prototype.toJSON = protoJSON.o;
      }

      if (protoJSON.h) {
        Hash.prototype.toJSON = protoJSON.h;
      }

      if (protoJSON.s) {
        String.prototype.toJSON = protoJSON.s;
      }
    }
  } else {
    return JSON.stringify(o);
  }
};
/**
 * redirect
 */


jenkins.goTo = function (url) {
  window_handle.getWindow().location.replace(jenkins.baseUrl() + url);
};
/**
 * Jenkins AJAX GET callback.
 * If last parameter is an object, will be extended to jQuery options (e.g. pass { error: function() ... } to handle errors)
 */


jenkins.get = function (url, success, options) {
  if (debug) {
    console.log("get: " + url);
  }

  var args = {
    url: jenkins.baseUrl() + url,
    type: "GET",
    cache: false,
    dataType: "json",
    success: success
  };

  if (options instanceof Object) {
    jquery_default().extend(args, options);
  }

  jquery_default().ajax(args);
};
/**
 * Jenkins AJAX POST callback, formats data as a JSON object post (note: works around prototype.js ugliness using stringify() above)
 * If last parameter is an object, will be extended to jQuery options (e.g. pass { error: function() ... } to handle errors)
 */


jenkins.post = function (url, data, success, options) {
  if (debug) {
    console.log("post: " + url);
  } // handle crumbs


  var headers = {};
  var wnd = window_handle.getWindow();
  var crumb;

  if ("crumb" in options) {
    crumb = options.crumb;
  } else if ("crumb" in wnd) {
    crumb = wnd.crumb;
  }

  if (crumb) {
    headers[crumb.fieldName] = crumb.value;
  }

  var formBody = data;

  if (formBody instanceof Object) {
    if (crumb) {
      formBody = jquery_default().extend({}, formBody);
      formBody[crumb.fieldName] = crumb.value;
    }

    formBody = jenkins.stringify(formBody);
  }

  var args = {
    url: jenkins.baseUrl() + url,
    type: "POST",
    cache: false,
    dataType: "json",
    data: formBody,
    contentType: "application/json",
    success: success,
    headers: headers
  };

  if (options instanceof Object) {
    jquery_default().extend(args, options);
  }

  jquery_default().ajax(args);
};
/**
 *  handlebars setup, done for backwards compatibility because some plugins depend on it
 */


jenkins.initHandlebars = function () {
  return (runtime_default());
};
/**
 * Load translations for the given bundle ID, provide the message object to the handler.
 * Optional error handler as the last argument.
 */


jenkins.loadTranslations = function (bundleName, handler, onError) {
  jenkins.get("/i18n/resourceBundle?baseName=" + bundleName, function (res) {
    if (res.status !== "ok") {
      if (onError) {
        onError(res.message);
      }

      throw "Unable to load localization data: " + res.message;
    }

    var translations = res.data;

    if ("undefined" !== typeof Proxy) {
      translations = new Proxy(translations, {
        get: function (target, property) {
          if (property in target) {
            return target[property];
          }

          if (debug) {
            console.log('"' + property + '" not found in translation bundle.');
          }

          return property;
        }
      });
    }

    handler(translations);
  });
};
/**
 * Runs a connectivity test, calls handler with a boolean whether there is sufficient connectivity to the internet
 */


jenkins.testConnectivity = function (siteId, handler) {
  // check the connectivity api
  var testConnectivity = function () {
    jenkins.get("/updateCenter/connectionStatus?siteId=" + siteId, function (response) {
      if (response.status !== "ok") {
        handler(false, true, response.message);
      } // Define statuses, which need additional check iteration via async job on the Jenkins master
      // Statuses like "OK" or "SKIPPED" are considered as fine.


      var uncheckedStatuses = ["PRECHECK", "CHECKING", "UNCHECKED"];

      if (uncheckedStatuses.indexOf(response.data.updatesite) >= 0 || uncheckedStatuses.indexOf(response.data.internet) >= 0) {
        setTimeout(testConnectivity, 100);
      } else {
        // Update site should be always reachable, but we do not require the internet connection
        // if it's explicitly skipped by the update center
        if (response.status !== "ok" || response.data.updatesite !== "OK" || response.data.internet !== "OK" && response.data.internet !== "SKIPPED") {
          // no connectivity, but not fatal
          handler(false, false);
        } else {
          handler(true);
        }
      }
    }, {
      error: function (xhr, textStatus, errorThrown) {
        if (xhr.status === 403) {
          jenkins.goTo("/login");
        } else {
          handler.call({
            isError: true,
            errorMessage: errorThrown
          });
        }
      }
    });
  };

  testConnectivity();
};
/**
 * gets the window containing a form, taking in to account top-level iframes
 */


jenkins.getWindow = function ($form) {
  $form = jquery_default()($form);
  var wnd = window_handle.getWindow();
  jquery_default()(top.document).find("iframe").each(function () {
    var windowFrame = this.contentWindow;
    var $f = jquery_default()(this).contents().find("form");
    $f.each(function () {
      if ($form[0] === this) {
        wnd = windowFrame;
      }
    });
  });
  return wnd;
};
/**
 * Builds a stapler form post
 */


jenkins.buildFormPost = function ($form) {
  $form = jquery_default()($form);
  var wnd = jenkins.getWindow($form);
  var form = $form[0];

  if (wnd.buildFormTree(form)) {
    return $form.serialize() + "&" + jquery_default().param({
      "core:apply": "",
      Submit: "Save",
      json: $form.find("input[name=json]").val()
    });
  }

  return "";
};
/**
 * Gets the crumb, if crumbs are enabled
 */


jenkins.getFormCrumb = function ($form) {
  $form = jquery_default()($form);
  var wnd = jenkins.getWindow($form);
  return wnd.crumb;
};
/**
 * Jenkins Stapler JSON POST callback
 * If last parameter is an object, will be extended to jQuery options (e.g. pass { error: function() ... } to handle errors)
 */


jenkins.staplerPost = function (url, $form, success, options) {
  $form = jquery_default()($form);
  var postBody = jenkins.buildFormPost($form);
  var crumb = jenkins.getFormCrumb($form);
  jenkins.post(url, postBody, success, jquery_default().extend({
    processData: false,
    contentType: "application/x-www-form-urlencoded",
    crumb: crumb
  }, options));
};

/* harmony default export */ var util_jenkins = (jenkins);
;// CONCATENATED MODULE: ./src/main/js/api/pluginManager.js
/**
 * Provides a wrapper to interact with the plugin manager & update center
 */
 //Get plugin info (plugins + recommended plugin list) from update centers.

var plugins;
var pluginManager = {};

pluginManager.initialPluginList = function (handler) {
  util_jenkins.get("/setupWizard/platformPluginList", function (response) {
    if (response.status !== "ok") {
      handler.call({
        isError: true,
        data: response.data
      });
      return;
    }

    handler.call({
      isError: false
    }, response.data);
  }, {
    timeout: pluginManagerErrorTimeoutMillis,
    error: function (xhr, textStatus, errorThrown) {
      handler.call({
        isError: true,
        errorMessage: errorThrown
      });
    }
  });
}; // Call this to initialize the plugin list


pluginManager.init = function (handler) {
  pluginManager.initialPluginList(function (initialPluginCategories) {
    plugins = {};
    plugins.names = [];
    plugins.recommendedPlugins = [];
    plugins.availablePlugins = initialPluginCategories;

    for (var i = 0; i < initialPluginCategories.length; i++) {
      var pluginCategory = initialPluginCategories[i];
      var categoryPlugins = pluginCategory.plugins;

      for (var ii = 0; ii < categoryPlugins.length; ii++) {
        var plugin = categoryPlugins[ii];
        var pluginName = plugin.name;

        if (plugins.names.indexOf(pluginName) === -1) {
          plugins.names.push(pluginName);

          if (plugin.suggested) {
            plugins.recommendedPlugins.push(pluginName);
          } else if (pluginCategory.category === "Languages") {
            var language = window.navigator.userLanguage || window.navigator.language;
            var code = language.toLocaleLowerCase();

            if (pluginName === "localization-" + code) {
              plugins.recommendedPlugins.push(pluginName);
            }
          }
        }
      }
    }

    handler();
  });
}; // default 10 seconds for AJAX responses to return before triggering an error condition


var pluginManagerErrorTimeoutMillis = 10 * 1000;
/**
 * Get the curated list of plugins to be offered in the wizard.
 * @returns The curated list of plugins to be offered in the wizard.
 */

pluginManager.plugins = function () {
  return plugins.availablePlugins;
};
/**
 * Get the curated list of plugins to be offered in the wizard by name only.
 * @returns The curated list of plugins to be offered in the wizard by name only.
 */


pluginManager.pluginNames = function () {
  return plugins.names;
};
/**
 * Get the subset of plugins (subset of the plugin list) that are recommended by default.
 * <p>
 * The user can easily change this selection.
 * @returns The subset of plugins (subset of the plugin list) that are recommended by default.
 */


pluginManager.recommendedPluginNames = function () {
  return plugins.recommendedPlugins.slice(); // copy this
};
/**
 * Call this function to install plugins, will pass a correlationId to the complete callback which
 * may be used to restrict further calls getting plugin lists. Note: do not use the correlation id.
 * If handler is called with this.isError, there will be a corresponding this.errorMessage indicating
 * the failure reason
 */


pluginManager.installPlugins = function (plugins, handler) {
  util_jenkins.post("/pluginManager/installPlugins", {
    dynamicLoad: true,
    plugins: plugins
  }, function (response) {
    if (response.status !== "ok") {
      handler.call({
        isError: true,
        errorMessage: response.message
      });
      return;
    }

    handler.call({
      isError: false
    }, response.data.correlationId);
  }, {
    timeout: pluginManagerErrorTimeoutMillis,
    error: function (xhr, textStatus, errorThrown) {
      handler.call({
        isError: true,
        errorMessage: errorThrown
      });
    }
  });
};
/**
 * Accepts 1 or 2 arguments, if argument 2 is not provided all installing plugins will be passed
 * to the handler function. If argument 2 is non-null, it will be treated as a correlationId, which
 * must be retrieved from a prior installPlugins call.
 */


pluginManager.installStatus = function (handler, correlationId) {
  var url = "/updateCenter/installStatus";

  if (correlationId !== undefined) {
    url += "?correlationId=" + correlationId;
  }

  util_jenkins.get(url, function (response) {
    if (response.status !== "ok") {
      handler.call({
        isError: true,
        errorMessage: response.message
      });
      return;
    }

    handler.call({
      isError: false
    }, response.data);
  }, {
    timeout: pluginManagerErrorTimeoutMillis,
    error: function (xhr, textStatus, errorThrown) {
      handler.call({
        isError: true,
        errorMessage: errorThrown
      });
    }
  });
};
/**
 * Provides a list of the available plugins, some useful properties is:
 * [
 * 	{ name, title, excerpt, dependencies[], ... },
 *  ...
 * ]
 */


pluginManager.availablePlugins = function (handler) {
  util_jenkins.get("/pluginManager/plugins", function (response) {
    if (response.status !== "ok") {
      handler.call({
        isError: true,
        errorMessage: response.message
      });
      return;
    }

    handler.call({
      isError: false
    }, response.data);
  }, {
    timeout: pluginManagerErrorTimeoutMillis,
    error: function (xhr, textStatus, errorThrown) {
      handler.call({
        isError: true,
        errorMessage: errorThrown
      });
    }
  });
};

pluginManager.availablePluginsSearch = function (query, limit, handler) {
  util_jenkins.get("/pluginManager/pluginsSearch?query=" + query + "&limit=" + limit, function (response) {
    if (response.status !== "ok") {
      handler.call({
        isError: true,
        errorMessage: response.message
      });
      return;
    }

    handler.call({
      isError: false
    }, response.data);
  }, {
    timeout: pluginManagerErrorTimeoutMillis,
    error: function (xhr, textStatus, errorThrown) {
      handler.call({
        isError: true,
        errorMessage: errorThrown
      });
    }
  });
};
/**
 * Accepts 1 or 2 arguments, if argument 2 is not provided all installing plugins will be passed
 * to the handler function. If argument 2 is non-null, it will be treated as a correlationId, which
 * must be retrieved from a prior installPlugins call.
 */


pluginManager.incompleteInstallStatus = function (handler, correlationId) {
  var url = "/updateCenter/incompleteInstallStatus";

  if (correlationId !== undefined) {
    url += "?correlationId=" + correlationId;
  }

  util_jenkins.get(url, function (response) {
    if (response.status !== "ok") {
      handler.call({
        isError: true,
        errorMessage: response.message
      });
      return;
    }

    handler.call({
      isError: false
    }, response.data);
  }, {
    timeout: pluginManagerErrorTimeoutMillis,
    error: function (xhr, textStatus, errorThrown) {
      handler.call({
        isError: true,
        errorMessage: errorThrown
      });
    }
  });
};
/**
 * Call this to complete the installation without installing anything
 */


pluginManager.completeInstall = function (handler) {
  util_jenkins.post("/setupWizard/completeInstall", {}, function () {
    handler.call({
      isError: false
    });
  }, {
    timeout: pluginManagerErrorTimeoutMillis,
    error: function (xhr, textStatus, errorThrown) {
      handler.call({
        isError: true,
        message: errorThrown
      });
    }
  });
};
/**
 * Indicates there is a restart required to complete plugin installations
 */


pluginManager.getRestartStatus = function (handler) {
  util_jenkins.get("/setupWizard/restartStatus", function (response) {
    handler.call({
      isError: false
    }, response.data);
  }, {
    timeout: pluginManagerErrorTimeoutMillis,
    error: function (xhr, textStatus, errorThrown) {
      handler.call({
        isError: true,
        message: errorThrown
      });
    }
  });
};
/**
 * Skip failed plugins, continue
 */


pluginManager.installPluginsDone = function (handler) {
  util_jenkins.post("/pluginManager/installPluginsDone", {}, function () {
    handler();
  }, {
    timeout: pluginManagerErrorTimeoutMillis,
    error: function (xhr, textStatus, errorThrown) {
      handler.call({
        isError: true,
        message: errorThrown
      });
    }
  });
};
/**
 * Restart Jenkins
 */


pluginManager.restartJenkins = function (handler) {
  util_jenkins.post("/updateCenter/safeRestart", {}, function () {
    handler.call({
      isError: false
    });
  }, {
    timeout: pluginManagerErrorTimeoutMillis,
    error: function (xhr, textStatus, errorThrown) {
      handler.call({
        isError: true,
        message: errorThrown
      });
    }
  });
};

/* harmony default export */ var api_pluginManager = (pluginManager);
;// CONCATENATED MODULE: ./src/main/js/api/securityConfig.js


/**
 * Provides a wrapper to interact with the security configuration
 */

/*
 * Calls a stapler post method to save the first user settings
 */

function saveFirstUser($form, success, error) {
  util_jenkins.staplerPost("/setupWizard/createAdminUser", $form, function (response) {
    var crumbRequestField = response.data.crumbRequestField;

    if (crumbRequestField) {
      (0,window_handle.getWindow)().crumb.init(crumbRequestField, response.data.crumb);
    }

    success(response);
  }, {
    error: error
  });
}

function saveConfigureInstance($form, success, error) {
  util_jenkins.staplerPost("/setupWizard/configureInstance", $form, function (response) {
    var crumbRequestField = response.data.crumbRequestField;

    if (crumbRequestField) {
      (0,window_handle.getWindow)().crumb.init(crumbRequestField, response.data.crumb);
    }

    success(response);
  }, {
    error: error
  });
}
/**
 * Calls a stapler post method to save the first user settings
 */


function saveProxy($form, success, error) {
  util_jenkins.staplerPost("/pluginManager/proxyConfigure", $form, success, {
    dataType: "html",
    error: error
  });
}

/* harmony default export */ var securityConfig = ({
  saveFirstUser: saveFirstUser,
  saveConfigureInstance: saveConfigureInstance,
  saveProxy: saveProxy
});
// EXTERNAL MODULE: ./src/main/js/handlebars-helpers/id.js
var id = __webpack_require__(553);
;// CONCATENATED MODULE: ./src/main/js/plugin-setup-wizard/bootstrap-detached.js

/**
 * Manual replacement for the bootstrap-detached library. We cannot use that one due to the way JS-imports are set
 *
 * Contrary to the bootstrap-detached lib, this one polutes the received jQuery instance
 */

function enhanceJQueryWithBootstrap($) {
  var window = (0,window_handle.getWindow)();
  var _$ = window.$;
  var _jQuery = window.jQuery;

  try {
    var jQuery = $;
    window.$ = $;
    window.jQuery = $;
    var document = window.document;
    /* ---------------------------------------------------- Bootstrap 3 minified ---------------------------------------------------- */

    /*!
     * Bootstrap v3.3.5 (http://getbootstrap.com)
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under the MIT license
     */

    if ("undefined" == typeof jQuery) throw new Error("Bootstrap's JavaScript requires jQuery");
    +function (a) {
      "use strict";

      var b = a.fn.jquery.split(" ")[0].split(".");
      if (b[0] < 2 && b[1] < 9 || 1 == b[0] && 9 == b[1] && b[2] < 1) throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher");
    }(jQuery), +function (a) {
      "use strict";

      function b() {
        var a = document.createElement("bootstrap"),
            b = {
          WebkitTransition: "webkitTransitionEnd",
          MozTransition: "transitionend",
          OTransition: "oTransitionEnd otransitionend",
          transition: "transitionend"
        };

        for (var c in b) if (void 0 !== a.style[c]) return {
          end: b[c]
        };

        return !1;
      }

      a.fn.emulateTransitionEnd = function (b) {
        var c = !1,
            d = this;
        a(this).one("bsTransitionEnd", function () {
          c = !0;
        });

        var e = function () {
          c || a(d).trigger(a.support.transition.end);
        };

        return setTimeout(e, b), this;
      }, a(function () {
        a.support.transition = b(), a.support.transition && (a.event.special.bsTransitionEnd = {
          bindType: a.support.transition.end,
          delegateType: a.support.transition.end,
          handle: function (b) {
            return a(b.target).is(this) ? b.handleObj.handler.apply(this, arguments) : void 0;
          }
        });
      });
    }(jQuery), +function (a) {
      "use strict";

      function b(b) {
        return this.each(function () {
          var c = a(this),
              e = c.data("bs.alert");
          e || c.data("bs.alert", e = new d(this)), "string" == typeof b && e[b].call(c);
        });
      }

      var c = '[data-dismiss="alert"]',
          d = function (b) {
        a(b).on("click", c, this.close);
      };

      d.VERSION = "3.3.5", d.TRANSITION_DURATION = 150, d.prototype.close = function (b) {
        function c() {
          g.detach().trigger("closed.bs.alert").remove();
        }

        var e = a(this),
            f = e.attr("data-target");
        f || (f = e.attr("href"), f = f && f.replace(/.*(?=#[^\s]*$)/, ""));
        var g = a(f);
        b && b.preventDefault(), g.length || (g = e.closest(".alert")), g.trigger(b = a.Event("close.bs.alert")), b.isDefaultPrevented() || (g.removeClass("in"), a.support.transition && g.hasClass("fade") ? g.one("bsTransitionEnd", c).emulateTransitionEnd(d.TRANSITION_DURATION) : c());
      };
      var e = a.fn.alert;
      a.fn.alert = b, a.fn.alert.Constructor = d, a.fn.alert.noConflict = function () {
        return a.fn.alert = e, this;
      }, a(document).on("click.bs.alert.data-api", c, d.prototype.close);
    }(jQuery), +function (a) {
      "use strict";

      function b(b) {
        return this.each(function () {
          var d = a(this),
              e = d.data("bs.button"),
              f = "object" == typeof b && b;
          e || d.data("bs.button", e = new c(this, f)), "toggle" == b ? e.toggle() : b && e.setState(b);
        });
      }

      var c = function (b, d) {
        this.$element = a(b), this.options = a.extend({}, c.DEFAULTS, d), this.isLoading = !1;
      };

      c.VERSION = "3.3.5", c.DEFAULTS = {
        loadingText: "loading..."
      }, c.prototype.setState = function (b) {
        var c = "disabled",
            d = this.$element,
            e = d.is("input") ? "val" : "html",
            f = d.data();
        b += "Text", null == f.resetText && d.data("resetText", d[e]()), setTimeout(a.proxy(function () {
          d[e](null == f[b] ? this.options[b] : f[b]), "loadingText" == b ? (this.isLoading = !0, d.addClass(c).attr(c, c)) : this.isLoading && (this.isLoading = !1, d.removeClass(c).removeAttr(c));
        }, this), 0);
      }, c.prototype.toggle = function () {
        var a = !0,
            b = this.$element.closest('[data-toggle="buttons"]');

        if (b.length) {
          var c = this.$element.find("input");
          "radio" == c.prop("type") ? (c.prop("checked") && (a = !1), b.find(".active").removeClass("active"), this.$element.addClass("active")) : "checkbox" == c.prop("type") && (c.prop("checked") !== this.$element.hasClass("active") && (a = !1), this.$element.toggleClass("active")), c.prop("checked", this.$element.hasClass("active")), a && c.trigger("change");
        } else this.$element.attr("aria-pressed", !this.$element.hasClass("active")), this.$element.toggleClass("active");
      };
      var d = a.fn.button;
      a.fn.button = b, a.fn.button.Constructor = c, a.fn.button.noConflict = function () {
        return a.fn.button = d, this;
      }, a(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function (c) {
        var d = a(c.target);
        d.hasClass("btn") || (d = d.closest(".btn")), b.call(d, "toggle"), a(c.target).is('input[type="radio"]') || a(c.target).is('input[type="checkbox"]') || c.preventDefault();
      }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function (b) {
        a(b.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(b.type));
      });
    }(jQuery), +function (a) {
      "use strict";

      function b(b) {
        return this.each(function () {
          var d = a(this),
              e = d.data("bs.carousel"),
              f = a.extend({}, c.DEFAULTS, d.data(), "object" == typeof b && b),
              g = "string" == typeof b ? b : f.slide;
          e || d.data("bs.carousel", e = new c(this, f)), "number" == typeof b ? e.to(b) : g ? e[g]() : f.interval && e.pause().cycle();
        });
      }

      var c = function (b, c) {
        this.$element = a(b), this.$indicators = this.$element.find(".carousel-indicators"), this.options = c, this.paused = null, this.sliding = null, this.interval = null, this.$active = null, this.$items = null, this.options.keyboard && this.$element.on("keydown.bs.carousel", a.proxy(this.keydown, this)), "hover" == this.options.pause && !("ontouchstart" in document.documentElement) && this.$element.on("mouseenter.bs.carousel", a.proxy(this.pause, this)).on("mouseleave.bs.carousel", a.proxy(this.cycle, this));
      };

      c.VERSION = "3.3.5", c.TRANSITION_DURATION = 600, c.DEFAULTS = {
        interval: 5e3,
        pause: "hover",
        wrap: !0,
        keyboard: !0
      }, c.prototype.keydown = function (a) {
        if (!/input|textarea/i.test(a.target.tagName)) {
          switch (a.which) {
            case 37:
              this.prev();
              break;

            case 39:
              this.next();
              break;

            default:
              return;
          }

          a.preventDefault();
        }
      }, c.prototype.cycle = function (b) {
        return b || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(a.proxy(this.next, this), this.options.interval)), this;
      }, c.prototype.getItemIndex = function (a) {
        return this.$items = a.parent().children(".item"), this.$items.index(a || this.$active);
      }, c.prototype.getItemForDirection = function (a, b) {
        var c = this.getItemIndex(b),
            d = "prev" == a && 0 === c || "next" == a && c == this.$items.length - 1;
        if (d && !this.options.wrap) return b;
        var e = "prev" == a ? -1 : 1,
            f = (c + e) % this.$items.length;
        return this.$items.eq(f);
      }, c.prototype.to = function (a) {
        var b = this,
            c = this.getItemIndex(this.$active = this.$element.find(".item.active"));
        return a > this.$items.length - 1 || 0 > a ? void 0 : this.sliding ? this.$element.one("slid.bs.carousel", function () {
          b.to(a);
        }) : c == a ? this.pause().cycle() : this.slide(a > c ? "next" : "prev", this.$items.eq(a));
      }, c.prototype.pause = function (b) {
        return b || (this.paused = !0), this.$element.find(".next, .prev").length && a.support.transition && (this.$element.trigger(a.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this;
      }, c.prototype.next = function () {
        return this.sliding ? void 0 : this.slide("next");
      }, c.prototype.prev = function () {
        return this.sliding ? void 0 : this.slide("prev");
      }, c.prototype.slide = function (b, d) {
        var e = this.$element.find(".item.active"),
            f = d || this.getItemForDirection(b, e),
            g = this.interval,
            h = "next" == b ? "left" : "right",
            i = this;
        if (f.hasClass("active")) return this.sliding = !1;
        var j = f[0],
            k = a.Event("slide.bs.carousel", {
          relatedTarget: j,
          direction: h
        });

        if (this.$element.trigger(k), !k.isDefaultPrevented()) {
          if (this.sliding = !0, g && this.pause(), this.$indicators.length) {
            this.$indicators.find(".active").removeClass("active");
            var l = a(this.$indicators.children()[this.getItemIndex(f)]);
            l && l.addClass("active");
          }

          var m = a.Event("slid.bs.carousel", {
            relatedTarget: j,
            direction: h
          });
          return a.support.transition && this.$element.hasClass("slide") ? (f.addClass(b), f[0].offsetWidth, e.addClass(h), f.addClass(h), e.one("bsTransitionEnd", function () {
            f.removeClass([b, h].join(" ")).addClass("active"), e.removeClass(["active", h].join(" ")), i.sliding = !1, setTimeout(function () {
              i.$element.trigger(m);
            }, 0);
          }).emulateTransitionEnd(c.TRANSITION_DURATION)) : (e.removeClass("active"), f.addClass("active"), this.sliding = !1, this.$element.trigger(m)), g && this.cycle(), this;
        }
      };
      var d = a.fn.carousel;
      a.fn.carousel = b, a.fn.carousel.Constructor = c, a.fn.carousel.noConflict = function () {
        return a.fn.carousel = d, this;
      };

      var e = function (c) {
        var d,
            e = a(this),
            f = a(e.attr("data-target") || (d = e.attr("href")) && d.replace(/.*(?=#[^\s]+$)/, ""));

        if (f.hasClass("carousel")) {
          var g = a.extend({}, f.data(), e.data()),
              h = e.attr("data-slide-to");
          h && (g.interval = !1), b.call(f, g), h && f.data("bs.carousel").to(h), c.preventDefault();
        }
      };

      a(document).on("click.bs.carousel.data-api", "[data-slide]", e).on("click.bs.carousel.data-api", "[data-slide-to]", e), a(window).on("load", function () {
        a('[data-ride="carousel"]').each(function () {
          var c = a(this);
          b.call(c, c.data());
        });
      });
    }(jQuery), +function (a) {
      "use strict";

      function b(b) {
        var c,
            d = b.attr("data-target") || (c = b.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, "");
        return a(d);
      }

      function c(b) {
        return this.each(function () {
          var c = a(this),
              e = c.data("bs.collapse"),
              f = a.extend({}, d.DEFAULTS, c.data(), "object" == typeof b && b);
          !e && f.toggle && /show|hide/.test(b) && (f.toggle = !1), e || c.data("bs.collapse", e = new d(this, f)), "string" == typeof b && e[b]();
        });
      }

      var d = function (b, c) {
        this.$element = a(b), this.options = a.extend({}, d.DEFAULTS, c), this.$trigger = a('[data-toggle="collapse"][href="#' + b.id + '"],[data-toggle="collapse"][data-target="#' + b.id + '"]'), this.transitioning = null, this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger), this.options.toggle && this.toggle();
      };

      d.VERSION = "3.3.5", d.TRANSITION_DURATION = 350, d.DEFAULTS = {
        toggle: !0
      }, d.prototype.dimension = function () {
        var a = this.$element.hasClass("width");
        return a ? "width" : "height";
      }, d.prototype.show = function () {
        if (!this.transitioning && !this.$element.hasClass("in")) {
          var b,
              e = this.$parent && this.$parent.children(".panel").children(".in, .collapsing");

          if (!(e && e.length && (b = e.data("bs.collapse"), b && b.transitioning))) {
            var f = a.Event("show.bs.collapse");

            if (this.$element.trigger(f), !f.isDefaultPrevented()) {
              e && e.length && (c.call(e, "hide"), b || e.data("bs.collapse", null));
              var g = this.dimension();
              this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded", !0), this.$trigger.removeClass("collapsed").attr("aria-expanded", !0), this.transitioning = 1;

              var h = function () {
                this.$element.removeClass("collapsing").addClass("collapse in")[g](""), this.transitioning = 0, this.$element.trigger("shown.bs.collapse");
              };

              if (!a.support.transition) return h.call(this);
              var i = a.camelCase(["scroll", g].join("-"));
              this.$element.one("bsTransitionEnd", a.proxy(h, this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i]);
            }
          }
        }
      }, d.prototype.hide = function () {
        if (!this.transitioning && this.$element.hasClass("in")) {
          var b = a.Event("hide.bs.collapse");

          if (this.$element.trigger(b), !b.isDefaultPrevented()) {
            var c = this.dimension();
            this.$element[c](this.$element[c]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1), this.$trigger.addClass("collapsed").attr("aria-expanded", !1), this.transitioning = 1;

            var e = function () {
              this.transitioning = 0, this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse");
            };

            return a.support.transition ? void this.$element[c](0).one("bsTransitionEnd", a.proxy(e, this)).emulateTransitionEnd(d.TRANSITION_DURATION) : e.call(this);
          }
        }
      }, d.prototype.toggle = function () {
        this[this.$element.hasClass("in") ? "hide" : "show"]();
      }, d.prototype.getParent = function () {
        return a(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(a.proxy(function (c, d) {
          var e = a(d);
          this.addAriaAndCollapsedClass(b(e), e);
        }, this)).end();
      }, d.prototype.addAriaAndCollapsedClass = function (a, b) {
        var c = a.hasClass("in");
        a.attr("aria-expanded", c), b.toggleClass("collapsed", !c).attr("aria-expanded", c);
      };
      var e = a.fn.collapse;
      a.fn.collapse = c, a.fn.collapse.Constructor = d, a.fn.collapse.noConflict = function () {
        return a.fn.collapse = e, this;
      }, a(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function (d) {
        var e = a(this);
        e.attr("data-target") || d.preventDefault();
        var f = b(e),
            g = f.data("bs.collapse"),
            h = g ? "toggle" : e.data();
        c.call(f, h);
      });
    }(jQuery), +function (a) {
      "use strict";

      function b(b) {
        var c = b.attr("data-target");
        c || (c = b.attr("href"), c = c && /#[A-Za-z]/.test(c) && c.replace(/.*(?=#[^\s]*$)/, ""));
        var d = c && a(c);
        return d && d.length ? d : b.parent();
      }

      function c(c) {
        c && 3 === c.which || (a(e).remove(), a(f).each(function () {
          var d = a(this),
              e = b(d),
              f = {
            relatedTarget: this
          };
          e.hasClass("open") && (c && "click" == c.type && /input|textarea/i.test(c.target.tagName) && a.contains(e[0], c.target) || (e.trigger(c = a.Event("hide.bs.dropdown", f)), c.isDefaultPrevented() || (d.attr("aria-expanded", "false"), e.removeClass("open").trigger("hidden.bs.dropdown", f))));
        }));
      }

      function d(b) {
        return this.each(function () {
          var c = a(this),
              d = c.data("bs.dropdown");
          d || c.data("bs.dropdown", d = new g(this)), "string" == typeof b && d[b].call(c);
        });
      }

      var e = ".dropdown-backdrop",
          f = '[data-toggle="dropdown"]',
          g = function (b) {
        a(b).on("click.bs.dropdown", this.toggle);
      };

      g.VERSION = "3.3.5", g.prototype.toggle = function (d) {
        var e = a(this);

        if (!e.is(".disabled, :disabled")) {
          var f = b(e),
              g = f.hasClass("open");

          if (c(), !g) {
            "ontouchstart" in document.documentElement && !f.closest(".navbar-nav").length && a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click", c);
            var h = {
              relatedTarget: this
            };
            if (f.trigger(d = a.Event("show.bs.dropdown", h)), d.isDefaultPrevented()) return;
            e.trigger("focus").attr("aria-expanded", "true"), f.toggleClass("open").trigger("shown.bs.dropdown", h);
          }

          return !1;
        }
      }, g.prototype.keydown = function (c) {
        if (/(38|40|27|32)/.test(c.which) && !/input|textarea/i.test(c.target.tagName)) {
          var d = a(this);

          if (c.preventDefault(), c.stopPropagation(), !d.is(".disabled, :disabled")) {
            var e = b(d),
                g = e.hasClass("open");
            if (!g && 27 != c.which || g && 27 == c.which) return 27 == c.which && e.find(f).trigger("focus"), d.trigger("click");
            var h = " li:not(.disabled):visible a",
                i = e.find(".dropdown-menu" + h);

            if (i.length) {
              var j = i.index(c.target);
              38 == c.which && j > 0 && j--, 40 == c.which && j < i.length - 1 && j++, ~j || (j = 0), i.eq(j).trigger("focus");
            }
          }
        }
      };
      var h = a.fn.dropdown;
      a.fn.dropdown = d, a.fn.dropdown.Constructor = g, a.fn.dropdown.noConflict = function () {
        return a.fn.dropdown = h, this;
      }, a(document).on("click.bs.dropdown.data-api", c).on("click.bs.dropdown.data-api", ".dropdown form", function (a) {
        a.stopPropagation();
      }).on("click.bs.dropdown.data-api", f, g.prototype.toggle).on("keydown.bs.dropdown.data-api", f, g.prototype.keydown).on("keydown.bs.dropdown.data-api", ".dropdown-menu", g.prototype.keydown);
    }(jQuery), +function (a) {
      "use strict";

      function b(b, d) {
        return this.each(function () {
          var e = a(this),
              f = e.data("bs.modal"),
              g = a.extend({}, c.DEFAULTS, e.data(), "object" == typeof b && b);
          f || e.data("bs.modal", f = new c(this, g)), "string" == typeof b ? f[b](d) : g.show && f.show(d);
        });
      }

      var c = function (b, c) {
        this.options = c, this.$body = a(document.body), this.$element = a(b), this.$dialog = this.$element.find(".modal-dialog"), this.$backdrop = null, this.isShown = null, this.originalBodyPad = null, this.scrollbarWidth = 0, this.ignoreBackdropClick = !1, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, a.proxy(function () {
          this.$element.trigger("loaded.bs.modal");
        }, this));
      };

      c.VERSION = "3.3.5", c.TRANSITION_DURATION = 300, c.BACKDROP_TRANSITION_DURATION = 150, c.DEFAULTS = {
        backdrop: !0,
        keyboard: !0,
        show: !0
      }, c.prototype.toggle = function (a) {
        return this.isShown ? this.hide() : this.show(a);
      }, c.prototype.show = function (b) {
        var d = this,
            e = a.Event("show.bs.modal", {
          relatedTarget: b
        });
        this.$element.trigger(e), this.isShown || e.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', a.proxy(this.hide, this)), this.$dialog.on("mousedown.dismiss.bs.modal", function () {
          d.$element.one("mouseup.dismiss.bs.modal", function (b) {
            a(b.target).is(d.$element) && (d.ignoreBackdropClick = !0);
          });
        }), this.backdrop(function () {
          var e = a.support.transition && d.$element.hasClass("fade");
          d.$element.parent().length || d.$element.appendTo(d.$body), d.$element.show().scrollTop(0), d.adjustDialog(), e && d.$element[0].offsetWidth, d.$element.addClass("in"), d.enforceFocus();
          var f = a.Event("shown.bs.modal", {
            relatedTarget: b
          });
          e ? d.$dialog.one("bsTransitionEnd", function () {
            d.$element.trigger("focus").trigger(f);
          }).emulateTransitionEnd(c.TRANSITION_DURATION) : d.$element.trigger("focus").trigger(f);
        }));
      }, c.prototype.hide = function (b) {
        b && b.preventDefault(), b = a.Event("hide.bs.modal"), this.$element.trigger(b), this.isShown && !b.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), a(document).off("focusin.bs.modal"), this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"), this.$dialog.off("mousedown.dismiss.bs.modal"), a.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", a.proxy(this.hideModal, this)).emulateTransitionEnd(c.TRANSITION_DURATION) : this.hideModal());
      }, c.prototype.enforceFocus = function () {
        a(document).off("focusin.bs.modal").on("focusin.bs.modal", a.proxy(function (a) {
          this.$element[0] === a.target || this.$element.has(a.target).length || this.$element.trigger("focus");
        }, this));
      }, c.prototype.escape = function () {
        this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", a.proxy(function (a) {
          27 == a.which && this.hide();
        }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal");
      }, c.prototype.resize = function () {
        this.isShown ? a(window).on("resize.bs.modal", a.proxy(this.handleUpdate, this)) : a(window).off("resize.bs.modal");
      }, c.prototype.hideModal = function () {
        var a = this;
        this.$element.hide(), this.backdrop(function () {
          a.$body.removeClass("modal-open"), a.resetAdjustments(), a.resetScrollbar(), a.$element.trigger("hidden.bs.modal");
        });
      }, c.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove(), this.$backdrop = null;
      }, c.prototype.backdrop = function (b) {
        var d = this,
            e = this.$element.hasClass("fade") ? "fade" : "";

        if (this.isShown && this.options.backdrop) {
          var f = a.support.transition && e;
          if (this.$backdrop = a(document.createElement("div")).addClass("modal-backdrop " + e).appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", a.proxy(function (a) {
            return this.ignoreBackdropClick ? void (this.ignoreBackdropClick = !1) : void (a.target === a.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide()));
          }, this)), f && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !b) return;
          f ? this.$backdrop.one("bsTransitionEnd", b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION) : b();
        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass("in");

          var g = function () {
            d.removeBackdrop(), b && b();
          };

          a.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION) : g();
        } else b && b();
      }, c.prototype.handleUpdate = function () {
        this.adjustDialog();
      }, c.prototype.adjustDialog = function () {
        var a = this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({
          paddingLeft: !this.bodyIsOverflowing && a ? this.scrollbarWidth : "",
          paddingRight: this.bodyIsOverflowing && !a ? this.scrollbarWidth : ""
        });
      }, c.prototype.resetAdjustments = function () {
        this.$element.css({
          paddingLeft: "",
          paddingRight: ""
        });
      }, c.prototype.checkScrollbar = function () {
        var a = window.innerWidth;

        if (!a) {
          var b = document.documentElement.getBoundingClientRect();
          a = b.right - Math.abs(b.left);
        }

        this.bodyIsOverflowing = document.body.clientWidth < a, this.scrollbarWidth = this.measureScrollbar();
      }, c.prototype.setScrollbar = function () {
        var a = parseInt(this.$body.css("padding-right") || 0, 10);
        this.originalBodyPad = document.body.style.paddingRight || "", this.bodyIsOverflowing && this.$body.css("padding-right", a + this.scrollbarWidth);
      }, c.prototype.resetScrollbar = function () {
        this.$body.css("padding-right", this.originalBodyPad);
      }, c.prototype.measureScrollbar = function () {
        var a = document.createElement("div");
        a.className = "modal-scrollbar-measure", this.$body.append(a);
        var b = a.offsetWidth - a.clientWidth;
        return this.$body[0].removeChild(a), b;
      };
      var d = a.fn.modal;
      a.fn.modal = b, a.fn.modal.Constructor = c, a.fn.modal.noConflict = function () {
        return a.fn.modal = d, this;
      }, a(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function (c) {
        var d = a(this),
            e = d.attr("href"),
            f = a(d.attr("data-target") || e && e.replace(/.*(?=#[^\s]+$)/, "")),
            g = f.data("bs.modal") ? "toggle" : a.extend({
          remote: !/#/.test(e) && e
        }, f.data(), d.data());
        d.is("a") && c.preventDefault(), f.one("show.bs.modal", function (a) {
          a.isDefaultPrevented() || f.one("hidden.bs.modal", function () {
            d.is(":visible") && d.trigger("focus");
          });
        }), b.call(f, g, this);
      });
    }(jQuery), +function (a) {
      "use strict";

      function b(b) {
        return this.each(function () {
          var d = a(this),
              e = d.data("bs.tooltip"),
              f = "object" == typeof b && b;
          (e || !/destroy|hide/.test(b)) && (e || d.data("bs.tooltip", e = new c(this, f)), "string" == typeof b && e[b]());
        });
      }

      var c = function (a, b) {
        this.type = null, this.options = null, this.enabled = null, this.timeout = null, this.hoverState = null, this.$element = null, this.inState = null, this.init("tooltip", a, b);
      };

      c.VERSION = "3.3.5", c.TRANSITION_DURATION = 150, c.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1,
        viewport: {
          selector: "body",
          padding: 0
        }
      }, c.prototype.init = function (b, c, d) {
        if (this.enabled = !0, this.type = b, this.$element = a(c), this.options = this.getOptions(d), this.$viewport = this.options.viewport && a(a.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport), this.inState = {
          click: !1,
          hover: !1,
          focus: !1
        }, this.$element[0] instanceof document.constructor && !this.options.selector) throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");

        for (var e = this.options.trigger.split(" "), f = e.length; f--;) {
          var g = e[f];
          if ("click" == g) this.$element.on("click." + this.type, this.options.selector, a.proxy(this.toggle, this));else if ("manual" != g) {
            var h = "hover" == g ? "mouseenter" : "focusin",
                i = "hover" == g ? "mouseleave" : "focusout";
            this.$element.on(h + "." + this.type, this.options.selector, a.proxy(this.enter, this)), this.$element.on(i + "." + this.type, this.options.selector, a.proxy(this.leave, this));
          }
        }

        this.options.selector ? this._options = a.extend({}, this.options, {
          trigger: "manual",
          selector: ""
        }) : this.fixTitle();
      }, c.prototype.getDefaults = function () {
        return c.DEFAULTS;
      }, c.prototype.getOptions = function (b) {
        return b = a.extend({}, this.getDefaults(), this.$element.data(), b), b.delay && "number" == typeof b.delay && (b.delay = {
          show: b.delay,
          hide: b.delay
        }), b;
      }, c.prototype.getDelegateOptions = function () {
        var b = {},
            c = this.getDefaults();
        return this._options && a.each(this._options, function (a, d) {
          c[a] != d && (b[a] = d);
        }), b;
      }, c.prototype.enter = function (b) {
        var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
        return c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)), b instanceof a.Event && (c.inState["focusin" == b.type ? "focus" : "hover"] = !0), c.tip().hasClass("in") || "in" == c.hoverState ? void (c.hoverState = "in") : (clearTimeout(c.timeout), c.hoverState = "in", c.options.delay && c.options.delay.show ? void (c.timeout = setTimeout(function () {
          "in" == c.hoverState && c.show();
        }, c.options.delay.show)) : c.show());
      }, c.prototype.isInStateTrue = function () {
        for (var a in this.inState) if (this.inState[a]) return !0;

        return !1;
      }, c.prototype.leave = function (b) {
        var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
        return c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)), b instanceof a.Event && (c.inState["focusout" == b.type ? "focus" : "hover"] = !1), c.isInStateTrue() ? void 0 : (clearTimeout(c.timeout), c.hoverState = "out", c.options.delay && c.options.delay.hide ? void (c.timeout = setTimeout(function () {
          "out" == c.hoverState && c.hide();
        }, c.options.delay.hide)) : c.hide());
      }, c.prototype.show = function () {
        var b = a.Event("show.bs." + this.type);

        if (this.hasContent() && this.enabled) {
          this.$element.trigger(b);
          var d = a.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
          if (b.isDefaultPrevented() || !d) return;
          var e = this,
              f = this.tip(),
              g = this.getUID(this.type);
          this.setContent(), f.attr("id", g), this.$element.attr("aria-describedby", g), this.options.animation && f.addClass("fade");
          var h = "function" == typeof this.options.placement ? this.options.placement.call(this, f[0], this.$element[0]) : this.options.placement,
              i = /\s?auto?\s?/i,
              j = i.test(h);
          j && (h = h.replace(i, "") || "top"), f.detach().css({
            top: 0,
            left: 0,
            display: "block"
          }).addClass(h).data("bs." + this.type, this), this.options.container ? f.appendTo(this.options.container) : f.insertAfter(this.$element), this.$element.trigger("inserted.bs." + this.type);
          var k = this.getPosition(),
              l = f[0].offsetWidth,
              m = f[0].offsetHeight;

          if (j) {
            var n = h,
                o = this.getPosition(this.$viewport);
            h = "bottom" == h && k.bottom + m > o.bottom ? "top" : "top" == h && k.top - m < o.top ? "bottom" : "right" == h && k.right + l > o.width ? "left" : "left" == h && k.left - l < o.left ? "right" : h, f.removeClass(n).addClass(h);
          }

          var p = this.getCalculatedOffset(h, k, l, m);
          this.applyPlacement(p, h);

          var q = function () {
            var a = e.hoverState;
            e.$element.trigger("shown.bs." + e.type), e.hoverState = null, "out" == a && e.leave(e);
          };

          a.support.transition && this.$tip.hasClass("fade") ? f.one("bsTransitionEnd", q).emulateTransitionEnd(c.TRANSITION_DURATION) : q();
        }
      }, c.prototype.applyPlacement = function (b, c) {
        var d = this.tip(),
            e = d[0].offsetWidth,
            f = d[0].offsetHeight,
            g = parseInt(d.css("margin-top"), 10),
            h = parseInt(d.css("margin-left"), 10);
        isNaN(g) && (g = 0), isNaN(h) && (h = 0), b.top += g, b.left += h, a.offset.setOffset(d[0], a.extend({
          using: function (a) {
            d.css({
              top: Math.round(a.top),
              left: Math.round(a.left)
            });
          }
        }, b), 0), d.addClass("in");
        var i = d[0].offsetWidth,
            j = d[0].offsetHeight;
        "top" == c && j != f && (b.top = b.top + f - j);
        var k = this.getViewportAdjustedDelta(c, b, i, j);
        k.left ? b.left += k.left : b.top += k.top;
        var l = /top|bottom/.test(c),
            m = l ? 2 * k.left - e + i : 2 * k.top - f + j,
            n = l ? "offsetWidth" : "offsetHeight";
        d.offset(b), this.replaceArrow(m, d[0][n], l);
      }, c.prototype.replaceArrow = function (a, b, c) {
        this.arrow().css(c ? "left" : "top", 50 * (1 - a / b) + "%").css(c ? "top" : "left", "");
      }, c.prototype.setContent = function () {
        var a = this.tip(),
            b = this.getTitle();
        a.find(".tooltip-inner")[this.options.html ? "html" : "text"](b), a.removeClass("fade in top bottom left right");
      }, c.prototype.hide = function (b) {
        function d() {
          "in" != e.hoverState && f.detach(), e.$element.removeAttr("aria-describedby").trigger("hidden.bs." + e.type), b && b();
        }

        var e = this,
            f = a(this.$tip),
            g = a.Event("hide.bs." + this.type);
        return this.$element.trigger(g), g.isDefaultPrevented() ? void 0 : (f.removeClass("in"), a.support.transition && f.hasClass("fade") ? f.one("bsTransitionEnd", d).emulateTransitionEnd(c.TRANSITION_DURATION) : d(), this.hoverState = null, this);
      }, c.prototype.fixTitle = function () {
        var a = this.$element;
        (a.attr("title") || "string" != typeof a.attr("data-original-title")) && a.attr("data-original-title", a.attr("title") || "").attr("title", "");
      }, c.prototype.hasContent = function () {
        return this.getTitle();
      }, c.prototype.getPosition = function (b) {
        b = b || this.$element;
        var c = b[0],
            d = "BODY" == c.tagName,
            e = c.getBoundingClientRect();
        null == e.width && (e = a.extend({}, e, {
          width: e.right - e.left,
          height: e.bottom - e.top
        }));
        var f = d ? {
          top: 0,
          left: 0
        } : b.offset(),
            g = {
          scroll: d ? document.documentElement.scrollTop || document.body.scrollTop : b.scrollTop()
        },
            h = d ? {
          width: a(window).width(),
          height: a(window).height()
        } : null;
        return a.extend({}, e, g, h, f);
      }, c.prototype.getCalculatedOffset = function (a, b, c, d) {
        return "bottom" == a ? {
          top: b.top + b.height,
          left: b.left + b.width / 2 - c / 2
        } : "top" == a ? {
          top: b.top - d,
          left: b.left + b.width / 2 - c / 2
        } : "left" == a ? {
          top: b.top + b.height / 2 - d / 2,
          left: b.left - c
        } : {
          top: b.top + b.height / 2 - d / 2,
          left: b.left + b.width
        };
      }, c.prototype.getViewportAdjustedDelta = function (a, b, c, d) {
        var e = {
          top: 0,
          left: 0
        };
        if (!this.$viewport) return e;
        var f = this.options.viewport && this.options.viewport.padding || 0,
            g = this.getPosition(this.$viewport);

        if (/right|left/.test(a)) {
          var h = b.top - f - g.scroll,
              i = b.top + f - g.scroll + d;
          h < g.top ? e.top = g.top - h : i > g.top + g.height && (e.top = g.top + g.height - i);
        } else {
          var j = b.left - f,
              k = b.left + f + c;
          j < g.left ? e.left = g.left - j : k > g.right && (e.left = g.left + g.width - k);
        }

        return e;
      }, c.prototype.getTitle = function () {
        var a,
            b = this.$element,
            c = this.options;
        return a = b.attr("data-original-title") || ("function" == typeof c.title ? c.title.call(b[0]) : c.title);
      }, c.prototype.getUID = function (a) {
        do a += ~~(1e6 * Math.random()); while (document.getElementById(a));

        return a;
      }, c.prototype.tip = function () {
        if (!this.$tip && (this.$tip = a(this.options.template), 1 != this.$tip.length)) throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
        return this.$tip;
      }, c.prototype.arrow = function () {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow");
      }, c.prototype.enable = function () {
        this.enabled = !0;
      }, c.prototype.disable = function () {
        this.enabled = !1;
      }, c.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled;
      }, c.prototype.toggle = function (b) {
        var c = this;
        b && (c = a(b.currentTarget).data("bs." + this.type), c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c))), b ? (c.inState.click = !c.inState.click, c.isInStateTrue() ? c.enter(c) : c.leave(c)) : c.tip().hasClass("in") ? c.leave(c) : c.enter(c);
      }, c.prototype.destroy = function () {
        var a = this;
        clearTimeout(this.timeout), this.hide(function () {
          a.$element.off("." + a.type).removeData("bs." + a.type), a.$tip && a.$tip.detach(), a.$tip = null, a.$arrow = null, a.$viewport = null;
        });
      };
      var d = a.fn.tooltip;
      a.fn.tooltip = b, a.fn.tooltip.Constructor = c, a.fn.tooltip.noConflict = function () {
        return a.fn.tooltip = d, this;
      };
    }(jQuery), +function (a) {
      "use strict";

      function b(b) {
        return this.each(function () {
          var d = a(this),
              e = d.data("bs.popover"),
              f = "object" == typeof b && b;
          (e || !/destroy|hide/.test(b)) && (e || d.data("bs.popover", e = new c(this, f)), "string" == typeof b && e[b]());
        });
      }

      var c = function (a, b) {
        this.init("popover", a, b);
      };

      if (!a.fn.tooltip) throw new Error("Popover requires tooltip.js");
      c.VERSION = "3.3.5", c.DEFAULTS = a.extend({}, a.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
      }), c.prototype = a.extend({}, a.fn.tooltip.Constructor.prototype), c.prototype.constructor = c, c.prototype.getDefaults = function () {
        return c.DEFAULTS;
      }, c.prototype.setContent = function () {
        var a = this.tip(),
            b = this.getTitle(),
            c = this.getContent();
        a.find(".popover-title")[this.options.html ? "html" : "text"](b), a.find(".popover-content").children().detach().end()[this.options.html ? "string" == typeof c ? "html" : "append" : "text"](c), a.removeClass("fade top bottom left right in"), a.find(".popover-title").html() || a.find(".popover-title").hide();
      }, c.prototype.hasContent = function () {
        return this.getTitle() || this.getContent();
      }, c.prototype.getContent = function () {
        var a = this.$element,
            b = this.options;
        return a.attr("data-content") || ("function" == typeof b.content ? b.content.call(a[0]) : b.content);
      }, c.prototype.arrow = function () {
        return this.$arrow = this.$arrow || this.tip().find(".arrow");
      };
      var d = a.fn.popover;
      a.fn.popover = b, a.fn.popover.Constructor = c, a.fn.popover.noConflict = function () {
        return a.fn.popover = d, this;
      };
    }(jQuery), +function (a) {
      "use strict";

      function b(c, d) {
        this.$body = a(document.body), this.$scrollElement = a(a(c).is(document.body) ? window : c), this.options = a.extend({}, b.DEFAULTS, d), this.selector = (this.options.target || "") + " .nav li > a", this.offsets = [], this.targets = [], this.activeTarget = null, this.scrollHeight = 0, this.$scrollElement.on("scroll.bs.scrollspy", a.proxy(this.process, this)), this.refresh(), this.process();
      }

      function c(c) {
        return this.each(function () {
          var d = a(this),
              e = d.data("bs.scrollspy"),
              f = "object" == typeof c && c;
          e || d.data("bs.scrollspy", e = new b(this, f)), "string" == typeof c && e[c]();
        });
      }

      b.VERSION = "3.3.5", b.DEFAULTS = {
        offset: 10
      }, b.prototype.getScrollHeight = function () {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
      }, b.prototype.refresh = function () {
        var b = this,
            c = "offset",
            d = 0;
        this.offsets = [], this.targets = [], this.scrollHeight = this.getScrollHeight(), a.isWindow(this.$scrollElement[0]) || (c = "position", d = this.$scrollElement.scrollTop()), this.$body.find(this.selector).map(function () {
          var b = a(this),
              e = b.data("target") || b.attr("href"),
              f = /^#./.test(e) && a(e);
          return f && f.length && f.is(":visible") && [[f[c]().top + d, e]] || null;
        }).sort(function (a, b) {
          return a[0] - b[0];
        }).each(function () {
          b.offsets.push(this[0]), b.targets.push(this[1]);
        });
      }, b.prototype.process = function () {
        var a,
            b = this.$scrollElement.scrollTop() + this.options.offset,
            c = this.getScrollHeight(),
            d = this.options.offset + c - this.$scrollElement.height(),
            e = this.offsets,
            f = this.targets,
            g = this.activeTarget;
        if (this.scrollHeight != c && this.refresh(), b >= d) return g != (a = f[f.length - 1]) && this.activate(a);
        if (g && b < e[0]) return this.activeTarget = null, this.clear();

        for (a = e.length; a--;) g != f[a] && b >= e[a] && (void 0 === e[a + 1] || b < e[a + 1]) && this.activate(f[a]);
      }, b.prototype.activate = function (b) {
        this.activeTarget = b, this.clear();
        var c = this.selector + '[data-target="' + b + '"],' + this.selector + '[href="' + b + '"]',
            d = a(c).parents("li").addClass("active");
        d.parent(".dropdown-menu").length && (d = d.closest("li.dropdown").addClass("active")), d.trigger("activate.bs.scrollspy");
      }, b.prototype.clear = function () {
        a(this.selector).parentsUntil(this.options.target, ".active").removeClass("active");
      };
      var d = a.fn.scrollspy;
      a.fn.scrollspy = c, a.fn.scrollspy.Constructor = b, a.fn.scrollspy.noConflict = function () {
        return a.fn.scrollspy = d, this;
      }, a(window).on("load.bs.scrollspy.data-api", function () {
        a('[data-spy="scroll"]').each(function () {
          var b = a(this);
          c.call(b, b.data());
        });
      });
    }(jQuery), +function (a) {
      "use strict";

      function b(b) {
        return this.each(function () {
          var d = a(this),
              e = d.data("bs.tab");
          e || d.data("bs.tab", e = new c(this)), "string" == typeof b && e[b]();
        });
      }

      var c = function (b) {
        this.element = a(b);
      };

      c.VERSION = "3.3.5", c.TRANSITION_DURATION = 150, c.prototype.show = function () {
        var b = this.element,
            c = b.closest("ul:not(.dropdown-menu)"),
            d = b.data("target");

        if (d || (d = b.attr("href"), d = d && d.replace(/.*(?=#[^\s]*$)/, "")), !b.parent("li").hasClass("active")) {
          var e = c.find(".active:last a"),
              f = a.Event("hide.bs.tab", {
            relatedTarget: b[0]
          }),
              g = a.Event("show.bs.tab", {
            relatedTarget: e[0]
          });

          if (e.trigger(f), b.trigger(g), !g.isDefaultPrevented() && !f.isDefaultPrevented()) {
            var h = a(d);
            this.activate(b.closest("li"), c), this.activate(h, h.parent(), function () {
              e.trigger({
                type: "hidden.bs.tab",
                relatedTarget: b[0]
              }), b.trigger({
                type: "shown.bs.tab",
                relatedTarget: e[0]
              });
            });
          }
        }
      }, c.prototype.activate = function (b, d, e) {
        function f() {
          g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1), b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0), h ? (b[0].offsetWidth, b.addClass("in")) : b.removeClass("fade"), b.parent(".dropdown-menu").length && b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0), e && e();
        }

        var g = d.find("> .active"),
            h = e && a.support.transition && (g.length && g.hasClass("fade") || !!d.find("> .fade").length);
        g.length && h ? g.one("bsTransitionEnd", f).emulateTransitionEnd(c.TRANSITION_DURATION) : f(), g.removeClass("in");
      };
      var d = a.fn.tab;
      a.fn.tab = b, a.fn.tab.Constructor = c, a.fn.tab.noConflict = function () {
        return a.fn.tab = d, this;
      };

      var e = function (c) {
        c.preventDefault(), b.call(a(this), "show");
      };

      a(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', e).on("click.bs.tab.data-api", '[data-toggle="pill"]', e);
    }(jQuery), +function (a) {
      "use strict";

      function b(b) {
        return this.each(function () {
          var d = a(this),
              e = d.data("bs.affix"),
              f = "object" == typeof b && b;
          e || d.data("bs.affix", e = new c(this, f)), "string" == typeof b && e[b]();
        });
      }

      var c = function (b, d) {
        this.options = a.extend({}, c.DEFAULTS, d), this.$target = a(this.options.target).on("scroll.bs.affix.data-api", a.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", a.proxy(this.checkPositionWithEventLoop, this)), this.$element = a(b), this.affixed = null, this.unpin = null, this.pinnedOffset = null, this.checkPosition();
      };

      c.VERSION = "3.3.5", c.RESET = "affix affix-top affix-bottom", c.DEFAULTS = {
        offset: 0,
        target: window
      }, c.prototype.getState = function (a, b, c, d) {
        var e = this.$target.scrollTop(),
            f = this.$element.offset(),
            g = this.$target.height();
        if (null != c && "top" == this.affixed) return c > e ? "top" : !1;
        if ("bottom" == this.affixed) return null != c ? e + this.unpin <= f.top ? !1 : "bottom" : a - d >= e + g ? !1 : "bottom";
        var h = null == this.affixed,
            i = h ? e : f.top,
            j = h ? g : b;
        return null != c && c >= e ? "top" : null != d && i + j >= a - d ? "bottom" : !1;
      }, c.prototype.getPinnedOffset = function () {
        if (this.pinnedOffset) return this.pinnedOffset;
        this.$element.removeClass(c.RESET).addClass("affix");
        var a = this.$target.scrollTop(),
            b = this.$element.offset();
        return this.pinnedOffset = b.top - a;
      }, c.prototype.checkPositionWithEventLoop = function () {
        setTimeout(a.proxy(this.checkPosition, this), 1);
      }, c.prototype.checkPosition = function () {
        if (this.$element.is(":visible")) {
          var b = this.$element.height(),
              d = this.options.offset,
              e = d.top,
              f = d.bottom,
              g = Math.max(a(document).height(), a(document.body).height());
          "object" != typeof d && (f = e = d), "function" == typeof e && (e = d.top(this.$element)), "function" == typeof f && (f = d.bottom(this.$element));
          var h = this.getState(g, b, e, f);

          if (this.affixed != h) {
            null != this.unpin && this.$element.css("top", "");
            var i = "affix" + (h ? "-" + h : ""),
                j = a.Event(i + ".bs.affix");
            if (this.$element.trigger(j), j.isDefaultPrevented()) return;
            this.affixed = h, this.unpin = "bottom" == h ? this.getPinnedOffset() : null, this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix", "affixed") + ".bs.affix");
          }

          "bottom" == h && this.$element.offset({
            top: g - b - f
          });
        }
      };
      var d = a.fn.affix;
      a.fn.affix = b, a.fn.affix.Constructor = c, a.fn.affix.noConflict = function () {
        return a.fn.affix = d, this;
      }, a(window).on("load", function () {
        a('[data-spy="affix"]').each(function () {
          var c = a(this),
              d = c.data();
          d.offset = d.offset || {}, null != d.offsetBottom && (d.offset.bottom = d.offsetBottom), null != d.offsetTop && (d.offset.top = d.offsetTop), b.call(c, d);
        });
      });
    }(jQuery);
    /* ------------------------------------------------------------------------------------------------------------------------------ */

    return $;
  } finally {
    window.$ = _$;
    window.jQuery = _jQuery;
  }
}
// EXTERNAL MODULE: ./src/main/js/templates/errorPanel.hbs
var errorPanel = __webpack_require__(4695);
var errorPanel_default = /*#__PURE__*/__webpack_require__.n(errorPanel);
// EXTERNAL MODULE: ./src/main/js/templates/loadingPanel.hbs
var loadingPanel = __webpack_require__(4076);
var loadingPanel_default = /*#__PURE__*/__webpack_require__.n(loadingPanel);
// EXTERNAL MODULE: ./src/main/js/templates/welcomePanel.hbs
var welcomePanel = __webpack_require__(1301);
var welcomePanel_default = /*#__PURE__*/__webpack_require__.n(welcomePanel);
// EXTERNAL MODULE: ./src/main/js/templates/progressPanel.hbs
var progressPanel = __webpack_require__(4701);
var progressPanel_default = /*#__PURE__*/__webpack_require__.n(progressPanel);
// EXTERNAL MODULE: ./src/main/js/templates/successPanel.hbs
var successPanel = __webpack_require__(8971);
var successPanel_default = /*#__PURE__*/__webpack_require__.n(successPanel);
// EXTERNAL MODULE: ./src/main/js/templates/pluginSelectionPanel.hbs
var pluginSelectionPanel = __webpack_require__(5298);
var pluginSelectionPanel_default = /*#__PURE__*/__webpack_require__.n(pluginSelectionPanel);
// EXTERNAL MODULE: ./src/main/js/templates/setupCompletePanel.hbs
var setupCompletePanel = __webpack_require__(4173);
var setupCompletePanel_default = /*#__PURE__*/__webpack_require__.n(setupCompletePanel);
// EXTERNAL MODULE: ./src/main/js/templates/proxyConfigPanel.hbs
var proxyConfigPanel = __webpack_require__(7697);
var proxyConfigPanel_default = /*#__PURE__*/__webpack_require__.n(proxyConfigPanel);
// EXTERNAL MODULE: ./src/main/js/templates/firstUserPanel.hbs
var firstUserPanel = __webpack_require__(3123);
var firstUserPanel_default = /*#__PURE__*/__webpack_require__.n(firstUserPanel);
// EXTERNAL MODULE: ./src/main/js/templates/configureInstance.hbs
var configureInstance = __webpack_require__(900);
var configureInstance_default = /*#__PURE__*/__webpack_require__.n(configureInstance);
// EXTERNAL MODULE: ./src/main/js/templates/offlinePanel.hbs
var offlinePanel = __webpack_require__(8661);
var offlinePanel_default = /*#__PURE__*/__webpack_require__.n(offlinePanel);
// EXTERNAL MODULE: ./src/main/js/templates/pluginSetupWizard.hbs
var pluginSetupWizard = __webpack_require__(2202);
var pluginSetupWizard_default = /*#__PURE__*/__webpack_require__.n(pluginSetupWizard);
// EXTERNAL MODULE: ./src/main/js/templates/incompleteInstallationPanel.hbs
var incompleteInstallationPanel = __webpack_require__(4012);
var incompleteInstallationPanel_default = /*#__PURE__*/__webpack_require__.n(incompleteInstallationPanel);
// EXTERNAL MODULE: ./src/main/js/templates/pluginSelectList.hbs
var pluginSelectList = __webpack_require__(2585);
var pluginSelectList_default = /*#__PURE__*/__webpack_require__.n(pluginSelectList);
;// CONCATENATED MODULE: ./src/main/js/pluginSetupWizardGui.js





















/**
 * Jenkins first-run install wizard
 */

runtime_default().registerPartial("pluginSelectList", (pluginSelectList_default())); // TODO: see whether this is actually being used or if it can be removed

window.zq = (jquery_default()); // Setup the dialog, exported

var createPluginSetupWizard = function (appendTarget) {
  var $bs = enhanceJQueryWithBootstrap((jquery_default())); // Necessary handlebars helpers:
  // returns the plugin count string per category selected vs. available e.g. (5/44)

  runtime_default().registerHelper("pluginCountForCategory", function (cat) {
    var plugs = categorizedPlugins[cat];
    var tot = 0;
    var cnt = 0;

    for (var i = 0; i < plugs.length; i++) {
      var plug = plugs[i];

      if (plug.category === cat) {
        tot++;

        if (selectedPluginNames.indexOf(plug.plugin.name) >= 0) {
          cnt++;
        }
      }
    }

    return "(" + cnt + "/" + tot + ")";
  }); // returns the total plugin count string selected vs. total e.g. (5/44)

  runtime_default().registerHelper("totalPluginCount", function () {
    var tot = 0;
    var cnt = 0;

    for (var i = 0; i < pluginList.length; i++) {
      var a = pluginList[i];

      for (var c = 0; c < a.plugins.length; c++) {
        var plug = a.plugins[c];
        tot++;

        if (selectedPluginNames.indexOf(plug.name) >= 0) {
          cnt++;
        }
      }
    }

    return "(" + cnt + "/" + tot + ")";
  }); // determines if the provided plugin is in the list currently selected

  runtime_default().registerHelper("inSelectedPlugins", function (val, options) {
    if (selectedPluginNames.indexOf(val) >= 0) {
      return options.fn();
    }
  }); // executes a block if there are dependencies

  runtime_default().registerHelper("hasDependencies", function (plugName, options) {
    var plug = availablePlugins[plugName];

    if (plug && plug.allDependencies && plug.allDependencies.length > 1) {
      // includes self
      return options.fn();
    }
  }); // get total number of dependencies

  runtime_default().registerHelper("dependencyCount", function (plugName) {
    var plug = availablePlugins[plugName];

    if (plug && plug.allDependencies && plug.allDependencies.length > 1) {
      // includes self
      return plug.allDependencies.length - 1;
    }
  }); // gets user friendly dependency text

  runtime_default().registerHelper("eachDependency", function (plugName, options) {
    var plug = availablePlugins[plugName];

    if (!plug) {
      return "";
    }

    var deps = jquery_default().grep(plug.allDependencies, function (value) {
      // remove self
      return value !== plugName;
    });
    var out = "";

    for (var i = 0; i < deps.length; i++) {
      var depName = deps[i];
      var dep = availablePlugins[depName];

      if (dep) {
        out += options.fn(dep);
      }
    }

    return out;
  }); // executes a block if there are dependencies

  runtime_default().registerHelper("ifVisibleDependency", function (plugName, options) {
    if (visibleDependencies[plugName]) {
      return options.fn();
    }
  }); // wrap calls with this method to handle generic errors returned by the plugin manager

  var handleGenericError = function (success) {
    return function () {
      // Workaround for webpack passing null context to anonymous functions
      var self = this || window;

      if (self.isError) {
        var errorMessage = self.errorMessage;

        if (!errorMessage || self.errorMessage === "timeout") {
          errorMessage = translations.installWizard_error_connection;
        } else {
          errorMessage = translations.installWizard_error_message + " " + errorMessage;
        }

        setPanel((errorPanel_default()), {
          errorMessage: errorMessage
        });
        return;
      }

      success.apply(self, arguments);
    };
  };

  var pluginList;
  var allPluginNames;
  var selectedPluginNames; // state variables for plugin data, selected plugins, etc.:

  var visibleDependencies = {};
  var categories = [];
  var availablePlugins = {};
  var categorizedPlugins = {}; // Instantiate the wizard panel

  var $wizard = jquery_default()(pluginSetupWizard_default()());
  $wizard.appendTo(appendTarget);
  var $container = $wizard.find(".modal-content");
  var currentPanel;
  var self = this; // show tooltips; this is done here to work around a bootstrap/prototype incompatibility

  jquery_default()(document).on("mouseenter", "*[data-tooltip]", function () {
    var $tip = $bs(this);
    var text = $tip.attr("data-tooltip");

    if (!text) {
      return;
    } // prototype/bootstrap tooltip incompatibility - triggering main element to be hidden


    this.hide = undefined;
    $tip.tooltip({
      html: true,
      title: text
    }).tooltip("show");
  }); // handle clicking links that might not get highlighted due to position on the page

  $wizard.on("click", ".nav>li>a", function () {
    var $li = jquery_default()(this).parent();

    var activateClicked = function () {
      if (!$li.is(".active")) {
        $li.parent().find(">li").removeClass("active");
        $li.addClass("active");
      }
    };

    setTimeout(activateClicked, 150); // this is the scroll time

    setTimeout(activateClicked, 250); // this should combat timing issues
  }); // localized messages

  var translations = {};
  var decorations = [function () {// any decorations after DOM replacement go here
  }];

  var getJenkinsVersionFull = function () {
    var version = jquery_default()("body").attr("data-version");

    if (!version) {
      return "";
    }

    return version;
  };

  var getJenkinsVersion = function () {
    return getJenkinsVersionFull().replace(/(\d[.][\d.]+).*/, "$1");
  }; // call this to set the panel in the app, this performs some additional things & adds common transitions


  var setPanel = function (panel, data, onComplete) {
    var decorate = function ($base) {
      for (var i = 0; i < decorations.length; i++) {
        decorations[i]($base);
      }
    };

    var oncomplete = function () {
      var $content = jquery_default()("*[data-load-content]");

      if ($content.length > 0) {
        $content.each(function () {
          var $el = jquery_default()(this);
          util_jenkins.get($el.attr("data-load-content"), function (data) {
            $el.html(data);

            if (onComplete) {
              onComplete();
            }
          }, {
            dataType: "html"
          });
        });
      } else {
        if (onComplete) {
          onComplete();
        }
      }
    };

    var html = panel(jquery_default().extend({
      translations: translations,
      baseUrl: util_jenkins.baseUrl,
      jenkinsVersion: getJenkinsVersion()
    }, data));

    if (panel === currentPanel) {
      // just replace id-marked elements
      var $focusedItem = jquery_default()(document.activeElement);
      var focusPath = [];

      while ($focusedItem && $focusedItem.length > 0) {
        focusPath.push($focusedItem.index());
        $focusedItem = $focusedItem.parent();

        if ($focusedItem.is("body")) {
          break;
        }
      }

      var $upd = jquery_default()(html);
      $upd.find("*[id]").each(function () {
        var $el = jquery_default()(this);
        var $existing = jquery_default()("#" + $el.attr("id"));

        if ($existing.length > 0) {
          if ($el[0].outerHTML !== $existing[0].outerHTML) {
            $existing.replaceWith($el);
            decorate($el);
          }
        }
      });
      oncomplete(); // try to refocus on the element that had focus

      try {
        var e = jquery_default()("body")[0];

        for (var i = focusPath.length - 1; i >= 0; i--) {
          e = e.children[focusPath[i]];
        }

        if (document.activeElement !== e) {
          e.focus();
        }
      } catch (ex) {// ignored, unable to restore focus
      }
    } else {
      var append = function () {
        currentPanel = panel;
        $container.append(html);
        decorate($container);
        var $modalHeader = $container.find(".modal-header");

        if ($modalHeader.length > 0 && $modalHeader.is(".closeable")) {
          $modalHeader.prepend('<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
        } // add Jenkins version


        if (translations.installWizard_jenkinsVersionTitle) {
          // wait until translations available
          var $modalFooter = $container.find(".modal-footer");

          if ($modalFooter.length === 0) {
            $modalFooter = jquery_default()('<div class="modal-footer"></div>').appendTo($container);
          }

          $modalFooter.prepend('<div class="jenkins-version">' + translations.installWizard_jenkinsVersionTitle + " " + getJenkinsVersionFull() + "</div>");
        }

        oncomplete();
      };

      var $modalBody = $container.find(".modal-body");

      if ($modalBody.length > 0) {
        $modalBody.stop(true).fadeOut(250, function () {
          $container.children().remove();
          append();
        });
      } else {
        $container.children().remove();
        append();
      }
    }
  }; // plugin data for the progress panel


  var installingPlugins = [];
  var failedPluginNames = [];

  var getInstallingPlugin = function (plugName) {
    for (var i = 0; i < installingPlugins.length; i++) {
      var p = installingPlugins[i];

      if (p.name === plugName) {
        return p;
      }
    }

    return null;
  };

  var setFailureStatus = function (plugData) {
    var plugFailIdx = failedPluginNames.indexOf(plugData.name);

    if (/.*Fail.*/.test(plugData.installStatus)) {
      if (plugFailIdx < 0) {
        failedPluginNames.push(plugData.name);
      }
    } else if (plugFailIdx > 0) {
      failedPluginNames = failedPluginNames.slice(plugFailIdx, 1);
    }
  }; // recursively get all the dependencies for a particular plugin, this is used to show 'installing' status
  // when only dependencies are being installed


  var getAllDependencies = function (pluginName, deps) {
    if (!deps) {
      // don't get stuck
      deps = [];
      getAllDependencies(pluginName, deps);
      return deps;
    }

    if (deps.indexOf(pluginName) >= 0) {
      return;
    }

    deps.push(pluginName);
    var plug = availablePlugins[pluginName];

    if (plug) {
      if (plug.dependencies) {
        // plug.dependencies is  { "some-plug": "1.2.99", ... }
        for (var k in plug.dependencies) {
          getAllDependencies(k, deps);
        }
      }

      if (plug.neededDependencies) {
        // plug.neededDependencies is [ { name: "some-plug", ... }, ... ]
        for (var i = 0; i < plug.neededDependencies.length; i++) {
          getAllDependencies(plug.neededDependencies[i].name, deps);
        }
      }
    }
  }; // Initializes the set of installing plugins with pending statuses


  var initInstallingPluginList = function () {
    installingPlugins = [];

    for (var i = 0; i < selectedPluginNames.length; i++) {
      var pluginName = selectedPluginNames[i];
      var p = availablePlugins[pluginName];

      if (p) {
        var plug = jquery_default().extend({
          installStatus: "pending"
        }, p);
        installingPlugins.push(plug);
      }
    }
  }; // call this to go install the selected set of plugins


  var installPlugins = function (pluginNames) {
    // make sure to have the correct list of selected plugins
    selectedPluginNames = pluginNames; // Switch to the right view but function() to force update when progressPanel re-rendered

    setPanel(function () {
      return progressPanel_default()(arguments);
    }, {
      installingPlugins: []
    });
    api_pluginManager.installPlugins(pluginNames, handleGenericError(function () {
      showStatePanel();
    }));
  }; // toggles visibility of dependency listing for a plugin


  var toggleDependencyList = function () {
    var $btn = jquery_default()(this);
    var $toggle = $btn.parents(".plugin:first");
    var plugName = $btn.attr("data-plugin-name");

    if (!visibleDependencies[plugName]) {
      visibleDependencies[plugName] = true;
    } else {
      visibleDependencies[plugName] = false;
    }

    if (!visibleDependencies[plugName]) {
      $toggle.removeClass("show-dependencies");
    } else {
      $toggle.addClass("show-dependencies");
    }
  }; // install the default plugins


  var installDefaultPlugins = function () {
    loadPluginData(function () {
      installPlugins(api_pluginManager.recommendedPluginNames());
    });
  };

  var enableButtonsAfterFrameLoad = function () {
    jquery_default()("iframe[src]").on("load", function () {
      jquery_default()("button").prop({
        disabled: false
      });
    });
  };

  var enableButtonsImmediately = function () {
    jquery_default()("button").prop({
      disabled: false
    });
  }; // errors: Map of nameOfField to errorMessage


  var displayErrors = function (iframe, errors) {
    if (!errors) {
      return;
    }

    var errorKeys = Object.keys(errors);

    if (!errorKeys.length) {
      return;
    }

    var $iframeDoc = jquery_default()(iframe).contents();

    for (var i = 0; i < errorKeys.length; i++) {
      var name = errorKeys[i];
      var message = errors[name];
      var $inputField = $iframeDoc.find('[name="' + name + '"]');
      var $tr = $inputField.parentsUntil("tr").parent();
      var $errorPanel = $tr.find(".error-panel");
      $tr.addClass("has-error");
      $errorPanel.text(message);
    }
  };

  var setupFirstUser = function () {
    setPanel((firstUserPanel_default()), {}, enableButtonsAfterFrameLoad);
  };

  var showConfigureInstance = function (messages) {
    setPanel((configureInstance_default()), messages, enableButtonsAfterFrameLoad);
  };

  var showSetupCompletePanel = function (messages) {
    api_pluginManager.getRestartStatus(function (restartStatus) {
      setPanel((setupCompletePanel_default()), jquery_default().extend(restartStatus, messages));
    });
  }; // used to handle displays based on current Jenkins install state


  var stateHandlers = {
    DEFAULT: function () {
      setPanel((welcomePanel_default())); // focus on default

      jquery_default()(".install-recommended").focus();
    },
    CREATE_ADMIN_USER: function () {
      setupFirstUser();
    },
    CONFIGURE_INSTANCE: function () {
      showConfigureInstance();
    },
    RUNNING: function () {
      showSetupCompletePanel();
    },
    INITIAL_SETUP_COMPLETED: function () {
      showSetupCompletePanel();
    },
    INITIAL_PLUGINS_INSTALLING: function () {
      showInstallProgress();
    }
  };

  var showStatePanel = function (state) {
    if (!state) {
      api_pluginManager.installStatus(handleGenericError(function (data) {
        showStatePanel(data.state);
      }));
      return;
    }

    if (state in stateHandlers) {
      stateHandlers[state]();
    } else {
      stateHandlers.DEFAULT();
    }
  }; // Define actions


  var showInstallProgress = function () {
    // check for installing plugins that failed
    if (failedPluginNames.length > 0) {
      setPanel((successPanel_default()), {
        installingPlugins: installingPlugins,
        failedPlugins: true
      });
      return;
    }

    var attachScrollEvent = function () {
      var $c = jquery_default()(".install-console-scroll");

      if (!$c.length) {
        setTimeout(attachScrollEvent, 50);
        return;
      }

      var events = jquery_default()._data($c[0], "events");

      if (!events || !events.scroll) {
        $c.on("scroll", function () {
          if (!$c.data("wasAutoScrolled")) {
            var top = $c[0].scrollHeight - $c.height();

            if ($c.scrollTop() === top) {
              // resume auto-scroll
              $c.data("userScrolled", false);
            } else {
              // user scrolled up
              $c.data("userScrolled", true);
            }
          } else {
            $c.data("wasAutoScrolled", false);
          }
        });
      }
    };

    initInstallingPluginList();
    setPanel((progressPanel_default()), {
      installingPlugins: installingPlugins
    }, attachScrollEvent); // call to the installStatus, update progress bar & plugin details; transition on complete

    var updateStatus = function () {
      api_pluginManager.installStatus(handleGenericError(function (data) {
        var jobs = data.jobs;
        var i, j;
        var complete = 0;
        var total = 0; // eslint-disable-next-line no-unused-vars

        var restartRequired = false;

        for (i = 0; i < jobs.length; i++) {
          j = jobs[i];
          total++;

          if (/.*Success.*/.test(j.installStatus) || /.*Fail.*/.test(j.installStatus)) {
            complete++;
          }
        }

        if (total === 0) {
          // don't end while there are actual pending plugins
          total = installingPlugins.length;
        } // update progress bar


        jquery_default()(".progress-bar").css({
          width: 100.0 * complete / total + "%"
        }); // update details

        var $txt = jquery_default()(".install-text");
        $txt.children().remove();

        for (i = 0; i < jobs.length; i++) {
          j = jobs[i];
          var txt = false;
          var state = false;

          if (/.*Success.*/.test(j.installStatus)) {
            txt = j.title;
            state = "success";
          } else if (/.*Install.*/.test(j.installStatus)) {
            txt = j.title;
            state = "installing";
          } else if (/.*Fail.*/.test(j.installStatus)) {
            txt = j.title;
            state = "fail";
          }

          setFailureStatus(j);

          if (txt && state) {
            for (var installingIdx = 0; installingIdx < installingPlugins.length; installingIdx++) {
              var installing = installingPlugins[installingIdx];

              if (installing.name === j.name) {
                installing.installStatus = state;
              } else if (installing.installStatus === "pending" && // if no progress
              installing.allDependencies.indexOf(j.name) >= 0 && ( // and we have a dependency
              "installing" === state || "success" === state)) {
                // installing or successful
                installing.installStatus = "installing"; // show this is installing
              }
            }

            var isSelected = selectedPluginNames.indexOf(j.name) < 0 ? false : true;
            var $div = jquery_default()("<div>" + txt + "</div>");

            if (isSelected) {
              $div.addClass("selected");
            } else {
              $div.addClass("dependent");
            }

            $txt.append($div);
            var $itemProgress = jquery_default()('.selected-plugin[id="installing-' + (0,id["default"])(j.name) + '"]');

            if ($itemProgress.length > 0 && !$itemProgress.is("." + state)) {
              $itemProgress.addClass(state);
            }
          }
        }

        var $c = jquery_default()(".install-console-scroll");

        if ($c && $c.is(":visible") && !$c.data("userScrolled")) {
          $c.data("wasAutoScrolled", true);
          $c.scrollTop($c[0].scrollHeight);
        } // keep polling while install is running


        if (complete < total && data.state === "INITIAL_PLUGINS_INSTALLING") {
          setPanel((progressPanel_default()), {
            installingPlugins: installingPlugins
          }); // wait a sec

          setTimeout(updateStatus, 250);
        } else {
          // mark complete
          jquery_default()(".progress-bar").css({
            width: "100%"
          });
          showStatePanel(data.state);
        }
      }));
    }; // kick it off


    setTimeout(updateStatus, 250);
  }; // Called to complete the installation


  var finishInstallation = function () {
    closeInstaller();
  }; // load the plugin data, callback


  var loadPluginData = function (oncomplete) {
    api_pluginManager.availablePlugins(handleGenericError(function (availables) {
      var i, plug;

      for (i = 0; i < availables.length; i++) {
        plug = availables[i];
        availablePlugins[plug.name] = plug;
      }

      for (i = 0; i < availables.length; i++) {
        plug = availables[i];
        plug.allDependencies = getAllDependencies(plug.name);
      }

      oncomplete();
    }));
  };

  var loadPluginCategories = function (oncomplete) {
    loadPluginData(function () {
      categories = [];

      for (var i = 0; i < pluginList.length; i++) {
        var a = pluginList[i];
        categories.push(a.category);
        var plugs = categorizedPlugins[a.category] = [];

        for (var c = 0; c < a.plugins.length; c++) {
          var plugInfo = a.plugins[c];
          var plug = availablePlugins[plugInfo.name];

          if (!plug) {
            plug = {
              name: plugInfo.name,
              title: plugInfo.name
            };
          }

          plugs.push({
            category: a.category,
            plugin: jquery_default().extend({}, plug, {
              usage: plugInfo.usage,
              title: plugInfo.title ? plugInfo.title : plug.title,
              excerpt: plugInfo.excerpt ? plugInfo.excerpt : plug.excerpt,
              updated: new Date(plug.buildDate)
            })
          });
        }
      }

      oncomplete();
    });
  }; // load the custom plugin panel, will result in an AJAX call to get the plugin data


  var loadCustomPluginPanel = function () {
    loadPluginCategories(function () {
      setPanel((pluginSelectionPanel_default()), pluginSelectionPanelData(), function () {
        $bs(".plugin-selector .plugin-list").scrollspy({
          target: ".plugin-selector .categories"
        });
      });
    });
  }; // get plugin selection panel data object


  var pluginSelectionPanelData = function () {
    return {
      categories: categories,
      categorizedPlugins: categorizedPlugins,
      selectedPlugins: selectedPluginNames
    };
  }; // remove a plugin from the selected list


  var removePlugin = function (arr, item) {
    for (var i = arr.length; i--;) {
      if (arr[i] === item) {
        arr.splice(i, 1);
      }
    }
  }; // add a plugin to the selected list


  var addPlugin = function (arr, item) {
    arr.push(item);
  }; // refreshes the plugin selection panel; call this if anything changes to ensure everything is kept in sync


  var refreshPluginSelectionPanel = function () {
    setPanel(currentPanel, pluginSelectionPanelData());

    if (lastSearch !== "") {
      searchForPlugins(lastSearch, false);
    }
  }; // handle clicking an item in the plugin list


  $wizard.on("change", ".plugin-list input[type=checkbox]", function () {
    var $input = jquery_default()(this);

    if ($input.is(":checked")) {
      addPlugin(selectedPluginNames, $input.attr("name"));
    } else {
      removePlugin(selectedPluginNames, $input.attr("name"));
    }

    refreshPluginSelectionPanel();
  }); // walk the elements and search for the text

  var walk = function (elements, element, text, xform) {
    var i,
        child,
        n = element.childNodes.length;

    for (i = 0; i < n; i++) {
      child = element.childNodes[i];

      if (child.nodeType === 3 && xform(child.data).indexOf(text) !== -1) {
        elements.push(element);
        break;
      }
    }

    for (i = 0; i < n; i++) {
      child = element.childNodes[i];

      if (child.nodeType === 1) {
        walk(elements, child, text, xform);
      }
    }
  }; // find elements matching the given text, optionally transforming the text before match (e.g. you can .toLowerCase() it)


  var findElementsWithText = function (ancestor, text, xform) {
    var elements = [];
    walk(elements, ancestor, text, xform ? xform : function (d) {
      return d;
    });
    return elements;
  }; // search UI vars


  var findIndex = 0;
  var lastSearch = ""; // scroll to the next match

  var scrollPlugin = function ($pl, matches, term) {
    if (matches.length > 0) {
      if (lastSearch !== term) {
        findIndex = 0;
      } else {
        findIndex = (findIndex + 1) % matches.length;
      }

      var $el = jquery_default()(matches[findIndex]);
      $el = $el.parents(".plugin:first"); // scroll to the block

      if ($el && $el.length > 0) {
        var pos = $pl.scrollTop() + $el.position().top;
        $pl.stop(true).animate({
          scrollTop: pos
        }, 100);
        setTimeout(function () {
          // wait for css transitions to finish
          var pos = $pl.scrollTop() + $el.position().top;
          $pl.stop(true).animate({
            scrollTop: pos
          }, 50);
        }, 50);
      }
    }
  }; // search for given text, optionally scroll to the next match, set classes on appropriate elements from the search match


  var searchForPlugins = function (text, scroll) {
    var $pl = jquery_default()(".plugin-list");
    var $containers = $pl.find(".plugin"); // must always do this, as it's called after refreshing the panel (e.g. check/uncheck plugs)

    $containers.removeClass("match");
    $pl.find("h2").removeClass("match");

    if (text.length > 1) {
      if (text === "show:selected") {
        jquery_default()(".plugin-list .selected").addClass("match");
      } else {
        var matches = [];
        $containers.find(".title,.description").each(function () {
          var localMatches = findElementsWithText(this, text.toLowerCase(), function (d) {
            return d.toLowerCase();
          });

          if (localMatches.length > 0) {
            matches = matches.concat(localMatches);
          }
        });
        jquery_default()(matches).parents(".plugin").addClass("match");

        if (lastSearch !== text && scroll) {
          scrollPlugin($pl, matches, text);
        }
      }

      jquery_default()(".match").parent().prev("h2").addClass("match");
      $pl.addClass("searching");
    } else {
      findIndex = 0;
      $pl.removeClass("searching");
    }

    lastSearch = text;
  }; // handle input for the search here


  $wizard.on("keyup change", ".plugin-select-controls input[name=searchbox]", function () {
    var val = jquery_default()(this).val();
    searchForPlugins(val, true);
  }); // handle keyboard up/down navigation between items in
  // in the list, if we're focused somewhere inside

  $wizard.on("keydown", ".plugin-list", function (e) {
    var up = false;

    switch (e.which) {
      case 38:
        // up
        up = true;
        break;

      case 40:
        // down
        break;

      default:
        return;
      // ignore
    }

    var $plugin = jquery_default()(e.target).closest(".plugin");

    if ($plugin && $plugin.length > 0) {
      var $allPlugins = jquery_default()(".plugin-list .plugin:visible");
      var idx = $allPlugins.index($plugin);
      var next = idx + (up ? -1 : 1);

      if (next >= 0 && next < $allPlugins.length) {
        var $next = jquery_default()($allPlugins[next]);

        if ($next && $next.length > 0) {
          var $chk = $next.find(":checkbox:first");

          if ($chk && $chk.length > 0) {
            e.preventDefault();
            $chk.focus();
            return;
          }
        }
      }
    }
  }); // handle clearing the search

  $wizard.on("click", ".clear-search", function () {
    jquery_default()("input[name=searchbox]").val("");
    searchForPlugins("", false);
  }); // toggles showing the selected items as a simple search

  var toggleSelectedSearch = function () {
    var $srch = jquery_default()("input[name=searchbox]");
    var val = "show:selected";

    if ($srch.val() === val) {
      val = "";
    }

    $srch.val(val);
    searchForPlugins(val, false);
  }; // handle clicking on the category


  var selectCategory = function () {
    jquery_default()("input[name=searchbox]").val("");
    searchForPlugins("", false);
    var $el = jquery_default()(jquery_default()(this).attr("href"));
    var $pl = jquery_default()(".plugin-list");
    var top = $pl.scrollTop() + $el.position().top;
    $pl.stop(true).animate({
      scrollTop: top
    }, 250, function () {
      var top = $pl.scrollTop() + $el.position().top;
      $pl.stop(true).scrollTop(top);
    });
  }; // handle show/hide details during the installation progress panel


  var toggleInstallDetails = function () {
    var $c = jquery_default()(".install-console");

    if ($c.is(":visible")) {
      $c.slideUp();
    } else {
      $c.slideDown();
    }
  };

  var handleFirstUserResponseSuccess = function (data) {
    if (data.status === "ok") {
      showStatePanel();
    } else {
      setPanel((errorPanel_default()), {
        errorMessage: "Error trying to create first user: " + data.statusText
      });
    }
  };

  var handleFirstUserResponseError = function (res) {
    // We're expecting a full HTML page to replace the form
    // We can only replace the _whole_ iframe due to XSS rules
    // https://stackoverflow.com/a/22913801/1117552
    var responseText = res.responseText;
    var $page = jquery_default()(responseText);
    var $main = $page.find("#main-panel").detach();

    if ($main.length > 0) {
      responseText = responseText.replace(/body([^>]*)[>](.|[\r\n])+[<][/]body/, "body$1>" + $main.html() + "</body");
    }

    var doc = jquery_default()("iframe#setup-first-user").contents()[0];
    doc.open();
    doc.write(responseText);
    doc.close();
    jquery_default()("button").prop({
      disabled: false
    });
  }; // call to submit the first user


  var saveFirstUser = function () {
    jquery_default()("button").prop({
      disabled: true
    });
    var $form = jquery_default()("iframe#setup-first-user").contents().find("form:not(.no-json)");
    securityConfig.saveFirstUser($form, handleFirstUserResponseSuccess, handleFirstUserResponseError);
  };

  var firstUserSkipped = false;

  var skipFirstUser = function () {
    jquery_default()("button").prop({
      disabled: true
    });
    firstUserSkipped = true;
    util_jenkins.get("/api/json?tree=url", function (data) {
      if (data.url) {
        // as in InstallState.ConfigureInstance.initializeState
        showSetupCompletePanel({
          message: translations.installWizard_firstUserSkippedMessage
        });
      } else {
        showConfigureInstance();
      }
    }, {
      error: function () {
        // give up
        showConfigureInstance();
      }
    });
  };

  var handleConfigureInstanceResponseSuccess = function (data) {
    if (data.status === "ok") {
      if (firstUserSkipped) {
        var message = translations.installWizard_firstUserSkippedMessage;
        showSetupCompletePanel({
          message: message
        });
      } else {
        showStatePanel();
      }
    } else {
      var errors = data.data;
      setPanel((configureInstance_default()), {}, function () {
        enableButtonsImmediately();
        displayErrors(jquery_default()("iframe#setup-configure-instance"), errors);
      });
    }
  };

  var handleConfigureInstanceResponseError = function (res) {
    // We're expecting a full HTML page to replace the form
    // We can only replace the _whole_ iframe due to XSS rules
    // https://stackoverflow.com/a/22913801/1117552
    var responseText = res.responseText;
    var $page = jquery_default()(responseText);
    var $main = $page.find("#main-panel").detach();

    if ($main.length > 0) {
      responseText = responseText.replace(/body([^>]*)[>](.|[\r\n])+[<][/]body/, "body$1>" + $main.html() + "</body");
    }

    var doc = jquery_default()("iframe#setup-configure-instance").contents()[0];
    doc.open();
    doc.write(responseText);
    doc.close();
    jquery_default()("button").prop({
      disabled: false
    });
  };

  var saveConfigureInstance = function () {
    jquery_default()("button").prop({
      disabled: true
    });
    var $form = jquery_default()("iframe#setup-configure-instance").contents().find("form:not(.no-json)");
    securityConfig.saveConfigureInstance($form, handleConfigureInstanceResponseSuccess, handleConfigureInstanceResponseError);
  };

  var skipFirstUserAndConfigureInstance = function () {
    firstUserSkipped = true;
    skipConfigureInstance();
  };

  var skipConfigureInstance = function () {
    jquery_default()("button").prop({
      disabled: true
    });
    var message = "";

    if (firstUserSkipped) {
      message += translations.installWizard_firstUserSkippedMessage;
    }

    message += translations.installWizard_configureInstanceSkippedMessage;
    showSetupCompletePanel({
      message: message
    });
  }; // call to setup the proxy


  var setupProxy = function () {
    setPanel((proxyConfigPanel_default()), {}, enableButtonsAfterFrameLoad);
  }; // Save the proxy config


  var saveProxyConfig = function () {
    securityConfig.saveProxy(jquery_default()("iframe[src]").contents().find("form:not(.no-json)"), function () {
      util_jenkins.goTo("/"); // this will re-run connectivity test
    });
  }; // push failed plugins to retry


  var retryFailedPlugins = function () {
    var failedPlugins = failedPluginNames;
    failedPluginNames = [];
    installPlugins(failedPlugins);
  }; // continue with failed plugins


  var continueWithFailedPlugins = function () {
    api_pluginManager.installPluginsDone(function () {
      api_pluginManager.installStatus(handleGenericError(function (data) {
        failedPluginNames = [];
        showStatePanel(data.state);
      }));
    });
  }; // Call this to resume an installation after restart


  var resumeInstallation = function () {
    // don't re-initialize installing plugins
    initInstallingPluginList = function () {};

    selectedPluginNames = [];

    for (var i = 0; i < installingPlugins.length; i++) {
      var plug = installingPlugins[i];

      if (plug.installStatus === "pending") {
        selectedPluginNames.push(plug.name);
      }
    }

    installPlugins(selectedPluginNames);
  }; // restart jenkins


  var restartJenkins = function () {
    api_pluginManager.restartJenkins(function () {
      setPanel((loadingPanel_default()));
      console.log("-------------------");
      console.log("Waiting for Jenkins to come back online...");
      console.log("-------------------");

      var pingUntilRestarted = function () {
        api_pluginManager.getRestartStatus(function (restartStatus) {
          if (this.isError || restartStatus.restartRequired) {
            if (this.isError || restartStatus.restartSupported) {
              console.log("Waiting...");
              setTimeout(pingUntilRestarted, 1000);
            } else if (!restartStatus.restartSupported) {
              throw new Error(translations.installWizard_error_restartNotSupported);
            }
          } else {
            util_jenkins.goTo("/");
          }
        });
      };

      pingUntilRestarted();
    });
  }; // close the installer, mark not to show again


  var closeInstaller = function () {
    api_pluginManager.completeInstall(handleGenericError(function () {
      util_jenkins.goTo("/");
    }));
  };

  var startOver = function () {
    util_jenkins.goTo("/");
  }; // scoped click handler, prevents default actions automatically


  var bindClickHandler = function (cls, action) {
    $wizard.on("click", cls, function (e) {
      action.apply(this, arguments);
      e.preventDefault();
    });
  }; // click action mappings


  var actions = {
    ".toggle-dependency-list": toggleDependencyList,
    ".install-recommended": installDefaultPlugins,
    ".install-custom": loadCustomPluginPanel,
    ".install-home": function () {
      showStatePanel();
    },
    ".install-selected": function () {
      installPlugins(selectedPluginNames);
    },
    ".toggle-install-details": toggleInstallDetails,
    ".install-done": finishInstallation,
    ".plugin-select-all": function () {
      selectedPluginNames = allPluginNames;
      refreshPluginSelectionPanel();
    },
    ".plugin-select-none": function () {
      selectedPluginNames = [];
      refreshPluginSelectionPanel();
    },
    ".plugin-select-recommended": function () {
      selectedPluginNames = api_pluginManager.recommendedPluginNames();
      refreshPluginSelectionPanel();
    },
    ".plugin-show-selected": toggleSelectedSearch,
    ".select-category": selectCategory,
    ".close": skipFirstUserAndConfigureInstance,
    ".resume-installation": resumeInstallation,
    ".install-done-restart": restartJenkins,
    ".save-first-user:not([disabled])": saveFirstUser,
    ".skip-first-user": skipFirstUser,
    ".save-configure-instance:not([disabled])": saveConfigureInstance,
    ".skip-configure-instance": skipConfigureInstance,
    ".show-proxy-config": setupProxy,
    ".save-proxy-config": saveProxyConfig,
    ".skip-plugin-installs": function () {
      installPlugins([]);
    },
    ".retry-failed-plugins": retryFailedPlugins,
    ".continue-with-failed-plugins": continueWithFailedPlugins,
    ".start-over": startOver
  }; // do this so the page isn't blank while doing connectivity checks and other downloads

  setPanel((loadingPanel_default())); // Process extensions

  var extensionTranslationOverrides = [];

  if ("undefined" !== typeof setupWizardExtensions) {
    jquery_default().each(setupWizardExtensions, function () {
      this.call(self, {
        $: (jquery_default()),
        $wizard: $wizard,
        jenkins: util_jenkins,
        pluginManager: api_pluginManager,
        setPanel: setPanel,
        addActions: function (pluginActions) {
          jquery_default().extend(actions, pluginActions);
        },
        addStateHandlers: function (pluginStateHandlers) {
          jquery_default().extend(stateHandlers, pluginStateHandlers);
        },
        translationOverride: function (it) {
          extensionTranslationOverrides.push(it);
        },
        setSelectedPluginNames: function (pluginNames) {
          selectedPluginNames = pluginNames.slice(0);
        },
        showStatePanel: showStatePanel,
        installPlugins: installPlugins,
        pluginSelectionPanelData: pluginSelectionPanelData,
        loadPluginCategories: loadPluginCategories
      });
    });
  }

  for (var cls in actions) {
    bindClickHandler(cls, actions[cls]);
  }

  var showInitialSetupWizard = function () {
    // check for connectivity to the configured default update site

    /* globals defaultUpdateSiteId: true */
    util_jenkins.testConnectivity(defaultUpdateSiteId, handleGenericError(function (isConnected, isFatal, errorMessage) {
      if (!isConnected) {
        if (isFatal) {
          // We cannot continue, show error
          setPanel((errorPanel_default()), {
            errorMessage: "Default update site connectivity check failed with fatal error: " + errorMessage + ". If you see this issue for the custom Jenkins WAR bundle, consider setting the correct value of the hudson.model.UpdateCenter.defaultUpdateSiteId system property (requires Jenkins restart). Otherwise please create a bug in Jenkins JIRA."
          });
        } else {
          // The update center is offline, no problem
          setPanel((offlinePanel_default()));
        }

        return;
      } // Initialize the plugin manager after connectivity checks


      api_pluginManager.init(handleGenericError(function () {
        pluginList = api_pluginManager.plugins();
        allPluginNames = api_pluginManager.pluginNames();
        selectedPluginNames = api_pluginManager.recommendedPluginNames(); // check for updates when first loaded...

        api_pluginManager.installStatus(handleGenericError(function (data) {
          var jobs = data.jobs;

          if (jobs.length > 0) {
            if (installingPlugins.length === 0) {
              // This can happen on a page reload if we are in the middle of
              // an install. So, lets get a list of plugins being installed at the
              // moment and use that as the "selectedPlugins" list.
              selectedPluginNames = [];
              loadPluginData(handleGenericError(function () {
                for (var i = 0; i < jobs.length; i++) {
                  var j = jobs[i]; // If the job does not have a 'correlationId', then it was not selected
                  // by the user for install i.e. it's probably a dependency plugin.

                  if (j.correlationId) {
                    selectedPluginNames.push(j.name);
                  }

                  setFailureStatus(j);
                }

                showStatePanel(data.state);
              }));
            } else {
              showStatePanel(data.state);
            }

            return;
          } // check for crash/restart with uninstalled initial plugins


          api_pluginManager.incompleteInstallStatus(handleGenericError(function (incompleteStatus) {
            var incompletePluginNames = [];

            for (var plugName in incompleteStatus) {
              incompletePluginNames.push(plugName);
            }

            if (incompletePluginNames.length > 0) {
              selectedPluginNames = incompletePluginNames;
              loadPluginData(handleGenericError(function () {
                initInstallingPluginList();

                for (var plugName in incompleteStatus) {
                  var j = getInstallingPlugin(plugName);

                  if (!j) {
                    console.warn('Plugin "' + plugName + '" not found in the list of installing plugins.');
                    continue;
                  }

                  var state = false;
                  var status = incompleteStatus[plugName];

                  if (/.*Success.*/.test(status)) {
                    state = "success";
                  } else if (/.*Install.*/.test(status)) {
                    state = "pending";
                  } else if (/.*Fail.*/.test(status)) {
                    state = "fail";
                  }

                  if (state) {
                    j.installStatus = state;
                  }
                }

                setPanel((incompleteInstallationPanel_default()), {
                  installingPlugins: installingPlugins
                });
              }));
              return;
            } // finally,  show the installer
            // If no active install, by default, we'll show the welcome screen


            showStatePanel();
          }));
        }));
      }));
    }));
  }; // kick off to get resource bundle


  util_jenkins.loadTranslations("jenkins.install.pluginSetupWizard", handleGenericError(function (localizations) {
    translations = localizations; // process any translation overrides

    jquery_default().each(extensionTranslationOverrides, function () {
      this(translations);
    });
    showInitialSetupWizard();
  }));
}; // export wizard creation method


/* harmony default export */ var pluginSetupWizardGui = ({
  init: createPluginSetupWizard
});
;// CONCATENATED MODULE: ./src/main/js/pluginSetupWizard.js
 // This is the main module

 // This entry point for the bundle only bootstraps the main module in a browser

jquery_default()(function () {
  jquery_default()(".plugin-setup-wizard-container").each(function () {
    var $container = jquery_default()(this);

    if ($container.children().length === 0) {
      // this may get double-initialized
      pluginSetupWizardGui.init($container);
    }
  });
});

/***/ }),

/***/ 900:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Handlebars = __webpack_require__(3449);
function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing, alias4="function";

  return "<div class=\"modal-header\">\n	<h4 class=\"modal-title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_addFirstUser_title : stack1), depth0))
    + "</h4>\n</div>\n<div class=\"modal-body\">\n	<div class=\"jumbotron welcome-panel security-panel\">\n		"
    + ((stack1 = ((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"message","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n\n		<iframe src=\""
    + alias2(((helper = (helper = helpers.baseUrl || (depth0 != null ? depth0.baseUrl : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(depth0,{"name":"baseUrl","hash":{},"data":data}) : helper)))
    + "/setupWizard/setupWizardConfigureInstance\" id=\"setup-configure-instance\"></iframe>\n	</div>\n</div>\n<div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-link skip-configure-instance\" disabled>\n        "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_skipConfigureInstance : stack1), depth0))
    + "\n    </button>\n	<button type=\"button\" class=\"btn btn-primary save-configure-instance\" disabled>\n		"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_saveConfigureInstance : stack1), depth0))
    + "\n	</button>\n</div>\n";
},"useData":true});

/***/ }),

/***/ 4695:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Handlebars = __webpack_require__(3449);
function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class=\"modal-header\">\n	<h4 class=\"modal-title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_error_title : stack1), depth0))
    + "</h4>\n</div>\n<div class=\"modal-body\">\n	<div class=\"container error-container\" id=\"error-message\">\n		<h1>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_error_header : stack1), depth0))
    + "</h1>\n		<div class=\"alert alert-danger fade in\">\n			"
    + alias2(((helper = (helper = helpers.errorMessage || (depth0 != null ? depth0.errorMessage : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"errorMessage","hash":{},"data":data}) : helper)))
    + "\n		</div>\n	</div>\n</div>\n<div class=\"modal-footer\">\n	<button type=\"button\" class=\"btn btn-primary start-over\">\n		"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_retry : stack1), depth0))
    + "\n	</button>\n</div>\n";
},"useData":true});

/***/ }),

/***/ 3123:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Handlebars = __webpack_require__(3449);
function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class=\"modal-header\">\n	<h4 class=\"modal-title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_addFirstUser_title : stack1), depth0))
    + "</h4>\n</div>\n<div class=\"modal-body\">\n	<div class=\"jumbotron welcome-panel security-panel\">\n		<iframe src=\""
    + alias2(((helper = (helper = helpers.baseUrl || (depth0 != null ? depth0.baseUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"baseUrl","hash":{},"data":data}) : helper)))
    + "/setupWizard/setupWizardFirstUser\" id=\"setup-first-user\"></iframe>\n	</div>\n</div>\n<div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-link skip-first-user\" disabled>\n        "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_skipFirstUser : stack1), depth0))
    + "\n    </button>\n	<button type=\"button\" class=\"btn btn-primary save-first-user\" disabled>\n		"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_saveFirstUser : stack1), depth0))
    + "\n	</button>\n</div>\n";
},"useData":true});

/***/ }),

/***/ 4012:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Handlebars = __webpack_require__(3449);
function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
module.exports = (Handlebars["default"] || Handlebars).template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "		<div class=\"selected-plugin "
    + alias3(((helper = (helper = helpers.installStatus || (depth0 != null ? depth0.installStatus : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"installStatus","hash":{},"data":data}) : helper)))
    + "\" data-name=\""
    + alias3(__default(__webpack_require__(553)).call(depth0,(depth0 != null ? depth0.name : depth0),{"name":"id","hash":{},"data":data}))
    + "\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class=\"modal-header\">\n	<h4 class=\"modal-title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installIncomplete_title : stack1), depth0))
    + "</h4>\n</div>\n<div class=\"modal-body\">\n	<div class=\"jumbotron welcome-panel success-panel\">\n		<h1>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installIncomplete_banner : stack1), depth0))
    + "</h1>\n		<p>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installIncomplete_message : stack1), depth0))
    + "</p>\n	</div>\n\n	<div class=\"selected-plugin-progress success-panel\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.installingPlugins : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</div>\n</div>\n<div class=\"modal-footer\">\n	<button type=\"button\" class=\"btn btn-link install-home\">\n		"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_goBack : stack1), depth0))
    + "\n	</button>\n	<button type=\"button\" class=\"btn btn-primary resume-installation\">\n		"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installIncomplete_resumeInstallationButtonLabel : stack1), depth0))
    + "\n	</button>\n</div>";
},"useData":true});

/***/ }),

/***/ 4076:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Handlebars = __webpack_require__(3449);
function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"loader\"></div>\n";
},"useData":true});

/***/ }),

/***/ 8661:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Handlebars = __webpack_require__(3449);
function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class=\"modal-header\">\n    <h4 class=\"modal-title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_offline_title : stack1), depth0))
    + "</h4>\n</div>\n<div class=\"modal-body\">\n    <div class=\"jumbotron welcome-panel offline\">\n        <h1>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_offline_title : stack1), depth0))
    + "</h1>\n        <p>"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_offline_message : stack1), depth0)) != null ? stack1 : "")
    + "</p>\n        <p>\n            <button type=\"button\" class=\"btn btn-primary show-proxy-config\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_configureProxy_label : stack1), depth0))
    + "</button>\n            <button type=\"button\" class=\"btn btn-primary skip-plugin-installs\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_skipPluginInstallations : stack1), depth0))
    + "</button>\n        </p>\n    </div>\n</div>\n";
},"useData":true});

/***/ }),

/***/ 2585:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Handlebars = __webpack_require__(3449);
function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
module.exports = (Handlebars["default"] || Handlebars).template({"1":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=this.escapeExpression;

  return "<h2 id=\""
    + alias1(__default(__webpack_require__(553)).call(depth0,(data && data.key),{"name":"id","hash":{},"data":data}))
    + "\" class=\"expanded\">"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"key","hash":{},"data":data}) : helper)))
    + " "
    + alias1(helpers.pluginCountForCategory.call(depth0,(data && data.key),{"name":"pluginCountForCategory","hash":{},"data":data}))
    + "</h2>\n<div class=\"plugins-for-category\">\n"
    + ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(2, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"2":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=this.escapeExpression, alias2=this.lambda, alias3=helpers.helperMissing;

  return "  <div class=\"plugin "
    + alias1(__default(__webpack_require__(553)).call(depth0,((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.name : stack1),{"name":"id","hash":{},"data":data}))
    + " "
    + ((stack1 = helpers.inSelectedPlugins.call(depth0,((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.name : stack1),{"name":"inSelectedPlugins","hash":{},"fn":this.program(3, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.ifVisibleDependency.call(depth0,((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.name : stack1),{"name":"ifVisibleDependency","hash":{},"fn":this.program(5, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\" id=\"row-"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">\n    <label>\n      <span class=\"title\">\n        <input type=\"checkbox\" id=\"chk-"
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" name=\""
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" value=\""
    + alias1(((helper = (helper = helpers.searchTerm || (depth0 != null ? depth0.searchTerm : depth0)) != null ? helper : alias3),(typeof helper === "function" ? helper.call(depth0,{"name":"searchTerm","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers.inSelectedPlugins.call(depth0,((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.name : stack1),{"name":"inSelectedPlugins","hash":{},"fn":this.program(7, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "/>\n        "
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.title : stack1), depth0))
    + "\n        <a href=\""
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.website : stack1), depth0))
    + "\" target=\"_blank\" class=\"website-link\" rel=\"noopener noreferrer\" title=\""
    + alias1(alias2(((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.title : stack1), depth0))
    + " "
    + alias1(alias2(((stack1 = (depths[2] != null ? depths[2].translations : depths[2])) != null ? stack1.installWizard_websiteLinkLabel : stack1), depth0))
    + "\"></a>\n      </span>\n"
    + ((stack1 = (helpers.hasDependencies || (depth0 && depth0.hasDependencies) || alias3).call(depth0,((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.name : stack1),{"name":"hasDependencies","hash":{},"fn":this.program(9, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "      <span class=\"description\">\n        "
    + ((stack1 = alias2(((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.excerpt : stack1), depth0)) != null ? stack1 : "")
    + "\n      </span>\n"
    + ((stack1 = (helpers.hasDependencies || (depth0 && depth0.hasDependencies) || alias3).call(depth0,((stack1 = (depth0 != null ? depth0.plugin : depth0)) != null ? stack1.name : stack1),{"name":"hasDependencies","hash":{},"fn":this.program(11, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </label>\n  </div>\n";
},"3":function(depth0,helpers,partials,data) {
    return "selected";
},"5":function(depth0,helpers,partials,data) {
    return "show-dependencies";
},"7":function(depth0,helpers,partials,data) {
    return "checked=\"checked\"";
},"9":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "        <a href=\"#\" class=\"btn btn-link toggle-dependency-list\" type=\"button\" data-plugin-name=\""
    + alias2(alias1(((stack1 = (depths[1] != null ? depths[1].plugin : depths[1])) != null ? stack1.name : stack1), depth0))
    + "\" title=\""
    + alias2(alias1(((stack1 = (depths[1] != null ? depths[1].plugin : depths[1])) != null ? stack1.title : stack1), depth0))
    + " "
    + alias2(alias1(((stack1 = (depths[3] != null ? depths[3].translations : depths[3])) != null ? stack1.installWizard_installIncomplete_dependenciesLabel : stack1), depth0))
    + "\">\n          <span class=\"badge\">"
    + alias2(helpers.dependencyCount.call(depth0,((stack1 = (depths[1] != null ? depths[1].plugin : depths[1])) != null ? stack1.name : stack1),{"name":"dependencyCount","hash":{},"data":data}))
    + "</span>\n        </a>\n";
},"11":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "        <div class=\"dep-list\">\n          <h3 class=\"dep-title\">"
    + this.escapeExpression(this.lambda(((stack1 = (depths[3] != null ? depths[3].translations : depths[3])) != null ? stack1.installWizard_installIncomplete_dependenciesLabel : stack1), depth0))
    + "</h3>\n"
    + ((stack1 = helpers.eachDependency.call(depth0,((stack1 = (depths[1] != null ? depths[1].plugin : depths[1])) != null ? stack1.name : stack1),{"name":"eachDependency","hash":{},"fn":this.program(12, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n";
},"12":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "          <a class=\"dep badge\" href=\""
    + alias3(((helper = (helper = helpers.website || (depth0 != null ? depth0.website : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"website","hash":{},"data":data}) : helper)))
    + "\" rel=\"noopener noreferrer\" target=\"_blank\">\n          "
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\n          </a>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.categorizedPlugins : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true,"useDepths":true});

/***/ }),

/***/ 5298:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Handlebars = __webpack_require__(3449);
function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
module.exports = (Handlebars["default"] || Handlebars).template({"1":function(depth0,helpers,partials,data) {
    var alias1=this.escapeExpression;

  return "    <li><a href=\"#"
    + alias1(__default(__webpack_require__(553)).call(depth0,depth0,{"name":"id","hash":{},"data":data}))
    + "\" class=\"select-category\">"
    + alias1(this.lambda(depth0, depth0))
    + "</a></li>\n";
},"3":function(depth0,helpers,partials,data) {
    return this.escapeExpression(this.lambda(depth0, depth0))
    + ",";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class=\"modal-header closeable\">\n  <h4 class=\"modal-title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installCustom_title : stack1), depth0))
    + "</h4>\n</div>\n<div class=\"modal-body plugin-selector\">\n  <div class=\"categories col-sm-3\">\n  <ul class=\"nav\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.categories : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </ul>\n  </div>\n  <div class=\"plugins col-sm-9\">\n    <div class=\"plugin-select-controls\">\n      <span class=\"plugin-select-actions\">\n        <a href=\"#\" class=\"plugin-select-all\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installCustom_selectAll : stack1), depth0))
    + "</a>\n        <a href=\"#\" class=\"plugin-select-none\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installCustom_selectNone : stack1), depth0))
    + "</a>\n        <a href=\"#\" class=\"plugin-select-recommended\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installCustom_selectRecommended : stack1), depth0))
    + "</a>\n      </span>\n      <span class=\"plugin-search-controls\">\n        <input type=\"text\" name=\"searchbox\" class=\"form-control\" />\n        <a href=\"#\" class=\"clear-search\">&times;</a>\n      </span>\n      <span id=\"plugin-selected-info\" class=\"plugin-selected-info\" data-selected-plugins=\""
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.selectedPlugins : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\">\n        <a href=\"#\" class=\"plugin-show-selected\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installCustom_selected : stack1), depth0))
    + "</a> "
    + alias2(helpers.totalPluginCount.call(depth0,{"name":"totalPluginCount","hash":{},"data":data}))
    + "\n      </span>\n    </div>\n        <div class=\"plugin-list\">\n            <div class=\"plugin-list-description\">"
    + ((stack1 = alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installCustom_pluginListDesc : stack1), depth0)) != null ? stack1 : "")
    + "</div>\n"
    + ((stack1 = this.invokePartial(__webpack_require__(2585),depth0,{"name":"pluginSelectList","data":data,"indent":"        ","helpers":helpers,"partials":partials})) != null ? stack1 : "")
    + "    </div>\n  </div>\n</div>\n<div class=\"modal-footer\">\n  <button type=\"button\" class=\"btn btn-link install-home\">\n    "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_goBack : stack1), depth0))
    + "\n  </button>\n  <button type=\"button\" class=\"btn btn-primary install-selected\">\n    "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_goInstall : stack1), depth0))
    + "\n  </button>\n</div>\n";
},"usePartial":true,"useData":true});

/***/ }),

/***/ 2202:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Handlebars = __webpack_require__(3449);
function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"plugin-setup-wizard bootstrap-3\">\n	<div class=\"modal fade in\" style=\"display: block;\">\n		<div class=\"modal-dialog\">\n			<div class=\"modal-content\"></div>\n		</div>\n	</div>\n</div>";
},"useData":true});

/***/ }),

/***/ 4701:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Handlebars = __webpack_require__(3449);
function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
module.exports = (Handlebars["default"] || Handlebars).template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "		<div class=\"selected-plugin "
    + alias3(((helper = (helper = helpers.installStatus || (depth0 != null ? depth0.installStatus : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"installStatus","hash":{},"data":data}) : helper)))
    + "\" id=\"installing-"
    + alias3(__default(__webpack_require__(553)).call(depth0,(depth0 != null ? depth0.name : depth0),{"name":"id","hash":{},"data":data}))
    + "\" data-tooltip=\""
    + alias3(((helper = (helper = helpers.errorMessage || (depth0 != null ? depth0.errorMessage : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"errorMessage","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class=\"modal-header\">\n	<h4 class=\"modal-title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installing_title : stack1), depth0))
    + "</h4>\n</div>\n<div class=\"modal-body installing-body\">\n	<div class=\"jumbotron welcome-panel installing-panel\">\n		<h1>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installing_title : stack1), depth0))
    + "</h1>\n		<div class=\"progress\">\n		  <div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"60\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 0%;\">\n		    <span class=\"sr-only\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installing_title : stack1), depth0))
    + "</span>\n		  </div>\n		</div>\n	</div>\n\n	<div class=\"selected-plugin-progress\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.installingPlugins : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</div>\n\n	<div class=\"install-console\">\n	  <div class=\"install-console-scroll\">\n	    <div class=\"install-text\"></div>\n	  </div>\n	  <div class=\"dependency-legend\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installingConsole_dependencyIndicatorNote : stack1), depth0))
    + "</div>\n	</div>\n</div>\n";
},"useData":true});

/***/ }),

/***/ 7697:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Handlebars = __webpack_require__(3449);
function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class=\"modal-header\">\n    <h4 class=\"modal-title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_configureProxy_label : stack1), depth0))
    + "</h4>\n</div>\n<div class=\"modal-body\">\n    <div class=\"jumbotron welcome-panel security-panel\">\n        <iframe src=\""
    + alias2(((helper = (helper = helpers.baseUrl || (depth0 != null ? depth0.baseUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"baseUrl","hash":{},"data":data}) : helper)))
    + "/setupWizard/proxy-configuration\"></iframe>\n    </div>\n</div>\n<div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-link install-home\">\n        "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_goBack : stack1), depth0))
    + "\n    </button>\n    <button type=\"button\" class=\"btn btn-primary save-proxy-config\" disabled>\n        "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_configureProxy_save : stack1), depth0))
    + "\n    </button>\n</div>\n";
},"useData":true});

/***/ }),

/***/ 4173:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Handlebars = __webpack_require__(3449);
function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
module.exports = (Handlebars["default"] || Handlebars).template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "		<h1>"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installComplete_bannerRestart : stack1), depth0))
    + "</h1>\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return "		<h1>"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installComplete_banner : stack1), depth0))
    + "</h1>\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.restartSupported : depth0),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.program(8, data, 0),"data":data})) != null ? stack1 : "");
},"6":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "			<p>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installComplete_installComplete_restartRequiredMessage : stack1), depth0))
    + "</p>\n			<button type=\"button\" class=\"btn btn-primary install-done-restart\">\n				"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installComplete_restartLabel : stack1), depth0))
    + "\n			</button>\n";
},"8":function(depth0,helpers,partials,data) {
    var stack1;

  return "			<p>"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installComplete_installComplete_restartRequiredNotSupportedMessage : stack1), depth0))
    + "</p>\n";
},"10":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "		<p>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installComplete_message : stack1), depth0))
    + "</p>\n		<button type=\"button\" class=\"btn btn-primary install-done\">\n			"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installComplete_finishButtonLabel : stack1), depth0))
    + "\n		</button>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"modal-header\">\n	<h4 class=\"modal-title\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_installComplete_title : stack1), depth0))
    + "</h4>\n</div>\n<div class=\"modal-body\">\n	<div class=\"jumbotron welcome-panel success-panel\">\n"
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.restartRequired : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "		\n		"
    + ((stack1 = ((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n\n"
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.restartRequired : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.program(10, data, 0),"data":data})) != null ? stack1 : "")
    + "	</div>\n</div>\n";
},"useData":true});

/***/ }),

/***/ 8971:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Handlebars = __webpack_require__(3449);
function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
module.exports = (Handlebars["default"] || Handlebars).template({"1":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "        <p>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_pluginInstallFailure_message : stack1), depth0))
    + "</p>\n        <button type=\"button\" class=\"btn btn-primary retry-failed-plugins\">\n            "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_retry : stack1), depth0))
    + "\n        </button>\n";
},"3":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "        <div class=\"selected-plugin "
    + alias3(((helper = (helper = helpers.installStatus || (depth0 != null ? depth0.installStatus : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"installStatus","hash":{},"data":data}) : helper)))
    + "\" data-name=\""
    + alias3(__default(__webpack_require__(553)).call(depth0,(depth0 != null ? depth0.name : depth0),{"name":"id","hash":{},"data":data}))
    + "\">"
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "    <button type=\"button\" class=\"btn btn-link continue-with-failed-plugins\">\n        "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_continue : stack1), depth0))
    + "\n    </button>\n    <button type=\"button\" class=\"btn btn-primary retry-failed-plugins\">\n        "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_retry : stack1), depth0))
    + "\n    </button>\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <button type=\"button\" class=\"btn btn-primary continue-with-failed-plugins\">\n        "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_continue : stack1), depth0))
    + "\n    </button>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class=\"modal-header\">\n    <h4 class=\"modal-title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_welcomePanel_title : stack1), depth0))
    + "</h4>\n</div>\n<div class=\"modal-body\">\n    <div class=\"jumbotron welcome-panel success-panel\">\n        <h1>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_pluginInstallFailure_title : stack1), depth0))
    + "</h1>\n\n"
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.failedPlugins : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n\n    <div class=\"selected-plugin-progress success-panel\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.installingPlugins : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n</div>\n<div class=\"modal-footer\">\n"
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.failedPlugins : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});

/***/ }),

/***/ 1301:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Handlebars = __webpack_require__(3449);
function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<div class=\"modal-header closeable\">\n	<h4 class=\"modal-title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_welcomePanel_title : stack1), depth0))
    + "</h4>\n</div>\n<div class=\"modal-body\">\n  <i class=\"water-mark icon-service\"></i>\n  <div class=\"jumbotron welcome-panel\">\n		 <h1>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_welcomePanel_banner : stack1), depth0))
    + "</h1>\n	<p>\n			"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_welcomePanel_message : stack1), depth0))
    + "\n		</p>\n		<p class=\"button-set\">\n			<a class=\"btn btn-primary btn-lg btn-huge install-recommended\" href=\"#\" role=\"button\">\n				<b>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_welcomePanel_recommendedActionTitle : stack1), depth0))
    + "</b>\n				<sub>\n					"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_welcomePanel_recommendedActionDetails : stack1), depth0))
    + "\n				</sub>\n				<i class=\"icon icon-signup\"></i>\n			</a>\n\n			<a class=\"btn btn-default btn-lg btn-huge install-custom\" href=\"#\" role=\"button\">\n				<b>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_welcomePanel_customizeActionTitle : stack1), depth0))
    + "</b>\n				<sub>\n					"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.translations : depth0)) != null ? stack1.installWizard_welcomePanel_customizeActionDetails : stack1), depth0))
    + "\n				</sub>\n				<i class=\"icon icon-plug\"></i>\n			</a>\n		</p>\n	</div>\n\n</div>\n";
},"useData":true});

/***/ }),

/***/ 6961:
/***/ (function() {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 4856:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3093);
/* harmony import */ var _yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2021);
/* harmony import */ var _yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6550);
/* harmony import */ var _yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7888);
/* harmony import */ var _yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1560);
/* harmony import */ var _yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(951);
/* harmony import */ var _yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_pluginSetupWizard_less__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6961);
/* harmony import */ var _yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_pluginSetupWizard_less__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_pluginSetupWizard_less__WEBPACK_IMPORTED_MODULE_6__);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()((_yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_pluginSetupWizard_less__WEBPACK_IMPORTED_MODULE_6___default()), options);




       /* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((_yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_pluginSetupWizard_less__WEBPACK_IMPORTED_MODULE_6___default()) && (_yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_pluginSetupWizard_less__WEBPACK_IMPORTED_MODULE_6___default().locals) ? (_yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_pluginSetupWizard_less__WEBPACK_IMPORTED_MODULE_6___default().locals) : undefined);


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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/runtimeId */
/******/ 	!function() {
/******/ 		__webpack_require__.j = 721;
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
/******/ 			721: 0
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
/******/ 	__webpack_require__.O(undefined, [216], function() { return __webpack_require__(6664); })
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [216], function() { return __webpack_require__(4856); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=pluginSetupWizard.js.map