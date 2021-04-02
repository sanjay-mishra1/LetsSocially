const { fileParser } = require("express-multipart-file-parser");
const cors = require("cors");
module.exports = [
  fileParser({
    rawBodyOptions: {
      limit: "15mb", //file size limit
    },
    busboyOptions: {
      limits: {
        fields: 20, //Number text fields allowed
      },
    },
  }),
  cors(),
];
