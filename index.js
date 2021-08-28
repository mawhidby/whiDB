const readline = require('readline');
const { isValidCommand, COMMANDS } = require('./src/commands.js');
const { get, set, del, count } = require('./src/database.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'whiDB > '
});

rl.prompt();

rl.on('line', (line) => {
  console.log(line);
  const [command, arg1, arg2] = line.split(' ');

  if (!isValidCommand(command, arg1, arg2)) {
    console.log('INVALID COMMAND');
    rl.prompt();
    return;
  }

  switch(command) {
    case COMMANDS.SET:
      set(arg1, arg2);
      break;
    case COMMANDS.GET:
      const value = get(arg1);
      console.log(value);
      break;
    case COMMANDS.DELETE:
      del(arg1);
      break;
    case COMMANDS.COUNT:
      const num = count(arg1);
      console.log(num);
      break;
    case COMMANDS.END:
      process.exit(0);
    case COMMANDS.BEGIN:
      break;
    case COMMANDS.ROLLBACK:
      break;
    case COMMANDS.COMMIT:
      break;
    default:
      break;
  }

  rl.prompt();
}).on('close', () => {
  process.exit(0);
});
