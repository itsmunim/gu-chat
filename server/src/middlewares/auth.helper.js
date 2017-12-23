let config = require('../common/config');
let jwt = require('jwt-simple');
let moment = require('moment');
let UserController = require('../controllers/user');
let authHelper = {};

authHelper.ensureAuthenticated = (req, res, next) => {
  if (!req.header('Authorization')) {
    return res.status(401).send({message: 'Please make sure your request has an Authorization header'});
  }
  let token = req.header('Authorization').split(' ')[1];

  let payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  } catch (err) {
    return res.status(401).send({message: err.message});
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({message: 'Token has expired.'});
  }

  UserController.getUserById(payload.sub)
    .then((user) => {
      if (!user) {
        return res.status(404).send({message: 'User not found.'});
      }

      req.user = user;
      next();
    })
    .catch((err) => {
      if (err) {
        return res.status(500).send(err);
      }
    });
};

authHelper.createJWT = (user) => {
  let payload = {
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
};

module.exports = authHelper;
