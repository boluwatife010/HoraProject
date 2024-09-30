import express from 'express';
import multer from 'multer';
import path from 'path';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix); 
  }
});
const fileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true); 
  } else {
    cb(new Error('Only JPEG, JPG, and PNG images are allowed!')); 
  }
};
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, 
  fileFilter
});
export const userProfilePictureHandler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  upload.single('profilepicture')(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ message: `Server error: ${err.message}` });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({
      message: 'Profile picture uploaded successfully!',
      filePath: req.file.path,
      fileName: req.file.filename
    });
  });
};
