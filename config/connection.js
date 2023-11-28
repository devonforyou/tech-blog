const Sequelize = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(
    process.env.qo0t9vacnffdkn39,
    process.env.yvs8mt6wj5nz2qv9,
    process.env.ypm0fx66k5jmsx0s,
    {
      host: "wcwimj6zu5aaddlj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      dialect: "mysql",
      dialectOptions: {
        decimalNumbers: true,
      },
    }
  );
}

module.exports = sequelize;