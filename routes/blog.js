const page = require('../models/Blog');
const router = require('../helpers/Router');

const viewData = (blogs, data) => {
  return {
    title: 'Blog',
    current: 'blog',
    bloglist: blogs,
    data: data
  }
};

/* GET home page. */
router.get('/blog', (res) => {
  // todo: broke
  page.featuredBlogList((err, blogs) => {
    if (err) {
      router.renderError(res, err);
    }
    else {
      page.all({
        name: page.tables.views.page_author, 
        where: { pageType: page.pageType },
        orderCol: page.tables.postDate,
        orderDir: page.tables.sort.desc
      }, (err, results) => {
        if (err) {
          router.renderError(res, err);
        }
        else {
          // todo: see if there's a cleaner way of 
          // handling this chain. Next, assign blogs
          // to sidebar and/or nav.
          res.render('blog/list', viewData(blogs, results));
        }
      });
    }
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

  page.featuredBlogList((err, blogs) => {
    if (err) {
      router.renderError(res, err);
    }
    else {
      page.one(byBlogUrl, (err, results) => {
        if (err) {
          router.renderError(res, err);
        }
        else {
          // todo: see if there's a cleaner way of 
          // handling this chain. Next, assign blogs
          // to sidebar and/or nav.
          res.render('blog/index', viewData(blogs, results));
        }
      });
    }
  });
});

module.exports = router;
