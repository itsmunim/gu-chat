let User = require('../models/user'),
  config = require('../common/config'),
  utils = require('../common/utils'),
  bcrypt = require('bcrypt');

let controller = {};

controller.createUser = (email, password, firstName, lastName) => {
  return new Promise((resolve, reject) => {
    let user = new User();
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    bcrypt.hash(password, config.PASSWORD_HASH_SALT).then((hash) => {
      user.passwordHash = hash;
      user.save((err, savedUser) => {
        utils.handleErrorIfAny(err, savedUser, reject);
        resolve(savedUser);
      });
    });
  });
};

controller.getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    User.findOne({email: email}, (err, user) => {
      utils.handleErrorIfAny(err, user, reject);
      resolve(user);
    });
  });
};

controller.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    User.findById(id, (err, user) => {
      utils.handleErrorIfAny(err, user, reject);
      resolve(user);
    });
  });
};

controller.updateUser = (toBeUpdatedUser) => {
  return new Promise((resolve, reject) => {
    User.findOne({email: toBeUpdatedUser.email}, (err, user) => {
      utils.handleErrorIfAny(err, user, reject);
      user = toBeUpdatedUser;
      user.save((err, savedUser) => {
        utils.handleErrorIfAny(err, savedUser, reject);
        resolve(savedUser);
      });
    });
  });
};

module.exports = controller;
