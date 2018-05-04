const config = require('../config/config');
const Page = require('../models/Page');
const Blog = require('../models/Blog');
const Tattoo = require('../models/Tattoo');
const router = require('../helpers/Router');
const moment = require('moment');
const page = new Page('Home', 'home');
const passport = require('passport');

// uploading
const multer = require('multer');
const formidable = require('formidable');
const fs = require('fs');
const uploadDir = './public/images/';

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDir);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

var upload = multer({ storage: storage }).array('userPhoto');

/* GET home page. */
router.get('/', (req, res) => {
  page.getMenus()
    .then(menus => {
      res.render('index', page.viewData(menus, {}));
    })
    .catch(err => {
      router.renderError(res, err);
    });
});

/* GET create page */
router.get('/new-page', (req, res) => {
  page.getMenus()
    .then(menus => {
      res.render('create', page.viewData(menus, {}));
    })
    .catch(err => {
      router.renderError(res, err);
    })
});

/* GET create page */
router.get('/edit-page/:id', (req, res) => {
  page.getMenus()
    .then(menus => {
      page.one({name: 'pages', where: {id: req.params.id}})
        .then(result => {
          if (!result) {
            return res.render('edit-page', page.viewData(menus, {}));
          }
          res.render('edit-page', page.pageData(menus, result));
        })
        .catch(err => {
          router.renderError(res, err);
        });
    })
    .catch(err => {
      router.renderError(res, err);
    });
});

/* POST upload images */
router.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).send(`Error uploading file. ${err.message}`);
    }
    const results = req.files.map(file => {
      return `/images/${file.filename}`;
    });
    res.status(200).send(results);
  });
});

/* POST create the new page */
router.post('/create', function(req, res) {
  const data = req.body;
  const page = data.pagetype == Page.pageTypes.tattoo ? Tattoo : Blog;

  const pageData = {
    // todo: grab the logged in user
    author_id: 1,
    featured: data.featured === "on",
    title: data.title,
    summary: data.summary,
    body: data.body,
    pageType: data.pagetype,
    url: data.url,
    postDate: moment(new Date()).format('YYYY/MM/DD hh:mm:ss'),
    images: {
      header: data.header,
      gallery: data.gallery
    }
  };

  page.insert(pageData)
    .then(results => {
      res.status(200).send({success: results, page: page});
      // redirect?
    })
    .catch(err => {
      res.status(500).send(JSON.stringify(err, null, 2));
    });
});

/* POST update the page */
router.post('/update', function(req, res) {
  const data = req.body;
  const page = data.pagetype == Page.pageTypes.tattoo ? Tattoo : Blog;

  const pageData = {
    // todo: grab the logged in user
    author_id: 1,
    featured: data.featured === "on",
    title: data.title,
    summary: data.summary,
    body: data.body,
    pageType: data.pagetype,
    url: data.url,
    postDate: moment(new Date()).format('YYYY/MM/DD hh:mm:ss'),
    images: {
      header: data.header,
      gallery: data.gallery
    }
  };

  page.update(req.params.id, pageData)
    .then(results => {
      res.status(200).send({success: results, page: page});
    })
    .catch(err => {
      res.status(500).send(JSON.stringify(err, null, 2));
    });
});

/// auth
// Perform the login
router.get(
  '/login',
  passport.authenticate('auth0', {
    clientID: config.auth.clientID,
    domain: config.auth.domain,
    redirectUri: config.auth.callbackURL,
    audience: `https://${config.auth.domain}/userinfo`,
    responseType: 'code',
    scope: 'openid'
  }),
  function(req, res) {
    res.redirect('/');
  }
);

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Perform the final stage of authentication and redirect to '/user'
router.get('/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/'
  }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/');
  }
);

module.exports = router;
