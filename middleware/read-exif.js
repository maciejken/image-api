const fileService = require('../services/file.service');

module.exports = async function readExif(req, res, next) {
  try {
    const files = await fileService.readExif(req.files);
    req.files = files;
    next();
  } catch (err) {
    next(err);
  }
};
