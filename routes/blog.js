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
  Page.list((err, results) => {
    if (err) {
      res.render('leftbar', base.page_error(err));
    }
    else {
      res.render('leftbar', schema(results));
    }
  });
});

/* GET home page. */
base.get('/blog/:url', (res) => {
  Page.getBlogUrl(res.req.params.url, (err, results) => {
    if (err) {
      res.render('error', base.page_error(err));
    }
    else {
      res.render('rightbar', schema(results));
    }
  });
});

module.exports = base;
