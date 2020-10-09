const sharp = require('sharp');
const path = require('path');

const { pathToUploads, pathToThumbnails } = require('../config');

module.exports = async function createThumbnail(req, res, next) {
  try {
    await Promise.all(req.files.map(f => {
      return sharp(path.join(pathToUploads, f.filename))
        .resize(200, 200)
        .toFile(path.join(pathToThumbnails, f.filename));
    }));
    next();
  } catch (err) {
    next(err);
  }
};
