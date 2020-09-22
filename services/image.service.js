const { Image } = require('../model');

module.exports = {
  getImage(filename) {
    return Image.findByPk(filename);
  },
  createImage(value) {
    return Image.create(value);
  },
};