const base = require('../helpers/Router');

/* GET home page. */
base.get('/work', (res) => {
  res.render('work', {title: 'Our Work', current:'work', content: {}});
})

module.exports = base;
