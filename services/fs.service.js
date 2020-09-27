const fs = require('fs');
const CustomError = require('../middleware/errors/custom-error');

module.exports = {
  saveFile(pathToFile, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(`${thumbnailsPath}/${pathToFile}`, data, err => {
        if (err) {
          reject(new CustomError(`unable to save file ${pathToFile}`, 409));
        }
        resolve();
      })
    });
  },
  getBase64EncodedFile(pathToFile) {
    return new Promise((resolve, reject) => {
      fs.readFile(pathToFile, 'utf8', (err, data) => {
        if (err) {
          reject(new CustomError(`could not read file ${pathToFile}`, 404));
        }
        resolve(data);
      });
    });
  },
  removeFile(pathToFile) {
    return new Promise((resolve, reject) => {
      fs.unlink(pathToFile, err => {
        if (err) {
          reject(new CustomError(`could not remove file ${pathToFile}`, 409));
        }
        resolve();
      });
    });
  }
};
