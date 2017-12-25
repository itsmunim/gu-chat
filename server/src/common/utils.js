let mongoose = require('mongoose'),
  _ = require('lodash'),
  config = require('./config');


var utils = {};

utils.initializeDB = () => {
  if (_.isUndefined(utils.db)) {
    var dbURI = 'mongodb://' + config.MONGO_HOST + ':'+ config.MONGO_PORT +'/' + config.MONGO_DB;
    utils.db = mongoose.connect(dbURI, { useMongoClient: true });

    mongoose.connection.on('connected', () => {
      console.log('Mongoose default connection open to ' + dbURI);
    });

    mongoose.connection.on('error', (err) => {
      console.log('Mongoose default connection error: ' + err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose default connection disconnected');
    });
  }
};

utils.getDB = () => {
  return utils.db;
};

utils.shutdownDB = () => {
  if (utils.db) {
    mongoose.disconnect();
  }
};

utils.getErrorInterpretation = (errorObject) => {
  if (errorObject.hasOwnProperty('statusCode') && errorObject.hasOwnProperty('error')) {
    // custom error object
    return {
      statusCode: _.get(errorObject, 'statusCode'),
      resolvedResponse: _.get(errorObject, 'error.error') || _.get(errorObject, 'error')
    };
  } else {
    return {
      statusCode: 500,
      resolvedResponse: {
        message: _.get(errorObject, 'message')
      }
    }
  }
};

utils.createErrorObject = (status, message) => {
  return {
    statusCode: status,
    error: {
      status: status,
      message: message
    }
  };
};

utils.handleErrorIfAny = (err, expectedDBRecord, promiseRejectHandler) => {
  if (err) {
    promiseRejectHandler(err);
  }

  if (!expectedDBRecord) {
    promiseRejectHandler(new Error('Record not found in database.'));
  }
};

utils.isRequestValid = (req, method, valueKeys) => {
  let space = method.toLowerCase() === 'post' ? req.body : req.query;
  valueKeys.forEach((key) => {
    if (_.isUndefined(space[key])) {
      return false;
    }
  });
  return true;
};

utils.handleHttpRequestPromise = (httpPromise, res) => {
  httpPromise
    .then((response) => {
      res.status(response.status).send(response.body);
    })
    .catch((errorResponse) => {
      var error = utils.getErrorInterpretation(errorResponse);
      res.status(error.statusCode).send(error.resolvedResponse);
    });
};

utils.isValidEmail = (email) => {
  return Boolean(email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/));
};

module.exports = utils;
