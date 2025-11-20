import "@testing-library/jest-dom";
import { beforeEach, vi } from "vitest";

// Mock localStorage con implementación real
const localStorageData = {};
const localStorageMock = {
  getItem: (key) => localStorageData[key] || null,
  setItem: (key, value) => {
    localStorageData[key] = String(value);
  },
  removeItem: (key) => {
    delete localStorageData[key];
  },
  clear: () => {
    Object.keys(localStorageData).forEach(key => {
      delete localStorageData[key];
    });
  }
};
global.localStorage = localStorageMock;

// Reset mocks antes de cada test
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});
