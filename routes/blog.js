const base = require('../helpers/Router');
const Page = require('../models/Page');

const viewData = (blogs, data) => {
  return {
    title: 'Blog',
    current: 'blog',
    bloglist: blogs,
    data: data
  }
};

/* GET home page. */
base.get('/blog', (res) => {
  // todo: broke
  Page.featuredBlogList((err, blogs) => {
    if (err) {
      base.renderError(res, err);
    }
    else {
      Page.all({name: Page.dbviews.page_author}, (err, results) => {
        if (err) {
          base.renderError(res, err);
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
base.get('/blog/:url', (res) => {
  const byBlogUrl = {
    name: Page.dbviews.page_author, 
    where: {
      url: res.req.params.url
    }
  };

  Page.featuredBlogList((err, blogs) => {
    if (err) {
      base.renderError(res, err);
    }
    else {
      Page.one(byBlogUrl, (err, results) => {
        if (err) {
          base.renderError(res, err);
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

module.exports = base;
