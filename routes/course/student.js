var express = require("express");
var router = express.Router();
const courseCtrl = require("../../controllers/course/index");
const courseStudentCtrl = require("../../controllers/course/student");
const { isAuthenticated, isStudent, getUserProfileDetails, getCourseDetails, getSectionDetails, getLectureDetails } = require("../../lib/middleware");

router.get("/getEnrolledCourses", isAuthenticated, isStudent, getUserProfileDetails, (req, res) => {
    courseStudentCtrl
        .getEnrolledCourses(req.userProfile)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

module.exports = router;