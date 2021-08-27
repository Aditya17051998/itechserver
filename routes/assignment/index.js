var express = require("express");
var router = express.Router();
const { createAssignment, updateAssignment } = require("../../controllers/assignment/index");
const { isAuthenticated, isInstructor, getCourseDetails, getSectionDetails, getAssignmentDetails } = require("../../lib/middleware");
const multer = require("multer");
const inMemoryStorage = multer.memoryStorage();
const { uploadFile } = require("../../lib/azureUpload");

const mediaFilter = (req, file, callback) => {
    if (
        file.mimetype === "application/msword" ||
        file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.mimetype === "text/html" ||
        file.mimetype === "application/pdf" ||
        file.mimetype == "application/vnd.ms-powerpoint" ||
        file.mimetype == "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
        file.mimetype === "text/csv" ||
        file.mimetype === "application/json" ||
        file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.mimetype === "application/vnd.ms-excel" ||
        file.mimetype === "text/plain" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/gif" ||
        file.mimetype == "video/mpeg" ||
        file.mimetype == "video/mp4" ||
        file.mimetype === "image/webp" ||
        file.mimetype === "audio/mpeg" ||
        file.mimetype === "audio/mp4"

    ) {
        callback(null, true);
    } else callback(new Error("Only image and video files are allowed!"), false);
};

const upload = multer({ storage: inMemoryStorage, fileFilter: mediaFilter });

router.post("/section/assignment/create/:courseId/:sectionId", upload.single("media"), isAuthenticated, isInstructor, getCourseDetails, getSectionDetails, (req, res) => {
    try {
        if (req.file != null) {
            uploadFile(req.file)
                .then((result) => {
                    if (result.status = 200) {
                        req.body.media = result.url;
                        req.body.courseId = req.params.courseId;
                        req.body.sectionId = req.params.sectionId;
                        createAssignment(req.body, req.user, req.course, req.section)
                            .then((result) => res.status(result.status).json(result))
                            .catch((error) => res.status(error.status).json(error));
                    }
                    else {
                        res.status(422).json({
                            status: 422,
                            message: result.message,
                        });
                    }
                })
                .catch((error) => {
                    res.status(422).json({
                        status: 422,
                        message: error.message,
                    });
                })
        }
        else {
            req.body.media = "";
            req.body.courseId = req.params.courseId;
            req.body.sectionId = req.params.sectionId;
            createAssignment(req.body, req.user, req.course, req.section)
                .then((result) => res.status(result.status).json(result))
                .catch((error) => res.status(error.status).json(error));
        }
    }
    catch (error) {
        res.status(422).json({
            status: 422,
            message: error.message,
        });
    }
});

router.post("/section/lecture/update/:courseId/:sectionId/:assignmentId", isAuthenticated, isInstructor, getCourseDetails, getSectionDetails, getAssignmentDetails, (req, res) => {
    req.body.courseId = req.params.courseId;
    req.body.sectionId = req.params.sectionId;
    req.body.assignmentId = req.params.assignmentId;
    updateAssignment(req.body, req.user, req.course, req.section, req.assignment)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

module.exports = router;