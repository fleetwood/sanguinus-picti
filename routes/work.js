const Page = require('../models/Page');
const router = require('../helpers/Router');

const page = new Page('Work', 'work');

/* GET home page. */
router.get('/work', (res) => {
  page.getMenus()
    .then(menus => {
      res.render('work', page.viewData(menus, {}));
    })
    .catch(err => {
      router.renderError(res, err);
    });
});

module.exports = router;
