const seneca = require('seneca');
const config = require('../../config/index');

const databaseSenecaClient = seneca({ timeout: config.databaseMicroService.timeout })
    .client(config.databaseMicroService);

const find = (lectureQueries) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'lecture',
        cmd: 'find',
        lectureQueries
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const findOne = (lectureQueries) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'lecture',
        cmd: 'findOne',
        lectureQueries
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const addMultiple = (lectureDetails) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'lecture',
        cmd: 'addMultiple',
        lectureDetails
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const update = (lectureQueries, lectureDetails) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'lecture',
        cmd: 'update',
        lectureQueries,
        lectureDetails
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const join = (lectureQueries, lectureDetails) => new Promise((resolve, reject) => {

    databaseSenecaClient.act({
        role: 'lecture',
        cmd: 'join',
        lectureQueries,
        lectureDetails
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const remove = (lectureQueries, lectureDetails) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'lecture',
        cmd: 'remove',
        lectureQueries,
        lectureDetails
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const del = (lectureQueries) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'lecture',
        cmd: 'del',
        lectureQueries
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

module.exports = {
    find,
    addMultiple,
    findOne,
    update,
    remove,
    join,
    del,
}