var express = require("express");
var router = express.Router();
const { statusCode } = require("../../lib/constant");
const { getAllStudents, getAllInstructors, grantAccess, registerInstructor, registerStudent, updateUser, blockUser, unblockUser, resendCredentials, getAllCourses} = require("../../controllers/admin/index");
const { isAuthenticated, isAdmin, isAdminOrInstructor } = require("../../lib/middleware");



router.get("/getAllStudents", isAuthenticated, isAdminOrInstructor, (req, res) => {
    getAllStudents()
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.get("/getAllInstructors", isAuthenticated, isAdmin, (req, res) => {
    getAllInstructors()
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.post("/student/grantAccess", isAuthenticated, isAdmin, (req, res) => {
    grantAccess(req.body)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.post("/instructor/register", isAuthenticated, isAdmin, (req, res) => {
    registerInstructor(req.body)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.post("/student/register", isAuthenticated, isAdmin, (req, res) => {
    registerStudent(req.body)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.post("/user/update", isAuthenticated, isAdmin, (req, res) => {
    updateUser(req.body)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.post("/user/block", isAuthenticated, isAdmin, (req, res) => {
    blockUser(req.body)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.post("/user/unblock", isAuthenticated, isAdmin, (req, res) => {
    unblockUser(req.body)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.post("/user/resend", isAuthenticated, isAdmin, (req, res) => {
    resendCredentials(req.body)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.get("/getAllCourses", isAuthenticated, isAdmin, (req, res) => {
    getAllCourses()
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

module.exports = router;