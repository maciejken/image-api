const imageService = require('../services/image.service');
const CustomError = require('../middleware/errors/custom-error');

module.exports = {
  async getImages(req, res, next) {
    try {
      const images = await imageService.getImages();
      res.status(200).json(images);      
    } catch (err) {
      next(err);
    }
  },
  async getImage(req, res, next) {
    try {
      const { filename } = req.params;
      const image = await imageService.getImage(filename);
      if (!image) {
        throw new CustomError(`${filename} record not found`, 404);
      }
      res.status(200).json(image);
    } catch (err) {
      next(err);
    }
  },
  async createImage(req, res, next) {
    try {
      const { userId } = res.locals;
      const { filename, capturedAt, caption, description } = req.body;
      const image = await imageService.createImage({
        filename,
        userId,
        capturedAt,
        caption,
        description,
      });
      res.status(201).json(image);
    } catch (err) {
      next(err);
    }
  },
  async updateImage(req, res, next) {
    try {
      const { filename } = req.params;
      const { caption, capturedAt, description } = req.body;
      const result = await imageService.updateImage(filename, {
        caption,
        capturedAt,
        description,
      });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
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
