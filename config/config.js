const config = require('config');

const auth = config.get('auth');

module.exports = {
    knex: config.get('knex'),
    auth: {
        domain: auth.domain,
        clientID: auth.clientID,
        clientSecret: auth.clientSecret,
        callbackURL: 'http://localhost:3001/callback'
    }
}
