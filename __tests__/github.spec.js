const form = require('../lib/form');
const auth = require('@octokit/auth');

jest.mock('../lib/form.js');
jest.mock('@octokit/auth');

describe('Github.js', () => {
    const github = require('../lib/gith');
    describe('appAuthentication', () => {
        form.askGithubCredentials.mockResolvedValue({
            username: 'x',
            password: 'x'
        });

        auth.createBasicAuth.mockResolvedValue({ token: 'x' });

        form.askForOauthToken.mockResolvedValue('x');
        it('should return a new token for a registered user', async () => {
            expect(await github.appAuthentication()).toEqual('');
        });
    });
});
