const imageService = require('../services/image.service');
const CustomError = require('../middleware/errors/custom-error');
const fsService = require('../services/fs.service');

module.exports = {
  async getImages(req, res, next) {
    try {
      const imagesDb = await imageService.getImages();
      const images = await Promise.all(imagesDb.map(fsService.getThumbnail));
      res.status(200).json(images);      
    } catch (err) {
      next(err);
    }
  },
  async getImage(req, res, next) {
    try {
      const { filename } = req.params;
      const imageDb = await imageService.getImage(filename);
      if (!imageDb) {
        throw new CustomError(`${filename} record not found`, 404);
      }
      const image = await fsService.getImage(imageDb);
      res.status(200).json(image);
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
