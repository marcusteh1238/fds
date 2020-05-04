const db = require('../../db')
const { get_total_cost_of_completed_Order_by_restaurants_id } = require('../../sql/sqlScript')

// Params: none
// /restaurant/
async function getTotalCostOfOrderImpl(params) {
    const response = await db.query(get_total_cost_of_completed_Order_by_restaurants_id, [rid, startDate, endDate])
    const { rows, rowCount } = response
    return {
        count: rowCount,
        totalCosts: rows
    }
}

module.exports.get = getTotalCostOfOrderImpl;