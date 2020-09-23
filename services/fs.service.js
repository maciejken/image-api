const fs = require('fs');
const dirPath = `${__dirname}/../uploads/thumbnails`;

module.exports = {
  saveThumbnail(filename, thumbBase64) {
    return new Promise((resolve, reject) => {
      fs.writeFile(`${dirPath}/${filename}.dat`, thumbBase64, err => {
        if (err) {
          reject(new CustomError(`unable to save /uploads/thumbnails/${filename}.dat`, 409));
        }
        resolve();
      })
    });
  }
};