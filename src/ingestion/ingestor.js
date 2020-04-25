require('dotenv').config();
const fs = require('fs');
const process = require('process');
//const mysql      = require('mysql');

const pathSources = process.env.COVID19_SOURCES || '../covid19-sources';

module.exports = function(logger) {

  const database     = require('./database')(logger);
  let connection; 

  /********************************************************************************************
   * Reads sources.json file from covid19-sources repo and start ingestion for each data source
   */
  async function init() {
    try {
      connection = await database.init();
      const sourcesPathname = `${pathSources}/sources.json`;
      if (fs.existsSync(sourcesPathname)) {
        const sources = JSON.parse(fs.readFileSync(sourcesPathname, 'utf8'));
        for (let i=0; i<sources.length; i++){
          if (sources[i].ingest) {
            await database.ingest(sources[i]);
          }
        }
      } else {
        logger.error(`Unable to find local sources.json file at: ${pathSources}`);
      }
    } catch (e) {
      throw e;
    }
  }

  function getSql(data) {
    let ret;
    const d = data.data;
    switch(data.entity) {
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
    }
    return ret;
  }
  
  function write(data) {
    return new Promise((resolve, reject) => {
      connection.query(getSql(data), function (error, results, fields) {
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
    logger.info('Writer stopped');
  }

  return  {
    init,
    write,
    stop
  };
};

