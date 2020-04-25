require('dotenv').config();
const process = require('process');
const winston = require('winston');

const serviceName = (process.env.SERVICE_NAME || 'ioConto') + ' - Data Pulling';
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { serviceName },
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new winston.transports.File({ filename: process.env.ERROR_LOG_FILE || 'error.log', level: 'error' }),
    new winston.transports.File({ filename: process.env.LOG_FILE || 'combined.log' })
  ]
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

const https = require('https');
const fs = require('fs');
const extract = require('extract-zip');
resolve = require('path').resolve;

const tmpPath = fs.mkdtempSync('tmpc19');
logger.info("started download")
const destFilename = `${tmpPath}/istat.zip`;
download('https://www.istat.it/it/files//2020/03/dati-giornalieri-comune-16aprile.zip', destFilename).then(() => {
  logger.info('finished download');
  extract(destFilename, { dir: resolve(tmpPath) }).then(() => {
    logger.info('finished unzipping');
  }, (err) => {
    logger.error(err);
  });
}, (err) => {
  logger.error(err);
});


function download (url, dest) {
  return new Promise((resolve, reject) => {
    var file = fs.createWriteStream(dest, {autoClose: true});
    var request = https.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        resolve();
      });
    }).on('error', (err) => { // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      reject(err);
    });
  });
}