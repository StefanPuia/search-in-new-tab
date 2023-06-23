// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// When you specify "type": "module" in the manifest background,
// you can include the service worker as an ES Module,
import { tldLocales, defaultTld } from "./locales.js";

// Add a listener to create the initial context menu items,
// context menu items only need to be created at runtime.onInstalled
chrome.runtime.onInstalled.addListener(async () => {
  createContextMenuOption(defaultTld);
});

// Open a new search tab when the user clicks a context menu
chrome.contextMenus.onClicked.addListener((item, tab) => {
  const tld = item.menuItemId;
  const url = new URL(`https://google.${tld}/search`);
  url.searchParams.set("q", item.selectionText);
  chrome.tabs.create({ url: url.href, index: tab.index + 1 });
});

// Add or removes the locale from context menu
// when the user checks or unchecks the locale in the popup
chrome.storage.onChanged.addListener(({ defaultTld }) => {
  const tld = defaultTld.newValue;
  console.log(defaultTld);
  if (typeof tld === "undefined") return;
  removeContextMenuOptions();
  createContextMenuOption(tld);
});

const createContextMenuTitle = (tld) => {
  return tld === defaultTld
    ? `Search with Google`
    : `Search with Google ${locale(tld)}`;
};

const removeContextMenuOptions = () => {
  chrome.contextMenus.removeAll();
};

const createContextMenuOption = (tld) => {
  chrome.contextMenus.create({
    id: tld,
    title: createContextMenuTitle(tld),
    type: "normal",
    contexts: ["selection"],
  });
};

const locale = (tld) => {
  return tldLocales[tld] ?? tld;
};
