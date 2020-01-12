const CLI = require('clui');
const Configstore = require('configstore');
const Octokit = require('@octokit/rest');
const Spinner = CLI.Spinner;

const { App } = require('@octokit/app');
const { request } = require('@octokit/request');

const {
    createBasicAuth,
    createAppAuth,
    createOAuthAppAuth,
    createTokenAuth,
    createActionAuth
} = require('@octokit/auth');

const APP_ID = require('./config').appId;
const PRIVATE_KEY = require('./config').privateKey;
const CLIENT_ID = require('./config').clientId;
const CLIENT_SECRET = require('./config').clientSecret;

const form = require('./form');
const pkg = require('../package.json');

const conf = new Configstore(pkg.name);

const app = new App({ id: APP_ID, privateKey: PRIVATE_KEY });
const jwt = app.getSignedJsonWebToken();

let octokit;

module.exports = {
    getInstance: () => {
        return octokit;
    },

    getStoredGithubToken: () => {
        return conf.get('github.token');
    },

    setGithubCredentials: async () => {
        const credentials = await form.askGithubCredentials();
        octokit = new Octokit({
            auth: {
                username: credentials.username,
                password: credentials.password
            }
        });
    },

    appAuthentication: async () => {
        const { username, password } = await form.askGithubCredentials();

        const auth = createBasicAuth({
            username,
            password,
            on2Fa: async () => {
                const { oauthToken } = await form.askForOauthToken();
                return oauthToken;
            }
        });

        const { token } = await auth({ type: 'token' });

        const result = await request('GET /user/repos', {
            headers: {
                authorization: `token ${token}`
            }
        });

        console.log(`${JSON.stringify(result.data)} repos found.`);
    },

    registerNewToken: async () => {
        const status = new Spinner('Authenticating you, please wait...');
        status.start();

        try {
            const response = await octokit.oauthAuthorizations.createAuthorization(
                {
                    scopes: ['user', 'public_repo', 'repo', 'repo:status'],
                    note: 'gitneat- easy git initialization CLI tool'
                }
            );
            const token = response.data.token;
            if (token) {
                conf.set('github.token', token);
                return token;
            } else {
                throw new Error(
                    'Missing Token',
                    'GitHub token was not found in the response: ' + response
                );
            }
        } catch (err) {
            throw err;
        } finally {
            status.stop();
        }
    }
};
