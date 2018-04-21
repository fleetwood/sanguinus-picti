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

//todo: implementing multer
// router.post('/photos/upload', router.upload.array('photos', 12), function (req, res, next) {
//   // req.files is array of `photos` files
//   // req.body will contain the text fields, if there were any
// });

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
