const path = require('path');
const fileService = require('../services/file.service');
const { ImageSettings } = require('../config');
const CrudService = require('../services/crud.service');
const imageService = new CrudService(ImageSettings);
const { pathToPrivateUploads, pathToThumbnails } = require('../config');
const CustomError = require('../middleware/errors/custom-error');

module.exports = {
  getUploadInfo(req, res, next) {
    if (req.files) {
      res.status(201).json(req.files);
    } else {
      next(new CustomError(`No files uploaded`, 404));
    } 
  },
  getFullSizeImage(req, res, next) {
    // may contain sensitive data (gps/exif)
    try {
      const { filename } = req.params;
      res.sendFile(path.join(pathToPrivateUploads, filename));
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
      console.log('userId:', userId);
      const images = await Promise.all(req.files.map(async f => {
        const { filename, size, exifDetails } = f;
        const image = await imageService.create({
          filename,
          userId,
          groupId,
        });
        const details = [];
        details.push({ name: 'file-size', content: size });
        details.push(...exifDetails);
        await imageService.createImageDetails({
          value: details,
          foreignKey: { name: 'filename', value: filename },
        });
        return image;
      }));
      res.status(201).json(images);
    } catch (err) {
      next(err);
    }
  },
  async removeImage(req, res, next) {
    try {
      const { filename } = req.params;
      const image = await imageService.getOne(filename);
      const { userId } = res.locals;
      if (userId === image.userId) {
        const removeMainFile = fileService.removeFile(path.join(pathToPrivateUploads, filename));
        const removeThumbnail = fileService.removeFile(path.join(pathToThumbnails, filename));
        const removeFromDb = imageService.remove(filename);
        await Promise.all([removeMainFile, removeThumbnail, removeFromDb]);
        res.status(200).json({ message: `${filename} upload removed` });        
      } else {
        throw new CustomError(`User ${userId} is not permitted to remove file ${filename}`, 403);
      }
    } catch (err) {
      next(err);
    }
  },
};
