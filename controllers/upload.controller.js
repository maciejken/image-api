const path = require('path');
const fileService = require('../services/file.service');
const imageService = require('../services/image.service');
const { pathToUploads, pathToThumbnails } = require('../config');

module.exports = {
  getFullSizeImage(req, res, next) {
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
  async getMediumSizeImage(req, res, next) {
    try {
      const { filename } = req.params;
      const file = await fileService.getImage(filename, { width: 800 });
      res.status(200).send(file);
    } catch (err) {
      next(err);
    }
  },
  async createImages(req, res, next) {
    try {
      const { groupId } = req.query;
      const { userId } = res.locals;
      const images = await Promise.all(req.files.map(f => {
        const { filename, size } = f;
        const { location, datetime, camera, width, height } = f.exif;
        return imageService.createImage({
          filename,
          userId,
          groupId,
          location,
          datetime,
          camera,
          width,
          height,
          size,
        });
      }));
      res.status(201).json(images);
    } catch (err) {
      next(err);
    }
  },
  async removeImage(req, res, next) {
    try {
      const { filename } = req.params;
      const removeMainFile = fileService.removeFile(path.join(pathToUploads, filename));
      const removeThumbnail = fileService.removeFile(path.join(pathToThumbnails, filename));
      const removeFromDb = imageService.removeImage(filename);
      await Promise.all([removeMainFile, removeThumbnail, removeFromDb]);
      res.status(200).json({ message: `${filename} upload removed` });
    } catch (err) {
      next(err);
    }
  },
};
