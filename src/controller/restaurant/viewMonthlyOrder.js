const db = require('../../db')
const { get_orders_by_date } = require('../../sql/sqlScript')

// Params: none
// /restaurant/
async function getMonthlyOrdersImpl(params) {
    const response = await db.query(get_orders_by_date, [startDate, endDate])
    const { rows, rowCount } = response
    return {
        count: rowCount,
        orders: rows
    }
}

module.exports.get = getMonthlyOrdersImpl;