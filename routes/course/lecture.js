var express = require("express");
var router = express.Router();
const { createLecture, updateLecture, getAllLectures, deleteLecture } = require("../../controllers/course/lecture");
const { isAuthenticated, isInstructor, getCourseDetails, getSectionDetails, getLectureDetails } = require("../../lib/middleware");

router.post("/section/lecture/create/:courseId/:sectionId", isAuthenticated, isInstructor, getCourseDetails, getSectionDetails, (req, res) => {
    req.body.courseId = req.params.courseId;
    req.body.sectionId = req.params.sectionId;
    createLecture(req.body, req.user, req.course, req.section)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.post("/section/lecture/update/:courseId/:sectionId/:lectureId", isAuthenticated, isInstructor, getCourseDetails, getSectionDetails, getLectureDetails, (req, res) => {
    req.body.courseId = req.params.courseId;
    req.body.sectionId = req.params.sectionId;
    req.body.lectureId = req.params.lectureId;
    updateLecture(req.body, req.user, req.course, req.section, req.lecture)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.get("/getAllLectures/:courseId/:sectionId", isAuthenticated, isInstructor, getCourseDetails, getSectionDetails, (req, res) => {
    req.body.courseId = req.params.courseId;
    req.body.sectionId = req.params.sectionId;
    getAllLectures(req.user, req.course, req.section)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.delete("/section/lecture/delete/:courseId/:sectionId/:lectureId", isAuthenticated, isInstructor, getCourseDetails, getSectionDetails, getLectureDetails, (req, res) => {
    req.body.courseId = req.params.courseId;
    req.body.sectionId = req.params.sectionId;
    req.body.lectureId = req.params.lectureId;
    deleteLecture(req.user, req.course, req.section, req.lecture)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

module.exports = router;