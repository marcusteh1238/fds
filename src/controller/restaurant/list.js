const db = require('../../db')
const { get_all_restaurants } = require('../../sql/sqlScript')

// Params: none
// /restaurant/
async function getAllRestaurantsImpl(params) {
    const response = await db.query(get_all_restaurants)
    const { rows, rowCount } = response
    return {
        count: rowCount,
        restaurants: rows
    }
}

module.exports.get = getAllRestaurantsImpl
