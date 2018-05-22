const router = require('../helpers/Router');
const Tattoo = require('../models/Tattoo');
const page = new Tattoo(router.user);

/* GET tattoo list */
router.get('/tattoos', (req, res) => {
  page.getMenus()
    .then(menus =>  {
      page.getTattoos()
        .then(results => {
          res.render('tattoos/list', page.viewData(router.user, menus, results));
        });
    })
    .catch(err => {
      router.renderError(res, err);
    });
});

/* GET single tattoo */
router.get('/tattoos/:url', (req, res) => {
  page.getPageData(req)
    .then(results => {
      res.render('tattoos/index', results);
    })
    .catch(err => {
      router.renderError(res, err);
    });
});

module.exports = router;
