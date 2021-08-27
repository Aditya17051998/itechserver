const { statusCode } = require("../../lib/constant");
const courseModel = require("../../models/database/course");
const sectionModel = require("../../models/database/section");
const lectureModel = require("../../models/database/lecture");
const emailHelper = require("../../lib/emailHelper");
const { reactAppUrl } = require("../../config");
const utils = require("../../lib/utils");

const createLecture = (body, user, course, section) => new Promise((resolve, reject) => {
    try {
        utils.validateInput(String(body.number), "Lecture Number not found");
        utils.validateInput(body.title, "Lecture Title not found");
        utils.validateInput(body.description, "Description not found");
        utils.validateInput(body.image, "Image URL not found");
        utils.validateInput(body.video, "Video URL not found");
        utils.validateInput(body.file, "File URL not found");

        const lectureDetails = {
            publicKey: utils.generateRandomString(9),
            courseId: course._id,
            sectionId: section._id,
            number: body.number,
            title: body.title,
            description: body.description,
            image: body.image,
            video: body.video,
            file: body.file
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

        lectureModel.addMultiple([lectureDetails])
            .then((lectures) => {
                sectionModel.join({ _id: section._id }, { lectures: lectures[0]._id })
                    .then(() => {
                        const successObj = {
                            status: statusCode.Success,
                            message: "Successfully Created Lecture",
                            data: lectures[0]
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

const updateLecture = (body, user, course, section, lecture) => new Promise((resolve, reject) => {
    try {
        utils.validateInput(String(body.number), "Lecture Number not found");
        utils.validateInput(body.title, "Lecture Title not found");
        utils.validateInput(body.description, "Description not found");
        utils.validateInput(body.image, "Image URL not found");
        utils.validateInput(body.video, "Video URL not found");
        utils.validateInput(body.file, "File URL not found");

        const lectureDetails = {
            number: body.number,
            title: body.title,
            description: body.description,
            image: body.image,
            video: body.video,
            file: body.file
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

        if (!section.lectures.includes(lecture._id)) {
            const responseObj = {
                status: statusCode.NotFound,
                message: "Lecture Not Found in Section"
            };
            return reject(responseObj);
        }

        lectureModel.update({ _id: lecture._id }, lectureDetails)
            .then(() => {
                const successObj = {
                    status: statusCode.Success,
                    message: "Successfully Updated Lecture"
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

const getAllLectures = (user, course, section) => new Promise((resolve, reject) => {
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
        lectureModel.find({ _id: section.lectures })
            .then((lectures) => {
                const successObj = {
                    status: statusCode.Success,
                    message: "Successfully fetched Lectures",
                    data: lectures
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

const deleteLecture = (user, course, section, lecture) => new Promise((resolve, reject) => {
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

        if (!section.lectures.includes(lecture._id)) {
            const responseObj = {
                status: statusCode.NotFound,
                message: "Lecture Not Found in Section"
            };
            return reject(responseObj);
        }

        lectureModel.del({ _id: lecture._id })
            .then(() => {
                sectionModel.remove({ _id: section._id }, { lectures: lecture._id })
                    .then(() => {
                        const successObj = {
                            status: statusCode.Success,
                            message: "Successfully Deleted Lecture"
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
    createLecture,
    updateLecture,
    getAllLectures,
    deleteLecture,
}