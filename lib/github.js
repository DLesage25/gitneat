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

let octokit;

const status = new Spinner('Authenticating you, please wait...');

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

// module.exports = {
const getInstance = () => {
    return octokit;
};

const getStoredGithubToken = () => {
    return conf.get('github.token');
};

const appAuthentication = async () => {
    authSpinner.stop();
    const { username, password } = await form.askGithubCredentials();

    const auth = createBasicAuth({
        username,
        password,
        on2Fa: async () => {
            const { oauthToken } = await form.askForOauthToken();
            return oauthToken;
        }
    });
    authSpinner.start();

    const { token } = await auth({ type: 'token' });
    return token;
};

const testRequest = async () => {
    const result = await request('GET /user/repos', {
        headers: {
            authorization: `token ${token}`
        }
    });

    console.log(`${JSON.stringify(result.data)} repos found.`);
};

const removeAccessToken = async () => {
    conf.set('github.token', '');
    console.log('Access token removed');
};

const getAccessToken = async () => {
    let accessToken = conf.get('github.token');
    if (!accessToken) accessToken = await registerNewToken();
    return accessToken;
};

const loginFlow = async () => {
    // console.log('\n\n');
    authSpinner.start();

    try {
        const accessToken = await getAccessToken();
        console.log(chalk.green('Authenticated! \n Token: ' + accessToken));
    } catch (err) {
        console.log('error');
    } finally {
        authSpinner.stop();
    }
    chalk.green("Welcome to gitneat. Checking if you're authenticated...");
};

const registerNewToken = async () => {
    const token = await appAuthentication();
    if (token) {
        conf.set('github.token', token);
        return token;
    } else {
        throw new Error(
            'Missing Token',
            'GitHub token was not found in the response: ' + response
        );
    }
};

module.exports = {
    getStoredGithubToken,
    appAuthentication,
    testRequest,
    getAccessToken,
    registerNewToken,
    loginFlow,
    removeAccessToken
};
