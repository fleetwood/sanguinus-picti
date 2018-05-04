const router = require('../helpers/Router');

/* GET home page. */
router.get('/users', (req, res) => {
  res.render('rightbar', { title: 'Users', content: 'Respond with the stuffs'});
})

module.exports = router;
