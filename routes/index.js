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
  upload(res.req, res, function (err, result) {
    //console.log(req.body);
    //console.log(req.files);
    if (err) {
      return res.end(`Error uploading file. ${err.message}`);
    }
    res.end("File is uploaded");
  });
});

module.exports = router;
