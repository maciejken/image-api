const fileService = require('../services/file.service');

module.exports = async function createThumbnail(req, res, next) {
  try {
    await fileService.createThumbnail(req.files);
    next();
  } catch (err) {
    next(err);
  }
};
