const base = require('../helpers/Router');

/* GET home page. */
base.get('/about', (res) => {
  res.render('about', {title: 'About Us', current: 'about', content: {}});
})

module.exports = base;
