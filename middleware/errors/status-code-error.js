module.exports = class StatusCodeError extends Error {
    constructor(message, status = 500) {
      super(message);
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, StatusCodeError)
      }
  
      this.status = status;
    }
  }