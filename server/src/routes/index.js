var express = require('express');
var router = express.Router();

router.use('/auth', require('./auth'));
router.use('/contacts', require('./contact'));

module.exports = router;
