const db = {};
let transaction = null;

exports.set = function set(key, value) {
  db[key] = value;
  console.log('db: ', db);
};

exports.get = function get(key) {
  console.log('db: ', db);
  if (db.hasOwnProperty(key)) {
    return db[key];
  }

  return 'NULL';
};

exports.del = function del(key) {
  delete db[key];
  console.log('db: ', db);
};

exports.count = function count(value) {
  const keys = Object.keys(db);
  let count = 0;
  console.log('db: ', db);
  for (let i = 0; i < keys.length; i++) {
    if (db[keys[i]] === value) {
      count++;
    }
  }
  return count;
}

exports.begin = function begin() {

};

exports.rollback = function rollback() {

};

exports.commit = function commit() {

}
