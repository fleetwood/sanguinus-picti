const base = require('./Router');

/* GET home page. */
base.get('/', (res) => {
  res.render('index', {title: 'Express', content: {}});
})

module.exports = base;
