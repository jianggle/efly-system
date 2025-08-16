import LogModel from '#model/sys_log_login.js'
import { getUserIp } from '#utils/index.js'
import uaParser from 'ua-parser-js'
import axios from 'axios'
import * as cheerio from 'cheerio'
import md5 from 'blueimp-md5'

const getIpLocation = (ip) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://ip.tool.chinaz.com/${ip}`)
      .then((res) => {
        if (res.status !== 200) {
          reject(res.status)
        } else {
          const $ = cheerio.load(res.data)
          const place = $('.WhoIpWrap .WhwtdWrap span.Whwtdhalf em').text()
          resolve(place || '')
        }
      })
      .catch((error) => {
        reject(error)
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
      loginLocation: ipInfo,
      ua: ua.ua,
      browser: ua.browser.name + ' ' + ua.browser.version,
      os: ua.os.name + ' ' + ua.os.version,
    }
  }
}

export const saveLoginLog = async function (ctx, token) {
  const info = await getClientInfo(ctx)
  const { insertId } = await LogModel.create({
    userName: ctx.request.body.username,
    msg: '登录成功',
    status: 0,
    token: md5(token),
    loginTime: new Date(),
    ...info,
  })
  return insertId
}
