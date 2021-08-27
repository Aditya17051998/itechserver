require("dotenv").config();

const port=process.env || process.env.APP_PORT
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const passport = require("passport");
const session = require("express-session");

const swagger = require("./lib/swagger");
const mainRoute = require("./routes/index");
const authRoute = require("./routes/authentication/index");
const adminRoute = require("./routes/admin/index");
const courseRoute = require("./routes/course/index");
const sectionRoute = require("./routes/course/section");
const lectureRoute = require("./routes/course/lecture");
const assignmentRoute = require("./routes/assignment/index");
const courseStudentRoute = require("./routes/course/student");



const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });
// app.use(
//     cors({
//         origin: "http://localhost:3000",
//         credentials: true,
//         origin: true
//     })
// );
app.use(cors());
app.use(
    session({
        name: "sid",
        secret: "qwertyuiopasdfghjklzxcvbnm",
        resave: false,
        saveUninitialized: true,
        cookie: {
            SameSite: "None",
            Secure: true,
            maxAge: 60000000
        },
    })
);
app.use(cookieParser("qwertyuiopasdfghjklzxcvbnm"));
app.use(passport.initialize());
app.use(passport.session());
// app.use(function (req, res, next) {
//     req.sessionOptions.maxAge = 24 * 60 * 60 * 1000;
//     next()
// })


app.use("/", mainRoute);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swagger));
app.use("/api/authentication", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/course", courseRoute);
app.use("/api/course", sectionRoute);
app.use("/api/course", lectureRoute);
app.use("/api/course", assignmentRoute);
app.use("/api/course", courseStudentRoute);


app.listen(process.env.PORT, () => {
    console.log(`app is running at ${process.env.APP_PORT}`);
});


