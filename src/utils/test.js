import { settings } from "/src/config/settings";

export const cLog = (...args) => {
  if (settings.DEBUG) {
    console.log(...args);
  }
};

export const cError = (...args) => {
  if (settings.DEBUG) {
    console.error(...args);
  }
};
