import * as fs from "fs"
import multer from "multer"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
        fs.mkdirSync('upload')
    } catch (error) {
        
    }
    cb(null, 'upload')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname
    cb(null, uniqueSuffix)
  }
})

// const upload = multer({ storage: storage })

export { storage }