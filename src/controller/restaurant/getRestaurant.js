const db = require('../../db')
const { get_restaurant } = require('../../sql/sqlScript')

// Params: none
// /restaurant/getRestaurant/:rid
async function getRestaurantImpl(params) {
    const response = await db.query(get_restaurant, [params.rid])
    const { rows, rowCount } = response
    if (rowCount === 0) {
        throw new Error(`There is no restaurant with rid ${params.rid}.`)
    }
    return {
        restaurant: rows[0]
    }
}

module.exports.get = getRestaurantImpl;
