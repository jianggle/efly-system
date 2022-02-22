const LogModel = require('@app/model/system/log')
const { getUserIp } = require('@app/utils')
const uaParser = require('ua-parser-js')
const request = require('request')
const cheerio = require('cheerio')

const getIpLocation = (ip) => {
  return new Promise((resolve, reject) => {
    request.get(`https://ip.tool.chinaz.com/${ip}`, function (error, response, body) {
      if (error) {
        reject(error)
      } else {
        if (response.statusCode !== 200) {
          reject(response.statusCode)
        } else {
          const $ = cheerio.load(body)
          const place = $('.WhoIpWrap .WhwtdWrap span.Whwtdhalf em').text()
          resolve(place || '')
        }
      }
    })
  })
}

const getClientInfo = async function (ctx) {
  let ipInfo = ''
  let userIp = getUserIp(ctx.request)
  userIp = Array.isArray(userIp) ? userIp[0] : userIp
  try {
    if (userIp) {
      ipInfo = await getIpLocation(userIp)
    }
  } catch (error) {
    console.log(error)
  } finally {
    const ua = uaParser(ctx.request.header['user-agent'])
    return {
      ipaddr: userIp,
      login_location: ipInfo,
      ua: ua.ua,
      browser: ua.browser.name + ' ' + ua.browser.version,
      os: ua.os.name + ' ' + ua.os.version,
    }
  }
}

const saveLoginLog = async function (ctx, status, error) {
  const info = await getClientInfo(ctx)
  const { insertId } = await LogModel.addLoginLog({
    user_name: ctx.request.body.username,
    msg: status === 0 ? '登录成功' : error,
    status,
    login_time: new Date(),
    ...info
  })
  return insertId
}

module.exports = {
  saveLoginLog
}
