const router = require('../helpers/Router');

/* GET home page. */
router.get('/about', (res) => {
  res.render('about', {title: 'About Us', current: 'about', content: {}});
})

module.exports = router;
