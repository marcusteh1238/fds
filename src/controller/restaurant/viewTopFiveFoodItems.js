const db = require('../../db')
const { get_top_5_favourite_foodItem_by_restaurants_id } = require('../../sql/sqlScript')

// Params: none
// /restaurant/
async function viewTopFiveFoodItems(params) {
    const response = await db.query(get_top_5_favourite_foodItem_by_restaurants_id, [rId])
    const { rows, rowCount } = response
    return {
        count: rowCount,
        foodItems: rows
    }
}

module.exports.get = viewTopFiveFoodItems;