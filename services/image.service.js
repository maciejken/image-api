const { Image } = require('../model');

module.exports = {
  getImages() {
    return Image.findAll();
  },
  getImage(filename) {
    return Image.findByPk(filename);
  },
  createImage(value) {
    return Image.create(value);
  },
  removeImage(filename) {
    return Image.destroy({ where: { filename }});
  }
};