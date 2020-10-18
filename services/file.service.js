const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const { ExifImage } = require('exif');

const CustomError = require('../middleware/errors/custom-error');
const { pathToUploads, pathToThumbnails } = require('../config');

function parseExif(data) {
  let exif;
  if (data) {
    const { gps, image } = data;
    const lonRef = gps && gps.GPSLatitudeRef;
    const [lonD, lonM, lonS] = (gps && gps.GPSLatitude) || [];
    const latRef = gps && gps.GPSLongitudeRef;
    const [latD, latM, latS] = (gps && gps.GPSLongitude) || [];
    const location = `${lonD}°${lonM}'${lonS}''${lonRef} ${latD}°${latM}'${latS}''${latRef}`;
    const [hh, mm, ss] = (gps && gps.GPSTimeStamp) || [];
    const [year, month, day] = (gps && gps.GPSDateStamp.split(':')) || [];
    const datetime = year && month && day && `${year}-${month}-${day}T${hh}:${mm}:${ss}.000Z`;
    const width = (image && image.ImageWidth) || null;
    const height = (image && image.ImageHeight) || null;
    const camera = (image && `${image.Make} ${image.Model}`) || null;
    exif = !(width || height) ? null : {
      location,
      datetime,
      camera,
      width,
      height,
    };
  } else {
    exif = null;
  }
  return exif;
}

module.exports = {
  saveFile(filename, data) {
    return new Promise((resolve, reject) => {
      const file = `${pathToThumbnails}/${filename}`
      fs.writeFile(file, data, err => {
        if (err) {
          reject(new CustomError(`unable to save file ${file}`, 409));
        } else {
          resolve();
        }
      })
    });
  },
  getBase64EncodedFile(file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          reject(new CustomError(`could not read file ${file}`, 404));
        } else {
          resolve(data);
        }
      });
    });
  },
  removeFile(file) {
    return new Promise((resolve, reject) => {
      fs.unlink(file, err => {
        if (err) {
          reject(new CustomError(`could not remove file ${file}`, 409));
        } else {
          resolve();
        }
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
  readExif(files) {
    return Promise.all(files.map(file => new Promise((resolve, reject) => {
      const { filename } = file;
      new ExifImage({ image: path.join(pathToUploads, filename) }, (err, data) => {
        if (err) {
          resolve({
            ...file,
            exif: {},
          });
        } else {
          resolve({
            ...file,
            exif: parseExif(data)
          });
        }
      });
    })));
  }
};
