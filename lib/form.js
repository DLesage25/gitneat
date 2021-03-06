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
    },
    askRepoDetails: () => {
        const argv = require('minimist')(process.argv.slice(2));

        const questions = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter a name for the repository:',
                default: argv._[0] || files.getCurrentDirectoryBase(),
                validate: value => {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter a name for the repository.';
                    }
                }
            },
            {
                type: 'input',
                name: 'description',
                default: argv._[1] || null,
                message: 'Optionally enter a description of the repository:'
            },
            {
                type: 'list',
                name: 'visibility',
                message: 'Public or private:',
                choices: ['public', 'private'],
                default: 'public'
            }
        ];
        return inquirer.prompt(questions);
    },
    askIgnoreType: () => {
        const questions = [
            {
                type: 'list',
                name: 'ignoreType',
                message: 'Manually ignore files or use a template?',
                choices: ['Manual', 'Template'],
                default: 'Template'
            }
        ];
        return inquirer.prompt(questions);
    },
    askIgnoreFiles: filelist => {
        const questions = [
            {
                type: 'checkbox',
                name: 'ignore',
                message: 'Select the files and/or folders you wish to ignore:',
                choices: filelist,
                default: ['node_modules', 'bower_components']
            }
        ];
        return inquirer.prompt(questions);
    },
    askIgnoreTemplates: ignoreTemplates => {
        const questions = [
            {
                type: 'list',
                name: 'ignoreTemplate',
                message: 'Select the ignore template you want to use:',
                choices: ignoreTemplates,
                default: ['Node']
            }
        ];
        return inquirer.prompt(questions);
    }
};
