/* eslint-disable unicorn/filename-case */
const {execFile} = require('child_process');

// eslint-disable-next-line require-await
const runCommand = async (filePath, args) =>
  new Promise((resolve, reject) => {
    execFile(filePath, args, (error, stdout) => {
      if (error) {
        reject(error);
      }

      resolve(stdout);
    });
  });

module.exports = {
  runCommand,
};
