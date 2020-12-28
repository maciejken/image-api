const path = require('path');
const fileService = require('../services/file.service');
const { pathToPrivateUploads, pathToThumbnails, adminGroupId } = require('../config');
const CustomError = require('../middleware/errors/custom-error');
const uploadService = require('../services/upload.service');

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
      const { userId, groupId } = res.locals;
      const images = await uploadService.createUploads({ userId, groupId, files: req.files });
      res.status(201).json(images);
    } catch (err) {
      next(err);
    }
  },
  async removeUploads(req, res, next) {
    try {
      const { filename } = { ...req.params, ...req.body };
      const filenames = Array.isArray(filename) ? filename : [filename];
      const fileCount = await uploadService.removeUploads({
        userId: res.locals.userId,
        filenames,
        isAdmin: res.locals.groups.includes(adminGroupId),
      });
      res.status(200).json({ message: `${fileCount} file(s) removed` });
    } catch (err) {
      next(err);
    }
  },
};
