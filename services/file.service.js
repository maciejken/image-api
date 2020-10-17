const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

const CustomError = require('../middleware/errors/custom-error');
const { pathToUploads, pathToThumbnails } = require('../config');

module.exports = {
  saveFile(filename, data) {
    return new Promise((resolve, reject) => {
      const file = `${pathToThumbnails}/${filename}`
      fs.writeFile(file, data, err => {
        if (err) {
          reject(new CustomError(`unable to save file ${file}`, 409));
        }
        resolve();
      })
    });
  },
  getBase64EncodedFile(file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          reject(new CustomError(`could not read file ${file}`, 404));
        }
        resolve(data);
      });
    });
  },
  removeFile(file) {
    return new Promise((resolve, reject) => {
      fs.unlink(file, err => {
        if (err) {
          reject(new CustomError(`could not remove file ${file}`, 409));
        }
        resolve();
      });
    });
  },
  createThumbnail(files) {
    return Promise.all(files.map(f => {
        return sharp(path.join(pathToUploads, f.filename))
          .resize(200, 200)
          .toFile(path.join(pathToThumbnails, f.filename));
    }));
  },
  getImage(filename, { width, height }) {
    return sharp(path.join(pathToUploads, filename))
      .resize(width, height)
      .toBuffer();
  },
};
