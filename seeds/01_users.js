const user = require('../models/User');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex(user.tableName).insert([
    {
      firstname: 'John',
      lastname: 'Fleetwood',
      image: 'images/JF.jpg',
      auth0: 'auth0|5aee9779f24e8821c4dbc230'
    },

    {
      firstname: 'Christina',
      lastname: 'Fleetwood',
      image: 'images/CF.jpg',
      auth0: 'auth0|5aee9929e1f6ba712cfa3f23'
    }
  ]);
};
