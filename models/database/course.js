const seneca = require('seneca');
const config = require('../../config/index');

const databaseSenecaClient = seneca({ timeout: config.databaseMicroService.timeout })
    .client(config.databaseMicroService);

const find = (courseQueries) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'course',
        cmd: 'find',
        courseQueries
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const findOne = (courseQueries) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'course',
        cmd: 'findOne',
        courseQueries
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const addMultiple = (courseDetails) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'course',
        cmd: 'addMultiple',
        courseDetails
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const update = (courseQueries, courseDetails) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'course',
        cmd: 'update',
        courseQueries,
        courseDetails
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const join = (courseQueries, courseDetails) => new Promise((resolve, reject) => {

    databaseSenecaClient.act({
        role: 'course',
        cmd: 'join',
        courseQueries,
        courseDetails
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const remove = (courseQueries, courseDetails) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'course',
        cmd: 'remove',
        courseQueries,
        courseDetails
    }, (err, res) => {
        if(err) {
            reject(err);
        }
        else {
            resolve(res);
        }
    });
});

const del = (courseQueries) => new Promise((resolve, reject) => {
    databaseSenecaClient.act({
        role: 'course',
        cmd: 'del',
        courseQueries
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