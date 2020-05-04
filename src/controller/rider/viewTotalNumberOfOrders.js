const db = require('../../db')
const { get_total_order_delivered_by_rider } = require('../../sql/sqlScript')

// Params: none
// /rider/
async function viewTotalNumberOfOrdersImpl(params) {
    const response = await db.query(get_total_order_delivered_by_rider, [rid, startDate, endDate])
    const { rows, rowCount } = response
    return {
        count: rowCount,
        totalOrders: rows
    }
}

module.exports.get = viewTotalNumberOfOrdersImpl;