import fs from 'fs'
import path from 'path'
import multer from '@koa/multer'

const createFolder = (folder) => {
  try {
    fs.accessSync(folder)
  } catch (e) {
    fs.mkdirSync(folder)
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const saveFolder = './temp/'
    createFolder(saveFolder)
    cb(null, saveFolder)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = (options) => {
  return multer({
    storage,
    limits: options || {
      files: 1,
    },
  })
}

export default upload
