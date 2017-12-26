let express = require('express');
let router = express.Router();
let utils = require('../common/utils');
let config = require('../common/config');
let ContactController = require('../controllers/contact');

router.get('/', function (req, res) {
  if (!utils.isRequestValid(req, 'GET', ['email'])) {
    return res.status(400).send({message: 'Must have email in query.'});
  }

  if (!utils.isValidEmail(req.query.email)) {
    return res.status(400).send({message: 'Not a valid email.'});
  }

  ContactController.getContactByEmail(req.query.email)
    .then((contact) => {
      return res.status(200).send(contact);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

module.exports = router;
