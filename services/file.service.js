const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const { ExifImage } = require('exif');

const CustomError = require('../middleware/errors/custom-error');
const { pathToPrivateUploads, pathToThumbnails } = require('../config');

function zeroPad(n) {
  return String(n).padStart(2, '0');
}

function parseExif(data) {
  const exifDetails = [];
  if (data) {
    const { gps, image } = data;
    const latRef = gps && gps.GPSLatitudeRef;
    const [latD, latM, latS] = (gps && gps.GPSLatitude) || [];
    const lonRef = gps && gps.GPSLongitudeRef;
    const [lonD, lonM, lonS] = (gps && gps.GPSLongitude) || [];
    const location = `${latD}°${latM}'${latS}''${latRef} ${lonD}°${lonM}'${lonS}''${lonRef}`;
    const [hh, mm, ss] = (gps && gps.GPSTimeStamp) || [];
    const [year, month, day] = (gps && gps.GPSDateStamp.split(':')) || [];
    const datetime = year && month && day
      && `${year}-${zeroPad(month)}-${zeroPad(day)}T${zeroPad(hh)}:${zeroPad(mm)}:${zeroPad(ss)}.000Z`;
    const width = (image && image.ImageWidth) || null;
    const height = (image && image.ImageHeight) || null;
    const camera = (image && `${image.Make} ${image.Model}`) || null;
    if (width && height) {
      exifDetails.push(
        { name: 'exif-width', content: width },
        { name: 'exif-height', content: height },
        { name: 'exif-location', content: location },
        { name: 'exif-datetime', content: datetime },
        { name: 'exif-camera', content: camera },
      );
    }
  }
  return exifDetails;
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
        return sharp(path.join(pathToPrivateUploads, f.filename))
          .resize(200, 200)
          .toFile(path.join(pathToThumbnails, f.filename));
    }));
  },
  getImage(filename, { width, height }) {
    return sharp(path.join(pathToPrivateUploads, filename))
      .resize(width, height)
      .toBuffer();
  },
  readExif(files) {
    return Promise.all(files.map(file => new Promise((resolve, reject) => {
      const { filename } = file;
      new ExifImage({ image: path.join(pathToPrivateUploads, filename) }, (err, data) => {
        if (err) {
          resolve({
            ...file,
            exifDetails: [],
          });
        } else {
          resolve({
            ...file,
            exifDetails: parseExif(data)
          });
        }
      });
    })));
  }
};
