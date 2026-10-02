const test = require('node:test');
const assert = require('node:assert');
const { loadConfig } = require('../src/config');

test('plant 1000 config is loaded', () => {
  assert.strictEqual(loadConfig('1000').plantName, 'Factory A');
});

test('plant 2000 config exists', () => {
  assert.strictEqual(loadConfig('2000').plantName, 'Factory B');
});
