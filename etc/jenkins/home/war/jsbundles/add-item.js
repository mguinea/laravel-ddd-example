/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 6470:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7601);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);


var getItems = function () {
  var d = jquery__WEBPACK_IMPORTED_MODULE_0___default().Deferred();
  jquery__WEBPACK_IMPORTED_MODULE_0___default().get("itemCategories?depth=3&iconStyle=icon-xlg").done(function (data) {
    d.resolve(data);
  });
  return d.promise();
};

var jRoot = jquery__WEBPACK_IMPORTED_MODULE_0___default()("head").attr("data-rooturl");
jquery__WEBPACK_IMPORTED_MODULE_0___default().when(getItems()).done(function (data) {
  jquery__WEBPACK_IMPORTED_MODULE_0___default()(function () {
    //////////////////////////
    // helper functions...
    function parseResponseFromCheckJobName(data) {
      var html = jquery__WEBPACK_IMPORTED_MODULE_0___default().parseHTML(data);
      var element = html[0];

      if (element !== undefined) {
        return jquery__WEBPACK_IMPORTED_MODULE_0___default()(element).text();
      }

      return undefined;
    }

    function cleanClassName(className) {
      return className.replace(/\./g, "_");
    }

    function checkForLink(desc) {
      if (desc.indexOf('&lt;a href="') === -1) {
        return desc;
      } // eslint-disable-next-line


      var newDesc = desc.replace(/\&lt;/g, "<").replace(/\&gt;/g, ">");
      return newDesc;
    }

    function getCopyFromValue() {
      return jquery__WEBPACK_IMPORTED_MODULE_0___default()('input[type="text"][name="from"]', "#createItem").val();
    }

    function isItemNameEmpty() {
      var itemName = jquery__WEBPACK_IMPORTED_MODULE_0___default()('input[name="name"]', "#createItem").val();
      return itemName === "" ? true : false;
    }

    function getFieldValidationStatus(fieldId) {
      return jquery__WEBPACK_IMPORTED_MODULE_0___default()("#" + fieldId).data("valid");
    }

    function setFieldValidationStatus(fieldId, status) {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()("#" + fieldId).data("valid", status);
    }

    function activateValidationMessage(messageId, context, message) {
      if (message !== undefined && message !== "") {
        jquery__WEBPACK_IMPORTED_MODULE_0___default()(messageId, context).text("» " + message);
      }

      cleanValidationMessages(context);
      hideInputHelp(context);
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(messageId).removeClass("input-message-disabled");
    }

    function cleanValidationMessages(context) {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(context).find(".input-validation-message").addClass("input-message-disabled");
    }

    function hideInputHelp(context) {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(".input-help", context).addClass("input-message-disabled");
    }

    function showInputHelp(context) {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(".input-help", context).removeClass("input-message-disabled");
    } // About Scroll-linked effect: https://developer.mozilla.org/en-US/docs/Mozilla/Performance/Scroll-linked_effects


    function doSticky() {
      var decorator = jquery__WEBPACK_IMPORTED_MODULE_0___default()("form .footer .btn-decorator");
      var pos = decorator.offset();
      var vpH = jquery__WEBPACK_IMPORTED_MODULE_0___default()(window).height();

      if (pos.top >= vpH) {
        decorator.css({
          position: "fixed"
        });
      }

      jquery__WEBPACK_IMPORTED_MODULE_0___default()(window).scroll(function () {
        var footer = jquery__WEBPACK_IMPORTED_MODULE_0___default()("form .footer");
        var ref1 = decorator.offset().top + decorator.outerHeight();
        var ref2 = footer.offset().top + footer.outerHeight();
        var vpH = jquery__WEBPACK_IMPORTED_MODULE_0___default()(window).height();

        if (ref2 > vpH + jquery__WEBPACK_IMPORTED_MODULE_0___default()(window).scrollTop()) {
          decorator.css({
            position: "fixed"
          });
        } else if (ref2 - 1 <= ref1) {
          decorator.css({
            position: "absolute"
          });
        }
      });
    }

    function enableSubmit(status) {
      var btn = jquery__WEBPACK_IMPORTED_MODULE_0___default()("form .footer .btn-decorator button[type=submit]");

      if (status === true) {
        if (btn.hasClass("disabled")) {
          btn.removeClass("disabled");
          btn.prop("disabled", false);
        }
      } else {
        if (!btn.hasClass("disabled")) {
          btn.addClass("disabled");
          btn.prop("disabled", true);
        }
      }
    }

    function getFormValidationStatus() {
      if (getFieldValidationStatus("name") && (getFieldValidationStatus("items") || getFieldValidationStatus("from"))) {
        return true;
      }

      return false;
    }

    function cleanItemSelection() {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(".categories").find('li[role="radio"]').attr("aria-checked", "false");
      jquery__WEBPACK_IMPORTED_MODULE_0___default()("#createItem").find('input[type="radio"][name="mode"]').removeAttr("checked");
      jquery__WEBPACK_IMPORTED_MODULE_0___default()(".categories").find(".active").removeClass("active");
      setFieldValidationStatus("items", false);
    }

    function cleanCopyFromOption() {
      jquery__WEBPACK_IMPORTED_MODULE_0___default()("#createItem").find('input[type="radio"][value="copy"]').removeAttr("checked");
      jquery__WEBPACK_IMPORTED_MODULE_0___default()('input[type="text"][name="from"]', "#createItem").val("");
      setFieldValidationStatus("from", false);
    } //////////////////////////////////
    // Draw functions


    function drawCategory(category) {
      var $category = jquery__WEBPACK_IMPORTED_MODULE_0___default()("<div/>").addClass("category").attr("id", "j-add-item-type-" + cleanClassName(category.id));
      var $items = jquery__WEBPACK_IMPORTED_MODULE_0___default()("<ul/>").addClass("j-item-options");
      var $catHeader = jquery__WEBPACK_IMPORTED_MODULE_0___default()('<div class="header" />');
      var title = "<h2>" + category.name + "</h2>";
      var description = "<p>" + category.description + "</p>"; // Add items

      jquery__WEBPACK_IMPORTED_MODULE_0___default().each(category.items, function (i, elem) {
        $items.append(drawItem(elem));
      });
      $catHeader.append(title);
      $catHeader.append(description);
      $category.append($catHeader);
      $category.append($items);
      return $category;
    }

    function drawItem(elem) {
      var item = document.createElement("li");
      item.tabIndex = 0;
      item.className = cleanClassName(elem.class);
      item.setAttribute("role", "radio");
      item.setAttribute("aria-checked", "false");
      var label = item.appendChild(document.createElement("label"));
      var radio = label.appendChild(document.createElement("input"));
      radio.type = "radio";
      radio.name = "mode";
      radio.value = elem.class;
      var displayName = label.appendChild(document.createElement("span"));
      displayName.className = "label";
      displayName.appendChild(document.createTextNode(elem.displayName));
      var desc = item.appendChild(document.createElement("div"));
      desc.className = "desc";
      desc.innerHTML = checkForLink(elem.description);
      var iconDiv = drawIcon(elem);
      item.appendChild(iconDiv);

      function select(e) {
        e.preventDefault();
        cleanCopyFromOption();
        cleanItemSelection();
        jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).attr("aria-checked", "true");
        jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).find('input[type="radio"][name="mode"]').prop("checked", true);
        jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).addClass("active");
        setFieldValidationStatus("items", true);

        if (!getFieldValidationStatus("name")) {
          jquery__WEBPACK_IMPORTED_MODULE_0___default()('input[name="name"][type="text"]', "#createItem").focus();
        } else {
          if (getFormValidationStatus()) {
            enableSubmit(true);
          }
        }
      }

      item.addEventListener("click", select);
      item.addEventListener("keydown", function (evt) {
        if (evt.code === "Space" || evt.code === "Enter") {
          this.click();
          evt.stopPropagation();
        }
      });
      return item;
    }

    function drawIcon(elem) {
      var iconDiv = document.createElement("div");

      if (elem.iconClassName && elem.iconQualifiedUrl) {
        iconDiv.className = "icon";
        var img1 = document.createElement("img");
        img1.className = elem.iconClassName + " icon-xlg";
        img1.src = elem.iconQualifiedUrl;
        iconDiv.appendChild(img1); // Example for Freestyle project
        // <div class="icon"><img class="icon-freestyle-project icon-xlg" src="/jenkins/static/108b2346/images/48x48/freestyleproject.png"></div>
      } else if (elem.iconFilePathPattern) {
        iconDiv.className = "icon";
        var iconFilePath = jRoot + "/" + elem.iconFilePathPattern.replace(":size", "48x48");
        var img2 = document.createElement("img");
        img2.src = iconFilePath;
        iconDiv.appendChild(img2); // Example for Maven project
        // <div class="icon"><img src="/jenkins/plugin/maven-plugin/images/48x48/mavenmoduleset.png"></div>
      } else {
        var colors = ["c-49728B", "c-335061", "c-D33833", "c-6D6B6D", "c-6699CC"];
        var desc = elem.description || "";
        var name = elem.displayName;
        var colorClass = colors[desc.length % 4];
        var aName = name.split(" ");
        var a = name.substring(0, 1);
        var b = aName.length === 1 ? name.substring(1, 2) : aName[1].substring(0, 1);
        var spanFakeImgA = document.createElement("span");
        spanFakeImgA.className = "a";
        spanFakeImgA.innerText = a;
        iconDiv.appendChild(spanFakeImgA);
        var spanFakeImgB = document.createElement("span");
        spanFakeImgB.className = "b";
        spanFakeImgB.innerText = b;
        iconDiv.appendChild(spanFakeImgB);
        iconDiv.className = colorClass + " default-icon"; // Example for MockFolder
        // <div class="default-icon c-49728B"><span class="a">M</span><span class="b">o</span></div>
      }

      return iconDiv;
    } // The main panel content is hidden by default via an inline style. We're ready to remove that now.


    jquery__WEBPACK_IMPORTED_MODULE_0___default()("#add-item-panel").removeAttr("style"); // Render all categories

    var $categories = jquery__WEBPACK_IMPORTED_MODULE_0___default()("div.categories");
    jquery__WEBPACK_IMPORTED_MODULE_0___default().each(data.categories, function (i, elem) {
      drawCategory(elem).appendTo($categories);
    }); // Focus

    jquery__WEBPACK_IMPORTED_MODULE_0___default()("#add-item-panel").find("#name").focus(); // Init NameField

    jquery__WEBPACK_IMPORTED_MODULE_0___default()('input[name="name"]', "#createItem").on("blur input", function () {
      if (!isItemNameEmpty()) {
        var itemName = jquery__WEBPACK_IMPORTED_MODULE_0___default()('input[name="name"]', "#createItem").val();
        jquery__WEBPACK_IMPORTED_MODULE_0___default().get("checkJobName", {
          value: itemName
        }).done(function (data) {
          var message = parseResponseFromCheckJobName(data);

          if (message !== "") {
            activateValidationMessage("#itemname-invalid", ".add-item-name", message);
          } else {
            cleanValidationMessages(".add-item-name");
            showInputHelp(".add-item-name");
            setFieldValidationStatus("name", true);

            if (getFormValidationStatus()) {
              enableSubmit(true);
            }
          }
        });
      } else {
        enableSubmit(false);
        setFieldValidationStatus("name", false);
        cleanValidationMessages(".add-item-name");
        activateValidationMessage("#itemname-required", ".add-item-name");
      }
    }); // Init CopyFromField

    jquery__WEBPACK_IMPORTED_MODULE_0___default()('input[name="from"]', "#createItem").on("blur input", function () {
      if (getCopyFromValue() === "") {
        jquery__WEBPACK_IMPORTED_MODULE_0___default()("#createItem").find('input[type="radio"][value="copy"]').removeAttr("checked");
      } else {
        cleanItemSelection();
        jquery__WEBPACK_IMPORTED_MODULE_0___default()("#createItem").find('input[type="radio"][value="copy"]').prop("checked", true);
        setFieldValidationStatus("from", true);

        if (!getFieldValidationStatus("name")) {
          activateValidationMessage("#itemname-required", ".add-item-name");
          setTimeout(function () {
            jquery__WEBPACK_IMPORTED_MODULE_0___default()('input[name="name"][type="text"]', "#createItem").focus();
          }, 400);
        } else {
          if (getFormValidationStatus()) {
            enableSubmit(true);
          }
        }
      }
    }); // Client-side validation

    jquery__WEBPACK_IMPORTED_MODULE_0___default()("#createItem").submit(function (event) {
      if (!getFormValidationStatus()) {
        event.preventDefault();

        if (!getFieldValidationStatus("name")) {
          activateValidationMessage("#itemname-required", ".add-item-name");
          jquery__WEBPACK_IMPORTED_MODULE_0___default()('input[name="name"][type="text"]', "#createItem").focus();
        } else {
          if (!getFieldValidationStatus("items") && !getFieldValidationStatus("from")) {
            activateValidationMessage("#itemtype-required", ".add-item-name");
            jquery__WEBPACK_IMPORTED_MODULE_0___default()('input[name="name"][type="text"]', "#createItem").focus();
          }
        }
      }
    }); // Disable the submit button

    enableSubmit(false); // Do sticky the form buttons

    doSticky();
  });
});

/***/ }),

/***/ 8286:
/***/ (function() {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 3184:
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
/* harmony import */ var _yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_add_item_less__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8286);
/* harmony import */ var _yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_add_item_less__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_add_item_less__WEBPACK_IMPORTED_MODULE_6__);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()((_yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_add_item_less__WEBPACK_IMPORTED_MODULE_6___default()), options);




       /* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((_yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_add_item_less__WEBPACK_IMPORTED_MODULE_6___default()) && (_yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_add_item_less__WEBPACK_IMPORTED_MODULE_6___default().locals) ? (_yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_add_item_less__WEBPACK_IMPORTED_MODULE_6___default().locals) : undefined);


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
/******/ 		__webpack_require__.j = 138;
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
/******/ 			138: 0
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
/******/ 	__webpack_require__.O(undefined, [216], function() { return __webpack_require__(6470); })
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [216], function() { return __webpack_require__(3184); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=add-item.js.map