/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 2774:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

"use strict";

// UNUSED EXPORTS: on, scrollspeed, setScrollspeed, tabbars

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
;// CONCATENATED MODULE: ./src/main/js/util/jquery-ext.js
/*
 * Some internal jQuery extensions.
 *
 * After migrating to webpack it modifies the provided version of jquery
 */


/**
 * TODO: look into other way of doing this
 */

var $ext;
var getJQuery = function () {
  if (!$ext) {
    initJQueryExt();
  }

  return $ext;
};
/*
 * Clear the $ext instance if the window changes. Primarily for unit testing.
 */

window_handle.getWindow(function () {
  $ext = undefined;
});
/**
 * Adds the :containsci selector to jQuery
 */

function initJQueryExt() {
  $ext = (jquery_default());
  /**
   * A pseudo selector that performs a case insensitive text contains search i.e. the same
   * as the standard ':contains' selector, but case insensitive.
   */

  $ext.expr[":"].containsci = $ext.expr.createPseudo(function (text) {
    return function (element) {
      var elementText = $ext(element).text();
      var result = elementText.toUpperCase().indexOf(text.toUpperCase()) !== -1;
      return result;
    };
  });
}

initJQueryExt();
;// CONCATENATED MODULE: ./src/main/js/widgets/config/model/util.js
function toId(string) {
  string = string.trim();
  return "config_" + string.replace(/[\W_]+/g, "_").toLowerCase();
}
;// CONCATENATED MODULE: ./src/main/js/widgets/config/model/ConfigRowGrouping.js

/*
 * =======================================================================================
 * Configuration table row grouping i.e. row-set-*, optional-block-*, radio-block-* etc
 *
 * A ConfigSection maintains a list of ConfigRowGrouping and then ConfigRowGrouping
 * itself maintains a list i.e. it's hierarchical. See ConfigSection.gatherRowGroups().
 * =======================================================================================
 */

function ConfigRowGrouping(startRow, parentRowGroupContainer) {
  this.startRow = startRow;
  this.parentRowGroupContainer = parentRowGroupContainer;
  this.endRow = undefined;
  this.rows = [];
  this.rowGroups = []; // Support groupings nested inside groupings

  this.toggleWidget = undefined;
  this.label = undefined;
}

ConfigRowGrouping.prototype.getRowCount = function (includeChildren) {
  var count = this.rows.length;

  if (includeChildren === undefined || includeChildren === true) {
    for (var i = 0; i < this.rowGroups.length; i++) {
      count += this.rowGroups[i].getRowCount();
    }
  }

  return count;
};

ConfigRowGrouping.prototype.getLabels = function () {
  var labels = [];

  if (this.label) {
    labels.push(this.label);
  }

  for (var i = 0; i < this.rowGroups.length; i++) {
    var rowSet = this.rowGroups[i];
    labels.push(rowSet.getLabels());
  }

  return labels;
};

ConfigRowGrouping.prototype.updateVisibility = function () {
  if (this.toggleWidget !== undefined) {
    var isChecked = this.toggleWidget.is(":checked");

    for (var i = 0; i < this.rows.length; i++) {
      if (isChecked) {
        this.rows[i].show();
      } else {
        this.rows[i].not(".help-area").hide();
      }
    }
  }

  for (var ii = 0; ii < this.rowGroups.length; ii++) {
    var rowSet = this.rowGroups[ii];
    rowSet.updateVisibility();
  }
};
/*
 * Find the row-set toggle widget i.e. the input element that indicates that
 * the row-set rows should be made visible or not.
 */


ConfigRowGrouping.prototype.findToggleWidget = function (row) {
  var $ = getJQuery();
  var input = $(":input.block-control", row);

  if (input.length === 1) {
    this.toggleWidget = input;
    this.label = input.next().text();
    input.addClass("disable-behavior");
  }
};

/* harmony default export */ var model_ConfigRowGrouping = (ConfigRowGrouping);
;// CONCATENATED MODULE: ./src/main/js/widgets/config/model/ConfigSection.js




var ConfigSection_pageHeaderHeight = page.pageHeaderHeight();
/*
 * =======================================================================================
 * Configuration table section.
 * =======================================================================================
 */

function ConfigSection(headerRow, parentCMD) {
  this.headerRow = headerRow;
  this.parentCMD = parentCMD;
  this.title = headerRow.attr("title");
  this.id = toId(this.title);
  this.rowGroups = undefined;
  this.activator = undefined;
  this.subSections = [];
  this.headerRow.addClass(this.id);
}

ConfigSection.prototype.isTopLevelSection = function () {
  return this.parentCMD.getSection(this.id) !== undefined;
};

ConfigSection.prototype.isVisible = function () {
  return this.headerRow.is(":visible");
};
/**
 * Get the page offset (height) at which this section comes
 * into view.
 * @returns {number}
 */


ConfigSection.prototype.getViewportEntryOffset = function () {
  return this.headerRow.offset().top - ConfigSection_pageHeaderHeight;
};
/**
 * Get the sibling section at the relative offset.
 * @param relOffset
 */


ConfigSection.prototype.getSibling = function (relOffset) {
  var sections = this.parentCMD.sections;
  var endIndex = sections.length - 1;

  for (var i = 0; i < endIndex; i++) {
    var testIndex = i + relOffset;

    if (testIndex < 0) {
      continue;
    } else if (testIndex > endIndex) {
      return undefined;
    }

    if (sections[i] === this) {
      return sections[testIndex];
    }
  }

  return undefined;
};
/**
 * Move another top-level section into this section i.e. adopt it.
 * <p>
 * This allows us to take a top level section (by id) and push it down
 * into another section e.g. pushing the "Advanced" section into the
 * "General" section.
 * @param sectionId The id of the top-level section to be adopted.
 */


ConfigSection.prototype.adoptSection = function (sectionId) {
  if (!this.isTopLevelSection()) {
    // Only top-level sections can adopt.
    return;
  }

  var child = this.parentCMD.getSection(sectionId);

  if (child && this.parentCMD.removeSection(child.id)) {
    this.subSections.push(child);
  }
};
/*
 * Get the section rows.
 */


ConfigSection.prototype.getRows = function () {
  var curTr = this.headerRow.next();
  var rows = [];
  var numNewRows = 0;
  rows.push(curTr);

  while (curTr.length === 1 && !curTr.hasClass("section-header-row")) {
    rows.push(curTr);

    if (!curTr.hasClass(this.id)) {
      numNewRows++;
      curTr.addClass(this.id);
    }

    curTr = curTr.next();
  }

  if (numNewRows > 0) {
    // We have new rows in the section ... reset cached info.
    if (this.rowGroups !== undefined) {
      this.gatherRowGroups(rows);
    }
  }

  return rows;
};
/*
 * Set the element (jquery) that activates the section (on click).
 */


ConfigSection.prototype.setActivator = function (activator) {
  this.activator = activator;
  var section = this;
  section.activator.click(function () {
    section.parentCMD.showSection(section);
  });
};

ConfigSection.prototype.activate = function () {
  if (this.activator) {
    this.activator.click();
  } else {
    console.warn("No activator attached to config section object.");
  }
};

ConfigSection.prototype.markAsActive = function () {
  this.parentCMD.hideSection();
  this.activator.addClass("active");
  this.markRowsAsActive();
};

ConfigSection.prototype.markRowsAsActive = function () {
  var rows = this.getRows();

  for (var i = 0; i < rows.length; i++) {
    rows[i].addClass("active");
  }

  for (var ii = 0; ii < this.subSections.length; ii++) {
    this.subSections[ii].markRowsAsActive();
  }

  this.updateRowGroupVisibility();
};

ConfigSection.prototype.hasText = function (text) {
  var $ = getJQuery();
  var selector = ":containsci('" + text + "')";
  var sectionRows = this.getRows();

  for (var i1 = 0; i1 < sectionRows.length; i1++) {
    var row = sectionRows[i1];
    var elementsWithText = $(selector, row);

    if (elementsWithText.length > 0) {
      return true;
    }
  }

  for (var i2 = 0; i2 < this.subSections.length; i2++) {
    if (this.subSections[i2].hasText(text)) {
      return true;
    }
  }

  return false;
};

ConfigSection.prototype.activeRowCount = function () {
  var activeRowCount = 0;
  var rows = this.getRows();

  for (var i = 0; i < rows.length; i++) {
    if (rows[i].hasClass("active")) {
      activeRowCount++;
    }
  }

  return activeRowCount;
};

ConfigSection.prototype.updateRowGroupVisibility = function () {
  if (this.rowGroups === undefined) {
    // Lazily gather row grouping information.
    this.gatherRowGroups();
  }

  for (var i = 0; i < this.rowGroups.length; i++) {
    var rowGroup = this.rowGroups[i];
    rowGroup.updateVisibility();
  }

  for (var ii = 0; ii < this.subSections.length; ii++) {
    this.subSections[ii].updateRowGroupVisibility();
  }
};

ConfigSection.prototype.gatherRowGroups = function (rows) {
  this.rowGroups = []; // Only tracking row-sets that are bounded by 'row-set-start' and 'row-set-end' (for now).
  // Also, only capturing the rows after the 'block-control' input (checkbox, radio etc)
  // and before the 'row-set-end'.
  // TODO: Find out how these actually work. It seems like they can be nested into a hierarchy :(
  // Also seems like you can have these "optional-block" thingies which are not wrapped
  // in 'row-set-start' etc. Grrrrrr :(

  if (rows === undefined) {
    rows = this.getRows();
  }

  if (rows.length > 0) {
    // Create a top level "fake" ConfigRowGrouping just to capture
    // the top level groupings. We copy the rowGroups info out
    // of this and use it in the top "this" ConfigSection instance.
    var rowGroupContainer = new model_ConfigRowGrouping(rows[0], undefined);
    this.rowGroups = rowGroupContainer.rowGroups;

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];

      if (row.hasClass("row-group-start")) {
        var newRowGroup = new model_ConfigRowGrouping(row, rowGroupContainer);

        if (rowGroupContainer) {
          rowGroupContainer.rowGroups.push(newRowGroup);
        }

        rowGroupContainer = newRowGroup;
        newRowGroup.findToggleWidget(row);
      } else if (rowGroupContainer) {
        if (row.hasClass("row-group-end")) {
          rowGroupContainer.endRow = row;
          rowGroupContainer = rowGroupContainer.parentRowGroupContainer; // pop back off the "stack"
        } else if (rowGroupContainer.toggleWidget === undefined) {
          rowGroupContainer.findToggleWidget(row);
        } else {
          // we have the toggleWidget, which means that this row is
          // one of the rows after that row and is one of the rows that's
          // subject to being made visible/hidden when the input is
          // checked or unchecked.
          rowGroupContainer.rows.push(row);
        }
      }
    }
  }
};

ConfigSection.prototype.getRowGroupLabels = function () {
  var labels = [];

  for (var i = 0; i < this.rowGroups.length; i++) {
    var rowGroup = this.rowGroups[i];
    labels.push(rowGroup.getLabels());
  }

  return labels;
};

ConfigSection.prototype.highlightText = function (text) {
  var $ = getJQuery();
  var selector = ":containsci('" + text + "')";
  var rows = this.getRows();

  for (var i1 = 0; i1 < rows.length; i1++) {
    var row = rows[i1];
    page.removeTextHighlighting(row);

    if (text !== "") {
      var regex = new RegExp("(" + text + ")", "gi");
      /*jshint loopfunc: true */

      $(selector, row).find(":not(:input)").each(function () {
        var $this = $(this);
        $this.contents().each(function () {
          // We specifically only mess with text nodes
          if (this.nodeType === 3) {
            var $textNode = $(this);
            var highlightedMarkup = $textNode.text().replace(regex, '<span class="highlight">$1</span>');
            $textNode.replaceWith('<span class="highlight-split">' + highlightedMarkup + "</span>");
          }
        });
      });
    }
  }

  for (var i2 = 0; i2 < this.subSections.length; i2++) {
    this.subSections[i2].highlightText(text);
  }
};

/* harmony default export */ var model_ConfigSection = (ConfigSection);
;// CONCATENATED MODULE: ./src/main/js/widgets/config/model/ConfigTableMetaData.js




/*
 * Internal support module for config tables.
 */

function markConfigTableParentForm(configTable) {
  var form = configTable.closest("form");
  form.addClass("jenkins-config");
  return form;
}

function findConfigTables() {
  var $ = getJQuery(); // The config tables are the immediate child <div> elements of <form> elements
  // with a name of "config"?

  return $('form[name="config"] > div');
}

function closestTR(node) {
  return node.closest("tr, .tr");
}

function fromConfigTable(configTable) {
  var $ = getJQuery();
  var sectionHeaders = $(".jenkins-section__title", configTable);
  var configForm = markConfigTableParentForm(configTable); // Mark the ancestor <tr>s of the section headers and add a title

  sectionHeaders.each(function () {
    var sectionHeader = $(this);
    var sectionRow = sectionHeader;
    var sectionTitle = sectionRow.text(); // Remove leading hash from accumulated text in title (from <a> element).

    if (sectionTitle.indexOf("#") === 0) {
      sectionTitle = sectionTitle.substring(1);
    }

    sectionRow.addClass("section-header-row");
    sectionRow.attr("title", sectionTitle);
  });
  var configTableMetadata = new ConfigTableMetaData(configForm, configTable);
  var topRows = configTableMetadata.getTopRows();
  var firstRow = configTableMetadata.getFirstRow();
  var curSection; // The first set of rows don't have a 'section-header-row', so we manufacture one,
  // calling it a "General" section. We do this by marking the first row in the table.
  // See the next block of code.

  if (!firstRow.hasClass("section-header-row")) {
    var tr;

    if (configTable[0].nodeName === "TR") {
      tr = "tr";
    } else {
      tr = "div";
    }

    var generalRow = $("<" + tr + ' class="section-header-row insert first tr" title="General"><div class="jenkins-section__title"><a class="section-anchor">#</a>General</div></' + tr + ">");
    firstRow.before(generalRow);
    firstRow = configTableMetadata.getFirstRow();
    var newArray = $.makeArray(topRows);
    newArray.unshift(generalRow[0]);
    topRows = $(newArray);
  }

  firstRow.addClass("section-header-row");
  firstRow.attr("title", "General"); // Go through the top level <tr> elements (immediately inside the <tbody>)
  // and group the related <tr>s based on the "section-header-row", using a "normalized"
  // version of the section title as the section id.

  topRows.each(function () {
    var tr = $(this);

    if (tr.hasClass("section-header-row")) {
      // a new section
      curSection = new model_ConfigSection(tr, configTableMetadata);
      configTableMetadata.sections.push(curSection);
    }
  });
  var buttonsRow = closestTR($("#bottom-sticker", configTable));
  buttonsRow.removeClass(curSection.id);
  buttonsRow.addClass(toId("buttons"));
  return configTableMetadata;
}
/*
 * =======================================================================================
 * ConfigTable MetaData class.
 * =======================================================================================
 */


function ConfigTableMetaData(configForm, configTable) {
  this.$ = getJQuery();
  this.configForm = configForm;
  this.configTable = configTable;
  this.configTableBody = configTable[0].nodeName === "DIV" ? configTable : this.$("> tbody", configTable);
  this.activatorContainer = undefined;
  this.sections = [];
  this.findInput = undefined;
  this.showListeners = [];
  this.configWidgets = undefined;
  this.addWidgetsContainer();
  this.addFindWidget();
}

ConfigTableMetaData.prototype.getTopRows = function () {
  var topRows = this.configTableBody.find("tr, .tr, .jenkins-section > .jenkins-section__title");
  return topRows;
};

ConfigTableMetaData.prototype.getFirstRow = function () {
  return this.getTopRows().first();
};

ConfigTableMetaData.prototype.addWidgetsContainer = function () {
  var $ = getJQuery();
  this.configWidgets = $('<div class="jenkins-config-widgets"></div>');
  this.configWidgets.insertBefore(this.configForm);
};

ConfigTableMetaData.prototype.addFindWidget = function () {
  var $ = getJQuery();
  var thisTMD = this;
  var findWidget = $('<div class="find-container"><div class="find"><span title="Clear" class="clear">x</span><input placeholder="find"/></div></div>');
  thisTMD.findInput = $("input", findWidget); // Add the find text clearer

  $(".clear", findWidget).click(function () {
    thisTMD.findInput.val("");
    thisTMD.showSections("");
    thisTMD.findInput.focus();
  });
  var findTimeout;
  thisTMD.findInput.keydown(function () {
    if (findTimeout) {
      clearTimeout(findTimeout);
      findTimeout = undefined;
    }

    findTimeout = setTimeout(function () {
      findTimeout = undefined;
      thisTMD.showSections(thisTMD.findInput.val());
    }, 300);
  });
  this.configWidgets.append(findWidget);
};

ConfigTableMetaData.prototype.sectionCount = function () {
  return this.sections.length;
};

ConfigTableMetaData.prototype.hasSections = function () {
  var hasSections = this.sectionCount() > 0;

  if (!hasSections) {
    console.warn("Jenkins configuration without sections?");
  }

  return hasSections;
};

ConfigTableMetaData.prototype.sectionIds = function () {
  var sectionIds = [];

  for (var i = 0; i < this.sections.length; i++) {
    sectionIds.push(this.sections[i].id);
  }

  return sectionIds;
};

ConfigTableMetaData.prototype.activateSection = function (sectionId) {
  if (!sectionId) {
    throw 'Invalid section id "' + sectionId + '"';
  }

  var section = this.getSection(sectionId);

  if (section) {
    section.activate();
  }
};

ConfigTableMetaData.prototype.activeSection = function () {
  if (this.hasSections()) {
    for (var i = 0; i < this.sections.length; i++) {
      var section = this.sections[i];

      if (section.activator.hasClass("active")) {
        return section;
      }
    }
  }
};

ConfigTableMetaData.prototype.getSection = function (ref) {
  if (this.hasSections()) {
    if (typeof ref === "number") {
      // It's a section index...
      if (ref >= 0 && ref <= this.sections.length - 1) {
        return this.sections[ref];
      }
    } else {
      // It's a section ID...
      for (var i = 0; i < this.sections.length; i++) {
        var section = this.sections[i];

        if (section.id === ref) {
          return section;
        }
      }
    }
  }

  return undefined;
};

ConfigTableMetaData.prototype.removeSection = function (sectionId) {
  if (this.hasSections()) {
    for (var i = 0; i < this.sections.length; i++) {
      var section = this.sections[i];

      if (section.id === sectionId) {
        this.sections.splice(i, 1);

        if (section.activator) {
          section.activator.remove();
        }

        return true;
      }
    }
  }

  return false;
};

ConfigTableMetaData.prototype.activateFirstSection = function () {
  if (this.hasSections()) {
    this.activateSection(this.sections[0].id);
  }
};

ConfigTableMetaData.prototype.activeSectionCount = function () {
  var activeSectionCount = 0;

  if (this.hasSections()) {
    for (var i = 0; i < this.sections.length; i++) {
      var section = this.sections[i];

      if (section.activator.hasClass("active")) {
        activeSectionCount++;
      }
    }
  }

  return activeSectionCount;
};

ConfigTableMetaData.prototype.showSection = function (section) {
  if (typeof section === "string") {
    section = this.getSection(section);
  }

  if (section) {
    var topRows = this.getTopRows(); // Active the specified section

    section.markAsActive(); // and always show the buttons

    topRows.filter(".config_buttons").show(); // Update text highlighting

    section.highlightText(this.findInput.val());
    fireListeners(this.showListeners, section);
  }
};

ConfigTableMetaData.prototype.hideSection = function () {
  var topRows = this.getTopRows();
  var $ = getJQuery();
  $(".config-section-activator.active", this.activatorContainer).removeClass("active");
  topRows.filter(".active").removeClass("active");
};

ConfigTableMetaData.prototype.onShowSection = function (listener) {
  this.showListeners.push(listener);
};

ConfigTableMetaData.prototype.showSections = function (withText) {
  this.removeTextHighlighting();

  if (withText === "") {
    if (this.hasSections()) {
      for (var i1 = 0; i1 < this.sections.length; i1++) {
        this.sections[i1].activator.removeClass("hidden");
      }

      var activeSection = this.activeSection();

      if (!activeSection) {
        this.showSection(this.sections[0]);
      } else {
        activeSection.highlightText(this.findInput.val());
      }
    }
  } else {
    if (this.hasSections()) {
      var sectionsWithText = [];

      for (var i2 = 0; i2 < this.sections.length; i2++) {
        var section = this.sections[i2];

        if (section.hasText(withText)) {
          section.activator.removeClass("hidden");
          sectionsWithText.push(section);
        } else {
          section.activator.addClass("hidden");
        }
      } // Select the first section to contain the text.


      if (sectionsWithText.length > 0) {
        this.showSection(sectionsWithText[0]);
      } else {
        this.hideSection();
      }
    }
  }
};
/**
 * We need this because sections can mysteriously change visibility,
 * which looks strange for scroolspy.
 */


ConfigTableMetaData.prototype.trackSectionVisibility = function () {
  if (isTestEnv()) {
    return;
  }

  var thisConfig = this;

  try {
    for (var i = 0; i < this.sections.length; i++) {
      var section = this.sections[i];

      if (section.isVisible()) {
        section.activator.show();
      } else {
        section.activator.hide();
      }
    }
  } finally {
    var interval = thisConfig.trackSectionVisibilityTO || 0; // The rescan interval will drop off over time, starting out very fast.

    interval += 10;
    interval = Math.min(interval, 500);
    thisConfig.trackSectionVisibilityTO = interval;
    setTimeout(function () {
      thisConfig.trackSectionVisibility();
    }, interval);
  }
};

ConfigTableMetaData.prototype.removeTextHighlighting = function () {
  page.removeTextHighlighting(this.configForm);
};

function fireListeners(listeners, contextObject) {
  for (var i = 0; i < listeners.length; i++) {
    fireListener(listeners[i], contextObject);
  }

  function fireListener(listener, contextObject) {
    setTimeout(function () {
      listener.call(contextObject);
    }, 1);
  }
}

function isTestEnv() {
  if (window === undefined) {
    return true;
  } else if (window.navigator === undefined) {
    return true;
  } else if (window.navigator.userAgent === undefined) {
    return true;
  } else if (window.navigator.userAgent === "JasmineTest") {
    return true;
  } else if (window.navigator.userAgent === "JenkinsTest") {
    return true;
  } else if (window.navigator.userAgent.toLowerCase().indexOf("jsdom") !== -1) {
    return true;
  }

  return false;
}

/* harmony default export */ var model_ConfigTableMetaData = ({
  markConfigTableParentForm,
  findConfigTables,
  fromConfigTable
});
;// CONCATENATED MODULE: ./src/main/js/util/localStorage.js

let storage = (0,window_handle.getWindow)().localStorage;

function setMock() {
  storage = {
    storage: {},
    setItem: function (name, value) {
      this.storage[name] = value;
    },
    getItem: function (name) {
      return this.storage[name];
    },
    removeItem: function (name) {
      delete this.storage[name];
    }
  };
}

function setItem(name, value) {
  storage.setItem(name, value);
}

function getItem(name, defaultVal) {
  var value = storage.getItem(name);

  if (!value) {
    value = defaultVal;
  }

  return value;
}

function removeItem(name) {
  return storage.removeItem(name);
}

if (typeof storage === "undefined") {
  console.warn("HTML5 localStorage not supported by this browser."); // mock it...

  setMock();
}

/* harmony default export */ var localStorage = ({
  setMock,
  setItem,
  getItem,
  removeItem
});
;// CONCATENATED MODULE: ./src/main/js/util/jenkinsLocalStorage.js


/**
 * Store a Jenkins globally scoped value.
 */

function setGlobalItem(name, value) {
  localStorage.setItem("jenkins:" + name, value);
}
/**
 * Get a Jenkins globally scoped value.
 */


function getGlobalItem(name, defaultVal) {
  return localStorage.getItem("jenkins:" + name, defaultVal);
}
/**
 * Store a Jenkins page scoped value.
 */


function setPageItem(name, value) {
  name = "jenkins:" + name + ":" + (0,window_handle.getWindow)().location.href;
  localStorage.setItem(name, value);
}
/**
 * Get a Jenkins page scoped value.
 */


function getPageItem(name, defaultVal) {
  name = "jenkins:" + name + ":" + (0,window_handle.getWindow)().location.href;
  return localStorage.getItem(name, defaultVal);
}

/* harmony default export */ var jenkinsLocalStorage = ({
  setGlobalItem,
  getGlobalItem,
  setPageItem,
  getPageItem
});
;// CONCATENATED MODULE: ./src/main/js/widgets/config/tabbar.js





var tabBarShowPreferenceKey = "config:usetabs";
var addPageTabs = function (configSelector, onEachConfigTable, options) {
  jquery_default()(function () {
    // We need to wait until after radioBlock.js Behaviour.js rules
    // have been applied, otherwise row-set rows become visible across sections.
    page.onload(".block-control", function () {
      // Only do job configs for now.
      var configTables = jquery_default()(configSelector);

      if (configTables.length > 0) {
        var tabBarShowPreference = jenkinsLocalStorage.getGlobalItem(tabBarShowPreferenceKey, "yes");

        if (tabBarShowPreference === "yes") {
          configTables.each(function () {
            var configTable = jquery_default()(this);
            var tabBar = addTabs(configTable, options);
            onEachConfigTable.call(configTable, tabBar);
            tabBar.deactivator.click(function () {
              jenkinsLocalStorage.setGlobalItem(tabBarShowPreferenceKey, "no");
              (0,window_handle.getWindow)().location.reload();
            });
          });
        } else {
          configTables.each(function () {
            var configTable = jquery_default()(this);
            var activator = addTabsActivator(configTable);
            model_ConfigTableMetaData.markConfigTableParentForm(configTable);
            activator.click(function () {
              jenkinsLocalStorage.setGlobalItem(tabBarShowPreferenceKey, "yes");
              (0,window_handle.getWindow)().location.reload();
            });
          });
        }
      }
    }, configSelector);
  });
};
var addTabsOnFirst = function () {
  return addTabs(tableMetadata.findConfigTables().first());
};
var addTabs = function (configTable, options) {
  var configTableMetadata;
  var tabOptions = options || {};
  var trackSectionVisibility = tabOptions.trackSectionVisibility || false;

  if (jquery_default().isArray(configTable)) {
    // It's a config <table> metadata block
    configTableMetadata = configTable;
  } else if (typeof configTable === "string") {
    // It's a config <table> selector
    var configTableEl = jquery_default()(configTable);

    if (configTableEl.length === 0) {
      throw "No config table found using selector '" + configTable + "'";
    } else {
      configTableMetadata = model_ConfigTableMetaData.fromConfigTable(configTableEl);
    }
  } else {
    // It's a config <table> element
    configTableMetadata = model_ConfigTableMetaData.fromConfigTable(configTable);
  }

  var tabBar = jquery_default()('<div class="tabBar config-section-activators"></div>');
  configTableMetadata.activatorContainer = tabBar;

  function newTab(section) {
    var tab = jquery_default()('<div class="tab config-section-activator"></div>');
    tab.text(section.title);
    tab.addClass(section.id);
    return tab;
  }

  var section;

  for (var i = 0; i < configTableMetadata.sections.length; i++) {
    section = configTableMetadata.sections[i];
    var tab = newTab(section);
    tabBar.append(tab);
    section.setActivator(tab);
  }

  var tabs = jquery_default()('<div class="form-config tabBarFrame"></div>');
  var noTabs = jquery_default()('<div class="noTabs" title="Remove configuration tabs and revert to the &quot;classic&quot; configuration view">Remove tabs</div>');
  configTableMetadata.configWidgets.append(tabs);
  configTableMetadata.configWidgets.prepend(noTabs);
  tabs.append(tabBar);
  tabs.mouseenter(function () {
    tabs.addClass("mouse-over");
  });
  tabs.mouseleave(function () {
    tabs.removeClass("mouse-over");
  });
  configTableMetadata.deactivator = noTabs; // Always activate the first section by default.

  configTableMetadata.activateFirstSection();

  if (trackSectionVisibility === true) {
    configTableMetadata.trackSectionVisibility();
  }

  return configTableMetadata;
};
var addTabsActivator = function (configTable) {
  var configWidgets = jquery_default()('<div class="jenkins-config-widgets"><div class="showTabs" title="Add configuration section tabs">Add tabs</div></div>');
  configWidgets.insertBefore(configTable.parent());
  return configWidgets;
};
var addFinderToggle = function (configTableMetadata) {
  var findToggle = jquery_default()('<div class="find-toggle" title="Find"></div>');
  var finderShowPreferenceKey = "config:showfinder";
  findToggle.click(function () {
    var findContainer = jquery_default()(".find-container", configTableMetadata.configWidgets);

    if (findContainer.hasClass("visible")) {
      findContainer.removeClass("visible");
      jenkinsLocalStorage.setGlobalItem(finderShowPreferenceKey, "no");
    } else {
      findContainer.addClass("visible");
      jquery_default()("input", findContainer).focus();
      jenkinsLocalStorage.setGlobalItem(finderShowPreferenceKey, "yes");
    }
  });

  if (jenkinsLocalStorage.getGlobalItem(finderShowPreferenceKey, "yes") === "yes") {
    findToggle.click();
  }
};
;// CONCATENATED MODULE: ./src/main/js/config-scrollspy.js




var isScrolling = false;
var ignoreNextScrollEvent = false;
var config_scrollspy_pageHeaderHeight = page.pageHeaderHeight();
var config_scrollspy_breadcrumbBarHeight = page.breadcrumbBarHeight(); // Some stuff useful for testing.

var tabbars = [];
var scrollspeed = 500; // Used to set scrollspeed from the the test suite

function setScrollspeed(newScrollspeed) {
  scrollspeed = newScrollspeed;
}
var eventListeners = [];
var on = function (listener) {
  eventListeners.push(listener);
};

function notify(event) {
  for (var i = 0; i < eventListeners.length; i++) {
    eventListeners[i](event);
  }
}

jquery_default()(function () {
  addPageTabs(".config-table.scrollspy", function (tabBar) {
    tabbars.push(tabBar);
    addFinderToggle(tabBar);
    tabBar.onShowSection(function () {
      // Scroll to the section.
      scrollTo(this, tabBar);
    });
    autoActivateTabs(tabBar);
    page.onWinScroll(function () {
      autoActivateTabs(tabBar);
    });
    page.onWinScroll(function () {
      stickTabbar(tabBar);
    }); // Manually trigger a repaint, otherwise Folder forms will not position
    // the buttons correctly. This is caused by upgrading jQuery to 3.5.x,
    // and probably has something to do with event listeners running in
    // different order.

    layoutUpdateCallback.call();
  }, {
    trackSectionVisibility: true
  });
});

function scrollTo(section, tabBar) {
  var $header = section.headerRow;
  var scrollTop = $header.offset().top - (jquery_default()("#main-panel .jenkins-config-widgets").outerHeight() + 15);
  isScrolling = true;
  jquery_default()("html,body").animate({
    scrollTop: scrollTop
  }, scrollspeed, function () {
    if (isScrolling) {
      notify({
        type: "click_scrollto",
        section: section
      });
      isScrolling = false;
      ignoreNextScrollEvent = stickTabbar(tabBar);
    }
  });
}
/**
 * Watch page scrolling, changing the active tab as needed.
 * @param tabBar The tabbar.
 */


function autoActivateTabs(tabBar) {
  if (isScrolling === true) {
    // Ignore window scroll events while we are doing a scroll.
    // See scrollTo function.
    return;
  }

  if (ignoreNextScrollEvent === true) {
    // Things like repositioning of the tabbar (see stickTabbar)
    // can trigger scroll events that we want to ignore.
    ignoreNextScrollEvent = false;
    return;
  }

  var winScrollTop = page.winScrollTop();
  var sections = tabBar.sections; // calculate the top and height of each section to know where to switch the tabs...

  jquery_default().each(sections, function (i, section) {
    if (!section.isVisible()) {
      return;
    } // each section enters the viewport at its distance down the page, less the height of
    // the toolbar, which hangs down the page. Or it is zero if the section doesn't
    // match or was removed...


    var viewportEntryOffset = section.getViewportEntryOffset(); // height of this one is the top of the next, less the top of this one.

    var sectionHeight = 0;
    var nextSection = nextVisibleSection(section);

    if (nextSection) {
      sectionHeight = nextSection.getViewportEntryOffset() - viewportEntryOffset;
    } // the trigger point to change the tab happens when the scroll position passes below the height of the section...
    // ...but we want to wait to advance the tab until the existing section is 75% off the top...
    // ### < 75% ADVANCED


    if (winScrollTop < viewportEntryOffset + 0.75 * sectionHeight) {
      section.markAsActive();
      notify({
        type: "manual_scrollto",
        section: section
      });
      return false;
    }
  });
}
/**
 * Stick the scrollspy tabbar to the top of the visible area as the user
 * scrolls down the page.
 * @param tabBar The tabbar.
 */


function stickTabbar(tabBar) {
  var win = jquery_default()(window_handle.getWindow());
  var winScrollTop = page.winScrollTop();
  var widgetBox = tabBar.configWidgets;
  var configTable = tabBar.configTable;
  var configForm = tabBar.configForm;

  var setWidth = function () {
    widgetBox.width(configForm.outerWidth() - 2);
  };

  if (winScrollTop > config_scrollspy_pageHeaderHeight - 5) {
    setWidth();
    widgetBox.css({
      position: "fixed",
      top: config_scrollspy_breadcrumbBarHeight - 5 + "px",
      margin: "0 auto !important"
    });
    configTable.css({
      "margin-top": widgetBox.outerHeight() + "px"
    });
    win.resize(setWidth);
    return true;
  } else {
    widgetBox.removeAttr("style");
    configTable.removeAttr("style");
    win.unbind("resize", setWidth);
    return false;
  }
}

function nextVisibleSection(section) {
  var next = section.getSibling(+1);

  while (next && !next.isVisible()) {
    next = next.getSibling(+1);
  }

  return next;
}

/***/ }),

/***/ 6167:
/***/ (function() {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 3976:
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
/* harmony import */ var _yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_config_scrollspy_less__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6167);
/* harmony import */ var _yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_config_scrollspy_less__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_config_scrollspy_less__WEBPACK_IMPORTED_MODULE_6__);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _yarn_virtual_style_loader_virtual_ed9460aef7_0_cache_style_loader_npm_3_3_1_4bbb6ec77f_470feef680_zip_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()((_yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_config_scrollspy_less__WEBPACK_IMPORTED_MODULE_6___default()), options);




       /* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((_yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_config_scrollspy_less__WEBPACK_IMPORTED_MODULE_6___default()) && (_yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_config_scrollspy_less__WEBPACK_IMPORTED_MODULE_6___default().locals) ? (_yarn_virtual_mini_css_extract_plugin_virtual_bc5594cf9b_0_cache_mini_css_extract_plugin_npm_2_6_1_4e6d2beaf0_df60840404_zip_node_modules_mini_css_extract_plugin_dist_loader_js_ruleSet_1_rules_0_use_1_yarn_virtual_css_loader_virtual_69d962f175_0_cache_css_loader_npm_6_7_1_b93a2de0d4_170fdbc630_zip_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_2_yarn_virtual_postcss_loader_virtual_77dab24057_0_cache_postcss_loader_npm_7_0_1_444ecd58b4_2a3cbcaaad_zip_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_0_use_3_yarn_virtual_less_loader_virtual_bb59c85985_0_cache_less_loader_npm_11_0_0_6dbfdb4abe_fe5f810549_zip_node_modules_less_loader_dist_cjs_js_ruleSet_1_rules_0_use_4_config_scrollspy_less__WEBPACK_IMPORTED_MODULE_6___default().locals) : undefined);


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
/******/ 		__webpack_require__.j = 814;
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
/******/ 			814: 0
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
/******/ 	__webpack_require__.O(undefined, [216], function() { return __webpack_require__(2774); })
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [216], function() { return __webpack_require__(3976); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=config-scrollspy.js.map