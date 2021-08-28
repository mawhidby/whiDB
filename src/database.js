const { COMMANDS } = require('./commands.js');

let db = {};
let transactions = [];
let currentTransactionIndex = -1;
const debug = false;

function set(key, value, overrideDb) {
  let currentState;
  if (overrideDb) {
    currentState = overrideDb;
    currentState[key] = value;
  } else {
    currentState = db;
    if (currentTransactionIndex > -1) {
      transactions[currentTransactionIndex].push(`SET ${key} ${value}`);
    } else {
      currentState[key] = value;
    }
  }
  
  if (debug) {
    console.log('db: ', currentState);
    console.log('transactions: ', transactions, '\n');
  }
};

function get(key) {
  let currentState;
  if (currentTransactionIndex > -1) {
    currentState = applyTransactions();
  } else {
    currentState = db;
  }

  if (debug) {
    console.log('db: ', currentState, '\n');
  }

  if (currentState.hasOwnProperty(key)) {
    return currentState[key];
  }

  return 'NULL';
};

function del(key, overrideDb) {
  let currentState;
  if (overrideDb) {
    currentState = overrideDb;
    delete currentState[key];
  } else {
    currentState = db;

    if (currentTransactionIndex > -1) {
      transactions[currentTransactionIndex].push(`DELETE ${key}`);
    } else {
      delete currentState[key];
    }
  }
  
  if (debug) {
    console.log('db: ', currentState);
    console.log('transactions: ', transactions, '\n');
  }
};

function count(value) {
  let currentState;
  if (currentTransactionIndex > -1) {
    currentState = applyTransactions();
  } else {
    currentState = db;
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

function begin() {
  transactions.push([]);
  currentTransactionIndex++;
};

function rollback() {
  if (transactions.length === 0) {
    console.log('TRANSACTION NOT FOUND');
    return;
  }
  transactions.pop();
  currentTransactionIndex--;
};

function commit() {
  if (transactions.length === 0) {
    console.log('TRANSACTION NOT FOUND');
    return;
  }

  db = applyTransactions();
}

function applyTransactions() {
  const newDb = Object.assign({}, db);
  for (let i = 0; i < transactions.length; i++) {
    let transaction = transactions[i];
    for (let j = 0; j < transaction.length; j++) {
      if (debug) {
        console.log('Executing command ', transactions[j]);
      }

      let [command, arg1, arg2] = transaction[j].split(' ');
      executeCommand(command, arg1, arg2, newDb);
    }
  }

  if (debug) {
    console.log('db after applying transactions: ', newDb);
  }
  
  return newDb;
}

const executeCommand = function executeCommand (command, arg1, arg2, overrideDb) {
  let value;
  let num;

  switch(command) {
    case COMMANDS.SET:
      set(arg1, arg2, overrideDb);
      break;
    case COMMANDS.GET:
      value = get(arg1);
      console.log(value);
      break;
    case COMMANDS.DELETE:
      del(arg1, overrideDb);
      break;
    case COMMANDS.COUNT:
      num = count(arg1);
      console.log(num);
      break;
    case COMMANDS.END:
      process.exit(0);
    case COMMANDS.BEGIN:
      begin();
      break;
    case COMMANDS.ROLLBACK:
      rollback();
      break;
    case COMMANDS.COMMIT:
      commit();
      break;
    default:
      break;
  }
}

exports.executeCommand = executeCommand;