const { statusCode } = require("../../lib/constant");
const userModel = require("../../models/database/user");
const userProfileModel = require("../../models/database/userProfile");
const courseModel = require("../../models/database/course");
const sectionModel = require("../../models/database/section");
const lectureModel = require("../../models/database/lecture");
const emailHelper = require("../../lib/emailHelper");
const { reactAppUrl } = require("../../config");
const utils = require("../../lib/utils");

const createCourse = (body, user, userProfile) => new Promise((resolve, reject) => {
    try {
        utils.validateInput(body.title, "Title not found");
        utils.validateInput(body.description, "Description not found");
        utils.validateInput(body.outline, "Outline not found");
        utils.validateInput(body.duration, "Duration not found");
        utils.validateInput(body.category, "Category not found");
        utils.validateInput(body.courseCode, "Course Code not found");
        const courseDeatils = {
            title: body.title,
            description: body.description,
            outline: body.outline,
            duration: body.duration,
            category: body.category,
            courseCode: body.courseCode,
            author: {
                userId: user._id,
                publicKey: user.publicKey,
                userProfile: userProfile._id
            },
            publicKey: utils.generateRandomString(9)
        };
        courseModel.addMultiple([courseDeatils])
            .then((courses) => {
                userProfileModel.join({ _id: userProfile._id }, { courses: courses[0]._id })
                    .then(() => {
                        const successObj = {
                            status: statusCode.Success,
                            message: "Course created successfully",
                            data: courses[0]
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

const updateCourse = (body, user, course) => new Promise((resolve, reject) => {
    try {
        utils.validateInput(body.title, "Title not found");
        utils.validateInput(body.description, "Description not found");
        utils.validateInput(body.outline, "Outline not found");
        utils.validateInput(body.duration, "Duration not found");
        utils.validateInput(body.category, "Category not found");
        if (course.author.userId != user._id) {
            const responseObj = {
                status: statusCode.Unauthorized,
                message: "Access Denied"
            };
            return reject(responseObj);
        }
        const updateDetails = {
            title: body.title,
            description: body.description,
            outline: body.outline,
            duration: body.duration,
            category: body.category
        };
        courseModel.update({ _id: course._id }, updateDetails)
            .then(() => {
                const successObj = {
                    status: statusCode.Success,
                    message: "Updated Course Details Succesfully"
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

const enrollStudent = (body, course) => new Promise((resolve, reject) => {
    try {
        utils.validateInput(body.userId, "User ID not found");
        userModel.findOne({ _id: body.userId })
            .then((user) => {
                if (!user) {
                    const responseObj = {
                        status: statusCode.NotFound,
                        message: "User Not Found"
                    };
                    reject(responseObj);
                }
                else {
                    userProfileModel.findOne({ userId: body.userId })
                        .then((userProfile) => {
                            if (!userProfile) {
                                const responseObj = {
                                    status: statusCode.NotFound,
                                    message: "User Profile Not Found"
                                };
                                reject(responseObj);
                            }
                            else {
                                if (course.students.includes(user._id)) {
                                    const responseObj = {
                                        status: statusCode.BadRequest,
                                        message: "Already Enrolled"
                                    };
                                    reject(responseObj);
                                }
                                else {
                                    courseModel.join({ _id: course._id }, { students: user._id })
                                        .then(() => {
                                            userProfileModel.join({ _id: userProfile._id }, { enrolledCourses: course._id })
                                                .then(() => {
                                                    const successObj = {
                                                        status: statusCode.Success,
                                                        message: "User Enrolled in Course Successfully"
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
                            }
                        })
                        .catch((error) => {
                            const errObj = {
                                status: 422,
                                message: error.message
                            };
                            reject(errObj);
                        });
                }
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

const unenrollStudent = (body, course) => new Promise((resolve, reject) => {
    try {
        // validateEnrollStudent(body);
        utils.validateInput(body.userId, "User ID not found");
        userModel.findOne({ _id: body.userId })
            .then((user) => {
                if (!user) {
                    const responseObj = {
                        status: statusCode.NotFound,
                        message: "User Not Found"
                    };
                    reject(responseObj);
                }
                else {
                    userProfileModel.findOne({ userId: body.userId })
                        .then((userProfile) => {
                            if (!userProfile) {
                                const responseObj = {
                                    status: statusCode.NotFound,
                                    message: "User Profile Not Found"
                                };
                                reject(responseObj);
                            }
                            else {
                                if (!course.students.includes(user._id)) {
                                    const responseObj = {
                                        status: statusCode.BadRequest,
                                        message: "Not Enrolled"
                                    };
                                    reject(responseObj);
                                }
                                else {
                                    courseModel.remove({ _id: course._id }, { students: user._id })
                                        .then(() => {
                                            userProfileModel.remove({ _id: userProfile._id }, { enrolledCourses: course._id })
                                                .then(() => {
                                                    const successObj = {
                                                        status: statusCode.Success,
                                                        message: "User Unenrolled in Course Successfully"
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
                            }
                        })
                        .catch((error) => {
                            const errObj = {
                                status: 422,
                                message: error.message
                            };
                            reject(errObj);
                        });
                }
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

const getAllStudents = (user, course) => new Promise((resolve, reject) => {
    try {
        if (course.author.userId != user._id) {
            const responseObj = {
                status: statusCode.Unauthorized,
                message: "Access Denied"
            };
            return reject(responseObj);
        }
        userModel.find({ _id: course.students })
            .then((users) => {
                if (users) {
                    console.log("yes");
                }
                const studentDetails = users.map((userData) => utils.cleanUserData(userData));
                const successObj = {
                    status: 200,
                    message: "Successfully Fetched Students Details",
                    data: studentDetails
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

const deleteCourse = (user, course) => new Promise((resolve, reject) => {
    try {
        if (course.author.userId != user._id) {
            const responseObj = {
                status: statusCode.Unauthorized,
                message: "Access Denied"
            };
            return reject(responseObj);
        }

        courseModel.del({ _id: course._id })
            .then(() => {
                userProfileModel.remove({}, { courses: course._id })
                    .then(() => {
                        const successObj = {
                            status: statusCode.Success,
                            message: "Successfully Deleted Course"
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

const getAllCourses = (userProfile) => new Promise((resolve, reject) => {
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

const getSingleCourse = (user, publicKey) => new Promise((resolve, reject) => {
    try {

        utils.validateInput(publicKey, "Public Key of course not found");
        courseModel.findOne({ publicKey: publicKey })
            .then((course) => {

                if (course) {
                    if (course.author.userId != user._id) {
                        const responseObj = {
                            status: statusCode.Unauthorized,
                            message: "Access Denied"
                        };
                        return reject(responseObj);
                    }
                    const successObj = {
                        status: statusCode.Success,
                        message: "Successfully Fetched Course Details",
                        data: course
                    };
                    resolve(successObj);
                }
                else {
                    const errObj = {
                        status: 404,
                        message: "Course Not Found"
                    };
                    reject(errObj);
                }
            })
            .catch((error) => {
                const errObj = {
                    status: 422,
                    message: error.message
                };
                reject(errObj);
            })
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
    createCourse,
    enrollStudent,
    unenrollStudent,
    getAllStudents,
    updateCourse,
    deleteCourse,
    getAllCourses,
    getSingleCourse
}