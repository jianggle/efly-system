class CustomException extends Error {
  constructor(message = 'sth error', code = -1, status = 400) {
    super()
    this.message = message
    this.code = code
    this.status = status
  }
}

const isCustomException = function (err) {
  return err instanceof CustomException
}

module.exports = {
  CustomException,
  isCustomException
}
