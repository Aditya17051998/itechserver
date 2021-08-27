const { statusCode } = require("../../lib/constant");
const userModel = require("../../models/database/user");
const userProfileModel = require("../../models/database/userProfile");
const courseModel = require("../../models/database/course");
const emailHelper = require("../../lib/emailHelper");
const { reactAppUrl } = require("../../config");
const utils = require("../../lib/utils");
const {cleanUserData} = require("../../lib/utils");



const getAllStudents = () => new Promise((resolve, reject) => {
    try {
        userModel.find({ role: 0 })
            .then((userResult) => {
                console.log(userResult);
                const studentDetails = userResult.map((userData) => utils.cleanUserData(userData));
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

const getAllInstructors = () => new Promise((resolve, reject) => {
    try {
        userModel.find({ role: 1 })
            .then((userResult) => {
                console.log(userResult);
                const studentDetails = userResult.map((userData) => cleanUserData(userData));
                const successObj = {
                    status: 200,
                    message: "Successfully Fetched Instructors Details",
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

const validateGrantAcess = (body) => {
    if (!body.userId) { throw new Error("User ID not found") }
    return true;
}

const grantAccess = (body) => new Promise((resolve, reject) => {
    try {
        validateGrantAcess(body);
        userModel.findOne({ _id: body.userId })
            .then((userResult) => {
                if (!userResult) {
                    const errObj = {
                        status: statusCode.NotFound,
                        message: "User Not Found"
                    };
                    return reject(errObj);
                }
                const updateDeatils = {
                    isGranted: true
                };
                console.log(userResult);
                userModel.updateOne({ _id: userResult._id }, updateDeatils)
                    .then(() => {
                        const data = {
                            eamil: userResult.email,
                            subject: "Access Granted on Bhumi LMS",
                            html: `<h1>Now you can access your account on Bhumi LMS. Go to Account - ${reactAppUrl}</h1>`
                        }
                        emailHelper.notifyEmail(data)
                            .then((response) => {
                                const successObj = {
                                    status: statusCode.Success,
                                    message: "Granted Access Successfully"
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

const validateRegisterInstructor = (body) => {
    if (!body.name) { throw new Error("Name not found"); }
    if (!body.email) { throw new Error("Email not found"); }
    return true;
}

const prepareUser = (body) => {
    const nameArr = body.name.toLowerCase().split(' ');
    const publicKey = nameArr.join("-") + "-" + utils.generateRandomString(9);
    const password = utils.generateBcryptHash(body.password);
    const name = utils.toTitleCase(body.name);
    const userDetails = {
        name: name,
        email: body.email.toLowerCase(),
        password: password,
        publicKey: publicKey
    };

    return userDetails;
}

const registerInstructor = (body) => new Promise((resolve, reject) => {
    try {
        validateRegisterInstructor(body);
        userModel.findOne({ email: body.email.toLowerCase() })
            .then((userResult) => {
                if (userResult) {
                    reject({
                        status: 200,
                        message: "User already eists",
                    });
                }
                else {
                    body.password = utils.generateRandomString(8);
                    const userDetails = prepareUser(body);
                    userDetails.role = 1;
                    userDetails.isGranted = true;
                    userModel.addMultiple([userDetails])
                        .then((user) => {
                            const userProfileDetails = {
                                userId: user[0]._id,
                                name: user[0].name,
                                publicKey: user[0].publicKey,
                                email: user[0].email
                            };
                            userProfileModel.addMultiple([userProfileDetails])
                                .then((userProfile) => {
                                    const data = {
                                        email: user[0].email,
                                        subject: "Instructor Account created on Bhumi LMS",
                                        html: `<p>Now you can access your Instructor account on Bhumi LMS. Email -  ${user[0].email} Password - ${body.password} Go to Account - ${reactAppUrl}</p>`
                                    };
                                    emailHelper.notifyEmail(data)
                                        .then((response) => {
                                            if (response.status == 200) {
                                                const succesObj = {
                                                    status: statusCode.Success,
                                                    message: "User successfully registered and verification mail sent",
                                                    user: cleanUserData(user[0])
                                                };
                                                resolve(succesObj);
                                            }
                                            else {
                                                const succesObj = {
                                                    status: statusCode.Failure,
                                                    message: "User successfully registered and failed to send verification mail",
                                                    user: cleanUserData(user[0])
                                                };
                                                resolve(succesObj);
                                            }
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

    }
});

const registerStudent = (body) => new Promise((resolve, reject) => {
    try {
        validateRegisterInstructor(body);
        userModel.findOne({ email: body.email.toLowerCase() })
            .then((userResult) => {
                if (userResult) {
                    reject({
                        status: 200,
                        message: "User already eists",
                    });
                }
                else {
                    body.password = utils.generateRandomString(8);
                    const userDetails = prepareUser(body);
                    userDetails.role = 0;
                    userDetails.isGranted = true;
                    userModel.addMultiple([userDetails])
                        .then((user) => {
                            const userProfileDetails = {
                                userId: user[0]._id,
                                name: user[0].name,
                                publicKey: user[0].publicKey,
                                email: user[0].email
                            };
                            userProfileModel.addMultiple([userProfileDetails])
                                .then((userProfile) => {
                                    const data = {
                                        email: user[0].email,
                                        subject: "Student Account created on Bhumi LMS",
                                        html: `<p>Now you can access your Student account on Bhumi LMS. Email -  ${user[0].email} Password - ${body.password} Go to Account - ${reactAppUrl}</p>`
                                    };
                                    emailHelper.notifyEmail(data)
                                        .then((response) => {
                                            if (response.status == 200) {
                                                const succesObj = {
                                                    status: statusCode.Success,
                                                    message: "User successfully registered and verification mail sent",
                                                    user: cleanUserData(user[0])
                                                };
                                                resolve(succesObj);
                                            }
                                            else {
                                                const succesObj = {
                                                    status: statusCode.Failure,
                                                    message: "User successfully registered and failed to send verification mail",
                                                    user: cleanUserData(user[0])
                                                };
                                                resolve(succesObj);
                                            }
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

const validateUpdateUser = (body) => {
    if (!body.userId) { throw new Error("User ID not found"); }
    if (!body.name) { throw new Error("Name not found"); }
    if (!body.email) { throw new Error("Email not found"); }
    return true;
}

const updateUser = (body) => new Promise((resolve, reject) => {
    try {
        validateUpdateUser(body);
        userModel.findOne({ _id: body.userId })
            .then((user) => {
                if (user) {
                    const updateDetails = {
                        name: body.name,
                        email: body.email
                    };
                    userModel.updateOne({ _id: body.userId }, updateDetails)
                        .then(() => {
                            userProfileModel.update({ userId: body.userId }, updateDetails)
                                .then(() => {
                                    const successObj = {
                                        status: statusCode.Success,
                                        message: "User Details Updated Successfully"
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
                else {
                    const responseObj = {
                        status: statusCode.NotFound,
                        message: "User not found"
                    };
                    reject(responseObj);
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

const validateBlockUser = (body) => {
    if (!body.userId) { throw new Error("User ID not found"); }
    return true;
}

const blockUser = (body) => new Promise((resolve, reject) => {
    try {
        validateBlockUser(body);
        userModel.findOne({ _id: body.userId })
            .then((user) => {
                if (user) {
                    userModel.updateOne({ _id: body.userId }, { isBlocked: true })
                        .then(() => {
                            const successObj = {
                                status: statusCode.Success,
                                message: "Blocked User successfully"
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
                else {
                    const responseObj = {
                        status: statusCode.NotFound,
                        message: "User not found"
                    };
                    reject(responseObj);
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

const unblockUser = (body) => new Promise((resolve, reject) => {
    try {
        validateBlockUser(body);
        userModel.findOne({ _id: body.userId })
            .then((user) => {
                if (user) {
                    userModel.updateOne({ _id: body.userId }, { isBlocked: false })
                        .then(() => {
                            const successObj = {
                                status: statusCode.Success,
                                message: "Unblocked User successfully"
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
                else {
                    const responseObj = {
                        status: statusCode.NotFound,
                        message: "User not found"
                    };
                    reject(responseObj);
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

const resendCredentials = (body) => new Promise((resolve, reject) => {
    try {
        validateBlockUser(body);
        userModel.findOne({ _id: body.userId })
            .then((user) => {
                if (user) {
                    const plainPassword = utils.generateRandomString(8);
                    const password = utils.generateBcryptHash(plainPassword);
                    userModel.updateOne({ _id: body.userId }, { password: password })
                        .then(() => {
                            const data = {
                                email: user.email,
                                subject: "Account Credentials on Bhumi LMS",
                                html: `<p>Now you can access your account on Bhumi LMS. Email -  ${user.email} Password - ${body.password} Go to Account - ${reactAppUrl}</p>`
                            };
                            emailHelper.notifyEmail(data)
                                .then((response) => {
                                    if (response.status == 200) {
                                        const succesObj = {
                                            status: statusCode.Success,
                                            message: "Sent Credentials and verification mail sent",
                                            user: cleanUserData(user)
                                        };
                                        resolve(succesObj);
                                    }
                                    else {
                                        const succesObj = {
                                            status: statusCode.Failure,
                                            message: "Sent Credentials  and failed to send verification mail",
                                            user: cleanUserData(user)
                                        };
                                        resolve(succesObj);
                                    }
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
                else {
                    const responseObj = {
                        status: statusCode.NotFound,
                        message: "User not found"
                    };
                    reject(responseObj);
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

const getAllCourses = () => new Promise((resolve, reject) => {
    try {
        courseModel.find({})
            .then((courses) => {
                const successObj = {
                    status: statusCode.Success,
                    message: "Successfully fetched courses details",
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
    catch(error) {
        const errObj = {
            status: 422,
            message: error.message
        };
        reject(errObj);
    }
});

module.exports = {
    getAllStudents,
    getAllInstructors,
    grantAccess,
    registerInstructor,
    registerStudent,
    updateUser,
    blockUser,
    unblockUser,
    resendCredentials,
    getAllCourses
}