const db = require('../../db')
const { get_customer_by_cid } = require('../../sql/sqlScript')

async function getCustomerByCid(params) {
    const { cid } = params
    const response = await db.query(get_customer_by_cid, [cid])
    const rows = response.rows

    if (rows.length === 0) {
        throw Error("Invalid customer id provided.")
    }

    return {
        customer: rows[0]
    }
}

module.exports.get = getCustomerByCid
