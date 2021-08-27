const { statusCode } = require('./constant');
const userProfileModel = require("../models/database/userProfile");
const courseModel = require("../models/database/course");
const sectionModel = require("../models/database/section");
const lectureModel = require("../models/database/lecture");
const assignmentModel = require("../models/database/assignment");

//Authenticate if the user is logged in or not,
/* Since this is going to be a middleware , so if the user is logged in then we move to the next function
else we return an error */
const isAuthenticated = (req, res, next) => {

    if (req.user) {
        next();
    }
    else {
        res.status(statusCode.Unauthorized).json({ status: statusCode.InvalidData, message: "User is not signed in" })
    }

};

const isAdmin = (req, res, next) => {

    if (req.user.role == 2) {
        next();
    }
    else {
        res.status(statusCode.Unauthorized).json({ status: statusCode.Unauthorized, message: "Access Denied" });
    }

};

const isInstructor = (req, res, next) => {

    if (req.user.role == 1) {
        next();
    }
    else {
        res.status(statusCode.Unauthorized).json({ status: statusCode.Unauthorized, message: "Access Denied" });
    }

};

const isStudent = (req, res, next) => {

    if (req.user.role == 0) {
        next();
    }
    else {
        res.status(statusCode.Unauthorized).json({ status: statusCode.Unauthorized, message: "Access Denied" });
    }

};

const isAdminOrInstructor = (req, res, next) => {

    if (req.user.role == 2 || req.user.role ==1) {
        next();
    }
    else {
        res.status(statusCode.Unauthorized).json({ status: statusCode.Unauthorized, message: "Access Denied" });
    }

};

/*This middleware connects the userProfile information to the req.userProfile object which is 
sent to the frontend for less computational purpose*/
const getUserProfileDetails = (req, res, next) => {
    userProfileModel.findOne({ userId: req.user._id })
        .then((userProfile) => {
            if (userProfile) {
                req.userProfile = userProfile;
                next();
            }
            else {
                const errorObj = {
                    status: statusCode.NotFound,
                    message: "User not available"
                }

                res.status(statusCode.NotFound).json(errObj);
            }
        })
        .catch((error) => {
            const errObj = {
                status: statusCode.InvalidData,
                message: error.message,
            }

            res.status(statusCode.InvalidData).json(errObj);
        })

}

const getCourseDetails = (req, res, next) => {
    courseModel.findOne({ _id: req.params.courseId })
        .then((course) => {
            if (course) {
                req.course = course;
                next();
            }
            else {
                const errorObj = {
                    status: statusCode.NotFound,
                    message: "Course not found"
                }

                res.status(statusCode.NotFound).json(errorObj);
            }
        })
        .catch((error) => {
            const errObj = {
                status: statusCode.InvalidData,
                message: error.message,
            }

            res.status(statusCode.InvalidData).json(errObj);
        })

}

const getSectionDetails = (req, res, next) => {
    sectionModel.findOne({ _id: req.params.sectionId })
        .then((section) => {
            if (section) {
                req.section = section;
                next();
            }
            else {
                const errorObj = {
                    status: statusCode.NotFound,
                    message: "Section not found"
                }

                res.status(statusCode.NotFound).json(errorObj);
            }
        })
        .catch((error) => {
            const errObj = {
                status: statusCode.InvalidData,
                message: error.message,
            }

            res.status(statusCode.InvalidData).json(errObj);
        })

}

const getLectureDetails = (req, res, next) => {
    lectureModel.findOne({ _id: req.params.lectureId })
        .then((lecture) => {
            if (lecture) {
                req.lecture = lecture;
                next();
            }
            else {
                const errorObj = {
                    status: statusCode.NotFound,
                    message: "Lecture not found"
                }

                res.status(statusCode.NotFound).json(errorObj);
            }
        })
        .catch((error) => {
            const errObj = {
                status: statusCode.InvalidData,
                message: error.message,
            }

            res.status(statusCode.InvalidData).json(errObj);
        })

}

const getAssignmentDetails = (req, res, next) => {
    assignmentModel.findOne({ _id: req.params.assignmentId })
        .then((assignment) => {
            if (assignment) {
                req.assignment = assignment;
                next();
            }
            else {
                const errorObj = {
                    status: statusCode.NotFound,
                    message: "Assignment not found"
                }

                res.status(statusCode.NotFound).json(errorObj);
            }
        })
        .catch((error) => {
            const errObj = {
                status: statusCode.InvalidData,
                message: error.message,
            }

            res.status(statusCode.InvalidData).json(errObj);
        })

}

module.exports = {
    isAuthenticated,
    getUserProfileDetails,
    isAdmin,
    isInstructor,
    getCourseDetails,
    getSectionDetails,
    getLectureDetails,
    isStudent,
    getAssignmentDetails,
    isAdminOrInstructor
};




