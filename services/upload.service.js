const path = require('path');
const fileService = require('./file.service');
const { ImageSettings, pathToPrivateUploads, pathToThumbnails } = require('../config');
const CrudService = require('./crud.service');
const imageService = new CrudService(ImageSettings);
const { ImageDetails } = require('../enum');

module.exports = {
  async createUploads({ userId, groupId, files }) {
    const images = await Promise.all(files.map(async f => {
      const { filename, size, exifDetails } = f;
      const dtDetail = exifDetails.find(d => d.name === ImageDetails.ExifDatetime);
      const createdAt = dtDetail && dtDetail.content;
      const image = await imageService.create({
        filename,
        userId,
        groupId,
        createdAt,
      });
      const details = [];
      details.push({ name: ImageDetails.FileSize, content: size });
      details.push(...exifDetails.filter(d => d.name !== ImageDetails.ExifDatetime));
      await imageService.createImageDetails({
        value: details,
        foreignKey: { name: 'filename', value: filename },
      });
      return image;
    }));
    return images;
  },
  async removeUploads({ userId, isAdmin, filenames }) {
    const filters = [
      {
        attribute: 'filename',
        value: filenames
      },
    ];
    if (!isAdmin) {
      filters.push({
        attribute: 'userId',
        value: userId
      });
    }
    const images = await imageService.getMany({ filters });
    const fnames = images.map(image => image.filename);
    const fileRemoval = Promise.all(fnames.map(fname =>
      fileService.removeFile(path.join(pathToPrivateUploads, fname))
      ));
    const thumbsRemoval = Promise.all(fnames.map(fname =>
      fileService.removeFile(path.join(pathToThumbnails, fname))
      ));
    const dbRecordRemoval = imageService.remove(fnames);
    await Promise.all([fileRemoval, thumbsRemoval, dbRecordRemoval]);
    return images.length;
  }
};
