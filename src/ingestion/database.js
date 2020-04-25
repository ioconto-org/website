/***************************************
 * Covid19 Database interface
 */

require('dotenv').config();
const process    = require('process');
const mysql      = require('mysql');
const csv        = require('csvtojson');
const fs         = require('fs');
const moment     = require('moment');

const pathSources = process.env.COVID19_SOURCES || '../covid19-sources';

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
        //  database : process.env.COVID19_DB || 'ioconto',
          charset : 'utf8',
          multipleStatements: true
        });
        connection.connect((err) => {
          if (err) {
            reject(err);
          } else {
            //Connection established
            createDatabase().then((created) => {
              connection.changeUser({database : process.env.COVID19_DB || 'ioconto'}, function(err) {
                if (err)  {
                  reject(err);
                } else {
                  if (created) {
                    createTable('ingestor-log').then(()=> {
                      logger.info('Database connection opened');
                      resolve(connection);
                    }, (e) => {
                      reject(e);
                    });
                  } else {
                    logger.info('Database connection opened');
                    resolve(connection);
                  }
                }
              });
            });
          }
        });
      } catch(e) {
        logger.error(e);
        reject(e);
      }
    });    
  }

  function checkIngest(source) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM \`ingestor-log\`
        WHERE sourceId = ${source.sourceId} AND status = 'success'
        ORDER BY lastExecutionDate DESC`;
      connection.query(sql, function (error, results, fields) {
        if (error)  {
          reject(error);
        } else {
          if (results.length) {
            let dbDate = results[0].sourceDate;
            let sourceDate = new Date(source.lastUpdate);
            if (dbDate < sourceDate) {
              //there's a newer version, let's import it
              resolve(true);
            } else {
              //Already up to date
              resolve(false);
            }
          } else {
            //never ingested, let's do it
            resolve(true);
          }
        }
      });
    });
  }

  function addIngestorLog(source, status = 'success', notes = '') {
    return new Promise((resolve, reject) => {
      let sourceDate = new Date(source.lastUpdate).toISOString().slice(0, 19).replace('T', ' ');
      sourceDate = moment(source.lastUpdate).format( 'YYYY-MM-DD  HH:mm:ss.000' );
      let sql = `INSERT INTO \`ingestor-log\` (sourceId, sourceDate, status, notes)
        VALUES (${source.sourceId}, '${sourceDate}', '${status}', ${connection.escape(notes)})`;
      connection.query(sql, function (error, results, fields) {
        if (error)  {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async function ingest(source) {
    try {
      const ingestNeeded = await checkIngest(source);
      if (ingestNeeded) {
        logger.info(`Started ingestion of ${source.name} from file ${source.fileName}`);
        if (source.ingestionType && source.ingestionType == 'replace') {
          await dropTable(source.country, source.entity);
        }
        await createTable(source.country, source.entity);
        await loadTable(source.country, source.entity, source.fileName, source.ingestionProgress);
        //TODO we have to update the table for ingestions
        await addIngestorLog(source);
        logger.info(`Finished ingestion of ${source.name} from file ${source.fileName}`);
      } else {
        logger.info(`${source.name} is already up to date, ingestion skipped`);
      }
    } catch (e) {
      logger.error(`Failed ingestion of ${source.name} from file ${source.fileName}`);
      logger.error(e);
    }
  }

  function loadTable(country, entity, filename = null, progress = 1000) {
    return new Promise((resolve, reject) => {
      let counter = 0;
      const pathname = (filename) ? `${pathSources}/current/${filename}` : `${pathSources}/current/${country}-${entity}.csv`;
      if (fs.existsSync(pathname)) {
        csv({
          delimiter: [',', ';']
        })
        .fromFile(pathname)
        .subscribe(async (csvLine)=>{ 
          try {
            await write(csvLine, `${country}-${entity}`);
            counter++;
            if ((counter % progress) == 0) {
              logger.info(`Loaded ${counter} rows in table ${country}-${entity}.`);
            }
          } catch (e) {
            reject(e);
          }
        }, (err) => {
          reject(err);
        }, (done) => {
          logger.info(`Table ${country}-${entity} loaded with ${counter} rows.`);
          resolve();
        });
      } else {
        reject(`${pathname} doesn't exist. Did you cloned repository covid19-sources from github and placed in the correct place?`);
      }
    });
  }

  /*******************************************
   * Support the following two calling methods:
   * 
   * 1) createTable(tablename)
   * 2) createTable(country, entity)  -> this one build the table name from the arguments passed
   */
  function createTable(country, entity) {
    const tableName = (entity) ? `${country}-${entity}` : country;
    const sql = getCreateTableSql(tableName);
    return new Promise((resolve, reject) => {
      connection.query(sql, function (error, results, fields) {
        if (error)  {
          reject(error);
        } else {
          logger.info(`Table ${tableName} created.`);
          resolve();
        }
      });
    });
  }

  /*******************************************
   * Support the following two calling methods:
   * 
   * 1) dropTable(tablename)
   * 2) dropTable(country, entity)  -> this one build the table name from the arguments passed
   */
  function dropTable(country, entity) {
    const tableName = (entity) ? `${country}-${entity}` : country;
    const sql = `DROP TABLE IF EXISTS \`${tableName}\`;`;
    return new Promise((resolve, reject) => {
      connection.query(sql, function (error, results, fields) {
        if (error)  {
          reject(error);
        } else {
          logger.info(`Table ${tableName} dropped.`);
          resolve();
        }
      });
    });
  }

  function createDatabase() {
    const dbname = process.env.COVID19_DB || 'ioconto';
    const sql = `CREATE DATABASE IF NOT EXISTS \`${dbname}\` DEFAULT CHARACTER SET utf8;`;
    return new Promise((resolve, reject) => {
      connection.query(sql, function (error, results, fields) {
        if (error)  {
          reject(error);
        } else {
          if (!results.warningCount) logger.info('Database created');
          resolve(!results.warningCount);
        }
      });
    });
  }

  function getCreateTableSql(entity) {
    let ret;
    switch(entity) {
      case 'ingestor-log':
        ret = `CREATE TABLE IF NOT EXISTS \`${entity}\` (
          id int(11) NOT NULL AUTO_INCREMENT,
          sourceId int(11) NOT NULL,
          sourceDate datetime NOT NULL,
          lastExecutionDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
          status varchar(40) NOT NULL,
          notes text,
          PRIMARY KEY id (id),
          KEY sourceId (sourceId)
        ) DEFAULT CHARSET=utf8;`
        break;
      
      case 'it-municipalities-daily-deaths':
        ret = `CREATE TABLE \`${entity}\` (
          regId int(11) NOT NULL,
          provId int(11) NOT NULL,
          region varchar(255) CHARACTER SET utf8 NOT NULL,
          province varchar(255) CHARACTER SET utf8 NOT NULL,
          name varchar(255) CHARACTER SET utf8 NOT NULL,
          istatId int(11) NOT NULL,
          ageClass int(11) NOT NULL,
          dayS varchar(4) NOT NULL,
          day int(11) NOT NULL,
          month int(11) NOT NULL,
          m15 int(11) NOT NULL,
          m16 int(11) NOT NULL,
          m17 int(11) NOT NULL,
          m18 int(11) NOT NULL,
          m19 int(11) NOT NULL,
          m20 int(11) NOT NULL,
          f15 int(11) NOT NULL,
          f16 int(11) NOT NULL,
          f17 int(11) NOT NULL,
          f18 int(11) NOT NULL,
          f19 int(11) NOT NULL,
          f20 int(11) NOT NULL,
          t15 int(11) NOT NULL,
          t16 int(11) NOT NULL,
          t17 int(11) NOT NULL,
          t18 int(11) NOT NULL,
          t19 int(11) NOT NULL,
          t20 int(11) NOT NULL,
          KEY istatId (istatId)
          ) DEFAULT CHARSET=utf8; `;
        break;

      case 'it-deaths-bergamo':
      case 'it-deaths-brescia':
        ret = `CREATE TABLE IF NOT EXISTS \`${entity}\` (
          istatId int(11) NOT NULL,
          name varchar(255) NOT NULL,
          mar19 int(11) DEFAULT NULL,
          mar20 int(11) DEFAULT NULL,
          officialCovid int(11) DEFAULT NULL
        ) DEFAULT CHARSET=utf8; `;
        break;

      case 'it-municipalities-geo':
        ret = `CREATE TABLE IF NOT EXISTS \`${entity}\` (
          istatId int(11) NOT NULL,
          name varchar(255) NOT NULL,
          lng varchar(255) NOT NULL,
          lat varchar(255) NOT NULL,
          UNIQUE KEY istatId (istatId)
          ) DEFAULT CHARSET=utf8; `;
        break;

      case 'it-municipalities':
        ret = `CREATE TABLE IF NOT EXISTS \`${entity}\` (
          regionId int(11) NOT NULL,
          subRegionId int(11) NOT NULL,
          provinceId int(11) NOT NULL,
          progProv int(11) NOT NULL,
          istatIdStr varchar(10) NOT NULL,
          nameItSt varchar(255) NOT NULL,
          nameIt varchar(255) NOT NULL,
          nameSt varchar(255) NOT NULL,
          ripGeoId int(11) NOT NULL,
          ripGeoName varchar(255) NOT NULL,
          regionName varchar(255) NOT NULL,
          nameSubReg varchar(255) NOT NULL,
          provinceCity tinyint(1) NOT NULL,
          carPlate varchar(10) NOT NULL,
          istatId int(11) NOT NULL,
          istatId2016 int(11) NOT NULL,
          istatId2009 int(11) NOT NULL,
          istatId2005 int(11) NOT NULL,
          cadastreId varchar(255) NOT NULL,
          population int(11) NOT NULL,
          NUTS1 varchar(255) NOT NULL,
          NUTS2 varchar(255) NOT NULL,
          NUTS3 varchar(255) NOT NULL,
          UNIQUE KEY istatId (istatId)
          ) DEFAULT CHARSET=utf8; `;
        break;
    }
    return ret;
  }

  function getInsertSql(d, entity) {
    let ret;
    switch(entity) {
      case 'it-municipalities-daily-deaths':
        let name = connection.escape(d.NOME_COMUNE);
        let region = connection.escape(d.NOME_REGIONE);
        let province = connection.escape(d.NOME_REGIONE);
        ret = 'INSERT INTO `it-municipalities-daily-deaths` (`regId`, `provId`, `region`, `province`, `name`, `istatId`, `ageClass`, `dayS`, `day`, `month`, `m15`, `m16`, `m17`, `m18`, `m19`, `m20`, `f15`, `f16`, `f17`, `f18`, `f19`, `f20`, `t15`, `t16`, `t17`, `t18`, `t19`, `t20`) VALUES ';
        ret += `(${parseInt(d.REG)}, ${parseInt(d.PROV)}, ${region}, ${province}, ${name}, ${parseInt(d.COD_PROVCOM)}, ${parseInt(d.CL_ETA)}, '${d.GE}', ${parseInt(d.GE.substr(2,2))}, ${parseInt(d.GE.substr(0,2))}, 
        ${parseInt(d.MASCHI_15)}, ${parseInt(d.MASCHI_16)}, ${parseInt(d.MASCHI_17)}, ${parseInt(d.MASCHI_18)}, ${parseInt(d.MASCHI_19)}, ${parseInt(d.MASCHI_20)},
        ${parseInt(d.FEMMINE_15)}, ${parseInt(d.FEMMINE_16)}, ${parseInt(d.FEMMINE_17)}, ${parseInt(d.FEMMINE_18)}, ${parseInt(d.FEMMINE_19)}, ${parseInt(d.FEMMINE_20)},
        ${parseInt(d.TOTALE_15)}, ${parseInt(d.TOTALE_16)}, ${parseInt(d.TOTALE_17)}, ${parseInt(d.TOTALE_18)}, ${parseInt(d.TOTALE_19)}, ${parseInt(d.TOTALE_20)});`;
        break;

      case 'it-deaths-bergamo':
      case 'it-deaths-brescia':
        ret = `INSERT INTO \`${entity}\` (istatId, name, mar19, mar20, officialCovid) VALUES
        (${parseInt(d.istatId)}, ${connection.escape(d.name)}, ${d.mar19}, ${d.mar20}, ${d.officialCovid});`
        break;

      case 'it-municipalities-geo':
        ret = `INSERT INTO \`it-municipalities-geo\` (istatId, name, lng, lat) VALUES
        (${parseInt(d.istatId)}, ${connection.escape(d.name)}, '${d.lng}', '${d.lat}');`
        break;

      case 'it-municipalities':
        const population = parseInt(d.population.replace(/\./g,''));
        ret = `INSERT INTO \`it-municipalities\` (regionId, subRegionId, provinceId, progProv, istatIdStr, nameItSt, nameIt, nameSt, ripGeoId, ripGeoName, regionName, nameSubReg, provinceCity, carPlate, istatId, istatId2016, istatId2009, istatId2005, cadastreId, population, NUTS1, NUTS2, NUTS3) VALUES
        (${d.regionId}, ${d.subRegionId}, ${d.provinceId}, ${d.progProv}, '${d.istatIdStr}', ${connection.escape(d.nameItSt)}, ${connection.escape(d.nameIt)}, ${connection.escape(d.nameSt)}, ${d.ripGeoId}, '${d.ripGeoName}', ${connection.escape(d.regionName)}, ${connection.escape(d.nameSubReg)}, ${d.provinceCity}, '${d.carPlate}', ${d.istatId}, ${d.istatId2016}, ${d.istatId2009}, ${d.istatId2005}, '${d.cadastreId}', ${population}, '${d.NUTS1}', '${d.NUTS2}', '${d.NUTS3}')`;
        break;
    }
    return ret;
  }

  function write(data, entity) {
    return new Promise((resolve, reject) => {
      const sql = getInsertSql(data, entity);
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
    ingest,
    stop
  };
};

