const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const files = require('./lib/files');
const form = require('./lib/form');

const github = require('./lib/github');

clear();

console.log(
    chalk.yellow(
        figlet.textSync('gitneat', {
            font: 'Kban',
            horizontalLayout: 'full'
        })
    )
);

// if (files.directoryExists('.git')) {
//     console.log(chalk.red('Already a Git repository. Exiting...'));
//     process.exit();
// }

const main = async () => {
    await github.loginFlow();
    // let token = github.getStoredGithubToken();
    // if (!token) {
    //     await github.setGithubCredentials();
    //     token = await github.registerNewToken();
    // }
    // console.log(token);
};

main();
