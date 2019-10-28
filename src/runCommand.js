const {execFile} = require('child_process');

const runCommand = async (filePath, args) => {
  return new Promise((resolve, reject) => {
    execFile(filePath, args, (error, stdout) => {
      if (error) {
        reject(error);
      }

      resolve(stdout);
    });
  });
};

module.exports = {
  runCommand
};
