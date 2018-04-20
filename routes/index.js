const Page = require('../models/Page');
const router = require('../helpers/Router');

const page = new Page('Home', 'home');

/* GET home page. */
router.get('/', (res) => {
  page.getMenus()
    .then(menus => {
      res.render('index', page.viewData(menus, {}));
    })
    .catch(err => {
      router.renderError(res, err);
    });
});

module.exports = router;
