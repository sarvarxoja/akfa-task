// Helper functions used by the mobile app screens.

// OData sends dates as "/Date(1790000000000)/" — milliseconds since 01.01.1970 (UTC).
function parseODataDate(value) {
  const match = /\/Date\((-?\d+)\)\//.exec(value || '');
  return match ? new Date(Number(match[1])) : null;
}

// Formats a date for the screen as DD.MM.YYYY (UTC).
function formatDate(date) {
  if (!date) return '';
  const day = String(date.getUTCDate()).padStart(2, '0');
  // getUTCMonth() returns 0-11, so we add 1 for standard 1-12 month representation
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}.${month}.${year}`;
}

// SAP stores equipment numbers with leading zeros (18 characters).
// Users often type them without zeros: "10000101" -> "000000000010000101".
function normalizeEquipmentId(id) {
  return String(id || '').trim().padStart(18, '0');
}

// Returns the list of operations of an order safely.
function getOperations(order) {
  return order?.Operations?.results || [];
}

// Total planned hours of all operations of an order.
function totalPlannedHours(order) {
  return getOperations(order).reduce((sum, op) => sum + (Number(op.PlannedHours) || 0), 0);
}

module.exports = {
  parseODataDate,
  formatDate,
  normalizeEquipmentId,
  getOperations,
  totalPlannedHours,
};