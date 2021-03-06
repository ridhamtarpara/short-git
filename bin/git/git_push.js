#! /usr/bin/env node
const shell = require('shelljs');
const chalk = require('chalk');
// SET SILENT TRUE SO THAT DEFAULT OUTPUT IS NOT PRINTED ON CONSOLE
shell.config.silent = true;
// get command line argument for commit message
module.exports = (branchName, args, callback) => {
  // remove \n from the end
  let command = 'git push';
  switch (args.length) {
    case 0:
      command += ` origin ${branchName}`;
      break;
    case 1:
      command += ` origin ${args[0]}`;
      break;
    case 2:
      command += ` ${args[0]} ${args[1]}`;
      break;
    default:
      callback(chalk.redBright('Invalid arguments'));
      return;
  }
  shell.exec(command, (code, stdout, stderr) => {
    if (stderr) {
      let output = `${chalk.red('Push failed')}`;
      if (code === 128) {
        output = `${output}\n${chalk.redBright('Unable to reach git host\nPlease check your internet connection')}`;
        callback(output);
        return;
      }
      if (stderr.indexOf('rejected') !== -1) {
        output = `${output}\n${chalk.redBright('Updates were rejected because the remote contains work that you do not have locally. This is usually caused by another repository pushing to the same ref. You may want to first integrate the remote changes (e.g., \'git pull ...\') before pushing again.')}`;
        callback(output);
        return;
      }
      // get hash
      // example:
      // To https://github.com/ridhamtarpara/short-git.git
      //   9ae2336..9835655  ft/push -> ft/push
      let commitHash = stderr.substr(stderr.indexOf('..') + 2);
      commitHash = commitHash.substr(0, commitHash.indexOf('  '));
      // get git url
      let url = stderr.substr(3, stderr.indexOf('\n') - 7);
      // Generate final url
      url = `${url}/commit/${commitHash}`;
      callback(`${chalk.greenBright('Push Successfull')}\nLink : ${url}`);
      return;
    }
    callback(chalk.greenBright(stdout));
  });
};
