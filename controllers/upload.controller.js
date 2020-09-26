const path = require('path');
const imageService = require('../services/image.service');
const thumbnailService = require('../services/thumbnail.service');

module.exports = {
  getFile(req, res, next) {
    try {
      const { filename } = req.params;
      res.sendFile(path.join(__dirname, `../uploads/${filename}`));
    } catch (err) {
      next(err);
    }
  },
  getThumbnail(req, res, next) {
    try {
      const { filename } = req.params;
      res.sendFile(path.join(__dirname, `../uploads/thumbnails/${filename}`));
    } catch (err) {
      next(err);
    }
  },
  async createImage(req, res, next) {
    try {
      const { userId } = res.locals;
      const { filename } = req.file;
      await thumbnailService.createThumbnail(filename);
      const image = await imageService.createImage({
        filename,
        userId,
      });
      res.status(201).json(image);
    } catch (err) {
      next(err);
    }
  },
};
