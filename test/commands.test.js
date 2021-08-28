const assert = require('assert');

const { isValidCommand } = require('../src/commands');

describe('commands.js', function() {
  describe('isValidCommand()', function() {
    describe('SET', function() {
      it('should accept a valid command', function() {
        assert.equal(isValidCommand('SET', 'hello', 'world'), true);
      });

      it('should reject if wrong number of args supplied', function() {
        assert.equal(isValidCommand('SET'), false);
        assert.equal(isValidCommand('SET', 'hello'), false);
      });
    });

    describe('GET', function() {
      it('should accept a valid command', function() {
        assert.equal(isValidCommand('GET', 'hello'), true);
      });

      it('should reject if wrong number of args supplied', function() {
        assert.equal(isValidCommand('GET'), false);
        assert.equal(isValidCommand('GET', 'hello', 'world'), false);
      });
    });

    describe('DELETE', function() {
      it('should accept a valid command', function() {
        assert.equal(isValidCommand('DELETE', 'hello'), true);
      });

      it('should reject if wrong number of args supplied', function() {
        assert.equal(isValidCommand('DELETE'), false);
        assert.equal(isValidCommand('DELETE', 'hello', 'world'), false);
      });
    });

    describe('COUNT', function() {
      it('should accept a valid command', function() {
        assert.equal(isValidCommand('COUNT', 'hello'), true);
      });

      it('should reject if wrong number of args supplied', function() {
        assert.equal(isValidCommand('COUNT'), false);
        assert.equal(isValidCommand('COUNT', 'hello', 'world'), false);
      });
    });

    describe('END', function() {
      it('should accept a valid command', function() {
        assert.equal(isValidCommand('END'), true);
      });

      it('should reject if wrong number of args supplied', function() {
        assert.equal(isValidCommand('END', 'hello'), false);
        assert.equal(isValidCommand('END', 'hello', 'world'), false);
      });
    });

    describe('BEGIN', function() {
      it('should accept a valid command', function() {
        assert.equal(isValidCommand('BEGIN'), true);
      });

      it('should reject if wrong number of args supplied', function() {
        assert.equal(isValidCommand('BEGIN', 'hello'), false);
        assert.equal(isValidCommand('BEGIN', 'hello', 'world'), false);
      });
    });

    describe('ROLLBACK', function() {
      it('should accept a valid command', function() {
        assert.equal(isValidCommand('ROLLBACK'), true);
      });

      it('should reject if wrong number of args supplied', function() {
        assert.equal(isValidCommand('ROLLBACK', 'hello'), false);
        assert.equal(isValidCommand('ROLLBACK', 'hello', 'world'), false);
      });
    });

    describe('COMMIT', function() {
      it('should accept a valid command', function() {
        assert.equal(isValidCommand('COMMIT'), true);
      });

      it('should reject if wrong number of args supplied', function() {
        assert.equal(isValidCommand('COMMIT', 'hello'), false);
        assert.equal(isValidCommand('COMMIT', 'hello', 'world'), false);
      });
    });
  })
})