const db = require('../../db')
const { get_total_cost_of_all_orders } = require('../../sql/sqlScript')

// Params: none
// /restaurant/
async function getTotalCostOfOrder(params) {
    const response = await db.query(get_total_cost_of_all_orders, [startDate, endDate])
    const { rows, rowCount } = response
    return {
        count: rowCount,
        totalCosts: rows
    }
}

module.exports.get = getTotalCostOfOrder;