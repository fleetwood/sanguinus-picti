const base = require('./Router');

/* GET home page. */
base.get('/users', (res) => {
  res.render('users', { title: 'Users', content: 'Respond with the stuffs'});
})

module.exports = base;
