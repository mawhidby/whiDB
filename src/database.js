const { COMMANDS } = require('./commands.js');
const debug = false;

class WhiDB {
  constructor(db = {}, transactions = [], currentTransactionIndex = -1) {
    this.db = db;
    this.transactions = transactions;
    this.currentTransactionIndex = currentTransactionIndex;
  }

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

  begin() {
    this.transactions.push([]);
    this.currentTransactionIndex++;
  }

  rollback() {
    if (this.transactions.length === 0) {
      return 'TRANSACTION NOT FOUND';
    }
    this.transactions.pop();
    this.currentTransactionIndex--;
  }

  commit() {
    if (this.transactions.length === 0) {
      return 'TRANSACTION NOT FOUND';
    }
  
    this.db = this.applyTransactions();
  }

  getCurrentTransactionIndex() {
    return this.currentTransactionIndex;
  }

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