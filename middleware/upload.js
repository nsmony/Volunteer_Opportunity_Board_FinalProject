const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  // Generated name: the original filename is never trusted or reused.
  filename: (req, file, cb) => {
    const ext = file.mimetype === 'image/png' ? '.png' : '.jpg';
    cb(null, crypto.randomBytes(16).toString('hex') + ext);
  }
});

const uploader = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) return cb(null, true);
    cb(new Error('INVALID_TYPE'));
  }
}).single('image');

// Wraps multer so upload problems become a message the form can show
// (req.uploadError) instead of crashing the request.
function upload(req, res, next) {
  uploader(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') req.uploadError = 'Image must be 2 MB or smaller.';
      else if (err.message === 'INVALID_TYPE') req.uploadError = 'Image must be a JPEG or PNG file.';
      else return next(err);
    }
    next();
  });
}

// Deletes a stored upload (used on replace, delete and failed validation).
function removeFile(filename) {
  if (!filename) return;
  fs.unlink(path.join(UPLOAD_DIR, path.basename(filename)), () => {});
}

module.exports = upload;
module.exports.removeFile = removeFile;