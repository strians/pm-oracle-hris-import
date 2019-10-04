const Sequelize = require('sequelize');

module.exports = {
  load: (sequelize, config) => {
    const Import = sequelize.define(`${config.mssql.table} - Import`, {
      'File Name': {
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: `${config.mssql.table}-Import-FileNameIndex`
      },
      'Successful': {
        type: Sequelize.STRING(1),
        allowNull: false
      },
      'Status Description': {
        type: Sequelize.STRING(1000),
        allowNull: false
      },
      'Rows Processed': {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      'Active Employees': {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      'Term Employees': {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    }, {
      timestamps: true,
      createdAt: 'Created At',
      updatedAt: null
    });

    const Employee = sequelize.define(`${config.mssql.table} - Employee`, {
      'Last Name': {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      'First Name': {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      'EMP ID': {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: `${config.mssql.table}-Employee-EMPIDIndex`
      },
      'Social Security Number': {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      'Department ID': {
        type: Sequelize.STRING(80),
        allowNull: false
      },
      'Status': {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      'Department Name': {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      'Hire Date': {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      'Term Date': {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      'BusinessUnit': {
        type: Sequelize.STRING(30),
        allowNull: false
      }
    }, {
      timestamps: true,
      createdAt: 'Created At',
      updatedAt: 'Updated At'
    });

    return {
      Import,
      Employee
    };
  }
};
