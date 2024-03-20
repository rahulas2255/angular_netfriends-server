const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log("inside multer destination");
    callback(null, "./uploads/user");
  },
  filename: (req, file, callback) => {
    console.log("inside multer filename");

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const fileFilter = (req, file, callback) => {
    console.log("inside multer filter");

  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
    return callback(
      new Error(
        "Please upload files in the following extenstions: jpeg, jpg, png",
      ),
    );
  }
};

exports.multerUserMiddleware = multer({
  storage,
  fileFilter,
});