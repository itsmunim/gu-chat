let authHelper = require('../middlewares/auth.helper');
let express = require('express');
let router = express.Router();
let utils = require('../common/utils');
let config = require('../common/config');
let bcrypt = require('bcrypt');
let UserController = require('../controllers/user');
let ContactController = require('../controllers/contact');

router.post('/register', function (req, res) {
  if (!utils.isRequestValid(req, 'POST', ['email', 'password', 'firstName', 'lastName'])) {
    res.status(400);
  }

  UserController.createUser(req.body.email, req.body.password, req.body.firstName, req.body.lastName)
    .then((user) => {
      // create a respective controller representing this user
      ContactController.createContact(user.id, user.firstName, user.lastName, user.email)
        .then(() => {
          return respondTokenForUser(user, res);
        })
        .catch((err) => {
          return res.status(500).send(err);
        });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

router.post('/login', function (req, res) {
  if (!utils.isRequestValid(req, 'POST', ['email', 'password'])) {
    return res.status(400);
  }

  UserController.getUserByEmail(req.body.email)
    .then((user) => {
      bcrypt.compare(req.body.password, user.passwordHash).then((isMatched) => {
        if (isMatched) {
          return respondTokenForUser(user, res);
        } else {
          return res.status(401).send({message: 'Password incorrect.'});
        }
      });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

let respondTokenForUser = (user, res) => {
  let token = authHelper.createJWT(user);
  return res.status(200).send({token: token});
};

module.exports = router;
