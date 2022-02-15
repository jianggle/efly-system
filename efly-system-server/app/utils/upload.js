const fs = require('fs')
const path = require('path')
const multer = require('@koa/multer')

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
  }
})

const upload = (options) => {
  return multer({
    storage,
    limits: options || {
      files: 1
    }
  })
}

module.exports = upload
