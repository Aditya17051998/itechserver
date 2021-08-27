const seneca = require('seneca');
const config = require('../../config/index');

const databaseSenecaClient = seneca({ timeout: config.databaseMicroService.timeout })
    .client(config.databaseMicroService);

const find = (assignmentQueries) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'assignment',
        cmd: 'find',
        assignmentQueries
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const findOne = (assignmentQueries) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'assignment',
        cmd: 'findOne',
        assignmentQueries
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const addMultiple = (assignmentDetails) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'assignment',
        cmd: 'addMultiple',
        assignmentDetails
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const update = (assignmentQueries, assignmentDetails) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'assignment',
        cmd: 'update',
        assignmentQueries,
        assignmentDetails
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const join = (assignmentQueries, assignmentDetails) => new Promise((resolve, reject) => {

    databaseSenecaClient.act({
        role: 'assignment',
        cmd: 'join',
        assignmentQueries,
        assignmentDetails
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const remove = (assignmentQueries, assignmentDetails) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'assignment',
        cmd: 'remove',
        assignmentQueries,
        assignmentDetails
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const del = (assignmentQueries) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'assignment',
        cmd: 'del',
        assignmentQueries
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