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

/**
 * Determines whether a provided command and its arguments are valid
 * Assumption: The arguments are strings, as parsed in by Node's readline
 * @param command The command to perform
 * @param arg1 First argument to pass to the db functions (e.g., name, value)
 * @param arg2 Second argument to pass to the db functions (e.g., value)
 * @returns true if the passed command is valid, else false
 */
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