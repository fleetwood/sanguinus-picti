const base = require('../helpers/Router');

/* GET home page. */
base.get('/', (res) => {
  res.render('index', {title: 'Express', current: 'home', content: {}});
})

module.exports = base;
