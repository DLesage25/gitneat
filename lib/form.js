const inquirer = require('inquirer');

const files = require('./files');

module.exports = {
    askGithubCredentials: () => {
        const questions = [
            {
                name: 'username',
                type: 'input',
                message: 'Enter your GitHub username or e-mail address:',
                validate: value => {
                    if (value.length) return true;
                    else return 'Please enter your username or e-mail address.';
                }
            },
            {
                name: 'password',
                type: 'password',
                message: 'Enter your password:',
                validate: value => {
                    if (value.length) return true;
                    else return 'Please enter your password.';
                }
            }
        ];
        return inquirer.prompt(questions);
    },
    askForOauthToken: () => {
        return inquirer.prompt([
            {
                name: 'oauthToken',
                type: 'password',
                message: 'Enter your oAuth token:',
                validate: value => {
                    if (value.length) return true;
                    else return 'Please enter a valid oAuth token.';
                }
            }
        ]);
    }
};
