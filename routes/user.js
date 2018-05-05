const Page = require('../models/Page');
const router = require('../helpers/Router');

const page = new Page('User', 'user');

/* GET user profile. */
router.restricted('/user', (req, res) => {
  page.getMenus()
    .then(menus => {
      res.render('user', { 
        title: this.title,
        current: this.pageType,
        menus: menus,
        user: req.user});
    })
    .catch(err => {
      router.renderError(res, err);
    });
});

module.exports = router;
