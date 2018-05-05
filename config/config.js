const config = require('config');
const Auth0Strategy = require('passport-auth0');

const auth = config.get('auth');
const server = config.get('server');

const hostLink = (url) => `http://${server.domain}:${server.port}${url}`;
const callbackURL = hostLink(auth.callbackURL);

const strategy = new Auth0Strategy({
        domain: auth.domain,
        clientID: auth.clientID,
        clientSecret: auth.clientSecret,
        callbackURL: callbackURL
    },
    (accessToken, refreshToken, extraParams, profile, done) => done(null, profile)
);

module.exports = {
    auth,
    hostLink,
    callbackURL,
    strategy,
    knex: config.get('knex'),
    server: config.get('server')
}
