let mongoose = require('mongoose'),
  _ = require('lodash'),
  config = require('./config');


var utils = {};

utils.initializeDB = function () {
  if (_.isUndefined(utils.db)) {
    var dbURI = 'mongodb://' + config.MONGO_HOST + ':27017/' + config.MONGO_DB;
    utils.db = mongoose.connect(dbURI, { useMongoClient: true });

    mongoose.connection.on('connected', function () {
      console.log('Mongoose default connection open to ' + dbURI);
    });

    mongoose.connection.on('error', function (err) {
      console.log('Mongoose default connection error: ' + err);
    });

    mongoose.connection.on('disconnected', function () {
      console.log('Mongoose default connection disconnected');
    });
  }
};

utils.getDB = function () {
  return utils.db;
};

utils.shutdownDB = function () {
  if (utils.db) {
    mongoose.disconnect();
  }
};

utils.handleHttpRequestPromise = function (httpPromise, res) {
  httpPromise
    .then(function (response) {
      res.status(response.status).send(response.body);
    })
    .catch(function (errorResponse) {
      var error = utils.getErrorInterpretation(errorResponse);
      res.status(error.statusCode).send(error.resolvedResponse);
    });
};

module.exports = utils;
