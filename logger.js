var warningsPrinted  = 0;
var errorsPrinted    = 0;
var infoPrinted      = 0;

exports.warningsReceived = 0;
exports.errorsReceived   = 0;
exports.infoReceived     = 0;

function print(category, msg, opt_msg) {
  if (opt_msg) {
    console.log(category + ': ' + msg + '(' + opt_msg + ')');
  } else {
    console.log(category + ': ' + msg);
  }
}

exports.warning = function(msg, opt_msg) {
  if (warningsPrinted < process.env.LOGGER_MAX_WARNINGS) {
    ++warningsPrinted;
    print('WARNING', msg, opt_msg);
    if (warningsPrinted == process.env.LOGGER_MAX_WARNINGS) {
      console.log('MAX WARNINGS HIT');
    }
  }
  ++exports.warningsReceived;
};

exports.error = function(msg, opt_msg) {
  if (errorsPrinted < process.env.LOGGER_MAX_ERRORS) {
    ++errorsPrinted;
    print('ERROR', msg, opt_msg);
    if (errorPrinted == process.env.LOGGER_MAX_ERROR) {
      console.log('MAX ERROR HIT');
    }
  }
  ++exports.errorsReceived;
};

exports.info = function(msg, opt_msg) {
  if (infoPrinted < process.env.LOGGER_MAX_INFO) {
    ++infoPrinted;
    print('INFO', msg, opt_msg);
    if (infoPrinted == process.env.LOGGER_MAX_INFO) {
      console.log('MAX INFO HIT');
    }
  }
  ++exports.infoReceived;
};