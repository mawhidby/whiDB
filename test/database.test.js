const assert = require('assert');
const WhiDB = require('../src/database');

let database;

describe('database.js', function() {
  beforeEach(() => {
    delete database;
  });

  describe('count()', function() {
    it('should return 0 when the value does not exist', () => {
      database = new WhiDB();
      assert.equal(database.count('foo'), 0);
    });

    it('should return the accurate counts when the values do exist', () => {
      database = new WhiDB({
        a: 'foo',
        b: 'foo',
        c: 'bar'
      });
      assert.equal(database.count('foo'), 2);
      assert.equal(database.count('bar'), 1);
    })
  });

  describe('get()', function() {
    it('should return NULL when the key does not exist', () => {
      database = new WhiDB();
      assert.equal(database.get('a'), 'NULL');
    });

    it ('should return the value if the key exists in the db', () => {
      database = new WhiDB({
        foo: 'bar'
      });

      assert.equal(database.get('foo'), 'bar');
    });
  });

  describe('set()', function() {
    it('should properly set a value', () => {
      let db = {}
      database = new WhiDB(db);
      database.set('foo', 'bar');
      assert.equal(db.foo, 'bar');
    });

    it('should override a value if the key already exists', () => {
      let db = {};
      database = new WhiDB(db);

      database.set('foo', 'bar');
      assert.equal(db.foo, 'bar');

      database.set('foo', 'baz');
      assert.equal(db.foo, 'baz');
    });
  });

  describe('delete()', function() {
    it('should properly delete a value', () => {
      const db = {
        foo: 'bar'
      };

      database = new WhiDB(db);
      database.del('foo');
      assert.equal(db.hasOwnProperty('foo'), false);
    });

    it('should essentially no-op if the key does not exist', () => {
      const db = {
        foo: 'bar'
      };
  
      database = new WhiDB(db);
      database.del('bar');
      assert.equal(db.foo, 'bar');
    });
  });

  describe('begin()', function() {
    it('should add a new transaction to the array and update the transaction index', () => {
      let transactions = [];
      database = new WhiDB({}, transactions);

      database.begin();
      assert.equal(transactions.length, 1);
      assert.equal(database.getCurrentTransactionIndex(), 0);

      database.begin();
      assert.equal(transactions.length, 2);
      assert.equal(database.getCurrentTransactionIndex(), 1);
    });
  });

  describe('rollback()', function() {
    it('should return a message if there are no current transactions', () => {
      database = new WhiDB();
      assert.equal(database.rollback(), 'TRANSACTION NOT FOUND');
    });

    it('should remove the last transaction and update the transaction index', () => {
      let transactions = [['SET foo bar']];
      database = new WhiDB({}, transactions, 0);

      database.rollback();
      assert.equal(transactions.length, 0);
      assert.equal(database.getCurrentTransactionIndex(), -1);

      transactions = [['SET foo bar'], ['DELETE foo']];
      database = new WhiDB({}, transactions, 1);
      database.rollback();
      assert.equal(transactions.length, 1);
      assert.equal(database.getCurrentTransactionIndex(), 0);

      database.rollback();
      assert.equal(transactions.length, 0);
      assert.equal(database.getCurrentTransactionIndex(), -1);
    });
  });

  describe('commit()', function() {
    it('should return a message if there are no current transactions', () => {
      database = new WhiDB();
      assert.equal(database.commit(), 'TRANSACTION NOT FOUND');
    });
  });
  
});