const sharp = require('sharp');
const { Image } = require('../model');

module.exports = {
  getImage(filename) {
    return Image.findByPk(filename);
  },
  createImage(value) {
    return Image.create(value);
  },
  async createThumbnail(filename) {
    const buf = await sharp(`${__dirname}/../uploads/${filename}`)
      .resize(200)
      .toBuffer();
    return buf.toString('base64');
  },
  removeImage(filename) {
    return Image.destroy({ where: { id: filename }});
  }
};