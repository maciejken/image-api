const fs = require('fs');
const imageService = require('../services/image.service');

module.exports = {
  getImages(req, res, next) {
    res.status(200).json({ image: `so many of 'em` });
  },
  async getImage(req, res, next) {
    try {
      const image = await imageService.getImage(req.params.filename);
      const { id, mimeType, userId, caption, capturedAt } = image;
      const imageBase64 = fs.readFileSync(`${__dirname}/../uploads/${id}`, 'base64');
      res.status(200).json({
        id,
        userId,
        caption,
        capturedAt,
        src: `data:${mimeType};base64, ${imageBase64}`,
      });
    } catch (err) {
      next(err);
    }
  },
  async createImage(req, res, next) {
    try {
      if (req.file && req.verifiedUser) {
        const { filename, mimetype } = req.file;
        const userId = req.verifiedUser.id;
        const image = await imageService.createImage({
          id: filename,
          userId,
          mimeType: mimetype,
        });
        res.status(201).json(image);
      }
    } catch (err) {
      next(err);
    }
  },
  updateImage(req, res, next) {
    res.status(200).json({ image: req.params.filename });
  },
  removeImage(req, res, next) {
    res.status(200).json({ image: req.params.filename });
  },
};
