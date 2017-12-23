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
      saveUser(user, resolve, reject);
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

controller.updateUser = (id, updates) => {
  return new Promise((resolve, reject) => {
    User.findById(id, (err, user) => {
      utils.handleErrorIfAny(err, user, reject);
      user.email = updates.email || user.email;
      user.firstName = updates.firstName || user.firstName;
      user.lastName = updates.lastName || user.lastName;
      user.avatarUrl = updates.avatarUrl || user.avatarUrl;

      if (updates.password) {
        bcrypt.hash(updates.password, config.PASSWORD_HASH_SALT).then((hash) => {
          user.passwordHash = hash;
          saveUser(user, resolve, reject);
        });
      }

      saveUser(user, resolve, reject);
    });
  });
};

let saveUser = (user, resolve, reject) => {
  user.save((err, savedUser) => {
    utils.handleErrorIfAny(err, savedUser, reject);
    resolve(savedUser);
  });
};

module.exports = controller;
