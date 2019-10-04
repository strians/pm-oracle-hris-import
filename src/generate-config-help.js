module.exports = (appName) => {
return `
No config files were found. Configuration is loaded from:
 1) Any file passed via --config argument
 2) Any .${appName}rc file found in local or parent directories
    * Note: not available for packaged binaries
 3) $HOME/.${appName}rc
 4) $HOME/.${appName}/config
 5) $HOME/.config/${appName}
 6) $HOME/.config/${appName}/config
 7) /etc/${appName}rc
 8) /etc/${appName}/config

Configurations are loaded in JSON or INI format.
Data is merged down; earlier configs override those that follow.

Example configuration (JSON):
  {
      "mssql": {
        "hostname": "<DB hostname>"
        "username": "<DB username>"
        "password": "<DB password>"
        "database": "<DB database name>"
        "table": "<DB master table name>"
      }
      "fileDropFolder": "\\\\storage1\\folder\\path"
    }

About configuration settings
 - mssql.*: Microsoft SQL Server connection info.
 - mssql.table: The master table where all data will be stored. Data is
                collected here via upsert by employee ID.
 - fileDropFolder: Where the nightly Oracle HRIS extracts will land.
`;
}
