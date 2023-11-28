const Sequelize = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: "https://techtechblog-90c849bea5c5.herokuapp.com/",
      dialect: "mysql",
      dialectOptions: {
        decimalNumbers: true,
      },
    }
  );
}

module.exports = sequelize;