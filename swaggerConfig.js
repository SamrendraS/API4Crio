module.exports = {
  swaggerOptions: {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "XMeme Express API with Swagger",
        version: "1.0.0",
        description:
          "This is a simple CRUD API for XMeme made with Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "Samrendra Kumar Singh",
          email: "samrendrakumarsingh01@gmail.com",
        },
      },
      servers: [
        {
          url: "http://localhost:8081",

          description: "Local server",
        },
        {
          url: "https://app-dev.herokuapp.com/api/v1",
          description: "DEV Env",
        },
      ],
    },
    apis: ["./routes/memes.js"],
  },
};
