// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// TLD: top level domain; the "com" in "google.com"
import { tldLocales, defaultTld, allTlds } from "./locales.js";

createForm().catch(console.error);

async function createForm() {
  const { defaultTld: storedTld = Object.keys(tldLocales) } =
    await chrome.storage.sync.get("defaultTld");
  const form = document.getElementById("form");
  createRadioButtons(form, storedTld);
  createAllTldsDropdown(form, storedTld);
}

async function handleCheckboxClick(event) {
  const checkbox = event.target;
  const tld = checkbox.value;
  const enabled = checkbox.checked;
  console.log(tld, enabled);
  if (enabled) {
    await chrome.storage.sync.set({ defaultTld: tld });
  }
}

const createRadioButtons = (form, storedTld) => {
  for (const [tld, locale] of Object.entries(tldLocales)) {
    const label = document.createElement("label");

    const checkbox = document.createElement("input");
    checkbox.type = "radio";
    checkbox.checked =
      (!!storedTld && tld === storedTld) || (!storedTld && tld === defaultTld);

    checkbox.name = "tld";
    checkbox.value = tld;
    checkbox.addEventListener("click", (event) => {
      handleCheckboxClick(event).catch(console.error);
    });

    const span = document.createElement("span");
    span.textContent = `${locale} (google.${tld})`;

    label.appendChild(checkbox);
    label.appendChild(span);

    const div = document.createElement("div");
    div.appendChild(label);

    form.appendChild(div);
  }
};

const createAllTldsDropdown = (form, storedTld) => {
  const select = document.createElement("select");
  const topOption = document.createElement("option");
  topOption.disabled = "disabled";
  topOption.textContent = "More domains";
  topOption.selected = "selected";
  select.appendChild(topOption);

  for (const tld of allTlds) {
    const option = document.createElement("option");
    option.value = tld;
    option.textContent = `google.${tld}`;
    if (!!storedTld && tld === storedTld) {
      option.selected = "selected";
    }
    select.appendChild(option);
  }

  select.addEventListener("change", () => {
    const value = select.value;
    if (value) {
      chrome.storage.sync.set({ defaultTld: value }).catch(console.error);
    }
  });

  form.appendChild(select);
};
