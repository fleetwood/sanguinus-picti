const base = require('../helpers/Router');
const Page = require('../models/Page');

const schema = (data) => {
  return {
    title: 'Blog',
    current: 'blog',
    data: data
  }
};

/* GET home page. */
base.get('/blog', (res) => {
  Page.all(Page.views.page_author, {}, (err, results) => {
    if (err) {
      res.render('error', base.page_error(err));
    }
    else {
      res.render('blog/list', schema(results));
    }
  });
});

/* GET home page. */
base.get('/blog/:url', (res) => {
  Page.one(Page.views.page_author, {url: res.req.params.url}, (err, results) => {
    if (err) {
      res.render('error', base.page_error(err));
    }
    else {
      res.render('blog/index', schema(results));
    }
  });
});

module.exports = base;
