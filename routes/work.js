const Page = require('../models/Page');
const router = require('../helpers/Router');

const page = new Page('Work', 'work');

/* GET home page. */
router.get('/work', (req, res) => {
  page.getMenus()
    .then(menus => {
      const data = page.viewData(menus, {});
      res.render('work', data);
    })
    .catch(err => {
      router.renderError(res, err);
    });
});

module.exports = router;
