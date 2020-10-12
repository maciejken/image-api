const path = require('path');
const fsService = require('../services/fs.service');
const imageService = require('../services/image.service');
const { pathToUploads, pathToThumbnails } = require('../config');

module.exports = {
  getFile(req, res, next) {
    try {
      const { filename } = req.params;
      res.sendFile(path.join(pathToUploads, filename));
    } catch (err) {
      next(err);
    }
  },
  getThumbnail(req, res, next) {
    try {
      const { filename } = req.params;
      res.sendFile(path.join(pathToThumbnails, filename));
    } catch (err) {
      next(err);
    }
  },
  // TODO getMediumSizeFile(req, res, next) {
  //   try {
  //     const { filename } = req.params;

  //     res.sendFile(path.join(pathToThumbnails, filename));
  //   } catch (err) {
  //     next(err);
  //   }
  // },
  async createImages(req, res, next) {
    try {
      const { userId } = res.locals;
      const images = await Promise.all(req.files.map(f => {
        const { filename } = f;
        return imageService.createImage({ filename, userId });
      }));
      res.status(201).json(images);
    } catch (err) {
      next(err);
    }
  },
  async removeImage(req, res, next) {
    try {
      const { filename } = req.params;
      const removeMainFile = fsService.removeFile(path.join(pathToUploads, filename));
      const removeThumbnail = fsService.removeFile(path.join(pathToThumbnails, filename));
      const removeFromDb = imageService.removeImage(filename);
      await Promise.all([removeMainFile, removeThumbnail, removeFromDb]);
      res.status(200).json({ message: `${filename} upload removed` });
    } catch (err) {
      next(err);
    }
  },
};
