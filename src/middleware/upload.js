const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {  //cb is callback
    cb(null, "uploads/");  // null → no error. "uploads/" → save the file in the uploads folder.
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
 const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",

    "video/mp4",
    "video/webm",

    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/webm",

    "application/pdf",
    "application/zip"
];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
});