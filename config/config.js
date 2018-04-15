const config = require('config');

module.exports = {
    knex: config.get('knex')
}