const base = require('../helpers/Router');

/* GET home page. */
base.get('/users', (res) => {
  res.render('rightbar', { title: 'Users', content: 'Respond with the stuffs'});
})

module.exports = base;
