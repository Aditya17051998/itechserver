const { statusCode } = require("../../lib/constant");
const sectionModel = require("../../models/database/section");
const assignmentModel = require("../../models/database/assignment");
const emailHelper = require("../../lib/emailHelper");
const { reactAppUrl } = require("../../config");
const utils = require("../../lib/utils");

const createAssignment = (body, user, course, section) => new Promise((resolve, reject) => {
    try {
        utils.validateInput(String(body.number), "Lecture Number not found");
        utils.validateInput(body.title, "Lecture Title not found");
        utils.validateInput(body.description, "Description not found");
        // utils.validateInput(body.media, "Media URL not found");
        utils.validateInput(body.startDate, "Start Date not found");
        utils.validateInput(body.endDate, "End Date not found");

        const assignmentDetails = {
            publicKey: utils.generateRandomString(9),
            courseId: course._id,
            sectionId: section._id,
            number: body.number,
            title: body.title,
            description: body.description,
            media: body.media,
            startDate: body.startDate,
            endDate: body.endDate
        };

        if (course.author.userId != user._id) {
            const responseObj = {
                status: statusCode.Unauthorized,
                message: "Access Denied"
            };
            return reject(responseObj);
        }

        if (!course.sections.includes(section._id)) {
            const responseObj = {
                status: statusCode.NotFound,
                message: "Section Not Found in Course"
            };
            return reject(responseObj);
        }

        assignmentModel.addMultiple([assignmentDetails])
            .then((assignments) => {
                sectionModel.join({ _id: section._id }, { assignments: assignments[0]._id })
                    .then(() => {
                        const successObj = {
                            status: statusCode.Success,
                            message: "Successfully Created Assignment",
                            data: assignments[0]
                        };
                        resolve(successObj);
                    })
                    .catch((error) => {
                        const errObj = {
                            status: 422,
                            message: error.message
                        };
                        reject(errObj);
                    })
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

const updateAssignment = (body, user, course, section, assignment) => new Promise((resolve, reject) => {
    try {
        utils.validateInput(String(body.number), "Lecture Number not found");
        utils.validateInput(body.title, "Lecture Title not found");
        utils.validateInput(body.description, "Description not found");
        utils.validateInput(body.startDate, "Start Date not found");
        utils.validateInput(body.endDate, "End Date not found");

        const assignmentDetails = {
            number: body.number,
            title: body.title,
            description: body.description,
            startDate: body.startDate,
            endDate: body.endDate
        };

        if (course.author.userId != user._id) {
            const responseObj = {
                status: statusCode.Unauthorized,
                message: "Access Denied"
            };
            return reject(responseObj);
        }

        if (!course.sections.includes(section._id)) {
            const responseObj = {
                status: statusCode.NotFound,
                message: "Section Not Found in Course"
            };
            return reject(responseObj);
        }

        if (!section.assignments.includes(assignment._id)) {
            const responseObj = {
                status: statusCode.NotFound,
                message: "Assignment Not Found in Section"
            };
            return reject(responseObj);
        }

        assignmentModel.update({ _id: assignment._id}, assignmentDetails)
            .then(() => {
                const successObj = {
                    status: statusCode.Success,
                    message: "Successfully Updated Assignment",
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
    createAssignment,
    updateAssignment
}