import * as fs from 'fs';
import * as path from 'path';
import { diskStorage } from 'multer';

const storage = diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'upload');
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    } catch (error) {
      console.error('Error creating upload directory:', error);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    const fileName = `${baseName}-${uniqueSuffix}${extension}`;
    cb(null, fileName);
  }
});

// const upload = multer({ storage: storage })

export { storage }