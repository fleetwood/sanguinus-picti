const page = require('../models/Tattoo');
const router = require('../helpers/Router');

const viewData = (tattoos, data) => {
  return {
    title: 'Tattoo',
    current: 'tattoo',
    tattoolist: tattoos,
    data: data
  }
};

/* GET home page. */
router.get('/tattoos', (res) => {
  page.featuredTattooList((err, tattoos) => {
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
          res.render('tattoos/list', viewData(tattoos, results));
        }
      });
    }
  });
});

/* GET home page. */
router.get('/tattoos/:url', (res) => {
  const byTattooUrl = {
    name: page.tables.views.page_author,
    where: {
      url: res.req.params.url
    }
  };

  page.featuredTattooList((err, tattoos) => {
    if (err) {
      router.renderError(res, err);
    }
    else {
      page.one(byTattooUrl, (err, results) => {
        if (err) {
          router.renderError(res, err);
        }
        else {
          res.render('tattoos/index', viewData(tattoos, results));
        }
      });
    }
  });
});

module.exports = router;
