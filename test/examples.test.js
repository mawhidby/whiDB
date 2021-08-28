const assert = require('assert');
const WhiDB = require('../src/database');

let database;

describe('Provided Examples', function() {
  beforeEach(() => {
    delete database;
  });

  it('Example #1', () => {
    database = new WhiDB();

    assert.equal(database.get('a'), 'NULL');

    database.set('a', 'foo');
    database.set('b', 'foo');
    assert.equal(database.count('foo'), 2);
    assert.equal(database.count('bar'), 0);

    database.del('a');
    assert.equal(database.count('foo'), 1);

    database.set('b', 'baz');
    assert.equal(database.count('foo'), 0);
    assert.equal(database.get('b'), 'baz');
    assert.equal(database.get('B'), 'NULL');    
  });

  it('Example #2', () => {
    database = new WhiDB();

    database.set('a', 'foo');
    database.set('a', 'foo');
    assert.equal(database.count('foo'), 1);
    assert.equal(database.get('a'), 'foo');

    database.del('a');
    assert.equal(database.get('a'), 'NULL');
    assert.equal(database.count('foo'), 0);
  });

  it('Example #3', () => {
    database = new WhiDB();

    database.begin();
    database.set('a', 'foo');
    assert.equal(database.get('a'), 'foo');

    database.begin();
    database.set('a', 'bar');
    assert.equal(database.get('a'), 'bar');

    database.set('a', 'baz');
    database.rollback();
    assert.equal(database.get('a'), 'foo');

    database.rollback();
    assert.equal(database.get('a'), 'NULL');
  });

  it('Example #4', () => {
    database = new WhiDB();

    database.set('a', 'foo');
    database.set('b', 'baz');
    database.begin();
    assert.equal(database.get('a'), 'foo');

    database.set('a', 'bar');
    assert.equal(database.count('bar'), 1);

    database.begin();
    database.del('a');
    assert.equal(database.get('a'), 'NULL');
    assert.equal(database.count('bar'), 0);

    database.rollback();
    assert.equal(database.get('a'), 'bar');
    assert.equal(database.count('bar'), 1);

    database.commit();
    assert.equal(database.get('a'), 'bar');
    assert.equal(database.get('b'), 'baz');
  });
});
