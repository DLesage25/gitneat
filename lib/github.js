const CLI = require('clui');
const Configstore = require('configstore');
const Octokit = require('@octokit/rest');
const chalk = require('chalk');

const Spinner = CLI.Spinner;

const { request } = require('@octokit/request');
const { createBasicAuth } = require('@octokit/auth');

const form = require('./form');
const pkg = require('../package.json');

const conf = new Configstore(pkg.name);
const status = new Spinner('Authenticating you, please wait...');

let octokit;

const authSpinner = {
    start: () => {
        status.start();
        process.stdout.write('\n');
    },
    stop: () => {
        status.stop();
        process.stdout.write('\n');
    }
};

const getInstance = () => {
    return octokit;
};

const getStoredGithubToken = () => {
    return conf.get('github.token');
};

const appAuthentication = async () => {
    authSpinner.stop();
    const { username, password } = await form.askGithubCredentials();

    console.log({ username, password });

    const auth = createBasicAuth({
        username,
        password,
        on2Fa: async () => {
            const { oauthToken } = await form.askForOauthToken();
            return oauthToken;
        },
        token: {
            note: 'octokit-gitneat',
            scopes: ['public_repo', 'repo']
        }
    });

    console.log({ auth });
    authSpinner.start();

    const { token } = await auth({ type: 'token' });
    return token;
};

// const testRequest = async () => {
//     const { data } = await octokit.gitignore.templates({
//         owner: 'octokit',
//         repo: 'rest.js',
//         pull_number: 123
//     });

//     console.log(`TEST REQUEST: ${JSON.stringify(data)}`);
// };

const getGitignoreOptions = async () => {
    const { data, error } = await request('GET /gitignore/templates');
    if (error)
        throw new Error('Error when fetching .gitignore templates ' + error);
    return data;
};

const getIgnoreTemplate = async name => {
    const {
        data: { source },
        error
    } = await request('GET /gitignore/templates/:name', {
        name
    });
    if (error)
        throw new Error('Error when fetching gitignore template ' + error);
    return source;
};

const removeAccessToken = async () => {
    conf.set('github.token', '');
    console.log('Access token removed');
};

const getAccessToken = async () => {
    let accessToken = conf.get('github.token');
    console.log({ accessToken });
    if (!accessToken) accessToken = await registerNewToken();
    return accessToken;
};

const loginFlow = async () => {
    authSpinner.start();

    try {
        const accessToken = await getAccessToken();

        octokit = Octokit({
            auth: accessToken,
            userAgent: 'gitneat v0.1'
        });

        console.log(chalk.green('Authenticated! \n'));
        return await getGitignoreOptions();
    } catch (err) {
        console.log(`Authentication error: ${err}`);
    } finally {
        authSpinner.stop();
    }
};

const registerNewToken = async () => {
    const token = await appAuthentication();
    if (token) {
        conf.set('github.token', token);
        return token;
    } else {
        throw new Error(
            'Missing Token',
            'GitHub token was not found in the response'
        );
    }
};

module.exports = {
    getStoredGithubToken,
    appAuthentication,
    getAccessToken,
    registerNewToken,
    loginFlow,
    removeAccessToken,
    getInstance,
    getGitignoreOptions,
    getIgnoreTemplate
};
