const { statusCode } = require("../../lib/constant");
const courseModel = require("../../models/database/course");
const sectionModel = require("../../models/database/section");
const lectureModel = require("../../models/database/lecture");
const emailHelper = require("../../lib/emailHelper");
const { reactAppUrl } = require("../../config");
const utils = require("../../lib/utils");

const createSection = (user, body, course) => new Promise((resolve, reject) => {
    try {
        utils.validateInput(String(body.number), "Section Number not found");
        utils.validateInput(body.title, "Section Title not found");

        const sectionDetails = {
            publicKey: utils.generateRandomString(9),
            courseId: course._id,
            number: body.number,
            title: body.title
        };

        if (course.author.userId != user._id) {
            const responseObj = {
                status: statusCode.Unauthorized,
                message: "Access Denied"
            };
            return reject(responseObj);
        }
        sectionModel.addMultiple([sectionDetails])
            .then((sections) => {
                courseModel.join({ _id: course._id }, { sections: sections[0]._id })
                    .then(() => {
                        const succesObj = {
                            status: statusCode.Success,
                            message: "Section Created Successfully",
                            data: sections[0]
                        };
                        resolve(succesObj);
                    })
                    .catch((error) => {
                        const errObj = {
                            status: 422,
                            message: error.message
                        };
                        reject(errObj);
                    });
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


const getAllSections = (user, course) => new Promise((resolve, reject) => {
    try {
        if (course.author.userId != user._id) {
            const responseObj = {
                status: statusCode.Unauthorized,
                message: "Access Denied"
            };
            return reject(responseObj);
        }

        sectionModel.find({ _id: course.sections })
            .then((sections) => {
                const successObj = {
                    status: statusCode.Success,
                    message: "Fetched Section Details Successfully",
                    data: sections
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

const updateSection = (body, user, course, section) => new Promise((resolve, reject) => {
    try {
        utils.validateInput(String(body.number), "Section Number not found");
        utils.validateInput(body.title, "Section Title not found");

        const sectionDetails = {
            number: body.number,
            title: body.title
        };

        if (course.author.userId != user._id) {
            const responseObj = {
                status: statusCode.Unauthorized,
                message: "Access Denied"
            };
            return reject(responseObj);
        }

        sectionModel.update({ _id: section._id }, sectionDetails)
            .then(() => {
                const successObj = {
                    status: statusCode.Success,
                    message: "Section Details Updated Successfully"
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

const deleteSection = (user, course, section) => new Promise((resolve, reject) => {
    try {
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

        sectionModel.del({ _id: section._id })
            .then(() => {
                courseModel.remove({ _id: course._id }, { sections: section._id })
                    .then(() => {
                        const successObj = {
                            status: statusCode.Success,
                            message: "Successfully Deleted Section"
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
    createSection,
    getAllSections,
    updateSection,
    deleteSection
}