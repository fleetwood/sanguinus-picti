const router = require('../helpers/Router');

/* GET home page. */
router.get('/work', (res) => {
  res.render('work', {title: 'Our Work', current:'work', content: {}});
})

module.exports = router;
