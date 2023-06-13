/**
 * mock nanoid
 */
jest.mock('nanoid', () => {
  return {
    nanoid: () => {},
  };
});

/**
 * mock URL
 */
globalThis.URL.createObjectURL = jest.fn();

/**
 * mock Worker
 */
globalThis.Worker = class Worker {
  constructor(stringUrl) {
    this.url = stringUrl;
    this.onmessage = () => {};
  }

  postMessage(msg) {
    this.onmessage(msg);
  }
};

/**
 * mock FontFace
 */
class MockFontFace {
  constructor() {}

  load() {}
}

globalThis.FontFace = MockFontFace;

globalThis.document.fonts = new Set();
