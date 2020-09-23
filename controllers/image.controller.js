const fs = require('fs');
const imageService = require('../services/image.service');
const CustomError = require('../middleware/errors/custom-error');
const fsService = require('../services/fs.service');

module.exports = {
  getImages(req, res, next) {
    res.status(200).json({ image: `so many of 'em` });
  },
  async getImage(req, res, next) {
    try {
      const { filename } = req.params;
      const image = await imageService.getImage(filename);
      if (!image) {
        throw new CustomError(`${filename} record not found`, 404);
      }
      const { id, mimeType, userId, caption, capturedAt, createdAt, updatedAt } = image;
      const path = `${__dirname}/../uploads/${id}`;
      if (fs.existsSync(path)) {
        const imageBase64 = fs.readFileSync(path, 'base64');
        res.status(200).json({
          id,
          userId,
          caption,
          capturedAt,
          createdAt,
          updatedAt,
          src: `data:${mimeType};base64, ${imageBase64}`,
        });       
      } else {
        throw new CustomError(`/uploads/${id} file not found`, 404);
      }
    } catch (err) {
      next(err);
    }
  },
  async createImage(req, res, next) {
    try {
      if (req.file && req.verifiedUserId) {
        const { filename, mimetype } = req.file;
        const userId = req.verifiedUserId;
        const thumbBase64 = await imageService.createThumbnail(filename);
        await fsService.saveThumbnail(filename, thumbBase64);
        const image = await imageService.createImage({
          id: filename,
          userId,
          mimeType: mimetype,
        });
        res.status(201).json(image);
      } else {
        throw new CustomError(`failed to create image`, 409);
      }
    } catch (err) {
      next(err);
    }
  },
  updateImage(req, res, next) {
    res.status(200).json({ image: req.params.filename });
  },
  async removeImage(req, res, next) {
    try {
      const { filename } = req.params;
      const result = await imageService.removeImage(filename);
      if (result) {
        res.status(200).json({ message: `${result} file${result > 1 ? 's' : ''} removed`});
      } else {
        throw new CustomError(`/uploads/${filename} file not found`, 404);
      }
    } catch (err) {
      next(err);
    }
  },
};
