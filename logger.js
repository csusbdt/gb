var MAX_WARNINGS_PRINTED = 5;
var MAX_ERRORS_PRINTED = 5;
var MAX_INFO_PRINTED = 5;

var warningsPrinted = 0;
var errorsPrinted = 0;
var infoPrinted = 0;

exports.warning = function(msg) {
  if (warningsPrinted < MAX_WARNINGS_PRINTED) {
    console.log('WARNING: ' + msg);
  }
};

exports.error = function(msg) {
  if (errorsPrinted < MAX_ERRORS_PRINTED) {
    console.log('ERROR: ' + msg);
  }
};

exports.info = function(msg) {
  if (infoPrinted < MAX_INFO_PRINTED) {
    console.log('INFO: ' + msg);
  }
};