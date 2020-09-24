const fs = require('fs');
const CustomError = require('../middleware/errors/custom-error');

const uploadsPath = `${__dirname}/../uploads`;
const thumbnailsPath = `${uploadsPath}/thumbnails`;

module.exports = {
  saveThumbnail(filename, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(`${thumbnailsPath}/${filename}.dat`, data, err => {
        if (err) {
          reject(new CustomError(`unable to save file /uploads/thumbnails/${filename}.dat`, 409));
        }
        resolve();
      })
    });
  },
  getThumbnail({ id, mimeType, userId, caption, capturedAt, createdAt, updatedAt }) {
    return new Promise((resolve, reject) => {
      fs.readFile(`${thumbnailsPath}/${id}.dat`, 'utf8', (err, data) => {
        if (err) {
          reject(new CustomError(`could not read file /uploads/thumbnails/${id}.dat`, 404));
        }
        resolve({
          id,
          userId,
          caption,
          capturedAt,
          createdAt,
          updatedAt,
          src: `data:${mimeType};base64, ${data}`,
        });
      });
    });
  },
  getImage({ id, mimeType, userId, caption, capturedAt, createdAt, updatedAt }) {
    return new Promise((resolve, reject) => {
      const path = `${uploadsPath}/${id}`;
      fs.readFile(path, 'base64', (err, data) => {
        if (err) {
          reject(new CustomError(`could not read file /uploads/${id}`, 404));
        }
        resolve({
          id,
          userId,
          caption,
          capturedAt,
          createdAt,
          updatedAt,
          src: `data:${mimeType};base64, ${data}`,
        });
      });
    });
  }
};
