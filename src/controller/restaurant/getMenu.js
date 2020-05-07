const db = require('../../db')
const { get_food_item_by_restaurants_id } = require('../../sql/sqlScript')

// /restaurant/:rid
async function getMenuImpl(params) {
    const response = await db.query(get_food_item_by_restaurants_id, [params.rid])
    const { rows, rowCount } = response
    return {
        count: rowCount,
        foodItems: rows
    }
}

module.exports.get = getMenuImpl;
