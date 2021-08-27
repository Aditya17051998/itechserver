const userModel = require("../../models/database/user");
const userProfileModel = require("../../models/database/userProfile");
const utils = require("../../lib/utils");
const emailHelper = require("../../lib/emailHelper");
const moment = require("moment");
const { statusCode } = require("../../lib/constant");

const emailVerification = (user) => new Promise((resolve, reject) => {
    const userUpdate = {
        verificationToken: utils.generateToken(),
        verificationExpires: moment().utc().add(6, "hours")
    };

    userModel.updateOne({ _id: user._id }, userUpdate)
        .then(() => {
            emailHelper.emailVerification({
                email: user.email,
                token: userUpdate.verificationToken
            })
                .then((response) => {
                    resolve(response);
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
        })
});

const formatUserModel = (user) => {
    delete user.password;
    delete user.__v;
    delete user.createdAt;
    delete user.updatedAt;
    delete user.verificationExpires;
    delete user.verificationToken;
    delete user.resetPasswordExpires;
    delete user.resetPasswordToken;
    return user;
};

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

const signUp = (body) => new Promise((resolve, reject) => {
    try {
        userModel.findOne({ email: body.email.toLowerCase() })
            .then((userResult) => {
                if (userResult) {
                    reject({
                        status: 200,
                        message: "User already exists",
                    });
                }
                else {
                    const userDetails = prepareUser(body);
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
                                    emailVerification(user[0])
                                        .then((response) => {
                                            if (response.status == 200) {
                                                const succesObj = {
                                                    status: statusCode.Success,
                                                    message: "User successfully registered and verification mail sent",
                                                    user: formatUserModel(user[0])
                                                };
                                                resolve(succesObj);
                                            }
                                            else {
                                                const succesObj = {
                                                    status: statusCode.Failure,
                                                    message: "User successfully registered and failed to send verification mail",
                                                    user: formatUserModel(user[0])
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

const validateSigInData = (body, user) => {
    if (!user) {
        throw new Error("Invalid email id");
    }
    if (!utils.compareHash(body.password.trim(), user.password)) {
        throw new Error("Invalid password");
    }
    if (user.isBlocked) {
        throw new Error("User is Blocked");
    }
    if (!user.isVerified) {
        throw new Error("User Not Verified");
    }
    if (!user.isGranted) {
        throw new Error("User Not Granted Access");
    }
    return true;
};



const signIn = (body) => new Promise((resolve, reject) => {
    try {
        console.log("body " + body.email);
        console.log("body " + body.password);
        userModel.findOne({ email: body.email.toLowerCase() })
            .then((user) => {
                
                // validateSigInData(body, user);
                // user = formatUserModel(user);
                console.log("use find",user)
                resolve(user);
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

const verifyEmail = (body) => new Promise((resolve, reject) => {
    try {
        userModel.findOne({
            verificationToken: body.token,
            verificationExpires: { $gt: moment().utc() }
        })
            .then((userResult) => {
                if (userResult) {
                    const userUpdate = {
                        isVerified: true,
                        verificationToken: null,
                        verificationExpires: null
                    };
                    userModel.updateOne({ _id: userResult._id }, userUpdate)
                        .then(() => {
                            const success = {
                                status: statusCode.Success,
                                message: "Successfully email verified",
                            };
                            resolve(success);
                        })
                        .catch((error) => {
                            const errObj = {
                                status: 422,
                                message: error.message
                            };
                            reject(errObj);
                        })
                }
                else {
                    const error = {
                        status: statusCode.InvalidData,
                        message: "email verification token is invalid or has expired.",
                    };
                    reject(error);
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

const resendVerification = (body) => new Promise((resolve, reject) => {
    try {
        userModel.findOne({ email: body.email })
            .then((user) => {
                if (user) {
                    if (user.isVerified) {
                        const error = {
                            status: statusCode.BadRequest,
                            message: "User Already Verified",
                        };
                        reject(error);
                    }
                    else {
                        emailVerification(user)
                            .then((response) => {
                                if (response.status == 200) {
                                    const succesObj = {
                                        status: statusCode.Success,
                                        message: "verification mail sent",
                                    };
                                    resolve(succesObj);
                                }
                                else {
                                    const succesObj = {
                                        status: statusCode.Failure,
                                        message: "failed to send verification mail",
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
                    }
                }
                else {
                    const error = {
                        status: statusCode.NotFound,
                        message: "Email Not Found",
                    };
                    reject(error);
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

const recoverPassword = (body) => new Promise((resolve, reject) => {
    try {
        userModel.findOne({ email: body.email })
            .then((user) => {
                if (user) {
                    const userUpdate = {
                        resetPasswordToken: utils.generateToken(),
                        resetPasswordExpires: moment().utc().add(6, "hours"),
                    };
                    userModel.updateOne({ _id: user._id }, userUpdate)
                        .then((resposne) => {
                            emailHelper.passwordRecoveryEmail({
                                email: user.email,
                                token: userUpdate.resetPasswordToken
                            })
                                .then((response) => {
                                    if (response.status == 200) {
                                        const succesObj = {
                                            status: statusCode.Success,
                                            message: "Recover Password Mail Sent Successfully",
                                        };
                                        resolve(succesObj);
                                    }
                                    else {
                                        const succesObj = {
                                            status: statusCode.Failure,
                                            message: "Failed to send Recover Password Mail",
                                        };
                                        resolve(succesObj);
                                    }
                                })
                        })
                        .catch((error) => {
                            const errObj = {
                                status: 422,
                                message: error.message
                            };
                            reject(errObj);
                        })
                }
                else {
                    const error = {
                        status: statusCode.NotFound,
                        message: "Email Not Found",
                    };
                    reject(error);
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

const resetPassword = (body) => new Promise((resolve, reject) => {
    try {
        userModel.findOne({ resetPasswordToken: body.token, resetPasswordExpires: { $gt: moment().utc() } })
            .then((user) => {
                console.log(user);
                if (user) {
                    const userUpdate = {
                        password: utils.generateBcryptHash(body.password),
                        resetPasswordToken: null,
                        resetPasswordExpires: null
                    };
                    userModel.updateOne({ _id: user._id }, userUpdate)
                        .then(() => {
                            const success = {
                                status: statusCode.Success,
                                message: 'Successfully password reset'
                            }
                            resolve(success);
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
                    const error = {
                        status: statusCode.InvalidData,
                        message: 'Password reset token is invalid or has expired.'
                    };
                    reject(error);
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

const validateToken = (body) => new Promise((resolve, reject) => {
    try {
        userModel.findOne({ resetPasswordToken: body.token, resetPasswordExpires: { $gt: moment().utc() } })
            .then((user) => {
                if (user) {
                    const success = {
                        status: 200,
                        message: 'Reset password token is valid'
                    };
                    resolve(success);
                }
                else {
                    const error = {
                        status: 401,
                        message: 'Password reset token is invalid or has expired.'
                    };
                    reject(error);
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

const changePassword = (body) => new Promise((resolve, reject) => {
    try {
        userModel.findOne({ _id: body.user._id })
            .then((user) => {
                if (user) {
                    if (utils.compareHash(body.currentPassword.trim(), user.password)) {
                        userModel.updateOne({ _id: user._id }, { password: utils.generateBcryptHash(body.newPassword) })
                            .then(() => {
                                const success = {
                                    status: statusCode.Success,
                                    message: 'Password changed successfully'
                                };
                                resolve(success);
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
                        const fail = {
                            status: statusCode.InvalidData,
                            message: 'Current password is incorrect'
                        };
                        reject(fail);
                    }
                }
                else {
                    const error = {
                        status: statusCode.NotFound,
                        message: "User Not Found",
                    };
                    reject(error);
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

module.exports = {
    signUp,
    signIn,
    verifyEmail,
    resendVerification,
    recoverPassword,
    resetPassword,
    validateToken,
    changePassword
};