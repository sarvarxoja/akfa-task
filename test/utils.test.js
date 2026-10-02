const test = require('node:test');
const assert = require('node:assert');
const { formatDate, getOperations, totalPlannedHours, parseODataDate } = require('../src/utils');
const { loadOrders } = require('../src/data');

const orders = loadOrders();
const byId = (id) => orders.find((o) => o.OrderId === id);

test('parseODataDate reads OData dates', () => {
  assert.strictEqual(parseODataDate('/Date(0)/').toISOString(), '1970-01-01T00:00:00.000Z');
});

test('formatDate shows DD.MM.YYYY', () => {
  assert.strictEqual(formatDate(new Date(Date.UTC(2026, 9, 5))), '05.10.2026');
});

test('getOperations works for an order without operations', () => {
  assert.deepStrictEqual(getOperations(byId('4000105')), []);
});

test('totalPlannedHours sums hours of all operations', () => {
  assert.strictEqual(totalPlannedHours(byId('4000101')), 4);
});
