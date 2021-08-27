var express = require("express");
var router = express.Router();
const { createSection, getAllSections, updateSection, deleteSection } = require("../../controllers/course/section");
const { isAuthenticated, isInstructor, getCourseDetails, getSectionDetails} = require("../../lib/middleware");

router.post("/section/create/:courseId", isAuthenticated, isInstructor, getCourseDetails, (req, res) => {
    req.body.courseId = req.params.courseId;
    createSection(req.user, req.body, req.course)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.get("/getAllSections/:courseId", isAuthenticated, isInstructor, getCourseDetails, (req, res) => {
    req.body.courseId = req.params.courseId;
    getAllSections(req.user, req.course)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.post("/section/update/:courseId/:sectionId", isAuthenticated, isInstructor, getCourseDetails, getSectionDetails, (req, res) => {
    req.body.courseId = req.params.courseId;
    req.body.sectionId = req.params.sectionId;
    updateSection(req.body, req.user, req.course, req.section)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.delete("/section/delete/:courseId/:sectionId", isAuthenticated, isInstructor, getCourseDetails, getSectionDetails, (req, res) => {
    req.body.courseId = req.params.courseId;
    req.body.sectionId = req.params.sectionId;
    deleteSection(req.user, req.course, req.section)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

module.exports = router;