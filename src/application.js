// Require tedious so it is included in pkg build
require('tedious');

const Sequelize = require('sequelize');
const rc = require('rc');

const generateConfigHelp = require('./generate-config-help.js');

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
    // stub
    return Promise.resolve();
  }
}

module.exports = Application;
