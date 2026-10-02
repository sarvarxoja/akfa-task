const test = require('node:test');
const assert = require('node:assert');
const { getOpenOrders, countNotificationsByEquipment, validateNotification } = require('../src/tasks');
const { loadOrders, loadNotifications, loadEquipment } = require('../src/data');
const { loadConfig } = require('../src/config');

const orders = loadOrders();
const equipment = loadEquipment();

test('getOpenOrders: open orders of plant 1000 in the right order', () => {
  const ids = getOpenOrders(orders, '1000').map((o) => o.OrderId);
  assert.deepStrictEqual(ids, ['4000104', '4000102', '4000101', '4000108', '4000105', '4000106']);
});

test('countNotificationsByEquipment: counts per equipment', () => {
  const counts = countNotificationsByEquipment(loadNotifications());
  assert.strictEqual(counts['000000000010000102'], 1);
  assert.strictEqual(counts['000000000010000201'], 2);
});

test('validateNotification: a correct notification is valid', () => {
  const result = validateNotification(
    { NotificationType: 'M2', Description: 'Motor is overheating', EquipmentId: '000000000010000101' },
    equipment,
    loadConfig('1000'),
  );
  assert.deepStrictEqual(result, { valid: true, errors: [] });
});

test('validateNotification: missing description', () => {
  const result = validateNotification(
    { NotificationType: 'M2', Description: '', EquipmentId: '000000000010000101' },
    equipment,
    loadConfig('1000'),
  );
  assert.strictEqual(result.valid, false);
  assert.ok(result.errors.includes('REQUIRED:Description'));
});
