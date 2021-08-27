require("dotenv").config({ path: ".env" });

const config = {};
config.sessionTimeoutTime = 1800;

config.databaseMicroService = {
  type: "tcp",
  port: process.env.DB_MICROSERVICE_PORT,
  host: "localhost",
  protocol: "http",
  timeout: 180000,
};

config.dbDetails = {
  host: "localhost",
  jestDBName: "jestDB",
  port: 27017,
};
config.appUrl = `${process.env.APP_PROTOCOL}://${process.env.APP_HOST}:${process.env.APP_PORT}`;
config.reactAppUrl = process.env.REACT_APP_URL;

config.batchSize = 200;

module.exports = config;
