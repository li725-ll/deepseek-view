const { logger } = require("./logger");
const store = require("./store");
const windows = require("./windows");

module.exports = {
  log: logger,
  store,
  windows,
};