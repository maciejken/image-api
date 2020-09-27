const path = require('path');
const fsService = require('../services/fs.service');
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
  async removeImage(req, res, next) {
    try {
      const { filename } = req.params;
      const removeMainFile = fsService.removeFile(path.join(__dirname, `../uploads/${filename}`));
      const removeThumbnail = fsService.removeFile(path.join(__dirname, `../uploads/thumbnails/${filename}`));
      const removeFromDb = imageService.removeImage(filename);
      await Promise.all([removeMainFile, removeThumbnail, removeFromDb]);
      res.status(200).json({ message: `${filename} upload removed` });
    } catch (err) {
      next(err);
    }
  },
};
