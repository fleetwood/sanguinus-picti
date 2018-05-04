const config = require('config');

const auth = config.get('authZero');

module.exports = {
    knex: config.get('knex'),
    auth: {
        domain: auth.domain,
        clientID: auth.client,
        clientSecret: auth.secret,
        callbackURL: 'http://localhost:3001/callback'
    }
}
