const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Files are in OData format: { "d": { "results": [ ... ] } }
function readResults(fileName) {
  const raw = fs.readFileSync(path.join(DATA_DIR, fileName), 'utf-8');
  return JSON.parse(raw).d.results;
}

const loadEquipment = () => readResults('equipment.json');
const loadOrders = () => readResults('orders.json');
const loadNotifications = () => readResults('notifications.json');

module.exports = { loadEquipment, loadOrders, loadNotifications };
