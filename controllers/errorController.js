const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  //OPERATIONAL ERROR, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  // PROGRAMMING OR UNKNOWN ERROR
  else {
    console.error('ERROR', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  console.log('test');
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = err => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(value => value.message);

  const message = `Invalid input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleTokenError = () => {
  return new AppError('Invalid token. Log in again', 401);
};

const handleTokenExpiredError = () => {
  return new AppError('Expired token. Log in again', 401);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let newErr = { ...err };
    if (newErr.name === 'CastError') newErr = handleCastErrorDB(newErr);
    if (newErr.code === 11000) newErr = handleDuplicateFieldDB(newErr);
    if (newErr.name === 'ValidationError')
      newErr = handleValidationErrorDB(newErr);
    if (newErr.name === 'JsonWebTokenError') newErr = handleTokenError();
    if (newErr.name === 'TokenExpiredError') newErr = handleTokenExpiredError();
    sendErrorProd(newErr, res);
  }
};
