'use strict';

const
  apiError = require('../../../src/api/error'),
  should = require('chai').should(),
  HttpStatus = require('http-status-codes');


describe('API Error', () => {

  describe('handleError', () => {

    it('should handler errors with status code', done => {
      let err = new Error();
      err.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

      apiError.handleError(err, (respErr, resp) => {
        should.not.exist(respErr);
        should.exist(resp);
        resp.statusCode.should.equals(HttpStatus.INTERNAL_SERVER_ERROR);

        let body = JSON.parse(resp.body);
        body.should.deep.equals({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR
        });
        done();
      });
    });

    it('should handler errors without status code', done => {
      let err = new Error();

      apiError.handleError(err, (respErr, resp) => {
        should.not.exist(resp);
        should.exist(respErr);
        respErr.should.equals(err);
        done();
      });
    });

  });

});