const seneca = require("seneca");
const config = require("../../config/index");

const databaseSenecaClient = seneca({
  timeout: config.databaseMicroService.timeout,
}).client(config.databaseMicroService);

const addMultiple = (userDetails) =>
  new Promise((resolve, reject) => {
    databaseSenecaClient.act(
      {
        role: "user",
        cmd: "addMultiple",
        userDetails,
      },
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });

const find = (userQueries) =>
  new Promise((resolve, reject) => {
    databaseSenecaClient.act(
      {
        role: "user",
        cmd: "find",
        userQueries,
      },
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });

const findOne = (userQueries) =>
  new Promise((resolve, reject) => {
    databaseSenecaClient.act(
      {
        role: "user",
        cmd: "findOne",
        userQueries,
      },
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });

const findAll = (userQueries) =>
  new Promise((resolve, reject) => {
    databaseSenecaClient.act(
      {
        role: "user",
        cmd: "findAll",
        userQueries,
      },
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });

const updateOne = (userQueries, userDetails) =>
  new Promise((resolve, reject) => {
    databaseSenecaClient.act(
      {
        role: "user",
        cmd: "updateOne",
        userQueries,
        userDetails,
      },
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });

module.exports = {
  find,
  findOne,
  findAll,
  updateOne,
  addMultiple,
};
