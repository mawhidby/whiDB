const commands = {
  SET: {
    args: 2
  },
  GET: {
    args: 1
  },
  DELETE: {
    args: 1
  },
  COUNT: {
    args: 1
  },
  END: {
    args: 0
  },
  BEGIN: {
    args: 0
  },
  ROLLBACK: {
    args: 0
  },
  COMMIT: {
    args: 0
  }
};

exports.COMMANDS = {
  SET: 'SET',
  GET: 'GET',
  DELETE: 'DELETE',
  COUNT: 'COUNT',
  END: 'END',
  BEGIN: 'BEGIN',
  ROLLBACK: 'ROLLBACK',
  COMMIT: 'COMMIT'
};

exports.isValidCommand = function isValidCommand(command, arg1, arg2) {
  if (!commands.hasOwnProperty(command)) return false;

  const numExpectedArgs = commands[command].args;
  if (numExpectedArgs === 0) {
    if (arg1 || arg2) {
      return false;
    }

    return true;
  } else if (numExpectedArgs === 1) {
    if (arg1 && !arg2) {
      return true;
    }

    return false;
  } else {
    if (arg1 && arg2) {
      return true;
    }

    return false;
  }
}