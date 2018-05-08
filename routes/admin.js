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
var upload = multer({ storage: storage }).array('file');

const parseData = (data) => {
  return {
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
}

router.restricted('/edit-page/:id', (req, res) => {
  const user = res.locals.user;
  page.getMenus()
    .then(menus => {
      page.one({ name: 'pages', where: { id: req.params.id } })
        .then(result => {
          if (result) {
            return res.render('admin/edit-page', page.viewData(router.user, menus, result));
          }
          router.renderError(res, new Error(`Could not resolve for id ${req.params.id}`));
        })
        .catch(err => {
          router.renderError(res, err);
        });
    })
    .catch(err => {
      router.renderError(res, err);
    });
});

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

  const pageData = parseData(data);
  page.insert(pageData)
    .then(results => {
      res.status(200).json({
        success: true,
        results: results[0],
        url: `/${results[0].pageType}/${results[0].url}`
      });
      // redirect?
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post('/upload', (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).json(`Error uploading file. ${err.message}`);
    }
    const results = req.files.map(file => {
      return `/images/${file.filename}`;
    });
    res.status(200).json(results);
  });
});

router.post('/update', (req, res) => {
  const data = req.body;
  const page = data.pagetype == Page.pageTypes.tattoo ? Tattoo : Blog;

  const pageData = parseData(data);
  page.update(parseInt(data.id), pageData)
    .then(results => {
      res.status(200).json({
        success: true,
        results: results,
        url: `/${results.pageType}/${results.url}`
      });
    })
    .catch(err => {
      res.status(500).json(JSON.stringify(err, null, 2));
    });
});

module.exports = router;
