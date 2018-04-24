const Page = require('../models/Page');
const router = require('../helpers/Router');
const multer = require('multer');

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

router.post('/add-page', function (res) {
  console.log('check form fields');
  res.status(200).send("File is uploaded");
});

module.exports = router;
