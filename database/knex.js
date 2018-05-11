const config = require('../config/config');

var knex = require('knex')(config.knex);

module.exports = knex;