const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();
const cfg = {
  port: process.env.PORT,
  certDir: process.env.CERT_DIR
};

const credentials = {
  key: fs.readFileSync(`${cfg.certDir}/privkey.pem`),
  cert: fs.readFileSync(`${cfg.certDir}/fullchain.pem`)
};

const server = https.createServer(credentials, app);
server.listen(cfg.port, () => {
  console.log(`server listening on port ${cfg.port}`);
});
