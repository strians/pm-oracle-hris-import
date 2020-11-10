const Sequelize = require('sequelize');

module.exports = {
  load: (sequelize, config) => {
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
      },
      'Legal Entity': {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      'Facility Code': {
        type: Sequelize.STRING(20),
        allowNull: false
      }
    }, {
      timestamps: true,
      createdAt: 'Created At',
      updatedAt: 'Updated At'
    });

    return {
      Employee
    };
  }
};
