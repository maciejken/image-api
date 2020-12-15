const { Image } = require('../model');
const buildQuery = require('../utils');

module.exports = {
  getImages({ order, page, size }) {
    const query = buildQuery({ order, page, size });
    return Image.findAll(query);
  },
  getImage(filename) {
    return Image.findByPk(filename);
  },
  createImage(value) {
    return Image.create(value);
  },
  removeImage(filename) {
    return Image.destroy({ where: { filename }});
  },
};