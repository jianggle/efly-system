const BaseModel = require('@app/utils/db_orm')

class CategoryModel extends BaseModel {
  constructor() {
    super('mp_sign_category')
  }
}

class RecordModel extends BaseModel {
  constructor() {
    super('mp_sign_record')
  }

  // 方法来自 https://www.jianshu.com/p/30f8d6ed6f3a
  async getContinueDays(catId) {
    const result = await this.query(`
      SELECT count(1) FROM (
        SELECT date_sub(a.sign_time, INTERVAL 1 DAY) AS signDate, @i := DATE_ADD(@i, INTERVAL -1 DAY) AS today
        FROM (
          SELECT sign_time FROM ${this.table} WHERE cat_id=${catId} ORDER BY sign_time DESC
        ) a
          INNER JOIN (
            SELECT @i := max(sign_time) AS signMax FROM ${this.table}
            WHERE cat_id=${catId} AND (TO_DAYS(sign_time) = TO_DAYS(curdate()) OR TO_DAYS(sign_time) = TO_DAYS(DATE_ADD(curdate(), INTERVAL -1 DAY)))
          ) b
        WHERE b.signMax IS NOT NULL AND TO_DAYS(DATE_ADD(@i, INTERVAL -1 DAY)) = TO_DAYS(date_sub(a.sign_time, INTERVAL 1 DAY))
      ) c;
    `)
    return result[0]['count(1)']
  }
}

module.exports = {
  SignCategoryModel: new CategoryModel(),
  SignRecordModel: new RecordModel()
}
