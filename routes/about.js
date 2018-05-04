const Page = require('../models/Page');
const router = require('../helpers/Router');

const page = new Page('About', 'about');

/* GET home page. */
router.get('/about', (req, res) => {
  page.getMenus()
    .then(menus => {
      res.render('about', page.viewData(menus, {}));
    })
    .catch(err => {
      router.renderError(res, err);
    });
});

module.exports = router;
