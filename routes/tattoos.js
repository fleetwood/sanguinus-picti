const page = require('../models/Tattoo');
const router = require('../helpers/Router');

/* GET tattoo list */
router.get('/tattoos', (res) => {
  page.getMenus()
    .then(menus =>  {
      page.all({
        name: page.tables.views.page_author, 
        where: { pageType: page.pageType },
        orderCol: page.tables.postDate,
        orderDir: page.tables.sort.desc
      })
      .then(results => {
        res.render('tattoos/list', page.viewData(menus, results));
      })
    })
    .catch(err => {
      router.renderError(res, err);
    });
});

/* GET create page */
router.get('/tattoos/create', (res) => {
  page.getMenus()
    .then(menus => {
      res.render('tattoos/create', page.viewData(menus, {}));
    })
    .catch(err => {
      router.renderError(res, err);
    })
});

/* GET single tattoo */
router.get('/tattoos/:url', (res) => {
  const byTattooUrl = {
    name: page.tables.views.page_author,
    where: {
      url: res.req.params.url
    }
  };

  page.getMenus()
    .then(menus => {
      page.one(byTattooUrl)  
        .then(results => {
          res.render('tattoos/index', page.viewData(menus, results));
        });
    })
    .catch(err => {
      router.renderError(res, err);
    });
});


module.exports = router;
