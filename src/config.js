const fs = require('fs');
const path = require('path');

const CONFIG_DIR = path.join(__dirname, '..', 'config');

function readJson(fileName) {
  const file = path.join(CONFIG_DIR, fileName);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

// Merge rules:
//  - objects are merged key by key (recursively);
//  - arrays and plain values from the plant file REPLACE the default value.
function merge(base, override) {
  const result = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const isObject = value && typeof value === 'object' && !Array.isArray(value);
    result[key] = isObject && base[key] ? merge(base[key], value) : value;
  }
  return result;
}

// Returns default.json merged with plant-<plant>.json (if that file exists).
function loadConfig(plant) {
  const base = readJson('default.json');
  const plantConfig = readJson(`plant-${plant}.json`);
  return plantConfig ? merge(base, plantConfig) : base;
}

module.exports = { loadConfig };
