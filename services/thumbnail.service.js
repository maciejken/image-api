const sharp = require('sharp');
const path = require('path');

const pathToUploads = path.join(__dirname, '../uploads');
const pathToThumbnails = path.join(pathToUploads, 'thumbnails');

module.exports = {
  async createThumbnail(filename) {
    return await sharp(path.join(pathToUploads, filename))
      .resize(200)
      .toFile(path.join(pathToThumbnails, filename));
  },
};
