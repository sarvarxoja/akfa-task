const { loadOrders, loadNotifications, loadEquipment } = require('../src/data');
const { getOpenOrders, countNotificationsByEquipment } = require('../src/tasks');

const equipment = loadEquipment();
const nameById = Object.fromEntries(equipment.map((e) => [e.EquipmentId, e.Description]));

const openA = getOpenOrders(loadOrders(), '1000');
const counts = countNotificationsByEquipment(loadNotifications());
const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);

console.log('=== ТОРО эрталабки ҳисобот ===');
console.log('Завод 1000 очиқ буюртмалар:', openA.length);
for (const order of openA) {
  console.log(`  ${order.OrderId}  P${order.Priority || '-'}  ${order.ShortText}`);
}
console.log('Хабарномалар ускуна бўйича:');
for (const [id, n] of top) {
  console.log(`  ${n}  ${nameById[id] || id} (${id})`);
}
