const seneca = require("seneca");
const config = require("../../config/index");

const databaseSenecaClient = seneca({
  timeout: config.databaseMicroService.timeout,
}).client(config.databaseMicroService);

const find = (userProfileQueries) =>
  new Promise((resolve, reject) => {
    databaseSenecaClient.act(
      {
        role: "userProfile",
        cmd: "find",
        userProfileQueries,
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

const findAll = (userProfileQueries) =>
  new Promise((resolve, reject) => {
    databaseSenecaClient.act(
      {
        role: "userProfile",
        cmd: "findAll",
        userProfileQueries,
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

const findOne = (userProfileQueries) =>
  new Promise((resolve, reject) => {
    databaseSenecaClient.act(
      {
        role: "userProfile",
        cmd: "findOne",
        userProfileQueries,
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

const addMultiple = (userProfileDetails) =>
  new Promise((resolve, reject) => {
    databaseSenecaClient.act(
      {
        role: "userProfile",
        cmd: "addMultiple",
        userProfileDetails,
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

const update = (userProfileQueries, userProfileDetails) =>
  new Promise((resolve, reject) => {
    databaseSenecaClient.act(
      {
        role: "userProfile",
        cmd: "update",
        userProfileQueries,
        userProfileDetails,
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

const join = (userProfileQueries, userProfileDetails) =>
  new Promise((resolve, reject) => {
    databaseSenecaClient.act(
      {
        role: "userProfile",
        cmd: "join",
        userProfileQueries,
        userProfileDetails,
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

const remove = (userProfileQueries, userProfileDetails) =>
  new Promise((resolve, reject) => {
    databaseSenecaClient.act(
      {
        role: "userProfile",
        cmd: "remove",
        userProfileQueries,
        userProfileDetails,
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
  addMultiple,
  findOne,
  update,
  join,
  remove,
  findAll,
};
