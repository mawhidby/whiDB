const { COMMANDS } = require('./commands.js');
const debug = false;

class WhiDB {
  constructor(db = {}, transactions = [], currentTransactionIndex = -1) {
    this.db = db;
    this.transactions = transactions;
    this.currentTransactionIndex = currentTransactionIndex;
  }

  /**
   * Sets the key to the provided value in the database
   * If there are active transactions, will push the command to the current transaction's queue
   * 
   * @param key The key to set
   * @param value The value to set
   * @param overrideDb If provided, operations will be performed on this object 
   * (e.g., in the case of applying transactions)
   */
  set(key, value, overrideDb) {
    let currentState;
    if (overrideDb) {
      currentState = overrideDb;
      currentState[key] = value;
    } else {
      currentState = this.db;
      if (this.currentTransactionIndex > -1) {
        this.transactions[this.currentTransactionIndex].push(`SET ${key} ${value}`);
      } else {
        currentState[key] = value;
      }
    }
    
    if (debug) {
      console.log('db: ', currentState);
      console.log('transactions: ', this.transactions, '\n');
    }
  }

  /**
   * Gets the value assigned to a key in the database
   * If there are active transactions, then it will apply the transactions in order
   * before retrieving the key.
   * 
   * @param key The key to retrieve the value for
   * @returns The value, if it exists, else NULL
   */
  get(key) {
    let currentState;
    if (this.currentTransactionIndex > -1) {
      currentState = this.applyTransactions();
    } else {
      currentState = this.db;
    }

    if (debug) {
      console.log('db: ', currentState, '\n');
    }

    if (currentState.hasOwnProperty(key)) {
      return currentState[key];
    }

    return 'NULL';
  }

  /**
   * Deletes a key from the database
   * If there are active transactions, will push the command to the current transaction's queue
   *
   * @param key The key to delete from the db
   * @param overrideDb If provided, operations will be performed on this object 
   * (e.g., in the case of applying transactions)
   */
  del(key, overrideDb) {
    let currentState;
    if (overrideDb) {
      currentState = overrideDb;
      delete currentState[key];
    } else {
      currentState = this.db;

      if (this.currentTransactionIndex > -1) {
        this.transactions[this.currentTransactionIndex].push(`DELETE ${key}`);
      } else {
        delete currentState[key];
      }
    }
    
    if (debug) {
      console.log('db: ', currentState);
      console.log('transactions: ', this.transactions, '\n');
    }
  }

  /**
   * Returns the number of names that have a given value assigned to them. 
   * 
   * @param value The value to count the number of occurrences of
   * @returns The number of occurrences of the value in the database if they exist, else 0
   */
  count(value) {
    let currentState;
    if (this.currentTransactionIndex > -1) {
      currentState = this.applyTransactions();
    } else {
      currentState = this.db;
    }

    const keys = Object.keys(currentState);
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
      if (currentState[keys[i]] === value) {
        count++;
      }
    }

    if (debug) {
      console.log('db: ', currentState, '\n');
    }
    return count;
  }

  /**
   * Begins a new transaction
   */
  begin() {
    this.transactions.push([]);
    this.currentTransactionIndex++;
  }

  /**
   * Rolls back the most recent transaction
   * @returns 'TRANSACTION NOT FOUND' if there are no active transactions, else undefined
   */
  rollback() {
    if (this.transactions.length === 0) {
      return 'TRANSACTION NOT FOUND';
    }
    this.transactions.pop();
    this.currentTransactionIndex--;
  }

  /**
   * Commits ALL of the open transactions
   * @returns 'TRANSACTION NOT FOUND' if there are no active transactions, else undefined
   */
  commit() {
    if (this.transactions.length === 0) {
      return 'TRANSACTION NOT FOUND';
    }
  
    this.db = this.applyTransactions();
  }

  /**
   * Returns the current transaction index (used for testing)
   * @returns The current transaction index being tracked
   */
  getCurrentTransactionIndex() {
    return this.currentTransactionIndex;
  }

  /**
   * Applies all of the open transactions to a clone of the current db
   * @returns The state of the db after applying transactions
   */
  applyTransactions() {
    const newDb = Object.assign({}, this.db);
    for (let i = 0; i < this.transactions.length; i++) {
      let transaction = this.transactions[i];
      for (let j = 0; j < transaction.length; j++) {
        if (debug) {
          console.log('Executing command ', this.transactions[j]);
        }
  
        let [command, arg1, arg2] = transaction[j].split(' ');
        this.executeCommand(command, arg1, arg2, newDb);
      }
    }
  
    if (debug) {
      console.log('db after applying transactions: ', newDb);
    }
    
    return newDb;
  }

  /**
   * Executes commands against a database
   * @param command The command to perform
   * @param arg1 First argument to pass to the db functions (e.g., name, value)
   * @param arg2 Second argument to pass to the db functions (e.g., value)
   * @param overrideDb If provided, operations will be performed on this object 
   * (e.g., in the case of applying transactions)
   */
  executeCommand (command, arg1, arg2, overrideDb) {
    let output;
  
    switch(command) {
      case COMMANDS.SET:
        this.set(arg1, arg2, overrideDb);
        break;
      case COMMANDS.GET:
        output = this.get(arg1);
        console.log(output);
        break;
      case COMMANDS.DELETE:
        this.del(arg1, overrideDb);
        break;
      case COMMANDS.COUNT:
        output = this.count(arg1);
        console.log(output);
        break;
      case COMMANDS.END:
        process.exit(0);
      case COMMANDS.BEGIN:
        this.begin();
        break;
      case COMMANDS.ROLLBACK:
        output = this.rollback();
        if (output) console.log(output);
        break;
      case COMMANDS.COMMIT:
        output = this.commit();
        if (output) console.log(output);
        break;
      default:
        break;
    }
  }
}

module.exports = WhiDB;