const user = require('../models/User');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex(user.tableName).insert([
    {
      username: 'fleetwood',
      password: 'lkjlkj',
      name: 'John Fleetwood',
      email: 'wizening@gmail.com'
    },

    {
      username: 'christina',
      password: 'lkjlkj',
      name: 'Christina Fleetwood',
      email: 'satchalen@hotmail.com'
    }
  ]);
};
