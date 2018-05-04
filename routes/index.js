const Page = require('../models/Page');
const Blog = require('../models/Blog');
const Tattoo = require('../models/Tattoo');
const router = require('../helpers/Router');
const multer = require('multer');
const moment = require('moment');

const page = new Page('Home', 'home');
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
router.get('/', (res) => {
  page.getMenus()
    .then(menus => {
      res.render('index', page.viewData(menus, {}));
    })
    .catch(err => {
      router.renderError(res, err);
    });
});

/* GET create page */
router.get('/new-page', (res) => {
  page.getMenus()
    .then(menus => {
      res.render('create', page.viewData(menus, {}));
    })
    .catch(err => {
      router.renderError(res, err);
    })
});

/* POST upload images */
router.post('/upload', function (res) {
  upload(res.req, res, function (err) {
    if (err) {
      return res.status(500).send(`Error uploading file. ${err.message}`);
    }
    const results = res.req.files.map(file => {
      return `/images/${file.filename}`;
    });
    res.status(200).send(results);
  });
});

/* POST create the new page */
router.post('/create', function(res) {
  const data = res.req.body;
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

module.exports = router;
