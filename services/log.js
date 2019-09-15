function log(...items) {
  console.log.apply(null, items);
  console.log('\n');
}

module.exports = {
  log
};