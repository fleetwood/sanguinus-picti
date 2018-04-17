const base = require('../helpers/Router');
const Page = require('../models/Page');

const viewData = (data) => {
  return {
    title: 'Blog',
    current: 'blog',
    data: data
  }
};

/* GET home page. */
base.get('/blog', (res) => {
  Page.all({name: Page.dbviews.page_author}, (err, results) => {
    if (err) {
      res.render(Page.pugviews.error, base.page_error(err));
    }
    else {
      res.render('blog/list', viewData(results));
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

  Page.one(byBlogUrl, (err, results) => {
    if (err) {
      res.render(Page.pugviews.error, base.page_error(err));
    }
    else {
      res.render('blog/index', viewData(results));
    }
  });
});

module.exports = base;
