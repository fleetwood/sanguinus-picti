const config = require('../config/config');
const Page = require('../models/Page');
const Blog = require('../models/Blog');
const Tattoo = require('../models/Tattoo');
const router = require('../helpers/Router');
const moment = require('moment');
// uploading
const multer = require('multer');
const formidable = require('formidable');
const fs = require('fs');
const uploadDir = './public/images/';

const page = new Page('Admin', 'admin');
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDir);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

var upload = multer({ storage: storage }).array('userPhoto');

/* GET create page */
router.restricted('/create', (req, res) => {
    page.getMenus()
      .then(menus => {
        res.render('admin/create', page.viewData(router.user, menus, {}));
      })
      .catch(err => {
        router.renderError(res, err);
      })
  });

router.post('/create', (req, res) => {
    const data = req.body;
    const page = data.pagetype == Page.pageTypes.tattoo ? Tattoo : Blog;

    const pageData = {
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
        gallery: data.gallery.split(',')
      }
    };

    page.insert(pageData)
      .then(results => {
        res.status(200).send({
          success: true,
          results: results[0],
          url: `/${results[0].pageType}/${results[0].url}`
        });
        // redirect?
      })
      .catch(err => {
        res.status(500).send(JSON.stringify(err, null, 2));
      });
  });

/* GET edit page */
router.restricted('/edit-page/:id', (req, res) => {
  const user = res.locals.user;
  page.getMenus()
    .then(menus => {
      page.one({name: 'pages', where: {id: req.params.id}})
        .then(result => {
          if (!result) {
            return res.render('admin/edit-page', page.viewData(router.user, menus, {}));
          }
          res.redirect('/admin/create');
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
router.post('/upload', (req, res) => {
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

/* POST update the page */
router.post('/update', (req, res) => {
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

module.exports = router;
