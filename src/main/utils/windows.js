
const map = new Map();

function addWindow(name, win) {
  map.set(name, win);
}
function getWindow(name) {
  return map.get(name);
}

module.exports = {
  addWindow,
  getWindow
};
