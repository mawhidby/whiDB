const readline = require('readline');
const { isValidCommand } = require('./src/commands.js');
const WhiDB = require('./src/database.js');

const database = new WhiDB();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'whiDB > '
});

rl.prompt();

rl.on('line', (line) => {
  const [command, arg1, arg2] = line.split(' ');

  if (!isValidCommand(command, arg1, arg2)) {
    console.log('INVALID COMMAND');
    rl.prompt();
    return;
  }

  database.executeCommand(command, arg1, arg2);

  rl.prompt();
}).on('close', () => {
  process.exit(0);
});
