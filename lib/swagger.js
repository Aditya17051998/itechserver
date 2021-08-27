const swaggerJSDOC = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.1",
  info: {
    title: "APIs",
    version: "1.0.0",
    description: "API Specifications"
  },
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "sid",
      },
    },
  },
  security: [
    {
      cookieAuth: [],
    },
  ],
  servers: [
    {
      url: `${process.env.APP_PUBLIC_URL}`
    }
  ],
  tags: [
    {
      name: "Authentication",
      description: "All APIs for authentication"
    },
    {
      name: "Admin",
      description: "All APIs for admin"
    },
    {
      name: "Course",
      description: "All APIs for course"
    },
    {
      name: "Enrollment",
      description: "All APIs for enrollment in course"
    },
    {
      name: "Section",
      description: "All APIs for sections in course"
    },
    {
      name: "Lecture",
      description: "All APIs for lectures in course"
    },
    {
      name: "Assignment",
      description: "All APIs for Assignments in course"
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ["./routes/**/*.js", "./docs/*.yaml"],
};

module.exports = swaggerJSDOC(options);
