const CLI = require('clui');
const Configstore = require('configstore');
const Octokit = require('@octokit/rest');

const Spinner = CLI.Spinner;

const { request } = require('@octokit/request');
const { createBasicAuth } = require('@octokit/auth');

const { warning, error, success } = require('./messages');

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
    stop: noBreak => {
        status.stop();
        if (!noBreak) process.stdout.write('\n');
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

    try {
        const auth = createBasicAuth({
            username,
            password,
            on2Fa: async () => {
                authSpinner.stop(true);
                const { oauthToken } = await form.askForOauthToken();
                return oauthToken;
            },
            token: {
                note: 'octokit-gitneat',
                scopes: ['public_repo', 'repo']
            }
        });

        authSpinner.start();

        const { token } = await auth({ type: 'token' });
        console.log('token');
        console.log(token);
        return token;
    } catch (err) {
        return null;
    }
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
    warning('Access token removed');
};

const getAccessToken = async () => {
    let accessToken = conf.get('github.token');
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

        success('Authenticated! \n');
        return await getGitignoreOptions();
    } catch (err) {
        throw err;
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
            'Authentication Error: Unable to generate Github access token.'
        );
    }
};

module.exports = {
    getStoredGithubToken,
    getAccessToken,
    registerNewToken,
    loginFlow,
    removeAccessToken,
    getInstance,
    getGitignoreOptions,
    getIgnoreTemplate
};
