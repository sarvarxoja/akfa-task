// PART 1 — implement the functions below. See TASK_*.md for the exact rules.
// You may add helper functions and use anything from ./utils.js.

const { parseODataDate, normalizeEquipmentId } = require('./utils');

function isBlank(value) {
  return value == null || String(value).trim() === '';
}

function isClosedStatus(systemStatus) {
  const tokens = String(systemStatus || '').split(/\s+/).filter(Boolean);
  return tokens.includes('TECO') || tokens.includes('CLSD');
}

function priorityAsNumber(priority) {
  if (isBlank(priority)) return Number.POSITIVE_INFINITY;
  return Number(priority);
}

function startDateMs(order) {
  const date = parseODataDate(order.BasicStartDate);
  return date ? date.getTime() : Number.POSITIVE_INFINITY;
}

function parseIsoDate(value) {
  if (isBlank(value)) return { given: false };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { given: true, invalid: true };
  return { given: true, invalid: false, date };
}

/**
 * Open orders of a plant, sorted.
 * @param {object[]} orders  - orders as in data/orders.json (d.results)
 * @param {string} plant     - e.g. "1000"
 * @returns {object[]}
 */
function getOpenOrders(orders, plant) {
  return orders
    .filter((order) => order.Plant === plant && !isClosedStatus(order.SystemStatus))
    .slice()
    .sort((a, b) => {
      const byPriority = priorityAsNumber(a.Priority) - priorityAsNumber(b.Priority);
      if (byPriority !== 0) return byPriority;

      const byDate = startDateMs(a) - startDateMs(b);
      if (byDate !== 0) return byDate;

      if (a.OrderId < b.OrderId) return -1;
      if (a.OrderId > b.OrderId) return 1;
      return 0;
    });
}

/**
 * Number of notifications per equipment.
 * @param {object[]} notifications
 * @returns {Object<string, number>}  e.g. { "000000000010000101": 3 }
 */
function countNotificationsByEquipment(notifications) {
  const counts = {};
  for (const notification of notifications) {
    if (isBlank(notification.EquipmentId)) continue;
    const equipmentId = normalizeEquipmentId(notification.EquipmentId);
    counts[equipmentId] = (counts[equipmentId] || 0) + 1;
  }
  return counts;
}

/**
 * Validates a new notification before it is saved.
 * @param {object} notification  - see TASK_*.md for the fields
 * @param {object[]} equipmentList
 * @param {object} config        - result of loadConfig(plant)
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateNotification(notification, equipmentList, config) {
  const errors = [];
  const rules = config.notification;
  const payload = notification || {};

  for (const field of rules.requiredFields) {
    if (isBlank(payload[field])) {
      errors.push(`REQUIRED:${field}`);
    }
  }

  if (payload.Description != null && String(payload.Description).length > rules.descriptionMaxLength) {
    errors.push('DESCRIPTION_TOO_LONG');
  }

  const start = parseIsoDate(payload.MalfunctionStart);
  const end = parseIsoDate(payload.MalfunctionEnd);
  const datesUnreadable = (start.given && start.invalid) || (end.given && end.invalid);
  const startAfterEnd = start.given && end.given && !start.invalid && !end.invalid && start.date > end.date;
  if (datesUnreadable || startAfterEnd) {
    errors.push('DATES_INVALID');
  }

  if (!isBlank(payload.EquipmentId)) {
    const wanted = normalizeEquipmentId(payload.EquipmentId);
    const exists = equipmentList.some((item) => normalizeEquipmentId(item.EquipmentId) === wanted);
    if (!exists) {
      errors.push('EQUIPMENT_NOT_FOUND');
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { getOpenOrders, countNotificationsByEquipment, validateNotification };
