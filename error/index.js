var util = require('util');
var http = require('http');

function HttpError(status, message) {
  this.status = status;
  this.message = message || http.STATUS_CODE[status] || 'Error';
  Error.captureStackTrace(this, HttpError);
}

util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';
exports.HttpError = HttpError;