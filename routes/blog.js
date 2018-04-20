const page = require('../models/Blog');
const router = require('../helpers/Router');

/* GET home page. */
router.get('/blog', (res) => {
  // todo: broke
  page.getMenus()
    .then(menus => {
      page.all({
          name: page.tables.views.page_author, 
          where: { pageType: page.pageType },
          orderCol: page.tables.postDate,
          orderDir: page.tables.sort.desc
        })
        .then(results =>{
          res.render('blog/list', page.viewData(menus, results));
        });     
  })
  .catch(err => {
    router.renderError(res, err);
  });
});

/* GET home page. */
router.get('/blog/:url', (res) => {
  const byBlogUrl = {
    name: page.tables.views.page_author,
    where: {
      url: res.req.params.url
    }
  };

  page.featuredBlogList()
    .then(blogs => {
      page.one(byBlogUrl)
        .then(results => {
            res.render('blog/index', page.viewData(blogs, results));
        });
    })
    .catch(err => {
      router.renderError(res, err);
    });
});

module.exports = router;
