const router = require('../helpers/Router');

/* GET home page. */
router.get('/', (res) => {
  res.render('index', {title: 'Express', current: 'home', content: {}});
})

module.exports = router;
