#!/usr/bin/env node

const clear = require('clear');
const figlet = require('figlet');

const files = require('./lib/files');
const github = require('./lib/github');
const repo = require('./lib/repo');

const { warning, error, success } = require('./lib/messages');

clear();

warning(
    figlet.textSync('gitneat', {
        font: 'Kban',
        horizontalLayout: 'full'
    })
);

if (files.directoryExists('.git')) {
    error('This is a Git repository already. Exiting...');
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
        success('All done!');
    } catch (e) {
        switch (e.status) {
            case 401:
                error(
                    "Couldn't log you in. Please provide correct credentials/token."
                );
                break;
            case 422:
                error(
                    'There already exists a remote repository with the same name'
                );
                break;
            default:
                error(e);
        }
    }
};

main();
