import { TIMEOUT_SEC } from "./config";

const timeout = (s) =>
  new Promise((_, reject) =>
    setTimeout(
      () =>
        reject(new Error(`Request took too long! Timeout after ${s} seconds`)),
      s * 1000
    )
  );

// const UUID = () => Math.random().toString(36).substr(2, 9);

function UUID() {
  return "xxxx-xxx-4xxx-yxx-xxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const getJson = async (url) => {
  try {
    const res = await Promise.race([timeout(TIMEOUT_SEC), fetch(url)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};

const ImgName = (imagePath) => imagePath.slice(0, imagePath.lastIndexOf("."));

const getUrlSearchParam = (query) => {
  const url = new URL(window.location.href);

  if (query) {
    url.searchParams.set("search", query);
    window.history.pushState({}, "", url.href);
    return;
  }
  return url.searchParams.get("search");
};

const createElement = (tag, attributes = {}) => {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) =>
    element.setAttribute(key, value)
  );
  return element;
};


// HTMLElement.prototype.get = function (selector) {
//   return this.querySelector(selector);
// };

// HTMLElement.prototype.getAll = function (selector) {
//   return Array.from(this.querySelectorAll(selector));
// };


const formatPrice = (price) => (+price).toFixed(2);
const get = (selector) => document.querySelector(selector);
const getAll = (selector) => document.querySelectorAll(selector);

export {
  getJson,
  ImgName,
  UUID,
  getUrlSearchParam,
  createElement,
  get,
  getAll,
  formatPrice,
};
