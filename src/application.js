// Require tedious so it is included in pkg build
require('tedious');

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const rc = require('rc');
const async = require('async');
const moment = require('moment');

const generateConfigHelp = require('./generate-config-help.js');
const models = require('./models.js');

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

    return this.processConfigs();
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
      let fileList = list.filter(file => {
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

      // Sort files by timestamp in name
      fileList = fileList.map(f => {
        let match = f.match(fileRegexp);

        let m = moment(match[1], 'YYYYMMDDHHmmss');

        return {
          moment: m,
          fileName: f
        };
      }).sort((a, b) => {
        return b.moment.isBefore(a.moment);
      }).map(f => f.fileName);

      async.eachSeries(fileList, async (fileName) => {
        return this.processExtract(fileName);
      }).then(actions.resolve).catch(actions.reject);
    });

    return promise;
  }

  processExtract(fileName) {
    const baseDir = this.config.fileDropFolder;
    const filePath = path.join(baseDir, fileName);

    console.log(`Processing ${filePath}`);

    return Promise.resolve();
  }
}

module.exports = Application;
