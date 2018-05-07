const Page = require('../models/Page');
const router = require('../helpers/Router');

const page = new Page('Home', 'home');

/* GET home page. */
router.get('/', (req, res) => {
  page.getMenus()
    .then(menus => {
      res.render('index', page.viewData(router.user, menus, {}));
    })
    .catch(err => {
      router.renderError(res, err);
    });
});

router.get('/login', (req, res)=> {
  res.redirect('/auth/login');
})

module.exports = router.router;
