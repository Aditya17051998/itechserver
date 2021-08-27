var express = require("express");
var router = express.Router();
var passport = require("passport");
const { check, validationResult } = require("express-validator");
const { signUp, verifyEmail, resendVerification, recoverPassword, resetPassword, validateToken, changePassword} = require("../../controllers/authentication/index");
require("../../lib/passportAuth");
const { isAuthenticated } = require("../../lib/middleware");

router.post(
    "/signup",
    [
        check("name", "name should be at least 3 char").isLength({ min: 3 }),
        check("email", "email is required").isEmail(),
        check("password", "password must contain at least one letter, at least one number, and be longer than eight charaters").isLength({ min: 3 }).matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "i"
        )
    ], (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: errors.array()[0].msg
            });
        }
        signUp(req.body)
            .then((result) => {
                res.status(result.status).json(result);
            })
            .catch((error) => {
                res.status(error.status).json(error);
            });
    });

router.post(
    "/signin",
    [
        check("email", "email is required").isEmail(),
        check("password", "password should be at least 3 char").isLength({ min: 3 })
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            
            res.status(422).json({ status: 422, message: errors.array()[0].msg });
        } else {
            passport.authenticate("login", (err, user, info) => {
                if (err) {
                    console.log("passprt error",err);
                    return res.status(422).json(err);
                }
                if (!user) {
                    return res
                        .status(500)
                        .json({ status: 500, message: "Internal error occurred" });
                }
                req.login(user, (loginErr) => {
                    if (loginErr) {
                        return next(loginErr);
                    }
                    return res.send({
                        status: 200,
                        message: "Successfully logged in!",
                        data: user,
                    });
                });
            })(req, res);
        }
    });

router.get("/signout", (req, res) => {
    console.log(req.user);
    // res.clearCookie("sid");
    req.logout();
    req.session.destroy((err) => {
        res.json({
            message: "User signed out successfully"
        });
    });

});

router.get("/currentUser", (req, res) => {
    if (req.user) {
        res.status(200).json({ status: 200, message: "User is signed in", data: req.user });
    }
    else {
        res.status(404).json({ status: 404, message: "User is not signed in" })
    }
});

router.post("/verification/:token", (req, res) => {
    req.body.token = req.params.token;
    verifyEmail(req.body)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.post("/resendVerification", (req, res) => {
    resendVerification(req.body)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.post("/recoverPassword", (req, res) => {
    recoverPassword(req.body)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.post("/resetPassword/:token", (req, res) => {
    req.body.token = req.params.token;
    resetPassword(req.body)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.get("/validateToken/:token", (req, res) => {
    req.body.token = req.params.token;
    validateToken(req.body)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

router.post("/changePassword", isAuthenticated, (req, res) => {
    console.log(req.user);
    req.body.user = req.user;
    changePassword(req.body)
        .then((result) => res.status(result.status).json(result))
        .catch((error) => res.status(error.status).json(error));
});

module.exports = router;
