const fs = require('fs');

module.exports = {
  sendData(req, res, next) {
    try {
      const data = fs.readFileSync(`${__dirname}/../uploads/${req.params.filename}`, 'base64');
      res.status(200).json({ data: `data:image/jpeg;base64, ${data}` });
    } catch (err) {
      next(err);
    }
  }
};
