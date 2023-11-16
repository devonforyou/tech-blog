const express = require("express");
const { engine } = require("express-handlebars");
const sequelize = require("./config/connection");
const routes = require("./controllers");
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { extendDefaultFields } = require("./models/Session");

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
app.engine("handlebars", engine({}));
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// Set up sessions with cookies
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
    table: 'Session',
    extendDefaultFields: extendDefaultFields,
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // expires after 1 day
  },
  checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
}));

// Set up Express.js to parse data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.use(routes);

// Start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
});