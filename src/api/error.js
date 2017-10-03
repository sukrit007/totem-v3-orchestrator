'use strict';

module.exports = {

  /**
   * Error handler for API Errors
   * @param err
   * @param callback
   * @return {*}
   */
  handleError: (err, callback) => {
    if (err.statusCode) {
      return callback(null, {
        statusCode: err.statusCode,
        body: JSON.stringify(err)
      });
    }

    return callback(err);
  }
};