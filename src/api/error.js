'use strict';

const
  HttpStatus = require('http-status-codes'),
  error = require('../services/error');

module.exports = {
  handleError: (err, callback) => {
    if (err.statusCode) {
      return callback(null, {
        statusCode: err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        body: JSON.stringify(err)
      });
    }

    return callback(err);
  }
};