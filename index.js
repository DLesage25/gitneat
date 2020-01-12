#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const files = require('./lib/files');
const github = require('./lib/github');
const repo = require('./lib/repo');

clear();

console.log(
    chalk.yellow(
        figlet.textSync('gitneat', {
            font: 'Kban',
            horizontalLayout: 'full'
        })
    )
);

if (files.directoryExists('.git')) {
    console.log(chalk.red('Already a Git repository. Exiting...'));
    process.exit();
}

const main = async () => {
    try {
        // Check for authentication, if not request access token
        await github.loginFlow();
        // Create remote repository
        const repoUrl = await repo.createRemoteRepo();
        // Create .gitignore file
        await repo.createGitignore();
        // Set up local repository and push to remote
        await repo.setupRepo(repoUrl);
        console.log(chalk.green('All done!'));
    } catch (e) {
        if (e) {
            switch (e.status) {
                case 401:
                    console.log(
                        chalk.red(
                            "Couldn't log you in. Please provide correct credentials/token."
                        )
                    );
                    break;
                case 422:
                    console.log(
                        chalk.red(
                            'There already exists a remote repository with the same name'
                        )
                    );
                    break;
                default:
                    console.log(e);
            }
        }
    }
};

main();
