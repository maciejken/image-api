module.exports = class CustomError extends Error {
  constructor(message, status = 500, header) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError)
    }
    this.status = status;
    this.header = header;
  }
}