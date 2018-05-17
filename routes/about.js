const Page = require('../models/Page');
const router = require('../helpers/Router');

const page = new Page('About', 'about');

/* GET home page. */
router.get('/about/:artist', (req, res) => {
  function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index > 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
  }
  const byName = camelize(req.params.artist || '');
  page.getMenus()
    .then(menus => {
      page.one({from: Page.tables.users, where: { 'firstname': byName}})
        .then(artist => {
          page.all({
            from: byName =='John' ? page.tables.views.jTats : page.tables.views.cTats
          })
          .then(tats => {
            const tattoos = tats.map(t => {
              return {
                url: t.url,
                img: t.images.header
              };
            });
            const data = {artist, tattoos};
            res.render('about/artist', page.viewData(router.user, menus, data));
          })
        });
    })
    .catch(err => {
      router.renderError(res, err);
    });
});

router.get('/about', (req, res) => {
  page.getMenus()
    .then(menus => {
      page.getArtists()
        .then(artists => {
          const data = page.viewData(router.user, menus, artists);
          res.render('about/index', data);
        });
    })
    .catch(err => {
      router.renderError(res, err);
    });
});

module.exports = router;
