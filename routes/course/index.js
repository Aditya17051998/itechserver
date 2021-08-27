var express = require("express");
var router = express.Router();
const {createCourse, updateCourse, enrollStudent, unenrollStudent, getAllStudents, deleteCourse, getAllCourses, getSingleCourse} = require("../../controllers/course/index");
const { isAuthenticated, isInstructor, getUserProfileDetails, getCourseDetails} = require("../../lib/middleware");

router.post("/create", isAuthenticated, isInstructor, getUserProfileDetails, (req, res) => {
    createCourse(req.body, req.user, req.userProfile)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.put("/update/:courseId", isAuthenticated, isInstructor, getCourseDetails, (req, res) => {
    req.body.courseId = req.params.courseId;
    updateCourse(req.body, req.user, req.course)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.post("/enroll/:courseId", isAuthenticated, isInstructor, getCourseDetails, (req, res) => {
    req.body.courseId = req.params.courseId;
    enrollStudent(req.body, req.course)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.post("/unenroll/:courseId", isAuthenticated, isInstructor, getCourseDetails, (req, res) => {
    req.body.courseId = req.params.courseId;
    unenrollStudent(req.body, req.course)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.get("/getAllStudents/:courseId", isAuthenticated, isInstructor, getCourseDetails, (req, res) => {
    req.body.courseId = req.params.courseId;
    getAllStudents(req.user, req.course)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.delete("/delete/:courseId", isAuthenticated, isInstructor, getCourseDetails, (req, res) => {
    req.body.courseId = req.params.courseId;
    deleteCourse(req.user, req.course)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.get("/getAllCourses", isAuthenticated, isInstructor, getUserProfileDetails, (req, res) => {
    getAllCourses(req.userProfile)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.get("/single/:publicKey", isAuthenticated, isInstructor, (req, res) => {
    req.body.publicKey = req.params.publicKey;
    getSingleCourse(req.user,req.params.publicKey)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

module.exports = router;