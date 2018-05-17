const page = require('../models/Blog');
const router = require('../helpers/Router');

router.get('/blog', (req, res) => {
  page.getMenus()
    .then(menus => {
      page.all({
          from: page.tables.views.page_author, 
          where: { pageType: page.pageType },
          orderCol: page.tables.postDate,
          orderDir: page.tables.sort.desc
        })
        .then(results =>{
          res.render('blog/list', page.viewData(router.user, menus, results));
        });     
  })
  .catch(err => {
    router.renderError(res, err);
  });
});

router.get('/blog/:url', (req, res) => {
  const byBlogUrl = {
    from: page.tables.views.page_author,
    where: {
      url: req.params.url
    }
  };

  page.getMenus()
    .then(menus => {
      page.one(byBlogUrl)
        .then(results => {
            res.render('blog/index', page.viewData(router.user, menus, results));
        });
    })
    .catch(err => {
      router.renderError(res, err);
    });
});

module.exports = router;
