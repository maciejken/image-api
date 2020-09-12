const fs = require('fs');

module.exports = {
  sendImage(req, res, next) {
    try {
      const image = fs.readFileSync(`${__dirname}/../uploads/${req.params.filename}`, 'base64');
      res.status(200).json({ src: `data:image/jpeg;base64, ${image}` });
    } catch (err) {
      next(err);
    }
  }
};
