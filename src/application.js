// Require tedious so it is included in pkg build
require('tedious');

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const rc = require('rc');
const async = require('async');
const moment = require('moment');
const csvjson = require('csvjson');

const generateConfigHelp = require('./generate-config-help.js');
const orm = require('./orm.js');

class Application {
  constructor(appName) {
    this.appName = appName;
  }

  // Load configs from .${APP}rc files
  loadConfig() {
    let conf = rc(this.appName);

    if (!conf.configs) {
      return false;
    }

    this.config = conf;

    return true;
  }

  // Entry point for the application
  run() {
    // Check if configs can be loaded
    const configOk = this.loadConfig();
    if (!configOk) {
      return Promise.reject(generateConfigHelp(this.appName));
    }

    let sequelize = new Sequelize(this.config.mssql.database, this.config.mssql.username, this.config.mssql.password, {
      host: this.config.mssql.hostname,
      dialect: 'mssql',
      logging: false
    });

    this.models = orm.load(sequelize, this.config);
    this.sequelize = sequelize;

    let actions = {};
    let promise = new Promise((resolve, reject) => {
      actions.resolve = resolve;
      actions.reject = reject;
    });

    sequelize.sync().then(() => {
      return this.processConfigs();
    }).then(actions.resolve).catch(actions.reject);

    return promise;
  }

  // Locate and process Oracle extracts in the designated drop folder
  // in ascending chronological order.
  processConfigs() {
    const fileRegexp = /^PMH_Stria_EE_Data_(\d{14})\.csv$/;

    let actions = {};
    let promise = new Promise((resolve, reject) => {
      actions.resolve = resolve;
      actions.reject = reject;
    });

    const baseDir = this.config.fileDropFolder;

    fs.readdir(baseDir, (err, list) => {
      if (err) {
        return actions.reject(err);
      }

      // Filter out non-CSV files
      const fileList = list.filter(file => {
        let match = file.match(fileRegexp);

        if (!match) {
          return false;
        }

        const filePath = path.join(baseDir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          return false;
        }

        return true;
      });

      if (fileList.length === 0) {
        return actions.resolve();
      }

      // Sort files by timestamp in name
      const orderedFileList = fileList.map(f => {
        let match = f.match(fileRegexp);
        let m = moment(match[1], 'YYYYMMDDHHmmss');

        return {
          moment: m,
          fileName: f
        };
      }).sort((a, b) => {
        return b.moment.isBefore(a.moment);
      }).map(f => f.fileName);

      // Process each file sequentially
      async.eachSeries(orderedFileList, async (fileName) => {
        return this.processExtract(fileName);
      }).then(actions.resolve).catch(actions.reject);
    });

    return promise;
  }

  // Upsert rows in the given file
  processExtract(fileName) {
    const baseDir = this.config.fileDropFolder;
    const filePath = path.join(baseDir, fileName);
    const ext = path.extname(fileName);
    const baseFileName = path.basename(fileName, ext);
    const processedPath = path.join(baseDir, `${baseFileName} - Processed${ext}`);
    const data = fs.readFileSync(filePath);

    const rows = csvjson.toObject(data.toString(), {
      delimiter: ',',
      quote: '"'
    });

    // Upsert all rows, then rename the file so it isn't processed twice
    return async.eachLimit(rows, 10, async (row) => {
      console.log(`Upserting ${row['EMP ID']}`);
      return this.models.Employee.upsert(row);
    }).then(() => {
      let actions = {};
      let promise = new Promise((resolve, reject) => {
        actions.resolve = resolve;
        actions.reject = reject;
      });

      fs.rename(filePath, processedPath, (err) => {
        if (err) {
          return actions.reject(err);
        } else {
          actions.resolve();
        }
      });

      return promise;
    });
  }
}

module.exports = Application;
