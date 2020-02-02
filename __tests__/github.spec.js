const form = require('../lib/form');
const auth = require('@octokit/auth');
const { request } = require('@octokit/request');
// const Configstore = require('configstore');

jest.mock('configstore');
jest.mock('../lib/form.js');
jest.mock('@octokit/auth');
jest.mock('@octokit/request');

describe('Github.js', () => {
    const github = require('../lib/github');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('appAuthentication', () => {
        form.askGithubCredentials.mockResolvedValue({
            username: 'x',
            password: 'x'
        });

        auth.createBasicAuth.mockReturnValue(() => ({ token: 'token' }));

        form.askForOauthToken.mockResolvedValue('token');
        it('should return a new token for a registered user', async () => {
            expect(await github.appAuthentication()).toEqual('token');
        });
    });
    describe('gitIgnore', () => {
        describe('getIgnoreOptions', () => {
            it('should return ignore templates', async () => {
                request.mockResolvedValue({ data: 'x' });
                expect(await github.getGitignoreOptions()).toEqual('x');
            });
            it('should fail if error object is received', async () => {
                request.mockResolvedValue({ error: 'x' });
                try {
                    await github.getGitignoreOptions();
                } catch (e) {
                    expect(e).toBeInstanceOf(Error);
                }
            });
        });
        describe('getIgnoreTemplate', () => {
            it('should fetch a .gitignore template', async () => {
                request.mockResolvedValue({ data: { source: 'x' } });
                expect(await github.getIgnoreTemplate()).toEqual('x');
            });
            it('should fail if error object is received', async () => {
                request.mockResolvedValue({ error: 'x' });
                try {
                    await github.getIgnoreTemplate();
                } catch (e) {
                    expect(e).toBeInstanceOf(Error);
                }
            });
        });
        describe('access token', () => {
            describe('getAccessToken', () => {
                it('should retrieve an access token when present', async () => {
                    expect(await github.getAccessToken()).toEqual('token');
                });
            });
        });
        describe('loginFlow', () => {
            it('should log in', async () => {});
        });
    });
});
