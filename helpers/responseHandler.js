
// Success response
const sendSuccess = (res, message, data = null, statusCode = 200) => {
    return res.status(statusCode).send({
      status: statusCode,
      message,
      data,
    });
  };
  
  // Error response
  const sendError = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({
      status: 'error',
      message
    });
  };
  
  module.exports = {
    sendSuccess,
    sendError,
  };
  