const { statusCode } = require("../../lib/constant");
const userModel = require("../../models/database/user");
const userProfileModel = require("../../models/database/userProfile");
const courseModel = require("../../models/database/course");
const sectionModel = require("../../models/database/section");
const lectureModel = require("../../models/database/lecture");
const emailHelper = require("../../lib/emailHelper");
const { reactAppUrl } = require("../../config");
const utils = require("../../lib/utils");

const getEnrolledCourses = (userProfile) => new Promise((resolve, reject) => {
    try {
        courseModel.find({ _id: userProfile.courses })
            .then((courses) => {
                const successObj = {
                    status: statusCode.Success,
                    message: "Successfully Fetched Course Details",
                    data: courses
                };
                resolve(successObj);
            })
            .catch((error) => {
                const errObj = {
                    status: 422,
                    message: error.message
                };
                reject(errObj);
            });
    }
    catch (error) {
        const errObj = {
            status: 422,
            message: error.message
        };
        reject(errObj);
    }
});

module.exports = {
    getEnrolledCourses
}