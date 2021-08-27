const seneca = require('seneca');
const config = require('../../config/index');

const databaseSenecaClient = seneca({ timeout: config.databaseMicroService.timeout })
    .client(config.databaseMicroService);

const find = (sectionQueries) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'section',
        cmd: 'find',
        sectionQueries
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const findOne = (sectionQueries) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'section',
        cmd: 'findOne',
        sectionQueries
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const addMultiple = (sectionDetails) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'section',
        cmd: 'addMultiple',
        sectionDetails
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const update = (sectionQueries, sectionDetails) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'section',
        cmd: 'update',
        sectionQueries,
        sectionDetails
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const join = (sectionQueries, sectionDetails) => new Promise((resolve, reject) => {

    databaseSenecaClient.act({
        role: 'section',
        cmd: 'join',
        sectionQueries,
        sectionDetails
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const remove = (sectionQueries, sectionDetails) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'section',
        cmd: 'remove',
        sectionQueries,
        sectionDetails
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const del = (sectionQueries) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'section',
        cmd: 'del',
        sectionQueries
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