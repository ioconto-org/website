/***************************************
 * Covid19 Database interface
 */

require('dotenv').config();
const process    = require('process');
const mysql      = require('mysql');

module.exports = function(logger) {

  let connection; 

  function init() {
    logger.info('Database initialization started');
    return new Promise((resolve, reject) => {
      try {
        connection = mysql.createConnection({
          host     : process.env.MYSQL_HOST || 'localhost',
          user     : process.env.COVID19_DB_USER || 'root',
          password : process.env.MYSQL_ROOT_PASSWORD,
          database : process.env.COVID19_DB || 'ioconto',
          charset : 'utf8',
          multipleStatements: true
        });
        connection.connect((err) => {
          if (err) {
            reject(err);
          } else {
            logger.info('Database connection opened');
            resolve(connection);
          }
        });
      } catch(e) {
        logger.error(e);
        reject(e);
      }
    });    
  }

  function execute(task) {
    return new Promise((resolve, reject) => {
      logger.info(`Started sql execution of ${task.name} - query: ${task.query}`);
      const sql = task.query;
      connection.query(sql, function (error, results, fields) {
        if (error)  {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  function stop() {
    connection.end();
  }

  return  {
    init,
    execute,
    stop
  };
};
