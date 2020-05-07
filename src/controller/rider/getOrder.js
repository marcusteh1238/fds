const db = require('../../db')
const { get_order_by_oid } = require('../../sql/sqlScript')

/**
 * /rider/getOrder/:oid
 * @param {*} params 
 */
async function getOrder({oid}) {
    const { rows, rowCount } = await db.query(get_order_by_oid, [oid])
    if (rowCount === 0)  {
        throw new Error("Invalid oid specified.")
    }
    return {
        order: rows[0]
    }
}

module.exports.get = getOrder
