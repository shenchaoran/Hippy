import*as RootModule from'../../core/root/root.js';RootModule.Runtime.cachedResources.set("panels/search/searchResultsPane.css","/*\n * Copyright 2016 The Chromium Authors. All rights reserved.\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  padding: 0;\n  margin: 0;\n  overflow-y: auto;\n}\n\n.tree-outline {\n  padding: 0;\n}\n\n.tree-outline ol {\n  padding: 0;\n}\n\n.tree-outline li {\n  height: 16px;\n}\n\nli.search-result {\n  cursor: pointer;\n  font-size: 12px;\n  margin-top: 8px;\n  padding: 2px 0 2px 4px;\n  word-wrap: normal;\n  white-space: pre;\n}\n\nli.search-result:hover {\n  background-color: var(--item-hover-color);\n}\n\nli.search-result .search-result-file-name {\n  color: var(--color-text-primary);\n  flex: 1 1;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\nli.search-result .search-result-matches-count {\n  color: var(--color-text-secondary);\n  margin: 0 8px;\n}\n\nli.search-result.expanded .search-result-matches-count {\n  display: none;\n}\n\nli.show-more-matches {\n  color: var(--color-text-primary);\n  cursor: pointer;\n  margin: 8px 0 0 -4px;\n}\n\nli.show-more-matches:hover {\n  text-decoration: underline;\n}\n\nli.search-match {\n  margin: 2px 0;\n  word-wrap: normal;\n  white-space: pre;\n}\n\nli.search-match::before {\n  display: none;\n}\n\nli.search-match .search-match-line-number {\n  color: var(--color-text-secondary);\n  text-align: right;\n  vertical-align: top;\n  word-break: normal;\n  padding: 2px 4px 2px 6px;\n  margin-right: 5px;\n}\n\nli.search-match:hover {\n  background-color: var(--item-hover-color);\n}\n\nli.search-match .highlighted-match {\n  background-color: var(--color-syntax-5);\n}\n\n:host-context(.-theme-with-dark-background) li.search-match .highlighted-match {\n  /* The highlight color is light in dark mode so we want dark text. We need\n   * inverted color variables for this case which is logged in the dark mode\n   * tracking spreadsheet.\n   */\n  color: var(--color-background);\n}\n\n.tree-outline .devtools-link {\n  text-decoration: none;\n  display: block;\n  flex: auto;\n}\n\nli.search-match .search-match-content {\n  color: var(--color-text-primary);\n}\n\nol.children.expanded {\n  padding-bottom: 4px;\n}\n\n.search-match-link {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  margin-left: 9px;\n}\n\n.search-result-qualifier {\n  color: var(--color-text-secondary);\n}\n\n.search-result-dash {\n  color: var(--color-background-elevation-2);\n  margin: 0 4px;\n}\n\n/*# sourceURL=panels/search/searchResultsPane.css */");RootModule.Runtime.cachedResources.set("panels/search/searchView.css","/*\n * Copyright 2014 The Chromium Authors. All rights reserved.\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.search-drawer-header {\n  align-items: center;\n  flex-shrink: 0;\n  overflow: hidden;\n}\n\n.search-toolbar {\n  background-color: var(--color-background-elevation-2);\n  border-bottom: 1px solid var(--color-details-hairline);\n}\n\n.search-toolbar-summary {\n  background-color: var(--color-background-elevation-1);\n  border-top: 1px solid var(--color-details-hairline);\n  padding-left: 5px;\n  flex: 0 0 19px;\n  display: flex;\n  padding-right: 5px;\n}\n\n.search-toolbar-summary .search-message {\n  padding-top: 2px;\n  padding-left: 1ex;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n.search-view .search-results {\n  overflow-y: auto;\n  display: flex;\n  flex: auto;\n}\n\n.search-view .search-results > div {\n  flex: auto;\n}\n\n/*# sourceURL=panels/search/searchView.css */");