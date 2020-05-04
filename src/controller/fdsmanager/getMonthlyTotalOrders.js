const db = require('../../db')
const { get_total_new_orders_for_each_month } = require('../../sql/sqlScript')

// Params: none
// /fds manager/
async function getMonthlyTotalOrderImpl(params) {
    const response = await db.query(get_total_new_orders_for_each_month, [startDate, endDate])
    const { rowCount } = response
    return {
        count: rowCount,
    }
}

module.exports.get = getMonthlyTotalOrderImpl;